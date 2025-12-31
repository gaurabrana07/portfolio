import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed top-6 right-20 z-50 w-12 h-12 rounded-full glass flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={!isDarkMode}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDarkMode ? 0 : 180 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        {isDarkMode ? (
          <svg className="w-6 h-6 text-stellar-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-neon-purple" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </motion.div>
      
      {/* Tooltip */}
      <span className="absolute right-14 px-3 py-1 text-sm font-space text-stellar-white bg-cosmic-black/90 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
    </motion.button>
  );
}
