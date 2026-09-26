import React, { useState } from 'react';

const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .filter((w, i, a) => i === 0 || i === a.length - 1)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/**
 * MemberPortrait — team photo, or a monogram tile when no (consented) photo exists
 * or the image fails to load. Never shows stock faces for real people.
 */
export default function MemberPortrait({ member, className = '', imgClassName = '' }) {
  const [failed, setFailed] = useState(false);
  const src = member.hasPhoto !== false && member.photoUrl ? member.photoUrl : null;

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={`${member.name} – ${member.position} bei Hans Amonn AG`}
        className={`w-full h-full object-cover object-[center_25%] ${imgClassName}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${member.name} – ${member.position}`}
      className={`relative w-full h-full overflow-hidden bg-[#0F1B2D] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div aria-hidden="true" className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-[var(--brand-color,#1D3D78)] opacity-40 blur-2xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-display font-semibold text-white/90 leading-none tracking-tight text-7xl md:text-8xl ${imgClassName}`}>
          {initialsOf(member.name)}
        </span>
      </div>
      <span className="absolute left-4 bottom-4 text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
        Hans Amonn AG
      </span>
    </div>
  );
}
