/**
 * Office and phone hours of Hans Amonn AG (confirmed by the office, October 2026).
 * Single source for every place that shows them.
 */
export const OFFICE_HOURS = {
  days: 'Montag – Freitag',
  office: '07:30–12:00 und 13:00–17:00 Uhr',
  phone: '08:00–12:00 und 13:00–17:00 Uhr',
  urgent: 'In dringenden Fällen erreichen Sie uns auch ausserhalb der Bürozeiten telefonisch.',
};

/** One-line versions for compact places (menus, chat, settings default). */
export const OFFICE_HOURS_SHORT = 'Büro Mo–Fr 07:30–12:00, 13:00–17:00';
export const PHONE_HOURS_SHORT = 'Telefon Mo–Fr 08:00–12:00, 13:00–17:00';

/** schema.org opening hours of the office, for structured data. */
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export const OPENING_HOURS_SCHEMA = [
  { '@type': 'OpeningHoursSpecification', dayOfWeek: WEEKDAYS, opens: '07:30', closes: '12:00' },
  { '@type': 'OpeningHoursSpecification', dayOfWeek: WEEKDAYS, opens: '13:00', closes: '17:00' },
];
