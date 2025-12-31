import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

// Magnetic button that follows cursor
export function MagneticButton({ children, className = '', strength = 30, onClick }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.button
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.button>
  );
}

// Glow card with hover effect
export function GlowCard({ children, className = '', glowColor = 'rgba(168,85,247,0.5)' }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  
  return (
    <motion.div
      ref={ref}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Border glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(200px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 40%)`,
        }}
      />
      
      {/* Content */}
      <div className="relative bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// Holographic card
export function HoloCard({ children, className = '' }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ref = useRef(null);
  
  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    setRotation({ x: y * 20, y: -x * 20 });
  };
  
  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setIsHovering(false);
  };
  
  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Holographic shine */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          animate={{
            opacity: isHovering ? 0.3 : 0,
          }}
        >
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(
                ${105 + rotation.y * 2}deg,
                transparent 20%,
                rgba(255,255,255,0.1) 35%,
                rgba(255,255,255,0.3) 40%,
                rgba(168,85,247,0.2) 45%,
                rgba(59,130,246,0.2) 50%,
                rgba(6,182,212,0.2) 55%,
                rgba(255,255,255,0.3) 60%,
                rgba(255,255,255,0.1) 65%,
                transparent 80%
              )`,
            }}
          />
        </motion.div>
        
        {children}
      </motion.div>
    </motion.div>
  );
}

// Ripple button
export function RippleButton({ children, className = '', onClick }) {
  const [ripples, setRipples] = useState([]);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
    
    onClick?.(e);
  };
  
  return (
    <button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 500, height: 500, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      {children}
    </button>
  );
}

// Animated border card
export function AnimatedBorderCard({ children, className = '' }) {
  return (
    <div className={`relative group ${className}`}>
      {/* Animated border */}
      <div 
        className="absolute -inset-[1px] rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(90deg, #a855f7, #3b82f6, #06b6d4, #a855f7)',
          backgroundSize: '300% 100%',
          animation: 'borderFlow 3s linear infinite',
          opacity: 0.5,
        }}
      />
      
      {/* Inner content */}
      <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-[1px]">
        {children}
      </div>
    </div>
  );
}

// Floating element
export function FloatingElement({ children, className = '', amplitude = 10, duration = 3 }) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Pulse ring effect
export function PulseRings({ className = '', color = 'rgba(168,85,247,0.3)' }) {
  return (
    <div className={`absolute inset-0 flex items-center justify-center ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{ borderColor: color }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: [0, 200],
            height: [0, 200],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Particle burst on hover
export function ParticleBurst({ children, className = '' }) {
  const [particles, setParticles] = useState([]);
  
  const handleMouseEnter = () => {
    const newParticles = Array(12).fill(null).map((_, i) => ({
      id: Date.now() + i,
      angle: (i / 12) * 360,
    }));
    setParticles(newParticles);
    
    setTimeout(() => setParticles([]), 800);
  };
  
  return (
    <div className={`relative ${className}`} onMouseEnter={handleMouseEnter}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-purple-400 top-1/2 left-1/2"
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * 50,
            y: Math.sin((p.angle * Math.PI) / 180) * 50,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      {children}
    </div>
  );
}
