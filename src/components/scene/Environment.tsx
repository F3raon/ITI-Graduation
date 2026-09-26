import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Environment() {
  const particlesRef = useRef<THREE.Group>(null);
  const skylineRef = useRef<THREE.Group>(null);

  // Generate 850 floating dust motes & star particles across the world depth
  const particles = useMemo(() => {
    return Array.from({ length: 850 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 45,
        -Math.random() * 135 + 20,
      ] as [number, number, number],
      size: 0.015 + Math.random() * 0.045,
      color: i % 4 === 0 ? '#ff8a30' : i % 3 === 0 ? '#67c9ff' : '#94a3b8',
    }));
  }, []);

  // Cyberpunk skyline buildings for the window / horizon backdrop
  const buildings = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => {
      const angle = (i / 32) * Math.PI * 0.9 - Math.PI * 0.45;
      const dist = 32 + Math.random() * 14;
      const height = 12 + Math.random() * 26;
      const width = 2.5 + Math.random() * 3.5;
      return {
        pos: [Math.sin(angle) * dist, height / 2 - 8, -Math.cos(angle) * dist - 8] as [number, number, number],
        size: [width, height, width] as [number, number, number],
        color: i % 2 === 0 ? '#060c14' : '#04080e',
        glowColor: i % 3 === 0 ? '#ff8a30' : '#38bdf8',
      };
    });
  }, []);

  useFrame((state, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.006;
      particlesRef.current.position.x = state.pointer.x * -0.3;
      particlesRef.current.position.y = state.pointer.y * 0.15;
    }
  });

  return (
    <group>
      {/* Background stars / dust */}
      <group ref={particlesRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.pos}>
            <sphereGeometry args={[p.size, 6, 6]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.75} />
          </mesh>
        ))}
      </group>

      {/* Cyberpunk City Skyline in background */}
      <group ref={skylineRef} position={[0, -2, 0]}>
        {buildings.map((b, i) => (
          <group key={i} position={b.pos}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={b.size} />
              <meshStandardMaterial color={b.color} metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Window beacon stripes */}
            <mesh position={[0, b.size[1] * 0.35, b.size[2] * 0.51]}>
              <planeGeometry args={[b.size[0] * 0.6, 0.4]} />
              <meshBasicMaterial color={b.glowColor} />
            </mesh>
            <mesh position={[0, b.size[1] * 0.48, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 2, 8]} />
              <meshBasicMaterial color="#ff3333" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Continuous cyber grid floor extending across the voyage */}
      <mesh position={[0, -3.2, -60]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 160]} />
        <meshStandardMaterial color="#020509" roughness={0.6} metalness={0.8} />
      </mesh>
      <gridHelper
        args={[160, 80, '#ff8a30', '#0a1d30']}
        position={[0, -3.18, -60]}
      />
    </group>
  );
}
