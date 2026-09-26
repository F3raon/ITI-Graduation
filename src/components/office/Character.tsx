import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function OfficeChair({ position = [0, -0.65, 0.95] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* High backrest with ergonomic curve */}
      <mesh position={[0, 1.15, 0.22]} castShadow>
        <RoundedBox args={[0.95, 1.45, 0.2]} radius={0.08} smoothness={4}>
          <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.5} />
        </RoundedBox>
      </mesh>

      {/* Headrest */}
      <mesh position={[0, 1.95, 0.26]} castShadow>
        <RoundedBox args={[0.55, 0.26, 0.16]} radius={0.06} smoothness={3}>
          <meshStandardMaterial color="#0b1120" metalness={0.3} roughness={0.5} />
        </RoundedBox>
      </mesh>

      {/* Seat Cushion */}
      <mesh position={[0, 0.38, 0]} castShadow>
        <RoundedBox args={[1.05, 0.16, 0.95]} radius={0.07} smoothness={4}>
          <meshStandardMaterial color="#1e293b" metalness={0.3} roughness={0.5} />
        </RoundedBox>
      </mesh>

      {/* Armrests */}
      {[-0.56, 0.56].map((x, i) => (
        <group key={i} position={[x, 0.65, 0]}>
          <mesh position={[0, 0, 0]} castShadow>
            <RoundedBox args={[0.12, 0.05, 0.6]} radius={0.02} smoothness={2}>
              <meshStandardMaterial color="#334155" metalness={0.6} roughness={0.4} />
            </RoundedBox>
          </mesh>
          <mesh position={[0, -0.25, -0.05]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.45, 12]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Central Hydraulic Cylinder */}
      <mesh position={[0, -0.15, 0]} castShadow>
        <cylinderGeometry args={[0.055, 0.055, 0.85, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.95} roughness={0.15} />
      </mesh>

      {/* 5-Star Wheel Base */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <group key={i} position={[0, -0.55, 0]} rotation={[0, angle, 0]}>
            <mesh position={[0, 0, 0.34]} castShadow>
              <boxGeometry args={[0.07, 0.05, 0.65]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.06, 0.65]} castShadow>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial color="#020617" roughness={0.4} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function DeveloperCharacter({ position = [0, 0.1, 0.95] }: { position?: [number, number, number] }) {
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftHandRef = useRef<THREE.Group>(null);
  const rightHandRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Natural subtle breathing motion
    const breath = Math.sin(state.clock.elapsedTime * 2.2) * 0.015;
    if (bodyRef.current) {
      bodyRef.current.position.y = breath;
    }

    // Head tracking cursor naturally
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(
        headRef.current.rotation.y,
        state.pointer.x * 0.45,
        1 - Math.exp(-6 * delta)
      );
      headRef.current.rotation.x = THREE.MathUtils.lerp(
        headRef.current.rotation.x,
        -state.pointer.y * 0.25 + 0.1,
        1 - Math.exp(-6 * delta)
      );
    }

    // Subtle typing micro-movement
    const typeL = Math.sin(state.clock.elapsedTime * 12) * 0.008;
    const typeR = Math.cos(state.clock.elapsedTime * 14) * 0.008;
    if (leftHandRef.current) leftHandRef.current.position.y = typeL;
    if (rightHandRef.current) rightHandRef.current.position.y = typeR;
  });

  return (
    <group position={position}>
      {/* SEATED DEVELOPER CHARACTER */}
      <group ref={bodyRef}>
        {/* Torso in dark technical hoodie */}
        <mesh position={[0, 0.42, 0.02]} castShadow>
          <capsuleGeometry args={[0.34, 0.65, 8, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.65} metalness={0.1} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 0.88, 0.02]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.16, 16]} />
          <meshStandardMaterial color="#c28e67" roughness={0.7} />
        </mesh>

        {/* Head & Face */}
        <group ref={headRef} position={[0, 1.08, 0.02]}>
          {/* Head base */}
          <mesh castShadow>
            <sphereGeometry args={[0.22, 24, 20]} />
            <meshStandardMaterial color="#c28e67" roughness={0.7} />
          </mesh>
          {/* Stylized Dark Hair */}
          <mesh position={[0, 0.09, -0.04]} castShadow>
            <sphereGeometry args={[0.23, 24, 20]} />
            <meshStandardMaterial color="#0f172a" roughness={0.8} />
          </mesh>
          {/* Developer Glasses Frame */}
          <group position={[0, 0.02, -0.2]}>
            <mesh position={[-0.08, 0, 0]}>
              <boxGeometry args={[0.09, 0.06, 0.02]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.08, 0, 0]}>
              <boxGeometry args={[0.09, 0.06, 0.02]} />
              <meshStandardMaterial color="#38bdf8" metalness={0.9} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0, 0.01, 0]}>
              <boxGeometry args={[0.07, 0.012, 0.015]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
        </group>

        {/* Arms angled forward toward keyboard */}
        {/* Left Arm */}
        <group position={[-0.42, 0.6, 0]} rotation={[0.65, 0.2, -0.15]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.09, 0.42, 6, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>
          {/* Forearm & Hand */}
          <group ref={leftHandRef} position={[0, -0.38, -0.12]} rotation={[-0.7, -0.1, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.075, 0.38, 6, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.65} />
            </mesh>
            {/* Hand */}
            <mesh position={[0, -0.24, 0]} castShadow>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshStandardMaterial color="#c28e67" roughness={0.7} />
            </mesh>
          </group>
        </group>

        {/* Right Arm */}
        <group position={[0.42, 0.6, 0]} rotation={[0.65, -0.2, 0.15]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.09, 0.42, 6, 12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.65} />
          </mesh>
          {/* Forearm & Hand */}
          <group ref={rightHandRef} position={[0, -0.38, -0.12]} rotation={[-0.7, 0.1, 0]}>
            <mesh castShadow>
              <capsuleGeometry args={[0.075, 0.38, 6, 12]} />
              <meshStandardMaterial color="#1e293b" roughness={0.65} />
            </mesh>
            {/* Hand on mouse/keyboard */}
            <mesh position={[0, -0.24, 0]} castShadow>
              <sphereGeometry args={[0.07, 16, 12]} />
              <meshStandardMaterial color="#c28e67" roughness={0.7} />
            </mesh>
          </group>
        </group>

        {/* Seated Thighs & Legs */}
        <group position={[-0.2, -0.1, -0.25]} rotation={[1.45, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.13, 0.55, 6, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
        </group>
        <group position={[0.2, -0.1, -0.25]} rotation={[1.45, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.13, 0.55, 6, 12]} />
            <meshStandardMaterial color="#0f172a" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
