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

/**
 * Base map for all object maps: the grey national map of swisstopo (Federal Office of Topography).
 * Free open government data, no API key, attribution «© swisstopo». All our objects are in Switzerland.
 * The tiles are softened with CSS (.ha-basemap in index.css) so the navy markers stand out.
 */
export function addBaseMap(L, map) {
  const url = 'https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg';
  const opts = { className: 'ha-basemap' };
  // swisstopo's Web-Mercator tiles at zoom 11 and 12 are enlarged from a small-scale map and look blurred,
  // so those two levels borrow sharper tiles from the neighbouring levels.
  // Fix the zoom range first: otherwise Leaflet clamps the view to the max zoom of the first layer added (10)
  map.setMinZoom(7);
  map.setMaxZoom(19);
  L.tileLayer(url, { ...opts, minZoom: 7, maxZoom: 10 }).addTo(map);
  L.tileLayer(url, { ...opts, minZoom: 11, maxZoom: 11, maxNativeZoom: 10 }).addTo(map);
  L.tileLayer(url, { ...opts, minZoom: 12, maxZoom: 12, minNativeZoom: 13 }).addTo(map);
  L.tileLayer(url, { ...opts, minZoom: 13, maxZoom: 19, maxNativeZoom: 18 }).addTo(map);
  L.control.zoom({ position: 'bottomright' }).addTo(map);
  L.control.attribution({ position: 'bottomleft', prefix: false })
    .addAttribution('© <a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noreferrer">swisstopo</a>')
    .addTo(map);
}
