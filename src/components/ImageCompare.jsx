import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const Chip = ({ children, side }) => (
  <span
    className={`pointer-events-none absolute top-3 ${side === 'left' ? 'left-3' : 'right-3'} bg-[#0B1220]/75 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white`}
  >
    {children}
  </span>
);

const ImageCompare = ({ before, after, beforeAlt, afterAlt, beforeLabel = 'Vorher', afterLabel = 'Nachher', caption }) => {
  return (
    <figure className="m-0">
      <div className="relative aspect-[3/2] overflow-hidden bg-gray-200">
        <ReactCompareSlider
          itemOne={<ReactCompareSliderImage src={before} alt={beforeAlt} />}
          itemTwo={<ReactCompareSliderImage src={after} alt={afterAlt} />}
          style={{ height: '100%', width: '100%' }}
        />
        <Chip side="left">{beforeLabel}</Chip>
        <Chip side="right">{afterLabel}</Chip>
      </div>
      {caption && <figcaption className="mt-2 text-xs text-gray-600">{caption}</figcaption>}
    </figure>
  );
};

export default ImageCompare;
