import React, { useState, useEffect } from 'react';
import { LogOut, Building2, Users, FolderOpen, ImageIcon, Shield, Settings, Star, FileText, Inbox, Home, BarChart2, MessageSquare, HelpCircle, Calendar, Activity } from 'lucide-react';
import PropertiesTab from '@/components/admin/PropertiesTab';
import TeamEditTab from '@/components/admin/TeamEditTab';
import ProjectsEditTab from '@/components/admin/ProjectsEditTab';
import ImagesEditTab from '@/components/admin/ImagesEditTab';
import UsersTab from '@/components/admin/UsersTab';
import SettingsTab from '@/components/admin/SettingsTab';
import TestimonialsTab from '@/components/admin/TestimonialsTab';
import BlogTab from '@/components/admin/BlogTab';
import MietanfragenTab from '@/components/admin/MietanfragenTab';
import KontaktTab from '@/components/admin/KontaktTab';
import StatsTab from '@/components/admin/StatsTab';
import FAQTab from '@/components/admin/FAQTab';
import TermineTab from '@/components/admin/TermineTab';
import ActivityTab from '@/components/admin/ActivityTab';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { supabase } from '@/lib/supabase';

const TABS = [
  { id: 'stats',        label: 'Statistiken',   icon: BarChart2 },
  { id: 'activity',     label: 'Aktivitäten',   icon: Activity },
  { id: 'properties',   label: 'Immobilien',    icon: Building2 },
  { id: 'team',         label: 'Team',          icon: Users },
  { id: 'projects',     label: 'Projekte',      icon: FolderOpen },
  { id: 'images',       label: 'Bilder',        icon: ImageIcon },
  { id: 'mietanfragen', label: 'Anfragen',      icon: Inbox },
  { id: 'kontakt',      label: 'Kontakt',       icon: MessageSquare },
  { id: 'settings',     label: 'Einstellungen', icon: Settings },
  { id: 'testimonials', label: 'Bewertungen',   icon: Star },
  { id: 'blog',         label: 'Neuigkeiten',   icon: FileText },
  { id: 'faq',          label: 'FAQ',           icon: HelpCircle },
  { id: 'termine',      label: 'Termine',       icon: Calendar },
];

export default function AdminPanel() {
  const { logout, user, isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [quickStats, setQuickStats] = useState({ mietanfragen: 0, termine: 0, kontakt: 0 });

  useEffect(() => {
    async function loadQuickStats() {
      try {
        const [mResult, kResult] = await Promise.all([
          supabase.from('mietanfragen').select('id', { count: 'exact', head: true }).eq('status', 'neu'),
          supabase.from('kontakt_anfragen').select('id', { count: 'exact', head: true }).eq('status', 'neu'),
        ]);
        // termine: try fetching, ignore if table doesn't exist
        let termineCount = 0;
        try {
          const tResult = await supabase
            .from('termine')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'neu');
          termineCount = tResult.count ?? 0;
        } catch {
          // table may not exist
        }
        setQuickStats({
          mietanfragen: mResult.count ?? 0,
          termine: termineCount,
          kontakt: kResult.count ?? 0,
        });
      } catch {
        // ignore errors — stats are optional
      }
    }
    loadQuickStats();
  }, []);

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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Inhaltsverwaltung</h1>
          <p className="text-sm text-gray-500 mt-1">Verwalten Sie alle Inhalte Ihrer Website</p>
        </div>

        {/* Quick stats bar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab('mietanfragen')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <Inbox size={14} className="text-gray-400" />
            <span className="text-gray-600">Mietanfragen</span>
            {quickStats.mietanfragen > 0 ? (
              <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full leading-none">
                {quickStats.mietanfragen}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-full leading-none">
                {quickStats.mietanfragen}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('termine')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <Calendar size={14} className="text-gray-400" />
            <span className="text-gray-600">Termine</span>
            {quickStats.termine > 0 ? (
              <span className="px-1.5 py-0.5 bg-amber-500 text-white text-xs font-bold rounded-full leading-none">
                {quickStats.termine}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-full leading-none">
                {quickStats.termine}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('kontakt')}
            className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <MessageSquare size={14} className="text-gray-400" />
            <span className="text-gray-600">Kontaktanfragen</span>
            {quickStats.kontakt > 0 ? (
              <span className="px-1.5 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full leading-none">
                {quickStats.kontakt}
              </span>
            ) : (
              <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 text-xs font-medium rounded-full leading-none">
                {quickStats.kontakt}
              </span>
            )}
          </button>
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
            {activeTab === 'stats'         && <StatsTab />}
            {activeTab === 'activity'      && <ActivityTab />}
            {activeTab === 'properties'    && <PropertiesTab />}
            {activeTab === 'team'          && <TeamEditTab />}
            {activeTab === 'projects'      && <ProjectsEditTab />}
            {activeTab === 'images'        && <ImagesEditTab />}
            {activeTab === 'mietanfragen'  && <MietanfragenTab />}
            {activeTab === 'kontakt'       && <KontaktTab />}
            {activeTab === 'settings'      && <SettingsTab />}
            {activeTab === 'users'         && isAdmin && <UsersTab />}
            {activeTab === 'testimonials'  && <TestimonialsTab />}
            {activeTab === 'blog'          && <BlogTab />}
            {activeTab === 'faq'           && <FAQTab />}
            {activeTab === 'termine'       && <TermineTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
