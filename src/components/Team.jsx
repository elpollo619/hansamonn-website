import React, { useState, useEffect } from 'react';
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
    <>
      <section id="team" className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6">
          {/* Team Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <TeamMember key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Team Stats */}
      <TeamStats />

      {/* Team Info Sections */}
      <TeamInfo />
    </>
  );
};

export default Team;
