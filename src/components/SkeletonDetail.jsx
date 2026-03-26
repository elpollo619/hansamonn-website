import React from 'react';

const SkeletonDetail = () => (
  <div className="animate-pulse">
    {/* Back nav bar */}
    <div className="border-b border-gray-100 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-3 flex items-center justify-between">
        <div className="h-4 w-32 bg-gray-200 rounded" />
        <div className="h-8 w-40 bg-gray-100 rounded-lg" />
      </div>
    </div>

    <div className="container mx-auto px-4 sm:px-6 max-w-6xl py-8">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-72 md:h-96">
            <div className="col-span-2 row-span-2 bg-gray-200" />
            <div className="bg-gray-200" />
            <div className="bg-gray-200" />
            <div className="bg-gray-200" />
            <div className="bg-gray-200" />
          </div>

          {/* Title block */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="h-6 w-24 bg-gray-200 rounded-full" />
              <div className="h-6 w-20 bg-gray-100 rounded-full" />
            </div>
            <div className="h-8 w-2/3 bg-gray-200 rounded-lg" />
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="flex gap-3">
              <div className="h-4 w-20 bg-gray-100 rounded" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
          </div>

          {/* Description block */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-5/6 bg-gray-100 rounded" />
            <div className="h-3.5 w-4/5 bg-gray-100 rounded" />
            <div className="h-3.5 w-full bg-gray-100 rounded" />
            <div className="h-3.5 w-2/3 bg-gray-100 rounded" />
          </div>

          {/* Features block */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="h-3.5 bg-gray-100 rounded flex-1" style={{ width: `${60 + (i % 3) * 15}%` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Price header */}
            <div className="bg-gray-200 px-6 py-5 space-y-2">
              <div className="flex gap-2">
                <div className="h-5 w-20 bg-gray-300 rounded-full" />
                <div className="h-5 w-16 bg-gray-300 rounded-full" />
              </div>
              <div className="h-8 w-36 bg-gray-300 rounded-lg" />
              <div className="h-3 w-28 bg-gray-300/70 rounded" />
            </div>

            {/* Buttons */}
            <div className="p-5 space-y-3">
              <div className="h-12 w-full bg-gray-200 rounded-xl" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
              <div className="h-10 w-full bg-gray-100 rounded-xl" />
              <div className="h-px w-full bg-gray-100 my-2" />
              <div className="h-9 w-full bg-gray-100 rounded-xl" />
              <div className="h-9 w-full bg-gray-100 rounded-xl" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
);

export default SkeletonDetail;
