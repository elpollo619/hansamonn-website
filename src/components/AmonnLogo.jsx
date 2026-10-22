/**
 * AmonnLogo — SVG-based logos matching the AMONN ARCHITEKTUR brand identity.
 *
 * Variants:
 *   main          →  HANS AMONN AG
 *   immobilien    →  AMONN IMMOBILIEN
 *   architektur   →  AMONN ARCHITEKTUR
 *   team          →  AMONN TEAM
 *   default       →  AMONN (bare)
 *
 * Set like the HANS AMONN AG logo: heavy first word, regular rest, all caps, logo navy #1F497D.
 * Source Sans 3 is the site face and the closest open match to the logo's humanist letters.
 */

import React from 'react';

const NAVY = 'var(--brand-color, #1F497D)';

const VARIANTS = {
  main:         { bold: 'HANS',  light: 'AMONN AG' },
  immobilien:   { bold: 'AMONN', light: 'IMMOBILIEN' },
  architektur:  { bold: 'AMONN', light: 'ARCHITEKTUR' },
  team:         { bold: 'AMONN', light: 'TEAM' },
  default:      { bold: 'AMONN', light: null },
};

/**
 * Inline logo — used in Header, footers, page headers.
 * size: 'sm' | 'md' | 'lg' | 'xl'
 */
const AmonnLogo = ({ variant = 'main', size = 'md', color = NAVY, lightColor = null }) => {
  const { bold, light } = VARIANTS[variant] || VARIANTS.main;
  const lc = lightColor || color;

  const sizes = {
    sm:  { bold: 16, light: 16, gap: 0, tracking: '0.01em' },
    md:  { bold: 18, light: 18, gap: 0, tracking: '0.01em' },
    lg:  { bold: 28, light: 28, gap: 1, tracking: '0' },
    xl:  { bold: 43, light: 43, gap: 2, tracking: '-0.005em' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <span
      style={{
        fontFamily: '"Source Sans 3 Variable", "Source Sans 3", "Segoe UI", system-ui, sans-serif',
        fontSizeAdjust: 'none',
        letterSpacing: s.tracking,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: s.gap,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: s.bold, fontWeight: 800, color, textTransform: 'uppercase' }}>
        {bold}
      </span>
      {light && (
        <span style={{ fontSize: s.light, fontWeight: 400, color: lc, textTransform: 'uppercase', marginLeft: '0.26em' }}>
          {light}
        </span>
      )}
    </span>
  );
};

/**
 * Block logo — used as section/page headers (larger, centered or left).
 */
export const AmonnLogoBlock = ({ variant = 'main', className = '' }) => {
  const { bold, light } = VARIANTS[variant] || VARIANTS.main;

  return (
    <div
      className={className}
      style={{
        fontFamily: '"Source Sans 3 Variable", "Source Sans 3", "Segoe UI", system-ui, sans-serif',
        fontSizeAdjust: 'none',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 800, color: NAVY, textTransform: 'uppercase', letterSpacing: '0' }}>
        {bold}
      </span>
      {light && (
        <span style={{ fontSize: 28, fontWeight: 400, color: NAVY, textTransform: 'uppercase', letterSpacing: '0', marginLeft: '0.26em' }}>
          {light}
        </span>
      )}
    </div>
  );
};

export default AmonnLogo;
