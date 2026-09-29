import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
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
          <group position={[0, 0.2, 0]}>
            {/* Base platform */}
            <mesh position={[0, -1.0, 0]}>
              <cylinderGeometry args={[1.6, 1.7, 0.15, 32]} />
              <meshStandardMaterial color="#090d14" metalness={0.9} roughness={0.2} />
            </mesh>
            
            {/* Screen Bezel */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[3.2, 2.0, 0.1]} />
              <meshStandardMaterial color="#0b1221" metalness={0.8} roughness={0.3} />
            </mesh>
            
            {/* Screen Glass/Glow */}
            <mesh position={[0, 0.4, 0.06]}>
              <planeGeometry args={[3.1, 1.9]} />
              <meshBasicMaterial color={project.color} transparent opacity={hovered ? 0.05 : 0.2} />
            </mesh>

            {/* 3D Iframe Screen */}
            <group position={[0, 0.4, 0.07]}>
              <Html
                transform
                distanceFactor={2.8}
                position={[0, 0, 0]}
                zIndexRange={[100, 0]}
              >
                <div
                  style={{
                    width: '620px',
                    height: '380px',
                    background: '#040810',
                    border: `2px solid ${hovered ? project.color : '#1e293b'}`,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: hovered ? `0 0 30px ${project.color}40` : 'none',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {hovered ? (
                    <iframe
                      src={project.demoUrl || project.githubUrl || ''}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        background: '#fff',
                      }}
                      title={project.title}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: project.color, marginBottom: '10px' }}>
                        {project.title}
                      </div>
                      <div style={{ fontSize: '14px', letterSpacing: '2px' }}>
                        HOVER TO INITIALIZE LIVE PREVIEW
                      </div>
                    </div>
                  )}
                </div>
              </Html>
            </group>
          </group>
        );
    }
  };

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundEngine.playSelect();
    if (project.demoUrl) {
      window.dispatchEvent(new CustomEvent('open-iframe', { detail: project.demoUrl }));
    } else if (project.githubUrl) {
      window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
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

      {/* Futuristic Project Information Slab (Premium Dark Glass) */}
      <group ref={baseRef} position={[0, -1.4, 0]}>
        <RoundedBox args={[3.4, 1.8, 0.15]} radius={0.06} smoothness={4} castShadow>
          <meshPhysicalMaterial
            color="#1a2235"
            metalness={0.5}
            roughness={0.2}
            clearcoat={1.0}
            transmission={0.6}
            transparent
            opacity={0.8}
            emissive={project.color}
            emissiveIntensity={hovered ? 0.4 : 0.15}
          />
        </RoundedBox>

        {/* Index Tag & Title */}
        <Text position={[-1.5, 0.65, 0.09]} fontSize={0.08} color={project.color} anchorX="left" letterSpacing={0.15}>
          {project.id.toUpperCase()} // {project.category.toUpperCase()}
        </Text>
        <Text position={[-1.5, 0.42, 0.09]} fontSize={0.18} color="#f8fafc" anchorX="left" fontWeight={900}>
          {project.title}
        </Text>

        {/* TECHNOLOGIES */}
        <Text position={[-1.5, 0.15, 0.09]} maxWidth={3.0} fontSize={0.075} color="#38bdf8" anchorX="left" letterSpacing={0.12} lineHeight={1.3}>
          {project.tags.join(' • ')}
        </Text>

        {/* PROBLEM / PURPOSE */}
        <Text position={[-1.5, -0.15, 0.09]} maxWidth={3.0} fontSize={0.075} color="#94a3b8" anchorX="left" lineHeight={1.5}>
          {project.description}
        </Text>

        {/* SOLUTION / RESULT */}
        <Text position={[-1.5, -0.45, 0.09]} maxWidth={3.0} fontSize={0.075} color="#cbd5e1" anchorX="left" lineHeight={1.5}>
          {`HIGHLIGHT: ${project.highlights[0]}`}
        </Text>

        {/* Action Button Label */}
        <group position={[1.4, -0.7, 0.09]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.085}
            color={hovered ? '#ffffff' : project.color}
            anchorX="right"
            letterSpacing={0.15}
            fontWeight={700}
          >
            {hovered ? 'ENTER SYSTEM ↗' : 'VIEW PROJECT →'}
          </Text>
        </group>

        {/* Under-glow light */}
        <pointLight position={[0, -0.8, 0.3]} intensity={hovered ? 4 : 1} distance={4} color={project.color} />
      </group>
    </group>
  );
}
