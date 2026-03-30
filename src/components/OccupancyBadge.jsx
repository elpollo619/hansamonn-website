import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const BADGE_CONFIG = {
  frei: {
    label: 'Verfügbar',
    icon: CheckCircle2,
    cls: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  reserviert: {
    label: 'Reserviert',
    icon: Clock,
    cls: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  vermietet: {
    label: 'Vermietet',
    icon: XCircle,
    cls: 'bg-gray-100 text-gray-500 border-gray-200',
  },
};

/**
 * OccupancyBadge
 * Props:
 *   status: 'frei' | 'reserviert' | 'vermietet'
 */
export default function OccupancyBadge({ status }) {
  const cfg = BADGE_CONFIG[status] ?? BADGE_CONFIG.frei;
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold border ${cfg.cls}`}
    >
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}
