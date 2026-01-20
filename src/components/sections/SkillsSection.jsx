import { useState } from 'react';
import { motion } from 'framer-motion';
import { skillsData, leetcodeStats } from '../../data/portfolioData';

// Professional skill bar component
function SkillBar({ skill, index }) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-space text-sm text-stellar-white/90">{skill.name}</span>
        <span className="text-xs font-cosmic" style={{ color: skill.color }}>{skill.level}%</span>
      </div>
      <div className="h-2 bg-cosmic-black/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: skill.color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.05, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// Skill Category Section - Clean professional design
function SkillCategory({ title, skills, icon, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="glass rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300"
      style={{ borderColor: `${color}30` }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
        >
          {icon}
        </div>
        <h3 className="font-cosmic text-lg tracking-wider" style={{ color }}>
          {title}
        </h3>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <SkillBar key={skill.name} skill={skill} index={index} />
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

      {/* LeetCode Profile Link */}
      <motion.a
        href="https://leetcode.com/gaurabrana07"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-sm text-emerald-glow/70 hover:text-emerald-glow transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        View Full Profile →
      </motion.a>
    </motion.div>
  );
}

// GitHub Stats Component
function GitHubStats() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-6 blue-glow"
    >
      <div className="flex items-center gap-3 mb-6">
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-neon-blue">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <div>
          <h3 className="font-cosmic text-xl text-neon-blue tracking-wider">
            GITHUB ACTIVITY
          </h3>
          <p className="text-xs text-stellar-white/50">Contribution Stats</p>
        </div>
      </div>

      {/* GitHub Stats Image */}
      <div className="space-y-4">
        <img
          src="https://github-readme-stats.vercel.app/api?username=gaurabrana07&show_icons=true&theme=transparent&hide_border=true&title_color=3b82f6&icon_color=06b6d4&text_color=ffffff&bg_color=00000000"
          alt="GitHub Stats"
          className="w-full rounded-lg"
          loading="lazy"
        />
        <img
          src="https://github-readme-streak-stats.herokuapp.com/?user=gaurabrana07&theme=transparent&hide_border=true&ring=3b82f6&fire=f97316&currStreakLabel=06b6d4&background=00000000&stroke=ffffff33"
          alt="GitHub Streak"
          className="w-full rounded-lg"
          loading="lazy"
        />
      </div>

      {/* GitHub Profile Link */}
      <motion.a
        href="https://github.com/gaurabrana07"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block text-center text-sm text-neon-blue/70 hover:text-neon-blue transition-colors"
        whileHover={{ scale: 1.02 }}
      >
        View GitHub Profile →
      </motion.a>
    </motion.div>
  );
}

export default function SkillsSection({ selectedGalaxy, onNavigate }) {
  return (
    <div className="w-full h-full overflow-y-auto scroll-container">
      {/* Adjusted padding for navigation panel */}
      <div className="min-h-full px-4 md:pl-24 md:pr-8 py-20 pb-28 md:pb-20 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
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

        {/* Stats Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
          <LeetCodeStats />
          <GitHubStats />
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
