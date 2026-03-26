import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart, Home, MapPin, ArrowRight, ExternalLink,
  Coffee, Building2, Sun, Trash2,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { useFavorites } from '@/context/FavoritesContext';
import { getNormalizedVisibleProperties } from '@/data/propertiesStore';
import FavoriteButton from '@/components/FavoriteButton';
import OccupancyBadge from '@/components/OccupancyBadge';

// ─── Type config ──────────────────────────────────────────────────────────────

const TYPE_CFG = {
  apartment:   { badge: 'bg-blue-100 text-blue-700 border-blue-200',     icon: Home },
  'long-stay': { badge: 'bg-amber-100 text-amber-700 border-amber-200',  icon: Coffee },
  hotel:       { badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: Building2 },
  project:     { badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: Sun },
};

const TypeBadge = ({ type, t }) => {
  const cfg = TYPE_CFG[type] || TYPE_CFG.apartment;
  const Icon = cfg.icon;
  const labels = {
    apartment:   t('vermietung.types.apartment'),
    'long-stay': t('vermietung.types.longStay'),
    hotel:       t('vermietung.types.hotel'),
    project:     t('vermietung.types.project'),
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
      <Icon size={11} />
      {labels[type] || type}
    </span>
  );
};

// ─── Image with fallback ──────────────────────────────────────────────────────

const RentalImage = ({ src, alt, className }) => {
  const [errored, setErrored] = React.useState(false);
  return errored ? (
    <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <Home size={32} className="text-gray-300" />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setErrored(true)}
    />
  );
};

// ─── Detail URL mapping ───────────────────────────────────────────────────────

const getDetailUrl = (item) =>
  item.link || `/immobilien/${item.id || item.slug}`;

// ─── Favorite Card ────────────────────────────────────────────────────────────

const FavoriteCard = ({ item, index, t }) => {
  const image = (item.images && item.images[0]) || { url: '', alt: item.title };
  const isHotel    = item.type === 'hotel';
  const isProject  = item.type === 'project';
  const isLongStay = item.type === 'long-stay';

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
        isProject ? 'border-emerald-100 ring-1 ring-emerald-100' : 'border-gray-100'
      }`}
    >
      {/* Image */}
      <Link to={getDetailUrl(item)} className={`relative overflow-hidden block ${isProject ? 'h-56' : 'h-52'}`}>
        <RentalImage
          src={image.url}
          alt={image.alt}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Top-left type badge */}
        <div className="absolute top-3 left-3">
          <TypeBadge type={item.type} t={t} />
        </div>

        {/* Top-right favorite button */}
        <div className="absolute top-3 right-3">
          <FavoriteButton propertyId={item.id} size="md" />
        </div>

        {/* Price chip */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-sm">
            {item.price ? (
              <span className="font-bold text-sm text-gray-900">
                CHF {item.price.toLocaleString('de-CH')}
                <span className="text-gray-400 font-normal text-xs">
                  {isHotel ? t('vermietung.card.nightPrice') : `${t('vermietung.longStay.from')}${t('common.perMonth')}`}
                </span>
              </span>
            ) : (
              <span className="text-emerald-700 font-semibold text-xs">
                {t('vermietung.project.onRequest')}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <Link to={getDetailUrl(item)} className="hover:text-blue-700 transition-colors">
            <h3 className="text-base font-semibold text-gray-900 leading-snug">{item.title}</h3>
          </Link>
          <OccupancyBadge status={item.occupancy || 'frei'} />
        </div>
        <p className="text-xs text-gray-500 mb-2.5 leading-snug">{item.subtitle}</p>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
          <MapPin size={11} className="flex-shrink-0" />
          <span>{item.location}</span>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            to={getDetailUrl(item)}
            className={`w-full flex items-center justify-center gap-2 font-semibold py-3 px-4 rounded-xl transition-colors text-sm text-white ${
              isHotel    ? 'bg-indigo-600 hover:bg-indigo-700' :
              isProject  ? 'bg-emerald-600 hover:bg-emerald-700' :
              isLongStay ? 'bg-amber-500 hover:bg-amber-600' :
                           'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Details ansehen
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-24 px-4"
  >
    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
      <Heart size={36} className="text-red-300" />
    </div>
    <h2 className="text-xl font-semibold text-gray-900 mb-3">
      Noch keine Favoriten gespeichert
    </h2>
    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
      Klicken Sie auf das Herz-Symbol bei einer Immobilie, um sie hier zu speichern.
    </p>
    <Link
      to="/immobilien"
      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
    >
      Alle Immobilien ansehen
      <ArrowRight size={15} />
    </Link>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const FavoritenPage = () => {
  const { t } = useTranslation();
  const { favorites, clearFavorites } = useFavorites();

  const allItems = getNormalizedVisibleProperties();
  const favoritedItems = allItems.filter((item) => favorites.includes(item.id));

  return (
    <>
      <Helmet>
        <title>Meine Favoriten – Hans Amonn AG</title>
        <meta name="description" content="Ihre gespeicherten Favoriten bei Hans Amonn AG Immobilien." />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 py-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
                    <Heart size={18} className="text-red-500 fill-red-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Meine Favoriten
                  </h1>
                </div>
                <p className="text-gray-500 text-sm mt-1 ml-12">
                  {favoritedItems.length === 0
                    ? 'Keine gespeicherten Objekte'
                    : `${favoritedItems.length} gespeicherte${favoritedItems.length === 1 ? 's Objekt' : ' Objekte'}`}
                </p>
              </div>

              {favoritedItems.length > 0 && (
                <button
                  onClick={clearFavorites}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  Alle entfernen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 sm:px-6 py-10">
          {favoritedItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoritedItems.map((item, index) => (
                <FavoriteCard key={item.id} item={item} index={index} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritenPage;
