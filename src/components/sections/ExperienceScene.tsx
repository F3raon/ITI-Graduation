import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA, ExperienceItem } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';
import { scrollStore } from '../../context/ScrollContext';

function ExperienceNode({
  item,
  position,
  index,
}: {
  item: ExperienceItem;
  position: [number, number, number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetZ = position[2] + (hovered ? 0.4 : 0);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 1 - Math.exp(-6 * delta));
  });

  const accentColor = index === 0 ? '#ff8a30' : index === 1 ? '#67c9ff' : '#a855f7';

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
      {/* 3D Floating Glass Milestone Block */}
      <RoundedBox args={[4.2, 1.2, 0.12]} radius={0.06} smoothness={3}>
        <meshPhysicalMaterial
          color="#05080c"
          metalness={0.9}
          roughness={0.15}
          emissive={accentColor}
          emissiveIntensity={hovered ? 0.25 : 0.02}
          transparent
          opacity={0.9}
        />
      </RoundedBox>

      {/* Holographic Backing Plate */}
      <mesh position={[0, 0, -0.07]}>
        <planeGeometry args={[4.25, 1.25]} />
        <meshBasicMaterial color={accentColor} transparent opacity={hovered ? 0.3 : 0.08} />
      </mesh>

      {/* Date Marker Tag */}
      <Text position={[-1.9, 0.4, 0.06]} fontSize={0.09} color={accentColor} anchorX="left" fontWeight={700}>
        {item.period}
      </Text>

      {/* Role */}
      <Text position={[-1.9, 0.15, 0.06]} fontSize={0.14} color="#f8fafc" anchorX="left" fontWeight={800} maxWidth={3.8}>
        {item.role}
      </Text>

      {/* Company & Location */}
      <Text position={[-1.9, -0.1, 0.06]} fontSize={0.09} color="#38bdf8" anchorX="left" maxWidth={3.8}>
        {item.company}  //  {item.location}
      </Text>

      {/* Detail snippet */}
      <Text position={[-1.9, -0.35, 0.06]} maxWidth={3.8} fontSize={0.065} color="#94a3b8" anchorX="left" lineHeight={1.4}>
        {item.details[0]}
      </Text>

      {/* Connecting line to center path */}
      <mesh position={[index % 2 === 0 ? 2.3 : -2.3, 0, -0.05]}>
        <boxGeometry args={[0.4, 0.02, 0.02]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>
    </group>
  );
}

export function ExperienceScene({ position = [0, 0, -48] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.55 : aspect < 1.25 ? 0.74 : aspect < 1.6 ? 0.9 : 1.0;

  const [visible, setVisible] = useState(false);

  useFrame(() => {
    const isVisible = scrollStore.current > 0.65 && scrollStore.current < 0.95;
    if (visible !== isVisible) setVisible(isVisible);
  });

  if (!visible) return null;

  return (
    <group position={position} scale={scale}>
      {/* Chamber Architectural Dark Backdrop */}
      <mesh position={[0, 0.8, -1.2]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#030508" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Section Header */}
      <Text position={[0, 3.8, 0]} fontSize={0.16} color="#67c9ff" anchorX="center" letterSpacing={0.22}>
        // CHRONOLOGICAL TRAJECTORY
      </Text>
      <Text position={[0, 3.1, 0]} fontSize={0.65} color="#f8fafc" anchorX="center" fontWeight={900}>
        EXPERIENCE HALL
      </Text>
      <Text position={[0, 2.5, 0]} fontSize={0.13} color="#94a3b8" anchorX="center" letterSpacing={0.08}>
        PROFESSIONAL MILESTONES & ACHIEVEMENTS
      </Text>

      {/* Glowing Central Timeline Rail (Y-axis now) */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.04, 6, 0.04]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>

      {/* Timeline Milestones along Y axis */}
      <group position={[0, 1.2, 0]}>
        {PORTFOLIO_DATA.experience.map((item, i) => {
          const isLeft = i % 2 === 0;
          const isMobile = aspect < 0.9;
          const x = isMobile ? 0 : (isLeft ? -2.6 : 2.6);
          const y = -i * 1.5;
          return (
            <ExperienceNode
              key={item.company + item.period}
              item={item}
              position={[x, y, 0]}
              index={i}
            />
          );
        })}
      </group>
    </group>
  );
}
