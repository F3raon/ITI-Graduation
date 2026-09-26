import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ProjectItem } from '../../data/portfolio';
import { SmartGarage } from './SmartGarage';
import { RoboticsSystem } from './RoboticsSystem';
import { CinaVerse } from './CinaVerse';
import { SmartNursery } from './SmartNursery';
import { soundEngine } from '../../utils/audio';

export function ProjectPodium({
  project,
  position,
  index,
}: {
  project: ProjectItem;
  position: [number, number, number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const baseRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetY = position[1] + (hovered ? 0.35 : 0);
    const targetZ = position[2] + (hovered ? 0.4 : 0);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 1 - Math.exp(-6 * delta));
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 1 - Math.exp(-6 * delta));
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      hovered ? (index % 2 === 0 ? 0.12 : -0.12) : 0,
      1 - Math.exp(-6 * delta)
    );
  });

  const renderDiorama = () => {
    switch (project.dioramaType) {
      case 'garage':
        return <SmartGarage hovered={hovered} />;
      case 'robotics':
        return <RoboticsSystem hovered={hovered} />;
      case 'laptop':
        return <CinaVerse hovered={hovered} />;
      case 'nursery':
        return <SmartNursery hovered={hovered} />;
      default:
        // Production system cyber core pedestal
        return (
          <group position={[0, 0, 0]} scale={0.72}>
            <mesh position={[0, -0.6, 0]}>
              <cylinderGeometry args={[1.4, 1.5, 0.15, 24]} />
              <meshStandardMaterial color="#090d14" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <octahedronGeometry args={[0.75, 0]} />
              <meshStandardMaterial
                color="#0f172a"
                emissive={project.color}
                emissiveIntensity={hovered ? 1.5 : 0.6}
                wireframe
              />
            </mesh>
            <mesh position={[0, 0, 0]} rotation={[0.4, 0.8, 0]}>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color={project.color} metalness={0.8} roughness={0.2} />
            </mesh>
          </group>
        );
    }
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundEngine.playSelect();
    if (project.demoUrl) {
      window.open(project.demoUrl, '_blank', 'noopener,noreferrer');
    }
  };

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
      onClick={handleClick}
    >
      {/* 3D Diorama or Cyber Model */}
      <group position={[0, 0.45, 0]}>{renderDiorama()}</group>

      {/* Futuristic Project Information Slab */}
      <group ref={baseRef} position={[0, -1.2, 0]}>
        <RoundedBox args={[3.2, 1.45, 0.22]} radius={0.08} smoothness={4} castShadow>
          <meshStandardMaterial
            color="#05070a"
            metalness={0.9}
            roughness={0.15}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.35 : 0.08}
          />
        </RoundedBox>

        {/* Index Tag & Title */}
        <Text position={[-1.4, 0.45, 0.13]} fontSize={0.09} color={project.color} anchorX="left" letterSpacing={0.1}>
          {project.id.toUpperCase()} // {project.category.toUpperCase()}
        </Text>
        <Text position={[-1.4, 0.22, 0.13]} fontSize={0.16} color="#ffffff" anchorX="left" fontWeight={800}>
          {project.title}
        </Text>

        {/* TECHNOLOGIES */}
        <Text position={[-1.4, 0.02, 0.13]} fontSize={0.07} color="#38bdf8" anchorX="left" letterSpacing={0.1}>
          TECH: {project.tags.join(' • ')}
        </Text>

        {/* PROBLEM / PURPOSE */}
        <Text position={[-1.4, -0.22, 0.13]} maxWidth={2.8} fontSize={0.065} color="#94a3b8" anchorX="left" lineHeight={1.4}>
          PURPOSE: {project.description}
        </Text>

        {/* SOLUTION / RESULT */}
        <Text position={[-1.4, -0.42, 0.13]} maxWidth={2.8} fontSize={0.065} color="#cbd5e1" anchorX="left" lineHeight={1.4}>
          SOLUTION: {project.highlights[0]}
        </Text>

        {/* Action Button Label */}
        <Text
          position={[1.35, -0.5, 0.13]}
          fontSize={0.08}
          color={hovered ? '#ffffff' : project.color}
          anchorX="right"
          letterSpacing={0.1}
        >
          {hovered ? 'ENTER WORLD ↗' : 'VIEW PROJECT →'}
        </Text>

        {/* Under-glow light */}
        <pointLight position={[0, -0.5, 0.3]} intensity={hovered ? 5 : 1.5} distance={4} color={project.color} />
      </group>
    </group>
  );
}
