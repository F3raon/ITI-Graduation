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
      <RoundedBox args={[5.2, 1.55, 0.18]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#080c14"
          metalness={0.88}
          roughness={0.2}
          emissive={accentColor}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </RoundedBox>

      {/* Accent Side Bar */}
      <mesh position={[-2.55, 0, 0.1]}>
        <boxGeometry args={[0.06, 1.4, 0.04]} />
        <meshBasicMaterial color={accentColor} />
      </mesh>

      {/* Date Marker Tag */}
      <Text position={[-2.35, 0.52, 0.12]} fontSize={0.105} color={accentColor} anchorX="left" fontWeight={700}>
        {item.period}
      </Text>

      {/* Role */}
      <Text position={[-2.35, 0.24, 0.12]} fontSize={0.175} color="#f8fafc" anchorX="left" fontWeight={800} maxWidth={4.8}>
        {item.role}
      </Text>

      {/* Company & Location */}
      <Text position={[-2.35, -0.08, 0.12]} fontSize={0.11} color="#38bdf8" anchorX="left" maxWidth={4.5}>
        {item.company}  //  {item.location}
      </Text>

      {/* First bullet snippet */}
      <Text position={[-2.35, -0.38, 0.12]} maxWidth={4.7} fontSize={0.075} color="#94a3b8" anchorX="left" lineHeight={1.35}>
        {item.details[0]}
      </Text>

      {/* Milestone Indicator Sphere on Timeline Rail */}
      <group position={[-3.0, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.14, 24, 24]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={hovered ? 2 : 0.8}
          />
        </mesh>
      </group>
    </group>
  );
}

export function ExperienceScene({ position = [0, 0, -48] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.58 : aspect < 1.25 ? 0.74 : aspect < 1.6 ? 0.9 : 1.0;

  return (
    <group position={position} scale={scale}>
      {/* Chamber Architectural Dark Backdrop */}
      <mesh position={[0, 0.8, -2.2]} receiveShadow>
        <planeGeometry args={[28, 14]} />
        <meshStandardMaterial color="#030508" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Section Header */}
      <Text position={[-6.2, 3.6, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // CHRONOLOGICAL TRAJECTORY
      </Text>
      <Text position={[-6.2, 2.85, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        EXPERIENCE HALL
      </Text>
      <Text position={[-6.2, 2.2, 0]} fontSize={0.14} color="#67c9ff" anchorX="left" letterSpacing={0.08}>
        PROFESSIONAL MILESTONES & ACHIEVEMENTS
      </Text>

      {/* Glowing Central Timeline Rail */}
      <mesh position={[-3.0, -0.0, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 7.2, 16]} />
        <meshBasicMaterial color="#ff8a30" />
      </mesh>

      {/* Timeline Milestones */}
      <group position={[0.5, 0, 0]}>
        {PORTFOLIO_DATA.experience.slice(0, 4).map((item, i) => (
          <ExperienceNode
            key={item.company + item.period}
            item={item}
            position={[0, 1.85 - i * 1.82, 0]}
            index={i}
          />
        ))}
      </group>

      {/* Right Column Architecture Monolith */}
      <group position={[5.2, -0.2, 0]}>
        <RoundedBox args={[2.8, 5.0, 0.3]} radius={0.15} smoothness={4} castShadow>
          <meshStandardMaterial color="#090f18" metalness={0.85} roughness={0.25} emissive="#0369a1" emissiveIntensity={0.18} />
        </RoundedBox>
        <Text position={[0, 1.9, 0.18]} fontSize={0.26} color="#ff8a30" anchorX="center" fontWeight={800}>
          LEAD
        </Text>
        <Text position={[0, 1.0, 0.18]} fontSize={0.26} color="#67c9ff" anchorX="center" fontWeight={800}>
          ARCHITECT
        </Text>
        <Text position={[0, 0.1, 0.18]} fontSize={0.26} color="#ffffff" anchorX="center" fontWeight={800}>
          DEPLOY
        </Text>
        <Text position={[0, -0.8, 0.18]} fontSize={0.26} color="#ff8a30" anchorX="center" fontWeight={800}>
          SCALE
        </Text>
        <Text position={[0, -1.6, 0.18]} fontSize={0.09} color="#94a3b8" anchorX="center" letterSpacing={0.15}>
          PRODUCTION RIGOR
        </Text>
      </group>
    </group>
  );
}
