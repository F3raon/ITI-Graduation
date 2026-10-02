import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { useState } from 'react';
import { scrollStore } from '../../context/ScrollContext';
import { SECTION_MAP } from '../../data/sections';

// ─── Atmospheric particle field ───────────────────────────────────────────────
function IntroParticles({ count = 350 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy  = useMemo(() => new THREE.Object3D(), []);
  const seeds  = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x:     (Math.random() - 0.5) * 22,
        y:     (Math.random() - 0.5) * 14,
        z:     (Math.random() - 0.5) * 8,
        speed: 0.04 + Math.random() * 0.09,
        phase: Math.random() * Math.PI * 2,
        isAmber: Math.random() < 0.08,
      })),
    [count]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    seeds.forEach((s, i) => {
      const t = state.clock.elapsedTime;
      dummy.position.set(
        s.x + Math.sin(t * s.speed + s.phase) * 0.35,
        s.y + Math.cos(t * s.speed * 0.7 + s.phase) * 0.28,
        s.z
      );
      dummy.scale.setScalar(s.isAmber ? 0.018 : 0.012);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Digital Identity Core (behind Ahmed) ────────────────────────────────────
function DigitalCore({ progress }: { progress: number }) {
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const dotGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.18;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.11;
    if (ring3Ref.current) ring3Ref.current.rotation.z += delta * 0.07;
    if (dotGroupRef.current) {
      dotGroupRef.current.rotation.z += delta * 0.22;
      dotGroupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.06;
    }
  });

  const energyT = Math.max(0, Math.min(1, (progress - 0.15) / 0.4));

  return (
    <group position={[0, 1.6, -5.0]} scale={1.5}>
      {/* Outer arc ring — very thin, segmented appearance */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[3.2, 0.008, 8, 128, Math.PI * 1.6]} />
        <meshBasicMaterial
          color="#1e6fa8"
          transparent
          opacity={0.35 + energyT * 0.4}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Mid arc ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.65, 0.006, 8, 96, Math.PI * 1.3]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.25 + energyT * 0.45}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Inner accent ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[2.1, 0.005, 6, 64, Math.PI * 0.9]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.2 + energyT * 0.5}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Data node dots orbiting the outer ring */}
      <group ref={dotGroupRef}>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 3.2, Math.sin(angle) * 3.2, 0]}
            >
              <sphereGeometry args={[i % 3 === 0 ? 0.05 : 0.025, 6, 6]} />
              <meshBasicMaterial
                color={i % 4 === 0 ? '#f59e0b' : '#00f0ff'}
                transparent
                opacity={0.7 + energyT * 0.3}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>

      {/* Subtle vertical emissive line */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[0.003, 6.5]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.12 + energyT * 0.18}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>

      {/* Horizontal crosshair line */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[6.5, 0.003]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.08 + energyT * 0.12}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Premium Presentation Platform ───────────────────────────────────────────
function Platform() {
  return (
    <group position={[0, -0.55, 0]}>
      {/* Main dark metallic disc */}
      <mesh receiveShadow>
        <cylinderGeometry args={[2.8, 3.0, 0.12, 64]} />
        <meshStandardMaterial
          color="#0a0f18"
          metalness={0.92}
          roughness={0.18}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Beveled upper ring */}
      <mesh position={[0, 0.07, 0]}>
        <torusGeometry args={[2.8, 0.04, 8, 64]} />
        <meshStandardMaterial
          color="#111c2e"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Cyan emissive outer glow ring */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.74, 2.82, 128]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.75}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle amber inner ring accent */}
      <mesh position={[0, 0.065, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.9, 1.94, 64]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.28}
          toneMapped={false}
        />
      </mesh>

      {/* Platform under-glow point light */}
      <pointLight
        position={[0, -0.1, 0]}
        intensity={3}
        distance={5}
        color="#00f0ff"
      />
    </group>
  );
}

// ─── Dark Grid Floor ──────────────────────────────────────────────────────────
function GridFloor() {
  // Single subtle grid plane extending far behind Ahmed
  return (
    <mesh position={[0, -0.68, -12]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60, 40, 40]} />
      <meshStandardMaterial
        color="#030810"
        wireframe
        transparent
        opacity={0.06}
        metalness={0.1}
        roughness={1.0}
      />
    </mesh>
  );
}

// ─── Main IntroScene ──────────────────────────────────────────────────────────
export function IntroScene({ position = [0, 0, 8] }: { position?: [number, number, number] }) {
  const { viewport, size } = useThree();
  const isMobile = size.width / Math.max(1, size.height) < 1.0 || size.width < 768;

  // Responsive typography sizing
  const nameFontSize   = isMobile ? Math.min(0.38, viewport.width * 0.07) : Math.min(0.52, viewport.width * 0.06);
  const titleFontSize  = isMobile ? 0.14 : 0.19;
  const taglineFontSize = isMobile ? 0.085 : 0.11;

  return (
    <group position={position}>
      {/* Dark atmospheric floor */}
      <GridFloor />

      {/* Character presentation platform */}
      <Platform />

      {/* Digital identity core — behind Ahmed */}
      <DigitalCore progress={0} />

      {/* Sparse atmospheric particles */}
      <IntroParticles count={isMobile ? 150 : 350} />

      {/* ── HERO TYPOGRAPHY ── */}
      <group position={[0, 0.65, 0.6]}>

        {/* Name */}
        <Text
          position={[0, 0.9, 0]}
          fontSize={nameFontSize}
          color="#f8fafc"
          anchorX="center"
          fontWeight={900}
          letterSpacing={0.04}
          maxWidth={viewport.width * 0.88}
        >
          {PORTFOLIO_DATA.identity.name}
        </Text>

        {/* Title */}
        <Text
          position={[0, 0.34, 0]}
          fontSize={titleFontSize}
          color="#ff8a30"
          anchorX="center"
          fontWeight={700}
          letterSpacing={0.14}
          maxWidth={viewport.width * 0.88}
        >
          {PORTFOLIO_DATA.identity.title}
        </Text>

        {/* Tagline */}
        <Text
          position={[0, -0.14, 0]}
          fontSize={taglineFontSize}
          color="#38bdf8"
          anchorX="center"
          letterSpacing={0.14}
          maxWidth={viewport.width * 0.88}
        >
          {PORTFOLIO_DATA.identity.tagline}
        </Text>

        {/* Scroll CTA */}
        <Text
          position={[0, -1.0, 0]}
          fontSize={isMobile ? 0.085 : 0.10}
          color="#475569"
          anchorX="center"
          letterSpacing={0.14}
        >
          ↓  SCROLL TO ENTER MY WORLD  ↓
        </Text>
      </group>
    </group>
  );
}
