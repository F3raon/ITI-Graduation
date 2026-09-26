import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';

export function IntroScene({ position = [0, 0, 8] }: { position?: [number, number, number] }) {
  const tunnelRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const { viewport, size } = useThree();

  const aspect = size.width / Math.max(1, size.height);
  const isMobile = aspect < 1.0 || size.width < 768;

  // Responsive font sizes so name and titles never clip off-screen
  const nameFontSize = isMobile ? Math.min(0.42, viewport.width * 0.08) : Math.min(0.56, viewport.width * 0.065);
  const titleFontSize = isMobile ? 0.16 : 0.22;
  const taglineFontSize = isMobile ? 0.095 : 0.125;

  useFrame((state, delta) => {
    if (tunnelRef.current) {
      tunnelRef.current.rotation.z += delta * 0.15;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.08;
      coreRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={position}>
      {/* Cinematic Gateway Rings */}
      <group ref={tunnelRef} position={[0, 0, -2]}>
        {[0, 3, 6, 9, 12].map((z, i) => (
          <group key={i} position={[0, 0, -z]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[3.2 - i * 0.16, 0.015, 16, 64]} />
              <meshBasicMaterial
                color={i % 2 === 0 ? '#38bdf8' : '#7c3aed'}
                transparent
                opacity={0.4 - i * 0.08}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Hero 3D Typography inside the Scene with responsive bounds */}
      <group position={[0, 0.6, 0.5]}>
        <Text
          position={[0, 1.45, 0]}
          fontSize={isMobile ? 0.11 : 0.14}
          color="#94a3b8"
          anchorX="center"
          letterSpacing={0.2}
        >
          // CINEMATIC 3D EXPEDITION
        </Text>

        {/* Ahmed Hamada Name - Responsively sized */}
        <Text
          position={[0, 0.85, 0]}
          fontSize={nameFontSize}
          color="#f8fafc"
          anchorX="center"
          fontWeight={900}
          letterSpacing={0.04}
          maxWidth={viewport.width * 0.9}
        >
          {PORTFOLIO_DATA.identity.name}
        </Text>

        {/* Title */}
        <Text
          position={[0, 0.32, 0]}
          fontSize={titleFontSize}
          color="#38bdf8"
          anchorX="center"
          fontWeight={700}
          letterSpacing={0.15}
          maxWidth={viewport.width * 0.9}
        >
          {PORTFOLIO_DATA.identity.title}
        </Text>

        {/* Tagline */}
        <Text
          position={[0, -0.18, 0]}
          fontSize={taglineFontSize}
          color="#67c9ff"
          anchorX="center"
          letterSpacing={0.16}
          maxWidth={viewport.width * 0.9}
        >
          {PORTFOLIO_DATA.identity.tagline}
        </Text>

        {/* Scroll Call to Action */}
        <Text
          position={[0, -1.05, 0]}
          fontSize={isMobile ? 0.09 : 0.11}
          color="#94a3b8"
          anchorX="center"
          letterSpacing={0.14}
        >
          ↓  SCROLL TO ENTER MY WORLD  ↓
        </Text>
      </group>
    </group>
  );
}
