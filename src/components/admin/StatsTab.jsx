import React, { useEffect, useState } from 'react';
import { Inbox, Mail, Star, FileText, Eye } from 'lucide-react';
import {
  getMietanfragenCount,
  getNewsletterCount,
  getTestimonialsCount,
  getBlogPostsCount,
  getPropertyViewStats,
} from '@/data/statsStore';
import { supabase } from '@/lib/supabase';

// ── Skeleton ──────────────────────────────────────────────────────────────────

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
);

// ── KPI Card ─────────────────────────────────────────────────────────────────

const KpiCard = ({ label, value, icon: Icon, loading }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-5 flex items-center gap-4">
    <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
      <Icon size={20} className="text-gray-600" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      {loading ? (
        <Skeleton className="mt-1 h-7 w-12" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      )}
    </div>
  </div>
);

// ── StatsTab ──────────────────────────────────────────────────────────────────

export default function StatsTab() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState({ anfragen: 0, newsletter: 0, bewertungen: 0, blog: 0 });
  const [views, setViews] = useState([]);
  const [anfragenByProperty, setAnfragenByProperty] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const [anfragen, newsletter, bewertungen, blog, viewStats] = await Promise.all([
        getMietanfragenCount(),
        getNewsletterCount(),
        getTestimonialsCount(),
        getBlogPostsCount(),
        getPropertyViewStats(),
      ]);
      // Load anfragen by property
      const { data: anfragenData } = await supabase
        .from('mietanfragen')
        .select('objekt, status')
        .not('objekt', 'is', null);

      if (!cancelled) {
        setKpis({ anfragen, newsletter, bewertungen, blog });
        setViews(viewStats);

        if (anfragenData) {
          const map = {};
          anfragenData.forEach(r => {
            const key = r.objekt || '—';
            if (!map[key]) map[key] = { objekt: key, total: 0, neu: 0, bearbeitet: 0 };
            map[key].total++;
            if (!r.status || r.status === 'neu') map[key].neu++;
            if (r.status === 'bearbeitet') map[key].bearbeitet++;
          });
          setAnfragenByProperty(Object.values(map).sort((a, b) => b.total - a.total));
        }

        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-8">
      {/* KPI grid */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Übersicht</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Anfragen"   value={kpis.anfragen}   icon={Inbox}    loading={loading} />
          <KpiCard label="Newsletter" value={kpis.newsletter} icon={Mail}     loading={loading} />
          <KpiCard label="Bewertungen" value={kpis.bewertungen} icon={Star}   loading={loading} />
          <KpiCard label="Blog Posts" value={kpis.blog}       icon={FileText} loading={loading} />
        </div>
      </div>

      {/* Property views table */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Beliebteste Immobilien
        </h2>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          ) : views.length === 0 ? (
            <div className="p-10 text-center">
              <Eye size={32} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Noch keine Seitenaufrufe erfasst.</p>
              <p className="text-xs text-gray-400 mt-1">Daten werden ab dem ersten Besuch einer Immobilienseite gesammelt.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Immobilie</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Aufrufe</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden sm:table-cell">Zeitraum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {views.map((row) => (
                  <tr key={row.property_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {row.property_name || row.property_id}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-gray-900">
                        <Eye size={13} className="text-gray-400" />
                        {row.count}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        letzte 30 Tage
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Anfragen by property */}
      {anfragenByProperty.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Anfragen pro Immobilie
          </h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Immobilie</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Gesamt</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Neu</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider hidden sm:table-cell">Bearbeitet</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {anfragenByProperty.map(row => (
                  <tr key={row.objekt} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{row.objekt}</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{row.total}</td>
                    <td className="px-5 py-3.5 text-right">
                      {row.neu > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {row.neu}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell">
                      {row.bearbeitet > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                          {row.bearbeitet}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
