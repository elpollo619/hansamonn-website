import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { rentalData } from '@/data/rentalData';

// ── Type labels & colours ─────────────────────────────────────────────────────
const TYPE_CFG = {
  'long-stay': { label: 'Long Stay',       hex: '#1D3D78', bg: 'bg-gray-100',   text: 'text-gray-600'  },
  hotel:       { label: 'Short Stay',      hex: '#1D3D78', bg: 'bg-gray-100',  text: 'text-gray-600' },
  project:     { label: 'Ferienhaus',      hex: '#1D3D78', bg: 'bg-gray-100',    text: 'text-gray-600'   },
  apartment:   { label: 'Wohnung',         hex: '#1D3D78', bg: 'bg-gray-100',    text: 'text-gray-600'   },
};
function cfg(type) { return TYPE_CFG[type] || TYPE_CFG['long-stay']; }

// Resolve the detail-page link for a listing
function detailLink(item) {
  if (item.type === 'project' && item.slug === 'casa-reto') return '/casa-reto';
  if (item.type === 'hotel'   && item.slug === 'ns-hotel-kerzers') return '/ns-hotel';
  if (item.type === 'long-stay') {
    const slugMap = {
      'long-stay-kerzers':        '/long-stay/kerzers',
      'long-stay-munchenbuchsee': '/long-stay/munchenbuchsee',
      'long-stay-muri':           '/long-stay/muri',
    };
    return slugMap[item.slug] || `/immobilien/${item.slug}`;
  }
  return `/immobilien/${item.slug}`;
}

// Listings that have coordinates and are not hidden
const LISTINGS = rentalData.filter(
  (item) => item.status !== 'hidden' && item.lat != null && item.lng != null
);

// ── Leaflet map (plain, no react-leaflet) ────────────────────────────────────
function LeafletMap({ listings, activeId, onMarkerClick }) {
  const mapDivRef      = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef     = useRef({});

  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Fix default icon paths when bundled
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapDivRef.current, {
        center: [46.9, 7.8],
        zoom: 8,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>')
        .addTo(map);

      // Add markers
      listings.forEach((item) => {
        const { hex } = cfg(item.type);
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:34px;height:34px;border-radius:50%;
            background:${hex};
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.22);
            display:flex;align-items:center;justify-content:center;
            cursor:pointer;transition:transform 0.15s;">
            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24'
              fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>
              <path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z'/>
              <circle cx='12' cy='10' r='3'/>
            </svg>
          </div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([item.lat, item.lng], { icon })
          .addTo(map)
          .on('click', () => onMarkerClick(item.id));

        markersRef.current[item.id] = marker;
      });

      // Fit bounds if multiple listings
      if (listings.length > 1) {
        const bounds = L.latLngBounds(listings.map((i) => [i.lat, i.lng]));
        map.fitBounds(bounds, { padding: [60, 60] });
      } else if (listings.length === 1) {
        map.setView([listings[0].lat, listings[0].lng], 12);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersRef.current = {};
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Highlight active marker
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const inner = el.querySelector('div');
      if (!inner) return;
      const isActive = String(id) === String(activeId);
      inner.style.transform  = isActive ? 'scale(1.3)' : 'scale(1)';
      inner.style.boxShadow  = isActive
        ? '0 0 0 6px rgba(99,102,241,0.25), 0 2px 8px rgba(0,0,0,0.22)'
        : '0 2px 8px rgba(0,0,0,0.22)';
    });
  }, [activeId]);

  return (
    <div
      ref={mapDivRef}
      className="w-full h-full"
      style={{ minHeight: 460 }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function KartePage() {
  const [cssLoaded, setCssLoaded]  = useState(false);
  const [activeId, setActiveId]    = useState(null);

  // Load Leaflet CSS once
  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setCssLoaded(true); return; }
    const link    = document.createElement('link');
    link.id       = 'leaflet-css';
    link.rel      = 'stylesheet';
    link.href     = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload   = () => setCssLoaded(true);
    link.onerror  = () => setCssLoaded(true); // still render even if CDN fails
    document.head.appendChild(link);
  }, []);

  const activeListing = LISTINGS.find((l) => l.id === activeId) ?? null;

  return (
    <>
      <Helmet>
        <title>Karte – Alle Immobilien | Hans Amonn AG</title>
        <meta
          name="description"
          content="Alle Immobilien von Hans Amonn AG auf einer Karte: Long Stay in Kerzers, Münchenbuchsee und Muri bei Bern, N's Hotel und Casa Reto am Lago Maggiore."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 mb-5">
              <MapPin size={13} />
              Kartenansicht
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">
              Alle Immobilien auf der Karte
            </h1>

            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
              Von Long Stay in der Region Bern bis zum Ferienhaus am Lago Maggiore — alle
              Objekte von Hans Amonn AG auf einen Blick.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Map + sidebar */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        {LISTINGS.length === 0 ? (
          <div className="text-center py-24 text-gray-400 text-sm">
            Koordinaten werden in Kürze hinzugefügt.
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid lg:grid-cols-3 gap-8 items-start"
          >
            {/* Map card */}
            <div className="lg:col-span-2">
              <div
                className="relative border border-gray-200 overflow-hidden bg-gray-50"
                style={{ height: 500 }}
              >
                {cssLoaded ? (
                  <LeafletMap
                    listings={LISTINGS}
                    activeId={activeId}
                    onMarkerClick={(id) => setActiveId((prev) => (prev === id ? null : id))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                    Karte wird geladen…
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mt-4">
                {Object.entries(TYPE_CFG).map(([type, c]) => (
                  <div key={type} className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: c.hex }}
                    />
                    {c.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-2">
              {activeListing ? (
                /* Detail card */
                <div className="bg-white border border-gray-200 overflow-hidden">
                  {/* colour bar */}
                  <div
                    className="h-1.5"
                    style={{ background: cfg(activeListing.type).hex }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 mb-1.5 ${cfg(activeListing.type).bg} ${cfg(activeListing.type).text}`}
                        >
                          {cfg(activeListing.type).label}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 leading-snug">
                          {activeListing.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveId(null)}
                        className="p-1.5 hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 text-xs"
                        aria-label="Schliessen"
                      >
                        ✕
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mb-3">{activeListing.location}</p>

                    {activeListing.price && (
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        ab CHF {activeListing.price.toLocaleString('de-CH')}
                        <span className="font-normal text-gray-400 ml-1">{activeListing.priceLabel}</span>
                      </p>
                    )}

                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                      {activeListing.description}
                    </p>

                    <Link
                      to={detailLink(activeListing)}
                      className="flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 px-4 transition-colors"
                      style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                      onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                      onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                    >
                      Details ansehen <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              ) : (
                /* Property list */
                <div>
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">
                    Pin auf der Karte anklicken
                  </p>
                  {LISTINGS.map((item) => {
                    const c = cfg(item.type);
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveId(item.id)}
                        className="w-full flex items-center gap-3 p-3 border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left mb-2"
                      >
                        <div
                          className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0"
                        >
                          <MapPin size={14} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-400 truncate">{item.location}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 ml-auto flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}
