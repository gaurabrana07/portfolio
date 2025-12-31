import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

// Detect if device is touch-only (mobile/tablet)
const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(hover: none)').matches
  );
};

export default function CursorEffect() {
  const [isMobile, setIsMobile] = useState(true); // Default to true to prevent flash
  
  useEffect(() => {
    setIsMobile(isTouchDevice());
  }, []);
  
  // Don't render anything on mobile/touch devices
  if (isMobile) return null;
  
  return <DesktopCursor />;
}

function DesktopCursor() {
  const cursorRef = useRef(null);
  const trailRefs = useRef([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [ripples, setRipples] = useState([]);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = (e) => {
      setIsClicking(true);
      // Add ripple effect
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev, newRipple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full border border-white/50"
          animate={{
            width: isHovering ? 60 : isClicking ? 20 : 40,
            height: isHovering ? 60 : isClicking ? 20 : 40,
            x: isHovering ? -30 : isClicking ? -10 : -20,
            y: isHovering ? -30 : isClicking ? -10 : -20,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
        
        {/* Inner dot */}
        <motion.div
          className="absolute w-1.5 h-1.5 bg-white rounded-full"
          style={{ x: -3, y: -3 }}
          animate={{
            scale: isClicking ? 2 : 1,
          }}
        />
      </motion.div>

      {/* Glow trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <div
          className="absolute w-32 h-32 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(59,130,246,0.2) 40%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(10px)',
          }}
        />
      </motion.div>

      {/* Click ripples */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9997]"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className="w-20 h-20 rounded-full border-2 border-neon-purple/50"
            style={{ transform: 'translate(-50%, -50%)' }}
          />
        </motion.div>
      ))}
    </>
  );
}
