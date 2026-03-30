import React, { useState, useRef, useCallback, useEffect } from 'react';

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Vorher',
  afterLabel = 'Nachher',
}) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef(null);

  const getPositionFromEvent = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 50;
    const x = clientX - rect.left;
    return Math.min(Math.max((x / rect.width) * 100, 0), 100);
  }, []);

  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onMouseMove = useCallback(
    (e) => {
      if (!dragging) return;
      setPosition(getPositionFromEvent(e.clientX));
    },
    [dragging, getPositionFromEvent]
  );

  const onMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const onTouchStart = useCallback((e) => {
    setDragging(true);
  }, []);

  const onTouchMove = useCallback(
    (e) => {
      if (!dragging) return;
      const touch = e.touches[0];
      setPosition(getPositionFromEvent(touch.clientX));
    },
    [dragging, getPositionFromEvent]
  );

  const onTouchEnd = useCallback(() => {
    setDragging(false);
  }, []);

  const onKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); setPosition(p => Math.max(0,   p - 2)); }
    if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(p => Math.min(100, p + 2)); }
    if (e.key === 'Home')       { e.preventDefault(); setPosition(0); }
    if (e.key === 'End')        { e.preventDefault(); setPosition(100); }
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [dragging, onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none"
      style={{ aspectRatio: '16/9', cursor: dragging ? 'ew-resize' : 'col-resize' }}
    >
      {/* Before image (full width, bottom layer) */}
      <img
        src={beforeImage}
        alt={beforeLabel}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="lazy"
        decoding="async"
      />

      {/* After image (clipped on the right) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Divider line */}
      <div
        className="absolute inset-y-0 z-10"
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg left-1/2 -translate-x-1/2" />

        {/* Handle circle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onKeyDown={onKeyDown}
          role="slider"
          tabIndex={0}
          aria-label="Vorher/Nachher vergleichen"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ cursor: 'ew-resize' }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gray-600">
            <path d="M6.5 4L2 10l4.5 6M13.5 4L18 10l-4.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3 z-10">
        <span className="bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-3 right-3 z-10">
        <span className="bg-black/50 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>
    </div>
  );
}
