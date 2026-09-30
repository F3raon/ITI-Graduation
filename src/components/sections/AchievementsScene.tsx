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

      {/* Trophy Pedestal Display Stand (Sleeker and attached to base) */}
      <group position={[0, -0.8, 0]}>
        <RoundedBox args={[2.8, 1.4, 0.06]} radius={0.05} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#05080c"
            metalness={0.8}
            roughness={0.2}
            emissive={item.color}
            emissiveIntensity={hovered ? 0.3 : 0.05}
            transparent
            opacity={0.85}
          />
        </RoundedBox>

        {/* Holographic Backing Plate (Sleeker border) */}
        <mesh position={[0, 0, -0.04]}>
          <planeGeometry args={[2.85, 1.45]} />
          <meshBasicMaterial color={item.color} transparent opacity={hovered ? 0.25 : 0.05} />
        </mesh>

        {/* Badge / Rank Ribbon */}
        <Text position={[0, 0.45, 0.04]} fontSize={0.11} color={item.color} anchorX="center" fontWeight={900} letterSpacing={0.05}>
          {item.rank.toUpperCase()} // {item.year}
        </Text>

        {/* Title */}
        <Text position={[0, 0.2, 0.04]} fontSize={0.15} color="#f8fafc" anchorX="center" fontWeight={900} letterSpacing={0.02}>
          {item.title.toUpperCase()}
        </Text>

        {/* Competition */}
        <Text position={[0, 0.0, 0.04]} fontSize={0.09} color="#67c9ff" anchorX="center" fontWeight="bold">
          {item.competition}
        </Text>

        {/* Description */}
        <Text
          position={[0, -0.3, 0.04]}
          maxWidth={2.5}
          fontSize={0.075}
          color="#94a3b8"
          anchorX="center"
          lineHeight={1.5}
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
      <Text position={[0, 3.6, 0]} fontSize={0.16} color="#ffc83b" anchorX="center" letterSpacing={0.22}>
        // HONORS & RECOGNITION
      </Text>
      <Text position={[0, 2.9, 0]} fontSize={0.58} color="#f8fafc" anchorX="center" fontWeight={900}>
        ACHIEVEMENTS CHAMBER
      </Text>
      <Text position={[0, 2.3, 0]} fontSize={0.12} color="#94a3b8" anchorX="center" letterSpacing={0.08}>
        COMPETITIVE ROBOTICS, CLOUD COMPUTING & SPACE INNOVATION AWARDS
      </Text>

      {/* 4 Trophies arranged across the chamber */}
      <group position={[0, 0, 0]}>
        {PORTFOLIO_DATA.achievements.map((item, i) => {
          const isMobile = aspect < 0.9;
          
          // 2x2 Grid Layout to fit within camera view
          const col = i % 2;
          const row = Math.floor(i / 2);
          
          const xSpacing = isMobile ? 3.0 : 3.4;
          const ySpacing = isMobile ? 2.9 : 2.6; // Tighter vertical spacing so they don't clip floor
          
          const x = (col - 0.5) * xSpacing;
          const y = (0.5 - row) * ySpacing + 0.6; // Center the grid at Y = 0.6

          return (
            <AchievementPedestal
              key={item.id}
              item={item}
              position={[x, y, 0]}
            />
          );
        })}
      </group>
    </group>
  );
}
