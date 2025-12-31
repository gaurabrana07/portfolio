import { motion } from 'framer-motion';
import { sections } from '../../data/portfolioData';

export default function NavigationOrbs({ currentSection, onNavigate, onHome }) {
  return (
    <>
      {/* Desktop Navigation - Left Side */}
      <motion.nav
        className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Main navigation"
        role="navigation"
      >
        {/* Home button */}
        <motion.button
          onClick={onHome}
          className="relative w-10 h-10 rounded-full glass flex items-center justify-center group"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Go to Multiverse Hub (Home)"
          aria-current={currentSection === 'hub' ? 'page' : undefined}
        >
          <span className="text-lg" aria-hidden="true">🌌</span>
          <span className="absolute left-14 px-3 py-1 text-sm font-space text-stellar-white bg-cosmic-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Multiverse Hub
          </span>
        </motion.button>

        {/* Divider */}
        <div className="w-px h-4 bg-gradient-to-b from-transparent via-neon-purple/50 to-transparent mx-auto" aria-hidden="true" />

        {/* Section orbs */}
        {sections.slice(1).map((section, index) => {
          const isActive = currentSection === section.id;
          return (
            <motion.button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center group transition-all ${
                isActive
                  ? 'bg-neon-purple/30 border border-neon-purple'
                  : 'glass hover:bg-neon-purple/10'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              aria-label={`Go to ${section.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator glow */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 10px rgba(168, 85, 247, 0.5)',
                      '0 0 20px rgba(168, 85, 247, 0.8)',
                      '0 0 10px rgba(168, 85, 247, 0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  aria-hidden="true"
                />
              )}
              
              <span className="text-lg" aria-hidden="true">{section.icon}</span>
              
              {/* Tooltip */}
              <span className="absolute left-14 px-3 py-1 text-sm font-space text-stellar-white bg-cosmic-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {section.label}
              </span>
            </motion.button>
          );
        })}
      </motion.nav>

      {/* Mobile Navigation - Bottom Bar */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        aria-label="Mobile navigation"
        role="navigation"
      >
        <div className="glass border-t border-white/10 px-2 py-2 flex justify-around items-center">
          {/* Home button */}
          <motion.button
            onClick={onHome}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
              currentSection === 'hub' ? 'bg-neon-purple/30' : ''
            }`}
            whileTap={{ scale: 0.9 }}
            aria-label="Go to Multiverse Hub (Home)"
            aria-current={currentSection === 'hub' ? 'page' : undefined}
          >
            <span className="text-lg" aria-hidden="true">🌌</span>
            <span className="text-[10px] font-space text-stellar-white/70">Hub</span>
          </motion.button>

          {/* Section buttons */}
          {sections.slice(1, 6).map((section) => {
            const isActive = currentSection === section.id;
            return (
              <motion.button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive ? 'bg-neon-purple/30' : ''
                }`}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to ${section.label}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-lg" aria-hidden="true">{section.icon}</span>
                <span className="text-[10px] font-space text-stellar-white/70">{section.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
