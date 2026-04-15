import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import EdNetNavbar from "./components/EdNetNavbar";
import EdNetMainPage from "./components/EdNetMainPage";
import AboutPage from "./components/AboutPage";
import DirectorPage from "./components/DirectorPage";
import WhyAZ from "./components/WhyAZ";
import PhilosophyPage from "./components/PhilosophyPage";
import ServicesPage from "./components/ServicesPage";
import ResearchPage from "./components/ResearchPage";
import StudyUK from "./components/StudyUK";
import StudyNZ from "./components/StudyNZ";
import StudyCanada from "./components/StudyCanada";
import StudyAustralia from "./components/StudyAustralia";
import StudyFrance from "./components/StudyFrance";
import TestimonialsPage from "./components/Testimonialspage";
import ExternalScholarships from "./components/ExternalScholarships";
import ScholarshipsSecured from "./components/ScholarshipsSecured";
import CareersPage from "./components/CareersPage";
import ContactUs from "./components/ContactUs";
import Visa from "./components/Visa";
import Breaking from "./components/Breaking";
import PartnerSchoolsPage from "./components/Partners";
import ProgramsPage from "./components/Programspage";

function ScrollToTop() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <EdNetNavbar />

      <Routes>
        <Route path="/" element={<EdNetMainPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/director-message" element={<DirectorPage />} />
        <Route path="/whyaz" element={<WhyAZ />} />
        <Route path="/our-philosophy" element={<PhilosophyPage />} />
        <Route path="/our-services" element={<ServicesPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/study-abroad-fr" element={<StudyFrance />} />
        <Route path="/study-abroad-uk" element={<StudyUK />} />
        <Route path="/study-abroad-canada" element={<StudyCanada />} />
        <Route path="/study-abroad-new-zealand" element={<StudyNZ />} />
        <Route path="/study-abroad-australia" element={<StudyAustralia />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/external-scholarships" element={<ExternalScholarships />} />
        <Route path="/scholarships-secured" element={<ScholarshipsSecured />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/visa-assistance" element={<Visa />} />
        <Route path="/breaking-news" element={<Breaking />} />
        <Route path="/partners" element={<PartnerSchoolsPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;