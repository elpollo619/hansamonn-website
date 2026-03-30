import React, { useState, useEffect } from 'react';
import {
  MessageCircle, Mail, Phone, MapPin, Clock,
  Save, RotateCcw, CheckCircle2, Building2, Bell,
  Palette, Link as LinkIcon, Calendar, ChevronDown, ChevronUp,
  Home, Info,
} from 'lucide-react';
import { getSettings, saveSettings, DEFAULT_SETTINGS } from '@/data/settingsStore';

const inputCls =
  'w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D3D78] transition bg-white';
const labelCls = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5';

function SettingField({ icon: Icon, label, name, value, onChange, placeholder, hint, type = 'text' }) {
  return (
    <div>
      <label className={labelCls}>
        <span className="inline-flex items-center gap-1.5">
          {Icon && <Icon size={11} />}
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

function SectionHeader({ icon: Icon, label }) {
  return (
    <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
      <span className="w-6 h-6 bg-gray-100 flex items-center justify-center">
        <Icon size={13} className="text-gray-600" />
      </span>
      {label}
    </h3>
  );
}

function GuideBox({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 bg-gray-50 text-sm">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-left text-gray-700 font-medium hover:bg-gray-100 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Info size={14} style={{ color: 'var(--brand-color, #1D3D78)' }} />
          Anleitung: iCal-URL einrichten
        </span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="px-4 py-3 border-t border-gray-200 text-gray-600 leading-relaxed space-y-2 text-xs">
          {children}
        </div>
      )}
    </div>
  );
}

export default function SettingsTab() {
  const [form, setForm]   = useState(getSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => { setForm(getSettings()); }, []);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    saveSettings(form);
    // Update CSS variable immediately
    document.documentElement.style.setProperty('--brand-color', form.brandColor || '#1D3D78');
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
          Kontaktdaten, Branding und Inhalte — sofort auf der ganzen Website aktualisiert.
        </p>
      </div>

      {/* ── Design & Branding ── */}
      <section>
        <SectionHeader icon={Palette} label="Design & Branding" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
          <div>
            <label className={labelCls}>
              <span className="inline-flex items-center gap-1.5"><Palette size={11} />Primärfarbe (Brand-Farbe)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.brandColor || '#1D3D78'}
                onChange={(e) => set('brandColor', e.target.value)}
                className="w-12 h-10 border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
              <input
                type="text"
                value={form.brandColor || '#1D3D78'}
                onChange={(e) => set('brandColor', e.target.value)}
                className={`${inputCls} flex-1`}
                placeholder="#1D3D78"
                maxLength={7}
              />
              <button
                type="button"
                onClick={() => set('brandColor', DEFAULT_SETTINGS.brandColor)}
                className="text-xs text-gray-400 hover:text-gray-700 whitespace-nowrap border border-gray-200 px-2 py-1 transition-colors"
              >
                Standard
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Nach dem Speichern wird die Farbe sofort im Admin angezeigt. Für die öffentliche Website ist ein Browser-Refresh erforderlich.
            </p>
          </div>
        </div>
      </section>

      {/* ── Homepage Hero ── */}
      <section>
        <SectionHeader icon={Home} label="Homepage Hero-Bereich" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
          <SettingField
            icon={null}
            label="Haupttitel (H1)"
            name="heroHeadline"
            value={form.heroHeadline || ''}
            onChange={set}
            placeholder="Ihr Zuhause in der Region Bern"
          />
          <div>
            <label className={labelCls}>Untertitel</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-none`}
              value={form.heroSubtitle || ''}
              onChange={(e) => set('heroSubtitle', e.target.value)}
              placeholder="Vom möblierten Long Stay bis zum Ferienhaus am Lago Maggiore…"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <SettingField
              icon={null}
              label="CTA-Button Text"
              name="heroCtaLabel"
              value={form.heroCtaLabel || ''}
              onChange={set}
              placeholder="Alle Angebote entdecken"
            />
            <SettingField
              icon={LinkIcon}
              label="CTA-Button Link"
              name="heroCtaLink"
              value={form.heroCtaLink || ''}
              onChange={set}
              placeholder="/immobilien"
            />
          </div>
          <p className="text-xs text-gray-400">
            Der <strong>Untertitel</strong> erscheint live im Streifen oben auf der Startseite. Haupttitel, CTA-Text und CTA-Link sind für zukünftige Erweiterungen vorgesehen.
          </p>
        </div>
      </section>

      {/* ── WhatsApp ── */}
      <section>
        <SectionHeader icon={MessageCircle} label="WhatsApp" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
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
              <span className="inline-flex items-center gap-1.5"><MessageCircle size={11} />Standardnachricht</span>
            </label>
            <textarea
              rows={2}
              className={`${inputCls} resize-none`}
              value={form.whatsappMessage}
              onChange={(e) => set('whatsappMessage', e.target.value)}
              placeholder="Hallo, ich interessiere mich für Ihre Angebote."
            />
          </div>
          <div className="text-xs text-gray-400 bg-white border border-gray-100 px-3 py-2 flex items-start gap-2 break-all">
            <span className="flex-shrink-0 font-semibold text-gray-500">Vorschau:</span>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--brand-color, #1D3D78)' }}>
              {waUrl}
            </a>
          </div>
        </div>
      </section>

      {/* ── Kontakt ── */}
      <section>
        <SectionHeader icon={Phone} label="Kontaktdaten" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
          <SettingField icon={Phone} label="Telefon" name="phone" value={form.phone} onChange={set} placeholder="+41 (0)31 951 85 54" />
          <SettingField icon={Mail} label="E-Mail" name="email" value={form.email} onChange={set} placeholder="office@reto-amonn.ch" type="email" />
          <SettingField icon={Clock} label="Öffnungszeiten" name="hours" value={form.hours} onChange={set} placeholder="Mo–Fr 08:00–12:00, 13:30–17:30" />
        </div>
      </section>

      {/* ── Firma ── */}
      <section>
        <SectionHeader icon={Building2} label="Firmenadresse" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
          <SettingField icon={Building2} label="Firmenname" name="companyName" value={form.companyName} onChange={set} placeholder="Hans Amonn AG" />
          <SettingField icon={MapPin} label="Adresse" name="address" value={form.address} onChange={set} placeholder="Blümlisalpstrasse 4, 3074 Muri bei Bern" />
        </div>
      </section>

      {/* ── iCal / Kalender-Integration ── */}
      <section>
        <SectionHeader icon={Calendar} label="Kalender-Integration (iCal)" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
          <SettingField
            icon={LinkIcon}
            label="Casa Reto — iCal-URL"
            name="casaRetoIcalUrl"
            value={form.casaRetoIcalUrl || ''}
            onChange={set}
            placeholder="https://www.airbnb.com/calendar/ical/XXXXXX.ics?t=..."
            hint="Fügen Sie hier den iCal-Export-Link Ihrer Buchungsplattform ein (Airbnb, Booking.com, etc.)"
          />

          <GuideBox>
            <p className="font-semibold text-gray-700 mb-1">Schritt-für-Schritt: iCal-URL von Airbnb einrichten</p>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Melden Sie sich bei <strong>airbnb.com</strong> an und öffnen Sie Ihr Inserat.</li>
              <li>Gehen Sie zu <strong>Kalender → Verfügbarkeit</strong>.</li>
              <li>Scrollen Sie zum Abschnitt <strong>„Kalender exportieren"</strong> oder <strong>„iCal-Link"</strong>.</li>
              <li>Kopieren Sie die URL (endet auf <code className="bg-gray-200 px-1">.ics?t=...</code>).</li>
              <li>Fügen Sie diese URL in das Feld oben ein und speichern Sie.</li>
            </ol>
            <p className="mt-2 font-semibold text-gray-700">Für Booking.com:</p>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Gehen Sie zur <strong>Extranet-Seite</strong> Ihrer Unterkunft.</li>
              <li>Klicken Sie auf <strong>Kalender → Synchronisierung</strong>.</li>
              <li>Wählen Sie <strong>„Kalender exportieren (iCal)"</strong>.</li>
              <li>Kopieren Sie die generierte URL und fügen Sie sie oben ein.</li>
            </ol>
            <p className="mt-2 text-gray-500">
              Die iCal-URL wird automatisch vom Verfügbarkeitskalender auf der Website gelesen, um belegte Daten auszublenden.
            </p>
          </GuideBox>
        </div>
      </section>

      {/* ── E-Mail Benachrichtigungen ── */}
      <section>
        <SectionHeader icon={Bell} label="E-Mail Benachrichtigungen" />
        <div className="space-y-4 bg-gray-50 p-4 border border-gray-100">
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
                  form[key] ? '' : 'bg-gray-300'
                }`}
                style={form[key] ? { backgroundColor: 'var(--brand-color, #1D3D78)' } : {}}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    form[key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}

          <div className="pt-2 border-t border-gray-200">
            <label className={labelCls}>
              <span className="inline-flex items-center gap-1.5"><Mail size={11} />Benachrichtigungen senden an</span>
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
          className="inline-flex items-center gap-2 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
        >
          {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
          {saved ? 'Gespeichert!' : 'Speichern'}
        </button>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 font-medium px-4 py-2.5 text-sm transition-colors"
        >
          <RotateCcw size={14} />
          Zurücksetzen
        </button>
      </div>

    </div>
  );
}
