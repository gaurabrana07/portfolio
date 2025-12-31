import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { personalInfo, leetcodeStats } from '../../data/portfolioData';

// 3D Card Component with tilt effect
function HolographicCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: 'preserve-3d',
      }}
      className={`${className}`}
    >
      <div style={{ transform: 'translateZ(75px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </motion.div>
  );
}

export default function AboutSection({ onNavigate }) {
  const [activeLayer, setActiveLayer] = useState(0);

  const layers = [
    {
      title: 'The Vision',
      content: personalInfo.about.intro,
      icon: '🔮',
    },
    {
      title: 'The Builder',
      content: personalInfo.about.description,
      icon: '⚡',
    },
    {
      title: 'The Mission',
      content: personalInfo.about.vision,
      icon: '🚀',
    },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scroll-container">
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-20 pb-28 md:pb-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-cosmic text-4xl md:text-5xl tracking-wider mb-4">
            <span className="gradient-text-gold text-glow-gold">IDENTITY</span>
          </h2>
          <p className="font-space text-stellar-white/60 max-w-xl mx-auto">
            Not a bio. A multiverse narrative.
          </p>
        </motion.div>

        {/* Main Holographic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="perspective-1000"
        >
          <HolographicCard className="glass-purple rounded-3xl p-8 md:p-12 max-w-3xl mx-auto gold-glow">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-neon-purple via-neon-blue to-stellar-gold p-1">
                  <div className="w-full h-full rounded-full bg-cosmic-black flex items-center justify-center overflow-hidden">
                    <img 
                      src={personalInfo.profilePhoto} 
                      alt={personalInfo.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                    <span className="text-6xl hidden items-center justify-center">👨‍💻</span>
                  </div>
                </div>
                {/* Available for work badge */}
                {personalInfo.availableForWork && (
                  <motion.div
                    className="absolute -right-2 top-0 w-8 h-8 rounded-full bg-emerald-glow flex items-center justify-center text-sm"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    title="Available for opportunities"
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              {/* Name & Title */}
              <div className="text-center md:text-left">
                <h3 className="font-cosmic text-3xl text-stellar-white mb-2">
                  {personalInfo.name}
                </h3>
                <p className="font-space text-neon-cyan/80 mb-2">
                  {personalInfo.title}
                </p>
                <div className="flex items-center gap-2 justify-center md:justify-start text-stellar-white/60 text-sm">
                  <span>🎓</span>
                  <span>{personalInfo.education.degree}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start text-stellar-white/60 text-sm">
                  <span>📍</span>
                  <span>{personalInfo.education.institution}, {personalInfo.education.location}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start text-stellar-white/60 text-sm">
                  <span>📅</span>
                  <span>{personalInfo.education.year} • CGPA: {personalInfo.education.cgpa}</span>
                </div>
              </div>
            </div>

            {/* Narrative Layers */}
            <div className="mb-8">
              {/* Layer Tabs */}
              <div className="flex justify-center gap-4 mb-6">
                {layers.map((layer, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setActiveLayer(index)}
                    className={`px-4 py-2 rounded-full font-cosmic text-sm tracking-wider transition-all ${
                      activeLayer === index
                        ? 'bg-neon-purple/30 text-neon-purple border border-neon-purple/50'
                        : 'text-stellar-white/50 hover:text-stellar-white/80'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mr-2">{layer.icon}</span>
                    {layer.title}
                  </motion.button>
                ))}
              </div>

              {/* Layer Content */}
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <p className="font-space text-lg text-stellar-white/90 leading-relaxed italic">
                  "{layers[activeLayer].content}"
                </p>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-cosmic-black/30">
                <div className="font-cosmic text-2xl text-neon-blue mb-1">
                  {leetcodeStats.totalSolved}
                </div>
                <div className="font-space text-xs text-stellar-white/50">
                  LeetCode Solved
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cosmic-black/30">
                <div className="font-cosmic text-2xl text-emerald-glow mb-1">
                  {leetcodeStats.maxStreak}
                </div>
                <div className="font-space text-xs text-stellar-white/50">
                  Max Streak
                </div>
              </div>
              <div className="text-center p-4 rounded-xl bg-cosmic-black/30">
                <div className="font-cosmic text-2xl text-solar-orange mb-1">
                  8+
                </div>
                <div className="font-space text-xs text-stellar-white/50">
                  Projects Built
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center gap-4">
              <motion.a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:bg-neon-purple/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-stellar-white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              <motion.a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:bg-neon-blue/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-stellar-white">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              <motion.a
                href={personalInfo.social.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:bg-solar-orange/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">🏆</span>
              </motion.a>
              <motion.a
                href={`mailto:${personalInfo.email}`}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:bg-emerald-glow/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">📧</span>
              </motion.a>
              <motion.a
                href={`tel:${personalInfo.phone}`}
                className="w-12 h-12 rounded-full glass flex items-center justify-center text-xl hover:bg-neon-cyan/20 transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="text-2xl">📱</span>
              </motion.a>
            </div>

            {/* Resume Download Button */}
            <motion.a
              href={personalInfo.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 mx-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-purple/50 hover:border-neon-purple transition-all"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5 text-stellar-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="font-cosmic text-sm tracking-wider text-stellar-white">Download Resume</span>
            </motion.a>
          </HolographicCard>
        </motion.div>

        {/* Navigation hint */}
        <motion.div
          className="mt-12 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={() => onNavigate('skills')}
            className="cosmic-button text-sm"
            whileHover={{ scale: 1.05 }}
          >
            Explore Powers ⚡
          </motion.button>
          <motion.button
            onClick={() => onNavigate('projects')}
            className="px-4 py-2 text-sm font-cosmic text-stellar-white/60 hover:text-stellar-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            View Creations →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
