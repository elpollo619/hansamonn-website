import React from 'react';
import { MapPin, Calendar, Building2, Award, Wrench, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const ProjectInfo = ({ project, onButtonClick }) => {
  
  const handleDocumentClick = () => {
    toast({
      title: "📄 Dokumente anfordern",
      description: "Für weitere Informationen zu den Plänen kontaktieren Sie uns bitte direkt. Wir helfen Ihnen gerne weiter!",
    });
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">
            {project.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-2" />
            <span>{project.location}</span>
            <Calendar size={16} className="ml-4 mr-2" />
            <span>{project.year}</span>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-sm font-medium text-blue-800 mb-2">
              🏨 Eigentümer: {project.owner}
            </p>
            <p className="text-sm text-blue-700">
              {project.category === 'hotel' ? 'Stolz präsentieren wir unser eigenes Hotel-Projekt - ein modernes Self-Check-in Hotel in Kerzers.' : 'Ein spannendes Projekt, das Tradition und Moderne vereint.'}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">
            {project.fullDescription || project.description}
          </p>

          {/* Amenities */}
          {project.amenities?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Leistungen:</h4>
              <div className="grid grid-cols-2 gap-3">
                {project.amenities.map((amenity, index) => {
                  const Icon = amenity.icon ?? null;
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      {Icon
                        ? <Icon size={16} className="text-blue-600" />
                        : <span className="w-4 h-4 rounded-full bg-blue-100 flex-shrink-0" />
                      }
                      <span className="text-sm text-gray-700">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Stats & Features */}
        <div>
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">{project.size}</div>
              <div className="text-xs text-gray-600">Gesamtfläche</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-semibold text-gray-900">{project.status}</div>
              <div className="text-xs text-gray-600">Status</div>
            </div>
          </div>

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Besonderheiten:</h4>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {project.documents && project.documents.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Projektdokumente:</h4>
              <div className="space-y-3">
                {project.documents.map((doc, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800">{doc.title}</p>
                      <p className="text-xs text-gray-500">{doc.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleDocumentClick}>
                      <Download size={16} className="text-blue-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distances */}
          {project.distances && project.distances.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Entfernungen:</h4>
              <div className="space-y-2">
                {project.distances.map((distance, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{distance.location}</span>
                    <span className="text-gray-900 font-medium">{distance.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.category === 'hotel' ? (
            <Button asChild className="brand-gradient hover:brand-gradient-hover text-white w-full">
              <Link to="/ns-hotel">Hotel Details ansehen</Link>
            </Button>
          ) : (
            <Button
              onClick={onButtonClick}
              className="brand-gradient hover:brand-gradient-hover text-white w-full"
            >
              Projekt anfragen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;