import React, { useState } from 'react';
import { LogOut, Building2, Users, FolderOpen, ImageIcon, Shield, Settings } from 'lucide-react';
import PropertiesTab from '@/components/admin/PropertiesTab';
import TeamEditTab from '@/components/admin/TeamEditTab';
import ProjectsEditTab from '@/components/admin/ProjectsEditTab';
import ImagesEditTab from '@/components/admin/ImagesEditTab';
import UsersTab from '@/components/admin/UsersTab';
import SettingsTab from '@/components/admin/SettingsTab';
import { useAdminAuth } from '@/context/AdminAuthContext';

const TABS = [
  { id: 'properties', label: 'Immobilien', icon: Building2 },
  { id: 'team',       label: 'Team',       icon: Users },
  { id: 'projects',   label: 'Projekte',   icon: FolderOpen },
  { id: 'images',     label: 'Bilder',     icon: ImageIcon },
  { id: 'settings',   label: 'Einstellungen', icon: Settings },
];

export default function AdminPanel() {
  const { logout, user, isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = isAdmin ? [...TABS, { id: 'users', label: 'Benutzer', icon: Shield }] : TABS;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <p className="text-xs font-black tracking-widest text-gray-900 uppercase">HANS AMONN AG</p>
            <span className="text-gray-300">|</span>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-gray-900' : 'bg-blue-500'}`} />
              <span className="font-medium">{user?.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-gray-900 text-white' : 'bg-blue-100 text-blue-700'}`}>{isAdmin ? 'Admin' : 'Staff'}</span>
            </div>
            <button onClick={logout} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <LogOut size={15} /> Abmelden
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Inhaltsverwaltung</h1>
          <p className="text-sm text-gray-500 mt-1">Verwalten Sie alle Inhalte Ihrer Website</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab nav */}
          <div className="border-b border-gray-200 px-6 overflow-x-auto">
            <div className="flex gap-1 -mb-px">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === id
                      ? 'border-gray-900 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === 'properties' && <PropertiesTab />}
            {activeTab === 'team'       && <TeamEditTab />}
            {activeTab === 'projects'   && <ProjectsEditTab />}
            {activeTab === 'images'     && <ImagesEditTab />}
            {activeTab === 'settings'   && <SettingsTab />}
            {activeTab === 'users'      && isAdmin && <UsersTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
