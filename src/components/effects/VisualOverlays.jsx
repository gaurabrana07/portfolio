import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

// Film grain overlay effect
export function FilmGrain() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        animation: 'grain 0.5s steps(10) infinite',
      }}
    />
  );
}

// Scanlines effect (very subtle)
export function Scanlines() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[99] opacity-[0.02]"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        )`,
      }}
    />
  );
}

// Vignette overlay
export function Vignette() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[98]"
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(0,0,0,0.4) 100%)`,
      }}
    />
  );
}

// Chromatic aberration on edges
export function ChromaticAberration() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[97] overflow-hidden">
      {/* Left edge */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-8"
        style={{
          background: 'linear-gradient(to right, rgba(255,0,0,0.03), transparent)',
        }}
      />
      {/* Right edge */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-8"
        style={{
          background: 'linear-gradient(to left, rgba(0,255,255,0.03), transparent)',
        }}
      />
    </div>
  );
}

// Ambient glow pulses
export function AmbientGlows() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[96] overflow-hidden">
      {/* Purple glow */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
          left: '10%',
          top: '20%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Blue glow */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
          right: '15%',
          top: '40%',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      
      {/* Cyan glow */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          left: '60%',
          bottom: '20%',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 20, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  );
}

// Grid overlay (very subtle)
export function GridOverlay() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[95] opacity-[0.015]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(168,85,247,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(168,85,247,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '100px 100px',
      }}
    />
  );
}

// Floating particles (2D layer)
export function FloatingParticles2D() {
  const particles = Array(30).fill(null).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-[94] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

// All overlays combined (optimized for mobile)
export function PremiumOverlays() {
  const isMobile = useIsMobile();
  
  // On mobile, show only essential lightweight overlays
  if (isMobile) {
    return (
      <>
        <Vignette />
      </>
    );
  }
  
  return (
    <>
      <AmbientGlows />
      <GridOverlay />
      <FloatingParticles2D />
      <Vignette />
      <ChromaticAberration />
      <Scanlines />
      <FilmGrain />
    </>
  );
}

// Add keyframes for grain animation
export const grainKeyframes = `
  @keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -10%); }
    20% { transform: translate(-15%, 5%); }
    30% { transform: translate(7%, -25%); }
    40% { transform: translate(-5%, 25%); }
    50% { transform: translate(-15%, 10%); }
    60% { transform: translate(15%, 0%); }
    70% { transform: translate(0%, 15%); }
    80% { transform: translate(3%, 35%); }
    90% { transform: translate(-10%, 10%); }
  }
`;
