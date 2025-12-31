import { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Sphere, shaderMaterial, Html, Line, Float } from '@react-three/drei';
import * as THREE from 'three';
import { galaxiesConfig } from '../../data/portfolioData';

// Realistic Spiral Galaxy Shader
const SpiralGalaxyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#ffffff'),
    uColor2: new THREE.Color('#3b82f6'),
    uColor3: new THREE.Color('#1e3a5f'),
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - creates realistic spiral galaxy
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    
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
      for (int i = 0; i < 5; i++) {
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
      
      // Spiral arms
      float arms = 2.0;
      float spiral = sin(angle * arms + dist * 15.0 - uTime * 0.3) * 0.5 + 0.5;
      spiral = pow(spiral, 2.0);
      
      // Add noise for star clusters
      float n = fbm(uv * 8.0 + uTime * 0.05);
      float stars = fbm(uv * 20.0) * step(0.7, fbm(uv * 15.0));
      
      // Combine
      float pattern = spiral * (1.0 - dist * 2.0) * n;
      pattern = max(pattern, stars * 0.3 * (1.0 - dist * 1.5));
      
      // Bright core
      float core = exp(-dist * 8.0);
      
      // Color mixing
      vec3 color = mix(uColor3, uColor2, pattern);
      color = mix(color, uColor1, core * 0.9);
      color += uColor1 * stars * 0.5;
      
      // Alpha with edge fade
      float alpha = smoothstep(0.5, 0.2, dist);
      alpha *= (pattern + core * 0.8);
      alpha = clamp(alpha, 0.0, 1.0);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ SpiralGalaxyMaterial });

// Glass sphere effect
function GlassSphere({ radius, color, opacity = 0.1 }) {
  return (
    <>
      {/* Outer glass shell */}
      <Sphere args={[radius, 64, 64]}>
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.6}
          thickness={0.5}
          side={THREE.DoubleSide}
        />
      </Sphere>
      {/* Inner rim glow */}
      <Sphere args={[radius * 0.98, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
}

// Energy beam connection to center
function EnergyBeam({ start, end, color, intensity = 1 }) {
  const ref = useRef();
  const particlesRef = useRef();
  
  // Create curved path
  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);
    midPoint.y += 0.5; // Slight arc
    
    return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  }, [start, end]);
  
  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  // Animated particles along the beam
  const particleCount = 20;
  const particlePositions = useMemo(() => {
    return new Float32Array(particleCount * 3);
  }, []);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Animate particles along curve
    for (let i = 0; i < particleCount; i++) {
      const t = ((time * 0.5 + i / particleCount) % 1);
      const point = curve.getPoint(t);
      particlePositions[i * 3] = point.x;
      particlePositions[i * 3 + 1] = point.y;
      particlePositions[i * 3 + 2] = point.z;
    }
    
    if (particlesRef.current) {
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Pulse the line
    if (ref.current) {
      ref.current.material.opacity = 0.3 + Math.sin(time * 3) * 0.1;
    }
  });
  
  return (
    <group>
      {/* Main beam line */}
      <Line
        ref={ref}
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.4 * intensity}
      />
      {/* Glow line */}
      <Line
        points={points}
        color={color}
        lineWidth={6}
        transparent
        opacity={0.1 * intensity}
      />
      {/* Flowing particles */}
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
          size={0.08}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Orbital ring around sphere
function OrbitalRing({ radius, color, tilt = 0, speed = 1 }) {
  const ref = useRef();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.elapsedTime * 0.2 * speed;
    }
  });
  
  const points = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.1, // Slight ellipse
        Math.sin(angle) * radius * Math.sin(tilt)
      ));
    }
    return pts;
  }, [radius, tilt]);
  
  return (
    <group ref={ref} rotation={[tilt, 0, 0]}>
      <Line
        points={points}
        color={color}
        lineWidth={1.5}
        transparent
        opacity={0.5}
      />
    </group>
  );
}

// Individual Galaxy with glass sphere
function Galaxy3D({ galaxy, index, onSelect, isSelected, totalGalaxies, hoveredGalaxy, setHoveredGalaxy }) {
  const groupRef = useRef();
  const materialRef = useRef();
  const [localHovered, setLocalHovered] = useState(false);
  
  const hovered = hoveredGalaxy === galaxy.id;
  
  // Position galaxies in a circular arrangement
  const angle = (index / totalGalaxies) * Math.PI * 2 - Math.PI / 2;
  const radius = 5;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = Math.sin(angle * 2) * 0.5;
  
  const position = [x, y, z];

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation
      groupRef.current.rotation.y += 0.002;
      
      // Scale on hover
      const targetScale = hovered || isSelected ? 1.25 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.08
      );
    }
    
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  // Parse colors
  const color1 = new THREE.Color('#ffffff');
  const color2 = new THREE.Color(galaxy.color);
  const color3 = new THREE.Color(galaxy.secondaryColor).multiplyScalar(0.3);

  return (
    <Float speed={1.5} rotationIntensity={0.05} floatIntensity={0.2}>
      <group position={position}>
        {/* Energy beam to center */}
        <EnergyBeam
          start={[0, 0, 0]}
          end={[-x, -y, -z]}
          color={galaxy.color}
          intensity={hovered ? 1.5 : 0.7}
        />
        
        <group
          ref={groupRef}
          onClick={() => onSelect(galaxy.id)}
          onPointerOver={() => setHoveredGalaxy(galaxy.id)}
          onPointerOut={() => setHoveredGalaxy(null)}
        >
          {/* Glass sphere container */}
          <GlassSphere 
            radius={1.3} 
            color={galaxy.color} 
            opacity={hovered ? 0.15 : 0.08}
          />
          
          {/* Orbital rings */}
          <OrbitalRing radius={1.4} color={galaxy.color} tilt={0.3} speed={1} />
          <OrbitalRing radius={1.5} color={galaxy.secondaryColor} tilt={-0.5} speed={-0.7} />
          
          {/* Spiral galaxy inside */}
          <mesh rotation={[Math.PI * 0.4, 0, 0]}>
            <planeGeometry args={[2, 2, 1, 1]} />
            <spiralGalaxyMaterial
              ref={materialRef}
              transparent
              side={THREE.DoubleSide}
              uColor1={color1}
              uColor2={color2}
              uColor3={color3}
              depthWrite={false}
            />
          </mesh>
          
          {/* Bright core */}
          <Sphere args={[0.15, 32, 32]}>
            <meshBasicMaterial color="#ffffff" />
          </Sphere>
          <Sphere args={[0.25, 32, 32]}>
            <meshBasicMaterial color={galaxy.color} transparent opacity={0.5} />
          </Sphere>
          
          {/* Galaxy label - always visible outside sphere */}
          <Html
            position={[0, -1.8, 0]}
            center
            style={{ pointerEvents: 'none', userSelect: 'none' }}
          >
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <p
                className="font-cosmic text-sm md:text-base tracking-wider whitespace-nowrap font-semibold"
                style={{ 
                  color: galaxy.color, 
                  textShadow: `0 0 10px ${galaxy.color}, 0 0 20px ${galaxy.color}40`,
                }}
              >
                {galaxy.name.replace(' Galaxy', '')}
              </p>
              <p className="text-[10px] text-white/50 font-space mt-0.5">
                {galaxy.icon}
              </p>
            </motion.div>
          </Html>
          
          {/* Point lights */}
          <pointLight
            color={galaxy.color}
            intensity={hovered ? 2 : 0.8}
            distance={5}
          />
        </group>
      </group>
    </Float>
  );
}

// Central core - bright golden sun
function CentralCore() {
  const coreRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.5;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
    }
  });
  
  return (
    <group>
      {/* Inner bright core */}
      <Sphere ref={coreRef} args={[0.4, 64, 64]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      
      {/* Golden glow layers */}
      <Sphere ref={glowRef} args={[0.6, 32, 32]}>
        <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
      </Sphere>
      <Sphere args={[0.8, 32, 32]}>
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} />
      </Sphere>
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial color="#ff8c00" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
      
      {/* Orbital rings around core */}
      <OrbitalRing radius={0.9} color="#ffd700" tilt={0.8} speed={2} />
      <OrbitalRing radius={1.0} color="#ffaa00" tilt={-0.4} speed={-1.5} />
      
      {/* Bright point light */}
      <pointLight color="#ffd700" intensity={2} distance={15} />
      <pointLight color="#ffffff" intensity={1} distance={10} />
    </group>
  );
}

// Ambient particles
function AmbientParticles({ count = 200 }) {
  const ref = useRef();
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors from galaxy palette
      const colorChoice = Math.random();
      let color;
      if (colorChoice < 0.2) color = new THREE.Color('#3b82f6');
      else if (colorChoice < 0.4) color = new THREE.Color('#a855f7');
      else if (colorChoice < 0.6) color = new THREE.Color('#10b981');
      else if (colorChoice < 0.8) color = new THREE.Color('#f97316');
      else color = new THREE.Color('#ffd700');
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [count]);
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
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
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Camera controls
function GalaxyCamera() {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.02);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 1.5 + 3, 0.02);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// 3D Scene
function GalaxyScene({ onGalaxySelect, selectedGalaxy, hoveredGalaxy, setHoveredGalaxy }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} color="#ffffff" intensity={0.3} />
      
      {/* Ambient particles */}
      <AmbientParticles count={300} />
      
      {/* Central golden core */}
      <CentralCore />
      
      {/* Galaxies */}
      {galaxiesConfig.map((galaxy, index) => (
        <Galaxy3D
          key={galaxy.id}
          galaxy={galaxy}
          index={index}
          onSelect={onGalaxySelect}
          isSelected={selectedGalaxy === galaxy.id}
          totalGalaxies={galaxiesConfig.length}
          hoveredGalaxy={hoveredGalaxy}
          setHoveredGalaxy={setHoveredGalaxy}
        />
      ))}
      
      <GalaxyCamera />
    </>
  );
}

// Galaxy Selection Card Component
function GalaxyCard({ galaxy, isSelected, isHovered, onClick, onHover, onLeave }) {
  return (
    <motion.div
      className="relative flex-shrink-0 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div
        className={`
          relative w-24 md:w-28 h-28 md:h-32 rounded-xl overflow-hidden
          border transition-all duration-300
          ${isHovered || isSelected 
            ? 'border-opacity-80' 
            : 'border-opacity-30'
          }
        `}
        style={{
          borderColor: galaxy.color,
          background: `linear-gradient(135deg, ${galaxy.color}15 0%, transparent 50%, ${galaxy.secondaryColor}10 100%)`,
          boxShadow: isHovered || isSelected 
            ? `0 0 25px ${galaxy.color}40, inset 0 0 20px ${galaxy.color}10`
            : 'none',
        }}
      >
        {/* Galaxy preview circle */}
        <div 
          className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${galaxy.color}, ${galaxy.secondaryColor}50, transparent)`,
            boxShadow: `0 0 15px ${galaxy.color}60`,
          }}
        />
        
        {/* Icon */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xl md:text-2xl">
          {galaxy.icon}
        </div>
        
        {/* Name */}
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <p 
            className="font-cosmic text-[10px] md:text-xs tracking-wider"
            style={{ color: galaxy.color }}
          >
            {galaxy.name.replace(' Galaxy', '')}
          </p>
          <p className="text-[8px] text-white/40 font-space mt-0.5 px-1 truncate">
            {galaxy.subtitle}
          </p>
        </div>
        
        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-xl"
            style={{
              border: `2px solid ${galaxy.color}`,
              boxShadow: `inset 0 0 20px ${galaxy.color}30`,
            }}
            layoutId="selectedCard"
          />
        )}
      </div>
    </motion.div>
  );
}

export default function GalaxyExplorer({ onGalaxySelect, onBack }) {
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [hoveredGalaxy, setHoveredGalaxy] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const cardsContainerRef = useRef(null);

  const handleGalaxyClick = (galaxyId) => {
    setSelectedGalaxy(galaxyId);
    setShowInfo(true);
    
    setTimeout(() => {
      onGalaxySelect(galaxyId);
    }, 1200);
  };

  const selectedGalaxyData = galaxiesConfig.find(g => g.id === selectedGalaxy);
  const hoveredGalaxyData = galaxiesConfig.find(g => g.id === hoveredGalaxy);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Deep space gradient overlay */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 20%, rgba(10, 5, 30, 0.3) 60%, rgba(0, 0, 0, 0.5) 100%)',
        }}
      />
      
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
          <Suspense fallback={null}>
            <GalaxyScene
              onGalaxySelect={handleGalaxyClick}
              selectedGalaxy={selectedGalaxy}
              hoveredGalaxy={hoveredGalaxy}
              setHoveredGalaxy={setHoveredGalaxy}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Header */}
      <div className="absolute top-6 md:top-8 left-0 right-0 z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative line */}
          <motion.div
            className="w-24 md:w-32 h-[1px] mx-auto mb-3"
            style={{
              background: 'linear-gradient(90deg, transparent, #a855f7, #3b82f6, transparent)',
            }}
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ duration: 1, delay: 0.3 }}
          />
          
          <h2 className="font-cosmic text-2xl md:text-4xl tracking-[0.2em]">
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a855f7 50%, #3b82f6 100%)',
              }}
            >
              SELECT YOUR GALAXY
            </span>
          </h2>
          
          <motion.p
            className="font-space text-white/50 mt-2 text-xs md:text-sm tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Each galaxy represents a dimension of expertise
          </motion.p>
          
          {/* Bottom decorative line */}
          <motion.div
            className="w-16 md:w-20 h-[1px] mx-auto mt-3"
            style={{
              background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
            }}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="absolute top-6 md:top-8 left-4 md:left-8 z-20 flex items-center gap-2 px-3 md:px-4 py-2 font-space text-xs md:text-sm text-white/60 hover:text-white transition-colors border border-white/20 rounded-full hover:border-white/40 backdrop-blur-sm"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -3 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="hidden md:inline">Back to Hub</span>
      </motion.button>

      {/* Hovered Galaxy Info - Top right */}
      <AnimatePresence>
        {hoveredGalaxyData && !showInfo && (
          <motion.div
            className="absolute top-24 right-4 md:right-8 z-10 max-w-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div
              className="rounded-xl p-4 backdrop-blur-md border"
              style={{
                background: `linear-gradient(135deg, ${hoveredGalaxyData.color}15 0%, rgba(0,0,0,0.6) 100%)`,
                borderColor: `${hoveredGalaxyData.color}40`,
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{hoveredGalaxyData.icon}</span>
                <div>
                  <h4 className="font-cosmic text-sm" style={{ color: hoveredGalaxyData.color }}>
                    {hoveredGalaxyData.name}
                  </h4>
                  <p className="text-[10px] text-white/50 font-space">
                    {hoveredGalaxyData.subtitle}
                  </p>
                </div>
              </div>
              <p className="text-xs text-white/60 font-space">
                {hoveredGalaxyData.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Galaxy Info Panel */}
      <AnimatePresence>
        {showInfo && selectedGalaxyData && (
          <motion.div
            className="absolute bottom-32 md:bottom-40 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-md"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
          >
            <div
              className="rounded-2xl p-5 md:p-6 backdrop-blur-xl border"
              style={{
                background: `linear-gradient(135deg, ${selectedGalaxyData.color}20 0%, rgba(0,0,0,0.8) 100%)`,
                borderColor: `${selectedGalaxyData.color}50`,
                boxShadow: `0 0 40px ${selectedGalaxyData.color}20`,
              }}
            >
              <div className="text-center">
                <span className="text-4xl mb-2 block">{selectedGalaxyData.icon}</span>
                <h3
                  className="font-cosmic text-xl md:text-2xl mb-2"
                  style={{ color: selectedGalaxyData.color }}
                >
                  {selectedGalaxyData.name}
                </h3>
                <p className="font-space text-white/70 text-sm mb-4">
                  {selectedGalaxyData.description}
                </p>
                
                {/* Skills preview */}
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedGalaxyData.skills.slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-space rounded-full"
                      style={{
                        background: `${selectedGalaxyData.color}20`,
                        color: selectedGalaxyData.color,
                        border: `1px solid ${selectedGalaxyData.color}40`,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                {/* Warping indicator */}
                <motion.div
                  className="mt-4 flex items-center justify-center gap-2 text-white/50 text-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: selectedGalaxyData.color }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <span>Warping to galaxy...</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Galaxy Cards - Scrollable */}
      <motion.div
        className="absolute bottom-4 md:bottom-6 left-0 right-0 z-10 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {/* Scroll hint for mobile */}
        <div className="text-center mb-2 md:hidden">
          <span className="text-[10px] text-white/30 font-space tracking-wider">
            ← SCROLL TO EXPLORE →
          </span>
        </div>
        
        {/* Cards container */}
        <div
          ref={cardsContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto pb-2 px-2 scrollbar-hide justify-start md:justify-center"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {galaxiesConfig.map((galaxy) => (
            <GalaxyCard
              key={galaxy.id}
              galaxy={galaxy}
              isSelected={selectedGalaxy === galaxy.id}
              isHovered={hoveredGalaxy === galaxy.id}
              onClick={() => handleGalaxyClick(galaxy.id)}
              onHover={() => setHoveredGalaxy(galaxy.id)}
              onLeave={() => setHoveredGalaxy(null)}
            />
          ))}
        </div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-[2] opacity-30">
        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at top left, rgba(168,85,247,0.3) 0%, transparent 70%)' }} />
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none z-[2] opacity-30">
        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at top right, rgba(59,130,246,0.3) 0%, transparent 70%)' }} />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none z-[2] opacity-20">
        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at bottom left, rgba(16,185,129,0.3) 0%, transparent 70%)' }} />
      </div>
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none z-[2] opacity-20">
        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(249,115,22,0.3) 0%, transparent 70%)' }} />
      </div>
    </div>
  );
}
