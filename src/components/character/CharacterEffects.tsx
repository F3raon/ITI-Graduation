import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CharacterEffects({ progress = 0.5 }: { progress?: number }) {
  const ringRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += delta * (0.4 + progress * 1.2);
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.15;
    }
    if (auraRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.04 * progress;
      auraRef.current.scale.set(s, s, s);
    }
  });

  if (progress < 0.1) return null;

  return (
    <group position={[0, 1.4, 0]}>
      {/* Floating Holographic Energy Rings */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[1.3, 0.012, 16, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={progress * 0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[1.5, 0.009, 16, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={progress * 0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* Cyber Energy Aura Mesh around Torso */}
      <mesh ref={auraRef} position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.7, 0.6, 1.8, 24, 1, true]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={progress * 0.22}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
