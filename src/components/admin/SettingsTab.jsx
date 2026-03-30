import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Mail, Phone, MapPin, Clock,
  Save, RotateCcw, CheckCircle2, Building2, Bell,
} from 'lucide-react';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '@/data/settingsStore';

const inputCls =
  'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

function SettingField({ icon: Icon, label, name, value, onChange, placeholder, hint, type = 'text' }) {
  return (
    <div>
      <label className={labelCls}>
        <span className="inline-flex items-center gap-1.5">
          <Icon size={11} />
          {label}
        </span>
      </label>
      <input
        type={type}
        className={inputCls}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

export default function SettingsTab() {
  const [form, setForm]     = useState(getSettings());
  const [saved, setSaved]   = useState(false);

  useEffect(() => { setForm(getSettings()); }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    saveSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!window.confirm('Alle Einstellungen auf Standardwerte zurücksetzen?')) return;
    setForm({ ...DEFAULT_SETTINGS });
    saveSettings(DEFAULT_SETTINGS);
  };

  // Live WhatsApp URL preview
  const waUrl = `https://wa.me/${form.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(form.whatsappMessage)}`;

  return (
    <div className="max-w-2xl space-y-8">

      <div>
        <h2 className="text-lg font-bold text-gray-900">Website-Einstellungen</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Kontaktdaten, WhatsApp und allgemeine Angaben — sofort auf der ganzen Website aktualisiert.
        </p>
      </div>

      {/* ── WhatsApp ── */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
            <MessageCircle size={13} className="text-green-600" />
          </span>
          WhatsApp
        </h3>
        <div className="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <SettingField
            icon={MessageCircle}
            label="WhatsApp-Nummer"
            name="whatsappNumber"
            value={form.whatsappNumber}
            onChange={set}
            placeholder="41775350668"
            hint="Nummer ohne + und ohne Leerzeichen. Beispiel: 41775350668 für +41 77 535 06 68"
          />
          <div>
            <label className={labelCls}>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle size={11} />
                Standardnachricht
              </span>
            </label>
            <textarea
              rows={2}
              className={inputCls + ' resize-none'}
              value={form.whatsappMessage}
              onChange={(e) => set('whatsappMessage', e.target.value)}
              placeholder="Hallo, ich interessiere mich für Ihre Angebote."
            />
          </div>
          <div className="text-xs text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-2 flex items-start gap-2 break-all">
            <span className="flex-shrink-0 font-semibold text-gray-500">Vorschau:</span>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              {waUrl}
            </a>
          </div>
        </div>
      </section>

      {/* ── Kontakt ── */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
            <Phone size={13} className="text-blue-600" />
          </span>
          Kontaktdaten
        </h3>
        <div className="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <SettingField
            icon={Phone}
            label="Telefon"
            name="phone"
            value={form.phone}
            onChange={set}
            placeholder="+41 (0)31 951 85 54"
          />
          <SettingField
            icon={Mail}
            label="E-Mail"
            name="email"
            value={form.email}
            onChange={set}
            placeholder="office@reto-amonn.ch"
            type="email"
          />
          <SettingField
            icon={Clock}
            label="Öffnungszeiten"
            name="hours"
            value={form.hours}
            onChange={set}
            placeholder="Mo–Fr 08:00–12:00, 13:30–17:30"
          />
        </div>
      </section>

      {/* ── Firma ── */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
            <Building2 size={13} className="text-gray-600" />
          </span>
          Firmenadresse
        </h3>
        <div className="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <SettingField
            icon={Building2}
            label="Firmenname"
            name="companyName"
            value={form.companyName}
            onChange={set}
            placeholder="Hans Amonn AG"
          />
          <SettingField
            icon={MapPin}
            label="Adresse"
            name="address"
            value={form.address}
            onChange={set}
            placeholder="Blümlisalpstrasse 4, 3074 Muri bei Bern"
          />
        </div>
      </section>

      {/* ── E-Mail Benachrichtigungen ── */}
      <section>
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-amber-100 flex items-center justify-center">
            <Bell size={13} className="text-amber-600" />
          </span>
          E-Mail Benachrichtigungen
        </h3>
        <div className="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          {/* Toggle switches */}
          {[
            { key: 'notifyMietanfragen', label: 'Neue Mietanfragen' },
            { key: 'notifyKontakt',      label: 'Neue Kontaktanfragen' },
            { key: 'notifyTermine',      label: 'Neue Terminanfragen' },
            { key: 'notifyNewsletter',   label: 'Newsletter Anmeldungen' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{label}</span>
              <button
                type="button"
                onClick={() => set(key, !form[key])}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                  form[key] ? 'bg-amber-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}

          {/* Notification email */}
          <div className="pt-2 border-t border-gray-200">
            <label className={labelCls}>
              <span className="inline-flex items-center gap-1.5">
                <Mail size={11} />
                Benachrichtigungen senden an
              </span>
            </label>
            <input
              type="email"
              className={inputCls}
              value={form.notificationEmail ?? ''}
              onChange={(e) => set('notificationEmail', e.target.value)}
              placeholder="office@reto-amonn.ch"
            />
            <p className="text-xs text-gray-400 mt-1">
              An diese Adresse werden E-Mail-Benachrichtigungen gesendet.
            </p>
          </div>
        </div>
      </section>

      {/* ── Actions ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? 'Gespeichert!' : 'Speichern'}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-medium px-4 py-2.5 rounded-xl text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Zurücksetzen
        </button>
      </div>

    </div>
  );
}
