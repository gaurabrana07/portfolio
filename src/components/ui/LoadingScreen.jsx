import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing quantum core...');
  
  const statusMessages = [
    'Initializing quantum core...',
    'Calibrating neural networks...',
    'Loading multiverse coordinates...',
    'Synchronizing dimensional gates...',
    'Preparing cosmic interface...',
    'Activating stellar systems...',
    'Ready for launch...',
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 20 + 10;
      });
    }, 200);

    const statusInterval = setInterval(() => {
      setStatusText(statusMessages[Math.floor(Math.random() * statusMessages.length)]);
    }, 400);

    return () => {
      clearInterval(progressInterval);
      clearInterval(statusInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000005] overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-600/5 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Animated cosmic loader */}
      <div className="relative w-40 h-40">
        {/* Outer glowing ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, #a855f7, transparent)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Outer ring border */}
        <motion.div
          className="absolute inset-1 rounded-full border border-purple-500/30 backdrop-blur-sm"
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle glowing ring */}
        <motion.div
          className="absolute inset-4 rounded-full"
          style={{
            background: 'conic-gradient(from 180deg, transparent, #3b82f6, transparent)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Middle ring border */}
        <motion.div
          className="absolute inset-5 rounded-full border border-blue-500/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Inner glowing ring */}
        <motion.div
          className="absolute inset-8 rounded-full"
          style={{
            background: 'conic-gradient(from 90deg, transparent, #06b6d4, transparent)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Core background */}
        <div className="absolute inset-12 rounded-full bg-black/50 backdrop-blur-xl" />
        
        {/* Core energy pulse */}
        <motion.div
          className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500"
          animate={{ 
            scale: [0.8, 1, 0.8],
            opacity: [0.4, 0.8, 0.4]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Core bright center */}
        <motion.div
          className="absolute inset-14 rounded-full bg-white"
          animate={{ 
            opacity: [0.6, 1, 0.6],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Orbiting particles - reduced count for performance */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#3b82f6' : '#06b6d4',
              top: '50%',
              left: '50%',
              boxShadow: `0 0 8px ${i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#3b82f6' : '#06b6d4'}`,
            }}
            animate={{
              x: Math.cos(i * Math.PI / 3) * 65 + 'px',
              y: Math.sin(i * Math.PI / 3) * 65 + 'px',
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      {/* Loading text and progress */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="font-cosmic text-xl tracking-[0.3em] text-white/90 mb-6">
          MULTIVERSE
        </h2>
        
        {/* Progress bar container */}
        <div className="relative w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: [-256, 256] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        {/* Status text */}
        <motion.p
          key={statusText}
          className="text-white/50 font-space text-xs tracking-wider h-4"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {statusText}
        </motion.p>
      </motion.div>
      
      {/* Bottom tagline */}
      <motion.p
        className="absolute bottom-8 text-white/30 font-space text-[10px] tracking-[0.5em] uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Gaurab Rana • Portfolio
      </motion.p>

      {/* Corner decorations */}
      <div className="absolute top-6 left-6 w-12 h-12 border-l border-t border-white/10" />
      <div className="absolute top-6 right-6 w-12 h-12 border-r border-t border-white/10" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-l border-b border-white/10" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-r border-b border-white/10" />
    </div>
  );
}

