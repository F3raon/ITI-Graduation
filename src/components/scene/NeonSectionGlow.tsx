import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { neonStore } from '../../context/NeonContext';

/**
 * NeonSectionGlow — Drop into any section to add neon-reactive energy.
 *
 * Adds:
 *  • Two pulsing cyan/amber point lights
 *  • A ground-plane glow disc
 *  • A thin emissive edge frame
 *
 * All elements are fully driven by neonStore.current so they
 * stay invisible at 0 and become vivid at 1.
 */
export function NeonSectionGlow({
  width = 12,
  height = 8,
  position = [0, 0, 0] as [number, number, number],
  groundY = -0.5,
  intensity = 1,
}: {
  width?: number;
  height?: number;
  position?: [number, number, number];
  groundY?: number;
  intensity?: number;
}) {
  const cyanRef  = useRef<THREE.PointLight>(null);
  const amberRef = useRef<THREE.PointLight>(null);
  const discRef  = useRef<THREE.MeshBasicMaterial>(null);
  const edgeRef1 = useRef<THREE.MeshBasicMaterial>(null);
  const edgeRef2 = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const neonT = neonStore.current;
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2.8) * 0.15;

    if (cyanRef.current) {
      cyanRef.current.intensity = neonT * 18 * intensity * pulse;
    }
    if (amberRef.current) {
      amberRef.current.intensity = neonT * 12 * intensity * (1 + Math.sin(t * 3.4) * 0.12);
    }
    if (discRef.current) {
      discRef.current.opacity = neonT * 0.15 * intensity;
    }
    if (edgeRef1.current) {
      edgeRef1.current.opacity = neonT * 0.6 * intensity;
    }
    if (edgeRef2.current) {
      edgeRef2.current.opacity = neonT * 0.35 * intensity;
    }
  });

  return (
    <group position={position}>
      {/* Cyan rim light — top-left */}
      <pointLight
        ref={cyanRef}
        position={[-width * 0.4, height * 0.35, 1.5]}
        distance={width * 1.5}
        color="#00f0ff"
        intensity={0}
      />

      {/* Amber accent light — bottom-right */}
      <pointLight
        ref={amberRef}
        position={[width * 0.4, -height * 0.2, 1.5]}
        distance={width * 1.2}
        color="#f59e0b"
        intensity={0}
      />

      {/* Ground glow disc */}
      <mesh position={[0, groundY, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[width * 0.4, 48]} />
        <meshBasicMaterial
          ref={discRef}
          color="#00f0ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Top edge line */}
      <mesh position={[0, height * 0.48, 0.05]}>
        <planeGeometry args={[width * 0.8, 0.015]} />
        <meshBasicMaterial
          ref={edgeRef1}
          color="#00f0ff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Bottom edge line */}
      <mesh position={[0, -height * 0.48, 0.05]}>
        <planeGeometry args={[width * 0.8, 0.012]} />
        <meshBasicMaterial
          ref={edgeRef2}
          color="#f59e0b"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
