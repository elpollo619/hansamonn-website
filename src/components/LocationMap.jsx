import React, { useEffect, useRef, useState } from 'react';
import { loadLeaflet, addBaseMap } from '@/lib/leaflet';

const ICONS = {
  // map pin
  pin: "<path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z'/><circle cx='12' cy='10' r='3'/>",
  // sun (holiday home)
  sun: "<circle cx='12' cy='12' r='4'/><path d='M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l-1.41 1.41'/>",
};

/** Small self-contained Leaflet map with a single navy marker (bundled Leaflet + swisstopo tiles). */
export default function LocationMap({ lat, lng, label, zoom = 13, height = 380, icon = 'pin' }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return undefined;
    let cancelled = false;
    loadLeaflet().then((L) => {
      if (cancelled || instanceRef.current || !mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [lat, lng],
        zoom,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
      });
      instanceRef.current = map;
      addBaseMap(L, map);
      const marker = L.divIcon({
        className: '',
        html: `<div style="width:36px;height:36px;border-radius:50%;background:#1F497D;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;">
          <svg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'>${ICONS[icon] || ICONS.pin}</svg>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
      L.marker([lat, lng], { icon: marker, title: label }).addTo(map);
      setReady(true);
    });
    return () => {
      cancelled = true;
      if (instanceRef.current) { instanceRef.current.remove(); instanceRef.current = null; }
    };
  }, [lat, lng, label, zoom, icon]);

  return (
    <div className="relative border border-gray-200 overflow-hidden bg-gray-50" style={{ height }}>
      <div ref={mapRef} className="w-full h-full" role="region" aria-label={`Karte: ${label}`} />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
          Karte wird geladen…
        </div>
      )}
    </div>
  );
}
