import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

function StarRating({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          className={n <= rating ? 'fill-[#1D3D78] text-[#1D3D78]' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.45, ease: 'easeOut' },
  }),
};

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

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-2">
            Amonn Referenzen
          </p>
          <h2 className="text-3xl font-light text-gray-900">
            Was unsere Kunden <span className="font-black">sagen</span>
          </h2>
        </div>

        {/* Mobile: horizontal scroll; Desktop: 3-column grid */}
        <div className="flex gap-px overflow-x-auto pb-4 md:overflow-visible md:grid md:grid-cols-3 md:pb-0 snap-x snap-mandatory md:snap-none bg-gray-100 border border-gray-100">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariants}
              className="flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start bg-white p-7 flex flex-col gap-4"
            >
              <StarRating rating={t.rating ?? 5} />

              <p className="text-gray-500 text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex flex-col gap-0.5 pt-3 border-t border-gray-100">
                <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                {t.role && (
                  <span className="text-xs text-gray-400">{t.role}</span>
                )}
                {t.property && (
                  <span className="text-xs text-gray-400">{t.property}</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
