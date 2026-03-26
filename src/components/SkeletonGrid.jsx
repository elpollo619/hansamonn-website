import React from 'react';
import SkeletonCard from './SkeletonCard';

const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonGrid;
