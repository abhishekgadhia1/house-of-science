import React, { useState } from 'react';
import { NavSection } from '../types';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentSection, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: NavSection.HOME, label: 'Home' },
    { id: NavSection.WORKSHOPS, label: 'Workshops' },
    { id: NavSection.CONTACT, label: 'Contact' },
  ];

  const handleNavClick = (section: NavSection) => {
    onNavigate(section);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-panel py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group"
            onClick={() => handleNavClick(NavSection.HOME)}
          >
            <span className="font-display text-2xl tracking-tight text-slate-900 leading-none group-hover:text-indigo-600 transition-colors duration-300">
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
            
            <button className="bg-black text-white px-8 py-3 rounded-none text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
              Get Access
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black hover:text-indigo-600 p-2 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-zinc-100 p-6 animate-fade-in shadow-xl">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-2xl font-display font-bold text-left ${
                  currentSection === item.id
                    ? 'text-black pl-4 border-l-2 border-indigo-600'
                    : 'text-zinc-500'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button className="w-full bg-black text-white py-4 text-sm font-bold uppercase tracking-widest mt-8">
              Get Access
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;