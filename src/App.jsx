import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import CosmicBackground from './components/3d/CosmicBackground';
import MultiverseHub from './components/sections/MultiverseHub';
import GalaxyExplorer from './components/sections/GalaxyExplorer';
import AboutSection from './components/sections/AboutSection';
import SkillsSection from './components/sections/SkillsSection';
import ProjectsSection from './components/sections/ProjectsSection';
import JourneySection from './components/sections/JourneySection';
import ContactSection from './components/sections/ContactSection';
import RecruiterMode from './components/sections/RecruiterMode';
import LoadingScreen from './components/ui/LoadingScreen';
import SoundToggle from './components/ui/SoundToggle';
import ThemeToggle from './components/ui/ThemeToggle';
import NavigationOrbs from './components/ui/NavigationOrbs';
import { PremiumOverlays } from './components/effects/VisualOverlays';
import CursorEffect from './components/effects/CursorEffect';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('hub');
  const [isRecruiterMode, setIsRecruiterMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Faster loading for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleEnterMultiverse = () => {
    setCurrentSection('galaxies');
  };

  const handleGalaxySelect = (galaxyId) => {
    setSelectedGalaxy(galaxyId);
    // Map galaxy to section
    const sectionMap = {
      developer: 'projects',
      ai: 'projects',
      systems: 'projects',
      problemsolver: 'skills',
      builder: 'projects',
    };
    setCurrentSection(sectionMap[galaxyId] || 'projects');
  };

  const handleNavigate = (section) => {
    setCurrentSection(section);
    setSelectedGalaxy(null);
  };

  const toggleRecruiterMode = () => {
    setIsRecruiterMode(!isRecruiterMode);
    if (!isRecruiterMode) {
      setCurrentSection('about');
    } else {
      setCurrentSection('hub');
    }
  };

  // Render current section based on state
  const renderSection = () => {
    if (isRecruiterMode) {
      return <RecruiterMode onExit={toggleRecruiterMode} />;
    }

    switch (currentSection) {
      case 'hub':
        return (
          <MultiverseHub
            onEnter={handleEnterMultiverse}
            onRecruiterMode={toggleRecruiterMode}
          />
        );
      case 'galaxies':
        return (
          <GalaxyExplorer
            onGalaxySelect={handleGalaxySelect}
            onBack={() => setCurrentSection('hub')}
          />
        );
      case 'about':
        return <AboutSection onNavigate={handleNavigate} />;
      case 'skills':
        return <SkillsSection selectedGalaxy={selectedGalaxy} onNavigate={handleNavigate} />;
      case 'projects':
        return <ProjectsSection selectedGalaxy={selectedGalaxy} onNavigate={handleNavigate} />;
      case 'journey':
        return <JourneySection onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactSection onNavigate={handleNavigate} />;
      default:
        return <MultiverseHub onEnter={handleEnterMultiverse} />;
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-cosmic-void">
      {/* Custom Cursor Effect */}
      <CursorEffect />
      
      {/* Premium Visual Overlays */}
      <PremiumOverlays />
      
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <CosmicBackground currentSection={currentSection} />
          </Suspense>
        </Canvas>
      </div>

      {/* Main Content */}
      <main id="main-content" className="relative z-10 w-full h-full" role="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection + (isRecruiterMode ? '-recruiter' : '')}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full h-full"
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navigation Orbs - Hidden in hub and recruiter mode */}
      {!isRecruiterMode && currentSection !== 'hub' && (
        <NavigationOrbs
          currentSection={currentSection}
          onNavigate={handleNavigate}
          onHome={() => setCurrentSection('hub')}
        />
      )}

      {/* Sound Toggle */}
      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(!soundEnabled)} />

      {/* Theme Toggle */}
      <ThemeToggle />
    </div>
  );
}

function AppWithProviders() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

export default AppWithProviders;
