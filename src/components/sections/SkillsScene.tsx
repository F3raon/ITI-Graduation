import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA, SkillNode } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';

function TechNode({
  skill,
  position,
}: {
  skill: SkillNode;
  position: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetScale = hovered ? 1.25 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-8 * delta));
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      position[2] + (hovered ? 0.6 : 0),
      1 - Math.exp(-8 * delta)
    );
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
      {/* Simple Tech Indicator Dot */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={hovered ? '#ffffff' : skill.color} />
      </mesh>

      {/* Skill Name */}
      <Text position={[0, 0.04, 0.08]} fontSize={0.115} color={hovered ? '#ffffff' : skill.color} anchorX="center" fontWeight={700}>
        {skill.name}
      </Text>

      {/* Level Tag */}
      <Text position={[0, -0.15, 0.08]} fontSize={0.065} color="#94a3b8" anchorX="center" letterSpacing={0.12}>
        {skill.level}
      </Text>

      {/* Always visible description (Purpose) */}
      <group position={[0, -0.4, 0.08]}>
        <Text position={[0, 0, 0]} maxWidth={2.2} fontSize={0.07} color="#94a3b8" anchorX="center" lineHeight={1.2}>
          {skill.description}
        </Text>
      </group>

      {/* Connecting Ray Line to Center Core */}
      <line>
        <bufferGeometry attach="geometry" {...new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-position[0], -position[1], -position[2])])} />
        <lineBasicMaterial attach="material" color={skill.color} transparent opacity={hovered ? 0.6 : 0.12} />
      </line>
    </group>
  );
}

export function SkillsScene({ position = [0, 0, -34] }: { position?: [number, number, number] }) {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.6 : aspect < 1.25 ? 0.76 : aspect < 1.6 ? 0.92 : 1.0;

  useFrame((state, delta) => {
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.45;
      coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[-6.2, 3.4, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // SYSTEM CORE // SKILLS REACTOR
      </Text>
      <Text position={[-6.2, 2.65, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        SKILLS LAB
      </Text>

      {/* CENTRAL SYSTEM CORE (Minimal) */}
      <group ref={coreRef} position={[0, 0, 0]}>
        {/* Simple wireframe sphere */}
        <mesh>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.15} />
        </mesh>

        <Text position={[0, 0, 1.15]} fontSize={0.28} color="#ffffff" anchorX="center" fontWeight={900}>
          .NET
        </Text>
        <Text position={[0, -0.32, 1.15]} fontSize={0.1} color="#67c9ff" anchorX="center" letterSpacing={0.15}>
          CORE ARCHITECTURE
        </Text>
      </group>

      {/* Surrounding Orbital Technology Nodes */}
      {PORTFOLIO_DATA.skills.map((skill, i) => {
        const total = PORTFOLIO_DATA.skills.length;
        const angle = (i / total) * Math.PI * 2;
        const radiusX = 5.2;
        const radiusY = 2.8;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        return (
          <TechNode key={skill.name} skill={skill} position={[x, y, 0]} />
        );
      })}

      {/* Bottom Subtitle */}
      <Text position={[0, -3.2, 0]} fontSize={0.14} color="#94a3b8" anchorX="center" letterSpacing={0.18}>
        ARCHITECTURAL INTEGRATION MATRIX
      </Text>
    </group>
  );
}
