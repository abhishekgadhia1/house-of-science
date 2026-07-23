import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm p-6 text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-display font-bold text-slate-900 mb-2">
              Features Upgrade
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
              Site is undergoing some features upgrade, come back in a few minutes
            </p>

            <button
              onClick={onClose}
              className="w-full bg-slate-900 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl hover:bg-indigo-600 transition-colors shadow-md"
            >
              Okay
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UpgradeModal;
