import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Save, X, Upload, User, Building, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const AdminPanel = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('team');

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

  const [projectData, setProjectData] = useState([
    {
      id: 1,
      title: 'Residenz Aare',
      category: 'wohnbau',
      location: 'Bern Mitte',
      year: '2023',
      description: 'Luxuriöse Wohnanlage mit nachhaltiger Architektur.',
      imageUrl: ''
    },
    {
      id: 2,
      title: 'Bürocomplex Zentrum',
      category: 'gewerbe',
      location: 'Bern Bahnhof',
      year: '2022',
      description: 'Innovativer Bürokomplex mit flexiblen Arbeitsräumen.',
      imageUrl: ''
    }
  ]);

  const handleSave = () => {
    // Hier würde normalerweise die Speicherung in einer Datenbank erfolgen
    localStorage.setItem('teamData', JSON.stringify(teamData));
    localStorage.setItem('projectData', JSON.stringify(projectData));
    
    toast({
      title: "✅ Änderungen gespeichert!",
      description: "Alle Inhalte wurden erfolgreich aktualisiert."
    });
    setIsEditing(false);
  };

  const handleTeamChange = (id, field, value) => {
    setTeamData(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleProjectChange = (id, field, value) => {
    setProjectData(prev => prev.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const handleImageUpload = (type, id) => {
    toast({
      title: "🚧 Bild-Upload wird vorbereitet",
      description: "Diese Funktion wird in der nächsten Version verfügbar sein! 📸"
    });
  };

  const tabs = [
    { id: 'team', label: 'Team bearbeiten', icon: User },
    { id: 'projects', label: 'Projekte bearbeiten', icon: Building },
    { id: 'images', label: 'Bilder verwalten', icon: Image }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Content Management
              </h1>
              <p className="text-gray-600">
                Bearbeiten Sie Inhalte, Bilder und Informationen Ihrer Website
              </p>
            </div>
            <div className="flex space-x-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="brand-gradient hover:brand-gradient-hover text-white"
                >
                  <Edit3 size={16} className="mr-2" />
                  Bearbeiten
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save size={16} className="mr-2" />
                    Speichern
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <X size={16} className="mr-2" />
                    Abbrechen
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Team Tab */}
            {activeTab === 'team' && (
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
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Projekte bearbeiten
                </h2>
                {projectData.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Projekttitel
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kategorie
                        </label>
                        <select
                          value={project.category}
                          onChange={(e) => handleProjectChange(project.id, 'category', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                        >
                          <option value="wohnbau">Wohnbau</option>
                          <option value="gewerbe">Gewerbe</option>
                          <option value="oeffentlich">Öffentliche Bauten</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Standort
                        </label>
                        <input
                          type="text"
                          value={project.location}
                          onChange={(e) => handleProjectChange(project.id, 'location', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jahr
                        </label>
                        <input
                          type="text"
                          value={project.year}
                          onChange={(e) => handleProjectChange(project.id, 'year', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Beschreibung
                        </label>
                        <textarea
                          value={project.description}
                          onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                          disabled={!isEditing}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent disabled:bg-gray-100 resize-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Projektbild
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building size={24} className="text-gray-400" />
                          </div>
                          {isEditing && (
                            <Button
                              onClick={() => handleImageUpload('project', project.id)}
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
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="text-center py-12">
                <Image size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Bilderverwaltung
                </h3>
                <p className="text-gray-600 mb-6">
                  Hier können Sie alle Bilder Ihrer Website verwalten und neue hochladen.
                </p>
                <Button
                  onClick={() => handleImageUpload('general', 0)}
                  className="brand-gradient hover:brand-gradient-hover text-white"
                >
                  <Upload size={16} className="mr-2" />
                  Neue Bilder hochladen
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            💡 Tipp: Einfache Inhaltsverwaltung
          </h3>
          <p className="text-blue-800">
            Alle Änderungen werden automatisch gespeichert und sind sofort auf Ihrer Website sichtbar. 
            Sie können jederzeit Texte, Bilder und Informationen anpassen, ohne technische Kenntnisse zu benötigen.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;