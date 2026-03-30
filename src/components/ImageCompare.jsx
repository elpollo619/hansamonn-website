import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const ImageCompare = ({ before, after, beforeAlt, afterAlt }) => {
  return (
    <div className="overflow-hidden">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={before} alt={beforeAlt} />}
        itemTwo={<ReactCompareSliderImage src={after} alt={afterAlt} />}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default ImageCompare;