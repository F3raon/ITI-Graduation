import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { IDENTITY_DATA } from '../../data/identity';

export function CharacterTransformationFrame({
  position = [0, 0, 0],
  progress = 0.5,
  onSliderChange,
}: {
  position?: [number, number, number];
  progress: number;
  onSliderChange?: (val: number) => void;
}) {
  const realTexture = useTexture(IDENTITY_DATA.realPortraitImage);
  const scanlineRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (scanlineRef.current) {
      scanlineRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.8) * 1.6;
    }
    if (frameRef.current) {
      frameRef.current.rotation.y = THREE.MathUtils.lerp(
        frameRef.current.rotation.y,
        state.pointer.x * 0.08,
        1 - Math.exp(-4 * delta)
      );
    }
  });

  // Calculate opacity and colors according to transformation stage
  const realPhotoOpacity = Math.max(0.1, 1 - progress * 1.2);
  const cyberOverlayOpacity = progress * 0.85;

  return (
    <group ref={frameRef} position={position}>
      {/* Outer Metallic Beveled Frame */}
      <RoundedBox args={[3.2, 4.4, 0.22]} radius={0.12} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#090d16"
          metalness={0.92}
          roughness={0.18}
          emissive={progress > 0.5 ? '#0284c7' : '#ff8a30'}
          emissiveIntensity={0.25}
        />
      </RoundedBox>

      {/* Frame Top Header */}
      <group position={[0, 1.95, 0.12]}>
        <Text fontSize={0.085} color="#94a3b8" anchorX="center" letterSpacing={0.18}>
          IDENTITY MATRIX // TRANSFORMATION PIPELINE
        </Text>
      </group>

      {/* Real Photo Plane */}
      <mesh position={[0, 0, 0.12]}>
        <planeGeometry args={[2.8, 3.4]} />
        <meshBasicMaterial
          map={realTexture}
          transparent
          opacity={realPhotoOpacity}
          toneMapped={false}
        />
      </mesh>

      {/* Cyber Blue Energy Filter Plane */}
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[2.8, 3.4]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={cyberOverlayOpacity * 0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Moving Holographic Laser Scanline */}
      <mesh ref={scanlineRef} position={[0, 0, 0.14]}>
        <planeGeometry args={[2.8, 0.04]} />
        <meshBasicMaterial
          color={progress > 0.5 ? '#00f0ff' : '#ff8a30'}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Emissive Corner Targeting Brackets */}
      {[-1.35, 1.35].map((x) =>
        [-1.65, 1.65].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.15]}>
            <boxGeometry args={[0.18, 0.18, 0.02]} />
            <meshBasicMaterial color={progress > 0.5 ? '#00f0ff' : '#ff8a30'} />
          </mesh>
        ))
      )}

      {/* Stage Badge Display below image */}
      <group position={[0, -1.95, 0.12]}>
        <RoundedBox args={[2.6, 0.38, 0.04]} radius={0.06} smoothness={2}>
          <meshStandardMaterial color="#020617" emissive="#0284c7" emissiveIntensity={0.2} />
        </RoundedBox>
        <Text position={[0, 0, 0.04]} fontSize={0.09} color="#38bdf8" anchorX="center" fontWeight={700} letterSpacing={0.14}>
          {`STAGE: ${Math.round(progress * 100)}% // ${
            progress < 0.25
              ? 'REAL PHOTO'
              : progress < 0.5
              ? 'ENERGY LIGHTING'
              : progress < 0.75
              ? 'STYLIZED 3D'
              : progress < 0.95
              ? 'CYBER LIGHTNING'
              : 'FULL NEON AHMED'
          }`}
        </Text>
      </group>
    </group>
  );
}
