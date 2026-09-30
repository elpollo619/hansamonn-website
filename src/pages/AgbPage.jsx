import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';

const SECTIONS = [
  {
    title: '1. Geltungsbereich',
    body: (
      <>
        <p>
          Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung von www.hansamonn.ch sowie für
          Anfragen, Offerten und Verträge mit der Hans Amonn AG, Blümlisalpstrasse 4, 3074 Muri bei Bern
          (UID CHE-106.957.227), im Bereich Vermietung (Long Stay, N's Hotel, Casa Reto), Verkauf und Architektur.
        </p>
        <p>
          Einzelverträge gehen diesen AGB vor, insbesondere Mietverträge, Buchungsbestätigungen und
          Architekturverträge. Bei Buchungen über Airbnb, Booking.com oder my.ns-hotel.ch gelten zusätzlich die
          Bedingungen der jeweiligen Plattform.
        </p>
      </>
    ),
  },
  {
    title: '2. Angaben auf der Website',
    body: (
      <p>
        Beschreibungen, Fotos, Pläne, 3D-Modelle, Preise und Verfügbarkeiten auf der Website dienen der
        Information und sind unverbindlich. 3D-Modelle und Grundrisse sind vereinfachte Darstellungen und nicht
        massstäblich verbindlich. Massgebend ist die schriftliche Offerte, die Buchungsbestätigung oder der Vertrag.
      </p>
    ),
  },
  {
    title: '3. Anfragen und Vertragsabschluss',
    body: (
      <>
        <p>
          Anfragen über die Formulare der Website sind unverbindlich, für Sie und für uns. Ein Vertrag kommt erst
          zustande, wenn wir Ihre Buchung schriftlich bestätigen oder ein Vertrag von beiden Seiten unterzeichnet ist.
        </p>
        <p>
          Mietverträge für möblierte Zimmer (Long Stay) werden schriftlich abgeschlossen. Die Hausordnung des
          jeweiligen Objekts ist Bestandteil des Mietvertrags und wird mit diesem übergeben.
        </p>
      </>
    ),
  },
  {
    title: '4. Preise und Abgaben',
    body: (
      <p>
        Alle Preise verstehen sich in Schweizer Franken (CHF). Kurtaxen und Aufenthaltstaxen der Kantone und
        Gemeinden werden, soweit sie anfallen, zusätzlich erhoben und separat ausgewiesen. Die verbindlichen
        Preise und allfällige Nebenkosten (zum Beispiel Endreinigung oder Parkplatz) nennen wir in der Offerte
        oder im Vertrag.
      </p>
    ),
  },
  {
    title: '5. Stornierung und Rückerstattung',
    body: (
      <p>
        Es gelten unsere <Link to="/stornierung">Stornierungs- und Rückerstattungsbedingungen</Link>.
      </p>
    ),
  },
  {
    title: '6. Pflichten der Gäste und Mieter',
    body: (
      <p>
        Gäste und Mieter behandeln die Räume und das Inventar sorgfältig, halten die Hausordnung und die
        vereinbarte Höchstzahl an Personen ein und melden Schäden umgehend. Für Schäden, die sie oder ihre
        Begleitpersonen verursachen, haften sie nach den gesetzlichen Bestimmungen. Ausländische Gäste sind
        verpflichtet, uns die für die gesetzliche Gästemeldung nötigen Angaben zu machen (Art. 16 AIG).
      </p>
    ),
  },
  {
    title: '7. Haftung',
    body: (
      <p>
        Wir haften für Schäden, die wir vorsätzlich oder grobfahrlässig verursachen. Soweit gesetzlich zulässig,
        ist jede weitere Haftung ausgeschlossen, insbesondere für leichte Fahrlässigkeit, für Folgeschäden und für
        Unterbrüche der Website. Zwingende gesetzliche Haftungsbestimmungen bleiben vorbehalten.
      </p>
    ),
  },
  {
    title: '8. Urheberrechte',
    body: (
      <p>
        Texte, Fotos, Pläne und 3D-Modelle dieser Website sind urheberrechtlich geschützt. Ohne schriftliche
        Zustimmung dürfen sie nicht kopiert, verbreitet oder anderweitig verwendet werden.
      </p>
    ),
  },
  {
    title: '9. Datenschutz',
    body: (
      <p>
        Wie wir Personendaten bearbeiten, beschreibt unsere <Link to="/datenschutz">Datenschutzerklärung</Link>.
        Zu Cookies und lokaler Speicherung siehe die <Link to="/cookies">Cookie-Richtlinie</Link>.
      </p>
    ),
  },
  {
    title: '10. Anwendbares Recht und Gerichtsstand',
    body: (
      <p>
        Es gilt schweizerisches Recht. Gerichtsstand ist, soweit gesetzlich zulässig, der Sitz der Hans Amonn AG
        in Muri bei Bern. Zwingende Gerichtsstände, etwa für Konsumentinnen und Konsumenten oder für die Miete
        von Wohnräumen am Ort der Sache, bleiben vorbehalten.
      </p>
    ),
  },
  {
    title: '11. Änderungen',
    body: (
      <p>
        Wir können diese AGB jederzeit anpassen. Für bestehende Verträge gilt die Fassung, die bei
        Vertragsabschluss gültig war.
      </p>
    ),
  },
];

const AgbPage = () => (
  <>
    <Helmet>
      <title>AGB | Hans Amonn AG</title>
      <meta name="description" content="Allgemeine Geschäftsbedingungen der Hans Amonn AG für die Website, Anfragen, Vermietung und Buchungen." />
    </Helmet>
    <LegalPage title="Allgemeine Geschäftsbedingungen" asOf="26. September 2026" sections={SECTIONS} />
  </>
);

export default AgbPage;
