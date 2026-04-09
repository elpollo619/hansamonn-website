import React, { useState, useEffect, useCallback } from 'react';
import { Eye, X, Loader2, AlertCircle, Download, Mail, Phone, Search, Send, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { logActivity } from '@/data/activityLogStore';

const STATUS_CONFIG = {
  neu:        { label: 'Neu',        cls: 'bg-blue-50 text-blue-700 border border-blue-200',    dot: 'bg-blue-500' },
  bearbeitet: { label: 'Bearbeitet', cls: 'bg-yellow-50 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-400' },
  akzeptiert: { label: 'Akzeptiert', cls: 'bg-green-50 text-green-700 border border-green-200',  dot: 'bg-green-500' },
  abgelehnt:  { label: 'Abgelehnt', cls: 'bg-gray-100 text-gray-500 border border-gray-200',    dot: 'bg-gray-400' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.neu;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function DetailDrawer({ row, onClose, onStatusChange }) {
  const data = (() => { try { return JSON.parse(row.nachricht ?? '{}'); } catch { return {}; } })();
  const [status, setStatus] = useState(row.status ?? 'neu');
  const [saving, setSaving] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replyResult, setReplyResult] = useState(null); // 'ok' | 'error'

  async function saveStatus(s) {
    setSaving(true);
    setStatus(s);
    await supabase.from('mietanfragen').update({ status: s }).eq('id', row.id);
    setSaving(false);
    onStatusChange(row.id, s);
    toast({ title: '✓ Status aktualisiert' });
    logActivity(
      `Status auf "${STATUS_CONFIG[s]?.label ?? s}" gesetzt`,
      'Mietanfragen',
      `${row.vorname} ${row.nachname}`,
      row.objekt ?? undefined
    );
  }

  const Field = ({ label, value }) => value ? (
    <div className="flex gap-3 text-sm">
      <span className="w-36 flex-shrink-0 text-gray-500">{label}</span>
      <span className="text-gray-900 font-medium break-words">{value}</span>
    </div>
  ) : null;

  // Build mailto reply with prefilled subject
  const replySubject = `Re: Anfrage ${row.objekt ?? ''} – ${row.vorname} ${row.nachname}`;
  const replyHref    = `mailto:${row.email}?subject=${encodeURIComponent(replySubject)}`;

  async function sendReply() {
    if (!replyText.trim()) return;
    setReplySending(true);
    setReplyResult(null);
    try {
      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: row.email,
          subject: replySubject,
          html: `<p>${replyText.replace(/\n/g, '<br>')}</p>`,
        },
      });
      if (error) throw error;
      setReplyResult('ok');
      setReplyText('');
      await saveStatus('bearbeitet');
    } catch {
      setReplyResult('error');
    }
    setReplySending(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white flex flex-col" style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.12)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900">{row.vorname} {row.nachname}</h3>
            {row.objekt && <p className="text-xs text-gray-400 mt-0.5">{row.objekt}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick actions */}
          <div className="flex gap-2 flex-wrap">
            <a href={replyHref}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
              onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
              onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
            >
              <Mail size={14} /> Per E-Mail antworten
            </a>
            {row.telefon && (
              <a href={`tel:${row.telefon.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                <Phone size={14} /> Anrufen
              </a>
            )}
          </div>

          {/* Quick reply */}
          <div>
            <button
              onClick={() => { setReplyOpen(o => !o); setReplyResult(null); }}
              className="inline-flex items-center gap-2 text-sm font-semibold border border-gray-200 px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <Send size={14} />
              Antwort schreiben
              <ChevronDown size={14} className={`transition-transform ${replyOpen ? 'rotate-180' : ''}`} />
            </button>
            {replyOpen && (
              <div className="mt-3 space-y-2">
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Antwort an ${row.vorname} ${row.nachname}…`}
                  className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white resize-none"
                />
                {replyResult === 'ok' && (
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-2">E-Mail gesendet. Status auf „Bearbeitet" gesetzt.</p>
                )}
                {replyResult === 'error' && (
                  <p className="text-xs text-red-600 bg-red-50 px-3 py-2">Fehler beim Senden. Bitte erneut versuchen.</p>
                )}
                <button
                  onClick={sendReply}
                  disabled={replySending || !replyText.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 transition-colors"
                  style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
                  onMouseOver={e => !replySending && e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
                  onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
                >
                  {replySending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  {replySending ? 'Senden…' : 'Senden'}
                </button>
              </div>
            )}
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status ändern</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => saveStatus(key)} disabled={saving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    status === key ? `${cfg.cls}` : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
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
            <Field label="Name"    value={`${row.vorname} ${row.nachname}`} />
            <Field label="E-Mail"  value={row.email} />
            <Field label="Telefon" value={row.telefon} />
            <Field label="Objekt"  value={row.objekt} />
            <Field label="Datum"   value={row.created_at ? new Date(row.created_at).toLocaleString('de-CH') : ''} />
          </div>

          {/* Parsed form data */}
          {Object.keys(data).length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Angaben</p>
              <div className="bg-gray-50 border border-gray-100 p-4 space-y-2 max-h-80 overflow-y-auto">
                {Object.entries(data).filter(([k, v]) => v && k !== 'dokumente').map(([k, v]) => (
                  <div key={k} className="flex gap-3 text-xs">
                    <span className="w-32 flex-shrink-0 text-gray-500 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-gray-800 break-words">{Array.isArray(v) ? v.join(', ') : String(v)}</span>
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
                className="inline-flex items-center gap-2 text-sm hover:underline" style={{ color: 'var(--brand-color, #1D3D78)' }}>
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
  const [search, setSearch]     = useState('');

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

  // Search filter
  const q = search.toLowerCase();
  const afterSearch = q
    ? rows.filter(r =>
        `${r.vorname} ${r.nachname} ${r.email} ${r.objekt ?? ''}`.toLowerCase().includes(q)
      )
    : rows;

  const filtered = filter === 'alle' ? afterSearch : afterSearch.filter(r => r.status === filter);

  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map(k => [k, rows.filter(r => r.status === k).length])
  );
  const neuCount = counts.neu ?? 0;

  function csvEscape(val) {
    const str = val == null ? '' : String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  async function exportCsv() {
    const { data: allRows, error: fetchErr } = await supabase
      .from('mietanfragen')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchErr || !allRows || allRows.length === 0) {
      toast({ title: 'Keine Daten zum Exportieren vorhanden', variant: 'destructive' });
      return;
    }

    const headers = ['Datum', 'Name', 'Email', 'Telefon', 'Objekt', 'Von', 'Bis', 'Personen', 'Nachricht', 'Status'];
    const dataRows = allRows.map(r => {
      let parsed = {};
      try { parsed = JSON.parse(r.nachricht ?? '{}'); } catch { /* ignore */ }

      const nachricht = Object.entries(parsed)
        .filter(([k, v]) => v && !['von', 'bis', 'personen', 'dokumente', 'ankunft', 'abreise', 'gaeste', 'quelle'].includes(k.toLowerCase()))
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');

      const von      = parsed.von      ?? parsed.Von      ?? parsed.einzug   ?? parsed.ankunft  ?? '';
      const bis      = parsed.bis      ?? parsed.Bis      ?? parsed.auszug   ?? parsed.abreise  ?? '';
      const personen = parsed.personen ?? parsed.Personen ?? parsed.anzahl   ?? parsed.gaeste   ?? '';

      return [
        r.created_at ? new Date(r.created_at).toLocaleDateString('de-CH') : '',
        `${r.vorname ?? ''} ${r.nachname ?? ''}`.trim(),
        r.email ?? '',
        r.telefon ?? '',
        r.objekt ?? '',
        von,
        bis,
        personen,
        nachricht,
        r.status ?? '',
      ].map(csvEscape).join(',');
    });

    const csv = [headers.join(','), ...dataRows].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mietanfragen-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative">
      {selected && <DetailDrawer row={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Anfragen
            {neuCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold">
                {neuCount}
              </span>
            )}
          </h2>
          <p className="text-sm text-gray-500">{rows.length} Anfragen gesamt</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCsv} className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            <Download size={14} /> CSV
          </button>
          <button onClick={load} className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            Aktualisieren
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Suchen nach Name, E-Mail, Objekt…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
        />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[['alle', 'Alle', rows.length], ...Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label, counts[k]])].map(([key, label, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filter === key ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>
            {label} {count > 0 && <span className="ml-1 opacity-60">({count})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Lade Anfragen…
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3">
          <AlertCircle size={15} /> {error}
        </div>
      ) : (
        <div className="border border-gray-200 overflow-hidden">
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
              {filtered.map(row => {
                const isNeu = (!row.status || row.status === 'neu');
                return (
                  <tr key={row.id}
                    className={`transition-colors cursor-pointer ${isNeu ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                    onClick={() => setSelected(row)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {isNeu && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" title="Neu" />}
                        <div>
                          <p className={`font-medium ${isNeu ? 'text-gray-900' : 'text-gray-700'}`}>
                            {row.vorname} {row.nachname}
                          </p>
                          <p className="text-xs text-gray-400">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{row.objekt ?? '–'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">
                      {new Date(row.created_at).toLocaleDateString('de-CH')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={row.status ?? 'neu'} />
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <a href={`mailto:${row.email}?subject=${encodeURIComponent(`Re: Anfrage ${row.objekt ?? ''} – ${row.vorname} ${row.nachname}`)}`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Per E-Mail antworten"
                        >
                          <Mail size={14} />
                        </a>
                        <button onClick={() => setSelected(row)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Details anzeigen"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                    {search ? `Keine Ergebnisse für „${search}"` : 'Keine Anfragen vorhanden'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
