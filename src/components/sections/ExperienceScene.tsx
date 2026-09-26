import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
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
      <RoundedBox args={[4.8, 1.45, 0.18]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#080c14"
          metalness={0.88}
          roughness={0.2}
          emissive={index === 0 ? '#ff8a30' : '#0284c7'}
          emissiveIntensity={hovered ? 0.4 : 0.1}
        />
      </RoundedBox>

      {/* Date Marker Tag */}
      <Text position={[-2.15, 0.45, 0.11]} fontSize={0.11} color={index === 0 ? '#ff8a30' : '#67c9ff'} anchorX="left" fontWeight={700}>
        {item.period}
      </Text>

      {/* Role */}
      <Text position={[-2.15, 0.16, 0.11]} fontSize={0.165} color="#f8fafc" anchorX="left" fontWeight={800}>
        {item.role}
      </Text>

      {/* Company & Location */}
      <Text position={[-2.15, -0.12, 0.11]} fontSize={0.11} color="#38bdf8" anchorX="left">
        {item.company}  //  {item.location}
      </Text>

      {/* First bullet snippet */}
      <Text position={[-2.15, -0.42, 0.11]} maxWidth={4.3} fontSize={0.076} color="#94a3b8" anchorX="left" lineHeight={1.35}>
        {item.details[0]}
      </Text>

      {/* Milestone Indicator Sphere on Timeline Rail */}
      <group position={[-2.8, 0, 0]}>
        <mesh>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial
            color={index === 0 ? '#ff8a30' : '#38bdf8'}
            emissive={index === 0 ? '#ff8a30' : '#0284c7'}
            emissiveIntensity={hovered ? 2 : 1}
          />
        </mesh>
      </group>
    </group>
  );
}

export function ExperienceScene({ position = [0, 0, -66] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Chamber Architectural Dark Backdrop */}
      <mesh position={[0, 0.8, -2.2]} receiveShadow>
        <planeGeometry args={[26, 12]} />
        <meshStandardMaterial color="#030508" roughness={0.95} metalness={0.1} />
      </mesh>

      {/* Section Header */}
      <Text position={[-6.2, 3.6, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // CHRONOLOGICAL TRAJECTORY
      </Text>
      <Text position={[-6.2, 2.85, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        EXPERIENCE HALL
      </Text>

      {/* Glowing Central Timeline Rail */}
      <mesh position={[-2.8, -0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 6.8, 16]} />
        <meshBasicMaterial color="#ff8a30" />
      </mesh>

      {/* Left Column Experience Milestones */}
      <group position={[0.4, 0, 0]}>
        {PORTFOLIO_DATA.experience.slice(0, 4).map((item, i) => (
          <ExperienceNode
            key={item.company + item.period}
            item={item}
            position={[0, 1.8 - i * 1.6, 0]}
            index={i}
          />
        ))}
      </group>

      {/* Right Column Architectural Philosophy Monolith */}
      <group position={[4.6, -0.3, 0]}>
        <RoundedBox args={[3.2, 4.8, 0.35]} radius={0.15} smoothness={4} castShadow>
          <meshStandardMaterial color="#090f18" metalness={0.85} roughness={0.25} emissive="#0369a1" emissiveIntensity={0.2} />
        </RoundedBox>
        <Text position={[0, 1.8, 0.2]} fontSize={0.28} color="#ff8a30" anchorX="center" fontWeight={800}>
          LEAD
        </Text>
        <Text position={[0, 0.8, 0.2]} fontSize={0.28} color="#67c9ff" anchorX="center" fontWeight={800}>
          ARCHITECT
        </Text>
        <Text position={[0, -0.2, 0.2]} fontSize={0.28} color="#ffffff" anchorX="center" fontWeight={800}>
          DEPLOY
        </Text>
        <Text position={[0, -1.2, 0.2]} fontSize={0.28} color="#ff8a30" anchorX="center" fontWeight={800}>
          SCALE
        </Text>
        <Text position={[0, -1.9, 0.2]} fontSize={0.095} color="#94a3b8" anchorX="center" letterSpacing={0.15}>
          PRODUCTION RIGOR
        </Text>
      </group>
    </group>
  );
}
