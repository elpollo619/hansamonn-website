const STORAGE_KEY = 'ha_recently_viewed';
const MAX_ENTRIES = 5;

/**
 * Add a property ID to the recently viewed list.
 * Keeps max MAX_ENTRIES entries, most recent first, no duplicates.
 */
export function addRecentlyViewed(id) {
  if (!id) return;
  try {
    const existing = getRecentlyViewed(null); // get all without exclusion
    const filtered = existing.filter((storedId) => storedId !== id);
    const updated = [id, ...filtered].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore localStorage errors (private browsing, quota, etc.)
  }
}

/**
 * Get recently viewed IDs, most recent first.
 * @param {string|null} excludeId — ID to exclude from the result (typically current property)
 * @returns {string[]}
 */
export function getRecentlyViewed(excludeId = null) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const ids = JSON.parse(raw);
    if (!Array.isArray(ids)) return [];
    if (excludeId === null) return ids;
    return ids.filter((id) => id !== excludeId);
  } catch {
    return [];
  }
}
