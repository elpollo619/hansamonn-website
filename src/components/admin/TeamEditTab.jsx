import React, { useState } from 'react';
import { User, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const TeamEditTab = ({ isEditing }) => {
  const [teamData, setTeamData] = useState([
    {
      id: 1,
      name: 'Dr. Andreas Müller',
      position: 'Geschäftsführer & Chefarchitekt',
      education: 'ETH Zürich, Architektur',
      experience: '25+ Jahre Erfahrung',
      specialization: 'Nachhaltiges Bauen, Stadtplanung',
      description: 'Andreas leitet unser Büro mit Leidenschaft für innovative und nachhaltige Architekturlösungen.',
      imageUrl: ''
    },
    {
      id: 2,
      name: 'Sarah Weber',
      position: 'Leitende Architektin',
      education: 'EPFL Lausanne, Architektur',
      experience: '15+ Jahre Erfahrung',
      specialization: 'Wohnbau, Innenarchitektur',
      description: 'Sarah bringt kreative Visionen in unsere Wohnbauprojekte ein.',
      imageUrl: ''
    }
  ]);

  const handleTeamChange = (id, field, value) => {
    setTeamData(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleImageUpload = (type, id) => {
    toast({
      title: "🚧 Bild-Upload wird vorbereitet",
      description: "Diese Funktion wird in der nächsten Version verfügbar sein! 📸"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Team-Mitglieder bearbeiten
      </h2>
      {teamData.map((member) => (
        <div key={member.id} className="border border-gray-200 rounded-lg p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleTeamChange(member.id, 'name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                value={member.position}
                onChange={(e) => handleTeamChange(member.id, 'position', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ausbildung
              </label>
              <input
                type="text"
                value={member.education}
                onChange={(e) => handleTeamChange(member.id, 'education', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Erfahrung
              </label>
              <input
                type="text"
                value={member.experience}
                onChange={(e) => handleTeamChange(member.id, 'experience', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spezialisierung
              </label>
              <input
                type="text"
                value={member.specialization}
                onChange={(e) => handleTeamChange(member.id, 'specialization', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschreibung
              </label>
              <textarea
                value={member.description}
                onChange={(e) => handleTeamChange(member.id, 'description', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 resize-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profilbild
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                  <User size={24} className="text-gray-400" />
                </div>
                {isEditing && (
                  <Button
                    onClick={() => handleImageUpload('team', member.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Upload size={16} className="mr-2" />
                    Bild hochladen
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamEditTab;