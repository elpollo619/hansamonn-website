import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';
import { openCookieSettings } from '@/lib/consent';

const MAIL = <a href="mailto:office@reto-amonn.ch">office@reto-amonn.ch</a>;

const SECTIONS = [
  {
    title: '1. Verantwortliche Stelle',
    body: (
      <>
        <p>
          Hans Amonn AG, Blümlisalpstrasse 4, 3074 Muri bei Bern, Schweiz<br />
          Telefon +41 31 951 85 54, E-Mail {MAIL}, UID CHE-106.957.227
        </p>
        <p>Anfragen zum Datenschutz richten Sie bitte an {MAIL} (Betreff «Datenschutz»).</p>
      </>
    ),
  },
  {
    title: '2. Geltungsbereich',
    body: (
      <p>
        Diese Erklärung gilt für www.hansamonn.ch sowie für Anfragen, Mietbewerbungen, Buchungen und
        Aufenthalte (Long Stay, N's Hotel, Casa Reto). Sie richtet sich nach dem Schweizer Datenschutzgesetz
        (DSG). Soweit die EU-Datenschutz-Grundverordnung (DSGVO) anwendbar ist, gilt ergänzend Ziffer 13.
      </p>
    ),
  },
  {
    title: '3. Besuch der Website',
    body: (
      <>
        <p>
          <strong>Hosting.</strong> Die Website wird bei Vercel Inc., San Francisco (USA), betrieben. Beim
          Aufruf werden technisch notwendige Daten bearbeitet: IP-Adresse, Datum und Uhrzeit, aufgerufene Seite,
          Referrer, Browser und Betriebssystem. Zweck ist die Auslieferung und Sicherheit der Website. Vercel
          ist unsere Auftragsbearbeiterin und unter dem Swiss-U.S. Data Privacy Framework zertifiziert.
        </p>
        <p>
          <strong>Speicherung im Browser.</strong> Ohne Übermittlung an uns speichern wir im Local Storage
          Ihres Browsers Ihre Cookie-Auswahl, Ihre Sprache, Ihre Merkliste, Ihren Objektvergleich und zuletzt
          angesehene Objekte. Ein Service Worker legt Seiten und Bilder im Browser-Cache ab, damit die Website
          schneller lädt. Sie können diese Daten jederzeit in Ihren Browser-Einstellungen löschen.
        </p>
        <p>
          <strong>Google Analytics, nur mit Einwilligung.</strong> Nur wenn Sie im Cookie-Banner der Statistik
          zustimmen, nutzen wir Google Analytics 4 (Google Ireland Ltd. und Google LLC, USA). Dabei werden
          Cookies gesetzt und Nutzungsdaten (aufgerufene Seiten, Verweildauer, Geräteinformationen, ungefährer
          Standort aus der IP-Adresse) an Google übermittelt, auch in die USA. Google LLC ist unter dem Data
          Privacy Framework zertifiziert. Die Daten werden bis zu 14 Monate gespeichert. Sie können Ihre
          Einwilligung jederzeit über die{' '}
          <button type="button" onClick={openCookieSettings} className="underline text-gray-800">Cookie-Einstellungen</button>{' '}
          widerrufen; die Analyse-Cookies werden dann gelöscht.
        </p>
      </>
    ),
  },
  {
    title: '4. Kontakt-, Termin- und Buchungsanfragen, Newsletter',
    body: (
      <>
        <p>
          Wenn Sie uns über ein Formular schreiben, bearbeiten wir Name, E-Mail, Telefon, Nachricht, Wunschdaten
          oder Termin, Anzahl Gäste und das betroffene Objekt. Zweck ist die Beantwortung Ihrer Anfrage, die
          Vorbereitung eines Vertrags und die Organisation von Terminen.
        </p>
        <p>
          Die Angaben werden in einer Datenbank bei Supabase Inc. (USA) gespeichert. Über den E-Mail-Dienst
          Resend (USA) erhalten wir eine Benachrichtigung; bei Objekt- und Casa-Reto-Anfragen senden wir Ihnen
          eine Eingangsbestätigung. Beide Anbieter sind unsere Auftragsbearbeiter (siehe Ziffer 10).
        </p>
        <p>
          <strong>Newsletter.</strong> Melden Sie sich an, speichern wir Ihre E-Mail-Adresse, um Sie über neue
          Angebote zu informieren. Sie können sich jederzeit abmelden, über den Link in jeder E-Mail oder mit
          einer Nachricht an {MAIL}.
        </p>
      </>
    ),
  },
  {
    title: '5. Mietbewerbungen und Aufenthalte',
    body: (
      <>
        <p>
          <strong>Mietanfrage Long Stay.</strong> Wir bearbeiten Personalien (Name, Adresse, Geburtsdatum),
          Kontaktdaten, Aufenthaltsstatus, Beruf, gewünschte Mietdauer und Ort, bei Firmenbuchungen die
          Firmenangaben, freiwillig Angaben zum Fahrzeug (für einen Parkplatz) und einen Notfallkontakt. Bitte
          informieren Sie Ihren Notfallkontakt über diese Erklärung. Zweck ist die Prüfung Ihrer Bewerbung und
          die Vorbereitung des Mietvertrags.
        </p>
        <p>
          Ausweis- und Lohnunterlagen können Sie freiwillig hochladen; wir benötigen sie erst, wenn wir Ihnen
          eine Zusage geben. Die PDF-Zusammenfassung Ihrer Anfrage wird in Ihrem Browser erstellt.
        </p>
        <p>
          <strong>Gästemeldung und Tourismusabgaben.</strong> Ausländische Gäste müssen wir mit einem
          Meldeschein der zuständigen kantonalen Behörde melden (Art. 16 AIG, Art. 18 VZAE); dazu bearbeiten wir
          die Angaben aus Ihrem Ausweis. Für die Kurtaxe und Aufenthaltstaxe melden wir die Übernachtungen und,
          soweit nötig, Angaben zu den Gästen an die zuständigen Stellen der Kantone Tessin, Freiburg und Bern.
        </p>
        <p>
          <strong>Buchungsplattformen.</strong> Buchen Sie über Airbnb, Booking.com oder my.ns-hotel.ch,
          bearbeitet der jeweilige Anbieter Ihre Daten in eigener Verantwortung. Wir erhalten die Daten, die für
          Ihren Aufenthalt nötig sind.
        </p>
      </>
    ),
  },
  {
    title: '6. Karten, eingebettete Inhalte und Links',
    body: (
      <>
        <p>
          <strong>Karten.</strong> Unsere Objektkarten nutzen Leaflet (auf unserem Server) mit Kartenkacheln
          von OpenStreetMap (OpenStreetMap Foundation, Vereinigtes Königreich) und CARTO (Spanien). Beim Laden
          der Karte wird Ihre IP-Adresse an diese Anbieter übermittelt.
        </p>
        <p>
          <strong>Google Maps und Videos</strong> (Google LLC, USA; YouTube; Vimeo; Matterport) laden wir erst,
          wenn Sie auf «Karte laden» oder «Video laden» klicken oder externe Inhalte in den Cookie-Einstellungen
          erlaubt haben. Dabei werden Ihre IP-Adresse und gegebenenfalls Cookies an den Anbieter übermittelt.
        </p>
        <p>
          <strong>Verfügbarkeitskalender Casa Reto.</strong> Unser Server ruft den Belegungskalender von Airbnb
          ab und zeigt nur belegte Daten an. Von Ihnen werden dabei keine Daten an Airbnb übermittelt.
        </p>
        <p>
          <strong>Links.</strong> WhatsApp-, Teilen- und Plattform-Links (Airbnb, Booking.com, Instagram,
          Facebook, LinkedIn) sind einfache Links. Daten fliessen erst nach Ihrem Klick, und zwar an den
          jeweiligen Anbieter.
        </p>
        <p>
          Der Chat-Assistent läuft vollständig in Ihrem Browser; Ihre Eingaben werden nicht übermittelt.
          Schriften sind lokal eingebunden, es besteht keine Verbindung zu Google Fonts.
        </p>
      </>
    ),
  },
  {
    title: '7. Rechtfertigung',
    body: (
      <p>
        Wir bearbeiten Personendaten, um Verträge anzubahnen und abzuwickeln, um gesetzliche Pflichten zu
        erfüllen (Gästemeldung, Tourismusabgaben, Aufbewahrung), mit Ihrer Einwilligung (Newsletter,
        Webanalyse, externe Inhalte) oder aufgrund überwiegender Interessen (sicherer Betrieb der Website,
        Beantwortung von Anfragen).
      </p>
    ),
  },
  {
    title: '8. Empfänger',
    body: (
      <p>
        Unsere Mitarbeitenden, soweit sie die Daten für ihre Aufgabe brauchen; unsere Auftragsbearbeiter
        (Vercel, Supabase, Resend, mit Einwilligung Google); Behörden und Tourismusorganisationen, soweit das
        Gesetz es verlangt; bei Buchungen die jeweilige Plattform. Wir verkaufen keine Daten.
      </p>
    ),
  },
  {
    title: '9. Aufbewahrung',
    body: (
      <ul>
        <li>Kontakt- und Terminanfragen: 12 Monate nach Abschluss.</li>
        <li>Nicht berücksichtigte Mietbewerbungen: Löschung spätestens 3 Monate nach dem Entscheid.</li>
        <li>Mieter- und Gästedaten: für die Vertragsdauer und danach gemäss gesetzlichen Pflichten (Geschäftsbücher und Belege 10 Jahre, Art. 958f OR; Meldescheine nach kantonalen Vorgaben).</li>
        <li>Newsletter: bis zur Abmeldung.</li>
        <li>Analysedaten: siehe Ziffer 3.</li>
      </ul>
    ),
  },
  {
    title: '10. Bekanntgabe ins Ausland',
    body: (
      <p>
        USA: Vercel und Google LLC (Data Privacy Framework), Supabase und Resend (EU-Standardvertragsklauseln
        mit Anpassungen für die Schweiz, Art. 16 Abs. 2 lit. d DSG). EU/EWR und Vereinigtes Königreich:
        angemessener Datenschutz gemäss Anhang 1 der Datenschutzverordnung. Bei Buchungen über internationale
        Plattformen erfolgt die Bekanntgabe zur Abwicklung des Vertrags (Art. 17 Abs. 1 lit. b DSG).
      </p>
    ),
  },
  {
    title: '11. Datensicherheit',
    body: (
      <p>
        Wir schützen Ihre Daten mit angemessenen technischen und organisatorischen Massnahmen, unter anderem
        verschlüsselter Übertragung (HTTPS) und beschränkten Zugriffsrechten.
      </p>
    ),
  },
  {
    title: '12. Ihre Rechte',
    body: (
      <p>
        Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung und Widerspruch, auf
        Herausgabe oder Übertragung Ihrer Daten und auf Widerruf einer Einwilligung für die Zukunft. Schreiben
        Sie an {MAIL}; wir können einen Identitätsnachweis verlangen. Sie können sich zudem beim Eidgenössischen
        Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB), Feldeggweg 1, 3003 Bern,{' '}
        <a href="https://www.edoeb.admin.ch" target="_blank" rel="noreferrer">www.edoeb.admin.ch</a>, beschweren.
      </p>
    ),
  },
  {
    title: '13. Hinweise für Personen in der EU und im EWR',
    body: (
      <p>
        Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO (Anfragen, Bewerbungen, Buchungen), lit. c
        (Gästemeldung, Aufbewahrung), lit. a (Newsletter, Google Analytics, externe Inhalte) und lit. f (Betrieb
        der Website, allgemeine Anfragen). Für die Schweiz besteht ein Angemessenheitsbeschluss der
        EU-Kommission; Übermittlungen in die USA stützen sich auf das EU-U.S. Data Privacy Framework oder auf
        Standardvertragsklauseln. Sie haben die Rechte nach Art. 15 bis 21 DSGVO, können Einwilligungen
        jederzeit widerrufen (Art. 7 Abs. 3) und sich bei der Aufsichtsbehörde Ihres Aufenthaltsstaats
        beschweren. Wir treffen keine automatisierten Einzelentscheidungen (Art. 22).
      </p>
    ),
  },
  {
    title: '14. Änderungen',
    body: (
      <p>
        Wir können diese Erklärung jederzeit anpassen. Es gilt die auf dieser Website veröffentlichte Fassung.
        Angaben zur Betreiberin finden Sie im <Link to="/impressum">Impressum</Link>.
      </p>
    ),
  },
];

const PrivacyPolicyPage = () => (
  <>
    <Helmet>
      <title>Datenschutzerklärung | Hans Amonn AG</title>
      <meta name="description" content="Datenschutzerklärung der Hans Amonn AG nach Schweizer DSG: welche Daten wir bearbeiten, wofür, bei welchen Dienstleistern und welche Rechte Sie haben." />
    </Helmet>
    <LegalPage title="Datenschutzerklärung" asOf="26. September 2026" sections={SECTIONS} />
  </>
);

export default PrivacyPolicyPage;
