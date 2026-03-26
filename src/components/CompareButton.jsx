import React from 'react';
import { Plus, Check } from 'lucide-react';
import { useComparison } from '@/context/ComparisonContext';

const CompareButton = ({ propertyId, propertyName }) => {
  const { isCompared, toggleCompare, compared } = useComparison();

  const active = isCompared(propertyId);
  const maxReached = compared.length >= 3 && !active;

  return (
    <button
      type="button"
      onClick={() => !maxReached && toggleCompare(propertyId)}
      disabled={maxReached}
      title={
        maxReached
          ? 'Maximal 3 Objekte vergleichbar'
          : active
          ? `${propertyName} aus Vergleich entfernen`
          : `${propertyName} zum Vergleich hinzufügen`
      }
      className={`
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
        border transition-all duration-200
        ${active
          ? 'bg-green-600 border-green-600 text-white hover:bg-green-700 hover:border-green-700'
          : maxReached
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-white border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-700 hover:bg-green-50'
        }
      `}
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
