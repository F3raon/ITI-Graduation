import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { neonStore } from '../../context/NeonContext';

export function NeonHUD() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    const neonT = neonStore.current;
    
    // Scale and fade HUD based on neon state
    const scale = 0.5 + neonT * 0.5;
    groupRef.current.scale.set(scale, scale, scale);
    
    // Parallax floating
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 1.5) * 0.05;
    
    groupRef.current.children.forEach((child) => {
      if ((child as any).material) {
        (child as any).material.opacity = neonT * 0.85; // controlled fade in
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0.2]}>
      {/* Left HUD element */}
      <group position={[-1.6, 0.5, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.08, 0.4]} />
          <meshBasicMaterial color="#00f0ff" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <Text position={[0.2, 0.15, 0]} fontSize={0.08} color="#00f0ff" anchorX="left">
          SYS.NEON_OVERRIDE
        </Text>
        <Text position={[0.2, 0.0, 0]} fontSize={0.06} color="#94a3b8" anchorX="left">
          ENERGY MAX
        </Text>
      </group>

      {/* Right HUD element */}
      <group position={[1.4, -0.3, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.4, 0.04]} />
          <meshBasicMaterial color="#f59e0b" transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <Text position={[0.1, 0.1, 0]} fontSize={0.07} color="#f59e0b" anchorX="center">
          STABILIZED
        </Text>
      </group>
    </group>
  );
}
