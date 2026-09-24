import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const BRAND = 'var(--brand-color, #1D3D78)';

/**
 * ScrollShowcase — modern scroll-driven reveal (Container-Scroll pattern,
 * re-authored brand-aligned). A tilted frame straightens and scales up as it
 * enters the viewport, revealing a flagship project image.
 */
export default function ScrollShowcase({
  image = '/images/ns-hotel/01.jpg',
  eyebrow = 'Ausgewählte Arbeit',
  title = 'Räume, die bleiben',
  caption = 'Von der ersten Skizze bis zum fertigen Zuhause — seit 1968.',
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.4, 1]);

  return (
    <section ref={ref} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="display-heading uppercase text-4xl md:text-6xl mb-4">{title}</h2>
          <p className="text-gray-500 leading-relaxed">{caption}</p>
        </div>

        {/* Perspective stage */}
        <div style={{ perspective: '1200px' }} className="max-w-5xl mx-auto">
          <motion.div
            style={{ rotateX: rotate, scale, opacity, transformStyle: 'preserve-3d' }}
            className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xl bg-gray-100"
          >
            <div className="aspect-[16/9]">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex items-end justify-between">
              <span className="font-display uppercase text-white text-xl md:text-2xl font-semibold leading-none">
                Hans Amonn AG
              </span>
              <Link
                to="/projekte"
                className="inline-flex items-center gap-2 bg-white/95 hover:bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 transition-colors"
              >
                Alle Projekte <ArrowRight size={15} style={{ color: BRAND }} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
