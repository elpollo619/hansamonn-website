import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import LegalPage from '@/components/LegalPage';

const SECTIONS = [
  {
    title: 'Betreiberin der Website',
    body: (
      <>
        <p>
          <strong>Hans Amonn AG</strong><br />
          Blümlisalpstrasse 4<br />
          3074 Muri bei Bern<br />
          Schweiz
        </p>
        <p>
          Telefon <a href="tel:+41319518554">+41 31 951 85 54</a><br />
          E-Mail <a href="mailto:office@reto-amonn.ch">office@reto-amonn.ch</a>
        </p>
        <p>Vertretungsberechtigte Person: Reto Amonn</p>
      </>
    ),
  },
  {
    title: 'Handelsregister und Mehrwertsteuer',
    body: (
      <p>
        Eingetragen im Handelsregister des Kantons Bern<br />
        Firmennummer (CH-ID): CH-035.3.003.627-0<br />
        UID: CHE-106.957.227<br />
        MWST-Nummer: CHE-106.957.227 MWST
      </p>
    ),
  },
  {
    title: 'Haftungsausschluss',
    body: (
      <>
        <p>
          Wir prüfen die Inhalte dieser Website sorgfältig, übernehmen aber keine Gewähr für Richtigkeit,
          Vollständigkeit und Aktualität. Preise und Verfügbarkeiten sind unverbindlich; massgebend ist die
          schriftliche Offerte oder der Vertrag.
        </p>
        <p>
          Für die Inhalte verlinkter Websites sind ausschliesslich deren Betreiber verantwortlich.
        </p>
      </>
    ),
  },
  {
    title: 'Urheberrechte',
    body: (
      <>
        <p>
          Texte, Pläne, 3D-Modelle, Visualisierungen und Fotos auf dieser Website sind urheberrechtlich
          geschützt. Jede Verwendung ausserhalb der gesetzlichen Schranken braucht die schriftliche Zustimmung
          der Hans Amonn AG oder der jeweiligen Rechteinhaber.
        </p>
        <p>Die Rechte an Fotos, Plänen und 3D-Modellen liegen bei der Hans Amonn AG oder bei den jeweiligen Urheberinnen und Urhebern.</p>
      </>
    ),
  },
  {
    title: 'Datenschutz',
    body: (
      <p>
        Wie wir Personendaten bearbeiten, lesen Sie in unserer <Link to="/datenschutz">Datenschutzerklärung</Link>.
      </p>
    ),
  },
];

const ImpressumPage = () => (
  <>
    <Helmet>
      <title>Impressum | Hans Amonn AG</title>
      <meta name="description" content="Impressum der Hans Amonn AG, Muri bei Bern: Kontakt, Handelsregister, UID und MWST-Nummer." />
    </Helmet>
    <LegalPage title="Impressum" sections={SECTIONS} />
  </>
);

export default ImpressumPage;
