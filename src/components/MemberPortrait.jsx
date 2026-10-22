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
      className={`relative w-full h-full overflow-hidden bg-[#E6ECF5] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(31,73,125,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(31,73,125,.18) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-display font-semibold text-[#1F497D] leading-none tracking-tight text-4xl md:text-5xl ${imgClassName}`}>
          {initialsOf(member.name)}
        </span>
      </div>
    </div>
  );
}
