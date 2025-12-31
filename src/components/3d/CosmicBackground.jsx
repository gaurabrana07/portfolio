import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// Mobile detection hook
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth < 768 ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
}

// Premium Starfield - Tiny, twinkling stars (optimized for mobile)
function PremiumStarfield({ count = 12000, isMobile = false }) {
  // Reduce star count on mobile for performance
  const actualCount = isMobile ? Math.floor(count * 0.3) : count;
  const ref = useRef();
  
  const [positions, colors, sizes, twinkle] = useMemo(() => {
    const positions = new Float32Array(actualCount * 3);
    const colors = new Float32Array(actualCount * 3);
    const sizes = new Float32Array(actualCount);
    const twinkle = new Float32Array(actualCount);
    
    const starColors = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#fff4e8'),
      new THREE.Color('#e8f4ff'),
      new THREE.Color('#ffeedd'),
      new THREE.Color('#ddeeff'),
      new THREE.Color('#ffe8f0'),
    ];
    
    for (let i = 0; i < actualCount; i++) {
      const radius = 15 + Math.pow(Math.random(), 0.5) * 185;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      sizes[i] = Math.random() * 0.3 + 0.05;
      twinkle[i] = Math.random() * Math.PI * 2;
    }
    
    return [positions, colors, sizes, twinkle];
  }, [actualCount]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.003;
      
      const sizesAttr = ref.current.geometry.attributes.size;
      for (let i = 0; i < actualCount; i++) {
        const twinkleSpeed = 0.5 + (i % 10) * 0.3;
        sizesAttr.array[i] = sizes[i] * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * twinkleSpeed + twinkle[i]));
      }
      sizesAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={actualCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={actualCount} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={actualCount} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Deep space nebula with shader
const NebulaShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor1: new THREE.Color('#1a0533'),
    uColor2: new THREE.Color('#0a1628'),
    uColor3: new THREE.Color('#0f2027'),
    uMouse: new THREE.Vector2(0, 0),
  },
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec2 uMouse;
    varying vec2 vUv;
    
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      for (int i = 0; i < 6; i++) {
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 mouseInfluence = uMouse * 0.1;
      float time = uTime * 0.05;
      vec3 pos = vec3(uv * 3.0 + mouseInfluence, time);
      float noise1 = fbm(pos);
      float noise2 = fbm(pos + vec3(5.2, 1.3, 2.8));
      float noise3 = fbm(pos + vec3(noise1 * 0.5, noise2 * 0.5, time * 0.5));
      vec3 color = mix(uColor1, uColor2, smoothstep(-0.5, 0.5, noise1));
      color = mix(color, uColor3, smoothstep(-0.3, 0.7, noise2));
      float glow = smoothstep(0.0, 1.0, noise3) * 0.3;
      color += vec3(0.1, 0.05, 0.15) * glow;
      float vignette = 1.0 - length(uv - 0.5) * 0.5;
      color *= vignette;
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

extend({ NebulaShaderMaterial });

function DeepSpaceNebula() {
  const ref = useRef();
  const { mouse } = useThree();
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.uTime = state.clock.elapsedTime;
      ref.current.uMouse.set(mouse.x, mouse.y);
    }
  });
  
  return (
    <mesh position={[0, 0, -100]} scale={[300, 150, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <nebulaShaderMaterial ref={ref} transparent depthWrite={false} />
    </mesh>
  );
}

// Constellation lines connecting stars
function Constellations() {
  const ref = useRef();
  
  const constellationData = useMemo(() => {
    const constellations = [];
    const numConstellations = 8;
    
    for (let c = 0; c < numConstellations; c++) {
      const baseAngle = (c / numConstellations) * Math.PI * 2;
      const baseRadius = 40 + Math.random() * 60;
      const numStars = 4 + Math.floor(Math.random() * 4);
      const stars = [];
      
      for (let i = 0; i < numStars; i++) {
        const angle = baseAngle + (Math.random() - 0.5) * 0.5;
        const radius = baseRadius + (Math.random() - 0.5) * 20;
        const height = (Math.random() - 0.5) * 40;
        stars.push(new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius - 50));
      }
      constellations.push(stars);
    }
    return constellations;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.002;
    }
  });
  
  return (
    <group ref={ref}>
      {constellationData.map((stars, cIndex) => (
        <group key={cIndex}>
          {stars.map((pos, sIndex) => (
            <mesh key={`star-${sIndex}`} position={pos}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
            </mesh>
          ))}
          {stars.slice(0, -1).map((pos, lIndex) => (
            <line key={`line-${lIndex}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([pos.x, pos.y, pos.z, stars[lIndex + 1].x, stars[lIndex + 1].y, stars[lIndex + 1].z])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" transparent opacity={0.08} />
            </line>
          ))}
        </group>
      ))}
    </group>
  );
}

// Premium cosmic dust with varied colors
function PremiumCosmicDust({ count = 500 }) {
  const ref = useRef();
  
  const [positions, colors, velocities] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];
    
    const dustColors = [
      new THREE.Color('#a855f7'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#ffffff'),
    ];
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 20;
      
      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005 + 0.002,
        z: (Math.random() - 0.5) * 0.003,
      });
    }
    return [positions, colors, velocities];
  }, [count]);

  useFrame(() => {
    if (ref.current) {
      const pos = ref.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;
        if (pos[i * 3 + 1] > 40) {
          pos[i * 3 + 1] = -40;
          pos[i * 3] = (Math.random() - 0.5) * 80;
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

// Shooting stars effect
function ShootingStars() {
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    const createStar = () => {
      const id = Date.now();
      const star = {
        id,
        position: new THREE.Vector3((Math.random() - 0.5) * 100, 30 + Math.random() * 20, -30 - Math.random() * 30),
        velocity: new THREE.Vector3((Math.random() - 0.5) * 0.5 - 0.3, -0.5 - Math.random() * 0.3, 0),
        life: 1,
      };
      setStars(prev => [...prev, star]);
      setTimeout(() => setStars(prev => prev.filter(s => s.id !== id)), 2000);
    };
    const interval = setInterval(createStar, 3000 + Math.random() * 4000);
    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => {
    setStars(prev => prev.map(star => ({
      ...star,
      position: star.position.clone().add(star.velocity.clone().multiplyScalar(delta * 60)),
      life: star.life - delta * 0.5,
    })));
  });

  return (
    <group>
      {stars.map(star => (
        <mesh key={star.id} position={star.position}>
          <sphereGeometry args={[0.08, 4, 4]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={star.life} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

// Aurora effect
function AuroraEffect() {
  const ref = useRef();
  const geometry = useMemo(() => new THREE.PlaneGeometry(200, 30, 100, 20), []);

  useFrame((state) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array;
      const time = state.clock.elapsedTime;
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        positions[i + 2] = Math.sin(x * 0.05 + time * 0.5) * 2 + Math.sin(x * 0.1 + time * 0.3);
      }
      ref.current.geometry.attributes.position.needsUpdate = true;
      ref.current.material.opacity = 0.03 + Math.sin(time * 0.2) * 0.01;
    }
  });

  return (
    <mesh ref={ref} position={[0, 35, -60]} rotation={[-0.3, 0, 0]}>
      <primitive object={geometry} />
      <meshBasicMaterial color="#10b981" transparent opacity={0.03} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

// Premium lighting with section-based colors
function PremiumLighting({ currentSection }) {
  const mainLight = useRef();
  const accentLight1 = useRef();
  const accentLight2 = useRef();
  
  const sectionColors = {
    hub: { main: '#a855f7', accent1: '#3b82f6', accent2: '#06b6d4' },
    galaxies: { main: '#3b82f6', accent1: '#a855f7', accent2: '#10b981' },
    about: { main: '#d4af37', accent1: '#a855f7', accent2: '#3b82f6' },
    skills: { main: '#10b981', accent1: '#06b6d4', accent2: '#a855f7' },
    projects: { main: '#f97316', accent1: '#ef4444', accent2: '#d4af37' },
    journey: { main: '#06b6d4', accent1: '#3b82f6', accent2: '#10b981' },
    contact: { main: '#a855f7', accent1: '#ec4899', accent2: '#3b82f6' },
  };
  const colors = sectionColors[currentSection] || sectionColors.hub;

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (mainLight.current) mainLight.current.intensity = 0.2 + Math.sin(time * 0.3) * 0.05;
    if (accentLight1.current) {
      accentLight1.current.position.x = Math.sin(time * 0.2) * 30;
      accentLight1.current.position.y = Math.cos(time * 0.15) * 20;
    }
    if (accentLight2.current) {
      accentLight2.current.position.x = Math.cos(time * 0.18) * 30;
      accentLight2.current.position.y = Math.sin(time * 0.22) * 20;
    }
  });

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight ref={mainLight} position={[0, 0, 20]} color={colors.main} intensity={0.2} distance={80} />
      <pointLight ref={accentLight1} position={[-30, 10, -10]} color={colors.accent1} intensity={0.08} distance={60} />
      <pointLight ref={accentLight2} position={[30, -10, -10]} color={colors.accent2} intensity={0.08} distance={60} />
    </>
  );
}

// Main Premium Cosmic Background (with mobile optimization)
export default function CosmicBackground({ currentSection }) {
  const isMobile = useIsMobile();
  
  return (
    <>
      <color attach="background" args={['#000005']} />
      <DeepSpaceNebula />
      <PremiumLighting currentSection={currentSection} />
      <PremiumStarfield count={isMobile ? 2000 : 8000} isMobile={isMobile} />
      {!isMobile && <Constellations />}
      <PremiumCosmicDust count={isMobile ? 100 : 300} />
      {!isMobile && <AuroraEffect />}
      {!isMobile && <ShootingStars />}
      <EffectComposer>
        <Bloom intensity={isMobile ? 0.2 : 0.35} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        {!isMobile && <ChromaticAberration offset={new THREE.Vector2(0.0003, 0.0003)} blendFunction={BlendFunction.NORMAL} />}
        <Noise opacity={0.01} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.15} darkness={0.6} />
      </EffectComposer>
    </>
  );
}
