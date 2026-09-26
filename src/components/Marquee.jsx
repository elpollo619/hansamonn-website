import React from 'react';

/**
 * Marquee — infinite horizontal scroller (21st-style, dependency-free).
 * Items are rendered twice; the track slides -50% so the loop is seamless.
 * Pauses on hover and stops entirely under prefers-reduced-motion.
 */
export default function Marquee({ items, renderItem, duration = 40, reverse = false, className = '' }) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
      }}
    >
      <div
        className="marquee-track flex w-max"
        style={{ animationDuration: `${duration}s`, animationDirection: reverse ? 'reverse' : 'normal' }}
      >
        {doubled.map((item, i) => (
          <div key={i} className="shrink-0" aria-hidden={i >= items.length ? true : undefined}>
            {renderItem(item, i % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}
