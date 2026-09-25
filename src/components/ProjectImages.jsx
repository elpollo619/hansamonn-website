import React from 'react';
import ImageCompare from './ImageCompare';

const ProjectImages = ({ project, onImageClick }) => {
  return (
    <section className="surface-warm border-t border-gray-100 py-20 md:py-24">
      <div className="container mx-auto px-6">
        <h4 className="display-heading uppercase text-3xl md:text-4xl mb-10">
          Weitere Impressionen
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {(project.gallery || []).map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={index} className="col-span-full mt-8 mb-1">
                  <h5 className="font-display uppercase text-2xl font-semibold text-[#0F1B2D]">
                    {item.title}
                  </h5>
                </div>
              );
            }
            if (item.type === 'image') {
              return (
                <div key={index} className="relative overflow-hidden aspect-[3/2] bg-gray-200 cursor-pointer group col-span-1 md:col-span-1 lg:col-span-2" onClick={() => onImageClick(item.url)}>
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B1220]/70 to-transparent px-4 pt-10 pb-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white">{item.alt}</p>
                  </div>
                </div>
              );
            }
            if (item.type === 'compare') {
              return (
                <div key={index} className="col-span-full md:col-span-1 lg:col-span-2">
                  <ImageCompare
                    before={item.before}
                    after={item.after}
                    beforeAlt={item.beforeAlt || 'Vor dem Umbau'}
                    afterAlt={item.afterAlt || 'Nach dem Umbau'}
                    beforeLabel={item.beforeLabel}
                    afterLabel={item.afterLabel}
                    caption={item.caption}
                  />
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectImages;
