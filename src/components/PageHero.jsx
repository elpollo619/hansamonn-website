import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

/**
 * PageHero – shared page header for all inner pages.
 *
 * With `image`  → dark, full-bleed photo with Ken Burns zoom and gradient.
 * Without image → light warm surface with large display heading.
 *
 * Props:
 *   eyebrow   {string}     small uppercase kicker above the title
 *   title     {ReactNode}  main heading (rendered as h1, uppercase display font)
 *   subtitle  {ReactNode}  lead paragraph
 *   image     {string}     optional background photo
 *   back      {{to, label}} optional back link above the eyebrow
 *   size      {'lg'|'md'|'sm'}  vertical size (image variant: lg = 78vh)
 *   align     {'left'|'center'}
 *   children  actions (buttons, filters) rendered under the subtitle
 *   overlay   optional decorative layer rendered above the photo, below the text
 */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
  image,
  back,
  size = 'md',
  align = 'left',
  overlay,
  children,
}) {
  const dark = Boolean(image);
  const centered = align === 'center';

  const pad = {
    lg: dark ? 'min-h-[78vh] pt-32 pb-16' : 'pt-24 pb-20 md:pt-32 md:pb-24',
    md: dark ? 'min-h-[56vh] pt-32 pb-14' : 'pt-16 pb-14 md:pt-24 md:pb-20',
    sm: dark ? 'min-h-[40vh] pt-28 pb-12' : 'pt-12 pb-10 md:pt-16 md:pb-14',
  }[size];

  const titleSize = {
    lg: 'text-[2.6rem] sm:text-5xl md:text-7xl lg:text-8xl',
    md: 'text-[2.6rem] sm:text-5xl md:text-6xl lg:text-7xl',
    sm: 'text-4xl md:text-5xl',
  }[size];

  return (
    <section
      className={`relative overflow-hidden flex items-end ${pad} ${
        dark ? 'bg-[#0B1220] text-white' : 'surface-warm border-b border-gray-100'
      }`}
    >
      {dark && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center kenburns"
            style={{ backgroundImage: `url(${image})` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/55 to-[#0B1220]/15" />
        </>
      )}
      {overlay}

      <div className="relative container mx-auto px-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={centered ? 'max-w-3xl mx-auto text-center' : 'max-w-3xl'}
        >
          {back && (
            <Link
              to={back.to}
              className={`inline-flex items-center gap-1.5 text-sm mb-6 transition-colors ${
                dark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <ChevronLeft size={15} /> {back.label}
            </Link>
          )}
          {eyebrow && (
            <p
              className={`text-[11px] font-semibold tracking-hairline uppercase mb-4 ${
                dark ? 'text-white/70' : 'text-gray-400'
              }`}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className={`font-display uppercase font-semibold leading-[0.92] break-words hyphens-auto ${titleSize} ${
              dark ? 'text-white' : 'text-[#0F1B2D]'
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`mt-6 text-lg md:text-xl leading-relaxed max-w-2xl ${centered ? 'mx-auto' : ''} ${
                dark ? 'text-white/80' : 'text-gray-600'
              }`}
            >
              {subtitle}
            </p>
          )}
          {children && (
            <div className={`mt-8 flex flex-wrap gap-3 ${centered ? 'justify-center' : ''}`}>
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
