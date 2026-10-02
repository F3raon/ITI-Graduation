import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';
import { scrollStore } from '../../context/ScrollContext';
import { SECTION_MAP } from '../../data/sections';

function ContactTerminal({
  label,
  value,
  url,
  color,
  position,
  icon,
}: {
  label: string;
  value: string;
  url: string;
  color: string;
  position: [number, number, number];
  icon: string;
}) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const targetZ = position[2] + (hovered ? 0.35 : 0);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 1 - Math.exp(-6 * delta));
  });

  const handleClick = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundEngine.playSelect();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        soundEngine.playHover();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      onClick={handleClick}
    >
      <RoundedBox args={[2.2, 1.0, 0.22]} radius={0.06} smoothness={3} castShadow>
        <meshPhysicalMaterial
          color="#05080c"
          metalness={0.9}
          roughness={0.15}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.05}
          transparent
          opacity={0.95}
        />
      </RoundedBox>

      {/* Holographic Backing Plate */}
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[2.25, 1.05]} />
        <meshBasicMaterial color={color} transparent opacity={hovered ? 0.4 : 0.1} />
      </mesh>

      {/* Terminal Icon Symbol */}
      <Text position={[-0.8, 0.1, 0.12]} fontSize={0.24} color={color} anchorX="center">
        {icon}
      </Text>

      {/* Label */}
      <Text position={[-0.5, 0.15, 0.12]} fontSize={0.12} color="#f8fafc" anchorX="left" fontWeight={800}>
        {label}
      </Text>

      {/* Value */}
      <Text position={[-0.5, -0.1, 0.12]} maxWidth={1.6} fontSize={0.065} color="#94a3b8" anchorX="left">
        {value}
      </Text>

      {/* Action CTA */}
      <Text position={[0.85, -0.3, 0.12]} fontSize={0.08} color={hovered ? '#ffffff' : color} anchorX="right">
        {hovered ? 'TRANSMIT ↗' : 'CONNECT →'}
      </Text>
    </group>
  );
}

export function ContactScene({ position = [0, 0, -98] }: { position?: [number, number, number] }) {
  const ringRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.6 : aspect < 1.25 ? 0.76 : aspect < 1.6 ? 0.92 : 1.0;

  const [visible, setVisible] = useState(false);

  useFrame((_, delta) => {
    const isVisible = scrollStore.current > SECTION_MAP['CONTACT'].start - 0.1 && scrollStore.current < SECTION_MAP['CONTACT'].end + 0.1;
    if (visible !== isVisible) setVisible(isVisible);

    if (ringRef.current && visible) {
      ringRef.current.rotation.z += delta * 0.18;
    }
  });

  

  return (
    <group position={position} scale={scale}>
      {/* Background Energy Ring */}
      <group ref={ringRef} position={[0, 1.0, -1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.8, 0.035, 16, 64]} />
          <meshBasicMaterial color="#ff8a30" transparent opacity={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} scale={0.88}>
          <torusGeometry args={[3.8, 0.02, 12, 64]} />
          <meshBasicMaterial color="#67c9ff" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* Giant 3D Typography */}
      <group position={[0, 2.2, 0]}>

        <Text position={[0, 0.55, 0]} fontSize={0.92} color="#f8fafc" anchorX="center" fontWeight={900}>
          LET'S BUILD
        </Text>
        <Text position={[0, -0.4, 0]} fontSize={0.92} color="#ff8a30" anchorX="center" fontWeight={900}>
          SOMETHING.
        </Text>
        <Text position={[0, -1.15, 0]} fontSize={0.14} color="#67c9ff" anchorX="center" letterSpacing={0.12}>
          HAVE AN IDEA, A PROJECT OR JUST WANT TO CONNECT?
        </Text>
      </group>

      {/* 4 Interactive Contact Terminals - Single Horizontal Line */}
      <group position={[0, -0.6, 0]}>
        <ContactTerminal
          label="EMAIL"
          value={PORTFOLIO_DATA.identity.email}
          url={`mailto:${PORTFOLIO_DATA.identity.email}`}
          color="#ff8a30"
          position={[-3.45, 0, 0]}
          icon="✉"
        />
        <ContactTerminal
          label="LINKEDIN"
          value="/in/ahmed-hamada-saad"
          url={PORTFOLIO_DATA.identity.linkedin}
          color="#0284c7"
          position={[-1.15, 0, 0]}
          icon="in"
        />
        <ContactTerminal
          label="GITHUB"
          value="github.com/F3raon"
          url={PORTFOLIO_DATA.identity.github}
          color="#a855f7"
          position={[1.15, 0, 0]}
          icon="⌥"
        />
        <ContactTerminal
          label="WHATSAPP"
          value={PORTFOLIO_DATA.identity.phone}
          url={PORTFOLIO_DATA.identity.whatsapp}
          color="#10b981"
          position={[3.45, 0, 0]}
          icon="✆"
        />
      </group>
    </group>
  );
}
