import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AhmedCharacter } from '../character/AhmedCharacter';
import { CharacterLighting } from '../character/CharacterLighting';
import { CharacterParticles } from '../character/CharacterParticles';
import { CharacterEffects } from '../character/CharacterEffects';
import { scrollStore } from '../../context/ScrollContext';
import * as THREE from 'three';

export interface CharacterSceneProps {
  position?: [number, number, number];
}

export function CharacterScene({
  position = [0, -0.6, -8.0],
}: CharacterSceneProps) {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0.5);

  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.75 : aspect < 1.3 ? 0.88 : 1.0;

  useFrame(() => {
    const s = scrollStore.current;
    // Scroll interval for character transformation:
    // 0.24 -> 0.32 (Real Portrait → Full Neon)
    let p = 0;
    if (s < 0.24) {
      p = 0.0;
    } else if (s <= 0.32) {
      p = (s - 0.24) / 0.08;
    } else {
      p = 1.0;
    }
    p = Math.max(0, Math.min(1, p));
    if (Math.abs(p - currentProgress) > 0.005) {
      setCurrentProgress(p);
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale]}
      onPointerDown={(e) => {
        setDragStart({ x: e.clientX, y: e.clientY });
      }}
      onPointerMove={(e) => {
        if (!dragStart) return;
        const dx = (e.clientX - dragStart.x) * 0.008;
        const dy = (e.clientY - dragStart.y) * 0.004;
        setRotationY((prev) => prev + dx);
        setRotationX((prev) => Math.max(-0.25, Math.min(0.25, prev + dy)));
        setDragStart({ x: e.clientX, y: e.clientY });
      }}
      onPointerUp={() => setDragStart(null)}
      onPointerLeave={() => setDragStart(null)}
    >
      {/* Dynamic Lighting Rig tuned to transformation progress */}
      <CharacterLighting progress={currentProgress} />

      {/* Cyber Particle Sparks swirling around the dais */}
      <CharacterParticles count={120} progress={currentProgress} />

      {/* Dynamic Energy Rings */}
      <CharacterEffects progress={currentProgress} />

      {/* Approved Ahmed Hamada 3D Character System */}
      <AhmedCharacter
        position={[0, 0, 0]}
        rotationY={rotationY}
        rotationX={rotationX}
        scale={1}
        progress={currentProgress}
        isInteractive={true}
      />
    </group>
  );
}
