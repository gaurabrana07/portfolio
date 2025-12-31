import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personalInfo } from '../../data/portfolioData';

// Rotating Light Rays Component
function RotatingRays() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {/* Multiple rotating ray layers */}
      <motion.div
        className="absolute w-[150%] h-[150%]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 origin-center"
            style={{
              width: '200%',
              height: '3px',
              transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
              background: `linear-gradient(90deg, transparent 0%, transparent 30%, rgba(168, 85, 247, 0.4) 45%, rgba(6, 182, 212, 0.6) 50%, rgba(168, 85, 247, 0.4) 55%, transparent 70%, transparent 100%)`,
            }}
          />
        ))}
      </motion.div>
      
      {/* Second layer - counter rotation */}
      <motion.div
        className="absolute w-[140%] h-[140%]"
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 origin-center"
            style={{
              width: '200%',
              height: '2px',
              transform: `translate(-50%, -50%) rotate(${i * 45 + 22.5}deg)`,
              background: `linear-gradient(90deg, transparent 0%, transparent 25%, rgba(59, 130, 246, 0.3) 40%, rgba(168, 85, 247, 0.5) 50%, rgba(59, 130, 246, 0.3) 60%, transparent 75%, transparent 100%)`,
            }}
          />
        ))}
      </motion.div>
      
      {/* Outer glow ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '120%',
          height: '120%',
          border: '2px solid transparent',
          borderImage: 'linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4, #a855f7) 1',
          opacity: 0.3,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Inner glow rings */}
      <motion.div
        className="absolute rounded-full border border-purple-500/20"
        style={{ width: '110%', height: '110%' }}
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute rounded-full border border-cyan-500/15"
        style={{ width: '105%', height: '105%' }}
        animate={{ scale: [1, 0.98, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
    </div>
  );
}

// Ambient floating particles
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: i % 3 === 0 ? '#a855f7' : i % 3 === 1 ? '#3b82f6' : '#06b6d4',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Premium Input Component
function PremiumInput({ label, type = 'text', value, onChange, placeholder, rows }) {
  const isTextarea = rows !== undefined;
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  return (
    <div className="relative w-full">
      <label className="block font-cosmic text-[11px] md:text-xs text-purple-300/90 mb-2 tracking-[0.2em] uppercase">
        {label}
      </label>
      <InputComponent
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required
        className={`
          w-full px-5 py-4
          bg-black/30 backdrop-blur-sm
          border border-purple-500/40 hover:border-purple-500/60
          rounded-xl
          font-space text-sm md:text-base text-white
          placeholder:text-white/40
          focus:outline-none focus:border-cyan-400/70 focus:bg-black/40
          transition-all duration-300
          ${isTextarea ? 'resize-none min-h-[140px]' : ''}
        `}
      />
    </div>
  );
}

// Social Link Button
function SocialButton({ icon, href, label, delay }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group hover:border-purple-400/50 hover:bg-purple-500/20 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-2xl md:text-3xl">{icon}</span>
      
      {/* Tooltip */}
      <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs font-space bg-black/90 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap border border-white/10">
        {label}
      </span>
    </motion.a>
  );
}

export default function ContactSection({ onNavigate }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 5000);
  };

  const socialLinks = [
    { icon: '💻', href: personalInfo.social.github, label: 'GitHub' },
    { icon: '💼', href: personalInfo.social.linkedin, label: 'LinkedIn' },
    { icon: '🏆', href: personalInfo.social.leetcode, label: 'LeetCode' },
    { icon: '📸', href: '#', label: 'Instagram' },
  ];

  return (
    <div className="w-full h-full overflow-y-auto relative bg-gradient-to-b from-[#0a0a1a] via-[#0d0d25] to-[#0a0a1a]">
      {/* Floating particles background */}
      <FloatingParticles />
      
      {/* Main Content */}
      <div className="min-h-full flex flex-col items-center justify-center px-4 py-8 md:py-12">
        
        {/* Header */}
        <motion.div
          className="text-center mb-6 md:mb-10 relative z-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-cosmic text-4xl md:text-5xl lg:text-6xl tracking-wider mb-3">
            <span 
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #3b82f6 100%)' }}
            >
              SEND A SIGNAL
            </span>
          </h2>
          
          <p className="font-space text-white/50 text-sm md:text-base max-w-lg mx-auto">
            Transmit a message across the multiverse. I'm always open to new connections.
          </p>
        </motion.div>

        {/* Form Container with Rotating Rays */}
        <motion.div
          className="relative w-full max-w-2xl lg:max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Rotating Rays Around Form */}
          <RotatingRays />
          
          {/* Main Form Card */}
          <div 
            className="relative z-10 rounded-3xl p-6 md:p-10 lg:p-12"
            style={{
              background: 'linear-gradient(145deg, rgba(15, 15, 35, 0.95) 0%, rgba(20, 10, 40, 0.9) 50%, rgba(10, 20, 35, 0.95) 100%)',
              boxShadow: '0 0 60px rgba(168, 85, 247, 0.15), 0 0 100px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255,255,255,0.1)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-16"
                >
                  <motion.div
                    className="text-7xl md:text-8xl mb-6"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.6 }}
                  >
                    🚀
                  </motion.div>
                  <h3 className="font-cosmic text-2xl md:text-3xl text-emerald-400 mb-3">
                    TRANSMISSION SENT!
                  </h3>
                  <p className="font-space text-white/60 text-sm md:text-base">
                    Your message is traveling across the multiverse. I'll respond soon!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-5 md:space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Two column layout for name and email on larger screens */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    <PremiumInput
                      label="Your Name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      placeholder="Enter your name"
                    />

                    <PremiumInput
                      label="Email Frequency"
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      placeholder="your.email@universe.com"
                    />
                  </div>

                  <PremiumInput
                    label="Your Message"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    placeholder="Write your message here..."
                    rows={5}
                  />

                  {/* Premium Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full py-5 rounded-xl font-cosmic text-base tracking-[0.15em] text-white overflow-hidden disabled:opacity-60 mt-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(59, 130, 246, 0.5) 50%, rgba(6, 182, 212, 0.5) 100%)',
                      border: '1px solid rgba(168, 85, 247, 0.5)',
                    }}
                    whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated shine */}
                    <motion.div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      }}
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                    
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isSubmitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="text-xl"
                          >
                            🌀
                          </motion.span>
                          TRANSMITTING...
                        </>
                      ) : (
                        <>
                          <span className="text-xl">📡</span>
                          SEND TRANSMISSION
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="mt-10 md:mt-14 text-center relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="font-space text-white/40 text-xs md:text-sm mb-5 tracking-wider">
            Or connect through other frequencies
          </p>
          <div className="flex justify-center gap-4 md:gap-5">
            {socialLinks.map((link, index) => (
              <SocialButton
                key={link.label}
                {...link}
                delay={0.7 + index * 0.1}
              />
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="mt-10 md:mt-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={() => onNavigate('about')}
            className="px-6 py-3 text-sm font-cosmic text-white/50 hover:text-white transition-colors border border-white/20 rounded-full hover:border-purple-400/50 hover:bg-white/5"
            whileHover={{ scale: 1.05 }}
          >
            ← Back to Identity
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
