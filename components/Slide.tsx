
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
          
          {/* Logo de Zaple - Imagen PNG */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-[120] opacity-90">
            <img 
              src="zaple-logo.png" 
              alt="Zaple" 
              className="h-8 w-auto object-contain"
              onError={(e) => {
                // Fallback por si la imagen no existe aún
                e.currentTarget.style.display = 'none';
              }}
            />
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
