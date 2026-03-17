
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-indigo-50/30 py-12 min-h-full flex flex-col">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex-grow flex flex-col justify-center animate-fade-in">
        <div className="grid md:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-6">
              Join The <br/> <span className="text-indigo-600">House.</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-md mb-12 font-normal leading-relaxed">
              From single-module workshops for curious individuals to full-scale science curriculums for schools. We adapt to your requirements.
            </p>

            <div className="space-y-6">
               <div className="group flex items-baseline justify-between border-b border-slate-200 py-6 cursor-pointer hover:border-indigo-600 transition-colors gap-4">
                  <span className="text-slate-500 group-hover:text-indigo-700 transition-colors font-medium shrink-0 text-sm">General Inquiries</span>
                  <div className="flex flex-col items-end text-right">
                     <span className="text-slate-900 font-mono text-xs sm:text-sm">abhishek.houseofscience@gmail.com</span>
                     <span className="text-slate-900 font-mono text-xs sm:text-sm">+91 97123 30808</span>
                  </div>
               </div>
               <div className="group flex items-baseline justify-between border-b border-slate-200 py-6 cursor-pointer hover:border-indigo-600 transition-colors gap-4">
                  <span className="text-slate-500 group-hover:text-indigo-700 transition-colors font-medium shrink-0 text-sm">Location</span>
                  <div className="flex flex-col items-end text-right">
                     <span className="text-slate-900 font-mono text-xs sm:text-sm">Ahmedabad, Gujarat, India</span>
                     <a 
                        href="https://www.google.com/maps/search/House+of+Science+Ahmedabad" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 text-xs font-mono mt-1 flex items-center group/link"
                     >
                        View on Google Maps
                        <ArrowUpRight className="w-3 h-3 ml-1 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                     </a>
                  </div>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-slate-100 rounded-xl shadow-lg shadow-indigo-100/50">
            <form className="space-y-6">
                <div>
                   <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 font-semibold">Name</label>
                   <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:border-indigo-600 focus:ring-0 transition-colors outline-none rounded-md" placeholder="Full Name" />
                </div>
                <div>
                   <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 font-semibold">Email Address</label>
                   <input type="email" className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:border-indigo-600 focus:ring-0 transition-colors outline-none rounded-md" placeholder="Email Address" />
                </div>
                <div>
                   <label className="block text-xs font-mono text-slate-500 uppercase tracking-widest mb-2 font-semibold">Message</label>
                   <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:border-indigo-600 focus:ring-0 transition-colors resize-none outline-none rounded-md" placeholder="Tell us about your requirements (Individual or School)..."></textarea>
                </div>
                <button className="w-full bg-indigo-600 text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md rounded-md">
                   Send Message
                </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;