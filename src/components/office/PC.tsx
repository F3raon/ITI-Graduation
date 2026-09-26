import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function PC({ position = [-2.4, -0.15, -0.4] }: { position?: [number, number, number] }) {
  const fansRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    if (fansRef.current) {
      fansRef.current.children.forEach((child) => {
        child.rotation.z += delta * 14;
      });
    }
    if (liquidRef.current) {
      liquidRef.current.opacity = 0.65 + Math.sin(state.clock.elapsedTime * 3) * 0.25;
    }
  });

  return (
    <group position={position}>
      {/* Tower Outer Chassis */}
      <RoundedBox args={[0.55, 1.15, 0.95]} radius={0.04} smoothness={4} castShadow>
        <meshStandardMaterial color="#080c12" metalness={0.92} roughness={0.18} />
      </RoundedBox>

      {/* Front Mesh Air Intake */}
      <mesh position={[0, 0, 0.48]}>
        <planeGeometry args={[0.48, 1.05]} />
        <meshStandardMaterial color="#05080c" roughness={0.8} />
      </mesh>

      {/* Tempered Glass Side Panel */}
      <mesh position={[0.28, 0, 0]}>
        <boxGeometry args={[0.01, 1.05, 0.88]} />
        <meshPhysicalMaterial
          color="#1e293b"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          transmission={0.85}
          ior={1.5}
        />
      </mesh>

      {/* Motherboard & Internal Hardware */}
      <mesh position={[-0.22, 0.05, 0]}>
        <boxGeometry args={[0.04, 0.85, 0.72]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* High-End GPU */}
      <group position={[0.02, -0.15, 0.05]}>
        <RoundedBox args={[0.22, 0.12, 0.6]} radius={0.02} smoothness={3}>
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.2} />
        </RoundedBox>
        {/* GPU Illuminated Logo */}
        <mesh position={[0.115, 0, 0]}>
          <planeGeometry args={[0.02, 0.35]} />
          <meshBasicMaterial color="#67c9ff" />
        </mesh>
      </group>

      {/* 3 Front RGB Fans */}
      <group ref={fansRef} position={[0, 0, 0.42]}>
        {[0.32, 0, -0.32].map((y, i) => (
          <group key={i} position={[0, y, 0]}>
            <mesh>
              <torusGeometry args={[0.12, 0.015, 8, 24]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#ff8a30' : '#67c9ff'} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.2, 0.02, 0.01]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.2, 0.02, 0.01]} />
              <meshBasicMaterial color="#0f172a" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Water Cooling Tube */}
      <mesh position={[0.02, 0.22, -0.05]} rotation={[0.4, 0, 0.3]}>
        <cylinderGeometry args={[0.018, 0.018, 0.5, 16]} />
        <meshBasicMaterial ref={liquidRef} color="#67c9ff" transparent opacity={0.8} />
      </mesh>

      {/* Internal Glow light */}
      <pointLight position={[0.05, 0.1, 0]} intensity={4.5} distance={2.5} color="#67c9ff" />
      <pointLight position={[0, -0.2, 0.2]} intensity={3.5} distance={2} color="#ff8a30" />
    </group>
  );
}
