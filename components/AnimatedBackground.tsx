
import React from 'react';
import { motion } from 'framer-motion';

const FloatingShape = ({ color, size, initialPos, duration }: any) => (
  <motion.div
    animate={{
      x: [0, 30, -20, 0],
      y: [0, -40, 20, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 0.9, 1],
    }}
    transition={{
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="absolute rounded-full blur-3xl opacity-30 pointer-events-none"
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      left: initialPos.x,
      top: initialPos.y,
    }}
  />
);

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-black">
      {/* Zaple Blobs */}
      <FloatingShape color="#330086" size={400} initialPos={{ x: '-10%', y: '10%' }} duration={15} />
      <FloatingShape color="#240040" size={500} initialPos={{ x: '60%', y: '60%' }} duration={20} />
      <FloatingShape color="#9A5BFF" size={200} initialPos={{ x: '20%', y: '80%' }} duration={12} />

      {/* Decorative Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <motion.path
          d="M -100 200 Q 150 50 400 300 T 900 100"
          stroke="#89D0D4"
          strokeWidth="2"
          fill="none"
          animate={{ d: ["M -100 200 Q 150 50 400 300 T 900 100", "M -100 250 Q 150 300 400 150 T 900 250", "M -100 200 Q 150 50 400 300 T 900 100"] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.circle
          cx="80%" cy="20%" r="40"
          stroke="#9A5BFF" strokeWidth="1" fill="none"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
