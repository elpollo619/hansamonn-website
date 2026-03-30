import React, { useEffect, lazy, Suspense } from 'react';
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
import { getBrandColor, darkenHex } from '@/data/settingsStore';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VirtualAgent from '@/components/VirtualAgent';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieBanner from '@/components/CookieBanner';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import BackToTop from '@/components/BackToTop';

// Pages — lazy loaded for route-based code splitting
const HomePage              = lazy(() => import('@/pages/HomePage'));
const AboutPage             = lazy(() => import('@/pages/AboutPage'));
const TeamPage              = lazy(() => import('@/pages/TeamPage'));
const TeamMemberPage        = lazy(() => import('@/pages/TeamMemberPage'));
const ProjectsPage          = lazy(() => import('@/pages/ProjectsPage'));
const ProjectDetailPage     = lazy(() => import('@/pages/ProjectDetailPage'));
const ServicesPage          = lazy(() => import('@/pages/ServicesPage'));
const ServiceDetailPage     = lazy(() => import('@/pages/ServiceDetailPage'));
const ArchitekturPage       = lazy(() => import('@/pages/ArchitekturPage'));
const ContactPage           = lazy(() => import('@/pages/ContactPage'));
const AdminPage             = lazy(() => import('@/pages/AdminPage'));
const ImpressumPage         = lazy(() => import('@/pages/ImpressumPage'));
const PrivacyPolicyPage     = lazy(() => import('@/pages/PrivacyPolicyPage'));

// Immobilien / Rentals
const ImmobilienOverviewPage = lazy(() => import('@/pages/ImmobilienOverviewPage'));
const VermietungPage         = lazy(() => import('@/pages/VermietungPage'));
const VerkaufPage            = lazy(() => import('@/pages/VerkaufPage'));
const ApartmentDetailPage    = lazy(() => import('@/pages/ApartmentDetailPage'));
const LongStayPage           = lazy(() => import('@/pages/LongStayPage'));
const ShortStayPage          = lazy(() => import('@/pages/ShortStayPage'));
const ApartmentsPage         = lazy(() => import('@/pages/ApartmentsPage'));
const NsHotelPage            = lazy(() => import('@/pages/NsHotelPage'));
const MietanfragePage        = lazy(() => import('@/pages/MietanfragePage'));
const TerminbuchungPage      = lazy(() => import('@/pages/TerminbuchungPage'));
const NotFoundPage           = lazy(() => import('@/pages/NotFoundPage'));
const NeuigkeitenPage        = lazy(() => import('@/pages/NeuigkeitenPage'));
const BlogPostPage           = lazy(() => import('@/pages/BlogPostPage'));
const FAQPage                = lazy(() => import('@/pages/FAQPage'));

// Feature pages
const FavoritenPage          = lazy(() => import('@/pages/FavoritenPage'));
const PreisrechnerPage       = lazy(() => import('@/pages/PreisrechnerPage'));
const VergleichPage          = lazy(() => import('@/pages/VergleichPage'));
const KartePage              = lazy(() => import('@/pages/KartePage'));
const HyporechnerPage        = lazy(() => import('@/pages/HyporechnerPage'));

// Minimal page-transition loader shown while a lazy chunk is loading
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
    </div>
  );
}

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
        <Suspense fallback={<PageLoader />}>
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

          {/* ARCHITEKTUR overview */}
          <Route path="/architektur" element={<ArchitekturPage />} />

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
        </Suspense>
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
  // Inject brand colour CSS variables on every mount so dynamic colour from settings works
  useEffect(() => {
    const color = getBrandColor();
    document.documentElement.style.setProperty('--brand-color', color);
    document.documentElement.style.setProperty('--brand-color-dark', darkenHex(color));
  }, []);

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
