import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/i18n';
import { ComparisonProvider } from '@/context/ComparisonContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import CompareBar from '@/components/CompareBar';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VirtualAgent from '@/components/VirtualAgent';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieBanner from '@/components/CookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import BackToTop from '@/components/BackToTop';

// Pages
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import TeamPage from '@/pages/TeamPage';
import TeamMemberPage from '@/pages/TeamMemberPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import ContactPage from '@/pages/ContactPage';
import AdminPage from '@/pages/AdminPage';
import ImpressumPage from '@/pages/ImpressumPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';

// Immobilien / Rentals
import ImmobilienOverviewPage from '@/pages/ImmobilienOverviewPage';
import VermietungPage from '@/pages/VermietungPage';
import VerkaufPage from '@/pages/VerkaufPage';
import ApartmentDetailPage from '@/pages/ApartmentDetailPage';
import LongStayPage from '@/pages/LongStayPage';
import ShortStayPage from '@/pages/ShortStayPage';
import ApartmentsPage from '@/pages/ApartmentsPage';
import CasaRetoPage from '@/pages/CasaRetoPage';
import NsHotelPage from '@/pages/NsHotelPage';
import MietanfragePage from '@/pages/MietanfragePage';
import TerminbuchungPage from '@/pages/TerminbuchungPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NeuigkeitenPage from '@/pages/NeuigkeitenPage';
import BlogPostPage from '@/pages/BlogPostPage';
import FAQPage from '@/pages/FAQPage';

// New feature pages
import FavoritenPage from '@/pages/FavoritenPage';
import PreisrechnerPage from '@/pages/PreisrechnerPage';
import VergleichPage from '@/pages/VergleichPage';
import KartePage from '@/pages/KartePage';
import HyporechnerPage from '@/pages/HyporechnerPage';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('App error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Etwas ist schiefgelaufen</h1>
            <p className="text-gray-500 mb-6">Es ist ein unerwarteter Fehler aufgetreten. Bitte laden Sie die Seite neu.</p>
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors">
              Seite neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

function AppRoutes() {
  return (
    <>
      <GoogleAnalytics />
      <ScrollToTop />
      <Header />
      <main className="pt-20">
        <Routes>
          {/* HOME */}
          <Route path="/" element={<HomePage />} />

          {/* ABOUT */}
          <Route path="/uber-uns" element={<AboutPage />} />

          {/* TEAM */}
          <Route path="/team" element={<TeamPage />} />
          <Route path="/team/:slug" element={<TeamMemberPage />} />

          {/* PROJECTS */}
          <Route path="/projekte" element={<ProjectsPage />} />
          <Route path="/projekte/:id" element={<ProjectDetailPage />} />

          {/* SERVICES */}
          <Route path="/leistungen" element={<ServicesPage />} />
          <Route path="/leistungen/:slug" element={<ServiceDetailPage />} />

          {/* IMMOBILIEN — overview */}
          <Route path="/immobilien" element={<ImmobilienOverviewPage />} />

          {/* IMMOBILIEN — Vermietung */}
          <Route path="/immobilien/vermietung" element={<VermietungPage />} />
          <Route path="/immobilien/long-stay" element={<LongStayPage />} />
          <Route path="/immobilien/short-stay" element={<ShortStayPage />} />
          <Route path="/immobilien/apartments" element={<ApartmentsPage />} />
          <Route path="/immobilien/anfrage" element={<MietanfragePage />} />

          {/* IMMOBILIEN — Verkauf */}
          <Route path="/immobilien/verkauf" element={<VerkaufPage />} />

          {/* IMMOBILIEN — detail pages */}
          <Route path="/immobilien/:slug" element={<ApartmentDetailPage />} />

          {/* SPECIAL PAGES */}
          <Route path="/casa-reto" element={<Navigate to="/immobilien/casa-reto" replace />} />
          <Route path="/ns-hotel" element={<NsHotelPage />} />

          {/* LONG STAY LOCATIONS — redirect to unified detail pages */}
          <Route path="/long-stay/kerzers" element={<Navigate to="/immobilien/kerzers-ls" replace />} />
          <Route path="/long-stay/munchenbuchsee" element={<Navigate to="/immobilien/munchenbuchsee-ls" replace />} />
          <Route path="/long-stay/muri" element={<Navigate to="/immobilien/muri-ls" replace />} />

          {/* LEGACY REDIRECTS — old /vermietung/* → new /immobilien/* */}
          <Route path="/vermietung" element={<Navigate to="/immobilien/vermietung" replace />} />
          <Route path="/vermietung/long-stay" element={<Navigate to="/immobilien/long-stay" replace />} />
          <Route path="/vermietung/short-stay" element={<Navigate to="/immobilien/short-stay" replace />} />
          <Route path="/vermietung/apartments" element={<Navigate to="/immobilien/apartments" replace />} />
          <Route path="/vermietung/:slug" element={<Navigate to="/immobilien" replace />} />
          <Route path="/vermieten" element={<Navigate to="/immobilien/anfrage" replace />} />

          {/* NEUIGKEITEN / BLOG */}
          <Route path="/neuigkeiten" element={<NeuigkeitenPage />} />
          <Route path="/neuigkeiten/:slug" element={<BlogPostPage />} />

          {/* FAVORITEN */}
          <Route path="/favoriten" element={<FavoritenPage />} />

          {/* TOOLS */}
          <Route path="/preisrechner" element={<PreisrechnerPage />} />
          <Route path="/hyporechner" element={<HyporechnerPage />} />
          <Route path="/vergleich" element={<VergleichPage />} />
          <Route path="/karte" element={<KartePage />} />

          {/* FAQ */}
          <Route path="/faq" element={<FAQPage />} />

          {/* TERMINBUCHUNG */}
          <Route path="/termin" element={<TerminbuchungPage />} />

          {/* CONTACT */}
          <Route path="/kontakt" element={<ContactPage />} />

          {/* ADMIN */}
          <Route path="/admin" element={<AdminPage />} />

          {/* LEGAL */}
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<PrivacyPolicyPage />} />

          {/* CATCH-ALL — show 404 page for unknown URLs */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CompareBar />
      <Toaster />
      <WhatsAppButton />
      <VirtualAgent />
      <CookieBanner />
      <BackToTop />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <FavoritesProvider>
          <ComparisonProvider>
            <Router>
              <div className="min-h-screen bg-white">
                <AppRoutes />
              </div>
            </Router>
          </ComparisonProvider>
        </FavoritesProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
