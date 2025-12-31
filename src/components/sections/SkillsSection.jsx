import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, animate } from 'framer-motion';
import { skillsData, leetcodeStats } from '../../data/portfolioData';

// Gravity-based skill visualization
function SkillOrb({ skill, centerX, centerY, index, totalSkills }) {
  const orbRef = useRef(null);
  const angle = (index / totalSkills) * Math.PI * 2;
  const baseRadius = 120 + (skill.level / 100) * 80;
  
  const x = useMotionValue(centerX + Math.cos(angle) * baseRadius);
  const y = useMotionValue(centerY + Math.sin(angle) * baseRadius);
  const springX = useSpring(x, { stiffness: 50, damping: 20 });
  const springY = useSpring(y, { stiffness: 50, damping: 20 });

  // Gravitational pull effect based on skill level
  useEffect(() => {
    const gravityFactor = skill.level / 100;
    const pullRadius = baseRadius * (1 - gravityFactor * 0.3);
    
    const animation = animate(
      [0, Math.PI * 2],
      {
        duration: 20 + (100 - skill.level) * 0.2,
        repeat: Infinity,
        ease: 'linear',
        onUpdate: (latest) => {
          const newAngle = angle + latest;
          x.set(centerX + Math.cos(newAngle) * pullRadius);
          y.set(centerY + Math.sin(newAngle) * pullRadius + Math.sin(latest * 2) * 10);
        },
      }
    );

    return () => animation.stop();
  }, [skill.level, angle, centerX, centerY, baseRadius, x, y]);

  const orbSize = 40 + (skill.level / 100) * 40;

  return (
    <motion.div
      ref={orbRef}
      className="absolute cursor-pointer group"
      style={{
        x: springX,
        y: springY,
        width: orbSize,
        height: orbSize,
        marginLeft: -orbSize / 2,
        marginTop: -orbSize / 2,
      }}
      whileHover={{ scale: 1.3 }}
    >
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-md"
        style={{ backgroundColor: skill.color }}
      />
      
      {/* Main orb */}
      <div
        className="absolute inset-1 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          backgroundColor: `${skill.color}30`,
          border: `2px solid ${skill.color}`,
          boxShadow: `0 0 20px ${skill.color}50, inset 0 0 15px ${skill.color}30`,
        }}
      >
        <span className="font-cosmic text-xs text-stellar-white text-center leading-tight px-1">
          {skill.name.length > 8 ? skill.name.substring(0, 6) + '..' : skill.name}
        </span>
      </div>

      {/* Tooltip */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="glass rounded-lg px-3 py-2 text-center whitespace-nowrap">
          <p className="font-cosmic text-sm" style={{ color: skill.color }}>
            {skill.name}
          </p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="w-16 h-1 bg-cosmic-black/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${skill.level}%`, backgroundColor: skill.color }}
              />
            </div>
            <span className="text-xs text-stellar-white/60">{skill.level}%</span>
          </div>
          {skill.problems && (
            <p className="text-xs text-stellar-white/50 mt-1">
              {skill.problems} problems solved
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Skill Category Section
function SkillCategory({ title, skills, icon, color }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    }
  }, []);

  const centerX = dimensions.width / 2;
  const centerY = dimensions.height / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-cosmic text-xl tracking-wider" style={{ color }}>
          {title}
        </h3>
      </div>

      <div
        ref={containerRef}
        className="relative h-64 w-full overflow-hidden"
      >
        {/* Central core */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}50, transparent)`,
          }}
        />

        {/* Skill orbs */}
        {dimensions.width > 0 && skills.map((skill, index) => (
          <SkillOrb
            key={skill.name}
            skill={skill}
            centerX={centerX}
            centerY={centerY}
            index={index}
            totalSkills={skills.length}
          />
        ))}
      </div>

      {/* Skills list fallback */}
      <div className="mt-4 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="px-3 py-1 rounded-full text-xs font-space flex items-center gap-2"
            style={{
              backgroundColor: `${skill.color}20`,
              border: `1px solid ${skill.color}40`,
              color: skill.color,
            }}
          >
            <span>{skill.name}</span>
            <span className="opacity-60">{skill.level}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// LeetCode Stats Card
function LeetCodeStats() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-purple rounded-2xl p-6 emerald-glow"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🏆</span>
        <div>
          <h3 className="font-cosmic text-xl text-emerald-glow tracking-wider">
            PROBLEM SOLVER STATS
          </h3>
          <p className="text-xs text-stellar-white/50">LeetCode Progress</p>
        </div>
      </div>

      {/* Progress rings */}
      <div className="flex justify-around mb-6">
        {[
          { label: 'Easy', data: leetcodeStats.easy, color: '#10b981' },
          { label: 'Medium', data: leetcodeStats.medium, color: '#f59e0b' },
          { label: 'Hard', data: leetcodeStats.hard, color: '#ef4444' },
        ].map((category) => {
          const percentage = (category.data.solved / category.data.total) * 100;
          const circumference = 2 * Math.PI * 35;
          const strokeDashoffset = circumference - (percentage / 100) * circumference;

          return (
            <div key={category.label} className="text-center">
              <div className="relative w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="35"
                    fill="none"
                    stroke={category.color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    whileInView={{ strokeDashoffset }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-cosmic text-sm" style={{ color: category.color }}>
                    {category.data.solved}
                  </span>
                </div>
              </div>
              <p className="text-xs text-stellar-white/60 mt-2">{category.label}</p>
            </div>
          );
        })}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-cosmic-black/30 rounded-xl">
          <p className="font-cosmic text-2xl text-stellar-white">
            {leetcodeStats.totalSolved}
          </p>
          <p className="text-xs text-stellar-white/50">Total Solved</p>
        </div>
        <div className="text-center p-3 bg-cosmic-black/30 rounded-xl">
          <p className="font-cosmic text-2xl text-neon-cyan">
            {leetcodeStats.contestRating}
          </p>
          <p className="text-xs text-stellar-white/50">Contest Rating</p>
        </div>
        <div className="text-center p-3 bg-cosmic-black/30 rounded-xl">
          <p className="font-cosmic text-2xl text-solar-orange">
            {leetcodeStats.maxStreak}
          </p>
          <p className="text-xs text-stellar-white/50">Max Streak</p>
        </div>
        <div className="text-center p-3 bg-cosmic-black/30 rounded-xl">
          <p className="font-cosmic text-2xl text-neon-purple">
            {leetcodeStats.activeDays}
          </p>
          <p className="text-xs text-stellar-white/50">Active Days</p>
        </div>
      </div>

      {/* Skills tags */}
      <div className="mt-6">
        <p className="text-xs text-stellar-white/50 mb-2">Top Skills</p>
        <div className="flex flex-wrap gap-2">
          {[...leetcodeStats.skills.advanced, ...leetcodeStats.skills.intermediate.slice(0, 2)].map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs font-space bg-emerald-glow/20 text-emerald-glow rounded-full border border-emerald-glow/30"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ selectedGalaxy, onNavigate }) {
  return (
    <div className="w-full h-full overflow-y-auto scroll-container">
      <div className="min-h-full px-4 py-20 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-cosmic text-4xl md:text-5xl tracking-wider mb-4">
            <span className="gradient-text">POWERS</span>
          </h2>
          <p className="font-space text-stellar-white/60 max-w-xl mx-auto">
            Skills visualized as gravity systems. Stronger skill = stronger pull.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <SkillCategory
            title="LANGUAGES"
            skills={skillsData.languages}
            icon="💻"
            color="#3b82f6"
          />
          <SkillCategory
            title="FRAMEWORKS"
            skills={skillsData.frameworks}
            icon="🛠️"
            color="#a855f7"
          />
          <SkillCategory
            title="TOOLS"
            skills={skillsData.tools}
            icon="⚙️"
            color="#f97316"
          />
          <SkillCategory
            title="CONCEPTS"
            skills={skillsData.concepts}
            icon="🧠"
            color="#10b981"
          />
        </div>

        {/* LeetCode Stats */}
        <div className="max-w-xl mx-auto mb-12">
          <LeetCodeStats />
        </div>

        {/* Navigation */}
        <motion.div
          className="flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            onClick={() => onNavigate('projects')}
            className="cosmic-button text-sm"
            whileHover={{ scale: 1.05 }}
          >
            View Creations 🚀
          </motion.button>
          <motion.button
            onClick={() => onNavigate('journey')}
            className="px-4 py-2 text-sm font-cosmic text-stellar-white/60 hover:text-stellar-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            Explore Timeline →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
