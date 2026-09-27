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

// Scroll window for the character transformation:
// global scroll 0.24 → real Ahmed visible
// global scroll 0.24 → 0.51 full transformation arc
const SCROLL_START = 0.24;
const SCROLL_END   = 0.51;

export function CharacterScene({
  position = [0, -0.6, -9.5],
}: CharacterSceneProps) {
  const [progress, setProgress] = useState(0);
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.75 : aspect < 1.3 ? 0.88 : 1.0;

  useFrame(() => {
    const s = scrollStore.current;
    let p = 0;
    if (s < SCROLL_START) {
      p = 0.0;
    } else if (s <= SCROLL_END) {
      p = (s - SCROLL_START) / (SCROLL_END - SCROLL_START);
    } else {
      p = 1.0;
    }
    p = Math.max(0, Math.min(1, p));
    if (Math.abs(p - progress) > 0.003) {
      setProgress(p);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Dynamic Lighting Rig tuned to transformation progress */}
      <CharacterLighting progress={progress} />

      {/* Cyber Particle Sparks swirling around the dais */}
      <CharacterParticles count={120} progress={progress} />

      {/* Dynamic Energy Rings */}
      <CharacterEffects progress={progress} />

      {/* Ahmed Hamada — PNG Portrait System with Cinematic Transformation */}
      <AhmedCharacter
        position={[0, 0, 0]}
        scale={1}
        progress={progress}
      />
    </group>
  );
}
