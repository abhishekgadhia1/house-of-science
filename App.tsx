import React, { useState } from 'react';
import { NavSection } from './types';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Workshops from './components/Workshops';
import AiExperiment from './components/AiExperiment';
import Contact from './components/Contact';
import Footer from './components/Footer';
import EnrollmentModal from './components/EnrollmentModal';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>(NavSection.HOME);
  const [workshopFilters, setWorkshopFilters] = useState<{subject?: string, query?: string}>({});
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  const handleNavigate = (section: NavSection) => {
    // Clear filters when standard navigation occurs to ensure fresh state (search text becomes null and void)
    setWorkshopFilters({});
    setCurrentSection(section);
  };

  const handleWorkshopNavigate = (subject?: string, query?: string) => {
    setWorkshopFilters({ subject, query });
    setCurrentSection(NavSection.WORKSHOPS);
  };

  const renderContent = () => {
    switch (currentSection) {
      case NavSection.HOME:
        return (
          <Hero 
            onCtaClick={() => handleNavigate(NavSection.WORKSHOPS)} 
            onSearchNavigate={handleWorkshopNavigate}
          />
        );
      case NavSection.WORKSHOPS:
        return <Workshops initialSubject={workshopFilters.subject} initialQuery={workshopFilters.query} />;
      case NavSection.AI_LAB:
        return <AiExperiment />;
      case NavSection.CONTACT:
        return <Contact />;
      default:
        return <Hero 
          onCtaClick={() => handleNavigate(NavSection.WORKSHOPS)} 
          onSecondaryClick={() => handleNavigate(NavSection.AI_LAB)}
          onSearchNavigate={handleWorkshopNavigate}
        />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      <NavBar 
        currentSection={currentSection} 
        onNavigate={handleNavigate} 
        onEnrolClick={() => setIsEnrollModalOpen(true)}
      />
      
      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden pt-20">
        <div className={`h-full w-full custom-scrollbar ${currentSection === NavSection.WORKSHOPS ? 'md:overflow-hidden overflow-y-auto' : 'overflow-y-auto'}`}>
          {renderContent()}
          {/* Footer shows at bottom of content flow, except potentially on Home if design dictates, but here we include it always at bottom of scroll */}
          {currentSection !== NavSection.HOME && currentSection !== NavSection.WORKSHOPS && <Footer />}
        </div>
      </main>

      <EnrollmentModal 
        isOpen={isEnrollModalOpen} 
        onClose={() => setIsEnrollModalOpen(false)} 
      />

      {/* Mobile Bottom Value Prop - Only on Home */}
      {currentSection === NavSection.HOME && (
        <div className="md:hidden py-3 px-2 z-40">
          <p className="text-[8px] font-bold text-slate-400 tracking-wider uppercase text-center whitespace-nowrap">
            We bring all equipment <span className="text-indigo-300 mx-1">•</span> Real experiments <span className="text-indigo-300 mx-1">•</span> At your home
          </p>
        </div>
      )}
    </div>
  );
};

export default App;