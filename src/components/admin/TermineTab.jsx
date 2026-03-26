import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, X, Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const STATUS_CONFIG = {
  neu:        { label: 'Neu',        cls: 'bg-blue-100 text-blue-700' },
  bestätigt:  { label: 'Bestätigt', cls: 'bg-green-100 text-green-700' },
  abgesagt:   { label: 'Abgesagt',  cls: 'bg-red-100 text-red-600' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.neu;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function DetailDrawer({ row, onClose, onStatusChange }) {
  const [status, setStatus] = useState(row.status ?? 'neu');
  const [saving, setSaving] = useState(false);

  async function saveStatus(s) {
    setSaving(true);
    setStatus(s);
    await supabase.from('termine').update({ status: s }).eq('id', row.id);
    setSaving(false);
    onStatusChange(row.id, s);
    toast({ title: '✓ Status aktualisiert' });
  }

  const Field = ({ label, value }) =>
    value ? (
      <div className="flex gap-3 text-sm">
        <span className="w-36 flex-shrink-0 text-gray-500">{label}</span>
        <span className="text-gray-900 font-medium">{value}</span>
      </div>
    ) : null;

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Termin: {row.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => saveStatus(key)}
                  disabled={saving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    status === key
                      ? `${cfg.cls} border-transparent`
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cfg.label}
                </button>
              ))}
              {saving && <Loader2 size={14} className="animate-spin text-gray-400 self-center" />}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Kontakt</p>
            <Field label="Name" value={row.name} />
            <Field label="E-Mail" value={row.email} />
            <Field label="Telefon" value={row.telefon} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Termindetails</p>
            <Field label="Art" value={row.art} />
            <Field label="Wunschdatum" value={formatDate(row.wunschtermin)} />
            <Field label="Wunschzeit" value={row.uhrzeit} />
            <Field label="Objekt" value={row.property_name} />
          </div>

          {row.nachricht && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Nachricht</p>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">
                {row.nachricht}
              </div>
            </div>
          )}

          {/* Email link */}
          {row.email && (
            <div className="pt-2 border-t border-gray-100">
              <a
                href={`mailto:${row.email}?subject=Ihr Terminwunsch bei Hans Amonn AG`}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
              >
                E-Mail senden
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TermineTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('alle');

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('termine')
      .select('*')
      .order('wunschtermin', { ascending: true });
    if (err) setError(err.message);
    else setRows(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function handleStatusChange(id, status) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
    if (selected?.id === id) setSelected((s) => ({ ...s, status }));
  }

  const filtered = filter === 'alle' ? rows : rows.filter((r) => r.status === filter);
  const counts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map((k) => [k, rows.filter((r) => r.status === k).length])
  );

  const formatDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className="relative">
      {selected && (
        <DetailDrawer
          row={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={18} />
            Termine
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {rows.length} {rows.length === 1 ? 'Termin' : 'Termine'} total
          </p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-3 py-2 rounded-lg transition-colors"
        >
          Aktualisieren
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { key: 'alle', label: `Alle (${rows.length})` },
          ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({
            key: k,
            label: `${v.label} (${counts[k] ?? 0})`,
          })),
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              filter === key
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-8 justify-center">
          <Loader2 size={16} className="animate-spin" /> Wird geladen…
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Keine Termine vorhanden.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((row) => (
            <button
              key={row.id}
              onClick={() => setSelected(row)}
              className="w-full text-left bg-white border border-gray-200 hover:border-gray-300 rounded-xl px-5 py-4 transition-colors hover:shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                {/* Date + time */}
                <div className="flex items-center gap-2 min-w-[140px]">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={14} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(row.wunschtermin)}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={10} />
                      {row.uhrzeit || '—'}
                    </p>
                  </div>
                </div>

                {/* Name + email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{row.name}</p>
                  <p className="text-xs text-gray-500 truncate">{row.email}</p>
                </div>

                {/* Art + property */}
                <div className="hidden md:block min-w-[160px]">
                  <p className="text-xs font-medium text-gray-700">{row.art}</p>
                  {row.property_name && (
                    <p className="text-xs text-gray-400 truncate">{row.property_name}</p>
                  )}
                </div>

                {/* Status */}
                <div className="flex-shrink-0">
                  <StatusBadge status={row.status} />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
