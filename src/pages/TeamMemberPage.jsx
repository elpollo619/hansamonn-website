import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, GraduationCap, Award, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-6">
          {/* Back */}
          <Link
            to="/team"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Zurück zum Team
          </Link>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Photo + Quick Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-1"
            >
              <div className="bg-white overflow-hidden border border-gray-100">
                <div className="relative h-80">
                  <img
                    src={imageUrl}
                    alt={`${member.name} – ${member.position}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {Icon && (
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 flex items-center justify-center border border-gray-100">
                    <Icon size={20} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                  </div>
                )}
                </div>

                <div className="p-6">
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h1>
                  <p className="font-medium mb-4" style={{ color: 'var(--brand-color, #1D3D78)' }}>{member.position}</p>

                  <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex items-start gap-2">
                      <GraduationCap size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{member.education}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Award size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{member.experience}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Briefcase size={16} className="mt-0.5 flex-shrink-0 text-gray-400" />
                      <span>{member.specialization}</span>
                    </div>
                  </div>

                  <a href={`mailto:${member.email}`} className="block w-full">
                    <Button className="w-full brand-gradient text-white flex items-center justify-center gap-2">
                      <Mail size={16} />
                      E-Mail senden
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Bio + Detail */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white border border-gray-100 p-8 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Über {member.name.split(' ')[0]}
                </h2>
                <p className="text-gray-700 leading-relaxed text-base">
                  {member.description}
                </p>
              </div>

              <div className="bg-white border border-gray-100 p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Spezialisierung
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(member.specialization || '').split(',').map((s) => (
                    <span
                      key={s}
                      className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Prev / Next Navigation */}
          <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-8">
            {prev ? (
              <Link
                to={`/team/${prev.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="text-sm font-medium">{prev.name}</span>
              </Link>
            ) : (
              <div />
            )}
            <Link
              to="/team"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Alle Teammitglieder
            </Link>
            {next ? (
              <Link
                to={`/team/${next.slug}`}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-sm font-medium">{next.name}</span>
                <ArrowLeft size={16} className="rotate-180" />
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
