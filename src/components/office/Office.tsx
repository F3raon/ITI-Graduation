import { RoundedBox } from '@react-three/drei';
import { Desk } from './Desk';
import { OfficeChair, DeveloperCharacter } from './Character';

export function Office() {
  return (
    <group position={[0, 0, 0]}>
      {/* Office Floor with reflective metallic sheen */}
      <mesh position={[0, -2.1, 0]} receiveShadow>
        <boxGeometry args={[14, 0.2, 12]} />
        <meshStandardMaterial color="#080e18" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Illuminated Floor Border Lines */}
      {[-5.9, 5.9].map((x) => (
        <mesh key={x} position={[x, -1.98, 0]}>
          <boxGeometry args={[0.08, 0.02, 11.8]} />
          <meshBasicMaterial color="#ff8a30" />
        </mesh>
      ))}

      {/* Back Wall with Open Center Archway to Character Chamber */}
      <group position={[0, 2.0, -5.8]}>
        {/* Left Glass Panel */}
        <mesh position={[-4.5, 0, 0]}>
          <boxGeometry args={[4.8, 8.2, 0.15]} />
          <meshPhysicalMaterial
            color="#0f172a"
            transparent
            opacity={0.15}
            roughness={0.08}
            metalness={0.1}
            transmission={0.92}
            ior={1.52}
          />
        </mesh>

        {/* Right Glass Panel */}
        <mesh position={[4.5, 0, 0]}>
          <boxGeometry args={[4.8, 8.2, 0.15]} />
          <meshPhysicalMaterial
            color="#0f172a"
            transparent
            opacity={0.15}
            roughness={0.08}
            metalness={0.1}
            transmission={0.92}
            ior={1.52}
          />
        </mesh>

        {/* Center Portal Framing Pillars */}
        {[-2.2, 2.2].map((x) => (
          <group key={x} position={[x, 0, 0.05]}>
            <mesh castShadow>
              <boxGeometry args={[0.2, 8.2, 0.35]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Glowing neon vertical strip */}
            <mesh position={[x > 0 ? -0.11 : 0.11, 0, 0.1]}>
              <boxGeometry args={[0.02, 7.8, 0.02]} />
              <meshBasicMaterial color="#00f0ff" />
            </mesh>
          </group>
        ))}

        {/* Portal Overhead Lintel */}
        <mesh position={[0, 3.8, 0.05]} castShadow>
          <boxGeometry args={[4.4, 0.6, 0.35]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* Ceiling Architectural Beams */}
      <group position={[0, 5.9, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[14, 0.2, 12]} />
          <meshStandardMaterial color="#050910" roughness={0.8} />
        </mesh>
        {[-3, 0, 3].map((z) => (
          <mesh key={z} position={[0, -0.15, z]}>
            <boxGeometry args={[13.8, 0.2, 0.35]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Left Wall Storage / Robotics Equipment Rack */}
      <group position={[-5.8, 0.8, -1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 5.4, 3.8]} />
          <meshStandardMaterial color="#0c131d" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Glowing Server Blades / Hardware Shelves */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((y, i) => (
          <group key={i} position={[0.41, y, 0]}>
            <mesh>
              <boxGeometry args={[0.02, 0.45, 3.4]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
            </mesh>
            <mesh position={[0.015, 0, 0]}>
              <boxGeometry args={[0.01, 0.06, 3.1]} />
              <meshBasicMaterial color={i % 2 === 0 ? '#67c9ff' : '#ff8a30'} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Right Wall Decor: Robotics Trophy & Potted Cyber Plant */}
      <group position={[5.6, -0.5, 0.5]}>
        {/* Minimalist shelf pedestal */}
        <RoundedBox args={[1.2, 2.6, 1.2]} radius={0.06} smoothness={3} castShadow>
          <meshStandardMaterial color="#0e1724" metalness={0.7} roughness={0.3} />
        </RoundedBox>
        {/* Potted cyber plant */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.22, 0.45, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} />
        </mesh>
        {/* Bioluminescent stylized leaves */}
        {[0, 1.2, 2.4, 3.6, 4.8].map((rot, i) => (
          <mesh key={i} position={[0, 1.85 + i * 0.08, 0]} rotation={[0.4, rot, 0.3]}>
            <coneGeometry args={[0.18, 0.7, 6]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
          </mesh>
        ))}
      </group>

      {/* The Central Developer Setup */}
      <Desk />
      <OfficeChair position={[0, -0.65, 0.95]} />
      <DeveloperCharacter position={[0, -0.65, 0.95]} />
    </group>
  );
}
