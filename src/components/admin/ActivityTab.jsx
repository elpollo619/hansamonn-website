import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, AlertCircle, Trash2, Building2, Inbox, MessageSquare, Star, RefreshCw } from 'lucide-react';
import { getActivityLog, clearActivityLog } from '@/data/activityLogStore';
import { useAdminAuth } from '@/context/AdminAuthContext';

// ── Relative time helper ──────────────────────────────────────────────────────

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const secs  = Math.floor(diff / 1000);
  const mins  = Math.floor(secs / 60);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);

  if (secs < 60)  return 'gerade eben';
  if (mins < 60)  return `vor ${mins} Minute${mins !== 1 ? 'n' : ''}`;
  if (hours < 24) return `vor ${hours} Stunde${hours !== 1 ? 'n' : ''}`;
  if (days < 7)   return `vor ${days} Tag${days !== 1 ? 'en' : ''}`;
  return new Date(dateStr).toLocaleDateString('de-CH');
}

// ── Icon + color by entity type ───────────────────────────────────────────────

function entryMeta(entry) {
  const action = (entry.action ?? '').toLowerCase();
  const entity = (entry.entity_type ?? '').toLowerCase();

  // Color by action verb — all use gray per design system
  let colorCls = 'bg-gray-100 text-gray-600';

  // Icon by entity
  let Icon = Star;
  if (entity.includes('immobil')) Icon = Building2;
  else if (entity.includes('mietanfrag')) Icon = Inbox;
  else if (entity.includes('kontakt')) Icon = MessageSquare;

  return { colorCls, Icon };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ActivityTab() {
  const { isAdmin } = useAdminAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [clearing, setClearing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getActivityLog(50);
      setEntries(data);
    } catch (err) {
      setError(err.message ?? 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30_000);
    return () => clearInterval(interval);
  }, [load]);

  const handleClear = async () => {
    if (!window.confirm('Gesamtes Aktivitätsprotokoll wirklich löschen?')) return;
    setClearing(true);
    try {
      await clearActivityLog();
      setEntries([]);
    } catch (err) {
      alert('Fehler: ' + (err.message ?? err));
    } finally {
      setClearing(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Aktivitätsprotokoll</h2>
          <p className="text-sm text-gray-500">Letzte 50 Aktionen — wird alle 30 Sek. aktualisiert</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Aktualisieren
          </button>
          {isAdmin && (
            <button
              onClick={handleClear}
              disabled={clearing || entries.length === 0}
              className="inline-flex items-center gap-1.5 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-40"
            >
              <Trash2 size={14} />
              {clearing ? 'Löschen…' : 'Aktivitätsprotokoll leeren'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading && entries.length === 0 ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
          <Loader2 size={20} className="animate-spin" /> Lade Protokoll…
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
          <AlertCircle size={15} /> {error}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-sm">Noch keine Aktivitäten aufgezeichnet.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />

          <ul className="space-y-3">
            {entries.map((entry) => {
              const { colorCls, Icon } = entryMeta(entry);
              return (
                <li key={entry.id} className="relative flex gap-4 pl-12">
                  {/* Icon bubble */}
                  <div className={`absolute left-2 top-1 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                    <Icon size={12} />
                  </div>

                  {/* Card */}
                  <div className="flex-1 bg-white border border-gray-100 rounded-lg px-4 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{entry.action}</p>
                        {(entry.entity_name || entry.entity_type) && (
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {entry.entity_type && (
                              <span className="font-semibold text-gray-600">{entry.entity_type}</span>
                            )}
                            {entry.entity_type && entry.entity_name && ' · '}
                            {entry.entity_name}
                          </p>
                        )}
                        {entry.details && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{entry.details}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-xs text-gray-400 whitespace-nowrap">{relativeTime(entry.created_at)}</p>
                        {entry.user_name && (
                          <p className="text-xs text-gray-400 mt-0.5">{entry.user_name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
