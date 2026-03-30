import React from 'react';

const ProjectGallery = ({ project, onImageClick }) => {
  const gallery = project.gallery || [];
  const mainImage = gallery.find(item => item.type === 'image');
  const sideImages = gallery.filter(item => item.type === 'image').slice(1, 3);

  if (!mainImage) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-2 mb-0">
      <div className="lg:col-span-2">
        <div className="relative overflow-hidden h-80 lg:h-96 cursor-pointer group" onClick={() => onImageClick(mainImage.url)}>
          <img
            src={mainImage.url}
            alt={mainImage.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          <div className="absolute top-4 left-4 text-white px-3 py-1 text-sm font-medium" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}>
            Featured Project
          </div>
        </div>
      </div>
      <div className="grid grid-rows-2 gap-2">
        {sideImages.map((image, index) => (
          <div key={index} className="relative overflow-hidden h-38 lg:h-[11.5rem] cursor-pointer group" onClick={() => onImageClick(image.url)}>
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery;