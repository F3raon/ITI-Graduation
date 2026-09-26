import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function SmartGarage({ hovered = false }: { hovered?: boolean }) {
  const barrierRef = useRef<THREE.Group>(null);
  const carRef = useRef<THREE.Group>(null);
  const statusLightRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    // Barrier lifts when hovered, closes when unhovered
    if (barrierRef.current) {
      const targetAngle = hovered ? -Math.PI * 0.45 : 0;
      barrierRef.current.rotation.z = THREE.MathUtils.lerp(
        barrierRef.current.rotation.z,
        targetAngle,
        1 - Math.exp(-6 * delta)
      );
    }

    // Car subtly creeps forward when barrier is up
    if (carRef.current) {
      const targetZ = hovered ? 0.4 : -0.2;
      carRef.current.position.z = THREE.MathUtils.lerp(
        carRef.current.position.z,
        targetZ,
        1 - Math.exp(-4 * delta)
      );
    }

    // Status LED switches between Red (closed) and Green (open)
    if (statusLightRef.current) {
      statusLightRef.current.color.set(hovered ? '#10b981' : '#ef4444');
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.72}>
      {/* Garage Asphalt Ground Platform */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.1, 2.8]} />
        <meshStandardMaterial color="#0b111a" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Parking Bay Yellow Line Markings */}
      <mesh position={[0, -0.54, 0]}>
        <planeGeometry args={[1.6, 2.2]} />
        <meshBasicMaterial color="#eab308" wireframe />
      </mesh>

      {/* Garage Structure Arch */}
      <group position={[0, 0.35, -0.8]}>
        {/* Left Post */}
        <mesh position={[-1.2, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 1.8, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Right Post */}
        <mesh position={[1.2, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 1.8, 0.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Roof Crossbar */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[2.6, 0.2, 0.4]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Digital Capacity Display */}
        <mesh position={[0, 0.9, 0.21]}>
          <planeGeometry args={[1.2, 0.12]} />
          <meshBasicMaterial color="#ff8a30" />
        </mesh>
      </group>

      {/* Automated Barrier Gate Unit */}
      <group position={[-0.85, -0.1, 0.4]}>
        {/* Control Housing */}
        <RoundedBox args={[0.25, 0.9, 0.25]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color="#ff8a30" metalness={0.7} roughness={0.2} />
        </RoundedBox>
        {/* Sensor & Status Beacon */}
        <mesh position={[0, 0.48, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshBasicMaterial ref={statusLightRef} color="#ef4444" />
        </mesh>
        {/* Pivot Arm Mechanism */}
        <group ref={barrierRef} position={[0.14, 0.3, 0]}>
          <mesh position={[0.7, 0, 0]} castShadow>
            <boxGeometry args={[1.4, 0.06, 0.03]} />
            <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.2} />
          </mesh>
          {/* Barrier Red Stripes */}
          {[-0.3, 0, 0.3, 0.6].map((x, i) => (
            <mesh key={i} position={[0.7 + x, 0, 0.016]}>
              <boxGeometry args={[0.1, 0.065, 0.01]} />
              <meshBasicMaterial color="#ef4444" />
            </mesh>
          ))}
        </group>
      </group>

      {/* Low-Poly Cyber Car */}
      <group ref={carRef} position={[0.2, -0.32, -0.2]}>
        {/* Car Lower Chassis */}
        <RoundedBox args={[0.95, 0.28, 1.7]} radius={0.05} smoothness={3} castShadow>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </RoundedBox>
        {/* Car Cabin & Windshield */}
        <RoundedBox args={[0.8, 0.24, 0.9]} radius={0.04} smoothness={3} position={[0, 0.22, -0.05]} castShadow>
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
        </RoundedBox>
        {/* Cyber Neon Headlights */}
        {[-0.35, 0.35].map((x, i) => (
          <mesh key={i} position={[x, -0.02, 0.86]}>
            <boxGeometry args={[0.16, 0.04, 0.02]} />
            <meshBasicMaterial color="#67c9ff" />
          </mesh>
        ))}
        {/* 4 Wheels */}
        {[-0.5, 0.5].map((x) =>
          [-0.5, 0.5].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.12, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
              <meshStandardMaterial color="#020617" roughness={0.8} />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
}
