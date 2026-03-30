import React from 'react';
import { MapPin, Calendar, Building2, Award, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const ProjectInfo = ({ project, onButtonClick }) => {

  const handleDocumentClick = () => {
    toast({
      title: "Dokumente anfordern",
      description: "Für weitere Informationen zu den Plänen kontaktieren Sie uns bitte direkt.",
    });
  };

  return (
    <div className="p-8 lg:p-12">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h3 className="text-3xl font-light text-gray-900 mb-2">
            {project.title}
          </h3>
          <div className="flex items-center text-gray-500 mb-4 gap-4 text-sm">
            <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gray-400" />{project.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gray-400" />{project.year}</span>
          </div>

          <div className="bg-gray-50 border border-gray-100 p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Eigentümer: {project.owner}</p>
            <p className="text-sm text-gray-500">
              {project.category === 'hotel'
                ? 'Stolz präsentieren wir unser eigenes Hotel-Projekt — ein modernes Self-Check-in Hotel in Kerzers.'
                : 'Ein spannendes Projekt, das Tradition und Moderne vereint.'}
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
                    <div key={index} className="flex items-center gap-2">
                      {Icon
                        ? <Icon size={15} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                        : <span className="w-3 h-3 border border-gray-300 flex-shrink-0" />
                      }
                      <span className="text-sm text-gray-700">{amenity.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-gray-50 border border-gray-100">
              <Building2 className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
              <div className="text-sm font-semibold text-gray-900">{project.size}</div>
              <div className="text-xs text-gray-500">Gesamtfläche</div>
            </div>
            <div className="text-center p-4 bg-gray-50 border border-gray-100">
              <Award className="w-6 h-6 mx-auto mb-2" style={{ color: 'var(--brand-color, #1D3D78)' }} />
              <div className="text-sm font-semibold text-gray-900">{project.status}</div>
              <div className="text-xs text-gray-500">Status</div>
            </div>
          </div>

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Besonderheiten:</h4>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-100 text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {project.documents?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Projektdokumente:</h4>
              <div className="space-y-3">
                {project.documents.map((doc, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-100 p-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{doc.title}</p>
                      <p className="text-xs text-gray-500">{doc.description}</p>
                    </div>
                    <button onClick={handleDocumentClick} className="p-2 hover:bg-gray-100 transition-colors">
                      <Download size={16} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distances */}
          {project.distances?.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Entfernungen:</h4>
              <div className="space-y-2">
                {project.distances.map((distance, index) => (
                  <div key={index} className="flex justify-between text-sm border-b border-gray-50 pb-1.5">
                    <span className="text-gray-500">{distance.location}</span>
                    <span className="text-gray-900 font-medium">{distance.distance}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.category === 'hotel' ? (
            <Link
              to="/ns-hotel"
              className="flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 w-full transition-colors text-sm"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
              onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
            >
              Hotel Details ansehen
            </Link>
          ) : (
            <button
              onClick={onButtonClick}
              className="flex items-center justify-center gap-2 text-white font-semibold py-3 px-6 w-full transition-colors text-sm"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
              onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
            >
              Projekt anfragen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
