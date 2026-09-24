import React from 'react';

const ProjectGallery = ({ project, onImageClick }) => {
  const gallery = project.gallery || [];
  const mainImage = gallery.find(item => item.type === 'image');
  const sideImages = gallery.filter(item => item.type === 'image').slice(1, 3);

  if (!mainImage) return null;

  return (
    <div className="container mx-auto px-6 pt-12 md:pt-16">
      <div className="grid lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden h-72 md:h-96 lg:h-[30rem] cursor-pointer group bg-gray-100" onClick={() => onImageClick(mainImage.url)}>
            <img
              src={mainImage.url}
              alt={mainImage.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[#0B1220]/0 group-hover:bg-[#0B1220]/15 transition-colors"></div>
            <div className="absolute top-4 left-4 text-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
              Featured Project
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-3">
          {sideImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden h-40 md:h-48 lg:h-auto cursor-pointer group bg-gray-100" onClick={() => onImageClick(image.url)}>
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-[#0B1220]/0 group-hover:bg-[#0B1220]/15 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectGallery;
