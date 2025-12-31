import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { journeyData } from '../../data/portfolioData';

// Card Content Component
function CardContent({ event, style, isExpanded, setIsExpanded }) {
  return (
    <motion.div
      className={`glass rounded-2xl p-4 md:p-6 cursor-pointer relative overflow-hidden ${
        event.milestone ? style.glow : ''
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
      whileHover={{ scale: 1.02 }}
      style={{
        borderColor: event.milestone ? `${style.color}50` : 'transparent',
        borderWidth: '1px',
      }}
    >
      {/* Glow overlay for milestones */}
      {event.milestone && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(circle at center, ${style.color}, transparent 70%)`,
          }}
        />
      )}

      <div className="relative">
        {/* Year badge */}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-cosmic mb-3"
          style={{
            backgroundColor: `${style.color}20`,
            color: style.color,
            border: `1px solid ${style.color}40`,
          }}
        >
          {event.year}
        </div>

        {/* Title */}
        <h3
          className="font-cosmic text-lg md:text-xl mb-2"
          style={{ color: style.color }}
        >
          {event.title}
        </h3>

        {/* Description */}
        <p
          className="font-space text-stellar-white/70 text-sm leading-relaxed"
          style={{ 
            overflow: 'hidden',
            maxHeight: isExpanded ? '500px' : '3.5em',
            transition: 'max-height 0.3s ease'
          }}
        >
          {event.description}
        </p>

        {/* Expand indicator */}
        {event.description.length > 80 && (
          <motion.div
            className="mt-3 text-xs text-stellar-white/40 flex items-center gap-1"
            animate={{ opacity: isExpanded ? 0 : 1 }}
          >
            <span>Click to expand</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Timeline Node Component - Simplified and properly centered
function TimelineNode({ event, index, isLeft }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const typeStyles = {
    education: { color: '#3b82f6', icon: '🎓', glow: 'blue-glow' },
    learning: { color: '#a855f7', icon: '📚', glow: 'cosmic-glow' },
    project: { color: '#f97316', icon: '🚀', glow: 'solar-glow' },
    current: { color: '#10b981', icon: '✨', glow: 'emerald-glow' },
  };

  const style = typeStyles[event.type] || typeStyles.learning;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Desktop Layout - True alternating */}
      <div className="hidden md:grid md:grid-cols-[1fr_80px_1fr] md:gap-4 md:items-center">
        {/* Left Side */}
        <div className={isLeft ? '' : 'invisible'}>
          {isLeft && (
            <CardContent 
              event={event} 
              style={style} 
              isExpanded={isExpanded} 
              setIsExpanded={setIsExpanded} 
            />
          )}
        </div>

        {/* Center Node */}
        <div className="flex justify-center">
          <motion.div
            className={`w-14 h-14 rounded-full flex items-center justify-center relative z-10 ${
              event.milestone ? 'scale-110' : ''
            }`}
            style={{
              backgroundColor: `${style.color}30`,
              border: `3px solid ${style.color}`,
              boxShadow: event.milestone ? `0 0 25px ${style.color}` : `0 0 10px ${style.color}50`,
            }}
            whileHover={{ scale: 1.15 }}
          >
            <span className="text-xl">{style.icon}</span>
            
            {/* Pulse effect for current */}
            {event.type === 'current' && (
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: style.color }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </motion.div>
        </div>

        {/* Right Side */}
        <div className={!isLeft ? '' : 'invisible'}>
          {!isLeft && (
            <CardContent 
              event={event} 
              style={style} 
              isExpanded={isExpanded} 
              setIsExpanded={setIsExpanded} 
            />
          )}
        </div>
      </div>

      {/* Mobile Layout - All on right of timeline */}
      <div className="md:hidden flex items-start gap-4">
        {/* Node */}
        <motion.div
          className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 ${
            event.milestone ? 'scale-110' : ''
          }`}
          style={{
            backgroundColor: `${style.color}30`,
            border: `3px solid ${style.color}`,
            boxShadow: event.milestone ? `0 0 25px ${style.color}` : `0 0 10px ${style.color}50`,
          }}
        >
          <span className="text-lg">{style.icon}</span>
        </motion.div>

        {/* Card */}
        <div className="flex-1">
          <CardContent 
            event={event} 
            style={style} 
            isExpanded={isExpanded} 
            setIsExpanded={setIsExpanded} 
          />
        </div>
      </div>
    </motion.div>
  );
}

// Space-time fabric effect
function SpaceTimeFabric() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grid lines that curve */}
      <svg className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gridGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines */}
        {[...Array(20)].map((_, i) => {
          const y = (i / 20) * 100;
          const curve = Math.sin((i / 20) * Math.PI) * 50;
          return (
            <motion.path
              key={`h-${i}`}
              d={`M 0 ${y}% Q 50% ${y + curve / 10}% 100% ${y}%`}
              fill="none"
              stroke="url(#gridGradient)"
              strokeWidth="0.5"
              style={{ pathLength }}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function JourneySection({ onNavigate }) {
  return (
    <div className="w-full h-full overflow-y-auto scroll-container">
      {/* Add left padding to account for the fixed navigation orbs (left-6 + w-10 + gap = ~80px) */}
      <div className="min-h-full pl-16 md:pl-20 pr-4 py-20 relative">
        {/* Space-time background effect */}
        <SpaceTimeFabric />

        {/* Header */}
        <motion.div
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-cosmic text-4xl md:text-5xl tracking-wider mb-4">
            <span className="text-neon-cyan text-glow-blue">SPACE-TIME JOURNEY</span>
          </h2>
          <p className="font-space text-stellar-white/60 max-w-xl mx-auto">
            Timeline behaves like space-time fabric. Major events bend space.
          </p>
        </motion.div>

        {/* Timeline Container - centered in available space */}
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Center vertical line */}
          <div 
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 rounded-full z-0"
            style={{
              background: 'linear-gradient(to bottom, #3b82f6, #a855f7, #f97316, #10b981)',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
            }}
          />

          {/* Timeline nodes with consistent spacing */}
          <div className="space-y-8 md:space-y-12">
            {journeyData.map((event, index) => (
              <TimelineNode
                key={index}
                event={event}
                index={index}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>

        {/* Continue Journey hint */}
        <motion.div
          className="text-center mt-16 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="font-space text-stellar-white/40 mb-4">
            The journey continues...
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mx-auto text-neon-purple/50"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex justify-center gap-4 mt-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => onNavigate('contact')}
            className="cosmic-button text-sm"
            whileHover={{ scale: 1.05 }}
          >
            Send Signal 📡
          </motion.button>
          <motion.button
            onClick={() => onNavigate('about')}
            className="px-4 py-2 text-sm font-cosmic text-stellar-white/60 hover:text-stellar-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Back to Identity →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
