import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, BedDouble, Hotel, Sun, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVisibleProperties } from '@/data/propertiesStore';

// ── Type → visual config ──────────────────────────────────────────────────────
const TYPE_CFG = {
  'long-stay':  { icon: BedDouble, colorHex: '#1D3D78', label: 'Long Stay' },
  'short-stay': { icon: Hotel,     colorHex: '#374151', label: 'Short Stay · Hotel' },
  ferienhaus:   { icon: Sun,       colorHex: '#6B7280', label: 'Ferienhaus' },
  apartment:    { icon: Home,      colorHex: '#1D3D78', label: 'Apartment' },
};
function getCfg(type) { return TYPE_CFG[type] || TYPE_CFG['long-stay']; }

// ── SVG paths per icon type ───────────────────────────────────────────────────
function markerSvgPath(type) {
  if (type === 'short-stay') return "<path d='M2 20V8l10-6 10 6v12'/><path d='M10 20v-6h4v6'/>";
  if (type === 'ferienhaus')  return "<circle cx='12' cy='12' r='4'/><path d='M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l-1.41 1.41'/>";
  if (type === 'apartment')   return "<path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/>";
  // long-stay (bed) default
  return "<path d='M2 4h20v14H2z'/><path d='M12 4v14'/>";
}

// ── Leaflet map ───────────────────────────────────────────────────────────────
function LeafletMap({ locations, activeId, onPinClick }) {
  const mapRef         = React.useRef(null);
  const mapInstanceRef = React.useRef(null);
  const markersRef     = React.useRef({});
  const leafletRef     = React.useRef(null);

  // Init map once
  useEffect(() => {
    if (typeof window === 'undefined' || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      leafletRef.current = L;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current, {
        center: [47.0, 7.9],
        zoom: 8,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      L.control.attribution({ position: 'bottomleft', prefix: false })
        .addAttribution('© <a href="https://carto.com/">CARTO</a>')
        .addTo(map);

      // Draw markers for initial locations
      addMarkers(L, map, locations, onPinClick);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []); // eslint-disable-line

  function addMarkers(L, map, locs, clickHandler) {
    // Clear existing markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    locs.forEach((loc) => {
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width:36px;height:36px;border-radius:50%;
          background:${loc.colorHex};
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.25);
          display:flex;align-items:center;justify-content:center;
          transition:transform 0.15s;cursor:pointer;">
          <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24'
            fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>
            ${markerSvgPath(loc.type)}
          </svg>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .on('click', () => clickHandler(loc.id));

      markersRef.current[loc.id] = marker;
    });
  }

  // Pulse active marker
  useEffect(() => {
    Object.entries(markersRef.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      if (!el) return;
      const inner = el.querySelector('div');
      if (!inner) return;
      inner.style.transform     = id === activeId ? 'scale(1.25)' : 'scale(1)';
      inner.style.boxShadow     = id === activeId
        ? '0 0 0 6px rgba(99,102,241,0.2), 0 2px 8px rgba(0,0,0,0.25)'
        : '0 2px 8px rgba(0,0,0,0.25)';
    });
  }, [activeId]);

  return (
    <div ref={mapRef} className="w-full h-full overflow-hidden" style={{ minHeight: 380 }} />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function InteractiveMapSection() {
  const [active, setActive] = useState(null);
  const [leafletCssLoaded, setLeafletCssLoaded] = useState(false);

  // Build locations dynamically from propertiesStore (only items with lat+lng)
  const locations = useMemo(() => {
    return getVisibleProperties()
      .filter((p) => p.lat && p.lng)
      .map((p) => {
        const cfg = getCfg(p.type);
        return {
          id:          p.id,
          name:        p.name,
          type:        p.type,
          typeLabel:   cfg.label,
          address:     p.address || p.location || '',
          description: p.description || '',
          link:        p.link || `/immobilien/${p.id}`,
          typeIcon:    cfg.icon,
          colorHex:    cfg.colorHex,
          lat:         p.lat,
          lng:         p.lng,
        };
      });
  }, []); // read once on mount; page reload picks up changes

  const activeLocation = locations.find((l) => l.id === active);

  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setLeafletCssLoaded(true); return; }
    const link = document.createElement('link');
    link.id   = 'leaflet-css';
    link.rel  = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.onload = () => setLeafletCssLoaded(true);
    document.head.appendChild(link);
  }, []);

  const legendItems = [
    { label: 'Long Stay' },
    { label: 'Hotel' },
    { label: 'Ferienhaus' },
    { label: 'Apartment' },
  ];

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
              className="relative border border-gray-100 overflow-hidden bg-gray-50"
              style={{ height: 420 }}
            >
              {leafletCssLoaded && locations.length > 0 ? (
                <LeafletMap
                  key={locations.map((l) => l.id).join(',')}
                  locations={locations}
                  activeId={active}
                  onPinClick={(id) => setActive(active === id ? null : id)}
                />
              ) : leafletCssLoaded ? (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  Keine Standorte mit Koordinaten gefunden.
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  Karte wird geladen…
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {legendItems.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }} />
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
                  className="bg-white border border-gray-100 overflow-hidden"
                >
                  <div className="h-2" style={{ backgroundColor: activeLocation.colorHex }} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">{activeLocation.typeLabel}</p>
                        <h3 className="text-lg font-bold text-gray-900">{activeLocation.name}</h3>
                      </div>
                      <button
                        onClick={() => setActive(null)}
                        className="p-1.5 hover:bg-gray-100 transition-colors"
                      >
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mb-3">{activeLocation.address}</p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{activeLocation.description}</p>
                    <Link
                      to={activeLocation.link}
                      className="flex items-center justify-center gap-2 text-white text-sm font-semibold py-2.5 px-4 transition-colors"
                      style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                      onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                      onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
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
                        className="w-full flex items-center gap-3 p-3 border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all duration-200 text-left mb-2"
                      >
                        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Icon size={14} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{loc.name}</p>
                          <p className="text-xs text-gray-400">{loc.typeLabel}</p>
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
