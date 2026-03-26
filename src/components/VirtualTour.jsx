import React from 'react';
import { Compass } from 'lucide-react';

/**
 * VirtualTour — renders an embedded virtual tour (Matterport, 360°, etc.).
 * Returns null when no URL is provided.
 */
export default function VirtualTour({ tourUrl }) {
  if (!tourUrl || typeof tourUrl !== 'string' || !tourUrl.trim()) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <Compass size={18} className="text-teal-500" />
        Virtueller Rundgang
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700 border border-teal-200 ml-1">
          360° Tour
        </span>
      </h2>
      <div className="relative w-full rounded-xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={tourUrl.trim()}
          title="Virtueller Rundgang"
          allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
          allowFullScreen
          className="absolute inset-0 w-full h-full rounded-xl"
          loading="lazy"
        />
      </div>
    </div>
  );
}
