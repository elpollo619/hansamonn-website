import React, { useState } from 'react';

/**
 * ProjectCover — project photo, or a blueprint-style tile when there is no
 * photo yet (or it fails to load). Fills its parent.
 */
export default function ProjectCover({ src, alt = '', label, className = '' }) {
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div role="img" aria-label={alt} className="relative w-full h-full min-h-[inherit] overflow-hidden bg-[#10244a]">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(rgba(156,192,255,.45) 1px, transparent 1px), linear-gradient(90deg, rgba(156,192,255,.45) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Simple elevation drawing */}
      <svg
        aria-hidden="true"
        viewBox="0 0 400 240"
        preserveAspectRatio="xMidYMid meet"
        className={`absolute inset-x-[12%] top-[14%] bottom-[22%] w-[76%] h-[64%] text-[#cfe0ff] ${className}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M20 220 H380" strokeOpacity=".9" />
        <path d="M60 220 V92 L150 40 L240 92 V220" />
        <path d="M240 220 V110 H350 V220" />
        <path d="M60 92 H240 M240 150 H350" strokeOpacity=".5" />
        {[80, 120, 170, 205].map((x) => (
          <rect key={x} x={x} y="112" width="18" height="30" strokeOpacity=".75" />
        ))}
        {[80, 120, 170, 205].map((x) => (
          <rect key={`b${x}`} x={x} y="165" width="18" height="30" strokeOpacity=".75" />
        ))}
        {[258, 290, 322].map((x) => (
          <rect key={x} x={x} y="165" width="16" height="30" strokeOpacity=".75" />
        ))}
        <rect x="136" y="180" width="28" height="40" strokeOpacity=".9" />
        <path d="M20 232 H380 M20 228 V236 M380 228 V236" strokeOpacity=".45" />
      </svg>
      <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#cfe0ff]/70">
          {label || 'Bilder folgen'}
        </span>
        <span className="font-mono text-[10px] text-[#cfe0ff]/50">M 1:100</span>
      </div>
    </div>
  );
}
