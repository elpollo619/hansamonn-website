import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Lightbox – full-screen image gallery overlay.
 *
 * Props:
 *   images        {Array<{ url: string, alt?: string }>}  Array of image objects
 *   initialIndex  {number}   Which image to open on (0-based)
 *   onClose       {Function} Called when user closes the lightbox
 */
const Lightbox = ({ images = [], initialIndex = 0, onClose }) => {
  const [activeIndex, setActiveIndex] = React.useState(initialIndex);
  const touchStartX = useRef(null);

  const total = images.length;

  const prev = useCallback(() =>
    setActiveIndex((i) => (i - 1 + total) % total), [total]);

  const next = useCallback(() =>
    setActiveIndex((i) => (i + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  // Prevent body scroll while open (only when there are images to show)
  useEffect(() => {
    if (!images.length) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [images.length]);

  // Touch swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      delta < 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  if (!images.length) return null;

  const current = images[activeIndex];

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
          aria-label="Schließen"
        >
          <X size={22} />
        </button>

        {/* Counter */}
        <p className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-medium pointer-events-none select-none">
          {activeIndex + 1} / {total}
        </p>

        {/* Prev arrow */}
        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Image */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-[88vw] max-h-[85vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={current.url || current}
            alt={current.alt || `Bild ${activeIndex + 1}`}
            className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
            draggable={false}
          />
        </motion.div>

        {/* Next arrow */}
        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
            aria-label="Nächstes Bild"
          >
            <ChevronRight size={28} />
          </button>
        )}

        {/* Dot indicators (max 10 shown) */}
        {total > 1 && total <= 10 && (
          <div className="absolute bottom-5 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Bild ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
