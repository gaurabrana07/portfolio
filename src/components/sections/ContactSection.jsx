import { useState, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Ring, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { personalInfo } from '../../data/portfolioData';

// 3D Wormhole Component
function Wormhole3D({ isActive }) {
  const portalRef = useRef();
  const innerRef = useRef();
  const particlesRef = useRef();

  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z += isActive ? 0.05 : 0.01;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z -= isActive ? 0.08 : 0.015;
      const scale = isActive ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      innerRef.current.scale.setScalar(scale);
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z += 0.02;
    }
  });

  // Create particle positions for the swirl
  const particleCount = 100;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 4;
    const radius = (i / particleCount) * 2;
    particlePositions[i * 3] = Math.cos(angle) * radius;
    particlePositions[i * 3 + 1] = Math.sin(angle) * radius;
    particlePositions[i * 3 + 2] = (i / particleCount) * 2 - 1;
  }

  return (
    <group>
      {/* Outer ring */}
      <Ring ref={portalRef} args={[2.2, 2.5, 64]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Middle ring */}
      <Ring args={[1.7, 2.1, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Inner ring */}
      <Ring args={[1.2, 1.6, 64]}>
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Inner vortex */}
      <Ring ref={innerRef} args={[0, 1.1, 64]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={isActive ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Swirling particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#a855f7"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Center glow */}
      <Sphere args={[0.3, 16, 16]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </Sphere>
      
      {/* Point lights */}
      <pointLight color="#a855f7" intensity={isActive ? 3 : 1} distance={10} />
      <pointLight color="#3b82f6" intensity={0.5} distance={5} position={[0, 0, 2]} />
    </group>
  );
}

// Social Link Satellite
function SocialSatellite({ icon, href, label, angle, delay }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-neon-purple/20 transition-all group"
      style={{
        left: `calc(50% + ${Math.cos(angle) * 150}px - 24px)`,
        top: `calc(50% + ${Math.sin(angle) * 150}px - 24px)`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring' }}
      whileHover={{ scale: 1.2 }}
    >
      <span className="text-xl">{icon}</span>
      
      {/* Tooltip */}
      <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs font-space bg-cosmic-black/90 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
      
      {/* Orbit line */}
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-neon-purple/50"
        animate={{
          x: [0, Math.cos(angle + Math.PI) * 3, 0],
          y: [0, Math.sin(angle + Math.PI) * 3, 0],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />
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
  const [portalActive, setPortalActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPortalActive(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after animation
    setTimeout(() => {
      setPortalActive(false);
      setIsSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 5000);
  };

  const socialLinks = [
    { icon: '💻', href: personalInfo.social.github, label: 'GitHub', angle: -Math.PI / 4 },
    { icon: '💼', href: personalInfo.social.linkedin, label: 'LinkedIn', angle: Math.PI / 4 },
    { icon: '🏆', href: personalInfo.social.leetcode, label: 'LeetCode', angle: (3 * Math.PI) / 4 },
    { icon: '📧', href: `mailto:${personalInfo.email}`, label: 'Email', angle: (-3 * Math.PI) / 4 },
  ];

  return (
    <div className="w-full h-full overflow-y-auto scroll-container">
      <div className="min-h-full px-4 py-20 flex flex-col items-center justify-center">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-cosmic text-4xl md:text-5xl tracking-wider mb-4">
            <span className="gradient-text">SEND A SIGNAL</span>
          </h2>
          <p className="font-space text-stellar-white/60 max-w-xl mx-auto">
            Transmit a message across the multiverse. I'm always open to new connections.
          </p>
        </motion.div>

        {/* Wormhole Portal with Form */}
        <div className="relative w-full max-w-2xl mx-auto">
          {/* 3D Wormhole Background */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <Suspense fallback={null}>
                <ambientLight intensity={0.2} />
                <Wormhole3D isActive={portalActive} />
              </Suspense>
            </Canvas>
          </div>

          {/* Social Satellites */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative w-full h-full">
              {socialLinks.map((link, index) => (
                <SocialSatellite
                  key={link.label}
                  {...link}
                  delay={0.5 + index * 0.1}
                />
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="relative z-20 glass-purple rounded-2xl p-8 mx-auto max-w-md mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="text-6xl mb-4"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    🚀
                  </motion.div>
                  <h3 className="font-cosmic text-2xl text-emerald-glow mb-2">
                    TRANSMISSION SENT!
                  </h3>
                  <p className="font-space text-stellar-white/70">
                    Your message is traveling across the multiverse. I'll respond soon!
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Name Field */}
                  <div>
                    <label className="block font-cosmic text-xs text-stellar-white/50 mb-2 tracking-wider">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-cosmic-black/50 border border-neon-purple/30 rounded-xl font-space text-stellar-white focus:outline-none focus:border-neon-purple/70 transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block font-cosmic text-xs text-stellar-white/50 mb-2 tracking-wider">
                      EMAIL FREQUENCY
                    </label>
                    <input
                      type="email"
                      required
                      value={formState.email}
                      onChange={(e) =>
                        setFormState({ ...formState, email: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-cosmic-black/50 border border-neon-purple/30 rounded-xl font-space text-stellar-white focus:outline-none focus:border-neon-purple/70 transition-colors"
                      placeholder="your.email@universe.com"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block font-cosmic text-xs text-stellar-white/50 mb-2 tracking-wider">
                      YOUR MESSAGE
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-cosmic-black/50 border border-neon-purple/30 rounded-xl font-space text-stellar-white focus:outline-none focus:border-neon-purple/70 transition-colors resize-none"
                      placeholder="Write your message..."
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl font-cosmic tracking-wider text-stellar-white relative overflow-hidden disabled:opacity-50"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3))',
                      border: '1px solid rgba(168, 85, 247, 0.5)',
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          🌀
                        </motion.span>
                        TRANSMITTING...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <span>📡</span>
                        SEND TRANSMISSION
                      </span>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Alternative Contact */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="font-space text-stellar-white/40 text-sm mb-4">
            Or connect through other frequencies
          </p>
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-neon-purple/20 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <span>{link.icon}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="mt-12 flex gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.button
            onClick={() => onNavigate('about')}
            className="px-4 py-2 text-sm font-cosmic text-stellar-white/60 hover:text-stellar-white transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            ← Back to Identity
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
