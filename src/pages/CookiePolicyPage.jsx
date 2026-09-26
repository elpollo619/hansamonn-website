import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';
import { openCookieSettings } from '@/lib/consent';

const ROWS = [
  ['Notwendig', 'ha_cookie_consent', 'Ihre Cookie-Auswahl und deren Datum', 'Local Storage, bis zur Änderung'],
  ['Notwendig', 'ha_lang', 'gewählte Sprache', 'Local Storage, bis zur Löschung'],
  ['Funktional', 'ha_favorites_v1, ha_comparison_v1, ha_recently_viewed', 'Merkliste, Objektvergleich, zuletzt angesehene Objekte', 'Local Storage, bis zur Löschung'],
  ['Funktional', 'ha_properties_v3, ha_projects_v10, ha_team_v6, ha_settings_v2', 'Zwischenspeicher der Website-Inhalte für schnelleres Laden', 'Local Storage, bis zur Löschung'],
  ['Funktional', 'Service Worker «ha-v2»', 'Startseite im Browser-Cache, damit die Website schneller lädt', 'Browser-Cache, bis zur Löschung'],
  ['Nur Verwaltung', 'ha_admin_user', 'Anmeldung von Mitarbeitenden im Verwaltungsbereich', 'Session Storage, bis der Tab geschlossen wird'],
  ['Statistik (Einwilligung)', '_ga, _ga_*', 'Google Analytics 4: Zählung von Besuchen und Seitenaufrufen', 'Cookie, bis 2 Jahre'],
  ['Externe Inhalte (Einwilligung)', 'Cookies von Google, YouTube, Vimeo, Matterport', 'Google Maps, Videos und Rundgänge von Drittanbietern', 'gemäss Anbieter'],
];

const SECTIONS = [
  {
    title: '1. Worum es geht',
    body: (
      <p>
        Diese Richtlinie erklärt, welche Cookies und ähnlichen Techniken (Local Storage, Session Storage,
        Browser-Cache) www.hansamonn.ch verwendet, wofür und wie lange. Ergänzend gilt unsere{' '}
        <Link to="/datenschutz">Datenschutzerklärung</Link>.
      </p>
    ),
  },
  {
    title: '2. Wann wir Ihre Einwilligung einholen',
    body: (
      <>
        <p>
          Notwendige und funktionale Speicherungen setzen wir ohne Einwilligung. Sie bleiben auf Ihrem Gerät und
          werden nicht an uns übermittelt.
        </p>
        <p>
          Google Analytics und externe Inhalte (Google Maps, Videos, virtuelle Rundgänge) laden wir erst, wenn Sie
          im Cookie-Banner zustimmen oder bei einem einzelnen Inhalt auf «laden» klicken. Das entspricht dem
          Schweizer Fernmeldegesetz (Art. 45c FMG) und den strengeren Regeln der EU für Besucherinnen und Besucher
          aus dem EWR.
        </p>
        <p>
          Ihre Wahl können Sie jederzeit ändern oder widerrufen:{' '}
          <button type="button" onClick={openCookieSettings} className="underline text-gray-800">Cookie-Einstellungen öffnen</button>.
          Beim Widerruf der Statistik löschen wir die Analyse-Cookies.
        </p>
      </>
    ),
  },
  {
    title: '3. Übersicht',
    body: (
      <div className="overflow-x-auto -mx-1">
        <table className="w-full min-w-[560px] text-sm border-collapse">
          <caption className="sr-only">Cookies und lokale Speicherungen auf hansamonn.ch</caption>
          <thead>
            <tr className="text-left text-gray-900">
              <th scope="col" className="py-2 pr-4 font-semibold border-b border-gray-200">Kategorie</th>
              <th scope="col" className="py-2 pr-4 font-semibold border-b border-gray-200">Name</th>
              <th scope="col" className="py-2 pr-4 font-semibold border-b border-gray-200">Zweck</th>
              <th scope="col" className="py-2 font-semibold border-b border-gray-200">Art und Dauer</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([cat, name, purpose, dur]) => (
              <tr key={name} className="align-top">
                <td className="py-2.5 pr-4 border-b border-gray-100">{cat}</td>
                <td className="py-2.5 pr-4 border-b border-gray-100 font-mono text-xs break-words">{name}</td>
                <td className="py-2.5 pr-4 border-b border-gray-100">{purpose}</td>
                <td className="py-2.5 border-b border-gray-100">{dur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    title: '4. Ohne Cookies, aber mit Datenübermittlung',
    body: (
      <ul>
        <li>Kartenkacheln von OpenStreetMap und CARTO auf den Objektkarten: Ihre IP-Adresse wird an diese Anbieter übermittelt, es werden keine Cookies gesetzt.</li>
        <li>Aufrufzähler: Beim Öffnen einer Objektseite speichern wir bei unserem Dienstleister Supabase nur, welches Objekt aufgerufen wurde, ohne Angaben zu Ihrer Person.</li>
        <li>Hosting bei Vercel: technische Server-Logfiles, siehe Datenschutzerklärung Ziffer 3.</li>
      </ul>
    ),
  },
  {
    title: '5. Cookies im Browser löschen',
    body: (
      <p>
        Sie können Cookies und lokale Speicherungen jederzeit in den Einstellungen Ihres Browsers löschen oder
        blockieren. Dann gehen zum Beispiel Ihre Merkliste und Ihre Sprachwahl verloren.
      </p>
    ),
  },
];

const CookiePolicyPage = () => (
  <>
    <Helmet>
      <title>Cookie-Richtlinie | Hans Amonn AG</title>
      <meta name="description" content="Welche Cookies und lokalen Speicherungen hansamonn.ch verwendet, wofür und wie lange, und wie Sie Ihre Einwilligung ändern." />
    </Helmet>
    <LegalPage title="Cookie-Richtlinie" asOf="26. September 2026" sections={SECTIONS} />
  </>
);

export default CookiePolicyPage;
