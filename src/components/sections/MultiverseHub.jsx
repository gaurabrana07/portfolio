import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../../data/portfolioData';

// Cinematic text reveal - letter by letter
function CinematicName({ name, onComplete }) {
  const letters = name.split('');
  
  return (
    <motion.div className="relative">
      {/* Background glow pulse */}
      <motion.div
        className="absolute inset-0 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0.1] }}
        transition={{ duration: 2, delay: 0.5 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.4) 0%, transparent 70%)',
        }}
      />
      
      <div className="relative flex justify-center items-center gap-1 md:gap-2 flex-wrap">
        {letters.map((letter, index) => (
          <motion.span
            key={index}
            className="font-cosmic text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold inline-block"
            initial={{ 
              opacity: 0, 
              y: 100,
              rotateX: -90,
              filter: 'blur(20px)',
            }}
            animate={{ 
              opacity: 1, 
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
            }}
            transition={{ 
              duration: 0.8,
              delay: 0.8 + index * 0.08,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onAnimationComplete={() => {
              if (index === letters.length - 1) onComplete?.();
            }}
            style={{
              textShadow: letter === ' ' ? 'none' : '0 0 40px rgba(168,85,247,0.5), 0 0 80px rgba(168,85,247,0.3)',
              background: 'linear-gradient(180deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        ))}
      </div>
      
      {/* Underline sweep */}
      <motion.div
        className="h-[2px] mt-4 mx-auto"
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: '100%', opacity: 1 }}
        transition={{ duration: 1.5, delay: 2.2, ease: 'easeOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent, #a855f7, #3b82f6, #06b6d4, transparent)',
        }}
      />
    </motion.div>
  );
}

// Glitch effect text
function GlitchReveal({ children, delay = 0 }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1, delay }}
    >
      {/* Glitch layers */}
      <motion.span
        className="absolute inset-0 text-red-500/30"
        animate={{
          x: [0, -3, 2, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 0.3,
          delay: delay,
          times: [0, 0.33, 0.66, 1],
        }}
      >
        {children}
      </motion.span>
      <motion.span
        className="absolute inset-0 text-cyan-500/30"
        animate={{
          x: [0, 3, -2, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 0.3,
          delay: delay,
          times: [0, 0.33, 0.66, 1],
        }}
      >
        {children}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.2 }}
      >
        {children}
      </motion.span>
    </motion.div>
  );
}

// Typewriter effect
function TypewriterText({ text, delay = 0, speed = 0.05, className = '' }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayedText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, speed * 1000);
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [text, delay, speed]);
  
  return (
    <span className={className}>
      {displayedText}
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 align-middle"
        animate={{ opacity: showCursor ? [1, 0] : 0 }}
        transition={{ duration: 0.5, repeat: showCursor ? Infinity : 0 }}
      />
    </span>
  );
}

// Animated border frame
function AnimatedFrame() {
  return (
    <div className="absolute inset-8 md:inset-12 pointer-events-none">
      {/* Top left */}
      <motion.div
        className="absolute top-0 left-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.5 }}
      >
        <motion.div
          className="w-20 md:w-32 h-[1px] bg-gradient-to-r from-purple-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 3.5 }}
          style={{ transformOrigin: 'left' }}
        />
        <motion.div
          className="w-[1px] h-20 md:h-32 bg-gradient-to-b from-purple-500 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 3.7 }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
      
      {/* Top right */}
      <motion.div
        className="absolute top-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.6 }}
      >
        <motion.div
          className="w-20 md:w-32 h-[1px] bg-gradient-to-l from-cyan-500 to-transparent ml-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 3.6 }}
          style={{ transformOrigin: 'right' }}
        />
        <motion.div
          className="w-[1px] h-20 md:h-32 bg-gradient-to-b from-cyan-500 to-transparent ml-auto"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 3.8 }}
          style={{ transformOrigin: 'top' }}
        />
      </motion.div>
      
      {/* Bottom left */}
      <motion.div
        className="absolute bottom-0 left-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.7 }}
      >
        <motion.div
          className="w-[1px] h-20 md:h-32 bg-gradient-to-t from-blue-500 to-transparent"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 3.7 }}
          style={{ transformOrigin: 'bottom' }}
        />
        <motion.div
          className="w-20 md:w-32 h-[1px] bg-gradient-to-r from-blue-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 3.9 }}
          style={{ transformOrigin: 'left' }}
        />
      </motion.div>
      
      {/* Bottom right */}
      <motion.div
        className="absolute bottom-0 right-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.8 }}
      >
        <motion.div
          className="w-[1px] h-20 md:h-32 bg-gradient-to-t from-emerald-500 to-transparent ml-auto"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 3.8 }}
          style={{ transformOrigin: 'bottom' }}
        />
        <motion.div
          className="w-20 md:w-32 h-[1px] bg-gradient-to-l from-emerald-500 to-transparent ml-auto"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 4 }}
          style={{ transformOrigin: 'right' }}
        />
      </motion.div>
    </div>
  );
}

// Floating code snippets background
function FloatingCodeSnippets() {
  const codeSnippets = [
    'const future = await dream();',
    'if (passion) { create(); }',
    'return innovation;',
    'while(true) { learn(); }',
    '// Building tomorrow',
    'export default success;',
    'npm run create-magic',
    '<Innovation />',
    'git commit -m "legacy"',
    'async function buildDreams()',
  ];
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {codeSnippets.map((code, i) => (
        <motion.div
          key={i}
          className="absolute font-mono text-xs md:text-sm text-white/[0.03] whitespace-nowrap"
          style={{
            left: `${(i * 17) % 100}%`,
            top: `${(i * 23) % 100}%`,
          }}
          initial={{ opacity: 0, x: -50 }}
          animate={{ 
            opacity: [0, 0.03, 0.03, 0],
            x: [0, 100],
          }}
          transition={{
            duration: 20 + i * 2,
            delay: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {code}
        </motion.div>
      ))}
    </div>
  );
}

// Particle burst effect
function ParticleBurst({ trigger }) {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        angle: (i / 50) * Math.PI * 2,
        speed: 100 + Math.random() * 200,
        size: 2 + Math.random() * 4,
        color: ['#a855f7', '#3b82f6', '#06b6d4', '#10b981'][Math.floor(Math.random() * 4)],
      }));
      setParticles(newParticles);
    }
  }, [trigger]);
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 10px ${p.color}`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(p.angle) * p.speed,
              y: Math.sin(p.angle) * p.speed,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Main Hub Component
export default function MultiverseHub({ onEnter, onRecruiterMode }) {
  const [stage, setStage] = useState(0);
  const [nameComplete, setNameComplete] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  
  // Progression stages
  useEffect(() => {
    const timers = [
      setTimeout(() => setStage(1), 500),    // Show intro text
      setTimeout(() => setStage(2), 800),    // Start name animation
      setTimeout(() => setShowBurst(true), 2500), // Particle burst when name complete
      setTimeout(() => setStage(3), 3000),   // Show title
      setTimeout(() => setStage(4), 4000),   // Show tagline
      setTimeout(() => setStage(5), 5000),   // Show buttons
      setTimeout(() => setStage(6), 5500),   // Show scroll hint
    ];
    
    return () => timers.forEach(clearTimeout);
  }, []);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Animated border frame */}
      <AnimatedFrame />
      
      {/* Background code snippets */}
      <FloatingCodeSnippets />
      
      {/* Particle burst */}
      <ParticleBurst trigger={showBurst} />
      
      {/* Ambient animated gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
            left: '20%',
            top: '30%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
          style={{
            background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)',
            right: '20%',
            bottom: '30%',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-10"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            left: '50%',
            top: '60%',
            transform: 'translateX(-50%)',
          }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        
        {/* Stage 1: Intro text */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-4 text-white/40 text-xs md:text-sm font-mono tracking-[0.3em] uppercase"
              >
                <motion.span
                  className="w-8 md:w-12 h-[1px] bg-gradient-to-r from-transparent to-purple-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
                <span>INITIALIZING PORTFOLIO</span>
                <motion.span
                  className="w-8 md:w-12 h-[1px] bg-gradient-to-l from-transparent to-cyan-500"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 2: Name with cinematic reveal */}
        {stage >= 2 && (
          <div className="mb-8 md:mb-12">
            <CinematicName 
              name={personalInfo.name} 
              onComplete={() => setNameComplete(true)}
            />
          </div>
        )}

        {/* Stage 3: Title with typewriter */}
        <AnimatePresence>
          {stage >= 3 && (
            <motion.div
              className="mb-8 md:mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <motion.div
                  className="w-12 md:w-24 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, transparent, #a855f7)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                />
                <motion.span
                  className="text-2xl md:text-3xl"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                >
                  ⚡
                </motion.span>
                <motion.div
                  className="w-12 md:w-24 h-[1px]"
                  style={{ background: 'linear-gradient(90deg, #06b6d4, transparent)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
              
              <div className="font-space text-lg md:text-xl lg:text-2xl text-white/80 tracking-[0.2em] uppercase">
                <GlitchReveal delay={0.2}>
                  <TypewriterText 
                    text={personalInfo.title} 
                    delay={0.3} 
                    speed={0.06}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-emerald-400"
                  />
                </GlitchReveal>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 4: Tagline */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              className="mb-12 md:mb-16 space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.p 
                className="font-space text-xl md:text-2xl lg:text-3xl font-light text-white/90"
                initial={{ opacity: 0, letterSpacing: '0.3em' }}
                animate={{ opacity: 1, letterSpacing: '0.05em' }}
                transition={{ duration: 1 }}
              >
                <span className="text-white/40">"</span>
                {personalInfo.tagline}
                <span className="text-white/40">"</span>
              </motion.p>
              
              <motion.p 
                className="font-space text-sm md:text-base text-cyan-400/70 tracking-wide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {personalInfo.subTagline}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 5: Action Buttons */}
        <AnimatePresence>
          {stage >= 5 && (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Enter Multiverse Button */}
              <motion.button
                onClick={onEnter}
                className="group relative px-8 md:px-12 py-4 md:py-5 overflow-hidden rounded-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #a855f7, #3b82f6, #06b6d4, #10b981, #a855f7)',
                    backgroundSize: '300% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
                
                {/* Inner background */}
                <div className="absolute inset-[2px] bg-black/90 rounded-full" />
                
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 30px rgba(168,85,247,0.5), 0 0 60px rgba(59,130,246,0.3)',
                  }}
                />
                
                <span className="relative z-10 flex items-center gap-3 font-cosmic text-sm md:text-base tracking-[0.2em] text-white">
                  <motion.span
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🚀
                  </motion.span>
                  <span>ENTER MULTIVERSE</span>
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>

              {/* Recruiter Mode Button */}
              <motion.button
                onClick={onRecruiterMode}
                className="group relative px-6 md:px-8 py-3 md:py-4 font-cosmic text-xs md:text-sm tracking-[0.15em] text-white/60 border border-white/20 rounded-full overflow-hidden hover:text-amber-400 hover:border-amber-400/50 transition-all duration-500"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Ripple effect background */}
                <motion.div
                  className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                
                <span className="relative z-10 flex items-center gap-2 md:gap-3">
                  <span>📋</span>
                  <span>RECRUITER MODE</span>
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 6: Social Links */}
        <AnimatePresence>
          {stage >= 6 && (
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/70 hover:fill-white transition-colors">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/70 hover:fill-white transition-colors">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a
                href={personalInfo.social.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-orange-500/50 hover:bg-orange-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-lg">🏆</span>
              </motion.a>
              <motion.a
                href={personalInfo.resumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                title="Download Resume"
              >
                <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 7: Scroll hint */}
        <AnimatePresence>
          {stage >= 6 && (
            <motion.div
              className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="flex flex-col items-center text-white/30 hover:text-white/50 transition-colors cursor-pointer"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] mb-2 uppercase">
                  Explore the Universe
                </span>
                <motion.div
                  className="w-5 h-8 border border-white/30 rounded-full flex justify-center pt-2"
                >
                  <motion.div
                    className="w-1 h-2 bg-white/50 rounded-full"
                    animate={{ y: [0, 8, 0], opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating particles - optimized */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              background: i % 4 === 0 ? '#a855f7' : i % 4 === 1 ? '#3b82f6' : i % 4 === 2 ? '#06b6d4' : '#10b981',
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.4, 0],
              y: [0, -80, -160],
              x: [0, Math.random() * 40 - 20, Math.random() * 60 - 30],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: 3 + Math.random() * 5,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Horizontal scanning line */}
        <motion.div
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"
          initial={{ top: '-10%' }}
          animate={{ top: '110%' }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
        />
        
        {/* Vertical accent lines */}
        <motion.div
          className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent"
          style={{ left: '10%' }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"
          style={{ right: '10%' }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>
    </div>
  );
}
