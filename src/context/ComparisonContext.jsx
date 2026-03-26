import React, { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'ha_comparison_v1';

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeToStorage(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage not available — fail silently
  }
}

const ComparisonContext = createContext(null);

export function ComparisonProvider({ children }) {
  const [compared, setCompared] = useState(() => readFromStorage());

  const toggleCompare = useCallback((id) => {
    setCompared((prev) => {
      let next;
      if (prev.includes(id)) {
        next = prev.filter((x) => x !== id);
      } else if (prev.length < 3) {
        next = [...prev, id];
      } else {
        return prev; // already at max 3
      }
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearComparison = useCallback(() => {
    setCompared([]);
    writeToStorage([]);
  }, []);

  const isCompared = useCallback(
    (id) => compared.includes(id),
    [compared]
  );

  return (
    <ComparisonContext.Provider value={{ compared, toggleCompare, clearComparison, isCompared }}>
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const ctx = useContext(ComparisonContext);
  if (!ctx) throw new Error('useComparison must be used inside ComparisonProvider');
  return ctx;
}
