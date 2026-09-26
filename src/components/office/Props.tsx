import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function DeskProps() {
  const robotHeadRef = useRef<THREE.Group>(null);
  const steamRef = useRef<THREE.Group>(null);
  const ledRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    // Desktop robot companion subtly looks around and reacts to cursor
    if (robotHeadRef.current) {
      robotHeadRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.35 + state.pointer.x * 0.2;
      robotHeadRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.2) * 0.1 - state.pointer.y * 0.15;
    }

    // Coffee steam float
    if (steamRef.current) {
      steamRef.current.children.forEach((child, i) => {
        child.position.y = 0.28 + ((state.clock.elapsedTime * 0.2 + i * 0.12) % 0.25);
        child.scale.setScalar(0.8 + ((state.clock.elapsedTime * 0.2 + i * 0.12) % 0.25) * 2);
      });
    }

    // Raspberry Pi status LED blinking
    if (ledRef.current) {
      ledRef.current.color.set(Math.sin(state.clock.elapsedTime * 8) > 0 ? '#10b981' : '#047857');
    }
  });

  return (
    <group position={[0, 0.08, 0]}>
      {/* MECHANICAL KEYBOARD */}
      <group position={[0, 0.02, 0.28]}>
        <RoundedBox args={[0.78, 0.035, 0.26]} radius={0.015} smoothness={3} castShadow>
          <meshStandardMaterial color="#0c1017" metalness={0.88} roughness={0.2} />
        </RoundedBox>
        {/* Keycap grid representation */}
        <mesh position={[0, 0.02, 0]}>
          <planeGeometry args={[0.74, 0.22]} />
          <meshStandardMaterial color="#1a2332" roughness={0.4} />
        </mesh>
        {/* Subtle Underglow */}
        <mesh position={[0, -0.01, 0]}>
          <planeGeometry args={[0.8, 0.28]} />
          <meshBasicMaterial color="#ff8a30" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* ERGONOMIC MOUSE */}
      <group position={[0.62, 0.03, 0.26]}>
        <RoundedBox args={[0.13, 0.05, 0.22]} radius={0.035} smoothness={4} castShadow>
          <meshStandardMaterial color="#0d141e" metalness={0.8} roughness={0.25} />
        </RoundedBox>
        {/* Illuminated Scroll Wheel */}
        <mesh position={[0, 0.03, -0.02]}>
          <cylinderGeometry args={[0.012, 0.012, 0.025, 12]} />
          <meshBasicMaterial color="#67c9ff" />
        </mesh>
        {/* Mousepad */}
        <mesh position={[0, -0.025, 0]}>
          <boxGeometry args={[0.34, 0.005, 0.38]} />
          <meshStandardMaterial color="#070a0e" roughness={0.85} />
        </mesh>
      </group>

      {/* OPEN SLIM LAPTOP */}
      <group position={[-1.25, 0.02, 0.12]} rotation={[0, 0.35, 0]}>
        {/* Base */}
        <RoundedBox args={[0.55, 0.02, 0.4]} radius={0.01} smoothness={2} castShadow>
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
        </RoundedBox>
        {/* Angled Screen */}
        <group position={[0, 0.01, -0.19]} rotation={[-0.45, 0, 0]}>
          <RoundedBox args={[0.55, 0.38, 0.015]} radius={0.01} smoothness={2} castShadow>
            <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.15} />
          </RoundedBox>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[0.52, 0.35]} />
            <meshBasicMaterial color="#041224" />
          </mesh>
          <pointLight position={[0, 0, 0.1]} intensity={0.6} distance={1.2} color="#67c9ff" />
        </group>
      </group>

      {/* COFFEE MUG WITH PARTICLES */}
      <group position={[1.2, 0.04, 0.32]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.07, 0.18, 24]} />
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.3} />
        </mesh>
        {/* Coffee Liquid */}
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.072, 0.072, 0.02, 24]} />
          <meshStandardMaterial color="#2d1506" roughness={0.1} />
        </mesh>
        {/* Steam */}
        <group ref={steamRef}>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[(i - 1) * 0.015, 0.15 + i * 0.04, 0]}>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
            </mesh>
          ))}
        </group>
      </group>

      {/* RASPBERRY PI / IOT DEVELOPMENT BOARD */}
      <group position={[-1.75, 0.02, 0.38]} rotation={[0, -0.2, 0]}>
        {/* Green PCB */}
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.01, 0.18]} />
          <meshStandardMaterial color="#065f46" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* SoC Processor Chip */}
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[0.065, 0.012, 0.065]} />
          <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* GPIO Pin Header */}
        <mesh position={[0, 0.015, -0.07]}>
          <boxGeometry args={[0.22, 0.015, 0.02]} />
          <meshStandardMaterial color="#000000" metalness={0.5} roughness={0.5} />
        </mesh>
        {/* USB Ports */}
        <mesh position={[0.12, 0.02, 0.02]}>
          <boxGeometry args={[0.04, 0.03, 0.08]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Flashing Status LED */}
        <mesh position={[-0.1, 0.015, -0.06]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial ref={ledRef} color="#10b981" />
        </mesh>
      </group>

      {/* MINI DESKTOP COMPANION ROBOT */}
      <group position={[1.65, 0.04, 0.12]}>
        {/* Robot Body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.1, 0.12, 0.22, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* Robot Animated Head */}
        <group ref={robotHeadRef} position={[0, 0.18, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.1, 24, 18]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.2} />
          </mesh>
          {/* Glowing Cyber Eyes */}
          <mesh position={[-0.04, 0.02, 0.085]}>
            <sphereGeometry args={[0.016, 12, 12]} />
            <meshBasicMaterial color="#67c9ff" />
          </mesh>
          <mesh position={[0.04, 0.02, 0.085]}>
            <sphereGeometry args={[0.016, 12, 12]} />
            <meshBasicMaterial color="#67c9ff" />
          </mesh>
          {/* Mini Antenna */}
          <mesh position={[0, 0.13, 0]}>
            <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
            <meshStandardMaterial color="#ff8a30" />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#ff8a30" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
