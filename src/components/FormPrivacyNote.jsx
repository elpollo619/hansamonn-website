import React from 'react';
import { Link } from 'react-router-dom';

/** Short information notice above form submit buttons (Art. 19 DSG). */
export default function FormPrivacyNote({ className = '' }) {
  return (
    <p className={`text-xs text-gray-500 leading-relaxed ${className}`}>
      Mit dem Absenden speichern wir Ihre Angaben zur Bearbeitung Ihrer Anfrage und erhalten sie per E-Mail
      (Dienstleister u. a. in den USA). Details in der{' '}
      <Link to="/datenschutz" className="underline hover:text-gray-800">Datenschutzerklärung</Link>.
    </p>
  );
}
