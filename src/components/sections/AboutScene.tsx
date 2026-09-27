import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';

function HolographicPortrait({ position = [2.8, 0, 0] }: { position?: [number, number, number] }) {
  const texture = useTexture(PORTFOLIO_DATA.identity.portraitImage);
  const portraitRef = useRef<THREE.Group>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (portraitRef.current) {
      portraitRef.current.rotation.y = THREE.MathUtils.lerp(
        portraitRef.current.rotation.y,
        state.pointer.x * 0.12,
        1 - Math.exp(-4 * delta)
      );
      portraitRef.current.rotation.x = THREE.MathUtils.lerp(
        portraitRef.current.rotation.x,
        -state.pointer.y * 0.08,
        1 - Math.exp(-4 * delta)
      );
    }

    if (scanlineRef.current) {
      scanlineRef.current.position.y = Math.sin(state.clock.elapsedTime * 2.5) * 1.8;
    }
  });

  return (
    <group ref={portraitRef} position={position}>
      {/* Outer Floating Carbon Frame */}
      <RoundedBox args={[3.2, 4.4, 0.25]} radius={0.14} smoothness={4} castShadow>
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.4}
          roughness={0.6}
          emissive="#38bdf8"
          emissiveIntensity={0.1}
        />
      </RoundedBox>

      {/* Portrait Texture Plane */}
      <mesh position={[0, 0, 0.13]}>
        <planeGeometry args={[2.85, 4.05]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Holographic Cyan Glass Layer */}
      <mesh position={[0, 0, 0.16]}>
        <planeGeometry args={[2.85, 4.05]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
        />
      </mesh>

      {/* Moving Holographic Scanline */}
      <mesh ref={scanlineRef} position={[0, 0, 0.17]}>
        <planeGeometry args={[2.85, 0.05]} />
        <meshBasicMaterial color="#67c9ff" transparent opacity={0.65} />
      </mesh>

      {/* Emissive Corner Brackets */}
      {[-1.4, 1.4].map((x) =>
        [-2.0, 2.0].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.18]}>
            <boxGeometry args={[0.2, 0.2, 0.02]} />
            <meshBasicMaterial color="#ff8a30" />
          </mesh>
        ))
      )}

      {/* Hologram Subtitle */}
      <Text position={[0, -2.45, 0]} fontSize={0.12} color="#94a3b8" anchorX="center" letterSpacing={0.15}>
        AUTHENTICATED // BIOMETRIC ID
      </Text>

      {/* Rim light casting on portrait */}
      <pointLight position={[1.2, 1.8, 0.8]} intensity={4.5} distance={5} color="#ff8a30" />
      <pointLight position={[-1.2, -1.5, 0.8]} intensity={3.5} distance={5} color="#67c9ff" />
    </group>
  );
}

export function AboutScene({ position = [0, 0, -18] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.62 : aspect < 1.25 ? 0.78 : aspect < 1.6 ? 0.92 : 1.0;

  return (
    <group position={position} scale={scale * 0.85}>
      {/* 3D Glass Information Panel */}
      {/* Centered at X = 1.8 */}
      <RoundedBox args={[6.2, 4.4, 0.28]} radius={0.14} smoothness={5} position={[1.8, 0.1, -0.2]}>
        <meshPhysicalMaterial
          color="#0f172a"
          metalness={0.5}
          roughness={0.5}
          emissive="#0284c7"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </RoundedBox>

      {/* Section Header */}
      <Text position={[-1.0, 1.8, 0.1]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // IDENTITY DOSSIER
      </Text>
      <Text position={[-1.0, 1.1, 0.1]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        WHO AM I?
      </Text>

      {/* Real 3D Bio Typography */}
      <Text position={[-1.0, 0.2, 0.1]} maxWidth={5.4} fontSize={0.20} color="#f8fafc" anchorX="left" lineHeight={1.4}>
        {`I'm Ahmed Hamada, a .NET Backend Developer who loves building systems, solving complex problems, and turning ambitious ideas into resilient products.`}
      </Text>

      <Text position={[-1.0, -0.7, 0.1]} maxWidth={5.4} fontSize={0.15} color="#94a3b8" anchorX="left" lineHeight={1.6}>
        {`Specializing in high-performance .NET backend systems, Clean Architecture, SQL Server, and microservices—while integrating computer vision, ROS robotics, and intelligent IoT hardware.`}
      </Text>

      <Text position={[-1.0, -1.6, 0.1]} maxWidth={5.4} fontSize={0.12} color="#67c9ff" anchorX="left" letterSpacing={0.06}>
        {'.NET  //  C#  //  PYTHON  //  SQL SERVER  //  AI & ROBOTICS  //  CLEAN ARCHITECTURE'}
      </Text>

      {/* Holographic 3D Portrait Frame */}
      {/* Centered at X = -3.2 */}
      <HolographicPortrait position={[-3.2, 0.1, 0]} />

      {/* Floating 3D Stat Plates */}
      <group position={[-0.5, -3.2, 0]}>
        {PORTFOLIO_DATA.stats.map((s, i) => {
          const xPos = i * 2.2 - 3.3; // Centered spread
          return (
          <group key={s.label} position={[xPos, 0, 0]}>
            <RoundedBox args={[2.0, 1.0, 0.14]} radius={0.08} smoothness={3}>
              <meshStandardMaterial
                color="#1e293b"
                metalness={0.3}
                roughness={0.7}
                emissive={i === 2 ? '#ff8a30' : '#38bdf8'}
                emissiveIntensity={0.3}
              />
            </RoundedBox>
            <Text position={[0, 0.16, 0.1]} fontSize={0.28} color={i === 2 ? '#ff8a30' : '#f8fafc'} anchorX="center" fontWeight={800}>
              {s.value}
            </Text>
            <Text position={[0, -0.22, 0.1]} fontSize={0.09} color="#94a3b8" anchorX="center" letterSpacing={0.12}>
              {s.label}
            </Text>
          </group>
        )})}
      </group>
    </group>
  );
}
