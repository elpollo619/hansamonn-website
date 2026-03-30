import React from 'react';
import { Plus, Check } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';

const CompareButton = ({ propertyId, propertyName }) => {
  const { isCompared, toggleCompare, compared } = useComparison();

  const active = isCompared(propertyId);
  const maxReached = compared.length >= 3 && !active;

  const label = maxReached
    ? 'Maximal 3 Objekte vergleichbar'
    : active
    ? `${propertyName} aus Vergleich entfernen`
    : `${propertyName} zum Vergleich hinzufügen`;

  return (
    <button
      type="button"
      onClick={() => !maxReached && toggleCompare(propertyId)}
      disabled={maxReached}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-200
        ${active
          ? 'text-white'
          : maxReached
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border-gray-300 text-gray-600 hover:border-gray-500 hover:text-gray-800 hover:bg-gray-50'
        }
      `}
      style={active ? { backgroundColor: 'var(--brand-color, #1D3D78)', borderColor: 'var(--brand-color, #1D3D78)' } : {}}
    >
      {active ? (
        <>
          <Check size={11} />
          Ausgewählt
        </>
      ) : (
        <>
          <Plus size={11} />
          Vergleichen
        </>
      )}
    </button>
  );
};

export default CompareButton;
