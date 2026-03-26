import React from 'react';
import ImageCompare from './ImageCompare';

const ProjectImages = ({ project, onImageClick }) => {
  return (
    <div className="p-8">
      <h4 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
        Weitere Impressionen
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {(project.gallery || []).map((item, index) => {
          if (item.type === 'header') {
            return (
              <div key={index} className="col-span-full mt-6 mb-2">
                <h5 className="text-lg font-semibold text-gray-900 text-center">
                  {item.title}
                </h5>
              </div>
            );
          }
          if (item.type === 'image') {
            return (
              <div key={index} className="relative overflow-hidden h-48 rounded-lg cursor-pointer group col-span-1 md:col-span-1 lg:col-span-2" onClick={() => onImageClick(item.url)}>
                <img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-2 left-2 text-white p-2">
                  <p className="text-xs font-medium drop-shadow-md">{item.alt}</p>
                </div>
              </div>
            );
          }
          if (item.type === 'compare') {
            return (
              <div key={index} className="col-span-full">
                <ImageCompare 
                  before={item.before} 
                  after={item.after}
                  beforeAlt="Vor der Renovierung"
                  afterAlt="Nach der Renovierung"
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default ProjectImages;