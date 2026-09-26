import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CharacterLighting({ progress = 0.5 }: { progress?: number }) {
  const warmLightRef = useRef<THREE.PointLight>(null);
  const cyanLightRef = useRef<THREE.PointLight>(null);
  const purpleLightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2;
    if (cyanLightRef.current) {
      cyanLightRef.current.intensity = (4 + progress * 8) + pulse;
    }
    if (purpleLightRef.current) {
      purpleLightRef.current.intensity = (2 + progress * 6) + pulse;
    }
  });

  // Color interpolations: warm for Real (0.0) -> electric blue/magenta for Neon (1.0)
  const warmIntensity = Math.max(0.5, (1 - progress) * 6);
  const neonCyanIntensity = 2 + progress * 10;
  const neonPurpleIntensity = 1 + progress * 8;

  return (
    <group>
      {/* Warm Key Light for Real Ahmed */}
      <pointLight
        ref={warmLightRef}
        position={[2, 3, 3]}
        intensity={warmIntensity}
        distance={10}
        color="#ffecd1"
        castShadow
      />

      {/* Cyber Cyan Fill / Rim Light */}
      <pointLight
        ref={cyanLightRef}
        position={[-2.5, 2.5, 2]}
        intensity={neonCyanIntensity}
        distance={12}
        color="#00f0ff"
      />

      {/* Neon Purple Backlight / Silhouette Rim */}
      <pointLight
        ref={purpleLightRef}
        position={[0, 3, -3]}
        intensity={neonPurpleIntensity}
        distance={10}
        color="#a855f7"
      />

      {/* Ground Floor Underglow */}
      <pointLight
        position={[0, -0.4, 0]}
        intensity={progress * 5 + 1}
        distance={4}
        color={progress > 0.5 ? '#67c9ff' : '#ff8a30'}
      />
    </group>
  );
}
