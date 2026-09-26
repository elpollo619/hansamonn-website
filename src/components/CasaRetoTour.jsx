import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Expand, Pause, Play } from 'lucide-react';
import Lightbox from '@/components/Lightbox';
import { CR_PLANS, CR_TOUR } from '@/data/casaReto';

const BRAND = 'var(--brand-color, #1D3D78)';
const AUTOPLAY_MS = 6000;

/**
 * CasaRetoTour — virtual walk through the house: floor plan with a hotspot per
 * room (EG / OG), the room's photos, and step-by-step navigation. Can play
 * itself as a slideshow.
 */
export default function CasaRetoTour() {
  const [stop, setStop] = useState(0);
  const [photo, setPhoto] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const current = CR_TOUR[stop];
  const [level, setLevel] = useState(current.level);

  const go = (i) => {
    const n = (i + CR_TOUR.length) % CR_TOUR.length;
    setStop(n);
    setPhoto(0);
    setLevel(CR_TOUR[n].level);
  };
  const pick = (i) => { setPlaying(false); go(i); };

  // Autoplay: step through the photos of a room, then on to the next room
  useEffect(() => {
    if (!playing) return undefined;
    const t = setTimeout(() => {
      if (photo < Math.min(current.images.length, 3) - 1) setPhoto(photo + 1);
      else go(stop + 1);
    }, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [playing, stop, photo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Warm the cache for the next room's first photo
  useEffect(() => {
    const next = CR_TOUR[(stop + 1) % CR_TOUR.length];
    const im = new Image();
    im.src = next.images[0].url;
  }, [stop]);

  const plan = CR_PLANS[level];
  const spots = useMemo(
    () => CR_TOUR.map((s, i) => ({ ...s, index: i })).filter((s) => s.spot && s.level === level),
    [level],
  );
  const image = current.images[photo];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10 items-start">
      {/* Photo + text */}
      <div className="min-w-0 lg:col-span-7 lg:order-2">
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.img
              key={image.url}
              src={image.url}
              alt={image.alt}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </AnimatePresence>
          {current.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => { setPlaying(false); setPhoto((photo - 1 + current.images.length) % current.images.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900"
                aria-label="Vorheriges Foto"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => { setPlaying(false); setPhoto((photo + 1) % current.images.length); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-gray-900"
                aria-label="Nächstes Foto"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => { setPlaying(false); setLightbox(photo); }}
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-black/55 hover:bg-black/70 text-white text-xs font-semibold px-3 py-2"
          >
            <Expand size={14} /> Vollbild
          </button>
          <span className="absolute bottom-3 left-3 bg-black/55 text-white text-xs font-semibold px-2.5 py-1.5">
            {photo + 1} / {current.images.length}
          </span>
          {playing && (
            <motion.span
              key={`${stop}-${photo}`}
              className="absolute bottom-0 left-0 h-1"
              style={{ backgroundColor: BRAND }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
            />
          )}
        </div>

        {/* Thumbnails */}
        {current.images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {current.images.map((im, i) => (
              <button
                key={im.url}
                type="button"
                onClick={() => { setPlaying(false); setPhoto(i); }}
                className={`shrink-0 w-20 h-14 overflow-hidden border-2 transition-colors ${i === photo ? 'border-[#1D3D78]' : 'border-transparent opacity-70 hover:opacity-100'}`}
                aria-label={`Foto ${i + 1}: ${im.alt}`}
              >
                <img src={im.url} alt="" loading="lazy" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <p className="text-sm text-gray-500 mb-1">
              Station {stop + 1} von {CR_TOUR.length} · {CR_PLANS[current.level].label}
            </p>
            <h3 className="font-display uppercase text-2xl md:text-3xl font-semibold text-[#0F1B2D] leading-tight">
              {current.title}
            </h3>
            <p className="text-sm font-semibold mt-1" style={{ color: BRAND }}>{current.meta}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => pick(stop - 1)}
              className="w-11 h-11 flex items-center justify-center border border-gray-200 hover:border-gray-400 text-gray-700"
              aria-label="Vorheriger Raum"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => pick(stop + 1)}
              className="h-11 px-4 inline-flex items-center gap-2 text-white text-sm font-semibold"
              style={{ backgroundColor: BRAND }}
              aria-label="Nächster Raum"
            >
              <span className="hidden sm:inline">{CR_TOUR[(stop + 1) % CR_TOUR.length].title}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl">{current.text}</p>
      </div>

      {/* Floor plan + stops */}
      <div className="min-w-0 lg:col-span-5 lg:order-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex border border-gray-200">
            {Object.entries(CR_PLANS).map(([key, p]) => (
              <button
                key={key}
                type="button"
                onClick={() => setLevel(key)}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${level === key ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`}
                style={level === key ? { backgroundColor: BRAND } : undefined}
                aria-pressed={level === key}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPlaying((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'Pause' : 'Rundgang abspielen'}
          </button>
        </div>

        <div className="relative border border-gray-200 bg-[#f8f6f1]" style={{ aspectRatio: `${plan.w} / ${plan.h}` }}>
          <img src={plan.src} alt={`Grundriss ${plan.label}`} className="absolute inset-0 w-full h-full object-contain" />
          {spots.map((s) => {
            const on = s.index === stop;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s.index)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: `${s.spot[0]}%`, top: `${s.spot[1]}%` }}
                aria-label={s.title}
                aria-current={on ? 'step' : undefined}
              >
                {on && <span className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: BRAND }} />}
                <span
                  className={`relative flex items-center justify-center rounded-full border-2 border-white shadow-md text-white text-xs font-bold transition-transform ${on ? 'w-9 h-9 scale-110' : 'w-7 h-7 group-hover:scale-110'}`}
                  style={{ backgroundColor: on ? BRAND : '#0F1B2D' }}
                >
                  {s.index + 1}
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap bg-white/95 px-2 py-0.5 text-[11px] font-semibold text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Grundriss aus den Bauplänen, beschriftet auf Italienisch (Camera = Zimmer, Doccia = Dusche, Cucina = Küche).
        </p>

        <ol className="mt-5 grid grid-cols-2 gap-x-4 border-t border-gray-100">
          {CR_TOUR.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => pick(i)}
                className={`w-full flex items-center gap-2.5 py-2.5 border-b border-gray-100 text-left text-sm transition-colors ${i === stop ? 'font-semibold text-[#0F1B2D]' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <span
                  className="w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={i === stop ? { backgroundColor: BRAND, color: '#fff' } : { backgroundColor: '#eef0f4', color: '#0F1B2D' }}
                >
                  {i + 1}
                </span>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {lightbox !== null && (
        <Lightbox images={current.images} initialIndex={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
