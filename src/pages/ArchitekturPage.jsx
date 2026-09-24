import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';
import { projectsData } from '@/components/ProjectData';
import AmonnLogo from '@/components/AmonnLogo';
import PageHero from '@/components/PageHero';
import BlueprintLines from '@/components/BlueprintLines';
import BlueprintBuilding from '@/components/BlueprintBuilding';
import TiltCard from '@/components/TiltCard';

const BRAND = 'var(--brand-color, #1D3D78)';
const HERO_IMAGE =
  'https://storage.googleapis.com/hostinger-horizons-assets-prod/a0cb55ad-c0d2-4ee6-b587-996da266f297/3d1fb89de8fe0a9a5680ca4ecc5b8897.jpg';

const archServices = servicesData.filter((s) => s.category === 'architektur');
const featuredProjects = projectsData.slice(0, 3);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6 },
};

const ArchitekturPage = () => {
  return (
    <div className="bg-white text-gray-900">
      <Helmet>
        <title>Architektur – Hans Amonn AG</title>
        <meta name="description" content="AMONN ARCHITEKTUR — Planung, Neubauten, Sanierungen und Projektbegleitung in der Region Bern. Seit über 55 Jahren." />
      </Helmet>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <PageHero
        image={HERO_IMAGE}
        size="lg"
        eyebrow={<AmonnLogo variant="architektur" size="md" color="#fff" lightColor="rgba(255,255,255,0.75)" />}
        title={<>Architektur mit <br />Verantwortung.</>}
        subtitle="Von der ersten Skizze bis zur Schlüsselübergabe — wir begleiten Bauvorhaben mit Erfahrung, Präzision und gestalterischem Anspruch. Seit über 55 Jahren in Muri bei Bern."
        overlay={
          <BlueprintLines className="pointer-events-none absolute right-[-10%] top-20 w-[90%] opacity-25 text-blue-100 md:right-[2%] md:top-1/2 md:-translate-y-1/2 md:w-[46%] md:opacity-60" />
        }
      />

      {/* ── Vom Plan zum Gebäude (3D, scroll-driven) ─────────────── */}
      <BlueprintBuilding />

      {/* ── Leistungen grid ─────────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="flex items-end justify-between gap-6 mb-10"
          >
            <div>
              <p className="eyebrow mb-3">Leistungen</p>
              <h2 className="display-heading uppercase text-4xl md:text-5xl">
                Was wir anbieten
              </h2>
            </div>
            <Link
              to="/leistungen"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
              style={{ color: BRAND }}
            >
              Alle Leistungen <ArrowRight size={15} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {archServices.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="min-w-0"
              >
                <TiltCard className="h-full" max={5}>
                <Link
                  to={`/leistungen/${s.slug}`}
                  className="group flex flex-col bg-white border border-gray-100 hover:border-gray-300 p-8 transition-colors h-full"
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-300 group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h3 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-3 break-words hyphens-auto">{s.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{s.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {s.features.map((f) => (
                      <span key={f} className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 px-2.5 py-1">
                        {f}
                      </span>
                    ))}
                  </div>
                </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link to="/leistungen" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND }}>
              Alle Leistungen <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Projekte ─────────────────────────────────────────────── */}
      <section className="surface-warm py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="flex items-end justify-between gap-6 mb-10"
          >
            <div>
              <p className="eyebrow mb-3">Referenzen</p>
              <h2 className="display-heading uppercase text-4xl md:text-5xl">
                Ausgewählte Projekte
              </h2>
            </div>
            <Link
              to="/projekte"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
              style={{ color: BRAND }}
            >
              Alle Projekte <ArrowRight size={15} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-3">
            {featuredProjects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <TiltCard className="h-full">
                <Link
                  to={`/projekte/${p.id}`}
                  className="group block h-full bg-white border border-gray-100 hover:border-gray-300 transition-colors"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      {p.year} · {p.category}
                    </p>
                    <h3 className="font-display uppercase text-xl font-semibold text-[#0F1B2D]">
                      {p.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{p.location}</p>
                  </div>
                </Link>
                </TiltCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link to="/projekte" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: BRAND }}>
              Alle Projekte <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="text-white py-20 md:py-24" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
          >
            <div>
              <p className="text-[11px] font-semibold tracking-hairline text-white/60 uppercase mb-3">
                Kontakt
              </p>
              <h2 className="font-display uppercase text-4xl md:text-5xl font-semibold leading-none">
                Haben Sie ein Projekt?
              </h2>
              <p className="text-white/60 mt-4 max-w-md leading-relaxed">
                Sprechen Sie uns an — die erste Beratung ist kostenlos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-6 py-3 text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Beratung anfragen <ArrowRight size={15} />
              </Link>
              <Link
                to="/projekte"
                className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors whitespace-nowrap"
              >
                Alle Projekte
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ArchitekturPage;
