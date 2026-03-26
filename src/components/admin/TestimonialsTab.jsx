import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  name: '',
  role: 'Kunde',
  text: '',
  rating: 5,
  property: '',
  visible: true,
  sort_order: 0,
};

function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            size={22}
            className={
              n <= (hovered || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={13}
          className={n <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = new
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState('');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  function openNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setDrawerOpen(true);
  }

  function openEdit(item) {
    setEditing(item.id);
    setForm({
      name: item.name ?? '',
      role: item.role ?? 'Kunde',
      text: item.text ?? '',
      rating: item.rating ?? 5,
      property: item.property ?? '',
      visible: item.visible ?? true,
      sort_order: item.sort_order ?? 0,
    });
    setError('');
    setDrawerOpen(true);
  }

  function closeDrawer() {
    setDrawerOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
  }

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name ist erforderlich.'); return; }
    if (!form.text.trim()) { setError('Bewertungstext ist erforderlich.'); return; }
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      role: form.role.trim() || 'Kunde',
      text: form.text.trim(),
      rating: Number(form.rating),
      property: form.property.trim() || null,
      visible: form.visible,
      sort_order: Number(form.sort_order) || 0,
    };

    let err;
    if (editing) {
      ({ error: err } = await supabase.from('testimonials').update(payload).eq('id', editing));
    } else {
      ({ error: err } = await supabase.from('testimonials').insert(payload));
    }

    setSaving(false);
    if (err) { setError(err.message); return; }
    closeDrawer();
    fetchItems();
  }

  async function handleToggleVisible(item) {
    await supabase
      .from('testimonials')
      .update({ visible: !item.visible })
      .eq('id', item.id);
    fetchItems();
  }

  async function handleDelete(id) {
    await supabase.from('testimonials').delete().eq('id', id);
    setDeleteId(null);
    fetchItems();
  }

  return (
    <div className="relative">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bewertungen</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Kundenstimmen verwalten — sichtbar auf der Website
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus size={15} />
          Neue Bewertung
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Laden…</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-400 py-12 text-center border border-dashed border-gray-200 rounded-xl">
          Noch keine Bewertungen. Klicken Sie auf «Neue Bewertung».
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-2 font-medium text-gray-500 w-1/4">Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Rolle</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Bewertung</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Reihenfolge</th>
                <th className="text-left py-3 px-2 font-medium text-gray-500">Sichtbar</th>
                <th className="py-3 px-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 font-medium text-gray-900">{item.name}</td>
                  <td className="py-3 px-2 text-gray-500">{item.role}</td>
                  <td className="py-3 px-2">
                    <StarDisplay value={item.rating ?? 5} />
                  </td>
                  <td className="py-3 px-2 text-gray-400">{item.sort_order ?? 0}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => handleToggleVisible(item)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                        item.visible ? 'bg-gray-900' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          item.visible ? 'translate-x-4' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

      {/* ── Slide-over drawer ────────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/30 backdrop-blur-sm"
            onClick={closeDrawer}
          />

          {/* Panel */}
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-semibold text-gray-900">
                {editing ? 'Bewertung bearbeiten' : 'Neue Bewertung'}
              </h3>
              <button
                onClick={closeDrawer}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="px-6 py-5 flex flex-col gap-5 flex-1">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="z. B. Maria Müller"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Rolle */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Rolle</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                  placeholder="z. B. Mieter, Käufer, Kunde …"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Text */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Bewertungstext <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={form.text}
                  onChange={(e) => set('text', e.target.value)}
                  placeholder="Was hat der Kunde gesagt?"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Bewertung</label>
                <StarPicker value={form.rating} onChange={(v) => set('rating', v)} />
              </div>

              {/* Objekt / Immobilie */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Objekt / Immobilie
                </label>
                <input
                  type="text"
                  value={form.property}
                  onChange={(e) => set('property', e.target.value)}
                  placeholder="z. B. Wohnung Muri, Haus Bern …"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              {/* Reihenfolge */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Reihenfolge
                </label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set('sort_order', e.target.value)}
                  min={0}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
                <p className="text-xs text-gray-400 mt-1">Niedrigere Zahlen erscheinen zuerst.</p>
              </div>

              {/* Sichtbar toggle */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-medium text-gray-700">Sichtbar auf Website</p>
                  <p className="text-xs text-gray-400 mt-0.5">Deaktivieren zum Ausblenden</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('visible', !form.visible)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                    form.visible ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                      form.visible ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end sticky bottom-0">
              <button
                onClick={closeDrawer}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save size={14} />
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation dialog ───────────────────────────────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h4 className="font-semibold text-gray-900 mb-2">Bewertung löschen?</h4>
            <p className="text-sm text-gray-500 mb-5">
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
