import React, { useState, useEffect } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { RAW_WORKSHOPS } from '../data/curriculum';

interface HeroProps {
  onCtaClick: () => void;
  onSearchNavigate: (subject?: string, query?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick, onSearchNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchTerm.length > 1) {
       const matches = RAW_WORKSHOPS.filter(w => 
          w.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          w.cat.toLowerCase().includes(searchTerm.toLowerCase()) ||
          w.exps.some((exp: string) => exp.toLowerCase().includes(searchTerm.toLowerCase()))
       ).slice(0, 50); // Increased limit to allow scrolling if more than 3 matches
       setResults(matches);
    } else {
        setResults([]);
    }
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (results.length > 0) {
        onSearchNavigate(results[0].cat, results[0].title);
      } else if (searchTerm.trim()) {
        onSearchNavigate(undefined, searchTerm);
      }
    }
  };

  const showDropdown = searchTerm.length > 1;

  return (
    <div className="relative h-full flex items-center overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-[600px]">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-200/40 rounded-full blur-[120px] mix-blend-multiply opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[100px] mix-blend-multiply opacity-60"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 grid lg:grid-cols-2 gap-16 items-center h-full pt-20 lg:pt-0">
        
        {/* Left Column: Typography */}
        <div className="space-y-8 animate-slide-up">
              <div className="flex items-center space-x-4">
                 <div className="h-px w-12 bg-indigo-600"></div>
                 <span className="text-indigo-600 font-mono text-xs tracking-widest uppercase font-bold">Est. 2025</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[1.05]">
                Making <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Science</span> <br />
                Tangible.
              </h1>
              
              <p className="text-lg text-slate-600 max-w-lg font-normal leading-relaxed border-l-2 border-indigo-200 pl-6">
                House of Science is not a classroom. It is a research facility for the next generation of innovators.
              </p>

              <div className="flex items-center gap-4 pt-4">
                  <button onClick={onCtaClick} className="bg-slate-900 text-white px-8 py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg hover:shadow-xl flex items-center">
                    Browse Modules
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
              </div>
        </div>

        {/* Right Column: Search Interface */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto animate-fade-in z-50 lg:-translate-y-12" style={{ animationDelay: '0.2s' }}>
             
             {/* Search Card Container */}
             <div className="relative">
                 {/* Main Input Section */}
                 <div className={`bg-white/90 backdrop-blur-xl shadow-2xl transition-all duration-300 ring-1 ring-white/60 relative z-20 ${
                    showDropdown ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl'
                 } ${isFocused ? 'ring-indigo-300 shadow-indigo-500/20' : ''}`}>
                    
                    {/* Minimal Header */}
                    <div className="bg-slate-50/40 border-b border-slate-100/80 p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Search className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                        <div className="flex gap-1.5 opacity-60">
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        </div>
                    </div>

                    <div className="p-1">
                        <div className="relative">
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                                placeholder="SEARCH TOPICS (e.g. Optics, DNA)..."
                                className="block w-full pl-4 pr-12 py-3 bg-transparent border-0 text-slate-900 placeholder-slate-400 focus:ring-0 text-xs font-mono font-bold tracking-wide"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-400 rounded border border-slate-200 font-mono">
                                    ⏎
                                </kbd>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Absolute Results Dropdown */}
                 {showDropdown && (
                    <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl rounded-b-2xl shadow-2xl ring-1 ring-slate-100 border-t border-slate-100 max-h-[190px] overflow-y-auto custom-scrollbar z-10">
                        {results.length > 0 ? (
                            <div>
                                <div className="px-4 py-2 bg-indigo-50/30 border-b border-indigo-50 flex items-center justify-between">
                                    <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-wider">Matches Found</span>
                                    <span className="text-[9px] font-mono font-bold text-slate-400">{results.length}</span>
                                </div>
                                {results.map((res, idx) => (
                                    <div 
                                      key={idx} 
                                      onClick={() => onSearchNavigate(res.cat, res.title)} 
                                      className="px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-indigo-50/50 hover:shadow-sm transition-all cursor-pointer group flex flex-col gap-1"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{res.title}</span>
                                            <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded uppercase">{res.cat}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 line-clamp-1 group-hover:text-slate-500">{res.desc}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-6 text-center">
                                <p className="text-xs font-bold text-slate-900 mb-1">No Protocols Found</p>
                            </div>
                        )}
                    </div>
                 )}
             </div>

             {/* Decorative Elements around the card */}
             <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
             <div className="absolute -z-10 -bottom-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;