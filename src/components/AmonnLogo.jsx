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
 * The font is "Barlow Semi Condensed" — closest Google Fonts match to the
 * original logo typeface (geometric, semi-condensed, professional).
 */

import React from 'react';

const NAVY = '#1D3D78';

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
    sm:  { bold: 13, light: 13, gap: 0, tracking: '0.12em' },
    md:  { bold: 17, light: 17, gap: 0, tracking: '0.13em' },
    lg:  { bold: 26, light: 26, gap: 1, tracking: '0.12em' },
    xl:  { bold: 40, light: 40, gap: 2, tracking: '0.11em' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <span
      style={{
        fontFamily: '"Barlow Semi Condensed", "Jost", "Inter", sans-serif',
        letterSpacing: s.tracking,
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: s.gap,
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: s.bold, fontWeight: 700, color, textTransform: 'uppercase' }}>
        {bold}
      </span>
      {light && (
        <span style={{ fontSize: s.light, fontWeight: 400, color: lc, textTransform: 'uppercase', marginLeft: 5 }}>
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
        fontFamily: '"Barlow Semi Condensed", "Jost", sans-serif',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ fontSize: 28, fontWeight: 700, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
        {bold}
      </span>
      {light && (
        <span style={{ fontSize: 28, fontWeight: 400, color: NAVY, textTransform: 'uppercase', letterSpacing: '0.14em', marginLeft: 8 }}>
          {light}
        </span>
      )}
    </div>
  );
};

export default AmonnLogo;
