import { useState } from 'react';
import { AhmedCharacter } from './AhmedCharacter';
import { CharacterLighting } from './CharacterLighting';
import { CharacterParticles } from './CharacterParticles';
import { CharacterEffects } from './CharacterEffects';
import { CharacterRotation } from './CharacterRotation';
import { CharacterTransformationFrame } from './CharacterTransformation';
import { Text } from '@react-three/drei';

export interface CharacterControllerProps {
  position?: [number, number, number];
  progress?: number;
  rotationY?: number;
  rotationX?: number;
  onSelectAngle?: (deg: number) => void;
  showTransformationFrame?: boolean;
}

export function CharacterController({
  position = [0, 0, 0],
  progress = 0.5,
  rotationY = 0,
  rotationX = 0,
  onSelectAngle,
  showTransformationFrame = true,
}: CharacterControllerProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      {/* Dynamic Transformation Lighting Rig */}
      <CharacterLighting progress={progress} />

      {/* Ambient Energy Sparks & Lightning Particles */}
      <CharacterParticles count={140} progress={progress} />

      {/* Cyber Aura and Rings */}
      <CharacterEffects progress={progress} />

      {/* 360 Turntable Base Platform */}
      <CharacterRotation
        rotationY={rotationY}
        onSelectAngle={onSelectAngle}
        isInteractive={true}
      />

      {/* Ahmed Hamada 3D Character */}
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <AhmedCharacter
          position={[0, 0, 0]}
          rotationY={rotationY}
          rotationX={rotationX}
          scale={1}
          progress={progress}
          isInteractive={true}
        />
      </group>

      {/* Real Portrait Transformation Frame placed to the left */}
      {showTransformationFrame && (
        <group position={[-3.6, 1.4, 0]}>
          <CharacterTransformationFrame progress={progress} />
        </group>
      )}

      {/* 3D Section Callouts */}
      <group position={[0, 3.4, 0]}>
        <Text fontSize={0.16} color="#94a3b8" anchorX="center" letterSpacing={0.2}>
          // 3D CHARACTER SYSTEM // 360° INTERACTIVE
        </Text>
        <Text position={[0, -0.32, 0]} fontSize={0.48} color="#f8fafc" anchorX="center" fontWeight={900}>
          AHMED HAMADA
        </Text>
        <Text position={[0, -0.68, 0]} fontSize={0.14} color="#00f0ff" anchorX="center" letterSpacing={0.15}>
          {`STAGE: ${
            progress < 0.25
              ? 'REAL IDENTITY'
              : progress < 0.5
              ? 'ENERGY TRANSITION'
              : progress < 0.75
              ? 'STYLIZED 3D'
              : 'FULL NEON CYBER'
          }`}
        </Text>
      </group>
    </group>
  );
}
