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
    <div className="container mx-auto px-6 py-16 md:py-20">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="lg:col-span-7">
          <h3 className="display-heading uppercase text-4xl md:text-5xl mb-4">
            {project.title}
          </h3>
          <div className="flex flex-wrap items-center text-gray-500 mb-8 gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><MapPin size={14} style={{ color: 'var(--brand-color, #1D3D78)' }} />{project.location}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} style={{ color: 'var(--brand-color, #1D3D78)' }} />{project.year}</span>
          </div>

          <div className="surface-warm border-l-2 p-5 mb-8" style={{ borderColor: 'var(--brand-color, #1D3D78)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Eigentümer: {project.owner}</p>
            <p className="text-gray-600 leading-relaxed">
              {project.category === 'hotel'
                ? 'Stolz präsentieren wir unser eigenes Hotel-Projekt — ein modernes Self-Check-in Hotel in Kerzers.'
                : 'Ein spannendes Projekt, das Tradition und Moderne vereint.'}
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-lg mb-10">
            {project.fullDescription || project.description}
          </p>

          {/* Amenities */}
          {project.amenities?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Leistungen:</h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.amenities.map((amenity, index) => {
                  const Icon = amenity.icon ?? null;
                  return (
                    <div key={index} className="flex items-center gap-3 border border-gray-100 px-4 py-3">
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
        <div className="lg:col-span-5 lg:sticky lg:top-28 self-start">
          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-5 surface-warm border border-gray-100">
              <Building2 className="w-6 h-6 mb-4" style={{ color: 'var(--brand-color, #1D3D78)' }} />
              <div className="font-display uppercase text-xl font-semibold text-[#0F1B2D] leading-tight">{project.size}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">Gesamtfläche</div>
            </div>
            <div className="p-5 surface-warm border border-gray-100">
              <Award className="w-6 h-6 mb-4" style={{ color: 'var(--brand-color, #1D3D78)' }} />
              <div className="font-display uppercase text-xl font-semibold text-[#0F1B2D] leading-tight">{project.status}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mt-1">Status</div>
            </div>
          </div>

          {/* Features */}
          {project.features?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Besonderheiten:</h4>
              <div className="flex flex-wrap gap-2">
                {project.features.map((feature, index) => (
                  <span key={index} className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 border border-gray-200 px-2.5 py-1">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {project.documents?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Projektdokumente:</h4>
              <div className="space-y-3">
                {project.documents.map((doc, index) => (
                  <div key={index} className="bg-white border border-gray-100 hover:border-gray-300 transition-colors p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{doc.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                    </div>
                    <button onClick={handleDocumentClick} className="p-2.5 border border-gray-200 hover:bg-gray-50 transition-colors shrink-0">
                      <Download size={16} style={{ color: 'var(--brand-color, #1D3D78)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Distances */}
          {project.distances?.length > 0 && (
            <div className="mb-8">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Entfernungen:</h4>
              <div className="border-t border-gray-100">
                {project.distances.map((distance, index) => (
                  <div key={index} className="flex justify-between gap-4 text-sm border-b border-gray-100 py-2.5">
                    <span className="text-gray-500">{distance.location}</span>
                    <span className="text-gray-900 font-semibold">{distance.distance}</span>
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
