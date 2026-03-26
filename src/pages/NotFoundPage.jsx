import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <p className="text-xs font-black tracking-widest text-gray-400 uppercase mb-6">
          HANS AMONN AG
        </p>
        <h1 className="text-8xl font-black text-gray-900 mb-4">404</h1>
        <p className="text-lg text-gray-500 mb-10">
          Diese Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 text-sm font-semibold tracking-wide hover:bg-gray-700 transition-colors"
          >
            <Home size={16} />
            Zur Startseite
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 text-sm font-semibold tracking-wide hover:border-gray-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
}
