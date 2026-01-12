

import React, { useState, useMemo, useEffect } from 'react';
import { Workshop } from '../types';
import { RAW_WORKSHOPS } from '../data/curriculum';
import { FlaskConical, Atom, Dna, Cpu, Grid, Zap, Magnet, Gauge, Search, Wind, Waves, Sun, Sparkles, Radio, Telescope, Fingerprint, X, CheckCircle2, ChevronRight, LayoutGrid, GraduationCap, BookOpen, Bug, Calendar, Lock, ArrowRight, Phone, User, Sigma } from 'lucide-react';

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
  const [enrollSuccess, setEnrollSuccess] = useState(false);
  const [enrollName, setEnrollName] = useState('');
  const [enrollPhone, setEnrollPhone] = useState('');

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

  // Subject Sidebar Items
  const subjects = [
    { id: 'Physics', label: 'Physics' },
    { id: 'Chemistry', label: 'Chemistry' },
    { id: 'Biology', label: 'Biotech' },
    { id: 'Electronics', label: 'Electronics' },
    { id: 'Robotics', label: 'Robotics' },
    { id: 'Astronomy', label: 'Astronomy' },
    { id: 'Applied Math', label: 'Applied Math' }
  ];

  // Grade Items (5-12)
  const grades = Array.from({ length: 8 }, (_, i) => i + 5);

  // Age Ranges
  const ageRanges = [
      { label: '10-12 Yrs', min: 5, max: 7 },
      { label: '13-15 Yrs', min: 8, max: 10 },
      { label: '16-18 Yrs', min: 11, max: 12 }
  ];

  // Formatted Data
  const workshopsData: Workshop[] = useMemo(() => {
    return RAW_WORKSHOPS.map((raw, idx) => {
      return {
        id: `${raw.cat.substring(0,2).toLowerCase()}-${idx}-g${raw.grade}`,
        title: raw.title,
        topicSeries: raw.title, 
        description: raw.desc, // Use manual description
        category: raw.cat as any,
        gradeLevel: raw.grade,
        ageGroup: `${raw.grade + 5}-${raw.grade + 6}`,
        price: `₹${raw.price}`,
        duration: '3 HOURS',
        image: getCategoryImage(raw.cat),
        experimentCount: raw.exps.length,
        experimentList: raw.exps,
        comingSoon: (raw as any).comingSoon || false
      };
    });
  }, []);

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

  const handleEnrollSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate API call
      setTimeout(() => {
          setEnrollSuccess(true);
      }, 500);
  };

  const resetEnrollModal = () => {
      setEnrollingWorkshop(null);
      setEnrollSuccess(false);
      setEnrollName('');
      setEnrollPhone('');
  };

  const renderWorkshopCard = (workshop: Workshop) => {
    const isComingSoon = workshop.comingSoon;
    
    return (
      <div key={workshop.id} className={`group relative bg-white border border-slate-200 p-5 flex flex-col rounded-lg transition-all duration-300 ${isComingSoon ? 'opacity-60 grayscale cursor-not-allowed bg-slate-50' : 'hover:border-indigo-600/50 hover:shadow-xl hover:shadow-indigo-100'}`}>
        
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

        <div className="mb-4 flex justify-between items-start">
          <div className={`p-2 rounded-md transition-colors duration-300 ${isComingSoon ? 'bg-slate-100 text-slate-400' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white'}`}>
              <CategoryIcon category={workshop.category} title={workshop.title} />
          </div>
          <span className={`font-mono text-[10px] transition-colors uppercase font-semibold tracking-wider bg-slate-50 px-2 py-1 rounded ${isComingSoon ? 'text-slate-300' : 'text-slate-400 group-hover:text-indigo-600'}`}>
              {workshop.duration}
          </span>
        </div>

        <div className="flex-grow mb-4">
          <h4 className={`text-base font-bold mb-2 transition-colors ${isComingSoon ? 'text-slate-500' : 'text-slate-900 group-hover:text-indigo-700'}`}>
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
                    {workshop.price}
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
    <div className="bg-slate-50 min-h-full flex flex-col relative">
      <div className="flex-grow flex flex-col md:flex-row h-full">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 lg:w-72 bg-white/50 border-b md:border-b-0 md:border-r border-slate-200 p-6 md:p-8 flex flex-col flex-shrink-0 animate-fade-in backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-indigo-600 font-mono text-xs tracking-widest uppercase font-bold mb-2">/ Select Subject</h2>
            <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">
                Curriculum
            </h3>
          </div>
          
          <div className="space-y-2 flex-grow overflow-x-auto md:overflow-visible flex md:flex-col gap-2 md:gap-0 pb-2 md:pb-0 custom-scrollbar">
            {subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                   setSelectedSubject(sub.id);
                   setSearchQuery(''); // Clear search on subject change
                }}
                className={`flex items-center justify-between w-full text-left px-4 py-3 text-sm font-medium transition-all duration-300 rounded-md ${
                  selectedSubject === sub.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <span>{sub.label}</span>
                {selectedSubject === sub.id && (
                  <span className="hidden md:block w-1.5 h-1.5 bg-white rounded-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-6 lg:p-8 overflow-y-auto custom-scrollbar bg-slate-50/50 animate-fade-in">
          <div className="w-full max-w-[2000px]">
             
             {/* Header Controls */}
             <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
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
                        <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                            {getHeaderTitle()}
                        </h2>
                        <span className="font-mono text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200">
                            {displayedWorkshops.length} MODULES
                        </span>
                    </div>

                    {/* Grade Selector Strip (Only visible in Grade Mode) */}
                    {viewMode === 'grade' && (
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 custom-scrollbar max-w-full px-1">
                            {grades.map(g => (
                                <button
                                    key={g}
                                    onClick={() => setSelectedGrade(g)}
                                    className={`
                                      group relative px-3 py-1.5 flex items-center justify-center rounded-md text-[10px] font-bold transition-all duration-300 flex-shrink-0 uppercase tracking-wider border
                                      transform active:scale-95
                                      ${
                                        selectedGrade === g 
                                        ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200 translate-y-[-1px]' 
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'
                                      }
                                    `}
                                >
                                    <span className="relative z-10">Class {g}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Age Selector Strip (Only visible in Age Mode) */}
                    {viewMode === 'age' && (
                        <div className="flex items-center space-x-2 overflow-x-auto pb-2 pt-1 custom-scrollbar max-w-full px-1">
                            {ageRanges.map((range, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedAgeRange(range)}
                                    className={`
                                      group relative px-3 py-1.5 flex items-center justify-center rounded-md text-[10px] font-bold transition-all duration-300 flex-shrink-0 uppercase tracking-wider border
                                      transform active:scale-95
                                      ${
                                        selectedAgeRange.label === range.label
                                        ? 'bg-slate-800 border-slate-800 text-white shadow-lg shadow-slate-200 translate-y-[-1px]' 
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md'
                                      }
                                    `}
                                >
                                    <span className="relative z-10">{range.label}</span>
                                </button>
                            ))}
                        </div>
                    )}

                </div>

                {/* Search */}
                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={getPlaceholder()} 
                        className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 text-xs font-mono font-medium text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none transition-all placeholder-slate-400 uppercase tracking-wide rounded-sm shadow-sm"
                    />
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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

          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {enrollingWorkshop && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-slide-up relative">
                
                <div className="p-6">
                    {!enrollSuccess ? (
                        <>
                            <div className="mb-6">
                                <span className="text-indigo-600 font-mono text-[10px] tracking-widest uppercase font-bold">Enrolment Request</span>
                                <h3 className="text-xl font-display font-bold text-slate-900 mt-1">{enrollingWorkshop.title}</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    {enrollingWorkshop.duration}
                                </p>
                            </div>

                            <form onSubmit={handleEnrollSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Student Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input 
                                            type="text" 
                                            required
                                            value={enrollName}
                                            onChange={(e) => setEnrollName(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none rounded-lg transition-all"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5 font-bold">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input 
                                            type="tel" 
                                            required
                                            value={enrollPhone}
                                            onChange={(e) => setEnrollPhone(e.target.value)}
                                            className="w-full bg-slate-50 border border-slate-200 pl-10 pr-4 py-3 text-sm text-slate-900 focus:border-indigo-600 focus:ring-0 outline-none rounded-lg transition-all"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-lg hover:bg-indigo-600 transition-colors shadow-lg">
                                        Confirm Enrolment
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">Request Received</h3>
                            <p className="text-sm text-slate-600 px-4 leading-relaxed">
                                Thank you for submitting you will be getting a call back in next 5 mins.
                            </p>
                        </div>
                    )}
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
                     <button 
                        onClick={resetEnrollModal}
                        className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wide"
                     >
                        Close Window
                     </button>
                </div>
            </div>
        </div>
      )}

      {/* Experiments List Modal */}
      {viewingExperiments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-slide-up">
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
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/50">
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
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <span className="font-display text-sm tracking-tight text-slate-900 leading-none">
                houseof<span className="font-extrabold text-black">science</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workshops;