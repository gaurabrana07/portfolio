import { motion } from 'framer-motion';
import { sections } from '../../data/portfolioData';

export default function NavigationOrbs({ currentSection, onNavigate, onHome }) {
  return (
    <motion.nav
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Home button */}
      <motion.button
        onClick={onHome}
        className="relative w-10 h-10 rounded-full glass flex items-center justify-center group"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <span className="text-lg">🌌</span>
        <span className="absolute left-14 px-3 py-1 text-sm font-space text-stellar-white bg-cosmic-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
          Multiverse Hub
        </span>
      </motion.button>

      {/* Divider */}
      <div className="w-px h-4 bg-gradient-to-b from-transparent via-neon-purple/50 to-transparent mx-auto" />

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
              />
            )}
            
            <span className="text-lg">{section.icon}</span>
            
            {/* Tooltip */}
            <span className="absolute left-14 px-3 py-1 text-sm font-space text-stellar-white bg-cosmic-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {section.label}
            </span>
          </motion.button>
        );
      })}
    </motion.nav>
  );
}
