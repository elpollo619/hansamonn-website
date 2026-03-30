import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getFaqs } from '@/data/faqStore';

const SAMPLE_FAQS = [
  {
    id: 's1',
    question: 'Wie lange ist die Mindestmietdauer?',
    answer: 'Die Mindestmietdauer beträgt je nach Objekt 1 Monat bis 1 Jahr.',
    category: 'Allgemein',
  },
  {
    id: 's2',
    question: 'Welche Dokumente benötige ich für eine Mietanfrage?',
    answer: 'Sie benötigen einen Ausweis, Betreibungsregisterauszug und Lohnausweis.',
    category: 'Allgemein',
  },
  {
    id: 's3',
    question: 'Sind Haustiere erlaubt?',
    answer: 'Dies hängt vom jeweiligen Objekt ab. Bitte fragen Sie direkt beim Objekt nach.',
    category: 'Allgemein',
  },
  {
    id: 's4',
    question: 'Wie kann ich eine Besichtigung vereinbaren?',
    answer: 'Nutzen Sie unser Kontaktformular oder rufen Sie uns direkt an.',
    category: 'Allgemein',
  },
  {
    id: 's5',
    question: 'Was ist im Mietpreis inbegriffen?',
    answer: 'In der Regel sind Nebenkosten separat. Details entnehmen Sie dem jeweiligen Inserat.',
    category: 'Allgemein',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border border-gray-200 overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 pr-4 text-base leading-snug">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="flex-shrink-0 text-gray-400"
        >
          <ChevronDown size={20} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0">
              <div className="border-t border-gray-100 pt-4">
                <p className="text-gray-600 leading-relaxed text-sm">{faq.answer}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Alle');

  useEffect(() => {
    getFaqs()
      .then((data) => setFaqs(data && data.length > 0 ? data : SAMPLE_FAQS))
      .catch(() => setFaqs(SAMPLE_FAQS))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['Alle', ...Array.from(new Set(faqs.map((f) => f.category).filter(Boolean)))];
  const showCategoryTabs = categories.length > 2;

  const filtered =
    activeCategory === 'Alle' ? faqs : faqs.filter((f) => f.category === activeCategory);

  function toggle(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <>
      <Helmet>
        <title>FAQ – Hans Amonn AG</title>
        <meta
          name="description"
          content="Häufig gestellte Fragen rund um Vermietung und Immobilien bei Hans Amonn AG."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-100 py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-light text-gray-900 mb-4"
          >
            Häufig gestellte Fragen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-gray-500 text-lg leading-relaxed"
          >
            Hier finden Sie Antworten auf die wichtigsten Fragen rund um Vermietung und Immobilien.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Category filter tabs */}
          {!loading && showCategoryTabs && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                  style={activeCategory === cat ? { backgroundColor: 'var(--brand-color, #1D3D78)' } : {}}
                  className={`px-4 py-2 text-sm font-medium transition-colors border ${
                    activeCategory === cat
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {/* FAQ list */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              {filtered.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openId === faq.id}
                  onToggle={() => toggle(faq.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Still have questions CTA */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-14 text-white p-8 text-center" style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
            >
              <h2 className="text-xl font-bold mb-2">Noch Fragen?</h2>
              <p className="text-gray-400 text-sm mb-6">
                Unser Team hilft Ihnen gerne persönlich weiter.
              </p>
              <a
                href="/kontakt"
                className="inline-block bg-white text-gray-900 px-6 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors"
              >
                Jetzt kontaktieren
              </a>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}
