import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';

const SIZE_MAP = {
  sm: { btn: 'w-7 h-7', icon: 14 },
  md: { btn: 'w-9 h-9', icon: 16 },
  lg: { btn: 'w-11 h-11', icon: 20 },
};

const FavoriteButton = ({ propertyId, size = 'md' }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(propertyId);
  const { btn, icon } = SIZE_MAP[size] || SIZE_MAP.md;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(propertyId);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      aria-label={active ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}
      className={`${btn} flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-white/60 transition-colors hover:bg-white`}
    >
      <Heart
        size={icon}
        className={`transition-colors duration-200 ${
          active ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-400'
        }`}
      />
    </motion.button>
  );
};

export default FavoriteButton;
