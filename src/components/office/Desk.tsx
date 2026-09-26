import { RoundedBox } from '@react-three/drei';
import { DeskProps } from './Props';
import { Monitors } from './Monitors';
import { PC } from './PC';

export function Desk() {
  return (
    <group position={[0, -0.65, 0]}>
      {/* Heavy Desktop Surface */}
      <RoundedBox args={[4.8, 0.14, 2.0]} radius={0.04} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color="#1e293b" metalness={0.75} roughness={0.3} />
      </RoundedBox>

      {/* Front Bevel Emissive Accent Line */}
      <mesh position={[0, -0.065, 0.99]}>
        <boxGeometry args={[4.76, 0.015, 0.01]} />
        <meshBasicMaterial color="#ff8a30" />
      </mesh>

      {/* Heavy Sturdy Desk Legs */}
      {[
        [-2.2, -0.75, -0.85],
        [-2.2, -0.75, 0.85],
        [2.2, -0.75, -0.85],
        [2.2, -0.75, 0.85],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* Drawers Cabinet on Right */}
      <group position={[1.85, -0.72, 0]}>
        <RoundedBox args={[0.65, 1.32, 1.6]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color="#0b1120" metalness={0.8} roughness={0.25} />
        </RoundedBox>
        {/* 3 Drawer Handles */}
        {[0.35, 0, -0.35].map((y, i) => (
          <mesh key={i} position={[0, y, 0.81]} castShadow>
            <boxGeometry args={[0.26, 0.03, 0.03]} />
            <meshStandardMaterial color="#64748b" metalness={0.95} roughness={0.1} />
          </mesh>
        ))}
      </group>

      {/* Desk Lamp with warm glow */}
      <group position={[1.9, 0.07, -0.6]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.04, 24]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.45, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.02, 0.02, 0.9, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.15} />
        </mesh>
        <mesh position={[0.12, 0.92, 0]} rotation={[0.4, 0, -0.2]}>
          <coneGeometry args={[0.18, 0.28, 24, 1, true]} />
          <meshStandardMaterial color="#1e293b" emissive="#ff8a30" emissiveIntensity={0.3} />
        </mesh>
        <pointLight position={[0.12, 0.85, 0]} intensity={4.5} distance={3.5} color="#ffb066" />
      </group>

      {/* Mount All Workstation Elements onto the Desk */}
      <Monitors />
      <PC position={[-1.9, 0.65, -0.4]} />
      <DeskProps />
    </group>
  );
}
