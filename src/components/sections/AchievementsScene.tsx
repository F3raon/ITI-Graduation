import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA, AchievementItem } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';

function TrophyObject({ rank, color, hovered }: { rank: string; color: string; hovered: boolean }) {
  const trophyRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (trophyRef.current) {
      trophyRef.current.rotation.y += delta * (hovered ? 2.5 : 0.8);
    }
  });

  return (
    <group ref={trophyRef} position={[0, 0.6, 0]} scale={0.85}>
      {/* Trophy Stepped Base */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.16, 24]} />
        <meshStandardMaterial color="#090d14" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Stem */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.35, 16]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.15} />
      </mesh>

      {/* Trophy Chalice Cup / Medal Star */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.12, 0.45, 24, 1, true]} />
        <meshStandardMaterial
          color={color}
          metalness={0.98}
          roughness={0.12}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Handles */}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.14, 0.03, 12, 24]} />
          <meshStandardMaterial color={color} metalness={0.95} roughness={0.15} />
        </mesh>
      ))}

      {/* Floating Rank Emblem */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
        <mesh position={[0, 0.65, 0]}>
          <octahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={1} />
        </mesh>
      </Float>
    </group>
  );
}

function AchievementPedestal({
  item,
  position,
}: {
  item: AchievementItem;
  position: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetZ = position[2] + (hovered ? 0.45 : 0);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 1 - Math.exp(-6 * delta));
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        soundEngine.playHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {/* 3D Illuminated Rotating Trophy */}
      <TrophyObject rank={item.rank} color={item.color} hovered={hovered} />

      {/* Trophy Pedestal Display Stand */}
      <group position={[0, -0.85, 0]}>
        <RoundedBox args={[2.8, 1.45, 0.22]} radius={0.08} smoothness={4} castShadow>
          <meshStandardMaterial
            color="#080c14"
            metalness={0.88}
            roughness={0.2}
            emissive={item.color}
            emissiveIntensity={hovered ? 0.4 : 0.1}
          />
        </RoundedBox>

        {/* Badge / Rank Ribbon */}
        <Text position={[0, 0.46, 0.12]} fontSize={0.12} color={item.color} anchorX="center" fontWeight={800}>
          {item.rank} // {item.year}
        </Text>

        {/* Title */}
        <Text position={[0, 0.18, 0.12]} fontSize={0.165} color="#f8fafc" anchorX="center" fontWeight={800}>
          {item.title}
        </Text>

        {/* Competition */}
        <Text position={[0, -0.08, 0.12]} fontSize={0.1} color="#67c9ff" anchorX="center">
          {item.competition}
        </Text>

        {/* Description */}
        <Text
          position={[0, -0.4, 0.12]}
          maxWidth={2.5}
          fontSize={0.07}
          color="#94a3b8"
          anchorX="center"
          lineHeight={1.35}
        >
          {item.description}
        </Text>

        {/* Dedicated Spotlight */}
        <spotLight
          position={[0, 2.8, 1.2]}
          angle={0.5}
          penumbra={0.7}
          intensity={hovered ? 40 : 15}
          color={item.color}
        />
      </group>
    </group>
  );
}

export function AchievementsScene({ position = [0, 0, -82] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.6 : aspect < 1.25 ? 0.76 : aspect < 1.6 ? 0.92 : 1.0;

  return (
    <group position={position} scale={scale}>
      {/* Chamber Architectural Dark Backdrop to isolate room view */}
      <mesh position={[0, 1.2, -2.2]} receiveShadow>
        <planeGeometry args={[24, 12]} />
        <meshStandardMaterial color="#030508" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Section Header */}
      <Text position={[-6.2, 3.6, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // HONORS & RECOGNITION
      </Text>
      <Text position={[-6.2, 2.85, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        ACHIEVEMENTS CHAMBER
      </Text>
      <Text position={[-6.2, 2.2, 0]} fontSize={0.14} color="#ffc83b" anchorX="left" letterSpacing={0.08}>
        COMPETITIVE ROBOTICS, CLOUD COMPUTING & SPACE INNOVATION AWARDS
      </Text>

      {/* 4 Trophies arranged across the chamber */}
      <group position={[0, 0, 0]}>
        {PORTFOLIO_DATA.achievements.map((item, i) => {
          const total = PORTFOLIO_DATA.achievements.length;
          const spacing = total > 4 ? 2.8 : 3.4;
          const x = (i - (total - 1) / 2) * spacing;
          return (
            <AchievementPedestal
              key={item.id}
              item={item}
              position={[x, 0, 0]}
            />
          );
        })}
      </group>
    </group>
  );
}
