import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Check, AlertTriangle, User } from 'lucide-react';
import { getTeam, createMember, updateMember, deleteMember } from '@/data/teamStore';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { toast } from '@/components/ui/use-toast';

const EMPTY = { name: '', position: '', email: '', education: '', experience: '', specialization: '', description: '', photoUrl: '', visible: true };

export default function TeamEditTab() {
  const { canDelete } = useAdminAuth();
  const [members, setMembers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const reload = useCallback(() => setMembers(getTeam().sort((a, b) => (a.order ?? 0) - (b.order ?? 0))), []);
  useEffect(() => { reload(); }, [reload]);

  function openCreate() { setForm(EMPTY); setEditingId(null); setDrawerOpen(true); }
  function openEdit(m) {
    setForm({ name: m.name ?? '', position: m.position ?? '', email: m.email ?? '', education: m.education ?? '', experience: m.experience ?? '', specialization: m.specialization ?? '', description: m.description ?? '', photoUrl: m.photoUrl ?? '', visible: m.visible !== false });
    setEditingId(m.id); setDrawerOpen(true);
  }
  function save() {
    if (!form.name.trim()) { toast({ title: 'Name ist erforderlich', variant: 'destructive' }); return; }
    if (editingId) { updateMember(editingId, form); toast({ title: '✓ Gespeichert', description: `${form.name} aktualisiert.` }); }
    else { createMember(form); toast({ title: '✓ Erstellt', description: `${form.name} hinzugefügt.` }); }
    reload(); setDrawerOpen(false);
  }
  function toggleVisible(m) { updateMember(m.id, { visible: !m.visible }); reload(); }
  function doDelete() {
    const m = members.find(x => x.id === deleteConfirm);
    deleteMember(deleteConfirm);
    toast({ title: '✓ Gelöscht', description: `${m?.name ?? ''} entfernt.` });
    setDeleteConfirm(null); reload();
  }

  const cls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900';
  const Field = ({ label, k, type = 'text', rows }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      {rows ? <textarea rows={rows} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={cls + ' resize-none'} /> : <input type={type} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className={cls} />}
    </div>
  );

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-gray-900">Team-Mitglieder</h2><p className="text-sm text-gray-500">{members.length} Mitglieder gesamt</p></div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"><Plus size={16} /> Hinzufügen</button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mitglied</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Position</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sichtbar</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map(m => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} /> : <User size={16} className="text-gray-400" />}
                    </div>
                    <div><p className="font-medium text-gray-900">{m.name}</p><p className="text-xs text-gray-400 md:hidden">{m.position}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{m.position}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => toggleVisible(m)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-colors ${m.visible !== false ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {m.visible !== false ? <><Eye size={11} /> Aktiv</> : <><EyeOff size={11} /> Versteckt</>}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title="Bearbeiten"><Pencil size={15} /></button>
                    {canDelete && <button onClick={() => setDeleteConfirm(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Löschen"><Trash2 size={15} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {!members.length && <tr><td colSpan={4} className="px-4 py-12 text-center text-gray-400">Keine Mitglieder vorhanden</td></tr>}
          </tbody>
        </table>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-bold text-gray-900">{editingId ? 'Mitglied bearbeiten' : 'Neues Mitglied'}</h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <Field label="Name *" k="name" />
              <Field label="Position / Rolle" k="position" />
              <Field label="E-Mail" k="email" type="email" />
              <Field label="Ausbildung" k="education" />
              <Field label="Erfahrung" k="experience" />
              <Field label="Spezialisierung" k="specialization" />
              <Field label="Beschreibung" k="description" rows={4} />
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Foto-URL</label>
                <input type="url" value={form.photoUrl} onChange={e => setForm(f => ({ ...f, photoUrl: e.target.value }))} placeholder="https://..." className={cls} />
                {form.photoUrl && <div className="mt-2 w-14 h-14 rounded-full overflow-hidden bg-gray-100"><img src={form.photoUrl} alt="" className="w-full h-full object-cover" /></div>}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.visible} onChange={e => setForm(f => ({ ...f, visible: e.target.checked }))} className="w-4 h-4 rounded border-gray-300" />
                <span className="text-sm text-gray-700">Auf der Website anzeigen</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
              <button onClick={save} className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"><Check size={16} /> Speichern</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-start gap-3 mb-5"><AlertTriangle size={22} className="text-red-500 flex-shrink-0 mt-0.5" /><div><h3 className="font-bold text-gray-900 mb-1">Mitglied löschen?</h3><p className="text-sm text-gray-500">Diese Aktion kann nicht rückgängig gemacht werden.</p></div></div>
            <div className="flex gap-3">
              <button onClick={doDelete} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Ja, löschen</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
