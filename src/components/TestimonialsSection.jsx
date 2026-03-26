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
          className={n <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
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
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Was unsere Kunden sagen
          </h2>
        </div>

        {/* Mobile: horizontal scroll; Desktop: 3-column grid */}
        <div className="flex gap-5 overflow-x-auto pb-4 md:overflow-visible md:grid md:grid-cols-3 md:pb-0 snap-x snap-mandatory md:snap-none">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardVariants}
              className="flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
            >
              <StarRating rating={t.rating ?? 5} />

              <p className="text-gray-600 italic text-sm leading-relaxed flex-1">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex flex-col gap-1 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 text-sm">{t.name}</span>
                  {t.role && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                      {t.role}
                    </span>
                  )}
                </div>
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
