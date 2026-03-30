import React from 'react';
import { User, Building, Image, Building2 } from 'lucide-react';

const AdminTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'properties', label: 'Immobilien', icon: Building2 },
    { id: 'team', label: 'Team bearbeiten', icon: User },
    { id: 'projects', label: 'Projekte bearbeiten', icon: Building },
    { id: 'images', label: 'Bilder verwalten', icon: Image }
  ];

  return (
    <div className="border-b border-gray-200">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center whitespace-nowrap px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-gray-900 bg-gray-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon size={16} className="mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminTabs;
