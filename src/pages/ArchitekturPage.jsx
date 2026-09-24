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
import Model3DSection from '@/components/Model3DSection';
import ProjectCover from '@/components/ProjectCover';

const BRAND = 'var(--brand-color, #1D3D78)';
const HERO_IMAGE = '/images/ns-hotel/drohne-1.jpg';

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
      <BlueprintBuilding modelId="a4" />

      {/* ── Leistungen grid ─────────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="flex items-end justify-between gap-6 mb-10"
          >
            <div>
              <p className="eyebrow mb-3">Leistungen</p>
              <h2 className="display-heading uppercase text-3xl md:text-4xl">
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

      {/* ── Interaktive Modelle (A14 + A12) ─────────────────────── */}
      <Model3DSection ids={['a14']} eyebrow="N's Hotel in 3D" title="Aus unseren Plänen" className="bg-white" />

      {/* ── Projekte ─────────────────────────────────────────────── */}
      <section className="surface-warm py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.div
            {...fadeUp}
            className="flex items-end justify-between gap-6 mb-10"
          >
            <div>
              <p className="eyebrow mb-3">Referenzen</p>
              <h2 className="display-heading uppercase text-3xl md:text-4xl">
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
                    <ProjectCover
                      src={p.coverImage}
                      alt={p.title}
                      className="transition-transform duration-700 group-hover:scale-105"
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

    </div>
  );
};

export default ArchitekturPage;
