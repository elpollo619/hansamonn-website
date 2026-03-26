import React, { useState, useEffect, useCallback } from 'react';
import { Inbox, Eye, X, ChevronDown, ChevronUp, Loader2, AlertCircle, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
  neu:        { label: 'Neu',        cls: 'bg-blue-100 text-blue-700' },
  bearbeitet: { label: 'Bearbeitet', cls: 'bg-yellow-100 text-yellow-700' },
  abgelehnt:  { label: 'Abgelehnt', cls: 'bg-red-100 text-red-600' },
  akzeptiert: { label: 'Akzeptiert', cls: 'bg-green-100 text-green-700' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.neu;
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>{cfg.label}</span>;
}

function DetailDrawer({ row, onClose, onStatusChange }) {
  const data = (() => { try { return JSON.parse(row.nachricht ?? '{}'); } catch { return {}; } })();
  const [status, setStatus] = useState(row.status ?? 'neu');
  const [saving, setSaving] = useState(false);

  async function saveStatus(s) {
    setSaving(true);
    setStatus(s);
    await supabase.from('mietanfragen').update({ status: s }).eq('id', row.id);
    setSaving(false);
    onStatusChange(row.id, s);
    toast({ title: '✓ Status aktualisiert' });
  }

  const Field = ({ label, value }) => value ? (
    <div className="flex gap-3 text-sm">
      <span className="w-36 flex-shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Anfrage: {row.vorname} {row.nachname}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => saveStatus(key)} disabled={saving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    status === key ? `${cfg.cls} border-transparent` : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {cfg.label}
                </button>
              ))}
              {saving && <Loader2 size={14} className="animate-spin text-gray-400 self-center" />}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontakt</p>
            <Field label="Name" value={`${row.vorname} ${row.nachname}`} />
            <Field label="E-Mail" value={row.email} />
            <Field label="Telefon" value={row.telefon} />
            <Field label="Objekt" value={row.objekt} />
          </div>

          {/* Full form data */}
          {Object.keys(data).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Alle Angaben</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(data).filter(([k, v]) => v && k !== 'dokumente').map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-xs">
                    <span className="w-32 flex-shrink-0 text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-gray-800">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document link */}
          {row.dokument_url && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dokument</p>
              <a href={`https://teioztcidolgyqlwzlrb.supabase.co/storage/v1/object/public/bewerber-dokumente/${row.dokument_url}`}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
                Dokument öffnen
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MietanfragenTab() {
  const [rows, setRows]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('alle');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('mietanfragen')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleStatusChange(id, status) {
    setRows(r => r.map(x => x.id === id ? { ...x, status } : x));
    if (selected?.id === id) setSelected(s => ({ ...s, status }));
  }

  const filtered = filter === 'alle' ? rows : rows.filter(r => r.status === filter);
  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(k => [k, rows.filter(r => r.status === k).length])
  );

  function csvEscape(val) {
    const str = val == null ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function exportCsv() {
    const headers = ['Datum', 'Vorname', 'Nachname', 'Email', 'Telefon', 'Immobilie', 'Nachricht', 'Status'];
    const dataRows = filtered.map(r => {
      let nachricht = '';
      try {
        const parsed = JSON.parse(r.nachricht ?? '{}');
        nachricht = Object.entries(parsed)
          .filter(([k, v]) => v && k !== 'dokumente')
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' | ');
      } catch {
        nachricht = r.nachricht ?? '';
      }
      return [
        r.created_at ? new Date(r.created_at).toLocaleDateString('de-CH') : '',
        r.vorname ?? '',
        r.nachname ?? '',
        r.email ?? '',
        r.telefon ?? '',
        r.objekt ?? '',
        nachricht,
        r.status ?? '',
      ].map(csvEscape).join(',');
    });
    const csv = [headers.join(','), ...dataRows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anfragen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative">
      {selected && <DetailDrawer row={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Mietanfragen</h2>
          <p className="text-sm text-gray-500">{rows.length} Anfragen gesamt</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            CSV exportieren
          </button>
          <button onClick={load} className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[['alle', 'Alle', rows.length], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label, counts[k]])].map(([key, label, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filter === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Lade Anfragen…
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
          <AlertCircle size={15} /> {error}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bewerber</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Objekt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Datum</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{row.vorname} {row.nachname}</p>
                    <p className="text-xs text-gray-400">{row.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{row.objekt}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                    {new Date(row.created_at).toLocaleDateString('de-CH')}
                  </td>
                  <td className="px-4 py-3 text-center"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelected(row)}
                      className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-gray-400">Keine Anfragen vorhanden</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
