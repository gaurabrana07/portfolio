import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { projectsData, galaxiesConfig } from '../../data/portfolioData';
import { GlowCard, HoloCard } from '../effects/InteractiveElements';
import { FadeSlide, StaggerContainer, staggerItemVariants } from '../effects/TextReveal';

// Star System Component (Project) - Premium Version
function StarSystem({ project, index, onSelect, isSelected }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const moonColors = ['#3b82f6', '#a855f7', '#10b981', '#f97316', '#06b6d4'];

  return (
    <motion.div
      className="relative cursor-pointer group"
      variants={staggerItemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(project)}
    >
      <HoloCard className="p-6 rounded-2xl">
        <div className="premium-card p-6 rounded-2xl">
          {/* Orbiting tech stack moons */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {project.techStack.slice(0, 5).map((tech, i) => {
              const orbitRadius = 60 + i * 12;
              const duration = 10 + i * 2;
              return (
                <motion.div
                  key={tech}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    backgroundColor: moonColors[i % moonColors.length],
                    boxShadow: `0 0 8px ${moonColors[i % moonColors.length]}`,
                  }}
                  animate={{
                    x: [
                      Math.cos(0) * orbitRadius,
                      Math.cos(Math.PI / 2) * orbitRadius,
                      Math.cos(Math.PI) * orbitRadius,
                      Math.cos((3 * Math.PI) / 2) * orbitRadius,
                      Math.cos(Math.PI * 2) * orbitRadius,
                    ],
                    y: [
                      Math.sin(0) * orbitRadius * 0.4,
                      Math.sin(Math.PI / 2) * orbitRadius * 0.4,
                      Math.sin(Math.PI) * orbitRadius * 0.4,
                      Math.sin((3 * Math.PI) / 2) * orbitRadius * 0.4,
                      Math.sin(Math.PI * 2) * orbitRadius * 0.4,
                    ],
                  }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: i * 0.5,
                  }}
                />
              );
            })}
          </div>

          {/* Central Star */}
          <div className="relative w-32 h-32 mx-auto mb-4">
            {/* Outer corona */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${project.color}30, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Inner star */}
            <div
              className="absolute inset-4 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{
                background: `linear-gradient(135deg, ${project.color}40, ${project.color}20)`,
                border: `1px solid ${project.color}40`,
                boxShadow: `0 0 30px ${project.color}30`,
              }}
            >
              <span className="text-3xl">
                {project.type === 'ai' ? '🧠' : project.type === 'systems' ? '⚙️' : '🚀'}
              </span>
            </div>

            {/* Status badge */}
            <div
              className={`absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wider ${
                project.status === 'Completed'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              }`}
            >
              {project.status === 'Completed' ? '✓ LIVE' : '◎ WIP'}
            </div>
          </div>

          {/* Project Name */}
          <div className="text-center relative z-10">
            <h3
              className="font-cosmic text-base tracking-wider mb-1"
              style={{ color: project.color }}
            >
              {project.name}
            </h3>
            <p className="text-[11px] text-white/50 leading-relaxed">{project.tagline}</p>
            
            {/* Tech stack preview on hover */}
            <motion.div
              className="flex flex-wrap justify-center gap-1 mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            >
              {project.techStack.slice(0, 3).map((tech, i) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-[9px] rounded-full bg-white/5 text-white/60 border border-white/10"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="px-2 py-0.5 text-[9px] text-white/40">
                  +{project.techStack.length - 3}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </HoloCard>
    </motion.div>
  );
}

// Project Detail Modal
function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-cosmic-void/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div
        className="relative glass rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        style={{
          borderColor: `${project.color}50`,
          boxShadow: `0 0 50px ${project.color}30`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stellar-white/10 flex items-center justify-center hover:bg-stellar-white/20 transition-colors"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{
              background: `linear-gradient(135deg, ${project.color}40, ${project.color}20)`,
              border: `1px solid ${project.color}50`,
            }}
          >
            {project.type === 'ai' ? '🧠' : project.type === 'systems' ? '⚙️' : '🚀'}
          </div>
          <div>
            <h2 className="font-cosmic text-2xl" style={{ color: project.color }}>
              {project.name}
            </h2>
            <p className="text-stellar-white/60 text-sm">{project.tagline}</p>
            <span
              className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
                project.status === 'Completed'
                  ? 'bg-emerald-glow/30 text-emerald-glow'
                  : 'bg-solar-orange/30 text-solar-orange'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-cosmic text-sm text-stellar-white/50 mb-2 tracking-wider">
            DESCRIPTION
          </h4>
          <p className="text-stellar-white/80 font-space leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack - Orbiting Moons */}
        <div className="mb-6">
          <h4 className="font-cosmic text-sm text-stellar-white/50 mb-3 tracking-wider">
            TECH STACK (ORBITING MOONS)
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, i) => (
              <motion.span
                key={tech}
                className="px-3 py-1.5 rounded-full text-sm font-space"
                style={{
                  backgroundColor: `${project.color}20`,
                  border: `1px solid ${project.color}40`,
                  color: project.color,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Challenges - Asteroids */}
        <div className="mb-6">
          <h4 className="font-cosmic text-sm text-stellar-white/50 mb-3 tracking-wider">
            CHALLENGES (ASTEROIDS)
          </h4>
          <div className="space-y-2">
            {project.challenges.map((challenge, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 text-stellar-white/70"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <span className="text-lg">☄️</span>
                <span className="font-space text-sm">{challenge}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Innovation - Comet */}
        <div className="mb-6">
          <h4 className="font-cosmic text-sm text-stellar-white/50 mb-2 tracking-wider">
            INNOVATION (COMET)
          </h4>
          <div
            className="p-4 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${project.color}10, transparent)`,
              border: `1px solid ${project.color}30`,
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">☄️</span>
              <p className="text-stellar-white/80 font-space">{project.innovation}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <motion.a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl font-cosmic text-sm tracking-wider text-center transition-colors"
            style={{
              backgroundColor: `${project.color}20`,
              border: `1px solid ${project.color}50`,
              color: project.color,
            }}
            whileHover={{ scale: 1.02, backgroundColor: `${project.color}30` }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View Code
            </span>
          </motion.a>
          {project.live && (
            <motion.a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl font-cosmic text-sm tracking-wider text-center bg-stellar-white/10 text-stellar-white hover:bg-stellar-white/20 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center justify-center gap-2">
                🚀 Live Demo
              </span>
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Filter Tabs
function FilterTabs({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Systems', icon: '🌌' },
    { id: 'fullstack', label: 'Full-Stack', icon: '🌐' },
    { id: 'ai', label: 'AI / ML', icon: '🧠' },
    { id: 'systems', label: 'Systems', icon: '⚙️' },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {filters.map((filter) => (
        <motion.button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-full font-cosmic text-sm tracking-wider transition-all ${
            activeFilter === filter.id
              ? 'bg-neon-purple/30 text-neon-purple border border-neon-purple/50'
              : 'glass text-stellar-white/60 hover:text-stellar-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">{filter.icon}</span>
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
}

export default function ProjectsSection({ selectedGalaxy, onNavigate }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter projects based on selected galaxy or filter
  const filteredProjects = projectsData.filter((project) => {
    if (activeFilter === 'all') return true;
    return project.type === activeFilter;
  });

  return (
    <div className="w-full h-full overflow-y-auto scroll-container">
      <div className="min-h-full px-4 py-20 max-w-7xl mx-auto">
        {/* Header */}
        <FadeSlide direction="up" className="text-center mb-8">
          <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mx-auto mb-6" />
          <h2 className="font-cosmic text-4xl md:text-5xl tracking-wider mb-4">
            <span className="premium-heading">STAR SYSTEMS</span>
          </h2>
          <p className="font-space text-white/50 max-w-xl mx-auto text-sm">
            Projects visualized as star systems. Click a star to explore its universe.
          </p>
        </FadeSlide>

        {/* Filter Tabs */}
        <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Projects Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12" stagger={0.1}>
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <StarSystem
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelectedProject}
                isSelected={selectedProject?.id === project.id}
              />
            ))}
          </AnimatePresence>
        </StaggerContainer>

        {/* Navigation */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => onNavigate('journey')}
            className="magnetic-btn"
            whileHover={{ scale: 1.05 }}
          >
            View Timeline ⏳
          </motion.button>
          <motion.button
            onClick={() => onNavigate('contact')}
            className="px-4 py-2 text-sm font-cosmic text-white/60 hover:text-white transition-colors animated-underline"
            whileHover={{ scale: 1.05 }}
          >
            Send Signal →
          </motion.button>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
