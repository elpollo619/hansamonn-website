import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Mail, Award, GraduationCap } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const TeamMember = ({ member, index }) => {
  const handleContactMember = (email) => {
    if (email) {
      window.location.href = `mailto:${email}`;
    } else {
      toast({
        title: "🚧 Diese Funktion ist noch nicht implementiert",
        description: "Aber keine Sorge! Du kannst sie in deinem nächsten Prompt anfordern! 🚀"
      });
    }
  };

  const handleLinkedInClick = () => {
    toast({
      title: "🚧 Diese Funktion ist noch nicht implementiert",
      description: "Aber keine Sorge! Du kannst sie in deinem nächsten Prompt anfordern! 🚀"
    });
  };

  const getProfileImage = () => {
    if (member.hasPhoto && member.photoUrl) {
      return (
        <img  
          alt={`${member.name} - ${member.position} bei Hans Amonn AG`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          src={member.photoUrl} />
      );
    }
    
    switch (member.id) {
      case 2: // Roberta - Administration
        return <img  alt="Professional administration workspace with organized documents and office supplies" src="https://images.unsplash.com/photo-1648469941040-b1c1fac2d4b2" />;
      case 3: // Martin - Architect
        return <img  alt="Experienced architect working with blueprints and architectural plans" src="https://images.unsplash.com/photo-1581093196867-ca3dba3c721b" />;
      case 4: // Beatriz - Architect
        return <img  alt="Female architect reviewing blueprints in a modern, sunlit office" src="https://images.unsplash.com/photo-1581093196867-ca3dba3c721b" />;
      case 5: // Jasmina Jungi - Commercial Administration
        return <img  alt="Modern and welcoming office reception desk with a computer and plants" src="https://images.unsplash.com/photo-1677272295529-e72d5f7dd97e" />;
      case 8: // Daniel - IT Support
        return <img  alt="Clean and modern IT server room with network equipment" src="https://images.unsplash.com/photo-1506399558188-acca6f8cbf41" />;
      case 10: // Rayna - Apprentice
        return <img  alt="Bright and inspiring learning environment for an apprentice draftsman" src="https://images.unsplash.com/photo-1583737177686-bbee18dfbecd" />;
      default:
        return <img  alt="Professional business workspace" src="https://images.unsplash.com/photo-1591630156291-91b867f54b8c" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-lg overflow-hidden shadow-lg hover-lift group"
    >
      <div className="relative overflow-hidden h-80">
        {getProfileImage()}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
          <member.icon size={20} className="text-blue-600" />
        </div>
        
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3">
            <button
              onClick={() => handleContactMember(member.email)}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              title={`E-Mail an ${member.name}`}
            >
              <Mail size={18} className="text-blue-600" />
            </button>
            <button
              onClick={handleLinkedInClick}
              className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
              title={`LinkedIn Profil von ${member.name}`}
            >
              <Linkedin size={18} className="text-blue-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {member.name}
        </h3>
        <p className="text-blue-600 font-medium mb-3">
          {member.position}
        </p>
        
        <div className="mb-3">
          <button
            onClick={() => handleContactMember(member.email)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
          >
            {member.email}
          </button>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <GraduationCap size={14} className="mr-2 flex-shrink-0" />
            <span>{member.education}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Award size={14} className="mr-2 flex-shrink-0" />
            <span>{member.experience}</span>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Spezialisierung:</h4>
          <p className="text-sm text-blue-600">{member.specialization}</p>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed">
          {member.description}
        </p>
      </div>
    </motion.div>
  );
};

export default TeamMember;