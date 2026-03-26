import React, { useState, useEffect } from 'react';
import { LogOut, Building2, Users, FolderOpen, ImageIcon, Shield, Settings, Star, FileText, Inbox, Home, BarChart2, MessageSquare, HelpCircle, Calendar, Activity, KeyRound, X, Eye, EyeOff, Check } from 'lucide-react';
import { changeOwnPassword } from '@/data/usersStore';
import { toast } from '@/components/ui/use-toast';
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

function ChangePasswordModal({ userId, onClose }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [loading, setLoading] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (form.next !== form.confirm) {
      toast({ title: 'Passwörter stimmen nicht überein', variant: 'destructive' }); return;
    }
    setLoading(true);
    try {
      changeOwnPassword(userId, form.current, form.next);
      toast({ title: '✓ Passwort geändert', description: 'Ihr Passwort wurde erfolgreich aktualisiert.' });
      onClose();
    } catch (err) {
      toast({ title: 'Fehler', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }

  const inp = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 pr-10';
  const PasswordField = ({ field, label }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="relative">
        <input
          type={show[field] ? 'text' : 'password'}
          value={form[field]}
          onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
          className={inp}
          required
        />
        <button type="button" onClick={() => setShow(s => ({ ...s, [field]: !s[field] }))}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
          {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <KeyRound size={18} className="text-gray-700" />
            <h3 className="font-bold text-gray-900">Passwort ändern</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <PasswordField field="current" label="Aktuelles Passwort *" />
          <PasswordField field="next" label="Neues Passwort * (min. 6 Zeichen)" />
          <PasswordField field="confirm" label="Neues Passwort bestätigen *" />
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50">
              <Check size={15} /> Speichern
            </button>
            <button type="button" onClick={onClose}
              className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Abbrechen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const { logout, user, isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('stats');
  const [quickStats, setQuickStats] = useState({ mietanfragen: 0, termine: 0, kontakt: 0 });
  const [showChangePw, setShowChangePw] = useState(false);

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
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-gray-900' : 'bg-blue-500'}`} />
              <span className="font-medium">{user?.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-gray-900 text-white' : 'bg-blue-100 text-blue-700'}`}>{isAdmin ? 'Admin' : 'Staff'}</span>
            </div>
            <button
              onClick={() => setShowChangePw(true)}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
              title="Passwort ändern"
            >
              <KeyRound size={15} /> <span className="hidden sm:inline">Passwort</span>
            </button>
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

      {showChangePw && user && (
        <ChangePasswordModal userId={user.id} onClose={() => setShowChangePw(false)} />
      )}
    </div>
  );
}
