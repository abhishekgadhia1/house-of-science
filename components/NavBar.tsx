import React, { useState } from 'react';
import { NavSection } from '../types';
import { AlignRight, X } from 'lucide-react';

interface NavBarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onEnrolClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentSection, onNavigate, onEnrolClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: NavSection.HOME, label: 'Home' },
    { id: NavSection.WORKSHOPS, label: 'Experiment List' },
    { id: NavSection.CONTACT, label: 'Contact' },
  ];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setIsOpen(false);
  };

  const handleEnrolClick = () => {
    onEnrolClick();
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick(NavSection.HOME)}
          >
            <span className="font-display text-2xl tracking-tight text-indigo-600 leading-none transition-colors duration-300">
              houseof<span className="font-extrabold text-black">science</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${
                    currentSection === item.id
                      ? 'text-black'
                      : 'text-zinc-500 hover:text-black'
                  }`}
                >
                  {item.label}
                  <span className={`absolute -bottom-2 left-0 w-full h-px bg-indigo-600 transform origin-left transition-transform duration-300 ${currentSection === item.id ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-50'}`}></span>
                </button>
              ))}
            </div>
            {/* ENROL button hidden from desktop menu list as per request */}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-indigo-600 p-2 transition-all duration-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <AlignRight className="h-5 w-5 stroke-[1.5px]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-zinc-100 p-5 animate-fade-in shadow-2xl">
          <div className="flex flex-col space-y-4 items-center">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-[12px] font-mono font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                  currentSection === item.id
                    ? 'text-indigo-600'
                    : 'text-zinc-500 hover:text-black'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* ENROL button hidden from mobile menu list as per request */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;