import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const BRAND = 'var(--brand-color, #1D3D78)';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center surface-warm px-6 py-24">
      <Helmet>
        <title>Seite nicht gefunden – Hans Amonn AG</title>
        <meta name="description" content="Die gesuchte Seite existiert nicht. Zurück zur Startseite von Hans Amonn AG." />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="container mx-auto max-w-3xl text-center"
      >
        <p className="eyebrow mb-6">
          HANS AMONN AG
        </p>
        <h1
          className="font-display font-semibold leading-[0.85] text-[9rem] md:text-[14rem] tracking-tight"
          style={{ color: BRAND }}
        >
          404
        </h1>
        <div className="mx-auto my-8 h-px w-16 bg-gray-300" aria-hidden="true" />
        <h2 className="display-heading uppercase text-3xl md:text-4xl mb-4">
          Seite nicht gefunden
        </h2>
        <p className="text-gray-600 leading-relaxed mb-10">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-white px-6 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: BRAND }}
          >
            Zur Startseite
          </Link>
          <Link
            to="/immobilien"
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Immobilien ansehen
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
