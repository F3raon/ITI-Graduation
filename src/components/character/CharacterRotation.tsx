import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

const ANGLE_PRESETS = [
  { name: 'FRONT', deg: 0, rad: 0 },
  { name: 'FRONT L', deg: 45, rad: Math.PI / 4 },
  { name: 'LEFT', deg: 90, rad: Math.PI / 2 },
  { name: 'BACK L', deg: 135, rad: (3 * Math.PI) / 4 },
  { name: 'BACK', deg: 180, rad: Math.PI },
  { name: 'BACK R', deg: 225, rad: (5 * Math.PI) / 4 },
  { name: 'RIGHT', deg: 270, rad: (3 * Math.PI) / 2 },
  { name: 'FRONT R', deg: 315, rad: (7 * Math.PI) / 4 },
];

export function CharacterRotation({
  rotationY,
  onSelectAngle,
  isInteractive = true,
}: {
  rotationY: number;
  onSelectAngle?: (deg: number) => void;
  isInteractive?: boolean;
}) {
  const radius = 1.65;

  return (
    <group position={[0, -0.05, 0]}>
      {/* Heavy High-Tech Turntable Base Platform */}
      <mesh receiveShadow position={[0, -0.06, 0]}>
        <cylinderGeometry args={[1.8, 1.9, 0.12, 48]} />
        <meshStandardMaterial
          color="#070b13"
          metalness={0.92}
          roughness={0.2}
          emissive="#0284c7"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Outer Glowing Cyan Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[1.72, 1.76, 64]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Inner Subtle Rotating Grid Disk */}
      <mesh rotation={[-Math.PI / 2, 0, rotationY]} position={[0, 0.012, 0]}>
        <ringGeometry args={[0.3, 1.68, 48]} />
        <meshBasicMaterial color="#0e1726" />
      </mesh>

      {/* 8 Directional Angle Nodes matching Concept Sheet */}
      {ANGLE_PRESETS.map((preset) => {
        const x = Math.sin(preset.rad) * radius;
        const z = Math.cos(preset.rad) * radius;
        const normalizedRot = ((rotationY % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        const diff = Math.min(
          Math.abs(normalizedRot - preset.rad),
          Math.PI * 2 - Math.abs(normalizedRot - preset.rad)
        );
        const isActive = diff < 0.35;

        return (
          <group
            key={preset.name}
            position={[x, 0.04, z]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectAngle?.(preset.deg);
            }}
          >
            {/* Small interactive marker pad */}
            <RoundedBox args={[0.26, 0.04, 0.12]} radius={0.02} smoothness={2}>
              <meshStandardMaterial
                color="#0b111e"
                emissive={isActive ? '#ff8a30' : '#38bdf8'}
                emissiveIntensity={isActive ? 1.5 : 0.3}
                roughness={0.3}
              />
            </RoundedBox>

            {/* Micro label */}
            <Text
              position={[0, 0.06, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={0.045}
              color={isActive ? '#ffffff' : '#94a3b8'}
              anchorX="center"
              anchorY="middle"
              letterSpacing={0.1}
            >
              {preset.name}
            </Text>
          </group>
        );
      })}

      {/* 360 Degree View Callout Label */}
      <group position={[0, 0.03, radius + 0.3]}>
        <Text
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.065}
          color="#ff8a30"
          anchorX="center"
          letterSpacing={0.18}
        >
          {isInteractive ? '360° INTERACTIVE TURNTABLE // DRAG TO ROTATE' : '360° VIEW'}
        </Text>
      </group>
    </group>
  );
}
