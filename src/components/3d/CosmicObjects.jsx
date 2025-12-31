import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Ring, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Core Glowing Entity
export function CoreEntity({ position = [0, 0, 0], color = '#a855f7', size = 1, onClick }) {
  const meshRef = useRef();
  const glowRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
    }
  });

  return (
    <group position={position}>
      {/* Outer glow */}
      <Sphere ref={glowRef} args={[size * 1.3, 32, 32]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Main sphere */}
      <Sphere
        ref={meshRef}
        args={[size, 64, 64]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.3}
        />
      </Sphere>
      
      {/* Inner core */}
      <Sphere args={[size * 0.6, 32, 32]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </Sphere>

      {/* Point light */}
      <pointLight color={color} intensity={hovered ? 2 : 1} distance={10} />
    </group>
  );
}

// Galaxy Object
export function Galaxy({ position, color, secondaryColor, rotation = [0, 0, 0], scale = 1, onClick, isActive }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += 0.002;
      if (hovered || isActive) {
        groupRef.current.scale.lerp(new THREE.Vector3(scale * 1.2, scale * 1.2, scale * 1.2), 0.1);
      } else {
        groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      }
    }
  });

  // Create spiral arms
  const spiralPoints = [];
  for (let i = 0; i < 200; i++) {
    const angle = (i / 200) * Math.PI * 6;
    const radius = (i / 200) * 3;
    spiralPoints.push(
      Math.cos(angle) * radius,
      (Math.random() - 0.5) * 0.3,
      Math.sin(angle) * radius
    );
  }

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Core */}
      <Sphere args={[0.5, 32, 32]}>
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </Sphere>
      
      {/* Glow */}
      <Sphere args={[0.7, 16, 16]}>
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </Sphere>
      
      {/* Spiral arms as particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={200}
            array={new Float32Array(spiralPoints)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          color={secondaryColor || color}
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Disk */}
      <Ring args={[0.8, 3.5, 64]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      <pointLight color={color} intensity={hovered ? 1.5 : 0.5} distance={8} />
    </group>
  );
}

// Planet with customizable appearance
export function Planet({ 
  position, 
  color, 
  size = 0.5, 
  hasRings = false, 
  type = 'default',
  onClick,
  orbitRadius,
  orbitSpeed = 0.01 
}) {
  const planetRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
    
    if (groupRef.current && orbitRadius) {
      angleRef.current += orbitSpeed;
      groupRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      groupRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
  });

  const getMaterial = () => {
    switch (type) {
      case 'crystalline':
        return (
          <MeshDistortMaterial
            color={color}
            distort={0.4}
            speed={3}
            roughness={0.1}
            metalness={0.9}
            emissive={color}
            emissiveIntensity={0.3}
          />
        );
      case 'mechanical':
        return (
          <meshStandardMaterial
            color={color}
            roughness={0.3}
            metalness={0.9}
          />
        );
      case 'molten':
        return (
          <MeshDistortMaterial
            color={color}
            distort={0.2}
            speed={1}
            roughness={0.4}
            emissive="#ff4400"
            emissiveIntensity={0.5}
          />
        );
      default:
        return (
          <meshStandardMaterial
            color={color}
            roughness={0.5}
            metalness={0.5}
            emissive={color}
            emissiveIntensity={hovered ? 0.3 : 0.1}
          />
        );
    }
  };

  return (
    <group ref={groupRef} position={position}>
      <Sphere
        ref={planetRef}
        args={[size, 32, 32]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getMaterial()}
      </Sphere>
      
      {/* Glow */}
      <Sphere args={[size * 1.1, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.1}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Rings */}
      {hasRings && (
        <Ring args={[size * 1.3, size * 2, 32]} rotation={[Math.PI / 2.5, 0.2, 0]}>
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </Ring>
      )}
      
      <pointLight color={color} intensity={0.3} distance={3} />
    </group>
  );
}

// Star (Project representation)
export function Star({ position, color, size = 0.3, name, onClick }) {
  const starRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (starRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      starRef.current.scale.setScalar(hovered ? scale * 1.3 : scale);
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={starRef}
        args={[size, 16, 16]}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshBasicMaterial color={color} />
      </Sphere>
      
      {/* Corona */}
      <Sphere args={[size * 1.5, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      {/* Outer corona */}
      <Sphere args={[size * 2.5, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>
      
      <pointLight color={color} intensity={hovered ? 2 : 1} distance={5} />
    </group>
  );
}

// Orbiting Moon (Tech Stack)
export function Moon({ parentPosition = [0, 0, 0], orbitRadius = 1, color, size = 0.1, speed = 1, name }) {
  const moonRef = useRef();
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((state) => {
    if (moonRef.current) {
      angleRef.current += 0.01 * speed;
      moonRef.current.position.x = parentPosition[0] + Math.cos(angleRef.current) * orbitRadius;
      moonRef.current.position.z = parentPosition[2] + Math.sin(angleRef.current) * orbitRadius;
      moonRef.current.position.y = parentPosition[1] + Math.sin(angleRef.current * 0.5) * (orbitRadius * 0.3);
    }
  });

  return (
    <Trail
      width={0.5}
      length={8}
      color={color}
      attenuation={(t) => t * t}
    >
      <Sphere ref={moonRef} args={[size, 16, 16]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Trail>
  );
}

// Asteroid (Challenge)
export function Asteroid({ position, color = '#666666', size = 0.05 }) {
  const asteroidRef = useRef();
  const initialPos = useRef(position);
  
  useFrame((state) => {
    if (asteroidRef.current) {
      asteroidRef.current.rotation.x += 0.02;
      asteroidRef.current.rotation.y += 0.01;
      asteroidRef.current.position.x = initialPos.current[0] + Math.sin(state.clock.elapsedTime) * 0.2;
      asteroidRef.current.position.y = initialPos.current[1] + Math.cos(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={asteroidRef} position={position}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
}

// Wormhole Portal
export function Wormhole({ position, onClick, isActive }) {
  const portalRef = useRef();
  const innerRef = useRef();
  
  useFrame((state) => {
    if (portalRef.current) {
      portalRef.current.rotation.z += isActive ? 0.05 : 0.01;
    }
    if (innerRef.current) {
      innerRef.current.rotation.z -= isActive ? 0.08 : 0.015;
      const scale = isActive ? 1.5 : 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      innerRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position} onClick={onClick}>
      {/* Outer ring */}
      <Ring ref={portalRef} args={[1.8, 2, 64]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Middle ring */}
      <Ring args={[1.4, 1.7, 64]}>
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Inner vortex */}
      <Ring ref={innerRef} args={[0, 1.3, 64]}>
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </Ring>
      
      {/* Center light */}
      <pointLight color="#a855f7" intensity={isActive ? 3 : 1} distance={10} />
    </group>
  );
}
