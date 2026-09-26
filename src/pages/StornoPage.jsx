import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';

const MAIL = <a href="mailto:office@reto-amonn.ch">office@reto-amonn.ch</a>;

const SECTIONS = [
  {
    title: '1. Kein gesetzliches Widerrufsrecht',
    body: (
      <p>
        Das Schweizer Recht kennt für online abgeschlossene Beherbergungs- und Mietverträge kein allgemeines
        Widerrufsrecht. Auch nach EU-Recht besteht bei Unterkünften für einen bestimmten Zeitraum kein
        Widerrufsrecht. Ob und zu welchen Bedingungen Sie kostenlos stornieren können, richtet sich deshalb nach
        den Bedingungen Ihrer Buchung.
      </p>
    ),
  },
  {
    title: '2. Buchungen über Airbnb, Booking.com oder my.ns-hotel.ch',
    body: (
      <p>
        Es gelten die Stornierungsbedingungen, die Ihnen die Plattform vor dem Abschluss der Buchung anzeigt und
        in der Buchungsbestätigung nennt. Stornierungen und Rückerstattungen wickelt die jeweilige Plattform ab.
        Bei Fragen helfen wir gerne: {MAIL}.
      </p>
    ),
  },
  {
    title: '3. Direkte Buchungen bei uns',
    body: (
      <>
        <p>
          Bei Buchungen direkt bei uns, zum Beispiel für die Casa Reto über unser Anfrageformular, nennen wir die
          Stornierungsbedingungen in unserer schriftlichen Offerte. Sie gelten, sobald Sie die Buchung bestätigen.
        </p>
        <p>
          Bitte stornieren Sie schriftlich per E-Mail an {MAIL}. Massgebend ist der Eingang Ihrer Nachricht.
          Rückerstattungen überweisen wir auf das Konto, von dem Sie bezahlt haben.
        </p>
      </>
    ),
  },
  {
    title: '4. Long Stay (Mietverträge)',
    body: (
      <p>
        Für möblierte Zimmer im Long Stay gelten die Kündigungsfristen und Regeln Ihres Mietvertrags sowie das
        Mietrecht des Obligationenrechts (Art. 253 ff. OR). Eine allfällige Kaution zahlen wir nach der Rückgabe
        des Zimmers und der Abrechnung gemäss Mietvertrag zurück.
      </p>
    ),
  },
  {
    title: '5. Architektur und Planung',
    body: (
      <p>
        Leistungen der Architektur und Planung rechnen wir nach dem jeweiligen Vertrag ab. Die Beendigung eines
        solchen Auftrags richtet sich nach dem Vertrag und dem Obligationenrecht.
      </p>
    ),
  },
  {
    title: '6. Wenn wir absagen müssen',
    body: (
      <p>
        Können wir eine bestätigte Buchung aus Gründen, die bei uns liegen, nicht erfüllen, erstatten wir bereits
        bezahlte Beträge vollständig zurück. Weitergehende Ansprüche richten sich nach dem Gesetz.
      </p>
    ),
  },
  {
    title: '7. Weitere Bedingungen',
    body: (
      <p>
        Im Übrigen gelten unsere <Link to="/agb">Allgemeinen Geschäftsbedingungen</Link>.
      </p>
    ),
  },
];

const StornoPage = () => (
  <>
    <Helmet>
      <title>Stornierung und Rückerstattung | Hans Amonn AG</title>
      <meta name="description" content="Stornierungs- und Rückerstattungsbedingungen der Hans Amonn AG für Buchungen über Plattformen, Direktbuchungen und Long Stay." />
    </Helmet>
    <LegalPage title="Stornierung & Rückerstattung" asOf="26. September 2026" sections={SECTIONS} />
  </>
);

export default StornoPage;
