import React from 'react';
import { motion } from 'framer-motion';

/**
 * BlueprintLines — an architectural elevation (Ansicht) that draws itself.
 * Pure SVG + framer-motion pathLength; used as a decorative hero overlay.
 */

const draw = (delay, duration = 1.4) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { delay, duration, ease: 'easeInOut' }, opacity: { delay, duration: 0.01 } },
});

// Building: 3 storeys + attic, 360 wide, standing on ground line y=340
const X0 = 120, X1 = 480, G = 340, FLOOR = 70;
const floors = [0, 1, 2].map((i) => G - (i + 1) * FLOOR);
const windowCols = [150, 215, 280, 345, 410];

export default function BlueprintLines({ className = '' }) {
  return (
    <svg
      viewBox="0 0 600 420"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      className={className}
      aria-hidden="true"
    >
      {/* Construction lines */}
      <motion.path d="M20 340 H580" strokeWidth="1.6" {...draw(0.1, 1.2)} />
      <motion.path d={`M${X0} 20 V400 M${X1} 20 V400`} strokeDasharray="4 6" opacity="0.5" {...draw(0.2, 1.6)} />
      <motion.path d={`M20 ${G - 3 * FLOOR - 30} H580`} strokeDasharray="4 6" opacity="0.5" {...draw(0.3, 1.6)} />

      {/* Building outline + attic */}
      <motion.path d={`M${X0} ${G} V${G - 3 * FLOOR} H${X1} V${G}`} strokeWidth="1.8" {...draw(0.6, 1.6)} />
      <motion.path d={`M${X0 + 30} ${G - 3 * FLOOR} V${G - 3 * FLOOR - 30} H${X1 - 30} V${G - 3 * FLOOR}`} {...draw(1.4, 1)} />

      {/* Floor slabs */}
      {floors.slice(0, 2).map((y, i) => (
        <motion.path key={y} d={`M${X0} ${y} H${X1}`} opacity="0.7" {...draw(1.2 + i * 0.15, 1)} />
      ))}

      {/* Windows */}
      {floors.map((y, fi) =>
        windowCols.map((x, wi) => (
          <motion.rect
            key={`${fi}-${wi}`}
            x={x}
            y={y + 18}
            width="40"
            height="38"
            {...draw(1.6 + fi * 0.2 + wi * 0.05, 0.6)}
          />
        )),
      )}

      {/* Entrance */}
      <motion.path d={`M280 ${G} V${G - 52} H320 V${G}`} strokeWidth="1.6" {...draw(2.4, 0.6)} />

      {/* Dimension lines */}
      <motion.path d={`M${X0} 372 H${X1} M${X0} 366 V378 M${X1} 366 V378`} {...draw(2.6, 0.8)} />
      <motion.path d={`M510 ${G} V${G - 3 * FLOOR} M504 ${G} H516 M504 ${G - 3 * FLOOR} H516`} {...draw(2.7, 0.8)} />
      <motion.text
        x="300" y="392" textAnchor="middle" fill="currentColor" stroke="none"
        fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="2"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 3.2 }}
      >
        12.40
      </motion.text>
      <motion.text
        x="528" y={G - 1.5 * FLOOR} fill="currentColor" stroke="none"
        fontSize="11" fontFamily="ui-monospace, monospace" letterSpacing="2"
        initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 3.3 }}
      >
        9.00
      </motion.text>
    </svg>
  );
}
