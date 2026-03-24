<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import TeamPage from "@/pages/TeamPage";
import ProjectsPage from "@/pages/ProjectsPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import ServicesPage from "@/pages/ServicesPage";
import ContactPage from "@/pages/ContactPage";
import AdminPage from "@/pages/AdminPage";
import ImpressumPage from "@/pages/ImpressumPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";

import VermietungPage from "@/pages/VermietungPage";
import LongStayPage from "@/pages/LongStayPage";
import ShortStayPage from "@/pages/ShortStayPage";
import ApartmentsPage from "@/pages/ApartmentsPage";
import CasaRetoPage from "@/pages/CasaRetoPage";
import NsHotelPage from "@/pages/NsHotelPage";
import KerzersPage from "@/pages/KerzersPage";
import MunchenbuchseePage from "@/pages/MunchenbuchseePage";
import MuriPage from "@/pages/MuriPage";
import MietanfragePage from "@/pages/MietanfragePage";
=======
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/i18n';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import TeamPage from '@/pages/TeamPage';
import TeamMemberPage from '@/pages/TeamMemberPage';
import ProjectsPage from '@/pages/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import ServicesPage from '@/pages/ServicesPage';
import ServiceDetailPage from '@/pages/ServiceDetailPage';
import VermietungPage from '@/pages/VermietungPage';
import ApartmentDetailPage from '@/pages/ApartmentDetailPage';
import ContactPage from '@/pages/ContactPage';
import ImpressumPage from '@/pages/ImpressumPage';
import PrivacyPolicyPage from '@/pages/PrivacyPolicyPage';
>>>>>>> 707d88d0 (Refactor Vermietung system + i18n + Mietanfrage form)

/** Scroll to top on every route change */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

function AppRoutes() {
  return (
<<<<<<< HEAD
    <Router>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/uber-uns" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/projekte" element={<ProjectsPage />} />
            <Route path="/projekte/:id" element={<ProjectDetailPage />} />
            <Route path="/leistungen" element={<ServicesPage />} />
            <Route path="/kontakt" element={<ContactPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/datenschutz" element={<PrivacyPolicyPage />} />

            <Route path="/vermietung" element={<VermietungPage />} />
            <Route path="/vermietung/long-stay" element={<LongStayPage />} />
            <Route path="/vermietung/short-stay" element={<ShortStayPage />} />
            <Route path="/vermietung/apartments" element={<ApartmentsPage />} />

            <Route path="/casa-reto" element={<CasaRetoPage />} />
            <Route path="/ns-hotel" element={<NsHotelPage />} />

            <Route path="/long-stay/kerzers" element={<KerzersPage />} />
            <Route
              path="/long-stay/munchenbuchsee"
              element={<MunchenbuchseePage />}
            />
            <Route path="/long-stay/muri" element={<MuriPage />} />

            <Route path="/vermieten" element={<MietanfragePage />} />
          </Routes>
        </main>
        <Footer />
        <Toaster />
      </div>
    </Router>
=======
    <>
      <ScrollToTop />
      <Header />
      <main className="pt-20">
        <Routes>
          <Route path="/"                      element={<HomePage />} />
          <Route path="/uber-uns"              element={<AboutPage />} />
          <Route path="/team"                  element={<TeamPage />} />
          <Route path="/team/:slug"            element={<TeamMemberPage />} />
          <Route path="/projekte"              element={<ProjectsPage />} />
          <Route path="/projekte/:id"          element={<ProjectDetailPage />} />
          <Route path="/leistungen"            element={<ServicesPage />} />
          <Route path="/leistungen/:slug"      element={<ServiceDetailPage />} />
          <Route path="/vermietung"            element={<VermietungPage />} />
          <Route path="/vermietung/:slug"      element={<ApartmentDetailPage />} />
          <Route path="/kontakt"              element={<ContactPage />} />
          <Route path="/impressum"            element={<ImpressumPage />} />
          <Route path="/datenschutz"          element={<PrivacyPolicyPage />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </>
>>>>>>> 707d88d0 (Refactor Vermietung system + i18n + Mietanfrage form)
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <AppRoutes />
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
