
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
               <div className="group flex items-center justify-between border-b border-slate-200 py-6 cursor-pointer hover:border-indigo-600 transition-colors">
                  <span className="text-slate-500 group-hover:text-indigo-700 transition-colors font-medium">General Inquiries</span>
                  <span className="text-slate-900 font-mono text-sm">hello@houseofscience.com</span>
               </div>
               <div className="group flex items-center justify-between border-b border-slate-200 py-6 cursor-pointer hover:border-indigo-600 transition-colors">
                  <span className="text-slate-500 group-hover:text-indigo-700 transition-colors font-medium">HQ Location</span>
                  <span className="text-slate-900 font-mono text-sm">San Francisco, CA</span>
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
                   <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 p-4 text-slate-900 focus:border-indigo-600 focus:ring-0 transition-colors resize-none outline-none rounded-md" placeholder="Tell us about your needs (Individual or School)..."></textarea>
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