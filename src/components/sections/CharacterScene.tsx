import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AhmedCharacter } from '../character/AhmedCharacter';
import { CharacterLighting } from '../character/CharacterLighting';
import { CharacterParticles } from '../character/CharacterParticles';
import { CharacterEffects } from '../character/CharacterEffects';
import { scrollStore } from '../../context/ScrollContext';
import { WORLD } from '../../data/world';
import { SECTION_MAP, sectionProgress } from '../../data/sections';
import * as THREE from 'three';

export interface CharacterSceneProps {
  position?: [number, number, number];
}

const CHARACTER_BOUNDS = {
  start: SECTION_MAP['REAL_AHMED'].start,
  end: SECTION_MAP['NEON'].end,
};

export function CharacterScene({
  position = [0, -0.5, WORLD.CHARACTER_Z],
}: CharacterSceneProps) {
  const [progress, setProgress] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.75 : aspect < 1.3 ? 0.9 : 1.0;

  useFrame(() => {
    const p = sectionProgress(scrollStore.current, CHARACTER_BOUNDS as any);
    if (Math.abs(p - progress) > 0.002) {
      setProgress(p);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Cinematic lighting tuned to transformation state */}
      <CharacterLighting progress={progress} />

      {/* Electric particles around the dais */}
      <CharacterParticles count={80} progress={progress} />

      {/* Energy ring effects */}
      <CharacterEffects progress={progress} />

      {/* Ahmed Portrait — Real → Neon scroll-driven transformation */}
      <AhmedCharacter
        position={[0, 0, 0]}
        scale={1}
        progress={progress}
      />
    </group>
  );
}
