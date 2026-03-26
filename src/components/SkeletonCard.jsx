import React from 'react';

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse flex flex-col">
    {/* Image area */}
    <div className="aspect-video bg-gray-200 w-full" />

    {/* Card body */}
    <div className="p-5 flex flex-col flex-1 gap-3">
      {/* Badge row */}
      <div className="flex items-center gap-2">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-14 bg-gray-100 rounded-full" />
      </div>

      {/* Title */}
      <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />

      {/* Subtitle */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full bg-gray-100 rounded" />
        <div className="h-3.5 w-5/6 bg-gray-100 rounded" />
      </div>

      {/* Location row */}
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 bg-gray-200 rounded-full" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>

      {/* Feature chips */}
      <div className="flex gap-1.5 flex-wrap">
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
        <div className="h-5 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-14 bg-gray-100 rounded-full" />
      </div>

      {/* Price */}
      <div className="h-5 w-28 bg-gray-200 rounded-lg mt-auto" />

      {/* Button */}
      <div className="h-11 w-full bg-gray-200 rounded-xl mt-1" />
    </div>
  </div>
);

export default SkeletonCard;
