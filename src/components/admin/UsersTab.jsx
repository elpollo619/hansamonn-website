import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertTriangle, X, Check, Shield, User } from 'lucide-react';
import { getUsers, createUser, deleteUser } from '@/data/usersStore';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { toast } from '@/components/ui/use-toast';

const EMPTY = { name: '', email: '', password: '', role: 'staff' };

export default function UsersTab() {
  const { user: currentUser } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const reload = () => setUsers(getUsers());
  useEffect(() => { reload(); }, []);

  function save() {
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      toast({ title: 'Alle Felder sind erforderlich', variant: 'destructive' }); return;
    }
    try {
      createUser(form);
      toast({ title: '✓ Benutzer erstellt', description: `${form.name} wurde hinzugefügt.` });
      reload(); setDrawerOpen(false); setForm(EMPTY);
    } catch (e) {
      toast({ title: 'Fehler', description: e.message, variant: 'destructive' });
    }
  }

  function doDelete(id) {
    try {
      const u = users.find(x => x.id === id);
      deleteUser(id);
      toast({ title: '✓ Gelöscht', description: `${u?.name ?? ''} entfernt.` });
      setDeleteConfirm(null); reload();
    } catch (e) {
      toast({ title: 'Fehler', description: e.message, variant: 'destructive' });
    }
  }

  const cls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900';

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-lg font-bold text-gray-900">Benutzerverwaltung</h2><p className="text-sm text-gray-500">{users.length} Benutzer gesamt</p></div>
        <button onClick={() => { setForm(EMPTY); setDrawerOpen(true); }} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"><Plus size={16} /> Benutzer hinzufügen</button>
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Benutzer</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">E-Mail</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rolle</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {u.role === 'admin' ? <Shield size={16} className="text-gray-700" /> : <User size={16} className="text-gray-400" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{u.name}{u.id === currentUser?.id && <span className="ml-2 text-xs text-gray-400">(ich)</span>}</p>
                      <p className="text-xs text-gray-400 md:hidden">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{u.email}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-blue-100 text-blue-700'}`}>
                    {u.role === 'admin' ? <><Shield size={10} /> Admin</> : <><User size={10} /> Staff</>}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.id !== 'admin-root' && u.id !== currentUser?.id && (
                    <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Löschen"><Trash2 size={15} /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <strong>Rollen:</strong> <span className="font-semibold">Admin</span> — voller Zugriff, kann Benutzer verwalten und alles löschen. <span className="font-semibold">Staff</span> — kann Inhalte bearbeiten, aber nicht löschen oder Benutzer verwalten.
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setDrawerOpen(false)} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="font-bold text-gray-900">Neuer Benutzer</h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"><X size={18} /></button>
            </div>
            <div className="flex-1 p-6 space-y-4 overflow-y-auto">
              <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Name *</label><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={cls} /></div>
              <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">E-Mail *</label><input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={cls} /></div>
              <div><label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Passwort *</label><input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className={cls} /></div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Rolle</label>
                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} className={cls}>
                  <option value="staff">Staff — Bearbeiten, aber nicht löschen</option>
                  <option value="admin">Admin — Voller Zugriff</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex gap-3 flex-shrink-0">
              <button onClick={save} className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors"><Check size={16} /> Erstellen</button>
              <button onClick={() => setDrawerOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">Abbrechen</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-start gap-3 mb-5"><AlertTriangle size={22} className="text-red-500 flex-shrink-0 mt-0.5" /><div><h3 className="font-bold text-gray-900 mb-1">Benutzer löschen?</h3><p className="text-sm text-gray-500">Dieser Benutzer verliert sofort den Zugang.</p></div></div>
            <div className="flex gap-3">
              <button onClick={() => doDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Ja, löschen</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">Abbrechen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
