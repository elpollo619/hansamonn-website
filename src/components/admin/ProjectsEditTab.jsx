import React, { useState } from 'react';
import { Building, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ProjectsEditTab = ({ isEditing }) => {
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

  return (
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
  );
};

export default ProjectsEditTab;