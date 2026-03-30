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
    <section id="team" className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">Hans Amonn AG</p>
          <h2 className="text-4xl font-light text-gray-900">
            Unser <span className="font-black">Team</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-xl">
            Lernen Sie die Fachkräfte der Hans Amonn AG kennen — mit Erfahrung und Engagement für Ihre Projekte.
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