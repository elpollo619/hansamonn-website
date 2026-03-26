import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Tag,
  ExternalLink,
  AlertTriangle,
  ImagePlus,
  Upload,
  MapPin,
} from 'lucide-react';
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from '@/data/propertiesStore';
import PropertyDocumentsManager from '@/components/admin/PropertyDocumentsManager';

// ─── Constants ───────────────────────────────────────────────────────────────

const TYPE_OPTIONS = [
  { value: 'long-stay', label: 'Long Stay' },
  { value: 'short-stay', label: 'Short Stay' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'ferienhaus', label: 'Ferienhaus' },
];

const STATUS_OPTIONS = [
  { value: 'frei',        label: '✓ Frei (Verfügbar)' },
  { value: 'reserviert',  label: '◷ Reserviert' },
  { value: 'vermietet',   label: '✗ Vermietet' },
  // Legacy values kept for backward compat
  { value: 'verfügbar',       label: 'Verfügbar (alt)' },
  { value: 'nicht-verfügbar', label: 'Nicht verfügbar (alt)' },
  { value: 'coming-soon',     label: 'Coming Soon (alt)' },
];

const OCCUPANCY_OPTIONS = [
  { value: 'frei',       label: '✓ Frei',       cls: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'reserviert', label: '◷ Reserviert', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'vermietet',  label: '✗ Vermietet',  cls: 'bg-gray-100 text-gray-500 border-gray-200' },
];

const PERIOD_OPTIONS = [
  { value: 'Mt.', label: 'Mt.' },
  { value: 'Nacht', label: 'Nacht' },
  { value: 'Woche', label: 'Woche' },
];

// ─── Amenity presets ─────────────────────────────────────────────────────────

const AMENITY_PRESETS = [
  { emoji: '📶', label: 'WLAN' },
  { emoji: '🧺', label: 'Waschmaschine' },
  { emoji: '🚗', label: 'Parkplatz' },
  { emoji: '🛁', label: 'Badezimmer' },
  { emoji: '🍳', label: 'Küche' },
  { emoji: '🌡️', label: 'Heizung' },
  { emoji: '❄️', label: 'Klimaanlage' },
  { emoji: '📺', label: 'TV' },
  { emoji: '🛏️', label: 'Möbliert' },
  { emoji: '🧹', label: 'Reinigung inkl.' },
  { emoji: '⚡', label: 'Strom inkl.' },
  { emoji: '💧', label: 'Wasser inkl.' },
  { emoji: '🔑', label: 'Self Check-in' },
  { emoji: '🐾', label: 'Haustiere erlaubt' },
  { emoji: '🚭', label: 'Nichtraucher' },
  { emoji: '♿', label: 'Barrierefrei' },
  { emoji: '🌿', label: 'Garten/Balkon' },
  { emoji: '☕', label: 'Kaffeemaschine' },
  { emoji: '🧊', label: 'Kühlschrank' },
  { emoji: '🔒', label: 'Schliessfach' },
  { emoji: '🚲', label: 'Fahrradstellplatz' },
  { emoji: '🏊', label: 'Pool' },
  { emoji: '🧖', label: 'Sauna' },
  { emoji: '🛗', label: 'Lift' },
  { emoji: '📦', label: 'Keller/Lager' },
  { emoji: '🚿', label: 'Dusche' },
  { emoji: '🪟', label: 'Balkon/Terrasse' },
  { emoji: '🛺', label: 'ÖV-nah' },
];

const EMPTY_FORM = {
  name: '',
  type: 'long-stay',
  address: '',
  location: '',
  description: '',
  status: 'verfügbar',
  occupancy: 'frei',
  priceFrom: '',
  priceCurrency: 'CHF',
  pricePeriod: 'Mt.',
  images: [],
  link: '',
  bookingUrl: '',
  airbnbUrl: '',
  icalUrl: '',
  videoUrl: '',
  tourUrl: '',
  contactEmail: '',
  visible: true,
  features: [],
  lat: '',
  lng: '',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const map = {
    'verfügbar':        'bg-green-100 text-green-700 border-green-200',
    'nicht-verfügbar':  'bg-red-100 text-red-700 border-red-200',
    'coming-soon':      'bg-amber-100 text-amber-700 border-amber-200',
    'frei':             'bg-green-100 text-green-700 border-green-200',
    'reserviert':       'bg-amber-100 text-amber-700 border-amber-200',
    'vermietet':        'bg-gray-100 text-gray-500 border-gray-200',
  };
  const labels = {
    'verfügbar':        'Verfügbar',
    'nicht-verfügbar':  'Nicht verfügbar',
    'coming-soon':      'Coming Soon',
    'frei':             'Frei',
    'reserviert':       'Reserviert',
    'vermietet':        'Vermietet',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {labels[status] || status}
    </span>
  );
}

function TypeBadge({ type }) {
  const map = {
    'long-stay': 'bg-blue-50 text-blue-700',
    'short-stay': 'bg-purple-50 text-purple-700',
    'apartment': 'bg-teal-50 text-teal-700',
    'ferienhaus': 'bg-orange-50 text-orange-700',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[type] || 'bg-gray-50 text-gray-600'}`}>
      {TYPE_OPTIONS.find((t) => t.value === type)?.label || type}
    </span>
  );
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

function DeleteDialog({ property, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Immobilie löschen</h3>
            <p className="text-sm text-gray-500">Diese Aktion kann nicht rückgängig gemacht werden.</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-6">
          Möchten Sie <strong>{property.name}</strong> wirklich löschen?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Löschen
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Property Form (Drawer / Modal) ──────────────────────────────────────────

function PropertyForm({ property, onSave, onClose }) {
  const isNew = !property?.id;
  const [form, setForm] = useState(() => {
    if (isNew) return { ...EMPTY_FORM };
    return {
      ...EMPTY_FORM,
      ...property,
      priceFrom: property.priceFrom ?? '',
      features: Array.isArray(property.features) ? [...property.features] : [],
      images: Array.isArray(property.images) ? [...property.images] : [],
    };
  });
  const [featureInput, setFeatureInput] = useState('');
  const [imageInput, setImageInput] = useState('');
  const fileInputRef = React.useRef(null);

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !form.features.includes(val)) {
      set('features', [...form.features, val]);
    }
    setFeatureInput('');
  };

  const removeFeature = (idx) => {
    set('features', form.features.filter((_, i) => i !== idx));
  };

  const addImage = () => {
    const val = imageInput.trim();
    if (val && !form.images.includes(val)) {
      set('images', [...form.images, val]);
    }
    setImageInput('');
  };

  const removeImage = (idx) => {
    set('images', form.images.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      if (file.size > 3 * 1024 * 1024) {
        alert(`"${file.name}" ist zu groß (max. 3 MB pro Bild).`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((f) => ({ ...f, images: [...f.images, ev.target.result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      priceFrom: form.priceFrom === '' ? null : Number(form.priceFrom),
    };
    onSave(payload);
  };

  const inputCls =
    'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition';
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-semibold text-gray-900 text-base">
            {isNew ? 'Neue Immobilie' : 'Immobilie bearbeiten'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className={labelCls}>Name *</label>
            <input
              className={inputCls}
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="z.B. Kerzers — Long Stay"
            />
          </div>

          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Typ *</label>
              <select
                className={inputCls}
                value={form.type}
                onChange={(e) => set('type', e.target.value)}
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Status *</label>
              <select
                className={inputCls}
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Verfügbarkeit (Occupancy) */}
          <div>
            <label className={labelCls}>Verfügbarkeit</label>
            <div className="flex gap-2 mt-1">
              {OCCUPANCY_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set('occupancy', o.value)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    (form.occupancy || 'frei') === o.value
                      ? `${o.cls} shadow-sm`
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {/* Address + Location */}
          <div>
            <label className={labelCls}>Adresse (für Karte)</label>
            <input
              className={inputCls}
              value={form.address || ''}
              onChange={(e) => set('address', e.target.value)}
              placeholder="z.B. Insstrasse 16, 3236 Gampelen"
            />
          </div>
          <div>
            <label className={labelCls}>Standort (Anzeige)</label>
            <input
              className={inputCls}
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="z.B. Gampelen, 3236"
            />
          </div>

          {/* Coordinates for map */}
          <div>
            <label className={labelCls}>
              <span className="flex items-center gap-1"><MapPin size={11} /> Koordinaten (für interaktive Karte)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  className={inputCls}
                  value={form.lat || ''}
                  onChange={(e) => set('lat', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Breitengrad z.B. 47.033"
                  type="number"
                  step="any"
                />
                <p className="text-xs text-gray-400 mt-1">Latitude</p>
              </div>
              <div>
                <input
                  className={inputCls}
                  value={form.lng || ''}
                  onChange={(e) => set('lng', e.target.value ? parseFloat(e.target.value) : '')}
                  placeholder="Längengrad z.B. 7.062"
                  type="number"
                  step="any"
                />
                <p className="text-xs text-gray-400 mt-1">Longitude</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              Koordinaten finden: <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Maps</a> → rechtsklick auf Adresse → Koordinaten kopieren
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Beschreibung</label>
            <textarea
              className={inputCls}
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Kurze Beschreibung der Immobilie"
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className={labelCls}>Preis ab</label>
              <input
                type="number"
                min="0"
                className={inputCls}
                value={form.priceFrom}
                onChange={(e) => set('priceFrom', e.target.value)}
                placeholder="900"
              />
            </div>
            <div>
              <label className={labelCls}>Währung</label>
              <input
                className={inputCls}
                value={form.priceCurrency}
                onChange={(e) => set('priceCurrency', e.target.value)}
                placeholder="CHF"
              />
            </div>
            <div>
              <label className={labelCls}>Periode</label>
              <select
                className={inputCls}
                value={form.pricePeriod}
                onChange={(e) => set('pricePeriod', e.target.value)}
              >
                {PERIOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ausstattung & Besonderheiten */}
          <div>
            <label className={labelCls}>Ausstattung &amp; Besonderheiten</label>

            {/* Emoji preset chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {AMENITY_PRESETS.map(({ emoji, label }) => {
                const value = `${emoji} ${label}`;
                const active = form.features.includes(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      set('features', active
                        ? form.features.filter((f) => f !== value)
                        : [...form.features, value]
                      )
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <span className="text-base leading-none">{emoji}</span>
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Custom feature input */}
            <div className="flex gap-2">
              <input
                className={inputCls}
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addFeature(); }
                }}
                placeholder="Eigenes Merkmal eingeben + Enter (z.B. 🏔️ Bergblick)"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0"
              >
                <Tag size={14} />
              </button>
            </div>

            {/* Active features summary */}
            {form.features.length > 0 && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Ausgewählt ({form.features.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {form.features.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white text-gray-700 text-xs rounded-full border border-gray-200"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-0.5"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className={labelCls}>Bilder</label>
            {/* Upload from computer */}
            <div className="mb-2 p-3 border border-dashed border-blue-200 rounded-lg bg-blue-50/50">
              <p className="text-xs text-gray-500 mb-2">Vom Computer hochladen (max. 3 MB pro Bild):</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Upload size={13} /> Fotos vom Computer wählen
              </button>
            </div>
            {/* URL input */}
            <div className="flex gap-2 mb-2">
              <input
                className={inputCls}
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); addImage(); }
                }}
                placeholder="oder URL eingeben: https://..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                <ImagePlus size={14} />
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video">
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">Titelbild</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* URLs */}
          <div>
            <label className={labelCls}>Interner Link</label>
            <input
              className={inputCls}
              value={form.link}
              onChange={(e) => set('link', e.target.value)}
              placeholder="/long-stay/kerzers"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Booking URL</label>
              <input
                className={inputCls}
                type="url"
                value={form.bookingUrl}
                onChange={(e) => set('bookingUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className={labelCls}>Airbnb URL</label>
              <input
                className={inputCls}
                type="url"
                value={form.airbnbUrl}
                onChange={(e) => set('airbnbUrl', e.target.value)}
                placeholder="https://airbnb.com/..."
              />
            </div>
          </div>

          {/* iCal availability calendar */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none mt-0.5">📅</span>
              <div>
                <p className="text-sm font-semibold text-emerald-800">Verfügbarkeitskalender (optional)</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Wenn die Immobilie auf Airbnb oder Booking.com ist, zeigen wir automatisch
                  einen Kalender mit freien und gebuchten Tagen — synchronisiert über alle Plattformen.
                </p>
              </div>
            </div>
            <div>
              <label className={labelCls}>iCal-Export-URL (.ics)</label>
              <input
                className={inputCls}
                type="url"
                value={form.icalUrl}
                onChange={(e) => set('icalUrl', e.target.value)}
                placeholder="https://www.airbnb.com/calendar/ical/XXXXXX.ics?t=..."
              />
            </div>
            <details className="group">
              <summary className="text-xs font-semibold text-emerald-700 cursor-pointer select-none list-none flex items-center gap-1">
                <span className="group-open:rotate-90 transition-transform inline-block">▶</span>
                Wie bekomme ich den Link?
              </summary>
              <div className="mt-2 space-y-3 text-xs text-emerald-800">
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <p className="font-semibold mb-1">🏠 Airbnb</p>
                  <ol className="list-decimal list-inside space-y-1 text-emerald-700">
                    <li>Gehe zu <strong>airbnb.com</strong> → als Host einloggen</li>
                    <li>Klicke auf dein Inserat → <strong>Kalender</strong></li>
                    <li>Oben rechts: <strong>Verfügbarkeit</strong> → <strong>Kalender exportieren</strong></li>
                    <li>Den Link kopieren (endet auf <code className="bg-emerald-50 px-1 rounded">.ics</code>)</li>
                  </ol>
                </div>
                <div className="bg-white rounded-lg p-3 border border-emerald-100">
                  <p className="font-semibold mb-1">🌐 Booking.com</p>
                  <ol className="list-decimal list-inside space-y-1 text-emerald-700">
                    <li>Gehe zu <strong>booking.com/hotel/extranet</strong></li>
                    <li><strong>Kalender</strong> → <strong>Kalender synchronisieren</strong></li>
                    <li><strong>Exportieren</strong> → Link kopieren</li>
                  </ol>
                </div>
                <p className="text-emerald-600 bg-white rounded-lg p-2 border border-emerald-100">
                  💡 <strong>Tipp:</strong> Da Airbnb und Booking.com synchronisiert sind, genügt der Link von einer Plattform — beide Reservierungen werden angezeigt.
                </p>
              </div>
            </details>
            {form.icalUrl && (
              <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                <span>✓</span> Kalender wird auf der Detailseite angezeigt.
              </p>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className={labelCls}>Video URL (YouTube / Vimeo)</label>
            <input
              className={inputCls}
              type="url"
              value={form.videoUrl}
              onChange={(e) => set('videoUrl', e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          {/* Virtual Tour URL */}
          <div>
            <label className={labelCls}>Virtual Tour URL (Matterport, 360°)</label>
            <input
              className={inputCls}
              type="url"
              value={form.tourUrl}
              onChange={(e) => set('tourUrl', e.target.value)}
              placeholder="https://my.matterport.com/show/?m=..."
            />
            <p className="text-xs text-gray-400 mt-1">
              z.B. https://my.matterport.com/show/?m=...
            </p>
          </div>

          {/* Contact email */}
          <div>
            <label className={labelCls}>Kontakt E-Mail</label>
            <input
              className={inputCls}
              type="email"
              value={form.contactEmail}
              onChange={(e) => set('contactEmail', e.target.value)}
              placeholder="office@reto-amonn.ch"
            />
          </div>

          {/* Documents */}
          {editingId && (
            <div>
              <label className={labelCls}>Dokumente</label>
              <PropertyDocumentsManager propertyId={editingId} />
            </div>
          )}

          {/* Visible toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set('visible', !form.visible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                form.visible ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  form.visible ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-700">
              {form.visible ? 'Sichtbar auf Website' : 'Versteckt'}
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            form="property-form"
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Save size={14} />
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main PropertiesTab ───────────────────────────────────────────────────────

export default function PropertiesTab() {
  const [properties, setProperties] = useState([]);
  const [editingProperty, setEditingProperty] = useState(null); // null = drawer closed
  const [isNewForm, setIsNewForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const reload = useCallback(() => {
    setProperties(getProperties());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleSave = (data) => {
    if (editingProperty?.id) {
      updateProperty(editingProperty.id, data);
    } else {
      createProperty(data);
    }
    reload();
    setEditingProperty(null);
    setIsNewForm(false);
  };

  const handleToggleVisible = (id, current) => {
    updateProperty(id, { visible: !current });
    reload();
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteProperty(deleteTarget.id);
    setDeleteTarget(null);
    reload();
  };

  const openNew = () => {
    setEditingProperty({});
    setIsNewForm(true);
  };

  const openEdit = (prop) => {
    setEditingProperty(prop);
    setIsNewForm(false);
  };

  const closeDrawer = () => {
    setEditingProperty(null);
    setIsNewForm(false);
  };

  const filtered =
    filterType === 'all'
      ? properties
      : properties.filter((p) => p.type === filterType);

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Immobilien</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {properties.length} Objekt{properties.length !== 1 ? 'e' : ''} verwaltet
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Neue Immobilie
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 p-1 bg-gray-100 rounded-lg w-fit">
        {[
          { value: 'all', label: 'Alle' },
          ...TYPE_OPTIONS,
        ].map((t) => (
          <button
            key={t.value}
            onClick={() => setFilterType(t.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filterType === t.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Properties table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Keine Immobilien gefunden.</p>
          <button
            onClick={openNew}
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Erste Immobilie erstellen
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Typ
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Preis
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Sichtbar
                </th>
                <th className="text-right px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{prop.name}</p>
                      {prop.location && (
                        <p className="text-xs text-gray-500 mt-0.5">{prop.location}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={prop.type} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={prop.status} />
                      {prop.occupancy && prop.occupancy !== 'frei' && (
                        <StatusBadge status={prop.occupancy} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">
                    {prop.priceFrom
                      ? `ab ${prop.priceFrom} ${prop.priceCurrency} / ${prop.pricePeriod}`
                      : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleVisible(prop.id, prop.visible)}
                      title={prop.visible ? 'Ausblenden' : 'Einblenden'}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        prop.visible
                          ? 'text-green-600 bg-green-50 hover:bg-green-100'
                          : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {prop.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {prop.link && (
                        <a
                          href={prop.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Seite öffnen"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => openEdit(prop)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(prop)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Features list (below table) */}
      <div className="mt-4 text-xs text-gray-400">
        Daten werden im Browser (localStorage) gespeichert. Firebase-Migration möglich.
      </div>

      {/* Drawer: new / edit */}
      {editingProperty !== null && (
        <PropertyForm
          property={isNewForm ? null : editingProperty}
          onSave={handleSave}
          onClose={closeDrawer}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteDialog
          property={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
