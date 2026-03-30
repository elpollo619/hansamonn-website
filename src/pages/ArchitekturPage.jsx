import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicesData } from '@/components/servicesData';
import { projectsData } from '@/data/projectsData';
import { AmonnLogoBlock } from '@/components/AmonnLogo';

const archServices = servicesData.filter((s) => s.category === 'architektur');
const featuredProjects = projectsData.slice(0, 3);

const ArchitekturPage = () => {
  return (
    <>
      <Helmet>
        <title>Architektur – Hans Amonn AG</title>
        <meta name="description" content="AMONN ARCHITEKTUR — Planung, Neubauten, Sanierungen und Projektbegleitung in der Region Bern. Seit über 55 Jahren." />
      </Helmet>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mb-6">
              <AmonnLogoBlock variant="architektur" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-none mb-6">
              Architektur mit
              <br />
              <span className="font-black">Verantwortung.</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Von der ersten Skizze bis zur Schlüsselübergabe — wir begleiten Bauvorhaben
              mit Erfahrung, Präzision und gestalterischem Anspruch. Seit über 55 Jahren
              in Muri bei Bern.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Leistungen grid ─────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-2">
                Leistungen
              </p>
              <h2 className="text-3xl font-light text-gray-900">
                Was wir <span className="font-black">anbieten</span>
              </h2>
            </div>
            <Link
              to="/leistungen"
              className="hidden md:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border-b border-gray-200 hover:border-gray-900 pb-px transition-colors"
            >
              Alle Leistungen <ArrowRight size={13} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-px bg-gray-100 border border-gray-100">
            {archServices.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/leistungen/${s.slug}`}
                  className="group block bg-white p-8 hover:bg-gray-50 transition-colors h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-[10px] font-semibold tracking-widest text-gray-300 uppercase">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                  <h3 className="text-xl font-light text-gray-900 mb-3">{s.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.shortDescription}</p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {s.features.map((f) => (
                      <span key={f} className="text-[11px] text-gray-400 border border-gray-200 px-2.5 py-1 rounded-full">
                        {f}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 md:hidden">
            <Link to="/leistungen" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border-b border-gray-200 pb-px transition-colors">
              Alle Leistungen <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Projekte ─────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-2">
                Referenzen
              </p>
              <h2 className="text-3xl font-light text-gray-900">
                Ausgewählte <span className="font-black">Projekte</span>
              </h2>
            </div>
            <Link
              to="/projekte"
              className="hidden md:inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border-b border-gray-200 hover:border-gray-900 pb-px transition-colors"
            >
              Alle Projekte <ArrowRight size={13} />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-gray-200">
            {featuredProjects.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link to={`/projekte/${p.id}`} className="group block bg-white overflow-hidden">
                  <div className="h-56 overflow-hidden">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mb-1">
                      {p.year} · {p.category}
                    </p>
                    <h3 className="text-base font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">{p.location}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 md:hidden">
            <Link to="/projekte" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 border-b border-gray-200 pb-px transition-colors">
              Alle Projekte <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-6 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-500 uppercase mb-3">
                Kontakt
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-white">
                Haben Sie ein <span className="font-black">Projekt?</span>
              </h2>
              <p className="text-gray-400 mt-2 max-w-md">
                Sprechen Sie uns an — die erste Beratung ist kostenlos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/kontakt"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-7 py-3.5 text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Beratung anfragen <ArrowRight size={14} />
              </Link>
              <Link
                to="/projekte"
                className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-7 py-3.5 text-sm font-medium hover:border-gray-400 hover:text-white transition-colors whitespace-nowrap"
              >
                Alle Projekte
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default ArchitekturPage;
