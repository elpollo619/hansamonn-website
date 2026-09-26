import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getFaqs } from '@/data/faqStore';
import PageHero from '@/components/PageHero';

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
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="group w-full flex items-center justify-between gap-6 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-[#0F1B2D] text-base md:text-lg leading-snug group-hover:text-[#1D3D78] transition-colors">
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className={`flex-shrink-0 w-9 h-9 flex items-center justify-center border transition-colors ${
            isOpen ? 'text-white border-transparent' : 'text-gray-500 border-gray-200 group-hover:border-gray-400'
          }`}
          style={isOpen ? { backgroundColor: 'var(--brand-color, #1D3D78)' } : undefined}
        >
          <ChevronDown size={18} />
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
            <div className="pb-6 pr-12">
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
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
      <PageHero
        title="Häufig gestellte Fragen"
        subtitle="Hier finden Sie Antworten auf die wichtigsten Fragen rund um Vermietung und Immobilien."
        size="sm"
      />

      {/* Content */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">

          {/* Category filter tabs */}
          {!loading && showCategoryTabs && (
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setOpenId(null); }}
                  style={activeCategory === cat ? { backgroundColor: 'var(--brand-color, #1D3D78)' } : {}}
                  className={`px-4 py-2 text-sm font-semibold transition-colors border ${
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
                <div key={i} className="h-16 surface-warm animate-pulse" />
              ))}
            </div>
          )}

          {/* FAQ list */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="border-t border-gray-200"
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

          </div>

          {/* Still have questions CTA */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-16 bg-[#0B1220] text-white p-8 md:p-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <h2 className="font-display uppercase font-semibold text-3xl md:text-4xl leading-none mb-3">Noch Fragen?</h2>
                <p className="text-white/70">
                  Unser Team hilft Ihnen gerne persönlich weiter.
                </p>
              </div>
              <a
                href="/kontakt"
                className="self-start md:self-auto shrink-0 inline-block bg-white text-gray-900 px-6 py-3 font-semibold text-sm hover:bg-gray-100 transition-colors"
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
