import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Coffee, Building2, Sun } from 'lucide-react';
import { getRecentlyViewed } from '@/hooks/useRecentlyViewed';
import { rentalData } from '@/data/rentalData';
import { getProperties } from '@/data/propertiesStore';

// Map propertiesStore IDs to rentalData-based detail page URLs
const DETAIL_URL_MAP = {
  'kerzers-ls':        '/immobilien/long-stay-kerzers',
  'munchenbuchsee-ls': '/immobilien/long-stay-munchenbuchsee',
  'muri-ls':           '/immobilien/long-stay-muri',
  'ns-hotel':          '/immobilien/ns-hotel-kerzers',
  'casa-reto':         '/immobilien/casa-reto',
};

const TYPE_CFG = {
  apartment:   { badge: 'bg-gray-100 text-gray-600',   icon: Home,      label: 'Wohnung' },
  'long-stay': { badge: 'bg-gray-100 text-gray-600',   icon: Coffee,    label: 'Long Stay' },
  hotel:       { badge: 'bg-gray-100 text-gray-600',   icon: Building2, label: 'Hotel' },
  project:     { badge: 'bg-gray-100 text-gray-600',   icon: Sun,       label: 'Ferienhaus' },
};

function getDetailUrl(id, slug) {
  if (DETAIL_URL_MAP[id]) return DETAIL_URL_MAP[id];
  if (slug) return `/immobilien/${slug}`;
  return `/immobilien/${id}`;
}

function resolveProperties(ids) {
  const storeProps = getProperties();
  const storeTypeMap = { 'short-stay': 'hotel', ferienhaus: 'project' };

  return ids
    .map((id) => {
      // 1. Try rentalData by id (numeric) or slug
      const fromRental =
        rentalData.find((p) => String(p.id) === String(id)) ||
        rentalData.find((p) => p.slug === id);

      if (fromRental && fromRental.status !== 'hidden') {
        return {
          id: String(fromRental.id),
          slug: fromRental.slug,
          title: fromRental.title,
          location: fromRental.location,
          type: fromRental.type,
          image: fromRental.images?.[0]?.url || '',
          imageAlt: fromRental.images?.[0]?.alt || fromRental.title,
          detailUrl: getDetailUrl(String(fromRental.id), fromRental.slug),
        };
      }

      // 2. Try propertiesStore
      const fromStore = storeProps.find((p) => p.id === id);
      if (fromStore && fromStore.visible !== false) {
        const rawType = storeTypeMap[fromStore.type] || fromStore.type;
        const image = Array.isArray(fromStore.images)
          ? typeof fromStore.images[0] === 'string'
            ? fromStore.images[0]
            : fromStore.images[0]?.url || ''
          : '';
        return {
          id: fromStore.id,
          slug: fromStore.id,
          title: fromStore.name || fromStore.id,
          location: fromStore.address || fromStore.location || '',
          type: rawType,
          image,
          imageAlt: fromStore.name || fromStore.id,
          detailUrl: getDetailUrl(fromStore.id, null),
        };
      }

      return null;
    })
    .filter(Boolean);
}

const CardImage = ({ src, alt }) => {
  const [err, setErr] = useState(false);
  return err || !src ? (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
      <Home size={20} className="text-gray-300" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
      loading="lazy"
      onError={() => setErr(true)}
    />
  );
};

const RecentlyViewedSection = ({ currentId }) => {
  const ids = getRecentlyViewed(currentId ? String(currentId) : null);
  const items = resolveProperties(ids).slice(0, 4);

  if (items.length < 2) return null;

  return (
    <section className="mt-10 pt-8 border-t border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Zuletzt angesehen</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {items.map((item) => {
          const cfg = TYPE_CFG[item.type] || TYPE_CFG.apartment;
          const Icon = cfg.icon;
          return (
            <Link
              key={item.id}
              to={item.detailUrl}
              className="group flex-shrink-0 w-52 bg-white border border-gray-100 hover:border-gray-300 transition-colors overflow-hidden"
            >
              {/* Image */}
              <div className="h-32 overflow-hidden bg-gray-50">
                <CardImage src={item.image} alt={item.imageAlt} />
              </div>

              {/* Content */}
              <div className="p-3 space-y-1.5">
                {/* Type badge */}
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${cfg.badge}`}>
                  <Icon size={10} />
                  {cfg.label}
                </span>

                {/* Title */}
                <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1D3D78] transition-colors">
                  {item.title}
                </p>

                {/* Location */}
                {item.location && (
                  <p className="text-xs text-gray-400 truncate">{item.location}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RecentlyViewedSection;
