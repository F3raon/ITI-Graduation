import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { scrollStore } from '../../context/ScrollContext';
import { SECTION_MAP } from '../../data/sections';

export function PortfolioPortal({ position = [0, 0, -114] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.55 : aspect < 1.25 ? 0.72 : aspect < 1.6 ? 0.88 : 1.0;

  const portalRingsRef = useRef<THREE.Group>(null);
  const [visible, setVisible] = useState(false);

  useFrame((_, delta) => {
    if (portalRingsRef.current) {
      portalRingsRef.current.children.forEach((child, i) => {
        child.rotation.z += delta * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
      });
    }
    const isVisible = scrollStore.current > SECTION_MAP['PORTAL'].start - 0.05;
    if (visible !== isVisible) setVisible(isVisible);
  });

  if (!visible) return null;

  return (
    <group position={position} scale={scale}>

      <Text position={[0, 2.9, 0]} fontSize={0.5} color="#ffffff" anchorX="center" fontWeight={900}>
        ORIGINAL PORTFOLIO
      </Text>
      <Text position={[0, 2.5, 0]} fontSize={0.11} color="#38bdf8" anchorX="center" letterSpacing={0.1}>
        CLICK SCREEN TO VISIT LIVE // LEGACY CODEBASE
      </Text>

      <group ref={portalRingsRef} position={[0, -0.3, -1.0]}>
        {[5.8, 5.4, 5.0].map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.03, 16, 64]} />
            <meshBasicMaterial color={i % 2 === 0 ? '#ff8a30' : '#67c9ff'} transparent opacity={0.8 - i * 0.15} />
          </mesh>
        ))}
      </group>

      <group position={[0, -0.4, 0]}>
        <mesh position={[0, 0.15, -0.1]} castShadow>
          <boxGeometry args={[8.0, 5.1, 0.2]} />
          <meshPhysicalMaterial color="#070b12" metalness={0.9} roughness={0.2} emissive="#38bdf8" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[0, 2.5, -0.05]}>
          <planeGeometry args={[7.8, 0.4]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {[-3.6, -3.4, -3.2].map((x, i) => (
          <mesh key={i} position={[x, 2.5, -0.04]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color={(['#ef4444', '#eab308', '#10b981'] as string[])[i]} />
          </mesh>
        ))}
        <mesh position={[0, 2.5, -0.04]}>
          <planeGeometry args={[4.5, 0.2]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <Text position={[0, 2.49, -0.03]} fontSize={0.07} color="#67c9ff" anchorX="center">
          https://ahmed-hamada-eta.vercel.app
        </Text>
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[7.8, 4.8, 0.05]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
        </mesh>

        {/* Interactive Web Portal */}
        <Html transform distanceFactor={2.4} position={[0, 0, 0.06]} occlude="blending">
          <div
            style={{
              width: '1440px',
              height: '860px',
              borderRadius: '16px',
              overflow: 'hidden',
              background: '#070b12',
              border: '4px solid #38bdf8',
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.3)'
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <iframe
              src="https://ahmed-hamada-eta.vercel.app/"
              title="Original Portfolio"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          </div>
        </Html>

        <pointLight position={[0, 0, 2.0]} intensity={15} distance={15} color="#38bdf8" />
      </group>
    </group>
  );
}
