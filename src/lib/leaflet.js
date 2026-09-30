import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

let pending = null;

/**
 * Loads Leaflet and its stylesheet from our own bundle (no third-party CDN),
 * and points the default marker icons at the bundled images.
 */
export function loadLeaflet() {
  if (!pending) {
    pending = Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(([mod]) => {
      const L = mod.default ?? mod;
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });
      return L;
    });
  }
  return pending;
}
