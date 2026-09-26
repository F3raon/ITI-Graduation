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
          color="#0b1017"
          metalness={0.9}
          roughness={0.18}
          emissive="#1e293b"
          emissiveIntensity={0.3}
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

      {/* Removed emissive brackets and scanline to reduce clutter */}

      {/* Subtle rim light casting on portrait */}
      <pointLight position={[1.2, 1.8, 0.8]} intensity={2.5} distance={5} color="#38bdf8" />
      <pointLight position={[-1.2, -1.5, 0.8]} intensity={2.0} distance={5} color="#7c3aed" />
    </group>
  );
}

export function AboutScene({ position = [0, 0, -18] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.62 : aspect < 1.25 ? 0.78 : aspect < 1.6 ? 0.92 : 1.0;

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[-5.8, 3.2, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // IDENTITY DOSSIER
      </Text>
      <Text position={[-5.8, 2.45, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        WHO AM I?
      </Text>

      {/* Removed the large glass box to keep typography clean against the world */}

      {/* Real 3D Bio Typography */}
      <Text position={[-5.4, 1.35, 0]} maxWidth={5.8} fontSize={0.22} color="#f8fafc" anchorX="left" lineHeight={1.4}>
        {`I'm Ahmed Hamada, a .NET Backend Developer who loves building systems, solving complex problems, and turning ambitious ideas into resilient products.`}
      </Text>

      <Text position={[-5.4, 0.25, 0]} maxWidth={5.8} fontSize={0.15} color="#94a3b8" anchorX="left" lineHeight={1.6}>
        {`Specializing in high-performance .NET backend systems, Clean Architecture, SQL Server, and microservices—while integrating computer vision, ROS robotics, and intelligent IoT hardware.`}
      </Text>

      <Text position={[-5.4, -0.85, 0]} maxWidth={5.8} fontSize={0.13} color="#67c9ff" anchorX="left" letterSpacing={0.06}>
        {'.NET  //  C#  //  PYTHON  //  SQL SERVER  //  AI & ROBOTICS  //  CLEAN ARCHITECTURE'}
      </Text>

      {/* Holographic 3D Portrait Frame */}
      <HolographicPortrait position={[3.2, 0.1, 0]} />

      {/* Removed bulky 3D stat plates */}
    </group>
  );
}
