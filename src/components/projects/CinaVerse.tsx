import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

export function CinaVerse({ hovered = false }: { hovered?: boolean }) {
  const cardsRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // Holographic floating media cards bobbing around the screen
    if (cardsRef.current) {
      cardsRef.current.children.forEach((card, i) => {
        const offset = i * 1.5;
        card.position.y = Math.sin(state.clock.elapsedTime * 2 + offset) * 0.08 + (i - 1) * 0.35;
        card.rotation.y = THREE.MathUtils.lerp(
          card.rotation.y,
          hovered ? (i - 1) * 0.25 : 0,
          1 - Math.exp(-6 * delta)
        );
      });
    }

    // Laptop gentle levitation
    if (laptopRef.current) {
      laptopRef.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.04;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={0.72}>
      {/* Floating Cyber Pedestal */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.1, 32]} />
        <meshStandardMaterial color="#090d14" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <ringGeometry args={[1.2, 1.25, 32]} />
        <meshBasicMaterial color="#c084fc" side={THREE.DoubleSide} />
      </mesh>

      {/* Cyber Laptop System */}
      <group ref={laptopRef} position={[0, -0.1, 0]}>
        {/* Base Chassis */}
        <RoundedBox args={[1.8, 0.06, 1.25]} radius={0.02} smoothness={3} castShadow>
          <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.15} />
        </RoundedBox>
        {/* Glowing Keyboard Surface */}
        <mesh position={[0, 0.035, 0.12]}>
          <planeGeometry args={[1.6, 0.7]} />
          <meshBasicMaterial color="#312e81" />
        </mesh>
        {/* Trackpad */}
        <mesh position={[0, 0.035, -0.38]}>
          <planeGeometry args={[0.55, 0.32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>

        {/* Angled Laptop Screen */}
        <group position={[0, 0.03, -0.6]} rotation={[-0.32, 0, 0]}>
          <RoundedBox args={[1.8, 1.15, 0.04]} radius={0.02} smoothness={3} castShadow>
            <meshStandardMaterial color="#0f0e26" metalness={0.9} roughness={0.2} />
          </RoundedBox>
          {/* Screen Display Content */}
          <mesh position={[0, 0, 0.022]}>
            <planeGeometry args={[1.72, 1.05]} />
            <meshBasicMaterial color="#030712" />
          </mesh>
          <Text position={[-0.78, 0.42, 0.03]} fontSize={0.065} color="#c084fc" anchorX="left">
            CINAVERSE // STREAMING HUB
          </Text>
          <Text position={[-0.78, 0.28, 0.03]} fontSize={0.045} color="#94a3b8" anchorX="left">
            Next.js / MongoDB / Video CDN / REST
          </Text>
        </group>
      </group>

      {/* 3 Floating 3D Movie Posters & UI Panels */}
      <group ref={cardsRef} position={[0, 0.3, 0.35]}>
        {[-0.85, 0, 0.85].map((x, i) => (
          <group key={i} position={[x, 0, i === 1 ? 0.2 : 0]}>
            <RoundedBox args={[0.62, 0.9, 0.03]} radius={0.02} smoothness={2} castShadow>
              <meshStandardMaterial
                color="#1e1b4b"
                emissive={i === 1 ? '#c084fc' : '#4338ca'}
                emissiveIntensity={hovered ? 0.7 : 0.25}
                roughness={0.2}
              />
            </RoundedBox>
            <Text position={[0, -0.36, 0.025]} fontSize={0.048} color="#f8fafc" anchorX="center">
              {['INTERSTELLAR', 'BLADE RUNNER', 'THE MATRIX'][i]}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}
