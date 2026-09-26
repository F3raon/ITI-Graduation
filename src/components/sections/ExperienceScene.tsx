import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA, ExperienceItem } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';

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
      <RoundedBox args={[4.2, 1.2, 0.1]} radius={0.04} smoothness={2} castShadow>
        <meshStandardMaterial
          color="#05080c"
          metalness={0.88}
          roughness={0.2}
          emissive={accentColor}
          emissiveIntensity={hovered ? 0.3 : 0.05}
        />
      </RoundedBox>

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

import { useScrollProgress } from '../../context/ScrollContext';

export function ExperienceScene({ position = [0, 0, -48] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.58 : aspect < 1.25 ? 0.74 : aspect < 1.6 ? 0.9 : 1.0;

  const { progress } = useScrollProgress();
  const isActive = progress > 0.77 && progress < 0.88;
  
  if (!isActive) return null;

  // Map scroll progress (0.79 to 0.84) to move the timeline forward
  const progressRatio = Math.max(0, Math.min(1, (progress - 0.79) / 0.05));
  // Total Z distance to move = (number of items - 1) * spacing
  const maxZTravel = (PORTFOLIO_DATA.experience.length - 1) * 2.2;
  const timelineZ = progressRatio * maxZTravel;

  return (
    <group position={position} scale={scale}>
      {/* Chamber Architectural Dark Backdrop */}
      <mesh position={[0, 0.8, -2.2]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#030508" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Section Header */}
      <group position={[0, 4.2, -2]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#94a3b8" anchorX="center" letterSpacing={0.22}>
          // CHRONOLOGICAL TRAJECTORY
        </Text>
        <Text position={[0, -0.75, 0]} fontSize={0.72} color="#f8fafc" anchorX="center" fontWeight={900}>
          EXPERIENCE HALL
        </Text>
        <Text position={[0, -1.4, 0]} fontSize={0.14} color="#38bdf8" anchorX="center" letterSpacing={0.08}>
          PROFESSIONAL MILESTONES & ACHIEVEMENTS // SCROLL TO ADVANCE
        </Text>
      </group>

      {/* Glowing Central Timeline Rail (Z-axis) */}
      <mesh position={[0, -0.6, -4]}>
        <boxGeometry args={[0.04, 0.04, 9]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
      </mesh>

      {/* Timeline Milestones sliding along Z axis */}
      <group position={[0, 0, timelineZ]}>
        {PORTFOLIO_DATA.experience.map((item, i) => {
          // Calculate opacity based on distance to center (0)
          const nodeZ = -i * 2.2 + timelineZ;
          const distance = Math.abs(nodeZ);
          const opacity = Math.max(0.1, 1 - distance * 0.4);

          return (
            <group key={item.company + item.period} position={[0, 0, -i * 2.2]} scale={opacity > 0.8 ? 1 : 0.85}>
              <ExperienceNode
                item={item}
                position={[i % 2 === 0 ? -2.8 : 2.8, -0.2, 0]}
                index={i}
              />
            </group>
          );
        })}
      </group>
    </group>
  );
}
