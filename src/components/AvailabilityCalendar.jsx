import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAvailability } from '@/hooks/useAvailability';

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const MONTHS = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

function toStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function MonthGrid({ year, month, isBlocked, todayStr }) {
  const firstDow  = new Date(year, month, 1).getDay();          // 0=Sun
  const startOffset = (firstDow + 6) % 7;                       // Mon-based offset
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array(startOffset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <p className="text-center text-sm font-bold text-gray-800 mb-3">
        {MONTHS[month]} {year}
      </p>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;

          const dateStr = toStr(year, month, d);
          const isPast    = dateStr < todayStr;
          const isToday   = dateStr === todayStr;
          const blocked   = !isPast && isBlocked(dateStr);
          const free      = !isPast && !blocked;

          return (
            <div
              key={i}
              className={[
                'aspect-square flex items-center justify-center rounded-md text-xs font-medium select-none',
                isPast  ? 'text-gray-200'                              : '',
                blocked ? 'bg-red-100 text-red-400 line-through'       : '',
                free    ? 'bg-gray-100 text-gray-700 font-semibold' : '',
                isToday ? 'ring-2 ring-gray-800 ring-offset-1'         : '',
              ].join(' ')}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AvailabilityCalendar — shows 2 months of availability from an iCal feed.
 * @prop {string} icalUrl  - The .ics export URL from Airbnb (or Booking.com)
 */
export default function AvailabilityCalendar({ icalUrl }) {
  const [offset, setOffset] = useState(0); // months from current
  const { loading, error, isBlocked } = useAvailability(icalUrl);

  const today    = new Date();
  const todayStr = toStr(today.getFullYear(), today.getMonth(), today.getDate());

  const months = [0, 1].map((i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + offset + i, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  return (
    <div className="bg-white border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center text-sm">📅</span>
          Verfügbarkeit
        </h4>
        <div className="flex items-center gap-1">
          {loading && <Loader2 size={13} className="animate-spin text-gray-400 mr-1" />}
          <button
            onClick={() => setOffset((o) => Math.max(0, o - 1))}
            disabled={offset === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 transition-colors"
            aria-label="Vorheriger Monat"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => setOffset((o) => o + 1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Nächster Monat"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-gray-400">
          <Loader2 size={22} className="animate-spin" />
          <span className="text-sm">Lade Verfügbarkeit…</span>
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>Verfügbarkeit konnte nicht geladen werden. Bitte versuchen Sie es später erneut.</span>
        </div>
      ) : (
        <div className="space-y-6">
          {months.map(({ year, month }) => (
            <MonthGrid
              key={`${year}-${month}`}
              year={year}
              month={month}
              isBlocked={isBlocked}
              todayStr={todayStr}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      {!loading && !error && (
        <div className="flex items-center gap-5 mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300" />
            <span className="text-xs text-gray-500">Verfügbar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
            <span className="text-xs text-gray-500">Gebucht</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200" />
            <span className="text-xs text-gray-500">Vergangen</span>
          </div>
        </div>
      )}

      <p className="text-[10px] text-gray-300 mt-3 text-center">
        Synchronisiert mit Airbnb · Booking.com · Alle Plattformen
      </p>
    </div>
  );
}
