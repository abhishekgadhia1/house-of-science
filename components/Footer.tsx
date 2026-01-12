import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-zinc-100 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3 mb-8 md:mb-0">
             <span className="font-display text-xl tracking-tight text-black">
                houseof<span className="font-extrabold">science</span>
             </span>
        </div>
        
        <div className="flex space-x-8 text-xs font-mono text-zinc-500 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Legal</a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-8 text-center md:text-left">
        <p className="text-[10px] text-zinc-400 font-mono">
            © {new Date().getFullYear()} houseofscience inc. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
};

export default Footer;