import { useRef, useState, Suspense, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { Sphere, shaderMaterial, Html, Line, Float, Stars, Trail, MeshDistortMaterial, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { galaxiesConfig } from '../../data/portfolioData';

// Spiral Galaxy Shader Material
const SpiralGalaxyMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#ffffff'),
    uColor2: new THREE.Color('#3b82f6'),
    uColor3: new THREE.Color('#1e3a5f'),
    uHovered: 0,
  },
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uHovered;
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
      
      float arms = 2.0;
      float spiralSpeed = uHovered > 0.5 ? 0.8 : 0.3;
      float spiral = sin(angle * arms + dist * 18.0 - uTime * spiralSpeed) * 0.5 + 0.5;
      spiral = pow(spiral, 1.5);
      
      float n = fbm(uv * 10.0 + uTime * 0.08);
      float stars = fbm(uv * 25.0) * step(0.65, fbm(uv * 18.0));
      
      float pattern = spiral * (1.0 - dist * 2.0) * n;
      pattern = max(pattern, stars * 0.4 * (1.0 - dist * 1.5));
      
      float core = exp(-dist * (6.0 - uHovered * 2.0));
      
      vec3 color = mix(uColor3, uColor2, pattern);
      color = mix(color, uColor1, core * 0.95);
      color += uColor1 * stars * 0.6;
      
      // Brighter when hovered
      color *= 1.0 + uHovered * 0.5;
      
      float alpha = smoothstep(0.5, 0.15, dist);
      alpha *= (pattern + core * 0.9);
      alpha = clamp(alpha, 0.0, 1.0);
      
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ SpiralGalaxyMaterial });

// Orbiting Tech Stack - particles orbiting around galaxy
function OrbitingTechStack({ skills, color, radius, visible, galaxyRef }) {
  const groupRef = useRef();
  const particlesRef = useRef([]);
  
  useFrame((state) => {
    if (!groupRef.current || !visible) return;
    const time = state.clock.elapsedTime;
    
    particlesRef.current.forEach((particle, i) => {
      if (particle) {
        const angle = (i / skills.length) * Math.PI * 2 + time * 0.5;
        const orbitRadius = radius + Math.sin(time * 2 + i) * 0.1;
        particle.position.x = Math.cos(angle) * orbitRadius;
        particle.position.z = Math.sin(angle) * orbitRadius * 0.4;
        particle.position.y = Math.sin(angle * 2) * 0.2;
      }
    });
  });

  if (!visible) return null;

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => (
        <group 
          key={skill} 
          ref={(el) => (particlesRef.current[i] = el)}
        >
          {/* Glowing orb */}
          <Sphere args={[0.08, 16, 16]}>
            <meshBasicMaterial color={color} transparent opacity={0.9} />
          </Sphere>
          <Sphere args={[0.12, 16, 16]}>
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </Sphere>
          
          {/* Tech label */}
          <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
            <div 
              className="px-2 py-1 rounded-full text-[10px] font-space whitespace-nowrap"
              style={{ 
                background: `${color}40`, 
                color: color,
                border: `1px solid ${color}60`,
                backdropFilter: 'blur(4px)',
              }}
            >
              {skill}
            </div>
          </Html>
        </group>
      ))}
      
      {/* Orbit ring */}
      <Line
        points={Array.from({ length: 65 }, (_, i) => {
          const angle = (i / 64) * Math.PI * 2;
          return [Math.cos(angle) * radius, Math.sin(angle * 2) * 0.1, Math.sin(angle) * radius * 0.4];
        })}
        color={color}
        lineWidth={1}
        transparent
        opacity={0.4}
      />
    </group>
  );
}

// Glass sphere effect for galaxy container
function GlassSphere({ radius, color, opacity = 0.1, hovered }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Sphere args={[radius, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={hovered ? opacity * 2 : opacity}
          roughness={0.1}
          metalness={0.2}
          distort={hovered ? 0.2 : 0.1}
          speed={2}
        />
      </Sphere>
      <Sphere args={[radius * 1.02, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}

// Individual 3D Galaxy
function Galaxy3D({ 
  galaxy, 
  position, 
  onSelect, 
  isSelected, 
  isHovered, 
  onHover, 
  onLeave,
  globalHovered 
}) {
  const groupRef = useRef();
  const materialRef = useRef();
  const [localScale, setLocalScale] = useState(1);
  
  // Target position and scale based on hover state
  const targetScale = isHovered ? 2.2 : (globalHovered && !isHovered) ? 0.7 : 1;
  const targetZ = isHovered ? 4 : 0;
  
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Smooth scale transition
    const currentScale = groupRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.08);
    groupRef.current.scale.setScalar(newScale);
    
    // Smooth Z position (come forward on hover)
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z, 
      position[2] + targetZ, 
      0.08
    );
    
    // Gentle floating motion
    groupRef.current.position.y = position[1] + Math.sin(time * 0.5 + position[0]) * 0.15;
    
    // Update shader
    if (materialRef.current) {
      materialRef.current.uTime = time;
      materialRef.current.uHovered = THREE.MathUtils.lerp(
        materialRef.current.uHovered,
        isHovered ? 1 : 0,
        0.1
      );
    }
  });

  const color1 = new THREE.Color('#ffffff');
  const color2 = new THREE.Color(galaxy.color);
  const color3 = new THREE.Color(galaxy.secondaryColor).multiplyScalar(0.3);

  return (
    <group 
      ref={groupRef} 
      position={[position[0], position[1], position[2]]}
    >
      {/* Outer glass container */}
      <GlassSphere 
        radius={1.4} 
        color={galaxy.color} 
        opacity={0.08}
        hovered={isHovered}
      />
      
      {/* Orbiting tech stack - visible on hover */}
      <OrbitingTechStack
        skills={galaxy.skills}
        color={galaxy.color}
        radius={1.8}
        visible={isHovered}
      />
      
      {/* Click/hover detection sphere */}
      <Sphere 
        args={[1.3, 32, 32]}
        onClick={() => onSelect(galaxy.id)}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onLeave();
          document.body.style.cursor = 'default';
        }}
      >
        <meshBasicMaterial transparent opacity={0} />
      </Sphere>
      
      {/* Main spiral galaxy */}
      <mesh rotation={[Math.PI * 0.35, 0, 0]}>
        <planeGeometry args={[2.4, 2.4, 1, 1]} />
        <spiralGalaxyMaterial
          ref={materialRef}
          transparent
          side={THREE.DoubleSide}
          uColor1={color1}
          uColor2={color2}
          uColor3={color3}
          uHovered={0}
          depthWrite={false}
        />
      </mesh>
      
      {/* Bright core with trail effect */}
      <Trail
        width={isHovered ? 1.5 : 0.8}
        length={6}
        color={galaxy.color}
        attenuation={(t) => t * t}
      >
        <Sphere args={[0.15, 32, 32]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#ffffff" />
        </Sphere>
      </Trail>
      
      {/* Glow layers */}
      <Sphere args={[0.25, 32, 32]}>
        <meshBasicMaterial color={galaxy.color} transparent opacity={0.6} />
      </Sphere>
      <Sphere args={[0.4, 32, 32]}>
        <meshBasicMaterial color={galaxy.color} transparent opacity={0.2} />
      </Sphere>
      
      {/* Point light */}
      <pointLight
        color={galaxy.color}
        intensity={isHovered ? 3 : 1}
        distance={8}
      />
      
      {/* Galaxy label */}
      <Html
        position={[0, -1.9, 0]}
        center
        style={{ 
          pointerEvents: 'none', 
          userSelect: 'none',
          opacity: globalHovered && !isHovered ? 0.3 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        <motion.div
          className="text-center"
          animate={{
            scale: isHovered ? 1.3 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="px-4 py-2 rounded-lg backdrop-blur-md mb-2"
            style={{
              background: isHovered 
                ? `linear-gradient(135deg, ${galaxy.color}40, rgba(0,0,0,0.8))` 
                : `linear-gradient(135deg, ${galaxy.color}20, rgba(0,0,0,0.6))`,
              border: `1px solid ${galaxy.color}${isHovered ? '80' : '40'}`,
              boxShadow: isHovered ? `0 0 30px ${galaxy.color}50` : 'none',
            }}
          >
            <p
              className="font-cosmic text-sm md:text-base tracking-wider whitespace-nowrap font-semibold"
              style={{ 
                color: galaxy.color, 
                textShadow: `0 0 15px ${galaxy.color}`,
              }}
            >
              {galaxy.name.replace(' Galaxy', '').toUpperCase()}
            </p>
            <p className="text-[10px] text-white/60 font-space mt-1">
              {galaxy.icon} {galaxy.subtitle}
            </p>
          </div>
          
          {/* Select button - visible on hover */}
          {isHovered && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-2 font-cosmic text-xs tracking-widest rounded-lg border"
              style={{
                background: galaxy.color,
                borderColor: galaxy.color,
                color: 'white',
                boxShadow: `0 0 20px ${galaxy.color}60`,
              }}
              onClick={() => onSelect(galaxy.id)}
            >
              EXPLORE GALAXY →
            </motion.button>
          )}
        </motion.div>
      </Html>
    </group>
  );
}

// Central golden sun/core
function CentralCore({ hovered }) {
  const coreRef = useRef();
  const glowRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.3;
      coreRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.15);
    }
  });
  
  return (
    <group>
      <Sphere ref={coreRef} args={[0.5, 64, 64]}>
        <meshBasicMaterial color="#ffffff" />
      </Sphere>
      <Sphere ref={glowRef} args={[0.7, 32, 32]}>
        <meshBasicMaterial color="#ffd700" transparent opacity={0.7} />
      </Sphere>
      <Sphere args={[1, 32, 32]}>
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} />
      </Sphere>
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#ff8c00" transparent opacity={0.1} side={THREE.BackSide} />
      </Sphere>
      <pointLight color="#ffd700" intensity={3} distance={20} />
    </group>
  );
}

// Connection beams between galaxies and center
function ConnectionBeams({ galaxyPositions, hoveredGalaxy }) {
  return (
    <group>
      {Object.entries(galaxyPositions).map(([id, pos]) => {
        const isHovered = hoveredGalaxy === id;
        const galaxy = galaxiesConfig.find(g => g.id === id);
        return (
          <Line
            key={id}
            points={[[0, 0, 0], pos]}
            color={galaxy?.color || '#a855f7'}
            lineWidth={isHovered ? 2 : 0.5}
            transparent
            opacity={isHovered ? 0.6 : 0.15}
            dashed
            dashSize={0.3}
            gapSize={0.2}
          />
        );
      })}
    </group>
  );
}

// Camera controller with smooth follow
function CameraController({ hoveredGalaxy, galaxyPositions }) {
  const { camera } = useThree();
  
  useFrame(() => {
    // Default camera position - further back to see spread galaxies
    let target = new THREE.Vector3(0, 0, 22);
    
    // If hovering, move camera towards that galaxy
    if (hoveredGalaxy && galaxyPositions[hoveredGalaxy]) {
      const pos = galaxyPositions[hoveredGalaxy];
      target = new THREE.Vector3(
        pos[0] * 0.3,
        pos[1] * 0.3,
        18
      );
    }
    
    camera.position.lerp(target, 0.03);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

// Main 3D Scene
function GalaxyScene({ onGalaxySelect, selectedGalaxy, hoveredGalaxy, setHoveredGalaxy }) {
  // Galaxy positions in 3D space - spread out more for scrollable view
  const galaxyPositions = {
    developer: [6, 4, -4],      // Top right
    ai: [0, 6, -6],             // Top center (far)
    systems: [-7, 2, -2],       // Left
    problemsolver: [5, -4, -3], // Bottom right
    builder: [-5, -5, 0],       // Bottom left
  };

  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} color="#ffffff" intensity={0.2} />
      
      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0.5} 
        fade 
        speed={0.5}
      />
      
      {/* Connection beams */}
      <ConnectionBeams 
        galaxyPositions={galaxyPositions} 
        hoveredGalaxy={hoveredGalaxy}
      />
      
      {/* Central golden core */}
      <CentralCore hovered={!!hoveredGalaxy} />
      
      {/* Galaxies */}
      {galaxiesConfig.map((galaxy) => (
        <Galaxy3D
          key={galaxy.id}
          galaxy={galaxy}
          position={galaxyPositions[galaxy.id]}
          onSelect={onGalaxySelect}
          isSelected={selectedGalaxy === galaxy.id}
          isHovered={hoveredGalaxy === galaxy.id}
          onHover={() => setHoveredGalaxy(galaxy.id)}
          onLeave={() => setHoveredGalaxy(null)}
          globalHovered={!!hoveredGalaxy}
        />
      ))}
      
      {/* Camera controller */}
      <CameraController 
        hoveredGalaxy={hoveredGalaxy}
        galaxyPositions={galaxyPositions}
      />
    </>
  );
}

// Bottom taskbar galaxy item with 3D hover effect
function TaskbarGalaxyItem({ galaxy, isSelected, isHovered, onClick, onHover, onLeave }) {
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative flex flex-col items-center gap-1 px-2 md:px-3 py-2 rounded-xl border transition-all"
      style={{
        background: isSelected ? `${galaxy.color}30` : 'rgba(255,255,255,0.05)',
        borderColor: isSelected || isHovered ? galaxy.color : 'rgba(255,255,255,0.1)',
      }}
      animate={{
        scale: isHovered ? 1.3 : 1,
        y: isHovered ? -20 : 0,
        zIndex: isHovered ? 50 : 1,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* 3D-like spherical container */}
      <motion.div
        className="relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${galaxy.color}, ${galaxy.secondaryColor}80, ${galaxy.color}40)`,
          boxShadow: isHovered 
            ? `0 0 30px ${galaxy.color}80, inset 0 -5px 15px rgba(0,0,0,0.4), inset 0 5px 15px rgba(255,255,255,0.2)`
            : `0 0 15px ${galaxy.color}40, inset 0 -3px 10px rgba(0,0,0,0.3), inset 0 3px 10px rgba(255,255,255,0.1)`,
          border: `2px solid ${galaxy.color}60`,
        }}
        animate={{
          rotateY: isHovered ? 360 : 0,
        }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-lg md:text-xl">{galaxy.icon}</span>
        
        {/* Orbiting ring effect on hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-[-4px] rounded-full border-2 border-dashed"
            style={{ borderColor: galaxy.color }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.div>
      
      {/* Label */}
      <motion.span
        className="font-space text-[10px] md:text-xs whitespace-nowrap"
        style={{ color: isHovered ? 'white' : galaxy.color }}
        animate={{
          scale: isHovered ? 1.1 : 1,
        }}
      >
        {galaxy.name.replace(' Galaxy', '')}
      </motion.span>
      
      {/* Hover info popup */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-3 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${galaxy.color}30, rgba(0,0,0,0.9))`,
              border: `1px solid ${galaxy.color}50`,
              boxShadow: `0 0 30px ${galaxy.color}30`,
            }}
          >
            <p className="text-white/80 text-xs font-space mb-2">{galaxy.description}</p>
            <div className="flex flex-wrap gap-1">
              {galaxy.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 text-[9px] rounded-full"
                  style={{
                    background: `${galaxy.color}30`,
                    color: galaxy.color,
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Windows-style taskbar
function TaskbarNavigation({ galaxies, selectedGalaxy, hoveredGalaxy, onSelect, onHover, onLeave, onBack }) {
  return (
    <motion.div
      className="absolute bottom-0 left-0 right-0 z-50"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div
        className="backdrop-blur-xl border-t"
        style={{
          background: 'linear-gradient(180deg, rgba(15, 8, 30, 0.95) 0%, rgba(8, 4, 16, 0.98) 100%)',
          borderColor: 'rgba(168, 85, 247, 0.3)',
        }}
      >
        <div className="flex items-end justify-between px-3 md:px-6 py-3 min-h-[80px]">
          {/* Hub button */}
          <motion.button
            onClick={onBack}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition-all"
            style={{
              background: 'rgba(168, 85, 247, 0.15)',
              borderColor: 'rgba(168, 85, 247, 0.3)',
            }}
            whileHover={{ scale: 1.1, y: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #a855f7, #6b21a8, #4c1d95)',
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.5), inset 0 -3px 10px rgba(0,0,0,0.3)',
              }}
            >
              <span className="text-xl">🌌</span>
            </div>
            <span className="font-cosmic text-[10px] text-white/70 tracking-wider">HUB</span>
          </motion.button>

          {/* Galaxy items */}
          <div className="flex items-end gap-2 md:gap-4 overflow-x-auto px-4 scrollbar-hide">
            {galaxies.map((galaxy) => (
              <TaskbarGalaxyItem
                key={galaxy.id}
                galaxy={galaxy}
                isSelected={selectedGalaxy === galaxy.id}
                isHovered={hoveredGalaxy === galaxy.id}
                onClick={() => onSelect(galaxy.id)}
                onHover={() => onHover(galaxy.id)}
                onLeave={onLeave}
              />
            ))}
          </div>

          {/* Status */}
          <div className="hidden md:flex flex-col items-end gap-1 text-white/40 text-xs font-space">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>
            <span className="text-[10px]">5 Galaxies</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Galaxy warp/transition panel
function GalaxyWarpPanel({ galaxy, onClose }) {
  if (!galaxy) return null;

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, ${galaxy.color}40 0%, rgba(0,0,0,0.9) 70%)`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      <motion.div
        className="relative z-10 text-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="text-8xl mb-4"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {galaxy.icon}
        </motion.div>
        
        <h2 
          className="font-cosmic text-4xl md:text-5xl mb-2"
          style={{ color: galaxy.color, textShadow: `0 0 30px ${galaxy.color}` }}
        >
          {galaxy.name.toUpperCase()}
        </h2>
        
        <motion.div
          className="flex items-center justify-center gap-3 text-white/70"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: galaxy.color }}
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <span className="font-space tracking-wider">INITIATING WARP DRIVE...</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Main Component
export default function GalaxyExplorer({ onGalaxySelect, onBack }) {
  const [selectedGalaxy, setSelectedGalaxy] = useState(null);
  const [hoveredGalaxy, setHoveredGalaxy] = useState(null);
  const [showWarp, setShowWarp] = useState(false);

  const handleGalaxyClick = (galaxyId) => {
    setSelectedGalaxy(galaxyId);
    setShowWarp(true);

    setTimeout(() => {
      onGalaxySelect(galaxyId);
    }, 2000);
  };

  const selectedGalaxyData = galaxiesConfig.find((g) => g.id === selectedGalaxy);

  return (
    <div className="relative w-full min-h-[200vh] overflow-y-auto overflow-x-hidden bg-[#030108]">
      {/* 3D Canvas - Tall scrollable */}
      <div className="sticky top-0 w-full h-screen z-0">
        <Canvas 
          camera={{ position: [0, 0, 20], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ height: '100%' }}
        >
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

      {/* Header overlay */}
      <div className="absolute top-4 md:top-6 left-0 right-0 z-10 text-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block px-6 md:px-10 py-2 rounded-lg"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.15), transparent)',
              borderTop: '1px solid rgba(168, 85, 247, 0.3)',
              borderBottom: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <h1 className="font-cosmic text-xl md:text-3xl lg:text-4xl tracking-[0.2em]">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #ffffff 0%, #a855f7 40%, #3b82f6 70%, #06b6d4 100%)',
                }}
              >
                MULTIVERSE PORTFOLIO
              </span>
            </h1>
          </motion.div>

          <motion.p
            className="font-space text-white/40 text-[10px] md:text-sm tracking-[0.3em] uppercase mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Select Your Galaxy • Hover to Explore
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-purple-500/30 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-blue-500/30 rounded-tr-lg pointer-events-none" />

      {/* Hovered galaxy indicator */}
      <AnimatePresence>
        {hoveredGalaxy && !showWarp && (
          <motion.div
            className="absolute top-24 left-4 md:left-8 z-20 pointer-events-none"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: galaxiesConfig.find(g => g.id === hoveredGalaxy)?.color }}
              />
              <span className="font-cosmic text-sm text-white/60 tracking-wider">
                SCANNING: {hoveredGalaxy.toUpperCase()}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <motion.button
        onClick={onBack}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
        style={{
          background: 'rgba(168, 85, 247, 0.2)',
          borderColor: 'rgba(168, 85, 247, 0.4)',
          backdropFilter: 'blur(10px)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <span className="text-lg">🌌</span>
        <span className="font-cosmic text-sm text-white/80 tracking-wider">BACK TO HUB</span>
      </motion.button>

      {/* Warp transition */}
      <AnimatePresence>
        {showWarp && selectedGalaxyData && (
          <GalaxyWarpPanel galaxy={selectedGalaxyData} />
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-white/30 text-xs font-space tracking-wider text-center">
          🖱️ HOVER TO EXPLORE • CLICK TO WARP • SCROLL TO NAVIGATE
        </p>
      </motion.div>
    </div>
  );
}
