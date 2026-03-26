// EmailJS configuration
// ─────────────────────────────────────────────────────────────────────────────
// 1. Create a free account at https://www.emailjs.com
// 2. Add an Email Service (Gmail, SMTP, Outlook, etc.) → copy the Service ID
// 3. Create an Email Template with variables matching templateParams below
//    Recommended template variables:
//      {{to_email}}, {{from_name}}, {{from_email}}, {{phone}},
//      {{anfrageart}}, {{objekt}}, {{mietbeginn}}, {{mietende}},
//      {{beruf}}, {{nationalitaet}}, {{bemerkungen}}, {{submission_date}}
// 4. Copy your Public Key from Account → API Keys
// ─────────────────────────────────────────────────────────────────────────────

export const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',    // from EmailJS dashboard → Email Services
  templateId: 'YOUR_TEMPLATE_ID', // from EmailJS dashboard → Email Templates
  publicKey: 'YOUR_PUBLIC_KEY',   // from EmailJS dashboard → Account → API Keys
  toEmail: 'office@reto-amonn.ch',
};
