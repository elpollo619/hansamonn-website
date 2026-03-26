import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <Helmet>
        <title>Seite nicht gefunden – Hans Amonn AG</title>
        <meta name="description" content="Die gesuchte Seite existiert nicht. Zurück zur Startseite von Hans Amonn AG." />
      </Helmet>
      <div className="text-center max-w-md">
        <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">
          HANS AMONN AG
        </p>
        <h1 className="text-8xl font-black text-gray-900 mb-3">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Seite nicht gefunden
        </h2>
        <p className="text-base text-gray-500 mb-10">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-gray-700 transition-colors rounded"
          >
            Zur Startseite
          </Link>
          <Link
            to="/immobilien"
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 text-sm font-semibold tracking-wide hover:border-gray-500 transition-colors rounded"
          >
            Immobilien ansehen
          </Link>
        </div>
      </div>
    </div>
  );
}
