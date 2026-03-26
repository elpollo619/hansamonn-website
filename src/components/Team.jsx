import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getVisibleTeam } from '@/data/teamStore';
import TeamMember from '@/components/TeamMember';
import TeamStats from '@/components/TeamStats';
import TeamInfo from '@/components/TeamInfo';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState(() => getVisibleTeam());

  useEffect(() => {
    setTeamMembers(getVisibleTeam());
  }, []);

  return (
    <section id="team" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-gray-900">
            Unser <span className="font-bold gradient-text">Team</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lernen Sie die talentierten Fachkräfte der Hans Amonn AG kennen, die mit Leidenschaft
            und Fachwissen Ihre Bau- und Immobilienprojekte erfolgreich umsetzen.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <TeamMember key={member.id} member={member} index={index} />
          ))}
        </div>

        {/* Team Stats */}
        <TeamStats />

        {/* Team Info Sections */}
        <TeamInfo />
      </div>
    </section>
  );
};

export default Team;