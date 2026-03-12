import React, { useState } from 'react';
import { NavSection } from './types';
import NavBar from './components/NavBar';
import Hero from './components/Hero';
import Workshops from './components/Workshops';
import AiExperiment from './components/AiExperiment';
import Contact from './components/Contact';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavSection>(NavSection.HOME);
  const [workshopFilters, setWorkshopFilters] = useState<{subject?: string, query?: string}>({});

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
      <NavBar currentSection={currentSection} onNavigate={handleNavigate} />
      
      {/* Main Content Area */}
      <main className="flex-grow relative overflow-hidden pt-20">
        <div className="h-full w-full overflow-y-auto custom-scrollbar">
          {renderContent()}
          {/* Footer shows at bottom of content flow, except potentially on Home if design dictates, but here we include it always at bottom of scroll */}
          {currentSection !== NavSection.HOME && <Footer />}
        </div>
      </main>
    </div>
  );
};

export default App;