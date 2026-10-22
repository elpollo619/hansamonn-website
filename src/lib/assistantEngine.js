/**
 * Local answers for the website assistant. Runs in the browser, nothing is sent anywhere
 * (except the Casa Reto calendar check, which asks our calendar proxy for booked dates).
 *
 * A question is read as SUBJECT (what it is about: Long Stay, hotel, Casa Reto, …) plus
 * INTENT (what the person wants: price, booking, parking, …). Missing parts are taken from
 * the conversation, so "und in Muri?" or "was kostet das?" work as follow-ups.
 * All facts come from assistantKnowledge.js.
 */
import { COMPANY, LONG_STAY, LONG_STAY_FROM, HOTEL, CASA_RETO, ARCH_SERVICES, PROJECTS, PAGES } from '../data/assistantKnowledge.js';
import { findStay } from './assistantDates.js';

export const LANGS = ['de', 'en', 'fr', 'it', 'es', 'pt'];
const L = (de, en, fr, it, es, pt) => ({ de, en, fr, it, es, pt });
const pick = (o, lang) => (o && (o[lang] ?? o.en ?? o.de)) || '';

export const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[’']/g, '');
const chf = (n) => `CHF ${Number(n).toLocaleString('de-CH')}`;

// ─── Vocabulary ──────────────────────────────────────────────────────────────

const SUBJECTS = {
  kerzers: ['kerzers', 'chietres'],
  muenchenbuchsee: ['munchenbuchsee', 'muenchenbuchsee', 'buchsee'],
  muri: ['muri', 'gumligen'],
  ls: ['long stay', 'longstay', 'mobliert', 'moebliert', 'zimmer', 'wg', 'monat', 'monate', 'monatlich', 'langzeit', 'temporar', 'monteur', 'pendler', 'furnished', 'room', 'rooms', 'month', 'monthly', 'chambre', 'meuble', 'mois', 'camera', 'arredat', 'mese', 'habitacion', 'amueblad', 'mes', 'quarto', 'mobiliad'],
  hotel: ['hotel', 'ns hotel', 'ns-hotel', 'nshotel', 'ubernachtung', 'uebernachtung', 'nacht', 'nachte', 'night', 'nights', 'nuit', 'notte', 'noche', 'noite', 'geschaftsreise', 'business trip', 'kurzaufenthalt', 'short stay'],
  cr: ['casa reto', 'casareto', 'reto', 'tessin', 'ticino', 'tessin', 'ferienhaus', 'ferien', 'ferienwohnung', 'urlaub', 'gordemo', 'gordola', 'tenero', 'ascona', 'lugano', 'bellinzona', 'lago maggiore', 'lago', 'maggiore', 'verzasca', 'locarno', 'holiday', 'vacation', 'vacances', 'vacanza', 'vacanze', 'vacaciones', 'ferias', 'casa de vacaciones', 'maison de vacances'],
  apt: ['wohnung', 'wohnungen', 'mietwohnung', 'apartment', 'apartments', 'appartement', 'appartamento', 'apartamento', 'flat', 'warteliste', 'waiting list'],
  sale: ['kaufen', 'kauf', 'verkauf', 'verkaufen', 'eigentum', 'eigentumswohnung', 'buy', 'purchase', 'sale', 'acheter', 'vente', 'comprare', 'vendita', 'comprar', 'venta', 'compra', 'hypothek', 'mortgage'],
  arch: ['architektur', 'architekt', 'bauen', 'bau', 'bauprojekt', 'neubau', 'umbau', 'sanierung', 'sanieren', 'renovation', 'renovierung', 'planung', 'entwurf', 'baugesuch', 'bauleitung', 'bauherr', 'architecture', 'architect', 'build', 'construction', 'architecte', 'construire', 'architetto', 'costruire', 'arquitecto', 'arquitectura', 'construir', 'arquiteto', 'reforma', 'progetto', 'proyecto', 'projekt', 'projekte', 'project', 'projects', 'referenz'],
};

const INTENTS = {
  greet: ['hallo', 'gruezi', 'gruessech', 'guten tag', 'hoi', 'hello', 'hi', 'hey', 'bonjour', 'salut', 'buongiorno', 'ciao', 'hola', 'buenos dias', 'ola', 'bom dia'],
  thanks: ['danke', 'merci', 'thanks', 'thank you', 'grazie', 'gracias', 'obrigad'],
  human: ['mensch', 'mitarbeiter', 'jemand', 'sprechen', 'anrufen', 'telefonieren', 'human', 'someone', 'call', 'agent', 'quelqu', 'parler', 'appeler', 'qualcuno', 'parlare', 'chiamare', 'alguien', 'hablar', 'llamar', 'alguem', 'falar', 'ligar', 'whatsapp'],
  contact: ['kontakt', 'telefon', 'nummer', 'email', 'e-mail', 'mail', 'adresse', 'erreichen', 'contact', 'phone', 'address', 'reach', 'telephone', 'adresse', 'contatto', 'telefono', 'indirizzo', 'contacto', 'direccion', 'contato', 'endereco'],
  hours: ['offnungszeit', 'oeffnungszeit', 'burozeit', 'buerozeit', 'buro', 'buero', 'geoffnet', 'offen', 'wann erreich', 'office', 'bureau', 'ufficio', 'oficina', 'escritorio', 'opening hours', 'office hours', 'open', 'horaire', 'ouvert', 'orari', 'aperto', 'horario', 'abierto', 'aberto'],
  about: ['uber sie', 'ueber sie', 'uber uns', 'firma', 'unternehmen', 'geschichte', 'seit wann', 'wer sind', 'familie', 'about', 'company', 'history', 'who are', 'entreprise', 'histoire', 'azienda', 'storia', 'empresa', 'historia', 'quienes'],
  team: ['team', 'mitarbeitende', 'chef', 'inhaber', 'geschaftsfuhrer', 'reto amonn', 'owner', 'equipe', 'squadra', 'equipo'],
  price: ['preis', 'preise', 'kosten', 'kostet', 'teuer', 'miete', 'mietzins', 'tarif', 'chf', 'franken', 'price', 'prices', 'cost', 'costs', 'how much', 'rate', 'prix', 'combien', 'coute', 'loyer', 'prezzo', 'prezzi', 'quanto', 'costa', 'affitto', 'precio', 'precios', 'cuanto', 'cuesta', 'alquiler', 'preco', 'renda', 'aluguel'],
  book: ['buchen', 'buchung', 'reservieren', 'reservation', 'anfrage', 'anfragen', 'mietanfrage', 'bewerben', 'bewerbung', 'mieten', 'book', 'booking', 'reserve', 'apply', 'rent', 'inquiry', 'reserver', 'louer', 'demande', 'prenotare', 'prenotazione', 'affittare', 'reservar', 'reserva', 'alquilar', 'solicitud', 'alugar', 'pedido'],
  avail: ['verfugbar', 'verfuegbar', 'verfugbarkeit', 'frei', 'noch frei', 'belegt', 'ab wann', 'available', 'availability', 'free', 'vacancy', 'disponible', 'disponibilite', 'libre', 'disponibile', 'disponibilita', 'libero', 'disponibilidad', 'disponivel', 'livre'],
  parking: ['parkplatz', 'parkieren', 'parken', 'auto', 'garage', 'ladestation', 'parking', 'car', 'park', 'voiture', 'stationnement', 'parcheggio', 'macchina', 'aparcamiento', 'estacionamiento', 'coche', 'carro', 'estacionamento'],
  pets: ['haustier', 'hund', 'katze', 'tier', 'pet', 'pets', 'dog', 'cat', 'animal', 'chien', 'animale', 'cane', 'gatto', 'mascota', 'perro', 'gato', 'cachorro'],
  includes: ['inbegriffen', 'inklusive', 'inkl', 'nebenkosten', 'strom', 'internet', 'wlan', 'wifi', 'reinigung', 'included', 'include', 'utilities', 'cleaning', 'compris', 'charges', 'menage', 'incluso', 'compreso', 'pulizia', 'incluido', 'limpieza', 'incluido', 'limpeza'],
  deposit: ['kaution', 'depot', 'sicherheit', 'deposit', 'caution', 'depot', 'cauzione', 'deposito', 'fianza', 'caucao'],
  contract: ['vertrag', 'mietvertrag', 'kundigung', 'kuendigung', 'mindest', 'mindestdauer', 'mindestaufenthalt', 'wie lange', 'dauer', 'contract', 'minimum', 'notice', 'how long', 'contrat', 'duree', 'contratto', 'durata', 'contrato', 'duracion', 'duracao'],
  docs: ['dokument', 'dokumente', 'unterlagen', 'ausweis', 'betreibung', 'lohnausweis', 'documents', 'papers', 'id card', 'documents', 'piece', 'documenti', 'documentos', 'documentacion'],
  viewing: ['besichtigung', 'besichtigen', 'anschauen', 'termin', 'vorbeikommen', 'viewing', 'visit', 'appointment', 'visite', 'rendez', 'visita', 'appuntamento', 'cita', 'visitar', 'agendar'],
  company: ['firmen', 'firmenkunde', 'mitarbeitende unterbringen', 'mehrere zimmer', 'gruppe', 'team unterbringen', 'company', 'corporate', 'employees', 'group', 'entreprise', 'societe', 'groupe', 'azienda', 'gruppo', 'empresa', 'grupo'],
  checkin: ['check-in', 'checkin', 'check in', 'check', 'einchecken', 'auschecken', 'check-out', 'checkout', 'check out', 'anreise', 'abreise', 'schlussel', 'schluessel', 'ankunft', 'arrival', 'key', 'arrivee', 'cle', 'arrivo', 'chiave', 'llegada', 'llave', 'chegada', 'chave'],
  rules: ['hausordnung', 'regeln', 'rauchen', 'party', 'partys', 'kurtaxe', 'rules', 'smoking', 'regles', 'fumer', 'regole', 'fumare', 'normas', 'fumar', 'regras'],
  amenities: ['ausstattung', 'kuche', 'kueche', 'waschmaschine', 'klimaanlage', 'klima', 'heizung', 'arbeitsplatz', 'homeoffice', 'fernseher', 'grill', 'garten', 'amenities', 'kitchen', 'washing', 'air conditioning', 'workspace', 'equipement', 'cuisine', 'climatisation', 'dotazioni', 'cucina', 'aria condizionata', 'equipamiento', 'cocina', 'aire acondicionado', 'equipamento', 'cozinha', 'ar condicionado', 'betten', 'schlafzimmer', 'beds', 'bedrooms', 'lits', 'letti', 'camas', 'personen', 'gaste', 'guests', 'persons'],
  where: ['wo liegt', 'wo ist', 'lage', 'anfahrt', 'wie weit', 'weit', 'fahrzeit', 'distanz', 'entfernung', 'umgebung', 'ausflug', 'ausfluge', 'how far', 'locarno', 'ascona', 'lugano', 'bellinzona', 'verzasca', 'tenero', 'am see', 'zum see', 'seeufer', 'to the lake', 'near the lake', 'where', 'location', 'directions', 'distance', 'nearby', 'ou se trouve', 'acces', 'environs', 'dove', 'posizione', 'dintorni', 'donde', 'ubicacion', 'alrededores', 'onde', 'localizacao', 'arredores'],
  accessible: ['barrierefrei', 'rollstuhl', 'behindert', 'accessible', 'wheelchair', 'fauteuil', 'sedia a rotelle', 'silla de ruedas', 'cadeira de rodas'],
  family: ['familie', 'kinder', 'kind', 'baby', 'family', 'kids', 'children', 'famille', 'enfants', 'famiglia', 'bambini', 'familia', 'ninos', 'criancas'],
  storno: ['storno', 'stornieren', 'stornierung', 'ruckerstattung', 'rueckerstattung', 'annullieren', 'cancel', 'cancellation', 'refund', 'annuler', 'annulation', 'rembourse', 'cancellare', 'rimborso', 'cancelar', 'cancelacion', 'reembolso'],
  privacy: ['datenschutz', 'daten', 'cookies', 'privacy', 'data protection', 'confidentialite', 'donnees', 'riservatezza', 'privacidad', 'datos', 'privacidade', 'dados'],
  costs: ['honorar', 'architektenhonorar', 'fee', 'fees', 'honoraires', 'onorario', 'honorarios', 'honorarios'],
  projects: ['projekte', 'projekt', 'referenzen', 'gebaut', 'realisiert', 'projects', 'portfolio', 'references', 'projets', 'realisations', 'progetti', 'proyectos', 'projetos', 'obras'],
  services: ['leistungen', 'angebot', 'was machen', 'was bieten', 'dienstleistung', 'services', 'what do you do', 'offer', 'prestations', 'servizi', 'servicios', 'servicos'],
  model3d: ['3d', 'modell', 'model', 'modele', 'modello', 'modelo'],
  job: ['job', 'stelle', 'lehrstelle', 'bewerbung als', 'arbeiten bei', 'karriere', 'career', 'emploi', 'lavoro', 'empleo', 'trabalho'],
};

// Generic words count less than names, so "Zimmer im Hotel" is about the hotel
const WEAK = new Set(['zimmer', 'room', 'rooms', 'chambre', 'camera', 'habitacion', 'quarto', 'monat', 'monate', 'month', 'mois', 'mese', 'mes', 'nacht', 'nachte', 'night', 'nights', 'nuit', 'notte', 'noche', 'noite', 'ferien', 'lago', 'projekt', 'project', 'progetto', 'proyecto', 'bau'].map(norm));

// Pre-normalised, longest phrases first
const prep = (dict) => Object.fromEntries(Object.entries(dict).map(([k, words]) => [k, [...new Set(words.map(norm))].sort((a, b) => b.length - a.length)]));
const SUBJ = prep(SUBJECTS);
const INT = prep(INTENTS);

function lev1(a, b) {
  // true when a and b differ by at most one edit (typos like "kerzres", "preiss")
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else if (a[i + 1] === b[j] && a[i] === b[j + 1]) { i += 2; j += 2; }
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** Scores each key: phrase 4, exact word 3, word start 2, one typo in a longer word 1 (generic words at most 1). */
function scoreAll(text, dict) {
  const t = ` ${text.replace(/[^a-z0-9\- ]+/g, ' ').replace(/\s+/g, ' ')} `;
  const tokens = t.trim().split(' ');
  const scores = {};
  for (const [key, words] of Object.entries(dict)) {
    let s = 0;
    for (const w of words) {
      let p = 0;
      if (w.includes(' ')) p = t.includes(` ${w} `) ? 4 : 0;
      else if (tokens.includes(w)) p = 3;
      else if (w.length > 3 && tokens.some((tok) => tok.startsWith(w))) p = 2;
      else if (w.length >= 6 && tokens.some((tok) => tok.length >= 5 && lev1(tok, w))) p = 1;
      if (p && WEAK.has(w)) p = 1;
      s += p;
    }
    if (s) scores[key] = s;
  }
  return scores;
}
const best = (scores) => Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

// Common, fairly distinctive words to guess the language of a message
const STOP = {
  de: ['ich', 'ist', 'und', 'der', 'die', 'das', 'wie', 'was', 'kann', 'gibt', 'haben', 'eine', 'ein', 'einen', 'nicht', 'fur', 'mit', 'wo', 'bitte', 'danke', 'sie', 'wir', 'kostet', 'zimmer', 'noch', 'frei', 'im', 'auf', 'bei', 'gibt', 'mochte', 'wann'],
  en: ['the', 'is', 'and', 'how', 'what', 'can', 'do', 'you', 'have', 'does', 'where', 'please', 'thanks', 'i', 'there', 'are', 'for', 'much', 'it', 'my', 'with', 'room', 'any', 'when', 'would', 'like'],
  fr: ['le', 'la', 'les', 'est', 'et', 'comment', 'quel', 'quelle', 'vous', 'merci', 'bonjour', 'combien', 'je', 'pour', 'avec', 'des', 'une', 'chambre', 'cherche', 'ca', 'coute', 'du', 'au', 'mois', 'puis', 'quand', 'nous'],
  it: ['il', 'lo', 'gli', 'come', 'quanto', 'posso', 'grazie', 'buongiorno', 'sono', 'dove', 'vorrei', 'per', 'della', 'una', 'che', 'camera', 'mese', 'cerco', 'di', 'e', 'mi', 'quando', 'libera', 'prezzo', 'affitto', 'ci'],
  es: ['el', 'los', 'como', 'cuanto', 'cuesta', 'puedo', 'gracias', 'hola', 'donde', 'quiero', 'hay', 'para', 'una', 'que', 'esta', 'tienen', 'tiene', 'del', 'y', 'busco', 'necesito', 'habitacion', 'libre', 'precio', 'alquiler', 'cuando', 'muy'],
  pt: ['os', 'como', 'quanto', 'posso', 'obrigado', 'obrigada', 'ola', 'onde', 'quero', 'para', 'um', 'uma', 'que', 'voces', 'voce', 'tem', 'custa', 'quarto', 'preciso', 'nao', 'livre', 'preco', 'quando', 'muito'],
};
export function guessLang(text, fallback) {
  const toks = norm(text).split(/[^a-z]+/).filter(Boolean);
  if (toks.length < 3) return fallback;
  const sc = Object.fromEntries(LANGS.map((l) => [l, toks.filter((t) => STOP[l].includes(t)).length]));
  const [top, second] = Object.entries(sc).sort((a, b) => b[1] - a[1]);
  return top[1] >= 2 && top[1] > second[1] ? top[0] : fallback;
}

// ─── Wording ────────────────────────────────────────────────────────────────

const ROOM = { Einzelzimmer: L('Einzelzimmer', 'single room', 'chambre simple', 'camera singola', 'habitación individual', 'quarto individual'), Doppelzimmer: L('Doppelzimmer', 'double room', 'chambre double', 'camera doppia', 'habitación doble', 'quarto duplo') };
const INCL = { Strom: L('Strom', 'electricity', 'électricité', 'elettricità', 'electricidad', 'eletricidade'), Internet: L('Internet', 'internet', 'internet', 'internet', 'internet', 'internet'), Wasser: L('Wasser', 'water', 'eau', 'acqua', 'agua', 'água'), 'Reinigung 1× Woche': L('Reinigung einmal pro Woche', 'cleaning once a week', 'ménage une fois par semaine', 'pulizia una volta alla settimana', 'limpieza una vez por semana', 'limpeza uma vez por semana') };
const W = {
  perMonth: L('pro Monat', 'per month', 'par mois', 'al mese', 'al mes', 'por mês'),
  from: L('ab', 'from', 'dès', 'da', 'desde', 'a partir de'),
  parking: L('Parkplatz', 'parking space', 'place de parc', 'posto auto', 'plaza de aparcamiento', 'lugar de estacionamento'),
  deposit: L('Kaution', 'deposit', 'caution', 'cauzione', 'fianza', 'caução'),
  included: L('Inbegriffen', 'Included', 'Compris', 'Incluso', 'Incluido', 'Incluído'),
};
const roomText = (r, lang) => `${pick(ROOM[r.label], lang) || r.label}${r.size ? ` (${r.size} m²)` : ''} ${r.from ? `${pick(W.from, lang)} ` : ''}${chf(r.price)}`;
const inclText = (lang) => LONG_STAY[0].includes.map((i) => pick(INCL[i], lang) || i).join(', ');

const LINK = {
  longStay: L('Long Stay ansehen', 'See Long Stay', 'Voir Long Stay', 'Vedi Long Stay', 'Ver Long Stay', 'Ver Long Stay'),
  anfrage: L('Mietanfrage stellen', 'Send a rental request', 'Demande de location', 'Richiesta di affitto', 'Solicitud de alquiler', 'Pedido de arrendamento'),
  termin: L('Termin vereinbaren', 'Book an appointment', 'Prendre rendez-vous', 'Fissare un appuntamento', 'Pedir cita', 'Marcar visita'),
  kontakt: L('Kontaktseite', 'Contact page', 'Page de contact', 'Pagina contatti', 'Página de contacto', 'Página de contacto'),
  hotel: L("N's Hotel ansehen", "See N's Hotel", "Voir N's Hotel", "Vedi N's Hotel", "Ver N's Hotel", "Ver N's Hotel"),
  cr: L('Casa Reto ansehen', 'See Casa Reto', 'Voir Casa Reto', 'Vedi Casa Reto', 'Ver Casa Reto', 'Ver Casa Reto'),
  crAsk: L('Casa Reto anfragen', 'Request Casa Reto', 'Demander Casa Reto', 'Richiedi Casa Reto', 'Solicitar Casa Reto', 'Pedir Casa Reto'),
  apt: L('Auf die Warteliste', 'Join the waiting list', "Liste d'attente", "Lista d'attesa", 'Lista de espera', 'Lista de espera'),
  sale: L('Verkauf', 'For sale', 'Vente', 'Vendita', 'Venta', 'Venda'),
  hypo: L('Hypothekenrechner', 'Mortgage calculator', 'Calculateur hypothécaire', 'Calcolatore ipoteca', 'Calculadora de hipoteca', 'Calculadora de hipoteca'),
  arch: L('Architektur', 'Architecture', 'Architecture', 'Architettura', 'Arquitectura', 'Arquitetura'),
  services: L('Alle Leistungen', 'All services', 'Toutes les prestations', 'Tutti i servizi', 'Todos los servicios', 'Todos os serviços'),
  projects: L('Projekte ansehen', 'See projects', 'Voir les projets', 'Vedi i progetti', 'Ver proyectos', 'Ver projetos'),
  about: L('Über uns', 'About us', 'À propos', 'Chi siamo', 'Sobre nosotros', 'Sobre nós'),
  team: L('Unser Team', 'Our team', 'Notre équipe', 'Il nostro team', 'Nuestro equipo', 'A nossa equipa'),
  storno: L('Stornierung & Rückerstattung', 'Cancellation & refunds', 'Annulation & remboursement', 'Cancellazione e rimborso', 'Cancelación y reembolso', 'Cancelamento e reembolso'),
  privacy: L('Datenschutz', 'Privacy policy', 'Protection des données', 'Protezione dei dati', 'Privacidad', 'Privacidade'),
  karte: L('Alle Standorte auf der Karte', 'All locations on the map', 'Tous les sites sur la carte', 'Tutte le sedi sulla mappa', 'Todas las ubicaciones en el mapa', 'Todas as localizações no mapa'),
};
const link = (to, key, lang) => ({ to, label: pick(LINK[key], lang) });
const ext = (url, label) => ({ to: url, label, external: true });

// Follow-up suggestions per subject (chip = topic shortcut)
export const CHIPS = {
  ls: [['ls', 'price', L('Preise', 'Prices', 'Prix', 'Prezzi', 'Precios', 'Preços')], ['ls', 'includes', L('Was ist inbegriffen?', "What's included?", 'Qu’est-ce qui est compris ?', 'Cosa è incluso?', '¿Qué incluye?', 'O que está incluído?')], ['ls', 'book', L('Anfrage stellen', 'Send request', 'Faire une demande', 'Fare richiesta', 'Solicitar', 'Fazer pedido')], ['ls', 'viewing', L('Besichtigung', 'Viewing', 'Visite', 'Visita', 'Visita', 'Visita')]],
  hotel: [['hotel', 'price', L('Preise', 'Prices', 'Prix', 'Prezzi', 'Precios', 'Preços')], ['hotel', 'book', L('Buchen', 'Book', 'Réserver', 'Prenotare', 'Reservar', 'Reservar')], ['hotel', 'parking', L('Parkplatz', 'Parking', 'Parking', 'Parcheggio', 'Aparcamiento', 'Estacionamento')], ['hotel', 'accessible', L('Barrierefrei', 'Accessible rooms', 'Chambres accessibles', 'Camere accessibili', 'Habitaciones accesibles', 'Quartos acessíveis')]],
  cr: [['cr', 'avail', L('Freie Daten prüfen', 'Check dates', 'Vérifier les dates', 'Verifica date', 'Ver fechas libres', 'Ver datas livres')], ['cr', 'price', L('Preise', 'Prices', 'Prix', 'Prezzi', 'Precios', 'Preços')], ['cr', 'rules', L('Hausregeln', 'House rules', 'Règles de la maison', 'Regole della casa', 'Normas de la casa', 'Regras da casa')], ['cr', 'where', L('Lage & Ausflüge', 'Location & trips', 'Situation & excursions', 'Posizione e gite', 'Ubicación y excursiones', 'Localização e passeios')]],
  arch: [['arch', 'services', L('Leistungen', 'Services', 'Prestations', 'Servizi', 'Servicios', 'Serviços')], ['arch', 'projects', L('Projekte', 'Projects', 'Projets', 'Progetti', 'Proyectos', 'Projetos')], ['arch', 'costs', L('Kosten & Ablauf', 'Fees & process', 'Coûts & déroulement', 'Costi e procedura', 'Costes y proceso', 'Custos e processo')], ['arch', 'viewing', L('Erstgespräch', 'First meeting', 'Premier entretien', 'Primo incontro', 'Primera reunión', 'Primeira reunião')]],
  general: [['ls', 'overview', L('Möblierte Zimmer', 'Furnished rooms', 'Chambres meublées', 'Camere arredate', 'Habitaciones amuebladas', 'Quartos mobilados')], ['hotel', 'overview', L("N's Hotel", "N's Hotel", "N's Hotel", "N's Hotel", "N's Hotel", "N's Hotel")], ['cr', 'overview', L('Ferienhaus Tessin', 'Holiday home Ticino', 'Maison de vacances Tessin', 'Casa vacanze Ticino', 'Casa de vacaciones Tesino', 'Casa de férias Ticino')], ['arch', 'overview', L('Architektur', 'Architecture', 'Architecture', 'Architettura', 'Arquitectura', 'Arquitetura')], ['company', 'contact', L('Kontakt & Zeiten', 'Contact & hours', 'Contact & horaires', 'Contatti e orari', 'Contacto y horarios', 'Contacto e horários')]],
};
export function chipsFor(subject, lang) {
  const group = ['kerzers', 'muenchenbuchsee', 'muri'].includes(subject) ? 'ls' : subject;
  return (CHIPS[group] || CHIPS.general).map(([s, i, label]) => ({ subject: s, intent: i, label: pick(label, lang) }));
}

// ─── Answers ────────────────────────────────────────────────────────────────

const lsByKey = (k) => LONG_STAY.find((l) => l.key === k);

function lsPlace(key, lang) {
  const l = lsByKey(key);
  const lines = l.rooms.map((r) => `- ${roomText(r, lang)} ${pick(W.perMonth, lang)}`);
  if (l.parking) lines.push(`- ${pick(W.parking, lang)} ${chf(l.parking)} ${pick(W.perMonth, lang)}`);
  if (l.deposit) lines.push(`- ${pick(W.deposit, lang)} ${chf(l.deposit)}`);
  const head = pick(L(`Long Stay in ${l.place}, möblierte Zimmer ab einem Monat:`, `Long Stay in ${l.place}, furnished rooms from one month:`, `Long Stay à ${l.place}, chambres meublées dès un mois :`, `Long Stay a ${l.place}, camere arredate da un mese:`, `Long Stay en ${l.place}, habitaciones amuebladas desde un mes:`, `Long Stay em ${l.place}, quartos mobilados a partir de um mês:`), lang);
  return { text: `${head}\n${lines.join('\n')}\n${pick(W.included, lang)}: ${inclText(lang)}.`, links: [{ to: l.link, label: `Long Stay ${l.place}` }, link(PAGES.anfrage, 'anfrage', lang)] };
}

function lsPrices(lang) {
  const lines = LONG_STAY.map((l) => `- ${l.place}: ${l.rooms.map((r) => roomText(r, lang)).join(', ')}`);
  const head = pick(L('Long Stay, Preise pro Monat:', 'Long Stay, prices per month:', 'Long Stay, prix par mois :', 'Long Stay, prezzi al mese:', 'Long Stay, precios por mes:', 'Long Stay, preços por mês:'), lang);
  const tail = pick(L(`${W.included.de}: ${inclText('de')}. In Kerzers kostet ein Parkplatz ${chf(lsByKey('kerzers').parking)} pro Monat.`, `${W.included.en}: ${inclText('en')}. In Kerzers a parking space costs ${chf(lsByKey('kerzers').parking)} per month.`, `${W.included.fr} : ${inclText('fr')}. À Kerzers, une place de parc coûte ${chf(lsByKey('kerzers').parking)} par mois.`, `${W.included.it}: ${inclText('it')}. A Kerzers un posto auto costa ${chf(lsByKey('kerzers').parking)} al mese.`, `${W.included.es}: ${inclText('es')}. En Kerzers, una plaza de aparcamiento cuesta ${chf(lsByKey('kerzers').parking)} al mes.`, `${W.included.pt}: ${inclText('pt')}. Em Kerzers, um lugar de estacionamento custa ${chf(lsByKey('kerzers').parking)} por mês.`), lang);
  return { text: `${head}\n${lines.join('\n')}\n${tail}`, links: [link(PAGES.longStay, 'longStay', lang), link(PAGES.anfrage, 'anfrage', lang)] };
}

const contactText = (lang) => pick(L(
  `- Telefon ${COMPANY.phone}, Mo–Fr 08:00–12:00 und 13:00–17:00 Uhr, in dringenden Fällen auch ausserhalb dieser Zeiten\n- E-Mail ${COMPANY.email}\n- Büro ${COMPANY.address}, Mo–Fr 07:30–12:00 und 13:00–17:00 Uhr`,
  `- Phone ${COMPANY.phone}, Mon–Fri 8:00–12:00 and 13:00–17:00, for urgent matters also outside these hours\n- E-mail ${COMPANY.email}\n- Office ${COMPANY.address}, Mon–Fri 7:30–12:00 and 13:00–17:00`,
  `- Téléphone ${COMPANY.phone}, lu–ve 8h00–12h00 et 13h00–17h00, en cas d’urgence aussi en dehors de ces heures\n- E-mail ${COMPANY.email}\n- Bureau ${COMPANY.address}, lu–ve 7h30–12h00 et 13h00–17h00`,
  `- Telefono ${COMPANY.phone}, lu–ve 8:00–12:00 e 13:00–17:00, per urgenze anche fuori orario\n- E-mail ${COMPANY.email}\n- Ufficio ${COMPANY.address}, lu–ve 7:30–12:00 e 13:00–17:00`,
  `- Teléfono ${COMPANY.phone}, lu–vi 8:00–12:00 y 13:00–17:00, para urgencias también fuera de ese horario\n- E-mail ${COMPANY.email}\n- Oficina ${COMPANY.address}, lu–vi 7:30–12:00 y 13:00–17:00`,
  `- Telefone ${COMPANY.phone}, seg–sex 8:00–12:00 e 13:00–17:00, para urgências também fora deste horário\n- E-mail ${COMPANY.email}\n- Escritório ${COMPANY.address}, seg–sex 7:30–12:00 e 13:00–17:00`,
), lang);

const crFacts = (lang) => pick(L(
  `${CASA_RETO.guests} Gäste, ${CASA_RETO.bedrooms} Schlafzimmer, ${CASA_RETO.beds} Betten, ${CASA_RETO.baths} Duschbäder, ${CASA_RETO.area}`,
  `${CASA_RETO.guests} guests, ${CASA_RETO.bedrooms} bedrooms, ${CASA_RETO.beds} beds, ${CASA_RETO.baths} shower rooms, ${CASA_RETO.area}`,
  `${CASA_RETO.guests} personnes, ${CASA_RETO.bedrooms} chambres, ${CASA_RETO.beds} lits, ${CASA_RETO.baths} salles de douche, ${CASA_RETO.area}`,
  `${CASA_RETO.guests} ospiti, ${CASA_RETO.bedrooms} camere, ${CASA_RETO.beds} letti, ${CASA_RETO.baths} bagni con doccia, ${CASA_RETO.area}`,
  `${CASA_RETO.guests} huéspedes, ${CASA_RETO.bedrooms} dormitorios, ${CASA_RETO.beds} camas, ${CASA_RETO.baths} baños con ducha, ${CASA_RETO.area}`,
  `${CASA_RETO.guests} hóspedes, ${CASA_RETO.bedrooms} quartos, ${CASA_RETO.beds} camas, ${CASA_RETO.baths} casas de banho, ${CASA_RETO.area}`,
), lang);
const score = String(CASA_RETO.rating.score).replace('.', ',');

const HANDLED = {
  ls: ['overview', 'price', 'includes', 'deposit', 'contract', 'avail', 'book', 'docs', 'viewing', 'company', 'parking', 'pets', 'where', 'amenities', 'services'],
  hotel: ['overview', 'price', 'book', 'avail', 'parking', 'checkin', 'accessible', 'family', 'amenities', 'includes', 'where', 'services'],
  cr: ['overview', 'price', 'avail', 'book', 'checkin', 'rules', 'pets', 'where', 'parking', 'amenities', 'family', 'includes', 'accessible', 'services'],
  arch: ['overview', 'services', 'projects', 'model3d', 'costs', 'price', 'viewing', 'book', 'avail'],
};
const NAME = { ls: 'Long Stay', kerzers: 'Long Stay Kerzers', muenchenbuchsee: 'Long Stay Münchenbuchsee', muri: 'Long Stay Muri', hotel: "N's Hotel", cr: 'Casa Reto', apt: null, sale: null, arch: 'AMONN ARCHITEKTUR' };
const SUBJECT_LINK = { ls: [PAGES.longStay, 'longStay'], kerzers: [PAGES.longStay, 'longStay'], muenchenbuchsee: [PAGES.longStay, 'longStay'], muri: [PAGES.longStay, 'longStay'], hotel: [HOTEL.link, 'hotel'], cr: [CASA_RETO.link, 'cr'], arch: [PAGES.architektur, 'arch'] };

/** Honest answer when we have no published fact for this detail. */
function unknownFor(subject, lang) {
  const n = NAME[subject] || 'Hans Amonn AG';
  const contact = subject === 'hotel' ? `${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}` : `${COMPANY.phone}, ${COMPANY.email}`;
  const sl = SUBJECT_LINK[subject];
  return {
    text: pick(L(
      `Dazu habe ich für ${n} keine gesicherte Angabe. Fragen Sie uns bitte direkt (${contact}), wir geben Ihnen gern Auskunft.`,
      `I have no reliable information on that for ${n}. Please ask us directly (${contact}); we'll be glad to help.`,
      `Je n’ai pas d’information sûre à ce sujet pour ${n}. Demandez-nous directement (${contact}).`,
      `Non ho un’informazione sicura su questo per ${n}. Ci chieda direttamente (${contact}).`,
      `No tengo un dato seguro sobre eso para ${n}. Pregúntenos directamente (${contact}).`,
      `Não tenho uma informação segura sobre isso para ${n}. Pergunte-nos diretamente (${contact}).`,
    ), lang),
    links: [link(PAGES.kontakt, 'kontakt', lang), ...(sl ? [link(sl[0], sl[1], lang)] : [])],
    subject,
    handoff: true,
  };
}

function offers(lang) {
  return {
    text: pick(L(
      `Wir bieten:\n- Long Stay: möblierte Zimmer ab einem Monat in Kerzers, Münchenbuchsee und Muri, ab ${chf(LONG_STAY_FROM)} pro Monat\n- N's Hotel in Kerzers, ab CHF ${HOTEL.priceFrom} pro Nacht\n- Casa Reto, Ferienhaus im Tessin für bis zu ${CASA_RETO.guests} Gäste\n- AMONN ARCHITEKTUR: Planung, Neubau, Umbau und Bauleitung`,
      `What we offer:\n- Long Stay: furnished rooms from one month in Kerzers, Münchenbuchsee and Muri, from ${chf(LONG_STAY_FROM)} per month\n- N's Hotel in Kerzers, from CHF ${HOTEL.priceFrom} per night\n- Casa Reto, holiday home in Ticino for up to ${CASA_RETO.guests} guests\n- AMONN ARCHITEKTUR: planning, new builds, conversions and site management`,
      `Nos offres :\n- Long Stay : chambres meublées dès un mois à Kerzers, Münchenbuchsee et Muri, dès ${chf(LONG_STAY_FROM)} par mois\n- N's Hotel à Kerzers, dès CHF ${HOTEL.priceFrom} la nuit\n- Casa Reto, maison de vacances au Tessin jusqu’à ${CASA_RETO.guests} personnes\n- AMONN ARCHITEKTUR : planification, construction, transformation et direction des travaux`,
      `Cosa offriamo:\n- Long Stay: camere arredate da un mese a Kerzers, Münchenbuchsee e Muri, da ${chf(LONG_STAY_FROM)} al mese\n- N's Hotel a Kerzers, da CHF ${HOTEL.priceFrom} a notte\n- Casa Reto, casa vacanze in Ticino fino a ${CASA_RETO.guests} ospiti\n- AMONN ARCHITEKTUR: progettazione, nuove costruzioni, ristrutturazioni e direzione lavori`,
      `Qué ofrecemos:\n- Long Stay: habitaciones amuebladas desde un mes en Kerzers, Münchenbuchsee y Muri, desde ${chf(LONG_STAY_FROM)} al mes\n- N's Hotel en Kerzers, desde CHF ${HOTEL.priceFrom} por noche\n- Casa Reto, casa de vacaciones en el Tesino para hasta ${CASA_RETO.guests} huéspedes\n- AMONN ARCHITEKTUR: planificación, obra nueva, reformas y dirección de obra`,
      `O que oferecemos:\n- Long Stay: quartos mobilados a partir de um mês em Kerzers, Münchenbuchsee e Muri, desde ${chf(LONG_STAY_FROM)} por mês\n- N's Hotel em Kerzers, desde CHF ${HOTEL.priceFrom} por noite\n- Casa Reto, casa de férias no Ticino até ${CASA_RETO.guests} hóspedes\n- AMONN ARCHITEKTUR: projeto, construção nova, remodelações e direção de obra`,
    ), lang),
    links: [link(PAGES.longStay, 'longStay', lang), link(PAGES.architektur, 'arch', lang)],
    subject: null,
  };
}

/** Returns { text, links, subject } or { check: { from, to } } for a calendar lookup. */
function answerFor(subject, intent, lang) {
  const S = subject;
  const isLs = ['ls', 'kerzers', 'muenchenbuchsee', 'muri'].includes(S);

  // Intents that mean the same everywhere
  if (intent === 'greet') return { text: pick(L('Guten Tag! Wobei kann ich helfen? Ich beantworte Fragen zu unseren Zimmern, zum Hotel, zur Casa Reto und zu unseren Bauprojekten.', 'Hello! How can I help? I can answer questions about our rooms, the hotel, Casa Reto and our building projects.', 'Bonjour ! Comment puis-je vous aider ? Je réponds aux questions sur nos chambres, l’hôtel, la Casa Reto et nos projets de construction.', 'Buongiorno! Come posso aiutare? Rispondo a domande sulle camere, l’hotel, la Casa Reto e i nostri progetti.', '¡Hola! ¿En qué puedo ayudar? Respondo preguntas sobre nuestras habitaciones, el hotel, la Casa Reto y nuestros proyectos.', 'Olá! Como posso ajudar? Respondo a perguntas sobre os quartos, o hotel, a Casa Reto e os nossos projetos.'), lang), subject: null };
  if (intent === 'thanks') return { text: pick(L('Gern geschehen! Melden Sie sich, wenn Sie noch etwas wissen möchten.', "You're welcome! Let me know if there is anything else.", 'Avec plaisir ! N’hésitez pas si vous avez d’autres questions.', 'Prego! Mi scriva se desidera sapere altro.', '¡De nada! Escríbame si quiere saber algo más.', 'De nada! Diga-me se quiser saber mais alguma coisa.'), lang), subject: S };
  if (intent === 'human') return { text: pick(L(`Gern verbinden wir Sie mit uns persönlich. Rufen Sie an (${COMPANY.phone}), schreiben Sie auf WhatsApp oder senden Sie dieses Gespräch per E-Mail an uns, die Knöpfe finden Sie oben im Chat.`, `We'd be happy to talk to you in person. Call us (${COMPANY.phone}), write on WhatsApp or send this conversation to us by e-mail; the buttons are at the top of the chat.`, `Nous vous répondons volontiers personnellement. Appelez-nous (${COMPANY.phone}), écrivez sur WhatsApp ou envoyez-nous cette conversation par e-mail ; les boutons sont en haut du chat.`, `Siamo felici di parlarle di persona. Ci chiami (${COMPANY.phone}), scriva su WhatsApp o ci invii questa conversazione per e-mail; i pulsanti sono in alto nella chat.`, `Con gusto le atendemos personalmente. Llámenos (${COMPANY.phone}), escriba por WhatsApp o envíenos esta conversación por e-mail; los botones están arriba en el chat.`, `Teremos todo o gosto em falar consigo. Ligue (${COMPANY.phone}), escreva no WhatsApp ou envie-nos esta conversa por e-mail; os botões estão no topo do chat.`), lang), links: [link(PAGES.kontakt, 'kontakt', lang)], subject: S, handoff: true };
  if (intent === 'contact' || intent === 'hours') {
    if (S === 'hotel') return { text: pick(L(`N's Hotel: E-Mail ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.\nAllgemein:\n${contactText('de')}`, `N's Hotel: e-mail ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.\nGeneral:\n${contactText('en')}`, `N's Hotel : e-mail ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.\nEn général :\n${contactText('fr')}`, `N's Hotel: e-mail ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.\nIn generale:\n${contactText('it')}`, `N's Hotel: e-mail ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.\nEn general:\n${contactText('es')}`, `N's Hotel: e-mail ${HOTEL.email}, WhatsApp ${HOTEL.whatsapp}.\nEm geral:\n${contactText('pt')}`), lang), links: [link(HOTEL.link, 'hotel', lang)], subject: S };
    return { text: `${pick(L('So erreichen Sie uns:', 'How to reach us:', 'Pour nous joindre :', 'Come raggiungerci:', 'Cómo contactarnos:', 'Como nos contactar:'), lang)}\n${contactText(lang)}`, links: [link(PAGES.kontakt, 'kontakt', lang), link(PAGES.termin, 'termin', lang)], subject: 'company' };
  }
  if (intent === 'about') return { text: pick(L(`Die Hans Amonn AG ist ein Familienunternehmen in Muri bei Bern. Hans Amonn hat sie ${COMPANY.founded} gegründet, seit 1983 führt sein Sohn Reto Amonn das Unternehmen. Wir planen und bauen (AMONN ARCHITEKTUR) und bieten möblierte Zimmer, das N's Hotel und die Casa Reto im Tessin an.`, `Hans Amonn AG is a family business in Muri near Bern, founded by Hans Amonn in ${COMPANY.founded}. Since 1983 his son Reto Amonn has led the company. We plan and build (AMONN ARCHITEKTUR) and offer furnished rooms, N's Hotel and Casa Reto in Ticino.`, `La Hans Amonn AG est une entreprise familiale à Muri près de Berne, fondée en ${COMPANY.founded} par Hans Amonn. Depuis 1983, son fils Reto Amonn la dirige. Nous planifions et construisons (AMONN ARCHITEKTUR) et proposons des chambres meublées, le N's Hotel et la Casa Reto au Tessin.`, `La Hans Amonn AG è un’azienda di famiglia a Muri presso Berna, fondata nel ${COMPANY.founded} da Hans Amonn. Dal 1983 la guida il figlio Reto Amonn. Progettiamo e costruiamo (AMONN ARCHITEKTUR) e offriamo camere arredate, il N's Hotel e la Casa Reto in Ticino.`, `Hans Amonn AG es una empresa familiar en Muri bei Bern, fundada en ${COMPANY.founded} por Hans Amonn. Desde 1983 la dirige su hijo Reto Amonn. Planificamos y construimos (AMONN ARCHITEKTUR) y ofrecemos habitaciones amuebladas, el N's Hotel y la Casa Reto en el Tesino.`, `A Hans Amonn AG é uma empresa familiar em Muri bei Bern, fundada em ${COMPANY.founded} por Hans Amonn. Desde 1983 é dirigida pelo filho Reto Amonn. Projetamos e construímos (AMONN ARCHITEKTUR) e oferecemos quartos mobilados, o N's Hotel e a Casa Reto no Ticino.`), lang), links: [link(PAGES.ueberUns, 'about', lang), link(PAGES.team, 'team', lang)], subject: 'company' };
  if (intent === 'team') return { text: pick(L('Unser Team stellen wir auf der Teamseite vor. Geschäftsführer ist Reto Amonn.', 'Our team is presented on the team page. The managing director is Reto Amonn.', 'Notre équipe est présentée sur la page équipe. Le directeur est Reto Amonn.', 'Il nostro team è presentato nella pagina del team. Il direttore è Reto Amonn.', 'Presentamos a nuestro equipo en la página del equipo. El director es Reto Amonn.', 'Apresentamos a nossa equipa na página da equipa. O diretor é Reto Amonn.'), lang), links: [link(PAGES.team, 'team', lang)], subject: 'company' };
  if (intent === 'storno') return { text: pick(L('Bei Buchungen über Airbnb, Booking.com oder my.ns-hotel.ch gelten die Stornierungsbedingungen der Plattform. Bei direkten Buchungen gilt unsere schriftliche Offerte, beim Long Stay der Mietvertrag.', 'For bookings via Airbnb, Booking.com or my.ns-hotel.ch the platform’s cancellation terms apply. For direct bookings our written offer applies, for Long Stay the rental contract.', 'Pour les réservations via Airbnb, Booking.com ou my.ns-hotel.ch, les conditions d’annulation de la plateforme s’appliquent. Pour les réservations directes, notre offre écrite ; pour le Long Stay, le contrat de location.', 'Per le prenotazioni tramite Airbnb, Booking.com o my.ns-hotel.ch valgono le condizioni della piattaforma. Per le prenotazioni dirette vale la nostra offerta scritta, per il Long Stay il contratto di locazione.', 'Para reservas por Airbnb, Booking.com o my.ns-hotel.ch rigen las condiciones de la plataforma. Para reservas directas, nuestra oferta escrita; para Long Stay, el contrato de alquiler.', 'Para reservas via Airbnb, Booking.com ou my.ns-hotel.ch aplicam-se as condições da plataforma. Para reservas diretas, a nossa oferta escrita; para Long Stay, o contrato de arrendamento.'), lang), links: [link(PAGES.storno, 'storno', lang)], subject: S };
  if (intent === 'privacy') return { text: pick(L('Wie wir Personendaten bearbeiten, auch die Eingaben in diesem Chat, steht in unserer Datenschutzerklärung. Bitte geben Sie hier keine Personendaten ein.', 'How we process personal data, including what you type in this chat, is described in our privacy policy. Please do not enter personal data here.', 'Notre déclaration de protection des données explique comment nous traitons les données personnelles, y compris ce que vous écrivez dans ce chat. N’indiquez pas de données personnelles ici.', 'L’informativa sulla privacy spiega come trattiamo i dati personali, anche quanto scrive in questa chat. Non inserisca dati personali qui.', 'Nuestra política de privacidad explica cómo tratamos los datos personales, también lo que escribe en este chat. No introduzca datos personales aquí.', 'A nossa política de privacidade explica como tratamos os dados pessoais, incluindo o que escreve neste chat. Não introduza dados pessoais aqui.'), lang), links: [link(PAGES.datenschutz, 'privacy', lang)], subject: S };
  if (intent === 'job') return { text: pick(L(`Offene Stellen veröffentlichen wir nicht im Chat. Schreiben Sie uns gern an ${COMPANY.email}.`, `We don't publish vacancies in the chat. Feel free to write to ${COMPANY.email}.`, `Nous ne publions pas d’offres d’emploi dans le chat. Écrivez-nous à ${COMPANY.email}.`, `Non pubblichiamo posti di lavoro nella chat. Ci scriva a ${COMPANY.email}.`, `No publicamos vacantes en el chat. Escríbanos a ${COMPANY.email}.`, `Não publicamos vagas no chat. Escreva-nos para ${COMPANY.email}.`), lang), links: [link(PAGES.kontakt, 'kontakt', lang)], subject: 'company' };

  if (S === 'company' || !S) return intent === 'services' ? offers(lang) : null;
  const handled = HANDLED[isLs ? 'ls' : S];
  if (handled && !handled.includes(intent)) return unknownFor(S, lang);

  // Long Stay
  if (isLs) {
    const place = S !== 'ls' ? S : null;
    if (place && ['overview', 'price', 'includes', 'deposit', 'where'].includes(intent)) return { ...lsPlace(place, lang), subject: place };
    switch (intent) {
      case 'price': return { ...lsPrices(lang), subject: 'ls' };
      case 'includes': return { text: pick(L(`Beim Long Stay sind ${inclText('de')} im Mietpreis inbegriffen. Die Zimmer sind voll möbliert. In Kerzers können Sie einen Parkplatz für ${chf(lsByKey('kerzers').parking)} pro Monat dazumieten.`, `Long Stay rent includes ${inclText('en')}. The rooms are fully furnished. In Kerzers you can add a parking space for ${chf(lsByKey('kerzers').parking)} per month.`, `Le loyer Long Stay comprend ${inclText('fr')}. Les chambres sont entièrement meublées. À Kerzers, une place de parc coûte ${chf(lsByKey('kerzers').parking)} par mois en plus.`, `L’affitto Long Stay comprende ${inclText('it')}. Le camere sono completamente arredate. A Kerzers si può aggiungere un posto auto per ${chf(lsByKey('kerzers').parking)} al mese.`, `El alquiler Long Stay incluye ${inclText('es')}. Las habitaciones están totalmente amuebladas. En Kerzers puede añadir una plaza de aparcamiento por ${chf(lsByKey('kerzers').parking)} al mes.`, `A renda Long Stay inclui ${inclText('pt')}. Os quartos estão totalmente mobilados. Em Kerzers pode juntar um lugar de estacionamento por ${chf(lsByKey('kerzers').parking)} por mês.`), lang), links: [link(PAGES.longStay, 'longStay', lang)], subject: 'ls' };
      case 'deposit': return { text: pick(L(`In Münchenbuchsee beträgt die Kaution ${chf(lsByKey('muenchenbuchsee').deposit)}. Für Kerzers und Muri steht sie im Mietvertrag, wir nennen sie Ihnen gern bei der Anfrage.`, `In Münchenbuchsee the deposit is ${chf(lsByKey('muenchenbuchsee').deposit)}. For Kerzers and Muri it is set in the rental contract; we will tell you with your request.`, `À Münchenbuchsee, la caution est de ${chf(lsByKey('muenchenbuchsee').deposit)}. Pour Kerzers et Muri, elle figure dans le contrat ; nous vous l’indiquons lors de la demande.`, `A Münchenbuchsee la cauzione è di ${chf(lsByKey('muenchenbuchsee').deposit)}. Per Kerzers e Muri è indicata nel contratto; gliela comunichiamo con la richiesta.`, `En Münchenbuchsee la fianza es de ${chf(lsByKey('muenchenbuchsee').deposit)}. Para Kerzers y Muri figura en el contrato; se la indicamos con la solicitud.`, `Em Münchenbuchsee a caução é de ${chf(lsByKey('muenchenbuchsee').deposit)}. Para Kerzers e Muri consta do contrato; indicamos-lha com o pedido.`), lang), links: [link(PAGES.anfrage, 'anfrage', lang)], subject: 'ls' };
      case 'contract': return { text: pick(L('Der Mindestaufenthalt beim Long Stay ist ein Monat. Kündigungsfristen und Bedingungen stehen im schriftlichen Mietvertrag.', 'The minimum Long Stay is one month. Notice periods and conditions are set out in the written rental contract.', 'Le séjour minimum Long Stay est d’un mois. Les délais de résiliation et les conditions figurent dans le contrat écrit.', 'Il soggiorno minimo Long Stay è di un mese. Termini di disdetta e condizioni sono nel contratto scritto.', 'La estancia mínima Long Stay es de un mes. Los plazos de preaviso y las condiciones figuran en el contrato escrito.', 'A estadia mínima Long Stay é de um mês. Prazos de rescisão e condições constam do contrato escrito.'), lang), links: [link(PAGES.anfrage, 'anfrage', lang)], subject: 'ls' };
      case 'avail': case 'book': case 'docs': return { text: pick(L('Freie Zimmer prüfen wir persönlich. Stellen Sie online eine Mietanfrage mit Wunschort und Einzugsdatum, wir melden uns mit der Verfügbarkeit. Welche Angaben und Unterlagen wir brauchen, zeigt Ihnen das Formular.', 'We check free rooms personally. Send an online rental request with your preferred location and move-in date and we will reply with availability. The form shows which details and documents we need.', 'Nous vérifions personnellement les chambres libres. Envoyez une demande en ligne avec le lieu et la date d’arrivée souhaités ; nous vous répondons avec les disponibilités. Le formulaire indique les informations et documents nécessaires.', 'Verifichiamo di persona le camere libere. Invii una richiesta online con luogo e data di arrivo desiderati; le risponderemo con la disponibilità. Il modulo indica dati e documenti necessari.', 'Comprobamos personalmente las habitaciones libres. Envíe una solicitud en línea con el lugar y la fecha de entrada deseados y le responderemos con la disponibilidad. El formulario indica los datos y documentos necesarios.', 'Verificamos pessoalmente os quartos livres. Envie um pedido online com o local e a data de entrada pretendidos e responderemos com a disponibilidade. O formulário indica os dados e documentos necessários.'), lang), links: [link(PAGES.anfrage, 'anfrage', lang), link(PAGES.longStay, 'longStay', lang)], subject: 'ls' };
      case 'viewing': return { text: pick(L('Besichtigungen sind nach Vereinbarung möglich. Schlagen Sie online einen Termin vor oder rufen Sie uns an.', 'Viewings are possible by appointment. Suggest a date online or give us a call.', 'Les visites sont possibles sur rendez-vous. Proposez une date en ligne ou appelez-nous.', 'Le visite sono possibili su appuntamento. Proponga una data online o ci chiami.', 'Las visitas son posibles con cita previa. Proponga una fecha en línea o llámenos.', 'As visitas são possíveis por marcação. Proponha uma data online ou ligue-nos.'), lang), links: [link(PAGES.termin, 'termin', lang)], subject: 'ls' };
      case 'company': return { text: pick(L('Für Mitarbeitende oder Teams können Sie mehrere Zimmer anfragen. Schreiben Sie in der Mietanfrage, wie viele Personen ab wann und wie lange wohnen, wir machen Ihnen ein Angebot.', 'You can request several rooms for employees or teams. Tell us in the rental request how many people, from when and for how long, and we will make you an offer.', 'Vous pouvez demander plusieurs chambres pour vos collaborateurs. Indiquez dans la demande le nombre de personnes, la date et la durée ; nous vous ferons une offre.', 'Può richiedere più camere per collaboratori o team. Indichi nella richiesta quante persone, da quando e per quanto tempo; le faremo un’offerta.', 'Puede solicitar varias habitaciones para empleados o equipos. Indique en la solicitud cuántas personas, desde cuándo y por cuánto tiempo, y le haremos una oferta.', 'Pode pedir vários quartos para colaboradores ou equipas. Indique no pedido quantas pessoas, desde quando e por quanto tempo, e faremos uma proposta.'), lang), links: [link(PAGES.anfrage, 'anfrage', lang)], subject: 'ls' };
      case 'parking': return { text: pick(L(`In Kerzers kostet ein Parkplatz ${chf(lsByKey('kerzers').parking)} pro Monat. In Muri und Münchenbuchsee gibt es Parkplätze nach Verfügbarkeit, bitte erwähnen Sie Ihr Auto in der Anfrage.`, `In Kerzers a parking space costs ${chf(lsByKey('kerzers').parking)} per month. In Muri and Münchenbuchsee parking depends on availability; please mention your car in the request.`, `À Kerzers, une place de parc coûte ${chf(lsByKey('kerzers').parking)} par mois. À Muri et Münchenbuchsee, selon disponibilité ; mentionnez votre voiture dans la demande.`, `A Kerzers un posto auto costa ${chf(lsByKey('kerzers').parking)} al mese. A Muri e Münchenbuchsee secondo disponibilità; indichi l’auto nella richiesta.`, `En Kerzers, una plaza cuesta ${chf(lsByKey('kerzers').parking)} al mes. En Muri y Münchenbuchsee según disponibilidad; mencione su coche en la solicitud.`, `Em Kerzers, um lugar custa ${chf(lsByKey('kerzers').parking)} por mês. Em Muri e Münchenbuchsee conforme disponibilidade; mencione o carro no pedido.`), lang), links: [link(PAGES.anfrage, 'anfrage', lang)], subject: 'ls' };
      case 'pets': return { text: pick(L('Ob Haustiere möglich sind, klären wir je nach Zimmer. Bitte erwähnen Sie Ihr Tier in der Anfrage.', 'Whether pets are possible depends on the room. Please mention your pet in the request.', 'Les animaux sont possibles selon la chambre. Mentionnez votre animal dans la demande.', 'Gli animali sono possibili a seconda della camera. Indichi l’animale nella richiesta.', 'Las mascotas dependen de la habitación. Mencione su mascota en la solicitud.', 'Os animais dependem do quarto. Mencione o seu animal no pedido.'), lang), links: [link(PAGES.anfrage, 'anfrage', lang)], subject: 'ls' };
      default: return { text: pick(L(`Long Stay sind möblierte Zimmer ab einem Monat in Kerzers, Münchenbuchsee und Muri bei Bern, ab ${chf(LONG_STAY_FROM)} pro Monat. ${W.included.de}: ${inclText('de')}. Ideal für Berufspendler, Projektteams oder die Zeit zwischen zwei Wohnungen.`, `Long Stay means furnished rooms from one month in Kerzers, Münchenbuchsee and Muri near Bern, from ${chf(LONG_STAY_FROM)} per month. ${W.included.en}: ${inclText('en')}. Ideal for commuters, project teams or the time between two flats.`, `Le Long Stay, ce sont des chambres meublées dès un mois à Kerzers, Münchenbuchsee et Muri près de Berne, dès ${chf(LONG_STAY_FROM)} par mois. ${W.included.fr} : ${inclText('fr')}.`, `Long Stay sono camere arredate da un mese a Kerzers, Münchenbuchsee e Muri presso Berna, da ${chf(LONG_STAY_FROM)} al mese. ${W.included.it}: ${inclText('it')}.`, `Long Stay son habitaciones amuebladas desde un mes en Kerzers, Münchenbuchsee y Muri bei Bern, desde ${chf(LONG_STAY_FROM)} al mes. ${W.included.es}: ${inclText('es')}.`, `Long Stay são quartos mobilados a partir de um mês em Kerzers, Münchenbuchsee e Muri bei Bern, desde ${chf(LONG_STAY_FROM)} por mês. ${W.included.pt}: ${inclText('pt')}.`), lang), links: [link(PAGES.longStay, 'longStay', lang), link(PAGES.anfrage, 'anfrage', lang)], subject: 'ls' };
    }
  }

  // N's Hotel
  if (S === 'hotel') {
    const book = HOTEL.booking.map((b) => ext(b.url, b.label));
    switch (intent) {
      case 'price': return { text: pick(L(`Zimmer im N's Hotel gibt es ab CHF ${HOTEL.priceFrom} pro Nacht, zuzüglich Aufenthaltstaxe des Kantons Freiburg. Den aktuellen Preis für Ihre Daten sehen Sie beim Buchen.`, `Rooms at N's Hotel start at CHF ${HOTEL.priceFrom} per night, plus the tourist tax of the canton of Fribourg. You see the current price for your dates when booking.`, `Les chambres du N's Hotel sont dès CHF ${HOTEL.priceFrom} la nuit, plus la taxe de séjour du canton de Fribourg. Le prix exact s’affiche lors de la réservation.`, `Le camere del N's Hotel costano da CHF ${HOTEL.priceFrom} a notte, più la tassa di soggiorno del Canton Friburgo. Il prezzo esatto appare durante la prenotazione.`, `Las habitaciones del N's Hotel cuestan desde CHF ${HOTEL.priceFrom} por noche, más la tasa turística del cantón de Friburgo. Verá el precio exacto al reservar.`, `Os quartos do N's Hotel custam desde CHF ${HOTEL.priceFrom} por noite, mais a taxa turística do cantão de Friburgo. O preço exato aparece ao reservar.`), lang), links: book, subject: 'hotel' };
      case 'book': case 'avail': return { text: pick(L('Freie Zimmer und Preise für Ihre Daten sehen Sie direkt beim Buchen: auf unserer eigenen Buchungsseite oder über Booking.com und Airbnb.', 'You see free rooms and prices for your dates directly when booking, on our own booking page or via Booking.com and Airbnb.', 'Vous voyez les chambres libres et les prix lors de la réservation, sur notre propre page ou via Booking.com et Airbnb.', 'Camere libere e prezzi per le sue date si vedono durante la prenotazione, sulla nostra pagina o tramite Booking.com e Airbnb.', 'Verá las habitaciones libres y los precios al reservar, en nuestra propia página o por Booking.com y Airbnb.', 'Vê os quartos livres e os preços ao reservar, na nossa própria página ou via Booking.com e Airbnb.'), lang), links: book, subject: 'hotel' };
      case 'parking': return { text: pick(L("Beim N's Hotel parkieren Sie kostenlos direkt beim Haus.", "Parking at N's Hotel is free, right by the building.", "Le parking du N's Hotel est gratuit, juste devant l’hôtel.", "Il parcheggio del N's Hotel è gratuito, accanto all’edificio.", "El aparcamiento del N's Hotel es gratuito, junto al edificio.", "O estacionamento do N's Hotel é gratuito, junto ao edifício."), lang), links: [link(HOTEL.link, 'hotel', lang)], subject: 'hotel' };
      case 'checkin': return { text: pick(L(`Im N's Hotel checken Sie selbst und kontaktlos ein. Fragen zur Anreise beantwortet das Hotel unter ${HOTEL.email} oder per WhatsApp ${HOTEL.whatsapp}.`, `At N's Hotel you check in yourself, contactless. The hotel answers questions about your arrival at ${HOTEL.email} or on WhatsApp ${HOTEL.whatsapp}.`, `Au N's Hotel, vous faites votre check-in vous-même, sans contact. Questions sur l’arrivée : ${HOTEL.email} ou WhatsApp ${HOTEL.whatsapp}.`, `Al N's Hotel il check-in è autonomo e senza contatto. Domande sull’arrivo: ${HOTEL.email} o WhatsApp ${HOTEL.whatsapp}.`, `En el N's Hotel hace el check-in usted mismo, sin contacto. Preguntas sobre la llegada: ${HOTEL.email} o WhatsApp ${HOTEL.whatsapp}.`, `No N's Hotel faz o check-in sozinho, sem contacto. Perguntas sobre a chegada: ${HOTEL.email} ou WhatsApp ${HOTEL.whatsapp}.`), lang), links: [link(HOTEL.link, 'hotel', lang)], subject: 'hotel' };
      case 'accessible': case 'family': case 'amenities': case 'includes': return { text: pick(L(`Das N's Hotel hat Doppelzimmer, Familienzimmer mit Verbindungstür und barrierefreie Zimmer mit schwellenlosem Zugang. Dazu eine Lounge, eine Gemeinschaftsküche, Schliessfächer und WLAN.`, `N's Hotel has double rooms, family rooms with a connecting door and accessible rooms with step-free access, plus a lounge, a shared kitchen, lockers and Wi-Fi.`, `Le N's Hotel propose des chambres doubles, des chambres familiales communicantes et des chambres accessibles sans marche, ainsi qu’un lounge, une cuisine commune, des casiers et le Wi-Fi.`, `Il N's Hotel ha camere doppie, camere familiari comunicanti e camere accessibili senza gradini, oltre a lounge, cucina comune, armadietti e Wi-Fi.`, `El N's Hotel tiene habitaciones dobles, familiares comunicadas y accesibles sin escalones, además de salón, cocina compartida, taquillas y Wi-Fi.`, `O N's Hotel tem quartos duplos, quartos familiares comunicantes e quartos acessíveis sem degraus, além de lounge, cozinha partilhada, cacifos e Wi-Fi.`), lang), links: [link(HOTEL.link, 'hotel', lang)], subject: 'hotel' };
      case 'where': return { text: pick(L(`Das N's Hotel liegt an der ${HOTEL.address}, rund 22 km von Bern, an der Bahnlinie Bern–Neuchâtel.`, `N's Hotel is at ${HOTEL.address}, about 22 km from Bern, on the Bern–Neuchâtel railway line.`, `Le N's Hotel se trouve ${HOTEL.address}, à environ 22 km de Berne, sur la ligne Berne–Neuchâtel.`, `Il N's Hotel si trova in ${HOTEL.address}, a circa 22 km da Berna, sulla linea Berna–Neuchâtel.`, `El N's Hotel está en ${HOTEL.address}, a unos 22 km de Berna, en la línea Berna–Neuchâtel.`, `O N's Hotel fica em ${HOTEL.address}, a cerca de 22 km de Berna, na linha Berna–Neuchâtel.`), lang), links: [link(HOTEL.link, 'hotel', lang)], subject: 'hotel' };
      default: return { text: pick(L(`Das N's Hotel in Kerzers hat ${HOTEL.rooms} Zimmer mit Self Check-in, kostenlosem Parkplatz und WLAN, ab CHF ${HOTEL.priceFrom} pro Nacht. Ideal für Geschäftsreisen und Kurzaufenthalte, rund 22 km von Bern.`, `N's Hotel in Kerzers has ${HOTEL.rooms} rooms with self check-in, free parking and Wi-Fi, from CHF ${HOTEL.priceFrom} per night. Ideal for business trips and short stays, about 22 km from Bern.`, `Le N's Hotel à Kerzers compte ${HOTEL.rooms} chambres avec self check-in, parking gratuit et Wi-Fi, dès CHF ${HOTEL.priceFrom} la nuit, à environ 22 km de Berne.`, `Il N's Hotel a Kerzers ha ${HOTEL.rooms} camere con self check-in, parcheggio gratuito e Wi-Fi, da CHF ${HOTEL.priceFrom} a notte, a circa 22 km da Berna.`, `El N's Hotel en Kerzers tiene ${HOTEL.rooms} habitaciones con self check-in, aparcamiento gratuito y Wi-Fi, desde CHF ${HOTEL.priceFrom} por noche, a unos 22 km de Berna.`, `O N's Hotel em Kerzers tem ${HOTEL.rooms} quartos com self check-in, estacionamento gratuito e Wi-Fi, desde CHF ${HOTEL.priceFrom} por noite, a cerca de 22 km de Berna.`), lang), links: [link(HOTEL.link, 'hotel', lang), ...book.slice(0, 1)], subject: 'hotel' };
    }
  }

  // Casa Reto
  if (S === 'cr') {
    const ask = link(CASA_RETO.inquiry, 'crAsk', lang);
    switch (intent) {
      case 'avail': return { needDates: true, subject: 'cr' };
      case 'book': return { text: pick(L('Die Casa Reto können Sie über unser Anfrageformular, über Airbnb oder Booking.com buchen. Schreiben Sie mir Ihre Reisedaten, dann prüfe ich vorher den Kalender.', 'You can book Casa Reto through our request form, Airbnb or Booking.com. Tell me your travel dates and I will check the calendar first.', 'Vous pouvez réserver la Casa Reto via notre formulaire, Airbnb ou Booking.com. Indiquez-moi vos dates et je vérifie d’abord le calendrier.', 'Può prenotare la Casa Reto tramite il nostro modulo, Airbnb o Booking.com. Mi scriva le date e controllo prima il calendario.', 'Puede reservar la Casa Reto con nuestro formulario, por Airbnb o Booking.com. Escríbame sus fechas y compruebo antes el calendario.', 'Pode reservar a Casa Reto pelo nosso formulário, pelo Airbnb ou pela Booking.com. Diga-me as datas e verifico primeiro o calendário.'), lang), links: [ask, ...CASA_RETO.booking.map((b) => ext(b.url, b.label))], subject: 'cr' };
      case 'accessible': return { text: pick(L(`Die Casa Reto ist nicht barrierefrei: ${CASA_RETO.stairs}. Ein Schlafzimmer liegt im Erdgeschoss. Bei Fragen helfen wir gern persönlich.`, 'Casa Reto is not step-free: bedrooms 2 to 4 are upstairs. One bedroom is on the ground floor. We are happy to answer questions personally.', 'La Casa Reto n’est pas accessible en fauteuil : les chambres 2 à 4 sont à l’étage. Une chambre est au rez-de-chaussée.', 'La Casa Reto non è priva di barriere: le camere 2–4 sono al piano superiore. Una camera è al piano terra.', 'La Casa Reto no es accesible sin escalones: los dormitorios 2 a 4 están arriba. Un dormitorio está en la planta baja.', 'A Casa Reto não é acessível sem degraus: os quartos 2 a 4 ficam no piso superior. Um quarto fica no rés-do-chão.'), lang), links: [link(PAGES.kontakt, 'kontakt', lang)], subject: 'cr' };
      case 'price': return { text: pick(L(`Die Preise der Casa Reto hängen von Saison und Aufenthaltsdauer ab, feste Preise veröffentlichen wir nicht. Senden Sie eine Anfrage mit Ihren Daten oder sehen Sie den Preis direkt auf Airbnb oder Booking.com. Dazu kommt die Kurtaxe von CHF 2.00 pro Person ab 14 Jahren und Nacht.`, `Casa Reto prices depend on season and length of stay; we do not publish fixed prices. Send a request with your dates or see the price on Airbnb or Booking.com. The tourist tax of CHF 2.00 per person aged 14+ per night is added.`, `Les prix de la Casa Reto dépendent de la saison et de la durée. Envoyez une demande avec vos dates ou consultez Airbnb ou Booking.com. La taxe de séjour de CHF 2.00 par personne dès 14 ans et par nuit s’ajoute.`, `I prezzi della Casa Reto dipendono da stagione e durata. Invii una richiesta con le sue date o veda il prezzo su Airbnb o Booking.com. Si aggiunge la tassa di soggiorno di CHF 2.00 a persona dai 14 anni a notte.`, `Los precios de la Casa Reto dependen de la temporada y la duración. Envíe una solicitud con sus fechas o vea el precio en Airbnb o Booking.com. Se añade la tasa turística de CHF 2.00 por persona desde 14 años y noche.`, `Os preços da Casa Reto dependem da época e da duração. Envie um pedido com as suas datas ou veja o preço no Airbnb ou Booking.com. Acresce a taxa turística de CHF 2.00 por pessoa a partir dos 14 anos e por noite.`), lang), links: [ask, ...CASA_RETO.booking.map((b) => ext(b.url, b.label))], subject: 'cr' };
      case 'pets': return { text: pick(L(`Haustiere sind in der Casa Reto ${CASA_RETO.pets}.`, 'Pets are welcome at Casa Reto; please mention them in your request.', 'Les animaux sont les bienvenus à la Casa Reto ; merci de les indiquer dans la demande.', 'Gli animali sono benvenuti alla Casa Reto; li indichi nella richiesta.', 'Las mascotas son bienvenidas en la Casa Reto; indíquelo en la solicitud.', 'Os animais são bem-vindos na Casa Reto; indique-os no pedido.'), lang), links: [ask], subject: 'cr' };
      case 'checkin': return { text: pick(L(`Casa Reto: Check-in ${CASA_RETO.checkIn}, Check-out ${CASA_RETO.checkOut}. Die genaue Adresse erhalten Sie mit der Buchungsbestätigung.`, 'Casa Reto: check-in from 3 pm to midnight with a key box, check-out by 10 am. You receive the exact address with the booking confirmation.', 'Casa Reto : arrivée de 15h à minuit avec boîte à clés, départ avant 10h. L’adresse exacte figure dans la confirmation de réservation.', 'Casa Reto: check-in dalle 15 alle 24 con cassetta chiavi, check-out entro le 10. L’indirizzo esatto arriva con la conferma.', 'Casa Reto: entrada de 15 a 24 h con caja de llaves, salida antes de las 10 h. La dirección exacta llega con la confirmación.', 'Casa Reto: check-in das 15h às 24h com caixa de chaves, check-out até às 10h. A morada exata chega com a confirmação.'), lang), links: [link(CASA_RETO.link, 'cr', lang)], subject: 'cr' };
      case 'rules': return { text: pick(L(`Hausregeln der Casa Reto: Check-in ${CASA_RETO.checkIn}, Check-out ${CASA_RETO.checkOut}. Haustiere ${CASA_RETO.pets}. Rauchen ${CASA_RETO.smoking}, ${CASA_RETO.parties}. Höchstens ${CASA_RETO.guests} Gäste. Kurtaxe ${CASA_RETO.tax}.`, `Casa Reto house rules: check-in 3 pm to midnight with a key box, check-out by 10 am. Pets welcome (please mention them). No smoking inside, no parties. Up to ${CASA_RETO.guests} guests. Tourist tax CHF 2.00 per person aged 14+ per night.`, `Règles de la Casa Reto : arrivée de 15h à minuit avec boîte à clés, départ avant 10h. Animaux bienvenus (à indiquer). Non-fumeur à l’intérieur, pas de fêtes. ${CASA_RETO.guests} personnes au maximum. Taxe de séjour CHF 2.00 par personne dès 14 ans et par nuit.`, `Regole della Casa Reto: check-in dalle 15 alle 24 con cassetta chiavi, check-out entro le 10. Animali benvenuti (da indicare). Vietato fumare in casa, niente feste. Massimo ${CASA_RETO.guests} ospiti. Tassa di soggiorno CHF 2.00 a persona dai 14 anni a notte.`, `Normas de la Casa Reto: entrada de 15 a 24 h con caja de llaves, salida antes de las 10 h. Mascotas bienvenidas (indíquelo). No se fuma dentro, sin fiestas. Máximo ${CASA_RETO.guests} huéspedes. Tasa turística CHF 2.00 por persona desde 14 años y noche.`, `Regras da Casa Reto: check-in das 15h às 24h com caixa de chaves, check-out até às 10h. Animais bem-vindos (indique-os). Proibido fumar dentro, sem festas. Máximo ${CASA_RETO.guests} hóspedes. Taxa turística CHF 2.00 por pessoa a partir dos 14 anos e por noite.`), lang), links: [link(CASA_RETO.link, 'cr', lang)], subject: 'cr' };
      case 'where': {
        const d = CASA_RETO.distances.slice(0, 6).map((x) => `- ${x.place}: ${x.time}`).join('\n');
        return { text: `${pick(L('Die Casa Reto liegt in Gordemo oberhalb von Tenero, am Eingang zum Verzascatal, mit Blick über den Lago Maggiore (nicht direkt am See). Mit dem Auto:', 'Casa Reto is in Gordemo above Tenero, at the entrance to the Verzasca valley, with a view over Lake Maggiore (not directly on the lake). By car:', 'La Casa Reto se trouve à Gordemo, au-dessus de Tenero, à l’entrée du Val Verzasca, avec vue sur le lac Majeur (pas au bord du lac). En voiture :', 'La Casa Reto si trova a Gordemo sopra Tenero, all’imbocco della Valle Verzasca, con vista sul Lago Maggiore (non in riva al lago). In auto:', 'La Casa Reto está en Gordemo, sobre Tenero, a la entrada del valle de Verzasca, con vista al Lago Maggiore (no junto al lago). En coche:', 'A Casa Reto fica em Gordemo, acima de Tenero, à entrada do vale Verzasca, com vista para o Lago Maggiore (não junto ao lago). De carro:'), lang)}\n${d}`, links: [link(CASA_RETO.link, 'cr', lang)], subject: 'cr' };
      }
      case 'parking': return { text: pick(L('Zur Casa Reto gehören zwei Parkplätze beim Haus und eine Ladestation für Elektroautos, weitere Plätze gibt es an der Strasse.', 'Casa Reto has two parking spaces by the house and an EV charger; more spaces are on the street.', 'La Casa Reto dispose de deux places devant la maison et d’une borne de recharge ; d’autres places sont dans la rue.', 'La Casa Reto ha due posti auto e una colonnina di ricarica; altri posti sono lungo la strada.', 'La Casa Reto tiene dos plazas junto a la casa y un cargador para coches eléctricos; hay más plazas en la calle.', 'A Casa Reto tem dois lugares junto à casa e um carregador elétrico; há mais lugares na rua.'), lang), links: [link(CASA_RETO.link, 'cr', lang)], subject: 'cr' };
      case 'amenities': case 'family': case 'includes': return { text: pick(L(`Die Casa Reto hat ${crFacts('de')}. Dazu Garten mit Pergola und Grill, Holzofen, Küche mit Geschirrspüler, Waschmaschine, WLAN mit Arbeitsplatz, Babybett und Deckenventilatoren (keine Klimaanlage). Bettwäsche und Handtücher sind vorhanden.`, `Casa Reto has ${crFacts('en')}, plus a garden with pergola and grill, wood stove, kitchen with dishwasher, washing machine, Wi-Fi with workspace, baby cot and ceiling fans (no air conditioning). Bed linen and towels are provided.`, `La Casa Reto offre ${crFacts('fr')}, un jardin avec pergola et gril, un poêle à bois, une cuisine avec lave-vaisselle, un lave-linge, le Wi-Fi avec poste de travail, un lit bébé et des ventilateurs (pas de climatisation). Linge fourni.`, `La Casa Reto ha ${crFacts('it')}, giardino con pergola e griglia, stufa a legna, cucina con lavastoviglie, lavatrice, Wi-Fi con postazione di lavoro, lettino e ventilatori (niente aria condizionata). Biancheria inclusa.`, `La Casa Reto tiene ${crFacts('es')}, jardín con pérgola y parrilla, estufa de leña, cocina con lavavajillas, lavadora, Wi-Fi con zona de trabajo, cuna y ventiladores (sin aire acondicionado). Ropa de cama y toallas incluidas.`, `A Casa Reto tem ${crFacts('pt')}, jardim com pérgula e grelhador, salamandra, cozinha com máquina de lavar loiça, máquina de lavar roupa, Wi-Fi com posto de trabalho, berço e ventoinhas (sem ar condicionado). Roupa de cama e toalhas incluídas.`), lang), links: [link(CASA_RETO.link, 'cr', lang)], subject: 'cr' };
      default: return { text: pick(L(`Die Casa Reto ist unser Ferienhaus in Gordemo im Tessin, oberhalb von Tenero mit Blick über den Lago Maggiore: ${crFacts('de')}, Garten mit Pergola und Holzofen. Bewertung ${score} von 5 aus ${CASA_RETO.rating.count} Airbnb-Bewertungen.`, `Casa Reto is our holiday home in Gordemo, Ticino, above Tenero with a view over Lake Maggiore: ${crFacts('en')}, garden with pergola and wood stove. Rated ${CASA_RETO.rating.score} out of 5 from ${CASA_RETO.rating.count} Airbnb reviews.`, `La Casa Reto est notre maison de vacances à Gordemo, au Tessin, au-dessus de Tenero avec vue sur le lac Majeur : ${crFacts('fr')}, jardin avec pergola et poêle à bois. Note ${score}/5 sur ${CASA_RETO.rating.count} avis Airbnb.`, `La Casa Reto è la nostra casa vacanze a Gordemo, in Ticino, sopra Tenero con vista sul Lago Maggiore: ${crFacts('it')}, giardino con pergola e stufa a legna. Valutazione ${score}/5 da ${CASA_RETO.rating.count} recensioni Airbnb.`, `La Casa Reto es nuestra casa de vacaciones en Gordemo, Tesino, sobre Tenero con vista al Lago Maggiore: ${crFacts('es')}, jardín con pérgola y estufa de leña. Valoración ${score}/5 en ${CASA_RETO.rating.count} reseñas de Airbnb.`, `A Casa Reto é a nossa casa de férias em Gordemo, no Ticino, acima de Tenero com vista para o Lago Maggiore: ${crFacts('pt')}, jardim com pérgula e salamandra. Avaliação ${score}/5 em ${CASA_RETO.rating.count} avaliações Airbnb.`), lang), links: [link(CASA_RETO.link, 'cr', lang), ask], subject: 'cr' };
    }
  }

  // Apartments, sale
  if (S === 'apt') return { text: pick(L('Unsere Mietwohnungen sind zurzeit alle vermietet. Auf der Warteliste informieren wir Sie, sobald eine Wohnung frei wird. Für sofort gibt es möblierte Long-Stay-Zimmer.', 'Our apartments are all rented at the moment. Join the waiting list and we will let you know when one becomes free. Furnished Long Stay rooms are available sooner.', 'Nos appartements sont tous loués actuellement. Inscrivez-vous sur la liste d’attente. Des chambres meublées Long Stay sont disponibles plus rapidement.', 'I nostri appartamenti sono tutti affittati. Si iscriva alla lista d’attesa. Le camere arredate Long Stay sono disponibili prima.', 'Nuestros apartamentos están todos alquilados. Apúntese a la lista de espera. Las habitaciones amuebladas Long Stay están disponibles antes.', 'Os nossos apartamentos estão todos arrendados. Inscreva-se na lista de espera. Os quartos mobilados Long Stay estão disponíveis mais cedo.'), lang), links: [link(PAGES.apartments, 'apt', lang), link(PAGES.longStay, 'longStay', lang)], subject: 'apt' };
  if (S === 'sale') return { text: pick(L('Zurzeit haben wir keine Objekte zum Kauf. Schreiben Sie uns, dann melden wir uns bei neuen Angeboten. Für eine erste Rechnung gibt es unseren Hypothekenrechner.', 'We have no properties for sale at the moment. Write to us and we will contact you about new offers. Our mortgage calculator gives a first estimate.', 'Nous n’avons actuellement aucun bien à vendre. Écrivez-nous pour être informé. Notre calculateur hypothécaire donne une première estimation.', 'Al momento non abbiamo immobili in vendita. Ci scriva per essere informato. Il calcolatore ipotecario dà una prima stima.', 'Ahora no tenemos inmuebles en venta. Escríbanos y le avisaremos. Nuestra calculadora de hipoteca da una primera estimación.', 'De momento não temos imóveis à venda. Escreva-nos e avisaremos. A calculadora de hipoteca dá uma primeira estimativa.'), lang), links: [link(PAGES.verkauf, 'sale', lang), link(PAGES.hyporechner, 'hypo', lang)], subject: 'sale' };

  // Architecture
  if (S === 'arch') {
    switch (intent) {
      case 'projects': case 'model3d': return { text: `${pick(L('Aktuelle Projekte von AMONN ARCHITEKTUR:', 'Recent AMONN ARCHITEKTUR projects:', 'Projets récents d’AMONN ARCHITEKTUR :', 'Progetti recenti di AMONN ARCHITEKTUR:', 'Proyectos recientes de AMONN ARCHITEKTUR:', 'Projetos recentes da AMONN ARCHITEKTUR:'), lang)}\n${PROJECTS.map((p) => `- ${p.title} (${p.year})`).join('\n')}\n${pick(L('Viele davon können Sie als 3D-Modell aus unseren Plänen drehen.', 'Many of them can be explored as 3D models made from our plans.', 'Plusieurs sont visibles en 3D à partir de nos plans.', 'Molti si possono esplorare in 3D dai nostri piani.', 'Muchos se pueden ver en 3D a partir de nuestros planos.', 'Muitos podem ser vistos em 3D a partir das nossas plantas.'), lang)}`, links: [link(PAGES.projekte, 'projects', lang)], subject: 'arch' };
      case 'costs': case 'price': return { text: pick(L('Unser Honorar richtet sich nach Auftrag und Aufwand und wird im Vertrag festgelegt. Am besten besprechen wir Ihr Vorhaben in einem ersten Gespräch, dann erhalten Sie eine Offerte.', 'Our fee depends on the scope of work and is set in the contract. Let’s discuss your project in a first meeting; then you receive an offer.', 'Nos honoraires dépendent du mandat et sont fixés par contrat. Discutons de votre projet lors d’un premier entretien ; vous recevrez ensuite une offre.', 'Il nostro onorario dipende dall’incarico ed è fissato nel contratto. Parliamo del progetto in un primo incontro; poi riceverà un’offerta.', 'Nuestros honorarios dependen del encargo y se fijan en el contrato. Hablemos de su proyecto en una primera reunión; luego recibirá una oferta.', 'Os nossos honorários dependem do trabalho e ficam definidos no contrato. Falemos do projeto numa primeira reunião; depois recebe uma proposta.'), lang), links: [link(PAGES.termin, 'termin', lang), link(PAGES.kontakt, 'kontakt', lang)], subject: 'arch' };
      case 'viewing': case 'book': case 'contact': return { text: pick(L('Für ein erstes Gespräch zu Ihrem Bauvorhaben schlagen Sie online einen Termin vor oder rufen uns an.', 'For a first meeting about your building project, suggest a date online or give us a call.', 'Pour un premier entretien sur votre projet, proposez une date en ligne ou appelez-nous.', 'Per un primo incontro sul suo progetto proponga una data online o ci chiami.', 'Para una primera reunión sobre su proyecto, proponga una fecha en línea o llámenos.', 'Para uma primeira reunião sobre o seu projeto, proponha uma data online ou ligue-nos.'), lang), links: [link(PAGES.termin, 'termin', lang)], subject: 'arch' };
      default: return { text: `${pick(L('AMONN ARCHITEKTUR plant und baut in der Region Bern:', 'AMONN ARCHITEKTUR plans and builds in the Bern region:', 'AMONN ARCHITEKTUR planifie et construit dans la région de Berne :', 'AMONN ARCHITEKTUR progetta e costruisce nella regione di Berna:', 'AMONN ARCHITEKTUR planifica y construye en la región de Berna:', 'AMONN ARCHITEKTUR projeta e constrói na região de Berna:'), lang)}\n${ARCH_SERVICES.map((s) => `- ${s.title}`).join('\n')}`, links: [link(PAGES.architektur, 'arch', lang), link(PAGES.leistungen, 'services', lang)], subject: 'arch' };
    }
  }
  return null;
}

/** The offer a message names, if any (used to keep context when the AI mode answers). */
export function subjectOf(message) {
  const sc = scoreAll(norm(message), SUBJ);
  if (sc.kerzers && sc.hotel) delete sc.kerzers;
  return best(sc);
}

/** Reasonable subject for an intent when nothing in the conversation says which offer is meant. */
const DEFAULT_SUBJECT = { price: 'ls', includes: 'ls', deposit: 'ls', contract: 'ls', docs: 'ls', company: 'ls', avail: 'ls', book: 'ls', viewing: 'ls', parking: 'ls', pets: 'cr', checkin: 'cr', rules: 'cr', where: 'cr', accessible: 'hotel', costs: 'arch', projects: 'arch', services: 'arch', model3d: 'arch', family: 'cr', amenities: 'cr' };

export function pageSubject(pathname) {
  if (/casa-reto/.test(pathname)) return 'cr';
  if (/ns-hotel|short-stay/.test(pathname)) return 'hotel';
  if (/long-stay\/kerzers/.test(pathname)) return 'kerzers';
  if (/long-stay\/munchenbuchsee/.test(pathname)) return 'muenchenbuchsee';
  if (/long-stay\/muri/.test(pathname)) return 'muri';
  if (/long-stay|vermietung|anfrage/.test(pathname)) return 'ls';
  if (/apartments/.test(pathname)) return 'apt';
  if (/verkauf|hyporechner/.test(pathname)) return 'sale';
  if (/architektur|leistungen|projekte|neuigkeiten/.test(pathname)) return 'arch';
  return null;
}

const FALLBACK = (lang) => ({
  text: pick(L(
    `Dazu habe ich keine gesicherte Antwort. Am besten fragen Sie uns direkt: ${COMPANY.phone} oder ${COMPANY.email}. Sie können mir auch eine andere Frage stellen, zum Beispiel zu Preisen, Verfügbarkeit oder Anfahrt.`,
    `I don't have a reliable answer to that. Please ask us directly: ${COMPANY.phone} or ${COMPANY.email}. You can also ask me something else, for example about prices, availability or directions.`,
    `Je n’ai pas de réponse sûre à ce sujet. Demandez-nous directement : ${COMPANY.phone} ou ${COMPANY.email}. Vous pouvez aussi me poser une autre question, par exemple sur les prix ou les disponibilités.`,
    `Non ho una risposta sicura. Ci chieda direttamente: ${COMPANY.phone} o ${COMPANY.email}. Può anche farmi un’altra domanda, ad esempio su prezzi o disponibilità.`,
    `No tengo una respuesta segura a eso. Pregúntenos directamente: ${COMPANY.phone} o ${COMPANY.email}. También puede hacerme otra pregunta, por ejemplo sobre precios o disponibilidad.`,
    `Não tenho uma resposta segura. Pergunte-nos diretamente: ${COMPANY.phone} ou ${COMPANY.email}. Também pode fazer outra pergunta, por exemplo sobre preços ou disponibilidade.`,
  ), lang),
  links: [link(PAGES.kontakt, 'kontakt', lang)],
  handoff: true,
});

/**
 * Answers one message. `ctx` = { subject, lang, path, today } from the conversation.
 * Returns { text, links, subject, lang, handoff?, check? } — `check` asks the caller to look up
 * Casa Reto availability for { from, to } and then call availabilityText().
 */
export function answer(message, ctx, forced = null) {
  const lang = forced ? ctx.lang : guessLang(message, ctx.lang);
  const t = norm(message);
  const subjScores = forced ? {} : scoreAll(t, SUBJ);
  const intScores = forced ? {} : scoreAll(t, INT);

  // "Kerzers" alone means the Long Stay rooms there, unless the hotel is mentioned
  if (subjScores.kerzers && subjScores.hotel) delete subjScores.kerzers;
  const named = best(subjScores);
  let subject = forced?.subject || named;
  let intent = forced?.intent || best(intScores);
  if (intent === 'company' && !subject) subject = 'ls';
  // "Was bieten Sie an?" without naming an offer → overview of everything
  if (!forced && intent === 'services' && !named) subject = 'company';
  // a place name on its own after a Long Stay question keeps the question
  if (!forced && subject && ['kerzers', 'muenchenbuchsee', 'muri'].includes(subject) && !intent && ['ls', 'kerzers', 'muenchenbuchsee', 'muri'].includes(ctx.subject)) intent = ctx.lastIntent || 'overview';
  if (!subject) subject = ctx.subject || pageSubject(ctx.path || '') || (intent ? DEFAULT_SUBJECT[intent] : null);
  if (!intent) intent = subject ? 'overview' : null;

  // dates in the message about Casa Reto (or after talking about it) → calendar check
  const stay = ctx.today ? findStay(message, ctx.today) : null;
  if (stay && (subject === 'cr' || (!named && ctx.subject === 'cr'))) {
    return { check: stay, subject: 'cr', intent: 'avail', lang };
  }

  if (!intent && !subject) return { ...FALLBACK(lang), subject: ctx.subject ?? null, lang };
  // a real question (several words) we could not place: say so instead of repeating the overview
  if (!forced && intent === 'overview' && !named && t.split(/\s+/).filter(Boolean).length >= 3) {
    return { ...(subject === 'company' ? FALLBACK(lang) : unknownFor(subject, lang)), intent: 'unknown', lang };
  }
  const a = answerFor(subject, intent, lang) || answerFor(subject, 'overview', lang);
  if (!a) return { ...FALLBACK(lang), subject: ctx.subject ?? null, lang };
  if (a.needDates) {
    return {
      text: pick(L('Für welche Daten möchten Sie die Casa Reto? Schreiben Sie zum Beispiel «vom 10. bis 17. Juli», dann prüfe ich den Kalender.', 'For which dates would you like Casa Reto? Write for example "from 10 to 17 July" and I will check the calendar.', 'Pour quelles dates souhaitez-vous la Casa Reto ? Écrivez par exemple « du 10 au 17 juillet » et je vérifie le calendrier.', 'Per quali date desidera la Casa Reto? Scriva ad esempio «dal 10 al 17 luglio» e controllo il calendario.', '¿Para qué fechas quiere la Casa Reto? Escriba por ejemplo «del 10 al 17 de julio» y compruebo el calendario.', 'Para que datas quer a Casa Reto? Escreva por exemplo «de 10 a 17 de julho» e verifico o calendário.'), lang),
      links: [link(CASA_RETO.inquiry, 'crAsk', lang)],
      subject: 'cr', intent: 'avail', lang,
    };
  }
  return { ...a, subject: a.subject ?? null, intent, lang };
}

const fmtDate = (isoDate, lang) => new Date(`${isoDate}T12:00:00Z`).toLocaleDateString({ de: 'de-CH', en: 'en-GB', fr: 'fr-CH', it: 'it-CH', es: 'es-ES', pt: 'pt-PT' }[lang] || 'de-CH', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

/** Text for a calendar result. `busy` = [{ start, end }] overlapping the stay, or null on error. */
export function availabilityText(stay, busy, lang) {
  const from = fmtDate(stay.from, lang);
  const to = fmtDate(stay.to, lang);
  const links = [link(CASA_RETO.inquiry, 'crAsk', lang)];
  if (busy === null) {
    return { text: pick(L(`Der Kalender lässt sich gerade nicht laden. Senden Sie uns eine Anfrage für ${from} bis ${to}, wir prüfen die Daten persönlich.`, `The calendar can't be loaded right now. Send us a request for ${from} to ${to} and we will check personally.`, `Le calendrier ne se charge pas pour le moment. Envoyez-nous une demande pour le ${from} au ${to}.`, `Il calendario non si carica al momento. Ci invii una richiesta per ${from}–${to}.`, `El calendario no se puede cargar ahora. Envíenos una solicitud para ${from}–${to}.`, `O calendário não carrega neste momento. Envie-nos um pedido para ${from}–${to}.`), lang), links, subject: 'cr' };
  }
  if (busy.length === 0) {
    return { text: pick(L(`Gute Nachricht: Laut Airbnb-Kalender ist die Casa Reto vom ${from} bis ${to} frei. Verbindlich ist erst unsere Bestätigung, senden Sie uns dafür eine Anfrage.`, `Good news: according to the Airbnb calendar Casa Reto is free from ${from} to ${to}. Only our confirmation is binding, so please send a request.`, `Bonne nouvelle : selon le calendrier Airbnb, la Casa Reto est libre du ${from} au ${to}. Seule notre confirmation fait foi ; envoyez-nous une demande.`, `Buone notizie: secondo il calendario Airbnb la Casa Reto è libera dal ${from} al ${to}. Vale solo la nostra conferma; ci invii una richiesta.`, `Buenas noticias: según el calendario de Airbnb, la Casa Reto está libre del ${from} al ${to}. Solo nuestra confirmación es vinculante; envíenos una solicitud.`, `Boas notícias: segundo o calendário Airbnb, a Casa Reto está livre de ${from} a ${to}. Só a nossa confirmação é vinculativa; envie-nos um pedido.`), lang), links, subject: 'cr' };
  }
  const list = busy.map((b) => `- ${fmtDate(b.start, lang)} – ${fmtDate(b.end, lang)}`).join('\n');
  return { text: `${pick(L(`Im Zeitraum ${from} bis ${to} ist die Casa Reto laut Airbnb-Kalender teilweise belegt:`, `Between ${from} and ${to} Casa Reto is partly booked according to the Airbnb calendar:`, `Entre le ${from} et le ${to}, la Casa Reto est en partie réservée selon le calendrier Airbnb :`, `Tra il ${from} e il ${to} la Casa Reto è in parte occupata secondo il calendario Airbnb:`, `Entre el ${from} y el ${to} la Casa Reto está en parte ocupada según el calendario de Airbnb:`, `Entre ${from} e ${to} a Casa Reto está em parte ocupada segundo o calendário Airbnb:`), lang)}\n${list}\n${pick(L('Möchten Sie andere Daten prüfen? Schreiben Sie sie einfach.', 'Would you like to check other dates? Just type them.', 'Voulez-vous vérifier d’autres dates ? Écrivez-les simplement.', 'Vuole verificare altre date? Le scriva pure.', '¿Quiere comprobar otras fechas? Escríbalas.', 'Quer verificar outras datas? Escreva-as.'), lang)}`, links, subject: 'cr' };
}
