
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground.tsx';

interface SlideProps {
  children: React.ReactNode;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ children, isActive }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-6 bg-black overflow-hidden font-urbanist"
        >
          <AnimatedBackground />
          
          {/* Logo de Zaple - Siempre presente */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[120] opacity-80">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-gradient-to-tr from-[#FF00E5] to-[#46DEFF] rounded-md rotate-12" />
               <span className="font-jakarta font-black tracking-tighter text-xl">Zaple</span>
            </div>
          </div>

          <div className="relative z-10 w-full h-full flex flex-col justify-center">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Slide;
