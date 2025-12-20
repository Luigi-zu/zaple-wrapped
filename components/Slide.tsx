
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

interface SlideProps {
  children: React.ReactNode;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ children, isActive }) => {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="absolute inset-0 w-full h-full flex flex-col justify-center items-center p-8 bg-black overflow-hidden font-urbanist"
        >
          <AnimatedBackground />
          <div className="relative z-10 w-full h-full flex flex-col justify-center">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Slide;
