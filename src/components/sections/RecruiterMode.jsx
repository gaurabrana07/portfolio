import { useState } from 'react';
import { motion } from 'framer-motion';
import { personalInfo, skillsData, projectsData, leetcodeStats, journeyData } from '../../data/portfolioData';

// Section Component for Recruiter Mode
function Section({ title, icon, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="font-cosmic text-2xl text-stellar-white tracking-wider">{title}</h2>
      </div>
      {children}
    </motion.section>
  );
}

// Skill Badge
function SkillBadge({ skill, size = 'normal' }) {
  return (
    <div
      className={`inline-flex items-center gap-2 ${
        size === 'small' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      } rounded-full font-space`}
      style={{
        backgroundColor: `${skill.color}20`,
        border: `1px solid ${skill.color}40`,
        color: skill.color,
      }}
    >
      <span>{skill.name}</span>
      {skill.level && <span className="opacity-60">{skill.level}%</span>}
    </div>
  );
}

// Project Card
function ProjectCard({ project }) {
  return (
    <div
      className="glass rounded-xl p-5 hover:scale-[1.02] transition-transform"
      style={{
        borderColor: `${project.color}30`,
        borderWidth: '1px',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-cosmic text-lg" style={{ color: project.color }}>
            {project.name}
          </h4>
          <p className="text-sm text-stellar-white/60">{project.tagline}</p>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs ${
            project.status === 'Completed'
              ? 'bg-emerald-glow/30 text-emerald-glow'
              : 'bg-solar-orange/30 text-solar-orange'
          }`}
        >
          {project.status}
        </span>
      </div>
      
      <p className="text-sm text-stellar-white/70 mb-3 leading-relaxed">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-1.5 mb-3">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-xs bg-cosmic-black/50 text-stellar-white/60 rounded"
          >
            {tech}
          </span>
        ))}
      </div>
      
      <div className="flex gap-3">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neon-purple hover:text-neon-purple/80 transition-colors"
        >
          GitHub →
        </a>
        {project.live && (
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors"
          >
            Live Demo →
          </a>
        )}
      </div>
    </div>
  );
}

// Timeline Item
function TimelineItem({ event }) {
  const typeColors = {
    education: '#3b82f6',
    learning: '#a855f7',
    project: '#f97316',
    current: '#10b981',
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: typeColors[event.type] }}
        />
        <div className="w-0.5 h-full bg-stellar-white/10" />
      </div>
      <div className="pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="px-2 py-0.5 rounded text-xs font-cosmic"
            style={{
              backgroundColor: `${typeColors[event.type]}20`,
              color: typeColors[event.type],
            }}
          >
            {event.year}
          </span>
          {event.milestone && (
            <span className="text-xs text-stellar-gold">★ Milestone</span>
          )}
        </div>
        <h4 className="font-cosmic text-sm text-stellar-white mb-1">{event.title}</h4>
        <p className="text-xs text-stellar-white/60 leading-relaxed">{event.description}</p>
      </div>
    </div>
  );
}

export default function RecruiterMode({ onExit }) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'journey', label: 'Journey', icon: '⏳' },
  ];

  const allSkills = [
    ...skillsData.languages,
    ...skillsData.frameworks,
    ...skillsData.tools,
    ...skillsData.concepts,
  ];

  return (
    <div className="w-full h-full overflow-y-auto scroll-container bg-cosmic-deep">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cosmic text-3xl text-stellar-white mb-1">
              {personalInfo.name}
            </h1>
            <p className="text-stellar-white/60">{personalInfo.title}</p>
          </div>
          <motion.button
            onClick={onExit}
            className="px-4 py-2 rounded-full glass text-sm font-cosmic text-stellar-white/60 hover:text-stellar-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            🌌 Enter Multiverse
          </motion.button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-4 text-center">
            <p className="font-cosmic text-2xl text-neon-purple">{leetcodeStats.totalSolved}</p>
            <p className="text-xs text-stellar-white/50">LeetCode Solved</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="font-cosmic text-2xl text-neon-blue">{projectsData.length}+</p>
            <p className="text-xs text-stellar-white/50">Projects</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="font-cosmic text-2xl text-emerald-glow">{allSkills.length}+</p>
            <p className="text-xs text-stellar-white/50">Technologies</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <p className="font-cosmic text-2xl text-solar-orange">{leetcodeStats.maxStreak}</p>
            <p className="text-xs text-stellar-white/50">Max Streak</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-cosmic whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-neon-purple/30 text-neon-purple border border-neon-purple/50'
                  : 'text-stellar-white/60 hover:text-stellar-white'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <>
              {/* About */}
              <Section title="About" icon="✨">
                <div className="glass rounded-xl p-6">
                  <p className="text-stellar-white/80 leading-relaxed mb-4">
                    {personalInfo.about.description}
                  </p>
                  <p className="text-stellar-white/60 italic">
                    "{personalInfo.about.vision}"
                  </p>
                </div>
              </Section>

              {/* Education */}
              <Section title="Education" icon="🎓">
                <div className="glass rounded-xl p-6">
                  <h4 className="font-cosmic text-lg text-neon-blue mb-1">
                    {personalInfo.education.degree}
                  </h4>
                  <p className="text-stellar-white/70">
                    {personalInfo.education.institution}
                  </p>
                  <p className="text-stellar-white/50 text-sm">
                    {personalInfo.education.location} • {personalInfo.education.year}
                  </p>
                </div>
              </Section>

              {/* Contact */}
              <Section title="Contact" icon="📬">
                <div className="flex flex-wrap gap-4">
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-neon-purple/10 transition-colors"
                  >
                    <span>💻</span>
                    <span className="text-sm">GitHub</span>
                  </a>
                  <a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-neon-blue/10 transition-colors"
                  >
                    <span>💼</span>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a
                    href={personalInfo.social.leetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-solar-orange/10 transition-colors"
                  >
                    <span>🏆</span>
                    <span className="text-sm">LeetCode</span>
                  </a>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:bg-emerald-glow/10 transition-colors"
                  >
                    <span>📧</span>
                    <span className="text-sm">{personalInfo.email}</span>
                  </a>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'skills' && (
            <>
              <Section title="Programming Languages" icon="💻">
                <div className="flex flex-wrap gap-2">
                  {skillsData.languages.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </Section>

              <Section title="Frameworks & Libraries" icon="🛠️">
                <div className="flex flex-wrap gap-2">
                  {skillsData.frameworks.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </Section>

              <Section title="Tools & Technologies" icon="⚙️">
                <div className="flex flex-wrap gap-2">
                  {skillsData.tools.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </Section>

              <Section title="Core Concepts" icon="🧠">
                <div className="flex flex-wrap gap-2">
                  {skillsData.concepts.map((skill) => (
                    <SkillBadge key={skill.name} skill={skill} />
                  ))}
                </div>
              </Section>

              {/* LeetCode Stats */}
              <Section title="Problem Solving Stats" icon="🏆">
                <div className="glass rounded-xl p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="font-cosmic text-xl text-emerald-glow">
                        {leetcodeStats.easy.solved}
                      </p>
                      <p className="text-xs text-stellar-white/50">Easy</p>
                    </div>
                    <div className="text-center">
                      <p className="font-cosmic text-xl text-solar-orange">
                        {leetcodeStats.medium.solved}
                      </p>
                      <p className="text-xs text-stellar-white/50">Medium</p>
                    </div>
                    <div className="text-center">
                      <p className="font-cosmic text-xl text-red-500">
                        {leetcodeStats.hard.solved}
                      </p>
                      <p className="text-xs text-stellar-white/50">Hard</p>
                    </div>
                    <div className="text-center">
                      <p className="font-cosmic text-xl text-neon-cyan">
                        {leetcodeStats.contestRating}
                      </p>
                      <p className="text-xs text-stellar-white/50">Rating</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[...leetcodeStats.skills.advanced, ...leetcodeStats.skills.intermediate].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-xs bg-emerald-glow/20 text-emerald-glow rounded-full"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </Section>
            </>
          )}

          {activeTab === 'projects' && (
            <Section title="Notable Projects" icon="🚀">
              <div className="grid md:grid-cols-2 gap-4">
                {projectsData.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </Section>
          )}

          {activeTab === 'journey' && (
            <Section title="Professional Journey" icon="⏳">
              <div className="glass rounded-xl p-6">
                {journeyData.map((event, index) => (
                  <TimelineItem key={index} event={event} />
                ))}
              </div>
            </Section>
          )}
        </motion.div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-stellar-white/10 text-center">
          <p className="text-stellar-white/40 text-sm mb-4">
            Want the full experience?
          </p>
          <motion.button
            onClick={onExit}
            className="cosmic-button"
            whileHover={{ scale: 1.05 }}
          >
            🚀 Enter the Multiverse
          </motion.button>
        </div>
      </div>
    </div>
  );
}
