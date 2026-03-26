import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, AlertTriangle } from 'lucide-react';
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from '@/data/faqStore';
import { toast } from '@/components/ui/use-toast';

const EMPTY = {
  question: '',
  answer: '',
  category: 'Allgemein',
  sort_order: 0,
  visible: true,
};

export default function FAQTab() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const cls =
    'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900';

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllFaqs();
      setFaqs(data);
    } catch {
      toast({ title: 'Fehler beim Laden', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  function openCreate() {
    setForm(EMPTY);
    setEditingId(null);
    setDrawerOpen(true);
  }

  function openEdit(faq) {
    setForm({
      question: faq.question ?? '',
      answer: faq.answer ?? '',
      category: faq.category ?? 'Allgemein',
      sort_order: faq.sort_order ?? 0,
      visible: faq.visible ?? true,
    });
    setEditingId(faq.id);
    setDrawerOpen(true);
  }

  async function save() {
    if (!form.question.trim()) {
      toast({ title: 'Frage ist erforderlich', variant: 'destructive' });
      return;
    }
    if (!form.answer.trim()) {
      toast({ title: 'Antwort ist erforderlich', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) {
        await updateFaq(editingId, payload);
        toast({ title: 'Gespeichert', description: 'FAQ aktualisiert.' });
      } else {
        await createFaq(payload);
        toast({ title: 'Erstellt', description: 'FAQ hinzugefügt.' });
      }
      setDrawerOpen(false);
      await reload();
    } catch (err) {
      toast({ title: 'Fehler beim Speichern', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    const faq = faqs.find((x) => x.id === deleteConfirm);
    try {
      await deleteFaq(deleteConfirm);
      toast({ title: 'Gelöscht', description: `FAQ entfernt.` });
      setDeleteConfirm(null);
      await reload();
    } catch (err) {
      toast({ title: 'Fehler beim Löschen', description: err.message, variant: 'destructive' });
    }
  }

  async function toggleVisible(faq) {
    try {
      await updateFaq(faq.id, { visible: !faq.visible });
      await reload();
    } catch (err) {
      toast({ title: 'Fehler', description: err.message, variant: 'destructive' });
    }
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">FAQ</h2>
          <p className="text-sm text-gray-500">
            {faqs.filter((f) => f.visible).length} sichtbar &middot;{' '}
            {faqs.filter((f) => !f.visible).length} verborgen
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          <Plus size={16} /> Neue Frage
        </button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Frage
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Kategorie
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Reihenfolge
              </th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Sichtbar
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Aktionen
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">
                  Laden…
                </td>
              </tr>
            )}
            {!loading && faqs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                  Noch keine FAQs vorhanden
                </td>
              </tr>
            )}
            {!loading &&
              faqs.map((faq) => (
                <tr key={faq.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-2 max-w-xs">
                      {faq.question}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                    {faq.category}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-500 hidden sm:table-cell">
                    {faq.sort_order}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => toggleVisible(faq)}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        faq.visible
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                      title={faq.visible ? 'Verbergen' : 'Anzeigen'}
                    >
                      {faq.visible ? (
                        <>
                          <Eye size={11} /> Sichtbar
                        </>
                      ) : (
                        <>
                          <EyeOff size={11} /> Verborgen
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(faq)}
                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(faq.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Löschen"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Slide-over Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-bold text-gray-900">
                {editingId ? 'FAQ bearbeiten' : 'Neue FAQ'}
              </h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 p-6 space-y-5 overflow-y-auto">
              {/* Frage */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Frage *
                </label>
                <textarea
                  rows={3}
                  value={form.question}
                  onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                  className={cls + ' resize-none'}
                  placeholder="Was möchten Kunden wissen?"
                />
              </div>

              {/* Antwort */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Antwort *
                </label>
                <textarea
                  rows={5}
                  value={form.answer}
                  onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                  className={cls + ' resize-y'}
                  placeholder="Die Antwort auf die Frage…"
                />
              </div>

              {/* Kategorie + Reihenfolge */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Kategorie
                  </label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className={cls}
                    placeholder="Allgemein"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Reihenfolge
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
                    className={cls}
                  />
                </div>
              </div>

              {/* Sichtbar toggle */}
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <div
                  onClick={() => setForm((f) => ({ ...f, visible: !f.visible }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    form.visible ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.visible ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {form.visible ? 'Sichtbar' : 'Verborgen'}
                </span>
              </label>
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60"
              >
                <Check size={16} /> {saving ? 'Speichern…' : 'Speichern'}
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-start gap-3 mb-5">
              <AlertTriangle size={22} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">FAQ löschen?</h3>
                <p className="text-sm text-gray-500">
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={doDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Ja, löschen
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
