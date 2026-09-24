import React from 'react';
import { motion } from 'framer-motion';
import { Mail, GraduationCap, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLACEHOLDER_IMAGES = {
  2: 'https://images.unsplash.com/photo-1648469941040-b1c1fac2d4b2?w=600&q=80',
  3: 'https://images.unsplash.com/photo-1581093196867-ca3dba3c721b?w=600&q=80',
  4: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  5: 'https://images.unsplash.com/photo-1677272295529-e72d5f7dd97e?w=600&q=80',
  8: 'https://images.unsplash.com/photo-1506399558188-acca6f8cbf41?w=600&q=80',
  9: 'https://images.unsplash.com/photo-1591630156291-91b867f54b8c?w=600&q=80',
  10: 'https://images.unsplash.com/photo-1583737177686-bbee18dfbecd?w=600&q=80',
};

const TeamMember = ({ member, index }) => {
  const Icon = member.icon ?? null;

  const imageUrl =
    member.hasPhoto && member.photoUrl
      ? member.photoUrl
      : PLACEHOLDER_IMAGES[member.id] ||
        'https://images.unsplash.com/photo-1591630156291-91b867f54b8c?w=600&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08 }}
      viewport={{ once: true }}
      className="bg-white overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors group flex flex-col"
    >
      {/* Photo */}
      <div className="relative overflow-hidden aspect-[4/5] bg-gray-100">
        <img
          src={imageUrl}
          alt={`${member.name} – ${member.position} bei Hans Amonn AG`}
          className="w-full h-full object-cover object-[center_25%] group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/70 via-[#0B1220]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Role icon badge */}
        {Icon && (
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 flex items-center justify-center">
            <Icon size={18} style={{ color: 'var(--brand-color, #1D3D78)' }} />
          </div>
        )}

        {/* Hover overlay buttons */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
          <a
            href={`mailto:${member.email || 'office@reto-amonn.ch'}`}
            onClick={(e) => e.stopPropagation()}
            className="w-10 h-10 bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
            title={`E-Mail an ${member.name}`}
          >
            <Mail size={16} style={{ color: 'var(--brand-color, #1D3D78)' }} />
          </a>
          <Link
            to={`/team/${member.slug}`}
            className="flex-1 h-10 bg-white px-3 flex items-center justify-center gap-1.5 hover:bg-gray-100 transition-colors text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--brand-color, #1D3D78)' }}
          >
            Profil ansehen <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display uppercase text-2xl font-semibold leading-tight text-[#0F1B2D]">{member.name}</h3>
        <p className="text-xs font-semibold uppercase tracking-wider mt-1.5 mb-4" style={{ color: 'var(--brand-color, #1D3D78)' }}>{member.position}</p>

        {(member.education || member.experience) && (
          <div className="space-y-1.5 mb-4 text-xs text-gray-600">
            {member.education && (
              <div className="flex items-center gap-2">
                <GraduationCap size={13} className="flex-shrink-0 text-gray-400" />
                <span>{member.education}</span>
              </div>
            )}
            {member.experience && (
              <div className="flex items-center gap-2">
                <Award size={13} className="flex-shrink-0 text-gray-400" />
                <span>{member.experience}</span>
              </div>
            )}
          </div>
        )}

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-5">
          {member.description}
        </p>

        <Link
          to={`/team/${member.slug}`}
          className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
          style={{ color: 'var(--brand-color, #1D3D78)' }}
        >
          Profil ansehen <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

export default TeamMember;
