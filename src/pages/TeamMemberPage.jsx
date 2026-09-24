import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Mail, GraduationCap, Award, Briefcase } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { getMemberBySlug, getVisibleTeam } from '@/data/teamStore';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1591630156291-91b867f54b8c?w=800&q=80';

const TeamMemberPage = () => {
  const { slug } = useParams();
  const teamMembers = getVisibleTeam();
  const member = getMemberBySlug(slug);

  if (!member) {
    return <Navigate to="/team" replace />;
  }

  const imageUrl = member.photoUrl || PLACEHOLDER_IMAGE;

  const Icon = member.icon ?? null;

  // Adjacent members for prev/next navigation
  const index = teamMembers.findIndex((m) => m.slug === slug);
  const prev = index > 0 ? teamMembers[index - 1] : null;
  const next = index < teamMembers.length - 1 ? teamMembers[index + 1] : null;

  return (
    <>
      <Helmet>
        <title>{member.name} – {member.position} | Hans Amonn AG</title>
        <meta
          name="description"
          content={`${member.name}, ${member.position} bei Hans Amonn AG. ${member.description}`}
        />
      </Helmet>

      <PageHero
        eyebrow={`Hans Amonn AG · ${member.position}`}
        title={member.name}
        back={{ to: '/team', label: 'Zurück zum Team' }}
        size="sm"
      />

      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Photo + Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 min-w-0"
            >
              <div className="bg-white overflow-hidden border border-gray-100">
                <div className="relative aspect-[4/5] bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`${member.name} – ${member.position}`}
                    className="w-full h-full object-cover object-[center_25%]"
                    loading="lazy"
                    decoding="async"
                  />
                  {Icon && (
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 flex items-center justify-center">
                    <Icon size={20} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  </div>
                )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: 'var(--brand-color, #1D3D78)' }}>{member.position}</p>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    {member.education && (
                      <div className="flex items-start gap-2">
                        <GraduationCap size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span>{member.education}</span>
                      </div>
                    )}
                    {member.experience && (
                      <div className="flex items-start gap-2">
                        <Award size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span>{member.experience}</span>
                      </div>
                    )}
                    {member.specialization && (
                      <div className="flex items-start gap-2">
                        <Briefcase size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                        <span>{member.specialization}</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={`mailto:${member.email || 'office@reto-amonn.ch'}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-colors"
                    style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                    onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                    onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                  >
                    <Mail size={16} />
                    E-Mail senden
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bio + Detail */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-8 min-w-0 lg:pl-6"
            >
              <div className="mb-12">
                <p className="eyebrow mb-3">Profil</p>
                <h2 className="display-heading uppercase text-4xl md:text-5xl mb-6">
                  Über {member.name.split(' ')[0]}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl">
                  {member.description}
                </p>
              </div>

              {member.specialization && (
                <div className="border-t border-gray-100 pt-10">
                  <h2 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D] mb-5">
                    Spezialisierung
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {member.specialization.split(',').map((s) => (
                      <span
                        key={s}
                        className="surface-warm border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2"
                      >
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="mt-16 grid grid-cols-3 items-center gap-4 border-t border-gray-200 pt-8">
            {prev ? (
              <Link
                to={`/team/${prev.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors justify-self-start"
              >
                <ArrowLeft size={16} className="shrink-0" />
                <span className="text-sm font-semibold">{prev.name}</span>
              </Link>
            ) : (
              <div />
            )}
            <Link
              to="/team"
              className="justify-self-center text-center text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
            >
              Alle Teammitglieder
            </Link>
            {next ? (
              <Link
                to={`/team/${next.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors justify-self-end text-right"
              >
                <span className="text-sm font-semibold">{next.name}</span>
                <ArrowRight size={16} className="shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamMemberPage;
