import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Premium Procedural Starfield with realistic tiny stars
export function PremiumStarfield({ count = 8000 }) {
  const pointsRef = useRef();
  
  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#ffe4c4'),
      new THREE.Color('#add8e6'),
      new THREE.Color('#ffd700'),
      new THREE.Color('#e6e6fa'),
    ];
    
    for (let i = 0; i < count; i++) {
      // Distribute stars in a sphere
      const radius = 50 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random star colors
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Very small sizes for realism
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    return { positions, colors, sizes };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.003;
      
      // Twinkle effect
      const sizesArray = pointsRef.current.geometry.attributes.size.array;
      for (let i = 0; i < count; i++) {
        sizesArray[i] = sizes[i] * (0.8 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.2);
      }
      pointsRef.current.geometry.attributes.size.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Constellation lines connecting nearby stars
export function Constellations() {
  const linesRef = useRef();
  
  const linePositions = useMemo(() => {
    const positions = [];
    const numConstellations = 8;
    
    for (let c = 0; c < numConstellations; c++) {
      const centerX = (Math.random() - 0.5) * 60;
      const centerY = (Math.random() - 0.5) * 40;
      const centerZ = -30 - Math.random() * 30;
      
      const numStars = 4 + Math.floor(Math.random() * 4);
      const stars = [];
      
      for (let i = 0; i < numStars; i++) {
        stars.push([
          centerX + (Math.random() - 0.5) * 15,
          centerY + (Math.random() - 0.5) * 10,
          centerZ + (Math.random() - 0.5) * 5,
        ]);
      }
      
      // Connect stars
      for (let i = 0; i < stars.length - 1; i++) {
        positions.push(...stars[i], ...stars[i + 1]);
      }
    }
    
    return new Float32Array(positions);
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#a855f7" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

// Animated Nebula Clouds with shader
export function NebulaShader() {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#1a0a2e') },
    uColor2: { value: new THREE.Color('#16213e') },
    uColor3: { value: new THREE.Color('#0f0f23') },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime * 0.1;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
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
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vec2 uv = vUv;
      
      float noise1 = snoise(vec3(uv * 2.0, uTime * 0.5));
      float noise2 = snoise(vec3(uv * 4.0, uTime * 0.3 + 100.0));
      float noise3 = snoise(vec3(uv * 8.0, uTime * 0.2 + 200.0));
      
      float finalNoise = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      
      vec3 color = mix(uColor1, uColor2, finalNoise * 0.5 + 0.5);
      color = mix(color, uColor3, noise2 * 0.3);
      
      // Add subtle purple/blue glow
      float glow = smoothstep(0.3, 0.7, finalNoise) * 0.15;
      color += vec3(0.4, 0.2, 0.6) * glow;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 0, -80]} scale={[200, 150, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Floating dust particles with varied colors
export function CosmicDustPremium({ count = 300 }) {
  const pointsRef = useRef();
  
  const { positions, colors, velocities, initialPositions } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const velocities = [];
    const initialPositions = [];
    
    const dustColors = [
      new THREE.Color('#a855f7'),
      new THREE.Color('#3b82f6'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#d4af37'),
    ];
    
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 80;
      const y = (Math.random() - 0.5) * 60;
      const z = (Math.random() - 0.5) * 40 - 10;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      
      initialPositions.push([x, y, z]);
      
      velocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.005,
        z: (Math.random() - 0.5) * 0.002,
        phase: Math.random() * Math.PI * 2,
      });
      
      const color = dustColors[Math.floor(Math.random() * dustColors.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors, velocities, initialPositions };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const posArray = pointsRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        const v = velocities[i];
        const init = initialPositions[i];
        
        // Floating motion
        posArray[i * 3] = init[0] + Math.sin(state.clock.elapsedTime * 0.5 + v.phase) * 2;
        posArray[i * 3 + 1] = init[1] + Math.cos(state.clock.elapsedTime * 0.3 + v.phase) * 1.5;
        posArray[i * 3 + 2] = init[2] + Math.sin(state.clock.elapsedTime * 0.2 + v.phase * 2) * 1;
      }
      
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Aurora effect
export function AuroraEffect() {
  const meshRef = useRef();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    varying vec2 vUv;
    
    void main() {
      vec2 uv = vUv;
      
      float wave1 = sin(uv.x * 10.0 + uTime * 0.5) * 0.5 + 0.5;
      float wave2 = sin(uv.x * 15.0 - uTime * 0.3) * 0.5 + 0.5;
      float wave3 = sin(uv.x * 8.0 + uTime * 0.7) * 0.5 + 0.5;
      
      float waves = (wave1 + wave2 + wave3) / 3.0;
      
      // Vertical falloff
      float falloff = smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
      
      // Color gradient
      vec3 color1 = vec3(0.4, 0.1, 0.6); // Purple
      vec3 color2 = vec3(0.1, 0.4, 0.6); // Cyan
      vec3 color3 = vec3(0.1, 0.6, 0.4); // Green
      
      vec3 color = mix(color1, color2, waves);
      color = mix(color, color3, wave2 * 0.3);
      
      float alpha = waves * falloff * 0.15;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 25, -50]} rotation={[0.2, 0, 0]}>
      <planeGeometry args={[100, 30, 1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Shooting stars
export function ShootingStars() {
  const starsRef = useRef([]);
  const groupRef = useRef();
  
  const shootingStars = useMemo(() => {
    return Array(5).fill(null).map((_, i) => ({
      id: i,
      delay: i * 3,
      duration: 1.5 + Math.random(),
      startX: 30 + Math.random() * 20,
      startY: 20 + Math.random() * 10,
      startZ: -20 - Math.random() * 20,
    }));
  }, []);

  useFrame((state) => {
    starsRef.current.forEach((star, i) => {
      if (star) {
        const data = shootingStars[i];
        const time = (state.clock.elapsedTime + data.delay) % (data.duration + 5);
        
        if (time < data.duration) {
          const progress = time / data.duration;
          star.position.x = data.startX - progress * 60;
          star.position.y = data.startY - progress * 30;
          star.material.opacity = Math.sin(progress * Math.PI) * 0.8;
          star.scale.x = 1 + progress * 2;
        } else {
          star.material.opacity = 0;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {shootingStars.map((star, i) => (
        <mesh
          key={star.id}
          ref={(el) => (starsRef.current[i] = el)}
          position={[star.startX, star.startY, star.startZ]}
          rotation={[0, 0, -Math.PI / 4]}
        >
          <planeGeometry args={[0.3, 0.02]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
