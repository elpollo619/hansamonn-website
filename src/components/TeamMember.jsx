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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white overflow-hidden border border-gray-100 hover:border-gray-300 transition-colors group"
    >
      {/* Photo */}
      <div className="relative overflow-hidden h-64">
        <img
          src={imageUrl}
          alt={`${member.name} – ${member.position} bei Hans Amonn AG`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Role icon badge */}
        {Icon && (
          <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 flex items-center justify-center">
            <Icon size={18} style={{ color: 'var(--brand-color, #1D3D78)' }} />
          </div>
        )}

        {/* Hover overlay buttons */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-3">
          <a
            href={`mailto:${member.email}`}
            onClick={(e) => e.stopPropagation()}
            className="w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
            title={`E-Mail an ${member.name}`}
          >
            <Mail size={16} style={{ color: 'var(--brand-color, #1D3D78)' }} />
          </a>
          <Link
            to={`/team/${member.slug}`}
            className="flex-1 bg-white/90 py-1.5 px-3 flex items-center justify-center gap-1 hover:bg-white transition-colors text-xs font-medium"
            style={{ color: 'var(--brand-color, #1D3D78)' }}
          >
            Profil ansehen <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-0.5">{member.name}</h3>
        <p className="font-medium text-sm mb-3" style={{ color: 'var(--brand-color, #1D3D78)' }}>{member.position}</p>

        <div className="space-y-1.5 mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <GraduationCap size={13} className="flex-shrink-0 text-gray-400" />
            <span>{member.education}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award size={13} className="flex-shrink-0 text-gray-400" />
            <span>{member.experience}</span>
          </div>
        </div>

        <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 mb-4">
          {member.description}
        </p>

        <Link
          to={`/team/${member.slug}`}
          className="inline-flex items-center gap-1 text-xs font-medium hover:gap-2 transition-all"
          style={{ color: 'var(--brand-color, #1D3D78)' }}
        >
          Profil ansehen <ArrowRight size={12} />
        </Link>
      </div>
    </motion.div>
  );
};

export default TeamMember;
