import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function RoboticsSystem({ hovered = false }: { hovered?: boolean }) {
  const lidarRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Continuous LiDAR sensor spinning
    if (lidarRef.current) {
      lidarRef.current.rotation.y += delta * 12;
    }

    // Articulated robotic arm moves smoothly
    if (armRef.current) {
      const speed = hovered ? 3 : 1;
      armRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed) * 0.4;
      armRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.15;
    }

    // Holographic navigation waypoint pulse
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.6;
      ringRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.08);
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.72}>
      {/* Lab Pedestal Base */}
      <mesh position={[0, -0.6, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.85, 0.12, 32]} />
        <meshStandardMaterial color="#0b111a" roughness={0.6} metalness={0.4} />
      </mesh>

      {/* Holographic Navigation Waypoint Grid */}
      <group ref={ringRef} position={[0, -0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <ringGeometry args={[0.9, 0.96, 32]} />
          <meshBasicMaterial color="#67c9ff" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[1.35, 1.4, 32]} />
          <meshBasicMaterial color="#ff8a30" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Autonomous Rover Platform */}
      <group position={[0, -0.15, 0]}>
        {/* Main Body Chassis */}
        <RoundedBox args={[1.2, 0.35, 1.5]} radius={0.06} smoothness={3} castShadow>
          <meshStandardMaterial color="#1e293b" metalness={0.88} roughness={0.2} />
        </RoundedBox>

        {/* Orange Accent Roll Cage */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[1.05, 0.06, 1.35]} />
          <meshStandardMaterial color="#ff8a30" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* 4 Heavy-Duty All-Terrain Rover Wheels */}
        {[-0.68, 0.68].map((x) =>
          [-0.52, 0.52].map((z) => (
            <group key={`${x}-${z}`} position={[x, -0.12, z]} rotation={[0, 0, Math.PI / 2]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.22, 0.22, 0.16, 16]} />
                <meshStandardMaterial color="#020617" roughness={0.85} />
              </mesh>
              {/* Wheel Rim Cap */}
              <mesh position={[0, 0.09, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.02, 12]} />
                <meshStandardMaterial color="#ff8a30" metalness={0.8} />
              </mesh>
            </group>
          ))
        )}

        {/* Top-Mounted Spinning LiDAR Sensor Dome */}
        <group ref={lidarRef} position={[0, 0.38, 0.42]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.16, 24]} />
            <meshStandardMaterial color="#090d14" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Laser Scanner Slit */}
          <mesh position={[0, 0.08, 0.12]}>
            <boxGeometry args={[0.18, 0.03, 0.04]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>

        {/* Articulated 2-Segment Robotic Arm */}
        <group ref={armRef} position={[0, 0.25, -0.3]}>
          {/* Base Turret */}
          <mesh position={[0, 0.06, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.18, 0.12, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Segment 1 Arm */}
          <group position={[0, 0.12, 0]} rotation={[0.4, 0, 0]}>
            <mesh position={[0, 0.25, 0]} castShadow>
              <capsuleGeometry args={[0.045, 0.5, 6, 12]} />
              <meshStandardMaterial color="#ff8a30" metalness={0.7} roughness={0.3} />
            </mesh>
            {/* Segment 2 Arm & End Effector Gripper */}
            <group position={[0, 0.52, 0]} rotation={[-0.7, 0, 0]}>
              <mesh position={[0, 0.2, 0]} castShadow>
                <capsuleGeometry args={[0.035, 0.4, 6, 12]} />
                <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Gripper Claws */}
              {[-0.05, 0.05].map((gx, gi) => (
                <mesh key={gi} position={[gx, 0.42, 0]} rotation={[0, 0, gx * 3]} castShadow>
                  <boxGeometry args={[0.02, 0.1, 0.04]} />
                  <meshStandardMaterial color="#38bdf8" />
                </mesh>
              ))}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
