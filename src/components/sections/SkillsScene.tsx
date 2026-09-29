import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Float, Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA, SkillNode } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';

function SpinningLogo({ iconUrl, iconUrls, color, hovered, invertIcon }: { iconUrl?: string; iconUrls?: string[]; color: string; hovered: boolean, invertIcon?: boolean }) {
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (ref.current) {
      // spin continuously
      ref.current.rotation.y += delta * (hovered ? 2.5 : 0.8);
    }
  });

  const urls = iconUrls || (iconUrl ? [iconUrl] : []);

  return (
    <group ref={ref} position={[0, 0.45, 0]}>
      {urls.length > 0 ? (
        <Html transform center distanceFactor={2.5}>
          <div style={{
            minWidth: '60px',
            padding: '0 10px',
            height: '60px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'rgba(5, 10, 15, 0.8)',
            border: `2px solid ${hovered ? color : 'rgba(255,255,255,0.1)'}`,
            borderRadius: '12px',
            boxShadow: hovered ? `0 0 15px ${color}` : '0 4px 6px rgba(0,0,0,0.5)',
            transition: 'all 0.3s ease',
          }}>
            {urls.map((url, i) => (
              <img key={i} src={url} alt="icon" style={{ 
                width: '40px', 
                height: '40px', 
                objectFit: 'contain', 
                filter: `${invertIcon ? 'invert(1) brightness(2) ' : ''}${hovered ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : ''}`.trim() || 'none' 
              }} />
            ))}
          </div>
        </Html>
      ) : (
        <mesh>
          <octahedronGeometry args={[0.32, 0]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={color}
            emissiveIntensity={hovered ? 1.6 : 0.4}
            roughness={0.2}
            wireframe={!hovered}
          />
        </mesh>
      )}
    </group>
  );
}

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
      {/* 3D Spinning Logo Object for Technology */}
      <SpinningLogo iconUrl={skill.iconUrl} iconUrls={skill.iconUrls} color={skill.color} hovered={hovered} invertIcon={skill.invertIcon} />

      {/* Floating 3D Base Badge */}
      <RoundedBox args={[1.7, 0.52, 0.12]} radius={0.08} smoothness={3}>
        <meshStandardMaterial
          color="#080c14"
          metalness={0.9}
          roughness={0.2}
          emissive={skill.color}
          emissiveIntensity={hovered ? 0.45 : 0.1}
        />
      </RoundedBox>

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
      <Line
        points={[[0, 0, 0], [-position[0], -position[1], -position[2]]]}
        color={skill.color as any}
        transparent
        opacity={hovered ? 0.6 : 0.12}
        lineWidth={1.5}
      />
    </group>
  );
}

export function SkillsScene({ position = [0, 0, -34] }: { position?: [number, number, number] }) {
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  // Tighter scale so nodes are always within view distance from camera
  const scale = aspect < 0.9 ? 0.55 : aspect < 1.25 ? 0.70 : aspect < 1.6 ? 0.85 : 0.95;

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
      {/* Section Header — centered so it's always visible */}
      <Text position={[0, 3.8, 0]} fontSize={0.16} color="#67c9ff" anchorX="center" letterSpacing={0.22}>
        // SYSTEM CORE // SKILLS REACTOR
      </Text>
      <Text position={[0, 3.15, 0]} fontSize={0.65} color="#f8fafc" anchorX="center" fontWeight={900}>
        SKILLS LAB
      </Text>

      {/* CENTRAL GLOWING .NET CORE REACTOR */}
      <group ref={coreRef} position={[0, 0, 0]}>
        {/* Outer Pulsing Polyhedron Wireframe */}
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#512bd4"
            wireframe
            emissive="#7c3aed"
            emissiveIntensity={1.4}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Inner Solid Energy Crystal */}
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.2}>
          <mesh>
            <octahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial
              color="#ff8a30"
              emissive="#ff8a30"
              emissiveIntensity={1.2}
              roughness={0.1}
              metalness={0.9}
            />
          </mesh>
        </Float>

        {/* Core Name */}
        <Text position={[0, 0, 1.15]} fontSize={0.34} color="#ffffff" anchorX="center" fontWeight={900}>
          .NET
        </Text>
        <Text position={[0, -0.42, 1.15]} fontSize={0.12} color="#67c9ff" anchorX="center" letterSpacing={0.15}>
          CORE ARCHITECTURE
        </Text>
      </group>

      {/* Orbital Glowing Rings around the Core */}
      <group ref={ringRef} position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[3.8, 0.018, 16, 64]} />
          <meshBasicMaterial color="#512bd4" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <torusGeometry args={[4.4, 0.015, 16, 64]} />
          <meshBasicMaterial color="#ff8a30" transparent opacity={0.4} />
        </mesh>
      </group>

      {PORTFOLIO_DATA.skills.map((skill, i) => {
        const total = PORTFOLIO_DATA.skills.length;
        const angle = (i / total) * Math.PI * 2;
        const isMobile = aspect < 0.9;
        // Reduced radii so nodes stay within camera view
        const radiusX = isMobile ? 2.2 : 4.0;
        const radiusY = isMobile ? 3.2 : 2.2;
        const x = Math.cos(angle) * radiusX;
        const y = Math.sin(angle) * radiusY;
        return (
          <TechNode key={skill.name} skill={skill} position={[x, y, 0]} />
        );
      })}

      {/* Bottom Subtitle */}
      <Text position={[0, -2.8, 0]} fontSize={0.14} color="#94a3b8" anchorX="center" letterSpacing={0.18}>
        ARCHITECTURAL INTEGRATION MATRIX
      </Text>
    </group>
  );
}
