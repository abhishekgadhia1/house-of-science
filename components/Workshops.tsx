

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Workshop } from '../types';
import { RAW_WORKSHOPS } from '../data/curriculum';
import Footer from './Footer';
import { FlaskConical, Atom, Dna, Cpu, Grid, Zap, Magnet, Gauge, Search, Wind, Waves, Sun, Sparkles, Radio, Telescope, Fingerprint, X, CheckCircle2, ChevronRight, LayoutGrid, GraduationCap, BookOpen, Bug, Calendar, Lock, ArrowRight, Phone, User, Sigma, Users, ChevronDown } from 'lucide-react';

const getCategoryImage = (cat: string) => {
  switch(cat) {
    case 'Physics': return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80';
    case 'Chemistry': return 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?auto=format&fit=crop&w=800&q=80';
    case 'Biology': return 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80';
    case 'Robotics': return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
    case 'Electronics': return 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=800&q=80';
    case 'Astronomy': return 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=800&q=80';
    case 'Applied Math': return 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'; // Reusing physics/math abstract
    default: return 'https://images.unsplash.com/photo-1517420704952-d9f39714aeb9?auto=format&fit=crop&w=800&q=80';
  }
};

const CategoryIcon = ({ category, title }: { category: string, title: string }) => {
  const t = title.toLowerCase();
  if (t.includes('magnet') || t.includes('field')) return <Magnet className="w-4 h-4" />;
  if (t.includes('energy') || t.includes('power') || t.includes('circuit')) return <Zap className="w-4 h-4" />;
  if (t.includes('force') || t.includes('motion') || t.includes('machin')) return <Gauge className="w-4 h-4" />;
  if (t.includes('optic') || t.includes('light') || t.includes('laser')) return <Sun className="w-4 h-4" />;
  if (t.includes('heat') || t.includes('thermo')) return <Wind className="w-4 h-4" />;
  if (t.includes('fluid') || t.includes('water') || t.includes('flight') || t.includes('aero')) return <Waves className="w-4 h-4" />;
  if (t.includes('sound') || t.includes('wave') || t.includes('acoust')) return <Waves className="w-4 h-4" />;
  if (t.includes('quantum') || t.includes('nuclear')) return <Sparkles className="w-4 h-4" />;
  if (t.includes('bio') || t.includes('eco')) return <Bug className="w-4 h-4" />;
  
  switch (category) {
    case 'Chemistry': return <FlaskConical className="w-4 h-4" />;
    case 'Physics': return <Atom className="w-4 h-4" />;
    case 'Biology': return <Dna className="w-4 h-4" />;
    case 'Robotics': return <Cpu className="w-4 h-4" />;
    case 'Electronics': return <Radio className="w-4 h-4" />;
    case 'Astronomy': return <Telescope className="w-4 h-4" />;
    case 'Forensics': return <Fingerprint className="w-4 h-4" />;
    case 'Applied Math': return <Sigma className="w-4 h-4" />;
    default: return <Grid className="w-4 h-4" />;
  }
};

type ViewMode = 'topic' | 'grade' | 'age';

interface WorkshopsProps {
  initialSubject?: string;
  initialQuery?: string;
}

const Workshops: React.FC<WorkshopsProps> = ({ initialSubject, initialQuery }) => {
  // Default to TOPIC view as requested
  const [viewMode, setViewMode] = useState<ViewMode>('topic');
  const [selectedSubject, setSelectedSubject] = useState<string>(initialSubject || 'Physics');
  const [selectedGrade, setSelectedGrade] = useState<number>(5);
  // Default to first age bucket (10-12 Yrs -> Grades 5-7)
  const [selectedAgeRange, setSelectedAgeRange] = useState<{label: string, min: number, max: number}>({ label: '10-12 Yrs', min: 5, max: 7 });
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery || '');
  const [viewingExperiments, setViewingExperiments] = useState<Workshop | null>(null);
  
  // Enrollment State
  const [enrollingWorkshop, setEnrollingWorkshop] = useState<Workshop | null>(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState<{ title: string, price: string } | null>(null);
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollName, setEnrollName] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');
  const [enrollSlot, setEnrollSlot] = useState('');
  const [enrollPeople, setEnrollPeople] = useState('1');
  const [enrollConfirmed, setEnrollConfirmed] = useState(false);
  const [sharePhone, setSharePhone] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [showWhatsappPopup, setShowWhatsappPopup] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state if props change (re-navigation)
  useEffect(() => {
    if (initialSubject) setSelectedSubject(initialSubject);
    if (initialQuery !== undefined) {
        setSearchQuery(initialQuery);
        // If there is a query, force topic view. If query is empty strings (cleared), keep current or default.
        if (initialQuery) setViewMode('topic');
    } else {
        // Reset search query if initialQuery prop is removed/undefined (navigation reset)
        setSearchQuery('');
    }
  }, [initialSubject, initialQuery]);

  // Reset scroll on view mode or filter change (Mobile only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // On mobile, the scroll container is in App.tsx (the div with overflow-y-auto)
      const scrollContainer = containerRef.current?.closest('.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [viewMode, selectedSubject, selectedGrade, selectedAgeRange]);

  // Formatted Data
  const workshopsData: Workshop[] = useMemo(() => {
    return RAW_WORKSHOPS.map((raw, idx) => {
      const expCount = raw.exps.length;
      let calculatedPrice = expCount >= 5 ? 400 : 300;
      
      // Grade 11-12 experiments are priced higher (500 or 600)
      if (raw.grade >= 11) {
          calculatedPrice = expCount >= 5 ? 600 : 500;
      }
      
      const calculatedDuration = expCount >= 5 ? '2 HOURS' : '1.5 HOURS';

      return {
        id: `${raw.cat.substring(0,2).toLowerCase()}-${idx}-g${raw.grade}`,
        title: raw.title,
        topicSeries: raw.title, 
        description: raw.desc, // Use manual description
        category: raw.cat as any,
        gradeLevel: raw.grade,
        ageGroup: `${raw.grade + 5}-${raw.grade + 6}`,
        price: calculatedPrice,
        duration: calculatedDuration,
        image: getCategoryImage(raw.cat),
        experimentCount: expCount,
        experimentList: raw.exps,
        comingSoon: (raw as any).comingSoon || false
      };
    });
  }, []);

  // Subject Sidebar Items
  const subjects = useMemo(() => {
    const baseSubjects = [
      { id: 'Physics', label: 'Physics' },
      { id: 'Chemistry', label: 'Chemistry' },
      { id: 'Biology', label: 'Biotech' },
      { id: 'Electronics', label: 'Electronics' },
      { id: 'Robotics', label: 'Robotics' },
      { id: 'Astronomy', label: 'Astronomy' },
      { id: 'Applied Math', label: 'Applied Math' }
    ];

    return baseSubjects.map(sub => {
      const subjectWorkshops = workshopsData.filter(w => w.category === sub.id);
      const isAllComingSoon = subjectWorkshops.length > 0 && subjectWorkshops.every(w => w.comingSoon);
      return { ...sub, isAllComingSoon };
    });
  }, [workshopsData]);

  // Grade Items (5-12)
  const grades = Array.from({ length: 8 }, (_, i) => i + 5);

  // Age Ranges
  const ageRanges = [
      { label: '10-12 Yrs', min: 5, max: 7 },
      { label: '13-15 Yrs', min: 8, max: 10 },
      { label: '16-18 Yrs', min: 11, max: 12 }
  ];

  // FILTER LOGIC
  const displayedWorkshops = useMemo(() => {
    // 1. First, always filter by Subject
    let filtered = workshopsData.filter(w => w.category === selectedSubject);

    // 2. Filter by search query if exists
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(w => 
            w.title.toLowerCase().includes(q) || 
            w.description.toLowerCase().includes(q) ||
            w.experimentList.some(exp => exp.toLowerCase().includes(q))
        );
    }

    // 3. Apply View Mode Logic
    // CRITICAL: If searching, we generally want to see results across all grades (Topic View),
    // unless the user explicitly switched back to Grade/Age view while searching.
    if (viewMode === 'grade') {
      // Filter strictly by Grade
      filtered = filtered.filter(w => w.gradeLevel === selectedGrade);
    } else if (viewMode === 'age') {
      // Filter by Grade Range
      filtered = filtered.filter(w => w.gradeLevel >= selectedAgeRange.min && w.gradeLevel <= selectedAgeRange.max);
    }
    
    // Topic view shows everything for that subject sorted alphabetically
    // Sort logic: Coming soon items last, then alphabetical
    return filtered.sort((a, b) => {
      if (a.comingSoon !== b.comingSoon) {
        return a.comingSoon ? 1 : -1;
      }
      return a.title.localeCompare(b.title);
    });

  }, [workshopsData, viewMode, selectedSubject, selectedGrade, selectedAgeRange, searchQuery]);

  // Reset scroll to top when subject changes (Mobile)
  useEffect(() => {
    if (window.innerWidth < 768) {
      const scrollContainer = document.querySelector('main > div.overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  }, [selectedSubject]);

  // Auto-close success modal after 3 seconds
  useEffect(() => {
    if (enrollSuccess) {
      const timer = setTimeout(() => {
        resetEnrollModal();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [enrollSuccess]);

  // Reset share state when viewing experiments modal changes
  useEffect(() => {
    setSharePhone('');
    setShareSuccess(false);
  }, [viewingExperiments]);

  const getPlaceholder = () => {
    if (viewMode === 'topic') return `SEARCH ${selectedSubject.toUpperCase()} TOPICS...`;
    if (viewMode === 'age') return `SEARCH ${selectedSubject.toUpperCase()} (${selectedAgeRange.label})...`;
    return `SEARCH CLASS ${selectedGrade} ${selectedSubject.toUpperCase()}...`;
  };

  const getHeaderTitle = () => {
      if (viewMode === 'topic') return `${selectedSubject} Topics`;
      if (viewMode === 'age') return `${selectedSubject} (Ages ${selectedAgeRange.label})`;
      return `Class ${selectedGrade} ${selectedSubject}`;
  };

  const handleEnrollSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      // Validation
      if (!enrollName.trim()) {
          e.preventDefault();
          alert("Please enter student name");
          return;
      }
      if (enrollPhone.length !== 10 || !/^\d+$/.test(enrollPhone)) {
          e.preventDefault();
          alert("Phone number must be exactly 10 digits");
          return;
      }
      if (!enrollSlot) {
          e.preventDefault();
          alert("Please select a time slot");
          return;
      }
      if (!enrollConfirmed) {
          e.preventDefault();
          alert("Please confirm that the session will be conducted at the student's home");
          return;
      }

      if (!selectedWorkshop) {
          e.preventDefault();
          alert("Error: No workshop selected.");
          return;
      }

      // Log the payload to confirm fields are included
      const payload = {
          name: enrollName,
          phone: enrollPhone,
          course: selectedWorkshop?.title || '',
          price: selectedWorkshop?.price || '',
          number_of_students: enrollPeople,
          time_slot: enrollSlot
      };
      console.log("Submitting Enrollment Payload:", JSON.stringify(payload));

      // If valid, prevent default, and submit programmatically
      // to ensure the browser has time to initiate the request before unmounting.
      e.preventDefault();
      
      const form = e.currentTarget;
      // Submit the form programmatically to the hidden iframe
      form.submit();
      
      // Show success message in the UI after a small delay
      setTimeout(() => {
          setEnrollSuccess(true);
      }, 100);
  };

  const resetEnrollModal = () => {
      setEnrollingWorkshop(null);
      setSelectedWorkshop(null);
      setEnrollSuccess(false);
      setEnrollName('');
      setEnrollPhone('');
      setEnrollSlot('');
      setEnrollPeople('1');
      setEnrollConfirmed(false);
  };

  const renderWorkshopCard = (workshop: Workshop) => {
    const isComingSoon = workshop.comingSoon;
    
    return (
      <div key={workshop.id} className={`group relative bg-white border p-4 md:p-5 flex flex-col rounded-lg transition-all duration-300 ${
        isComingSoon 
          ? 'opacity-60 grayscale cursor-not-allowed bg-slate-50 border-slate-200' 
          : 'border-indigo-600/20 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.25)] hover:border-indigo-600/40 active:scale-[0.98] md:shadow-none md:border-slate-200 md:hover:shadow-xl md:hover:shadow-indigo-100 md:hover:border-indigo-600/50 md:active:scale-100'
      }`}>
        
        {/* Overlay for Coming Soon */}
        {isComingSoon && (
          <div className="absolute inset-0 z-20 overflow-hidden rounded-lg pointer-events-none">
             <div className="absolute top-3 right-3">
                 <span className="bg-slate-200 text-slate-500 text-[9px] font-bold uppercase px-2 py-1 rounded tracking-widest flex items-center gap-1">
                   <Lock className="w-3 h-3" /> Coming Soon
                 </span>
             </div>
          </div>
        )}

        <div className="mb-3 md:mb-4 flex justify-between items-start">
          <div className={`p-1.5 md:p-2 rounded-md transition-colors duration-300 ${isComingSoon ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
              <CategoryIcon category={workshop.category} title={workshop.title} />
          </div>
          <span className={`font-mono text-[10px] transition-colors uppercase font-semibold tracking-wider bg-slate-50 px-2 py-1 rounded ${isComingSoon ? 'text-slate-300' : 'text-slate-400 group-hover:text-indigo-600'}`}>
              {workshop.duration}
          </span>
        </div>

        <div className="flex-grow mb-3 md:mb-4">
          <h4 className={`text-base font-bold mb-1 md:mb-2 transition-colors ${isComingSoon ? 'text-slate-500' : 'text-slate-900 group-hover:text-indigo-700'}`}>
            {workshop.title}
          </h4>
          <p className="text-slate-500 text-xs leading-relaxed">
              {workshop.description}
          </p>
        </div>

        {/* Footer Area - Aligned Actions */}
        <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
            <div className="flex flex-col gap-0.5">
                 <span className={`text-sm font-bold ${isComingSoon ? 'text-slate-400 line-through decoration-slate-300' : 'text-indigo-600'}`}>
                    ₹{workshop.price}
                 </span>
                 <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isComingSoon) setViewingExperiments(workshop);
                    }}
                    disabled={isComingSoon}
                    className={`flex items-center group/btn text-[10px] font-medium ${isComingSoon ? 'text-slate-300 cursor-not-allowed' : 'text-slate-400 hover:text-indigo-600 transition-colors'}`}
                  >
                    {workshop.experimentCount} Experiments
                    {!isComingSoon && <ChevronRight className="w-2.5 h-2.5 ml-0.5" />}
                  </button>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (!isComingSoon) {
                        setEnrollingWorkshop(workshop);
                        setSelectedWorkshop({
                            title: workshop.title,
                            price: (workshop.price || 0).toString()
                        });
                        setEnrollSuccess(false);
                    }
                }}
                disabled={isComingSoon}
                className={`
                    px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-wider transition-all
                    ${isComingSoon 
                        ? 'border-slate-100 text-slate-300 cursor-not-allowed' 
                        : 'border-slate-200 text-slate-500 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50'
                    }
                `}
            >
                Enrol
            </button>
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="bg-slate-50 md:h-full h-auto flex flex-col relative md:overflow-hidden">
      <div className="flex-grow flex flex-col md:flex-row md:h-full h-auto md:overflow-hidden">
        
        {/* Mobile Sticky Header Wrapper / Desktop Sidebar Container */}
        <div className="md:contents sticky top-0 z-40 bg-white border-b border-slate-200 md:border-0">
          {/* Sidebar */}
          <div className="w-full md:w-64 lg:w-72 bg-white md:bg-white/50 border-b md:border-b-0 md:border-r border-slate-200 p-4 md:p-8 flex flex-col flex-shrink-0 animate-fade-in backdrop-blur-sm md:h-full md:overflow-y-auto custom-scrollbar">
            <div className="mb-3 md:mb-6">
              <h2 className="text-indigo-600 font-mono text-[9px] md:text-xs tracking-widest uppercase font-bold mb-0.5 md:mb-2 opacity-70">/ Select Subject</h2>
              <h3 className="hidden md:block text-base md:text-xl font-display font-bold text-slate-900 tracking-tight">
                  Curriculum
              </h3>
            </div>
            
            <div className="flex-grow md:overflow-visible grid grid-cols-3 md:flex md:flex-col gap-1.5 md:gap-0 pb-1 md:pb-0">
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                     setSelectedSubject(sub.id);
                     setSearchQuery(''); // Clear search on subject change
                     if (typeof window !== 'undefined' && window.innerWidth < 768) {
                       setViewMode('topic');
                     }
                  }}
                  className={`w-full items-center justify-center md:justify-between text-center md:text-left px-1 py-1.5 md:px-4 md:py-3 text-[10px] md:text-sm font-mono md:font-medium transition-all duration-300 rounded-md uppercase md:normal-case tracking-tighter md:tracking-normal ${
                    sub.id === 'Astronomy' ? 'hidden md:flex' : 'flex'
                  } ${
                    selectedSubject === sub.id
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                      : 'text-slate-500 md:text-slate-500 hover:text-slate-900 md:hover:text-indigo-600 hover:bg-white md:hover:bg-indigo-50 border border-indigo-600/30 shadow-sm md:shadow-none md:border-0 bg-white/60 md:bg-transparent'
                  }`}
                >
                  <span className="relative">
                    {sub.label}
                  </span>
                  {selectedSubject === sub.id && (
                    <span className="hidden md:block w-1.5 h-1.5 bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile-only Header Controls (Sticky) */}
          <div className="md:hidden p-4 bg-white border-t border-slate-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-sm">
                      <button 
                          onClick={() => setViewMode('topic')}
                          className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'topic' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 border border-transparent hover:border-slate-200'}`}
                      >
                          By Topic
                      </button>
                      <button 
                          onClick={() => setViewMode('age')}
                          className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'age' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 border border-transparent hover:border-slate-200'}`}
                      >
                          By Age
                      </button>
                      <button 
                          onClick={() => setViewMode('grade')}
                          className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded-md transition-all ${viewMode === 'grade' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 border border-transparent hover:border-slate-200'}`}
                      >
                          By Grade
                      </button>
                  </div>
                  <div className="flex items-baseline space-x-1.5">
                      <h2 className="text-[10px] font-mono font-bold text-slate-900 tracking-widest uppercase">
                          {selectedSubject}
                      </h2>
                      <span className="font-mono text-[8px] text-slate-400">
                          {displayedWorkshops.length} UNITS
                      </span>
                  </div>
              </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 lg:p-8 md:overflow-y-auto custom-scrollbar bg-slate-50 animate-fade-in">
          <div className="w-full max-w-[2000px]">
             
             {/* Mobile-only Scrolling Controls */}
             <div className="md:hidden flex flex-col mb-4">
                {/* Mobile Search */}
                {viewMode === 'topic' && (
                    <div className="relative group w-full h-9">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getPlaceholder()} 
                            className="w-full h-full bg-white border border-slate-200 pl-8 pr-4 text-[10px] font-mono text-slate-900 outline-none rounded-md placeholder-slate-400 uppercase tracking-wide shadow-sm"
                        />
                    </div>
                )}

                {/* Mobile Selectors Strip */}
                {(viewMode === 'grade' || viewMode === 'age') && (
                    <div className="w-full h-9">
                        {viewMode === 'grade' ? (
                            <div className="grid grid-cols-8 gap-1 bg-slate-200/50 p-1 rounded-lg h-full">
                                {grades.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setSelectedGrade(g)}
                                        className={`flex items-center justify-center rounded-md text-[10px] font-bold transition-all duration-200 h-full ${
                                            selectedGrade === g 
                                            ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]' 
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-1 bg-slate-200/50 p-1 rounded-lg h-full">
                                {ageRanges.map((range, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedAgeRange(range)}
                                        className={`flex items-center justify-center rounded-md text-[9px] font-bold uppercase tracking-tight transition-all duration-200 h-full ${
                                            selectedAgeRange.label === range.label 
                                            ? 'bg-white text-indigo-600 shadow-sm scale-[1.02]' 
                                            : 'text-slate-400'
                                        }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
             </div>

             {/* Desktop Header Controls (Hidden on mobile) */}
             <div className="hidden md:flex sticky -top-16 z-30 bg-slate-50 -mx-4 lg:-mx-8 px-4 lg:px-8 pt-10 pb-5 mb-6 flex-row items-start justify-between gap-6 md:-mt-16">
                <div className="flex flex-col gap-4 flex-grow">
                    
                    {/* View Toggle */}
                    <div className="flex items-center space-x-2 bg-white border border-slate-200 rounded-lg p-1 w-fit">
                         <button 
                            onClick={() => setViewMode('topic')}
                            className={`flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                                viewMode === 'topic' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <LayoutGrid className="w-3 h-3 mr-2" />
                            By Topic
                        </button>
                        <button 
                            onClick={() => setViewMode('age')}
                            className={`flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                                viewMode === 'age' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <Calendar className="w-3 h-3 mr-2" />
                            By Age
                        </button>
                        <button 
                            onClick={() => setViewMode('grade')}
                            className={`flex items-center px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                                viewMode === 'grade' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            <GraduationCap className="w-3 h-3 mr-2" />
                            By Grade
                        </button>
                    </div>

                    <div className="flex items-baseline space-x-3">
                        <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
                            {getHeaderTitle()}
                        </h2>
                        <span className="font-sans text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100">
                            {displayedWorkshops.length} MODULES
                        </span>
                    </div>

                    {/* Grade Selector Strip */}
                    {viewMode === 'grade' && (
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 custom-scrollbar max-w-full">
                            {grades.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGrade(g)}
                                    className={`group relative px-3 py-1.5 flex items-center justify-center rounded-md text-[10px] font-bold transition-all duration-300 flex-shrink-0 uppercase tracking-wider border transform active:scale-95 ${selectedGrade === g ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200 translate-y-[-1px]' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'}`}
                                >
                                    <span className="relative z-10">Class {g}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Age Selector Strip */}
                    {viewMode === 'age' && (
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 custom-scrollbar max-w-full">
                            {ageRanges.map((range, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedAgeRange(range)}
                                    className={`group relative px-3 py-1.5 flex items-center justify-center rounded-md text-[10px] font-bold transition-all duration-300 flex-shrink-0 uppercase tracking-wider border transform active:scale-95 ${selectedAgeRange.label === range.label ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200 translate-y-[-1px]' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'}`}
                                >
                                    <span className="relative z-10">{range.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search */}
                <div className="relative group w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={getPlaceholder()} 
                        className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2.5 text-xs font-sans font-medium text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none transition-all placeholder-slate-400 rounded-lg shadow-sm"
                    />
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {displayedWorkshops.map(renderWorkshopCard)}
                {displayedWorkshops.length === 0 && (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 font-mono text-sm mb-2">NO MODULES FOUND.</p>
                      <p className="text-slate-300 text-xs">
                         {viewMode === 'grade' 
                            ? `Try a different Grade level for ${selectedSubject} or switch to 'By Topic'.` 
                            : viewMode === 'age' 
                                ? `Try a different Age Group or Subject.`
                                : `Try a different search term.`}
                      </p>
                  </div>
                )}
             </div>

             {/* Footer inside scrollable area for Workshops */}
             <div className="mt-6 md:mt-20 -mx-4 lg:-mx-8">
                <Footer />
             </div>

          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      <AnimatePresence>
        {enrollingWorkshop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden relative"
              >
                <button 
                    onClick={resetEnrollModal}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all z-10"
                >
                    <X className="w-4 h-4" />
                </button>
                
                <div className="p-5">
                    {!enrollSuccess ? (
                        <>
                            <div className="mb-4">
                                <span className="text-indigo-600 font-mono text-[10px] tracking-widest uppercase font-bold">Enrolment Request</span>
                                <h3 className="text-xl font-display font-bold text-slate-900 mt-1">{enrollingWorkshop.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {enrollingWorkshop.duration}
                                </p>
                            </div>

                            <form 
                                method="POST" 
                                action="https://script.google.com/macros/s/AKfycbw-T-LGayP8mhq6LnP75LpFw12lM2lJkzDV-xnWZhubS9K5_YvzqbCXkVt5Q2KPFnhR/exec"
                                target="hidden_enroll_iframe"
                                onSubmit={handleEnrollSubmit} 
                                className="space-y-3"
                            >
                                <input type="hidden" name="course" value={selectedWorkshop?.title || ''} />
                                <input type="hidden" name="price" value={selectedWorkshop?.price || ''} />
                                <input type="hidden" name="time_slot" value={enrollSlot} />
                                <input type="hidden" name="number_of_students" value={enrollPeople} />
                                <div>
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Student Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input 
                                            type="text" 
                                            name="name"
                                            required
                                            value={enrollName}
                                            onChange={(e) => setEnrollName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none rounded-lg transition-all"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="flex-[1.5]">
                                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                            <input 
                                                type="tel" 
                                                name="phone"
                                                required
                                                value={enrollPhone}
                                                onChange={(e) => setEnrollPhone(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none rounded-lg transition-all"
                                                placeholder="Contact number"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold whitespace-nowrap">No of Students</label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                                            <select 
                                                value={enrollPeople}
                                                onChange={(e) => setEnrollPeople(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-8 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none rounded-lg transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 font-bold">Select Time Slot</label>
                                    <div className="space-y-3">
                                        {[
                                            { date: '18th April Sunday', times: ['10 AM', '12 PM', '2 PM', '4 PM'] },
                                            { date: '25th April Sunday', times: ['10 AM', '12 PM', '2 PM', '4 PM'] }
                                        ].map((day) => (
                                            <div key={day.date}>
                                                <p className="text-[9px] text-slate-500 font-bold mb-1.5 uppercase tracking-wider">{day.date}</p>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {day.times.map((time) => {
                                                        const slotValue = `${day.date} - ${time}`;
                                                        const isSelected = enrollSlot === slotValue;
                                                        return (
                                                            <button
                                                                key={time}
                                                                type="button"
                                                                onClick={() => setEnrollSlot(slotValue)}
                                                                className={`py-1.5 text-[9px] font-bold rounded-md transition-all border ${
                                                                    isSelected 
                                                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'
                                                                }`}
                                                            >
                                                                {time}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-start space-x-2 pt-1">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="confirm-place"
                                            name="confirm_place"
                                            type="checkbox"
                                            required
                                            checked={enrollConfirmed}
                                            onChange={(e) => setEnrollConfirmed(e.target.checked)}
                                            className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                                        />
                                    </div>
                                    <label htmlFor="confirm-place" className="text-[10px] text-slate-500 leading-tight cursor-pointer select-none">
                                        This session will be conducted at the student’s home. Please confirm if that works for you.
                                    </label>
                                </div>

                                <div className="pt-2">
                                    <button 
                                        type="submit" 
                                        className="w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg hover:bg-indigo-600 transition-colors shadow-lg"
                                    >
                                        Confirm Enrolment
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="py-12 flex flex-col items-center text-center">
                            <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 260,
                                    damping: 20,
                                    delay: 0.1
                                }}
                                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
                            >
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </motion.div>
                            
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <h3 className="text-xl font-display font-bold text-slate-900 mb-2">Enrolment confirmed successfully</h3>
                                <p className="text-sm text-slate-500 max-w-[240px] leading-relaxed mx-auto">
                                    You will hear from us shortly.
                                </p>
                            </motion.div>
                        </div>
                    )}
                </div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experiments List Modal */}
      <AnimatePresence>
        {viewingExperiments && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
            >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900">{viewingExperiments.title}</h3>
                <span className="text-xs text-indigo-600 font-mono uppercase tracking-wider font-semibold">
                    Experiment List {viewMode !== 'topic' && `• Class ${viewingExperiments.gradeLevel}`}
                </span>
              </div>
              <button 
                onClick={() => setViewingExperiments(null)}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50 flex flex-col md:flex-row gap-6">
              <div className="flex-1 blur-[4px]">
                <ul className="space-y-3">
                  {viewingExperiments.experimentList && viewingExperiments.experimentList.map((exp, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{exp}</span>
                    </li>
                  ))}
                  {(!viewingExperiments.experimentList || viewingExperiments.experimentList.length === 0) && (
                    <li className="text-slate-400 italic text-sm">Detailed manifest loading...</li>
                  )}
                </ul>
              </div>

              <div className="md:w-44 flex flex-col justify-center md:border-l md:border-slate-200 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                <p className="text-[10px] text-slate-500 font-medium mb-3 leading-relaxed">
                  Experiment list will be shared on this number
                </p>
                <div className="flex flex-row gap-2 md:flex-col md:space-y-3">
                  <div className="relative group flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                      type="tel" 
                      value={sharePhone}
                      onChange={(e) => {
                        setSharePhone(e.target.value);
                        if (shareSuccess) setShareSuccess(false);
                      }}
                      placeholder="Enter Number"
                      className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2.5 text-xs font-sans font-medium text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none transition-all placeholder-slate-400 rounded-lg shadow-sm"
                    />
                  </div>
                  <div className="flex justify-center shrink-0">
                    <button 
                      onClick={() => {
                        if (sharePhone.length >= 10) {
                          setShareSuccess(true);
                          
                          // Execute real POST request
                          fetch("https://script.google.com/macros/s/AKfycbyFspfDjSN4qdqE3PHPChK0WRfXK0Ss2ijxugnlF38eGcsk_TV8lPACSFS1rxaRhxid4Q/exec", {
                            method: "POST",
                            mode: 'no-cors',
                            body: new URLSearchParams({
                              module: viewingExperiments?.title || '',
                              phone: sharePhone
                            })
                          });

                          // Show WhatsApp popup
                          setShowWhatsappPopup(true);
                          setTimeout(() => {
                            setShowWhatsappPopup(false);
                          }, 3000);
                        } else {
                          alert("Please enter a valid phone number");
                        }
                      }}
                      disabled={shareSuccess}
                      className={`px-4 py-2 rounded-md text-[9px] font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 ${
                        shareSuccess 
                          ? 'bg-green-50 text-green-600 cursor-default' 
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-[0.95]'
                      }`}
                    >
                      {shareSuccess ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Sent
                        </>
                      ) : (
                        <>
                          Share <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <span className="font-display text-sm tracking-tight text-slate-900 leading-none">
                houseof<span className="font-extrabold text-black">science</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      <AnimatePresence>
        {showWhatsappPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[999] flex items-center justify-center pointer-events-none p-4"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col items-center gap-4 max-w-[280px] w-full text-center pointer-events-auto">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-[13px] font-bold text-slate-900 leading-relaxed tracking-tight">
                Thanks! We'll share the experiment list with you shortly on WhatsApp.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden iframe for form submission to prevent page navigation */}
      <iframe name="hidden_enroll_iframe" style={{ display: 'none' }}></iframe>
    </div>
  );
};

export default Workshops;