import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Marquee from '@/components/Marquee';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'fill-[#1D3D78] text-[#1D3D78]' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ t, fixedWidth }) {
  return (
    <figure
      className={`${fixedWidth ? 'w-[340px] md:w-[380px] mr-4' : ''} h-full bg-white border border-gray-200 p-7 flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between">
        <StarRating rating={t.rating ?? 5} />
        <Quote size={20} className="text-gray-200" aria-hidden="true" />
      </div>
      <blockquote className="text-gray-600 text-sm leading-relaxed flex-1">
        &ldquo;{t.text}&rdquo;
      </blockquote>
      <figcaption className="flex flex-col gap-0.5 pt-3 border-t border-gray-100">
        <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
        {t.role && <span className="text-xs text-gray-400">{t.role}</span>}
        {t.property && <span className="text-xs text-gray-400">{t.property}</span>}
      </figcaption>
    </figure>
  );
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from('testimonials')
      .select('*')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data }) => {
        setTestimonials(data ?? []);
        setLoaded(true);
      });
  }, []);

  if (!loaded || testimonials.length === 0) return null;

  // Enough reviews → auto-scrolling marquee (2 rows when there are many);
  // otherwise a static grid so a single review isn't repeated on loop.
  const useMarquee = testimonials.length >= 3;
  const half = Math.ceil(testimonials.length / 2);
  const rows = testimonials.length >= 6
    ? [testimonials.slice(0, half), testimonials.slice(half)]
    : [testimonials];

  return (
    <section className="py-24 surface-warm border-t border-gray-100 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12">
          <p className="eyebrow mb-3">Amonn Referenzen</p>
          <h2 className="display-heading uppercase text-3xl md:text-4xl">
            Was unsere Kunden sagen
          </h2>
        </div>
      </div>

      {useMarquee ? (
        <div className="space-y-4">
          {rows.map((row, r) => (
            <Marquee
              key={r}
              items={row}
              duration={Math.max(30, row.length * 9)}
              reverse={r === 1}
              renderItem={(t) => <TestimonialCard t={t} fixedWidth />}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 grid gap-4 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.45 }}
            >
              <TestimonialCard t={t} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
