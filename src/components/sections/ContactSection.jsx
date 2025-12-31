import { useState, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { personalInfo } from '../../data/portfolioData';

// Premium Spiral Galaxy Shader
const SpiralVortexMaterial = shaderMaterial(
  {
    uTime: 0,
    uIntensity: 1.0,
    uColor1: new THREE.Color('#a855f7'),
    uColor2: new THREE.Color('#3b82f6'),
    uColor3: new THREE.Color('#06b6d4'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - creates beautiful spiral vortex
  `
    uniform float uTime;
    uniform float uIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    
    #define PI 3.14159265359
    
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p = rot * p * 2.0;
        a *= 0.5;
      }
      return v;
    }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      float angle = atan(uv.y, uv.x);
      
      // Multiple spiral arms
      float arms = 3.0;
      float twist = 8.0;
      float spiral1 = sin(angle * arms + dist * twist - uTime * 0.8) * 0.5 + 0.5;
      float spiral2 = sin(angle * arms + dist * twist * 1.5 - uTime * 1.2 + PI) * 0.5 + 0.5;
      float spiral3 = sin(angle * (arms + 1.0) + dist * twist * 0.8 - uTime * 0.5) * 0.5 + 0.5;
      
      spiral1 = pow(spiral1, 3.0);
      spiral2 = pow(spiral2, 4.0);
      spiral3 = pow(spiral3, 2.5);
      
      // Add noise for nebula effect
      float n = fbm(uv * 4.0 + uTime * 0.1);
      float n2 = fbm(uv * 8.0 - uTime * 0.15);
      
      // Combine spirals
      float pattern = spiral1 * 0.6 + spiral2 * 0.3 + spiral3 * 0.2;
      pattern *= (1.0 - dist * 1.2);
      pattern += n * 0.15 * (1.0 - dist);
      
      // Bright core
      float core = exp(-dist * 6.0) * 1.5;
      float coreGlow = exp(-dist * 3.0) * 0.5;
      
      // Color mixing
      vec3 color = mix(uColor3, uColor2, spiral1);
      color = mix(color, uColor1, spiral2 * 0.7);
      color = mix(color, vec3(1.0), core);
      color += uColor1 * coreGlow;
      
      // Add star sparkles
      float stars = step(0.97, fbm(uv * 30.0 + uTime * 0.05)) * (1.0 - dist * 1.5);
      color += vec3(1.0) * stars * 0.8;
      
      // Outer glow rings
      float ring1 = smoothstep(0.02, 0.0, abs(dist - 0.35)) * 0.3;
      float ring2 = smoothstep(0.015, 0.0, abs(dist - 0.45)) * 0.2;
      color += uColor1 * ring1 + uColor2 * ring2;
      
      // Alpha with smooth edge fade
      float alpha = smoothstep(0.55, 0.25, dist);
      alpha *= (pattern + core + coreGlow) * uIntensity;
      alpha = clamp(alpha, 0.0, 1.0);
      
      // Boost brightness
      color *= 1.3;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ SpiralVortexMaterial });

// Animated Spiral Vortex Component
function SpiralVortex({ isActive }) {
  const materialRef = useRef();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
      materialRef.current.uIntensity = THREE.MathUtils.lerp(
        materialRef.current.uIntensity,
        isActive ? 1.5 : 1.0,
        0.05
      );
    }
  });
  
  return (
    <mesh>
      <planeGeometry args={[10, 10]} />
      <spiralVortexMaterial
        ref={materialRef}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Orbiting particles around vortex
function OrbitalParticles() {
  const ref = useRef();
  const count = 150;
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 * 3;
      const radius = 0.5 + (i / count) * 3;
      const z = (Math.random() - 0.5) * 2;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.66; colors[i * 3 + 1] = 0.33; colors[i * 3 + 2] = 0.97;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.23; colors[i * 3 + 1] = 0.51; colors[i * 3 + 2] = 0.96;
      } else {
        colors[i * 3] = 0.02; colors[i * 3 + 1] = 0.71; colors[i * 3 + 2] = 0.83;
      }
    }
    return { positions, colors };
  }, []);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={particles.colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Outer orbital rings
function OrbitalRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.2;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.15;
    if (ring3Ref.current) ring3Ref.current.rotation.z = t * 0.1;
  });
  
  return (
    <>
      <mesh ref={ring1Ref}>
        <ringGeometry args={[3.5, 3.55, 128]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring2Ref}>
        <ringGeometry args={[4.0, 4.03, 128]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ring3Ref}>
        <ringGeometry args={[4.5, 4.52, 128]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

// Complete 3D Scene
function VortexScene({ isActive }) {
  return (
    <>
      <ambientLight intensity={0.1} />
      <SpiralVortex isActive={isActive} />
      <OrbitalParticles />
      <OrbitalRings />
    </>
  );
}

// Premium Input Component
function PremiumInput({ label, type = 'text', value, onChange, placeholder, rows }) {
  const isTextarea = rows !== undefined;
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <label className="block font-cosmic text-[10px] md:text-xs text-cyan-400/80 mb-2 tracking-[0.2em] uppercase">
        {label}
      </label>
      <div className="relative">
        <InputComponent
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required
          className={`
            w-full px-4 py-3 md:py-4
            bg-white/5 backdrop-blur-sm
            border border-purple-500/30
            rounded-xl
            font-space text-sm md:text-base text-white/90
            placeholder:text-white/30
            focus:outline-none focus:border-purple-500/70 focus:bg-white/10
            transition-all duration-300
            ${isTextarea ? 'resize-none min-h-[120px]' : ''}
          `}
        />
        {/* Glow effect on focus */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 20px rgba(168, 85, 247, 0.05)',
          }}
        />
      </div>
    </motion.div>
  );
}

// Social Link Button
function SocialButton({ icon, href, label, delay }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-xl md:text-2xl">{icon}</span>
      
      {/* Tooltip */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-space bg-black/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
        {label}
      </span>
      
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: '0 0 25px rgba(168, 85, 247, 0.3)' }}
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

    await new Promise((resolve) => setTimeout(resolve, 2500));

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setPortalActive(false);
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
    <div className="w-full h-full overflow-hidden relative">
      {/* Full-screen 3D Vortex Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
          <Suspense fallback={null}>
            <VortexScene isActive={portalActive} />
          </Suspense>
        </Canvas>
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
      </div>

      {/* Main Content - Full height scrollable */}
      <div className="relative z-10 w-full h-full overflow-y-auto">
        <div className="min-h-full flex flex-col items-center justify-center px-4 py-12 md:py-20">
          
          {/* Header */}
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decorative line */}
            <motion.div
              className="w-20 h-[2px] mx-auto mb-6"
              style={{ background: 'linear-gradient(90deg, transparent, #06b6d4, #a855f7, transparent)' }}
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            
            <h2 className="font-cosmic text-4xl md:text-6xl lg:text-7xl tracking-wider mb-4">
              <span 
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #3b82f6 100%)' }}
              >
                SEND A SIGNAL
              </span>
            </h2>
            
            <motion.p
              className="font-space text-white/50 text-sm md:text-base max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Transmit a message across the multiverse. I'm always open to new connections.
            </motion.p>
          </motion.div>

          {/* Glass Form Container - Expanded */}
          <motion.div
            className="relative w-full max-w-xl lg:max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Glowing border effect */}
            <div 
              className="absolute -inset-[1px] rounded-3xl opacity-60"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4, #a855f7)',
                filter: 'blur(2px)',
              }}
            />
            
            {/* Main glass container */}
            <div 
              className="relative rounded-3xl p-6 md:p-10 lg:p-12"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      className="text-7xl md:text-8xl mb-6"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0],
                      }}
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
                    
                    {/* Success particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                      {[...Array(20)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full"
                          style={{
                            background: i % 2 === 0 ? '#a855f7' : '#10b981',
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          initial={{ scale: 0, opacity: 1 }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [1, 1, 0],
                            y: [0, -50],
                          }}
                          transition={{
                            duration: 1.5,
                            delay: i * 0.05,
                            ease: 'easeOut',
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6 md:space-y-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
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

                    <PremiumInput
                      label="Your Message"
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Write your message..."
                      rows={4}
                    />

                    {/* Premium Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative w-full py-4 md:py-5 rounded-xl font-cosmic text-sm md:text-base tracking-[0.15em] text-white overflow-hidden disabled:opacity-60 group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {/* Button background */}
                      <div 
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(59, 130, 246, 0.4) 100%)',
                        }}
                      />
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.6) 0%, rgba(59, 130, 246, 0.6) 100%)',
                        }}
                      />
                      
                      {/* Border */}
                      <div 
                        className="absolute inset-0 rounded-xl"
                        style={{ border: '1px solid rgba(168, 85, 247, 0.5)' }}
                      />
                      
                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                        }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />
                      
                      {/* Button content */}
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

          {/* Alternative Contact - Social Links */}
          <motion.div
            className="mt-10 md:mt-14 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="font-space text-white/40 text-xs md:text-sm mb-5 tracking-wider">
              Or connect through other frequencies
            </p>
            <div className="flex justify-center gap-3 md:gap-4">
              {socialLinks.map((link, index) => (
                <SocialButton
                  key={link.label}
                  {...link}
                  delay={0.9 + index * 0.1}
                />
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="mt-10 md:mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <motion.button
              onClick={() => onNavigate('about')}
              className="px-6 py-3 text-sm font-cosmic text-white/50 hover:text-white transition-colors border border-white/10 rounded-full hover:border-white/30 hover:bg-white/5"
              whileHover={{ scale: 1.05 }}
            >
              ← Back to Identity
            </motion.button>
          </motion.div>
        </div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 pointer-events-none z-[2]">
        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at top left, rgba(168,85,247,0.15) 0%, transparent 70%)' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 pointer-events-none z-[2]">
        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(6,182,212,0.15) 0%, transparent 70%)' }} />
      </div>
    </div>
  );
}
