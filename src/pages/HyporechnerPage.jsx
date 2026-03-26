import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calculator, ShieldCheck, Percent, Home } from 'lucide-react';
import MortgageCalculator from '@/components/MortgageCalculator';

const RULES = [
  {
    icon: <Percent size={18} className="text-blue-600" />,
    bg: 'bg-blue-50',
    title: 'Maximale Belehnung (LTV)',
    body: 'Banken finanzieren in der Schweiz maximal 80% des Kaufpreises. Die restlichen 20% müssen als Eigenkapital eingebracht werden, wovon mindestens 10% aus eigenen Mitteln (nicht Pensionskasse) stammen müssen.',
  },
  {
    icon: <ShieldCheck size={18} className="text-emerald-600" />,
    bg: 'bg-emerald-50',
    title: 'Tragbarkeit (max. 33%)',
    body: 'Die jährlichen Wohnkosten (Zinsen kalkulatorisch mit 5%, Amortisation, Nebenkosten) dürfen in der Regel nicht mehr als ein Drittel des Bruttoeinkommens betragen. Dieser Richtwert gilt auch bei niedrigem Marktzins.',
  },
  {
    icon: <Home size={18} className="text-orange-600" />,
    bg: 'bg-orange-50',
    title: 'Amortisation',
    body: 'Die Hypothek ist innert 15 Jahren auf 65% des Verkehrswertes amortisiert zu haben (Richtwert). Direkte oder indirekte Amortisation via Säule 3a sind möglich.',
  },
];

const HyporechnerPage = () => {
  return (
    <>
      <Helmet>
        <title>Hypothekenrechner | Hans Amonn AG</title>
        <meta
          name="description"
          content="Berechnen Sie Ihre Hypothek, Monatsrate und Tragbarkeit nach Schweizer Standard. Unverbindlicher Hypothekenrechner von Hans Amonn AG."
        />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <Calculator size={13} />
              Hypothekenrechner
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Hypothek & Tragbarkeit<br />
              <span className="text-gray-300 font-light">berechnen</span>
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
              Ermitteln Sie Ihre monatliche Rate, jährliche Zinslast und Tragbarkeit nach
              Schweizer Standard — in Echtzeit und vollständig kostenlos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Calculator */}
      <section className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          <MortgageCalculator />
        </motion.div>
      </section>

      {/* Swiss mortgage rules */}
      <section className="bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-xl font-black text-gray-900 mb-2">
              Schweizer Hypothekenregeln
            </h2>
            <p className="text-gray-500 text-sm mb-8">
              Was Banken und FINMA in der Schweiz bei der Hypothekenvergabe prüfen.
            </p>

            <div className="grid md:grid-cols-3 gap-5">
              {RULES.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className={`w-9 h-9 rounded-xl ${r.bg} flex items-center justify-center mb-3`}>
                    {r.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{r.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{r.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HyporechnerPage;
