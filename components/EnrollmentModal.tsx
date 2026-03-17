import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, ChevronRight, Trash2, BookOpen, CheckCircle2 } from 'lucide-react';
import { RAW_WORKSHOPS } from '../data/curriculum';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedTopic {
  id: string;
  subject: string;
  topic: string;
  price: number;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose }) => {
  const [studentName, setStudentName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('');
  const [selectedTopicTitle, setSelectedTopicTitle] = useState<string>('');
  const [cart, setCart] = useState<SelectedTopic[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjects = useMemo(() => {
    const cats = RAW_WORKSHOPS.map(w => w.cat);
    return Array.from(new Set(cats)).sort();
  }, []);

  const availableGrades = useMemo(() => {
    if (!selectedSubject) return [];
    const grades = RAW_WORKSHOPS
      .filter(w => w.cat === selectedSubject)
      .map(w => w.grade.toString());
    return Array.from(new Set(grades)).sort((a, b) => parseInt(a) - parseInt(b));
  }, [selectedSubject]);

  const availableTopics = useMemo(() => {
    if (!selectedSubject || !selectedGrade) return [];
    return RAW_WORKSHOPS
      .filter(w => w.cat === selectedSubject && w.grade.toString() === selectedGrade)
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [selectedSubject, selectedGrade]);

  const handleAddTopic = () => {
    if (!selectedSubject || !selectedGrade || !selectedTopicTitle) return;
    
    const workshop = RAW_WORKSHOPS.find(w => 
      w.cat === selectedSubject && 
      w.grade.toString() === selectedGrade && 
      w.title === selectedTopicTitle
    );
    if (!workshop) return;

    const newId = `${selectedSubject}-${selectedGrade}-${selectedTopicTitle}-${Date.now()}`;
    setCart([...cart, {
      id: newId,
      subject: selectedSubject,
      topic: selectedTopicTitle,
      price: workshop.price
    }]);

    // Reset selection
    setSelectedTopicTitle('');
  };

  const handleRemoveTopic = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !studentName || !mobileNumber) return;
    setIsSubmitted(true);
    // In a real app, we'd send this to a backend
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] max-h-[800px]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>

          {isSubmitted ? (
            <div className="flex-grow flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Enrolment Received</h2>
              <p className="text-slate-600 max-w-md mb-2">
                Thank you, <span className="font-bold text-slate-900">{studentName}</span>!
              </p>
              <p className="text-slate-600 max-w-md mb-8">
                Our admissions team will contact you at <span className="font-bold text-slate-900">{mobileNumber}</span> within 24 hours to finalize your schedule and payment details.
              </p>
              <button 
                onClick={onClose}
                className="bg-black text-white px-8 py-3 font-bold uppercase tracking-widest text-xs hover:bg-indigo-600 transition-all"
              >
                Return to Site
              </button>
            </div>
          ) : (
            <>
              {/* Left Side: Selection Form */}
              <div className="w-full md:w-1/2 p-8 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto custom-scrollbar">
                <div className="flex items-center space-x-3 mb-8">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-2xl font-display font-bold text-slate-900">Enrolment Details</h2>
                </div>

                <div className="space-y-6">
                  {/* Personal Info Section */}
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 font-mono text-sm focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter 10-digit number"
                        className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 font-mono text-sm focus:border-indigo-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 my-8" />

                  {/* Subject Dropdown */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                      01. Select Subject
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        setSelectedGrade('');
                        setSelectedTopicTitle('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 font-mono text-sm focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- CHOOSE SUBJECT --</option>
                      {subjects.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>

                  {/* Grade Dropdown */}
                  <div className={!selectedSubject ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                      02. Select Grade
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => {
                        setSelectedGrade(e.target.value);
                        setSelectedTopicTitle('');
                      }}
                      className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 font-mono text-sm focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- CHOOSE GRADE --</option>
                      {availableGrades.map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>

                  {/* Topic Dropdown */}
                  <div className={!selectedGrade ? 'opacity-50 pointer-events-none' : ''}>
                    <label className="block text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-2">
                      03. Select Topic
                    </label>
                    <select
                      value={selectedTopicTitle}
                      onChange={(e) => setSelectedTopicTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 font-mono text-sm focus:border-indigo-600 outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">-- CHOOSE TOPIC --</option>
                      {availableTopics.map(topic => (
                        <option key={topic.title} value={topic.title}>
                          {topic.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddTopic}
                    disabled={!selectedSubject || !selectedGrade || !selectedTopicTitle}
                    className="w-full bg-indigo-600 text-white font-bold uppercase tracking-widest py-4 text-xs hover:bg-indigo-700 transition-all disabled:opacity-50 flex justify-center items-center group"
                  >
                    Add to Enrolment
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-lg">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Need Help?</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Not sure which topic fits your grade level? Our curriculum is designed for grades 5-12. Contact us for a personalized assessment.
                  </p>
                </div>
              </div>

              {/* Right Side: Cart Summary */}
              <div className="w-full md:w-1/2 bg-slate-50 p-8 md:p-12 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <ShoppingCart className="w-6 h-6 text-slate-900" />
                    <h2 className="text-2xl font-display font-bold text-slate-900">Enrolment Cart</h2>
                  </div>
                  <span className="bg-slate-200 text-slate-700 px-3 py-1 text-[10px] font-bold rounded-full">
                    {cart.length} ITEMS
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 mb-8">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                      <div className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 opacity-20" />
                      </div>
                      <p className="text-xs uppercase tracking-widest font-bold">Cart is Empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          key={item.id}
                          className="bg-white p-4 border border-slate-200 flex justify-between items-center group"
                        >
                          <div>
                            <p className="text-[10px] font-mono font-bold text-indigo-600 uppercase tracking-tighter mb-0.5">
                              {item.subject}
                            </p>
                            <h4 className="text-sm font-bold text-slate-900">{item.topic}</h4>
                            <p className="text-xs text-slate-500 mt-1">₹{item.price}</p>
                          </div>
                          <button 
                            onClick={() => handleRemoveTopic(item.id)}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer / Total */}
                <div className="border-t border-slate-200 pt-8 mt-auto">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-3xl font-display font-bold text-slate-900">₹{totalPrice}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 max-w-[120px] text-right leading-tight">
                      * Final pricing may vary based on batch size and schedule.
                    </p>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={cart.length === 0 || !studentName || !mobileNumber}
                    className="w-full bg-black text-white font-bold uppercase tracking-widest py-5 text-xs hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-xl"
                  >
                    Complete Enrolment
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EnrollmentModal;
