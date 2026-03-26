import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, X, Send, Bot, User, ArrowRight,
  Globe, ChevronDown, Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Multilingual knowledge base ─────────────────────────────────────────────

const KB = {
  de: {
    welcome: 'Guten Tag! Ich bin der digitale Assistent von Hans Amonn AG — Architektur & Immobilien. Womit kann ich Ihnen helfen?',
    placeholder: 'Ihre Frage…',
    suggestionsLabel: 'Häufige Fragen',
    fallback: 'Zu dieser Frage helfe ich Ihnen am besten persönlich weiter. Schreiben Sie uns an office@reto-amonn.ch oder rufen Sie +41 (0)31 951 85 54 an — Mo–Fr 08:00–17:00 Uhr. Sie können auch eine Mietanfrage direkt online stellen.',
    fallbackLink: '/kontakt',
    suggestions: [
      { label: 'Long Stay', q: 'Was ist Long Stay?' },
      { label: 'Preise', q: 'Was kostet Long Stay?' },
      { label: "N's Hotel buchen", q: "Wie buche ich N's Hotel?" },
      { label: 'Casa Reto', q: 'Was ist Casa Reto?' },
      { label: 'Mietanfrage', q: 'Wie stelle ich eine Mietanfrage?' },
      { label: 'Besichtigung', q: 'Kann ich ein Zimmer besichtigen?' },
      { label: 'Was ist inkl.?', q: 'Was ist im Mietpreis inbegriffen?' },
      { label: 'Kontakt', q: 'Wie erreiche ich Sie?' },
    ],
    intents: [
      {
        id: 'what-is-long-stay',
        triggers: ['long stay', 'was ist long stay', 'länger wohnen', 'longer', 'mehrere monate', 'monatelang', 'temporär', 'mitarbeitende', 'firmenkunden', 'möbliert', 'aufenthalt'],
        answer: 'Long Stay bietet möblierte Zimmer für Aufenthalte ab einem Monat — ideal für Mitarbeitende, Firmenkunden oder temporäres Wohnen. Wir haben Standorte in Kerzers, Münchenbuchsee und Muri bei Bern.',
        link: '/immobilien/long-stay',
        linkLabel: 'Long Stay ansehen',
      },
      {
        id: 'long-stay-price',
        triggers: ['preis', 'kosten', 'kostet', 'wie teuer', 'miete', 'chf', 'mietzins', 'mietpreis'],
        answer: 'Long Stay Einzelzimmer ab CHF 750/Mt. (Münchenbuchsee) und CHF 900/Mt. (Kerzers, Muri). Alle Preise inkludieren Strom, Wasser und Internet. Parkplatz auf Anfrage.',
        link: '/immobilien/long-stay',
        linkLabel: 'Preise & Details',
      },
      {
        id: 'long-stay-locations',
        triggers: ['kerzers', 'münchenbuchsee', 'muri', 'muri bei bern', 'standorte', 'wo', 'bern', 'seeland'],
        answer: 'Unsere drei Long Stay-Standorte: Kerzers (Seeland), Münchenbuchsee (nördlich Bern) und Muri bei Bern. Alle gut erschlossen mit ÖV und Autobahn.',
        link: '/immobilien/long-stay',
        linkLabel: 'Standorte ansehen',
      },
      {
        id: 'ns-hotel',
        triggers: ["n's hotel", 'hotel', 'ns-hotel', 'ns hotel', 'boutique', 'übernachtung', 'nacht', 'geschäftsreise', 'business', 'check-in', 'kurztrip'],
        answer: "N's Hotel in Kerzers ist ein modernes Boutique-Hotel mit Self Check-in. Ideal für Geschäftsreisen und Kurzaufenthalte. Buchbar über ns-hotel.ch, Booking.com und Airbnb.",
        link: '/ns-hotel',
        linkLabel: "N's Hotel entdecken",
      },
      {
        id: 'ns-hotel-book',
        triggers: ['buchen', 'reservieren', 'booking', 'airbnb', 'direkt buchen', 'wie buche'],
        answer: "Direkt auf ns-hotel.ch buchen — schnell und einfach. Alternativ über Booking.com oder Airbnb. Oder kontaktieren Sie uns direkt.",
        link: '/ns-hotel',
        linkLabel: 'Zur Buchung',
      },
      {
        id: 'casa-reto',
        triggers: ['casa reto', 'tessin', 'ferienhaus', 'ferien', 'ferienwohnung', 'lago maggiore', 'gordemo', 'urlaub', 'erholung', 'natur', 'süd', 'sommer', 'escapada'],
        answer: 'Casa Reto ist unser privates Ferienhaus am Lago Maggiore im Tessin — in einer traumhaften Naturlage direkt am See. Perfekt für Ferien, Erholung und Auszeit vom Alltag.',
        link: '/casa-reto',
        linkLabel: 'Casa Reto entdecken',
      },
      {
        id: 'apartments',
        triggers: ['wohnung', 'apartment', 'mietwohnung', 'wohnungen', 'mieten', 'verfügbar', 'frei', 'apartments'],
        answer: 'Aktuell haben wir keine freien Mietwohnungen. Sie können sich auf unsere Warteliste setzen — wir informieren Sie sofort bei Verfügbarkeit.',
        link: '/immobilien/apartments',
        linkLabel: 'Auf Warteliste',
      },
      {
        id: 'anfrage-form',
        triggers: ['anfrage', 'formular', 'mietanfrage', 'anfragen', 'kontaktformular', 'wie bewerbe', 'bewerben', 'bewerbung', 'antrag'],
        answer: 'Unser Mietanfrage-Formular führt Sie durch alle Schritte: Mietbeginn & Ort → Persönliche Daten → Dokumente hochladen → Absenden. Nach dem Absenden erhalten Sie automatisch eine PDF-Kopie Ihrer Anfrage.',
        link: '/immobilien/anfrage',
        linkLabel: 'Zum Mietanfrage-Formular',
      },
      {
        id: 'contact',
        triggers: ['kontakt', 'erreich', 'telefon', 'email', 'e-mail', 'büro', 'office', 'öffnungszeiten', 'anrufen', 'schreiben', 'adresse'],
        answer: 'Telefon: +41 (0)31 951 85 54 | E-Mail: office@reto-amonn.ch | Adresse: Blümlisalpstrasse 4, 3074 Muri bei Bern. Bürozeiten: Mo–Fr 08:00–17:00 Uhr.',
        link: '/kontakt',
        linkLabel: 'Kontaktseite',
      },
      {
        id: 'diff-long-short',
        triggers: ['unterschied', 'vergleich', 'besser', 'welche option', 'was passt', 'long oder short', 'was empfehlen', 'welches'],
        answer: 'Long Stay (ab 1 Monat): möblierte Zimmer, Nebenkosten inkl., ideal für Arbeitnehmende & Firmen. Short Stay: N\'s Hotel (Nächte/Wochen) oder Casa Reto (Ferienhaus Tessin). Wir helfen Ihnen gerne bei der Wahl.',
        link: '/immobilien',
        linkLabel: 'Alle Angebote vergleichen',
      },
      {
        id: 'short-stay',
        triggers: ['short stay', 'kurzaufenthalt', 'wenige tage', 'wochen', 'tourist', 'tourismus'],
        answer: "Short Stay umfasst N's Hotel (Kerzers) für Geschäftsreisen und Kurzaufenthalte sowie Casa Reto (Tessin) als privates Ferienhaus — beide buchbar über bekannte Plattformen.",
        link: '/immobilien/short-stay',
        linkLabel: 'Short Stay ansehen',
      },
      {
        id: 'availability',
        triggers: ['wann', 'ab wann', 'verfügbarkeit', 'frei ab', 'sofort', 'kurzfristig', 'noch frei', 'zimmer frei', 'verfügbar'],
        answer: 'Long Stay Zimmer sind teilweise kurzfristig verfügbar. Für aktuelle Verfügbarkeit kontaktieren Sie uns direkt oder stellen Sie eine Anfrage — wir antworten innerhalb von 1–2 Werktagen.',
        link: '/immobilien/anfrage',
        linkLabel: 'Verfügbarkeit anfragen',
      },
      {
        id: 'viewing',
        triggers: ['besichtigung', 'besichtigen', 'anschauen', 'zeigen', 'termin', 'vorbeikommen', 'ansehen'],
        answer: 'Besichtigungen sind nach Voranmeldung möglich. Schreiben Sie an office@reto-amonn.ch oder rufen Sie +41 31 951 85 54 an — wir vereinbaren gerne einen Termin.',
        link: '/kontakt',
        linkLabel: 'Besichtigung anfragen',
      },
      {
        id: 'documents',
        triggers: ['dokumente', 'unterlagen', 'was brauche ich', 'ausweis', 'pass', 'passkopie', 'was benötige', 'welche unterlagen', 'bewerbungsunterlagen'],
        answer: 'Für die Mietanfrage benötigen Sie: Pass oder Ausweis (Scan/Foto), persönliche Angaben (Adresse, Beruf, Geburtstag), ggf. Firmendaten und einen Notfallkontakt. Das Formular erklärt alles Schritt für Schritt.',
        link: '/immobilien/anfrage',
        linkLabel: 'Zum Antragsformular',
      },
      {
        id: 'contract',
        triggers: ['vertrag', 'mietvertrag', 'kündigung', 'mindestmietdauer', 'laufzeit', 'mietdauer', 'wie lange', 'befristet'],
        answer: 'Die Mindestmietdauer für Long Stay beträgt 1 Monat. Kündigungsfristen und Vertragsbedingungen werden individuell beim Einzug besprochen. Für Details kontaktieren Sie uns.',
        link: '/immobilien/anfrage',
        linkLabel: 'Anfrage stellen',
      },
      {
        id: 'deposit',
        triggers: ['kaution', 'depot', 'sicherheit', 'anzahlung', 'einzahlung', 'hinterlegung'],
        answer: 'Die Kaution entspricht üblicherweise 1–2 Monatsmieten. Details werden im persönlichen Gespräch vor Vertragsunterzeichnung besprochen.',
        link: '/immobilien/anfrage',
        linkLabel: 'Anfrage stellen',
      },
      {
        id: 'nebenkosten',
        triggers: ['nebenkosten', 'strom', 'wasser', 'internet', 'wifi', 'heizung', 'was ist inkl', 'inbegriffen', 'inklusive'],
        answer: 'Bei Long Stay sind Strom, Wasser, Heizung und Internet im Mietpreis inbegriffen — keine versteckten Zusatzkosten. Parkplatz auf Anfrage verfügbar.',
        link: '/immobilien/long-stay',
        linkLabel: 'Long Stay Details',
      },
      {
        id: 'parking',
        triggers: ['parkplatz', 'parken', 'auto', 'garage', 'fahrzeug', 'motorrad'],
        answer: 'Parkplätze sind an einigen Standorten auf Anfrage verfügbar. Bitte erwähnen Sie Ihr Fahrzeug im Anfrageformular — wir klären die Verfügbarkeit und Kosten.',
        link: '/immobilien/anfrage',
        linkLabel: 'Anfrage inkl. Fahrzeug',
      },
      {
        id: 'furnished',
        triggers: ['möbliert', 'eingerichtet', 'möbel', 'bett', 'küche', 'ausstattung', 'einrichtung', 'ausgestattet'],
        answer: 'Alle Long Stay Zimmer sind vollmöbliert: Bett, Schreibtisch, Schrank, Gemeinschaftsküche. WLAN überall inklusive. Für Details zur Ausstattung des jeweiligen Standorts kontaktieren Sie uns.',
        link: '/immobilien/long-stay',
        linkLabel: 'Ausstattung ansehen',
      },
      {
        id: 'corporate',
        triggers: ['firma', 'unternehmen', 'corporate', 'mitarbeitende', 'firmenwohnen', 'entsandte', 'geschäftsreise'],
        answer: 'Firmenkunden: Wir bieten massgeschneiderte Lösungen für die Unterbringung von Mitarbeitenden — von Einzelzimmern bis zu Mehrzimmerbuchungen, mit Rechnungsstellung direkt an die Firma möglich.',
        link: '/immobilien/anfrage',
        linkLabel: 'Firmenanfrage stellen',
      },
      {
        id: 'architektur',
        triggers: ['architektur', 'architekt', 'bauen', 'bauprojekt', 'bau', 'leistungen', 'was bieten sie', 'was machen sie', 'dienstleistungen', 'architekturleistungen', 'was ist hans amonn'],
        answer: 'Hans Amonn AG bietet umfassende Architekturleistungen: Planung & Entwurf, Neubauten, Sanierungen & Umbauten sowie Projektbegleitung & Bauleitung — in der Region Muri bei Bern und darüber hinaus.',
        link: '/leistungen',
        linkLabel: 'Alle Leistungen ansehen',
      },
      {
        id: 'neubauten',
        triggers: ['neubau', 'neubauten', 'haus bauen', 'neues haus', 'einfamilienhaus', 'mehrfamilienhaus', 'wohnhaus', 'gewerbe bauen', 'neues gebäude', 'bauen lassen'],
        answer: 'Für Neubauten — ob Einfamilienhaus, Mehrfamilienhaus oder Gewerbeimmobilie — begleiten wir Sie von der ersten Idee bis zur Schlüsselübergabe. Termin- und Kostenkontrolle inklusive.',
        link: '/leistungen/neubauten',
        linkLabel: 'Neubauten ansehen',
      },
      {
        id: 'sanierung',
        triggers: ['sanierung', 'sanieren', 'umbau', 'umbauarbeiten', 'renovation', 'renovierung', 'modernisierung', 'energetisch', 'denkmal', 'altbau', 'instandsetzung'],
        answer: 'Wir begleiten Sanierungen und Umbauten: von der Bestandsanalyse über energetische Optimierungen bis hin zu Arbeiten unter Denkmalschutzauflagen.',
        link: '/leistungen/sanierungen-umbauten',
        linkLabel: 'Sanierungen & Umbauten',
      },
      {
        id: 'projektbegleitung',
        triggers: ['projektbegleitung', 'bauleitung', 'bauüberwachung', 'koordination', 'gesamtleitung', 'bauherr', 'begleitung', 'projektmanagement', 'qualitätskontrolle'],
        answer: 'Als Gesamtleiter übernehmen wir Ausschreibung, Vergabe, Bauleitung und Qualitätskontrolle für Ihr Projekt — Sie behalten den Überblick, ohne in operative Details eingebunden zu sein.',
        link: '/leistungen/projektbegleitung',
        linkLabel: 'Projektbegleitung & Bauleitung',
      },
      {
        id: 'planung',
        triggers: ['planung', 'entwurf', 'plan', 'konzept', 'grundriss', 'skizze', 'baugenehmigung', 'baugesuch', 'ausführungsplanung', 'entwurfsplanung'],
        answer: 'Von der ersten Skizze bis zur baureifen Ausführungsplanung: Wir entwickeln Konzepte, die Ästhetik, Funktion und Wirtschaftlichkeit verbinden — immer in enger Abstimmung mit Ihnen.',
        link: '/leistungen/planung-entwurf',
        linkLabel: 'Planung & Entwurf',
      },
      {
        id: 'projects',
        triggers: ['projekte', 'referenzen', 'portfolio', 'beispiele', 'bisherige projekte', 'was haben sie gebaut', 'realisiert'],
        answer: 'In unserem Portfolio finden Sie realisierte Projekte aus den Bereichen Wohnbau, Gewerbe und Umbau. Ein Blick lohnt sich.',
        link: '/projekte',
        linkLabel: 'Projekte ansehen',
      },
      {
        id: 'about',
        triggers: ['über sie', 'über uns', 'wer sind sie', 'firma', 'unternehmen', 'geschichte', 'seit wann', 'wie lange', 'erfahrung', 'team'],
        answer: 'Hans Amonn AG ist ein Schweizer Architektur- und Immobilienbüro mit Sitz in Muri bei Bern. Wir verbinden jahrzehntelange Baukompetenz mit modernem Immobilienmanagement.',
        link: '/uber-uns',
        linkLabel: 'Über uns',
      },
    ],
  },

  en: {
    welcome: "Hello! I'm the digital assistant for Hans Amonn AG — Architecture & Real Estate. How can I help you?",
    placeholder: 'Your question…',
    suggestionsLabel: 'Popular questions',
    fallback: "For this question, it's best to contact us directly at office@reto-amonn.ch or +41 (0)31 951 85 54.",
    fallbackLink: '/kontakt',
    suggestions: [
      { label: 'Long Stay rooms', q: 'What is Long Stay?' },
      { label: "N's Hotel", q: "How do I book N's Hotel?" },
      { label: 'Casa Reto', q: 'What is Casa Reto?' },
      { label: 'Architecture services', q: 'What architecture services do you offer?' },
      { label: 'Build a house', q: 'I want to build a house.' },
      { label: 'Contact us', q: 'How can I reach you?' },
    ],
    intents: [
      {
        id: 'what-is-long-stay',
        triggers: ['long stay', 'what is long stay', 'longer stay', 'several months', 'temporary', 'furnished', 'employees', 'corporate'],
        answer: 'Long Stay offers furnished rooms for stays of one month or more — ideal for employees, corporate clients, or temporary housing. We have locations in Kerzers, Münchenbuchsee and Muri bei Bern.',
        link: '/immobilien/long-stay',
        linkLabel: 'View Long Stay',
      },
      {
        id: 'long-stay-price',
        triggers: ['price', 'cost', 'how much', 'rent', 'chf', 'fee'],
        answer: 'Long Stay single rooms from CHF 750/month (Münchenbuchsee) and CHF 900/month (Kerzers, Muri). All prices include electricity, water and internet.',
        link: '/immobilien/long-stay',
        linkLabel: 'View prices',
      },
      {
        id: 'ns-hotel',
        triggers: ['hotel', "n's hotel", 'boutique', 'overnight', 'night', 'business trip', 'check-in', 'short trip'],
        answer: "N's Hotel in Kerzers is a modern boutique hotel with self check-in. Perfect for business trips and short stays. Book via ns-hotel.ch, Booking.com or Airbnb.",
        link: '/ns-hotel',
        linkLabel: "Discover N's Hotel",
      },
      {
        id: 'ns-hotel-book',
        triggers: ['book', 'reserve', 'booking', 'airbnb', 'how to book'],
        answer: "Book directly at ns-hotel.ch, or through Booking.com and Airbnb. You can also contact us directly.",
        link: '/ns-hotel',
        linkLabel: 'Book now',
      },
      {
        id: 'casa-reto',
        triggers: ['casa reto', 'tessin', 'ticino', 'holiday', 'vacation', 'lago maggiore', 'nature', 'summer', 'relax'],
        answer: 'Casa Reto is our private holiday house at Lake Maggiore in Ticino — a dream location surrounded by nature. Perfect for holidays and a relaxing getaway.',
        link: '/casa-reto',
        linkLabel: 'Discover Casa Reto',
      },
      {
        id: 'apartments',
        triggers: ['apartment', 'flat', 'available', 'rent', 'apartments'],
        answer: 'Currently we have no available rental apartments. You can join our waiting list and we will notify you as soon as something becomes available.',
        link: '/immobilien/apartments',
        linkLabel: 'Join waiting list',
      },
      {
        id: 'anfrage-form',
        triggers: ['inquiry', 'form', 'apply', 'application', 'request', 'contact form'],
        answer: 'Use our inquiry form: Personal details → Choose property → Date & duration → Message → Confirm. We respond within 24 hours.',
        link: '/immobilien/anfrage',
        linkLabel: 'Open inquiry form',
      },
      {
        id: 'contact',
        triggers: ['contact', 'phone', 'email', 'office', 'reach', 'call', 'write'],
        answer: 'Phone: +41 (0)31 951 85 54 | Email: office@reto-amonn.ch | Address: Blümlisalpstrasse 4, 3074 Muri bei Bern.',
        link: '/kontakt',
        linkLabel: 'Contact page',
      },
      {
        id: 'diff-long-short',
        triggers: ['difference', 'compare', 'which option', 'what fits', 'long or short', 'recommend'],
        answer: 'Long Stay: from 1 month, furnished rooms, utilities included, for employees & corporate. Short Stay: hotel or holiday-house style for nights or weeks.',
        link: '/immobilien',
        linkLabel: 'All offers',
      },
      {
        id: 'architektur',
        triggers: ['architecture', 'architect', 'build', 'construction', 'services', 'what do you do', 'what is hans amonn', 'architectural services'],
        answer: 'Hans Amonn AG offers full architectural services: Planning & Design, New Buildings, Renovations & Conversions, and Project Management & Site Supervision — based in Muri bei Bern, Switzerland.',
        link: '/leistungen',
        linkLabel: 'View all services',
      },
      {
        id: 'neubauten',
        triggers: ['new building', 'new house', 'build a house', 'construction project', 'residential', 'commercial building'],
        answer: 'For new buildings — single-family homes, apartment blocks or commercial properties — we accompany you from the first idea to key handover, with full cost and schedule control.',
        link: '/leistungen/neubauten',
        linkLabel: 'New Buildings',
      },
      {
        id: 'sanierung',
        triggers: ['renovation', 'refurbishment', 'remodel', 'conversion', 'energy', 'modernise', 'upgrade', 'historic'],
        answer: 'We handle renovations and conversions of all scales: condition analysis, energy upgrades to MINERGIE standards, and work under heritage protection requirements.',
        link: '/leistungen/sanierungen-umbauten',
        linkLabel: 'Renovations & Conversions',
      },
      {
        id: 'projects',
        triggers: ['projects', 'portfolio', 'references', 'past work', 'examples', 'what have you built'],
        answer: 'Browse our portfolio of completed projects in residential, commercial and renovation categories.',
        link: '/projekte',
        linkLabel: 'View projects',
      },
      {
        id: 'about',
        triggers: ['about', 'who are you', 'company', 'history', 'experience', 'team', 'how long'],
        answer: 'Hans Amonn AG is a Swiss architecture and real estate firm based in Muri bei Bern, combining decades of building expertise with modern property management.',
        link: '/uber-uns',
        linkLabel: 'About us',
      },
    ],
  },

  fr: {
    welcome: "Bonjour ! Je suis l'assistant digital de Hans Amonn AG — Architecture & Immobilier. Comment puis-je vous aider ?",
    placeholder: 'Votre question…',
    suggestionsLabel: 'Questions fréquentes',
    fallback: 'Pour cette question, il vaut mieux nous contacter directement à office@reto-amonn.ch ou +41 (0)31 951 85 54.',
    fallbackLink: '/kontakt',
    suggestions: [
      { label: 'Découvrir Long Stay', q: "Qu'est-ce que le Long Stay?" },
      { label: "Voir N's Hotel", q: "Comment réserver N's Hotel?" },
      { label: 'Casa Reto', q: "Qu'est-ce que Casa Reto?" },
      { label: 'Services architecture', q: 'Quels services architecturaux proposez-vous?' },
      { label: 'Construction neuve', q: 'Je voudrais faire construire une maison.' },
      { label: 'Nous contacter', q: 'Comment vous contacter?' },
    ],
    intents: [
      {
        id: 'what-is-long-stay',
        triggers: ['long stay', "qu'est-ce que", 'séjour long', 'plusieurs mois', 'temporaire', 'meublé', 'employés', 'entreprise'],
        answer: "Long Stay propose des chambres meublées pour des séjours d'un mois ou plus — idéal pour les employés, clients entreprises ou logement temporaire. Nos sites sont à Kerzers, Münchenbuchsee et Muri bei Bern.",
        link: '/immobilien/long-stay',
        linkLabel: 'Voir Long Stay',
      },
      {
        id: 'long-stay-price',
        triggers: ['prix', 'coût', 'combien', 'loyer', 'chf', 'tarif'],
        answer: 'Chambre individuelle Long Stay à partir de CHF 750/mois (Münchenbuchsee) et CHF 900/mois (Kerzers, Muri). Tous les prix incluent électricité, eau et internet.',
        link: '/immobilien/long-stay',
        linkLabel: 'Voir les tarifs',
      },
      {
        id: 'ns-hotel',
        triggers: ['hotel', "n's hotel", 'boutique', 'nuit', 'voyage affaires', 'business', 'court séjour'],
        answer: "N's Hotel à Kerzers est un hôtel boutique moderne avec check-in autonome. Idéal pour les voyages d'affaires et courts séjours. Réservable sur ns-hotel.ch, Booking.com ou Airbnb.",
        link: '/ns-hotel',
        linkLabel: "Découvrir N's Hotel",
      },
      {
        id: 'casa-reto',
        triggers: ['casa reto', 'tessin', 'vacances', 'maison', 'lago maggiore', 'nature', 'repos'],
        answer: "Casa Reto est notre maison de vacances privée au Lac Majeur, dans le Tessin — un cadre naturel magnifique. Parfait pour les vacances et un séjour ressourçant.",
        link: '/casa-reto',
        linkLabel: 'Découvrir Casa Reto',
      },
      {
        id: 'apartments',
        triggers: ['appartement', 'disponible', 'louer'],
        answer: "Actuellement, nous n'avons pas d'appartements disponibles. Vous pouvez rejoindre notre liste d'attente.",
        link: '/immobilien/apartments',
        linkLabel: "Liste d'attente",
      },
      {
        id: 'anfrage-form',
        triggers: ['demande', 'formulaire', 'demander', 'contact'],
        answer: 'Utilisez notre formulaire de demande. Nous répondons dans les 24 heures.',
        link: '/immobilien/anfrage',
        linkLabel: 'Ouvrir le formulaire',
      },
      {
        id: 'contact',
        triggers: ['contact', 'téléphone', 'email', 'bureau', 'joindre', 'appeler'],
        answer: 'Téléphone : +41 (0)31 951 85 54 | E-mail : office@reto-amonn.ch | Adresse : Blümlisalpstrasse 4, 3074 Muri bei Bern.',
        link: '/kontakt',
        linkLabel: 'Page contact',
      },
      {
        id: 'architektur',
        triggers: ['architecture', 'architecte', 'construire', 'services', 'que faites-vous', 'prestations', 'construction'],
        answer: "Hans Amonn AG propose des services d'architecture complets : Planification & Conception, Constructions neuves, Rénovations & Transformations, et Gestion de projet & Direction des travaux.",
        link: '/leistungen',
        linkLabel: 'Voir les services',
      },
      {
        id: 'neubauten',
        triggers: ['construction neuve', 'maison neuve', 'faire construire', 'bâtiment', 'villa', 'immeuble'],
        answer: "Pour les constructions neuves, nous vous accompagnons de la première esquisse à la remise des clés — maisons individuelles, immeubles ou bâtiments commerciaux.",
        link: '/leistungen/neubauten',
        linkLabel: 'Constructions neuves',
      },
      {
        id: 'projects',
        triggers: ['projets', 'références', 'portfolio', 'réalisations', 'exemples'],
        answer: 'Découvrez nos projets réalisés dans les domaines du logement, du tertiaire et de la rénovation.',
        link: '/projekte',
        linkLabel: 'Voir les projets',
      },
    ],
  },

  it: {
    welcome: 'Buongiorno! Sono l\'assistente digitale di Hans Amonn AG — Architettura & Immobili. Come posso aiutarvi?',
    placeholder: 'La vostra domanda…',
    suggestionsLabel: 'Domande frequenti',
    fallback: 'Per questa domanda è meglio contattarci direttamente: office@reto-amonn.ch o +41 (0)31 951 85 54.',
    fallbackLink: '/kontakt',
    suggestions: [
      { label: 'Scopri Long Stay', q: "Cos'è il Long Stay?" },
      { label: "N's Hotel", q: "Come prenoto N's Hotel?" },
      { label: 'Casa Reto', q: "Cos'è Casa Reto?" },
      { label: 'Servizi architettura', q: 'Quali servizi architettonici offrite?' },
      { label: 'Costruire una casa', q: 'Vorrei far costruire una casa.' },
      { label: 'Contattaci', q: 'Come vi contatto?' },
    ],
    intents: [
      {
        id: 'what-is-long-stay',
        triggers: ['long stay', "cos'è", 'soggiorno lungo', 'mesi', 'temporaneo', 'arredato', 'dipendenti', 'azienda'],
        answer: 'Long Stay offre camere arredate per soggiorni di un mese o più — ideale per dipendenti, clienti aziendali o alloggio temporaneo. Abbiamo sedi a Kerzers, Münchenbuchsee e Muri bei Bern.',
        link: '/immobilien/long-stay',
        linkLabel: 'Vedi Long Stay',
      },
      {
        id: 'ns-hotel',
        triggers: ['hotel', "n's hotel", 'notte', 'viaggio affari', 'business', 'breve soggiorno'],
        answer: "N's Hotel a Kerzers è un moderno boutique hotel con self check-in. Ideale per viaggi d'affari e soggiorni brevi.",
        link: '/ns-hotel',
        linkLabel: "Scopri N's Hotel",
      },
      {
        id: 'casa-reto',
        triggers: ['casa reto', 'ticino', 'vacanze', 'lago maggiore', 'natura', 'riposo'],
        answer: "Casa Reto è la nostra casa vacanze privata sul Lago Maggiore in Ticino — una location da sogno immersa nella natura.",
        link: '/casa-reto',
        linkLabel: 'Scopri Casa Reto',
      },
      {
        id: 'anfrage-form',
        triggers: ['richiesta', 'modulo', 'domanda', 'contatto'],
        answer: 'Utilizzate il nostro modulo di richiesta. Rispondiamo entro 24 ore.',
        link: '/immobilien/anfrage',
        linkLabel: 'Apri modulo',
      },
      {
        id: 'contact',
        triggers: ['contatto', 'telefono', 'email', 'ufficio', 'raggiungere'],
        answer: 'Telefono: +41 (0)31 951 85 54 | Email: office@reto-amonn.ch | Indirizzo: Blümlisalpstrasse 4, 3074 Muri bei Bern.',
        link: '/kontakt',
        linkLabel: 'Pagina contatti',
      },
      {
        id: 'architektur',
        triggers: ['architettura', 'architetto', 'costruire', 'servizi', 'cosa fate', 'prestazioni'],
        answer: 'Hans Amonn AG offre servizi di architettura completi: Pianificazione & Progettazione, Nuove costruzioni, Risanamenti & Ristrutturazioni, e Direzione lavori & Project Management.',
        link: '/leistungen',
        linkLabel: 'Vedi i servizi',
      },
      {
        id: 'neubauten',
        triggers: ['nuova costruzione', 'casa nuova', 'far costruire', 'edificio', 'villa'],
        answer: 'Per le nuove costruzioni vi accompagniamo dalla prima idea alla consegna delle chiavi — case unifamiliari, palazzi o edifici commerciali.',
        link: '/leistungen/neubauten',
        linkLabel: 'Nuove costruzioni',
      },
    ],
  },

  es: {
    welcome: '¡Hola! Soy el asistente digital de Hans Amonn AG — Arquitectura e Inmobiliaria. ¿En qué puedo ayudarle?',
    placeholder: 'Su pregunta…',
    suggestionsLabel: 'Preguntas frecuentes',
    fallback: 'Para esta pregunta es mejor contactarnos directamente: office@reto-amonn.ch o +41 (0)31 951 85 54.',
    fallbackLink: '/kontakt',
    suggestions: [
      { label: 'Descubrir Long Stay', q: '¿Qué es Long Stay?' },
      { label: "N's Hotel", q: "¿Cómo reservo N's Hotel?" },
      { label: 'Casa Reto', q: '¿Qué es Casa Reto?' },
      { label: 'Servicios arquitectura', q: '¿Qué servicios de arquitectura ofrecen?' },
      { label: 'Construir una casa', q: 'Quiero construir una casa.' },
      { label: 'Contactarnos', q: '¿Cómo les contacto?' },
    ],
    intents: [
      {
        id: 'what-is-long-stay',
        triggers: ['long stay', 'qué es', 'estancia larga', 'meses', 'temporal', 'amueblado', 'empleados', 'empresa'],
        answer: 'Long Stay ofrece habitaciones amuebladas para estancias de un mes o más — ideal para empleados, clientes corporativos o alojamiento temporal. Tenemos sedes en Kerzers, Münchenbuchsee y Muri bei Bern.',
        link: '/immobilien/long-stay',
        linkLabel: 'Ver Long Stay',
      },
      {
        id: 'ns-hotel',
        triggers: ['hotel', "n's hotel", 'noche', 'viaje negocios', 'business', 'estancia corta'],
        answer: "N's Hotel en Kerzers es un moderno hotel boutique con self check-in. Ideal para viajes de negocios y estancias cortas.",
        link: '/ns-hotel',
        linkLabel: "Ver N's Hotel",
      },
      {
        id: 'casa-reto',
        triggers: ['casa reto', 'tesino', 'vacaciones', 'lago maggiore', 'naturaleza', 'descanso', 'escapada'],
        answer: 'Casa Reto es nuestra casa de vacaciones privada en el Lago Maggiore, en el Tesino — un lugar de ensueño rodeado de naturaleza. Perfecto para vacaciones y escapadas.',
        link: '/casa-reto',
        linkLabel: 'Descubrir Casa Reto',
      },
      {
        id: 'anfrage-form',
        triggers: ['solicitud', 'formulario', 'petición', 'contacto', 'pedir'],
        answer: 'Use nuestro formulario de solicitud. Respondemos en 24 horas.',
        link: '/immobilien/anfrage',
        linkLabel: 'Abrir formulario',
      },
      {
        id: 'contact',
        triggers: ['contacto', 'teléfono', 'email', 'correo', 'oficina'],
        answer: 'Teléfono: +41 (0)31 951 85 54 | Email: office@reto-amonn.ch | Dirección: Blümlisalpstrasse 4, 3074 Muri bei Bern.',
        link: '/kontakt',
        linkLabel: 'Página de contacto',
      },
      {
        id: 'architektur',
        triggers: ['arquitectura', 'arquitecto', 'construir', 'servicios', 'qué hacen', 'prestaciones', 'obra'],
        answer: 'Hans Amonn AG ofrece servicios integrales de arquitectura: Planificación & Diseño, Obras nuevas, Rehabilitaciones & Reformas, y Dirección de obra & Gestión de proyectos.',
        link: '/leistungen',
        linkLabel: 'Ver todos los servicios',
      },
      {
        id: 'neubauten',
        triggers: ['obra nueva', 'casa nueva', 'construir casa', 'edificio', 'vivienda nueva', 'promoción'],
        answer: 'Para obras nuevas — viviendas unifamiliares, bloques de pisos o edificios comerciales — le acompañamos desde la primera idea hasta la entrega de llaves.',
        link: '/leistungen/neubauten',
        linkLabel: 'Obra nueva',
      },
      {
        id: 'projects',
        triggers: ['proyectos', 'referencias', 'portfolio', 'realizaciones', 'ejemplos', 'qué han construido'],
        answer: 'Explore nuestro portfolio de proyectos realizados en vivienda, terciario y rehabilitación.',
        link: '/projekte',
        linkLabel: 'Ver proyectos',
      },
    ],
  },

  pt: {
    welcome: 'Olá! Sou o assistente digital da Hans Amonn AG — Arquitetura & Imobiliário. Em que posso ajudá-lo?',
    placeholder: 'A sua pergunta…',
    suggestionsLabel: 'Perguntas frequentes',
    fallback: 'Para esta questão é melhor contactar-nos diretamente: office@reto-amonn.ch ou +41 (0)31 951 85 54.',
    fallbackLink: '/kontakt',
    suggestions: [
      { label: 'Descobrir Long Stay', q: 'O que é o Long Stay?' },
      { label: "N's Hotel", q: "Como reservo N's Hotel?" },
      { label: 'Casa Reto', q: 'O que é Casa Reto?' },
      { label: 'Serviços arquitetura', q: 'Que serviços de arquitetura oferecem?' },
      { label: 'Construir uma casa', q: 'Quero construir uma casa.' },
      { label: 'Contactar-nos', q: 'Como vos contacto?' },
    ],
    intents: [
      {
        id: 'what-is-long-stay',
        triggers: ['long stay', 'o que é', 'estadia longa', 'meses', 'temporário', 'mobilado', 'funcionários', 'empresa'],
        answer: 'Long Stay oferece quartos mobilados para estadias de um mês ou mais — ideal para funcionários, clientes empresariais ou alojamento temporário. Temos localizações em Kerzers, Münchenbuchsee e Muri bei Bern.',
        link: '/immobilien/long-stay',
        linkLabel: 'Ver Long Stay',
      },
      {
        id: 'ns-hotel',
        triggers: ['hotel', "n's hotel", 'noite', 'viagem negócios', 'business', 'estadia curta'],
        answer: "N's Hotel em Kerzers é um moderno hotel boutique com self check-in. Ideal para viagens de negócios e estadias curtas.",
        link: '/ns-hotel',
        linkLabel: "Ver N's Hotel",
      },
      {
        id: 'casa-reto',
        triggers: ['casa reto', 'tessino', 'férias', 'lago maggiore', 'natureza', 'descanso'],
        answer: 'Casa Reto é a nossa casa de férias privada no Lago Maggiore, no Tessino — uma localização de sonho rodeada de natureza.',
        link: '/casa-reto',
        linkLabel: 'Descobrir Casa Reto',
      },
      {
        id: 'anfrage-form',
        triggers: ['pedido', 'formulário', 'contacto', 'solicitar'],
        answer: 'Utilize o nosso formulário de pedido. Respondemos em 24 horas.',
        link: '/immobilien/anfrage',
        linkLabel: 'Abrir formulário',
      },
      {
        id: 'contact',
        triggers: ['contacto', 'telefone', 'email', 'escritório'],
        answer: 'Telefone: +41 (0)31 951 85 54 | Email: office@reto-amonn.ch | Morada: Blümlisalpstrasse 4, 3074 Muri bei Bern.',
        link: '/kontakt',
        linkLabel: 'Página de contacto',
      },
      {
        id: 'architektur',
        triggers: ['arquitetura', 'arquiteto', 'construir', 'serviços', 'o que fazem', 'prestações'],
        answer: 'Hans Amonn AG oferece serviços de arquitetura completos: Planeamento & Projeto, Obras novas, Reabilitações & Remodelações, e Direção de obra & Gestão de projetos.',
        link: '/leistungen',
        linkLabel: 'Ver todos os serviços',
      },
      {
        id: 'neubauten',
        triggers: ['obra nova', 'casa nova', 'construir casa', 'edifício', 'moradia', 'prédio'],
        answer: 'Para obras novas — moradias unifamiliares, edifícios de apartamentos ou imóveis comerciais — acompanhamo-lo desde a primeira ideia até à entrega de chaves.',
        link: '/leistungen/neubauten',
        linkLabel: 'Obras novas',
      },
    ],
  },
};

const LANG_LABELS = {
  de: { flag: '🇩🇪', label: 'DE' },
  fr: { flag: '🇫🇷', label: 'FR' },
  it: { flag: '🇮🇹', label: 'IT' },
  en: { flag: '🇬🇧', label: 'EN' },
  es: { flag: '🇪🇸', label: 'ES' },
  pt: { flag: '🇵🇹', label: 'PT' },
};

// ─── Match intent ─────────────────────────────────────────────────────────────

function matchIntent(text, lang) {
  const lower = text.toLowerCase();
  const intents = KB[lang]?.intents || KB.de.intents;

  let best = null;
  let bestScore = 0;

  for (const intent of intents) {
    let score = 0;
    for (const trigger of intent.triggers) {
      if (lower.includes(trigger)) score += trigger.split(' ').length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  if (best && bestScore > 0) return best;
  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VirtualAgent() {
  // Read lang from localStorage (no i18n context in this project)
  const [open, setOpen] = useState(false);
  const [chatLang, setChatLang] = useState(() => {
    const stored = localStorage.getItem('ha_lang');
    return KB[stored] ? stored : 'de';
  });
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [messages, setMessages] = useState(null); // null = uninitialized
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const L = KB[chatLang] || KB.de;

  // Initialize messages when opened
  useEffect(() => {
    if (open && messages === null) {
      setMessages([{ from: 'bot', text: L.welcome }]);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset messages when language changes (but only if already initialized)
  useEffect(() => {
    if (messages !== null) {
      setMessages([{ from: 'bot', text: L.welcome }]);
      setShowSuggestions(true);
    }
  }, [chatLang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (open) {
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [open, messages, typing]);

  useEffect(() => {
    if (open && messages !== null) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(m => [...(m || []), { from: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    setShowSuggestions(false);

    setTimeout(() => {
      const intent = matchIntent(trimmed, chatLang);
      let response;
      if (intent) {
        response = { from: 'bot', text: intent.answer, link: intent.link, linkLabel: intent.linkLabel };
      } else {
        response = { from: 'bot', text: L.fallback, link: L.fallbackLink, linkLabel: 'Kontakt' };
      }
      setMessages(m => [...m, response]);
      setTyping(false);
    }, 900);
  };

  const handleOpen = () => {
    setOpen(o => !o);
    if (!open) setShowLangPicker(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors group"
        aria-label="Chat öffnen"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Sparkle badge */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <Sparkles size={10} className="text-white" />
          </span>
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
            style={{ maxHeight: 'min(560px, calc(100vh - 120px))' }}
          >
            {/* Header */}
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={17} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">HANS AMONN AG</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <p className="text-gray-400 text-xs">Digitaler Assistent · Online</p>
                </div>
              </div>
              {/* Language picker */}
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowLangPicker(p => !p)}
                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-xs py-1 px-2 rounded-lg hover:bg-white/10"
                >
                  <Globe size={12} />
                  {LANG_LABELS[chatLang]?.flag} {LANG_LABELS[chatLang]?.label}
                  <ChevronDown size={10} className={`transition-transform ${showLangPicker ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showLangPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 min-w-[120px] z-10"
                    >
                      {Object.entries(LANG_LABELS).map(([code, info]) => (
                        <button
                          key={code}
                          onClick={() => { setChatLang(code); setShowLangPicker(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${chatLang === code ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                        >
                          <span>{info.flag}</span>
                          <span>{info.label}</span>
                          {chatLang === code && <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {(messages || []).map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end gap-2 max-w-[88%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5 ${
                      msg.from === 'bot'
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                        : 'bg-gray-700'
                    }`}>
                      {msg.from === 'bot' ? <Bot size={11} className="text-white" /> : <User size={11} className="text-white" />}
                    </div>
                    <div>
                      <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.from === 'user'
                          ? 'bg-gray-900 text-white rounded-br-sm'
                          : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                      {msg.link && (
                        <Link
                          to={msg.link}
                          className={`flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 mt-1.5 transition-colors font-medium ${msg.from === 'user' ? 'justify-end mr-1' : 'ml-1'}`}
                        >
                          {msg.linkLabel || 'Mehr erfahren'} <ArrowRight size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <Bot size={11} className="text-white" />
                    </div>
                    <div className="bg-white border border-gray-100 shadow-sm px-4 py-3.5 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick suggestions — show only on first open */}
            <AnimatePresence>
              {showSuggestions && (messages || []).length <= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white border-t border-gray-100 overflow-hidden flex-shrink-0"
                >
                  <div className="px-4 pt-3 pb-2">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">{L.suggestionsLabel}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {L.suggestions.map(s => (
                        <button
                          key={s.label}
                          onClick={() => send(s.q)}
                          className="text-xs bg-gray-50 border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 py-1.5 px-2.5 rounded-lg transition-colors font-medium"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !typing && send()}
                  placeholder={L.placeholder}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-400 placeholder-gray-400 transition-all"
                  disabled={typing}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => send()}
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-white disabled:text-gray-300 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
