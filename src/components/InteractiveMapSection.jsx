import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, BedDouble, Hotel, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const locations = [
  {
    id: 'kerzers',
    name: 'Kerzers',
    type: 'Long Stay',
    address: 'Kerzers, 3210',
    description: "Möblierte Zimmer im Herzen des Seelandes — Einzel- und Doppelzimmer, ab CHF 900/Mt.",
    link: '/long-stay/kerzers',
    typeIcon: BedDouble,
    color: 'bg-amber-500',
    ring: 'ring-amber-200',
    accent: 'text-amber-600',
    lat: 46.9949,
    lng: 7.1985,
  },
  {
    id: 'munchenbuchsee',
    name: 'Münchenbuchsee',
    type: 'Long Stay',
    address: 'Münchenbuchsee, 3053',
    description: 'Ruhige Lage mit guter Anbindung an Bern. Möblierte Zimmer ab CHF 750/Mt.',
    link: '/long-stay/munchenbuchsee',
    typeIcon: BedDouble,
    color: 'bg-blue-500',
    ring: 'ring-blue-200',
    accent: 'text-blue-600',
    lat: 47.0214,
    lng: 7.4484,
  },
  {
    id: 'muri',
    name: 'Muri bei Bern',
    type: 'Long Stay',
    address: 'Blümlisalpstrasse 4, 3074 Muri bei Bern',
    description: 'Komfortables Wohnen in der Agglomeration Bern. Kurz- und Langzeit möglich.',
    link: '/long-stay/muri',
    typeIcon: BedDouble,
    color: 'bg-emerald-500',
    ring: 'ring-emerald-200',
    accent: 'text-emerald-600',
    lat: 46.9261,
    lng: 7.5039,
  },
  {
    id: 'ns-hotel',
    name: "N's Hotel",
    type: 'Short Stay · Hotel',
    address: 'Kerzers, 3210',
    description: 'Boutique-Hotel mit Self Check-in. Direkt buchbar, ideal für Business & Kurzreisen.',
    link: '/ns-hotel',
    typeIcon: Hotel,
    color: 'bg-indigo-500',
    ring: 'ring-indigo-200',
    accent: 'text-indigo-600',
    lat: 47.002,
    lng: 7.199,
  },
  {
    id: 'casa-reto',
    name: 'Casa Reto',
    type: 'Ferienhaus · Tessin',
    address: 'Gordemo / Lago Maggiore',
    description: 'Privates Ferienhaus am Lago Maggiore — Garten, Naturlage, keine Verpflichtungen.',
    link: '/casa-reto',
    typeIcon: Sun,
    color: 'bg-rose-500',
    ring: 'ring-rose-200',
    accent: 'text-rose-600',
    lat: 46.0503,
    lng: 8.7026,
  },
];

// Leaflet map rendered inside a useEffect to avoid SSR issues
function LeafletMap({ activeId, onPinClick }) {
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef = React.useRef({});

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (mapInstanceRef.current) return; // already initialised

    import('leaflet').then((L) => {
      // Patch default icon URLs (Vite/Webpack asset hashing issue)
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [47.0, 7.9],
        zoom: 8,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Soft, light tile layer — CartoDB Positron (clean, minimal)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Custom zoom control bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Attribution minimal
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© <a href="https://carto.com/">CARTO</a>')
        .addTo(map);

      // Draw markers
      locations.forEach((loc) => {
        const colorMap = {
          'bg-amber-500': '#f59e0b',
          'bg-blue-500': '#3b82f6',
          'bg-emerald-500': '#10b981',
          'bg-indigo-500': '#6366f1',
          'bg-rose-500': '#f43f5e',
        };
        const hex = colorMap[loc.color] || '#64748b';

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:36px;height:36px;border-radius:50%;
            background:${hex};
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.25);
            display:flex;align-items:center;justify-content:center;
            transition:transform 0.15s;
            cursor:pointer;
          ">
            <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>
              ${loc.typeIcon === Hotel
                ? "<path d='M2 20V8l10-6 10 6v12'/><path d='M10 20v-6h4v6'/>"
                : loc.typeIcon === Sun
                  ? "<circle cx='12' cy='12' r='4'/><path d='M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l-1.41 1.41'/>"
                  : "<path d='M2 4h20v14H2z'/><path d='M12 4v14'/>"
              }
            </svg>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([loc.lat, loc.lng], { icon })
          .addTo(map)
          .on('click', () => onPinClick(loc.id));

        markersRef.current[loc.id] = marker;
      });
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pulse active marker
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const inner = el.querySelector('div');
      if (!inner) return;
      inner.style.transform = id === activeId ? 'scale(1.25)' : 'scale(1)';
      inner.style.boxShadow = id === activeId
        ? '0 0 0 6px rgba(99,102,241,0.2), 0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.25)';
    });
  }, [activeId]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-3xl overflow-hidden"
      style={{ minHeight: 380 }}
    />
  );
}

export default function InteractiveMapSection() {
  const [active, setActive] = useState(null);
  const [leafletCssLoaded, setLeafletCssLoaded] = useState(false);
  const activeLocation = locations.find((l) => l.id === active);

  // Inject Leaflet CSS once
  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setLeafletCssLoaded(true); return; }
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => setLeafletCssLoaded(true);
    document.head.appendChild(link);
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-gray-900 mb-3">Unsere Standorte</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Alle Objekte auf einem Blick — von Long Stay in der Region Bern bis zum Ferienhaus am Lago Maggiore.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-2">
            <div
              className="relative rounded-3xl border border-gray-100 overflow-hidden shadow-sm bg-gray-50"
              style={{ height: 420 }}
            >
              {leafletCssLoaded ? (
                <LeafletMap activeId={active} onPinClick={(id) => setActive(active === id ? null : id)} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">Karte wird geladen…</div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {[
                { color: 'bg-amber-500', label: 'Long Stay' },
                { color: 'bg-indigo-500', label: 'Hotel' },
                { color: 'bg-rose-500', label: 'Ferienhaus' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-2">
            <AnimatePresence mode="wait">
              {activeLocation ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className={`h-2 ${activeLocation.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{activeLocation.type}</p>
                        <h3 className="text-lg font-bold text-gray-900">{activeLocation.name}</h3>
                      </div>
                      <button
                        onClick={() => setActive(null)}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{activeLocation.address}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{activeLocation.description}</p>
                    <Link
                      to={activeLocation.link}
                      className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                    >
                      Details ansehen <ArrowRight size={13} />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
                    Klicken Sie auf einen Pin
                  </p>
                  {locations.map((loc) => {
                    const Icon = loc.typeIcon;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setActive(loc.id)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left mb-2"
                      >
                        <div className={`w-8 h-8 rounded-xl ${loc.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon size={14} className="text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{loc.name}</p>
                          <p className="text-xs text-gray-400">{loc.type}</p>
                        </div>
                        <ArrowRight size={14} className="text-gray-300 ml-auto flex-shrink-0" />
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
