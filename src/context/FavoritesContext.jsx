import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'ha_favorites_v1';

const FavoritesContext = createContext(null);

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => loadFavorites());

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      saveFavorites(next);
      return next;
    });
  }, []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    saveFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
