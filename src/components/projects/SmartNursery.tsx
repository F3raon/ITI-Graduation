import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export function SmartNursery({ hovered = false }: { hovered?: boolean }) {
  const plantsRef = useRef<THREE.Group>(null);
  const sensorRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    // Bioluminescent flora breathing animation
    if (plantsRef.current) {
      plantsRef.current.children.forEach((p, i) => {
        p.rotation.y += delta * (0.2 + i * 0.1);
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
        p.scale.set(scale, scale, scale);
      });
    }

    // Environmental sensor light pulsing green/emerald
    if (sensorRef.current) {
      sensorRef.current.color.set(hovered ? '#10b981' : '#34d399');
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.72}>
      {/* Geodesic Greenhouse Base */}
      <mesh position={[0, -0.65, 0]} receiveShadow>
        <cylinderGeometry args={[1.7, 1.85, 0.14, 32]} />
        <meshStandardMaterial color="#061a14" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Geodesic Greenhouse Glass Dome */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.6, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshPhysicalMaterial
          color="#064e3b"
          transparent
          opacity={0.35}
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
          ior={1.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dome Wireframe Structural Ribs */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.61, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshBasicMaterial color="#34d399" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Soil Beds & Planters */}
      <group position={[0, -0.45, 0]}>
        {[-0.65, 0.65].map((x) =>
          [-0.65, 0.65].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0, z]} castShadow>
              <cylinderGeometry args={[0.35, 0.28, 0.28, 16]} />
              <meshStandardMaterial color="#1c1917" roughness={0.9} />
            </mesh>
          ))
        )}
      </group>

      {/* Bioluminescent Exotic Plants Inside */}
      <group ref={plantsRef} position={[0, -0.25, 0]}>
        {[-0.65, 0.65].map((x) =>
          [-0.65, 0.65].map((z, zi) => (
            <group key={`${x}-${z}`} position={[x, 0, z]}>
              {/* Plant Stem */}
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.05, 0.5, 8]} />
                <meshStandardMaterial color="#047857" roughness={0.5} />
              </mesh>
              {/* Glowing Exotic Leaves */}
              {[0, 1.2, 2.4, 3.6].map((rot, i) => (
                <mesh
                  key={i}
                  position={[0, 0.4 + i * 0.08, 0]}
                  rotation={[0.35, rot, 0.2]}
                  castShadow
                >
                  <coneGeometry args={[0.12, 0.45, 6]} />
                  <meshStandardMaterial
                    color="#10b981"
                    emissive={zi % 2 === 0 ? '#059669' : '#34d399'}
                    emissiveIntensity={hovered ? 1.2 : 0.6}
                  />
                </mesh>
              ))}
            </group>
          ))
        )}
      </group>

      {/* Center IoT Environmental Sensor Mast */}
      <group position={[0, -0.2, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 1.2, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Sensor Housing */}
        <RoundedBox args={[0.24, 0.22, 0.2]} radius={0.03} smoothness={3} position={[0, 1.15, 0]}>
          <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Sensor Status Beacon */}
        <mesh position={[0, 1.32, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshBasicMaterial ref={sensorRef} color="#34d399" />
        </mesh>
      </group>

      {/* Irrigation Delivery Pipes */}
      <mesh position={[0, -0.5, 0]}>
        <torusGeometry args={[1.1, 0.025, 8, 32]} />
        <meshStandardMaterial color="#0284c7" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}
