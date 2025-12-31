import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

// Split text reveal animation
export function TextReveal({ children, className = '', delay = 0, stagger = 0.03 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const text = typeof children === 'string' ? children : '';
  const words = text.split(' ');
  
  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-2 overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + wordIndex * stagger,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Character by character reveal
export function CharReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const text = typeof children === 'string' ? children : '';
  const chars = text.split('');
  
  return (
    <span ref={ref} className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
          transition={{
            duration: 0.35,
            delay: delay + i * 0.02,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// Glitch text effect
export function GlitchText({ children, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute inset-0 text-cyan-500 opacity-70"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
          transform: 'translateX(-2px)',
          animation: 'glitch1 2.5s infinite linear alternate-reverse',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      <span 
        className="absolute inset-0 text-pink-500 opacity-70"
        style={{
          clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
          transform: 'translateX(2px)',
          animation: 'glitch2 3s infinite linear alternate-reverse',
        }}
        aria-hidden="true"
      >
        {children}
      </span>
    </span>
  );
}

// Typewriter effect
export function TypeWriter({ children, className = '', speed = 50, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  const text = typeof children === 'string' ? children : '';
  const chars = text.split('');
  
  return (
    <span ref={ref} className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.01,
            delay: delay + (i * speed) / 1000,
          }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="inline-block w-0.5 h-5 bg-purple-400 ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  );
}

// Gradient flowing text
export function GradientText({ children, className = '' }) {
  return (
    <span 
      className={`bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-[length:200%_auto] ${className}`}
      style={{
        animation: 'gradientFlow 3s linear infinite',
      }}
    >
      {children}
    </span>
  );
}

// Shimmer text effect
export function ShimmerText({ children, className = '' }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{children}</span>
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        style={{
          animation: 'shimmer 2s infinite',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black, transparent)',
        }}
      />
    </span>
  );
}

// Fade slide in from direction
export function FadeSlide({ 
  children, 
  className = '', 
  direction = 'up', 
  delay = 0,
  duration = 0.6 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const directions = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        ...directions[direction],
        filter: 'blur(10px)',
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        x: 0,
        filter: 'blur(0px)',
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale reveal
export function ScaleReveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ 
        opacity: 0, 
        scale: 0.8,
        filter: 'blur(20px)',
      }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1,
        filter: 'blur(0px)',
      } : {}}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

// Stagger children animation
export function StaggerContainer({ children, className = '', stagger = 0.1, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};
