import { useState, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';
import { scrollStore } from '../../context/ScrollContext';


export function PortfolioPortal({ position = [0, 0, -114] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.55 : aspect < 1.25 ? 0.72 : aspect < 1.6 ? 0.88 : 1.0;

  const portalRingsRef = useRef<THREE.Group>(null);

  const [visible, setVisible] = useState(false);

  useFrame((state, delta) => {
    if (portalRingsRef.current) {
      portalRingsRef.current.children.forEach((child, i) => {
        child.rotation.z += delta * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
      });
    }
    // Only render the iframe when we are near the end of the scroll to prevent CSS3D overlap
    const isVisible = scrollStore.current > 0.85;
    if (visible !== isVisible) setVisible(isVisible);
  });

  if (!visible) return null;

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[0, 3.4, 0]} fontSize={0.12} color="#94a3b8" anchorX="center" letterSpacing={0.25}>
        // THE PREVIOUS CHAPTER
      </Text>
      <Text position={[0, 2.9, 0]} fontSize={0.5} color="#ffffff" anchorX="center" fontWeight={900}>
        ORIGINAL PORTFOLIO
      </Text>
      <Text position={[0, 2.5, 0]} fontSize={0.11} color="#38bdf8" anchorX="center" letterSpacing={0.1}>
        INTERACTIVE 3D TERMINAL // SCROLL INSIDE THE SCREEN
      </Text>

      {/* Massive Concentric Energy Portal Rings Framing the Screen */}
      <group ref={portalRingsRef} position={[0, -0.3, -1.0]}>
        {[5.8, 5.4, 5.0].map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.03, 16, 64]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#ff8a30' : '#67c9ff'}
              transparent
              opacity={0.8 - i * 0.15}
            />
          </mesh>
        ))}
      </group>

      {/* 3D Lab Monitor Chassis */}
      <group position={[0, -0.4, 0]}>
        
        {/* Outer Heavy Beveled Chassis */}
        <mesh position={[0, 0.15, -0.1]} castShadow>
          <boxGeometry args={[8.0, 5.1, 0.2]} />
          <meshPhysicalMaterial
            color="#070b12"
            metalness={0.9}
            roughness={0.2}
            emissive="#38bdf8"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Browser Top Navigation Bar Area */}
        <mesh position={[0, 2.5, -0.05]}>
          <planeGeometry args={[7.8, 0.4]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>

        {/* Browser Window Action Dots (Mac Style) */}
        {[-3.6, -3.4, -3.2].map((x, i) => (
          <mesh key={i} position={[x, 2.5, -0.04]}>
            <circleGeometry args={[0.04, 16]} />
            <meshBasicMaterial color={['#ef4444', '#eab308', '#10b981'][i]} />
          </mesh>
        ))}

        {/* URL Pill Bar */}
        <mesh position={[0, 2.5, -0.04]}>
          <planeGeometry args={[4.5, 0.2]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <Text position={[0, 2.49, -0.03]} fontSize={0.07} color="#67c9ff" anchorX="center">
          https://ahmed-hamada-eta.vercel.app
        </Text>

        {/* Screen Glow Rim */}
        <mesh position={[0, 0, -0.08]}>
          <boxGeometry args={[7.8, 4.8, 0.05]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} />
        </mesh>

        {/* The 3D Html embedded iframe */}
        <group position={[0, 0, 0.06]}>
          <Html
            transform
            center
            distanceFactor={5.0}
            position={[0, 0, 0]}
            zIndexRange={[100, 0]}
          >
            <div
              style={{
                width: '1280px',
                height: '720px',
                background: '#040810',
                borderRadius: '16px',
                border: '4px solid #38bdf8',
                boxShadow: '0 0 40px rgba(56, 189, 248, 0.4)',
                overflow: 'auto',
                pointerEvents: 'auto',
              }}
            >
              <iframe
                src={PORTFOLIO_DATA.identity.oldPortfolioUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Old Portfolio"
              />
            </div>
          </Html>
        </group>
        
        {/* Ambient Portal illumination */}
        <pointLight position={[0, 0, 2.0]} intensity={15} distance={15} color="#38bdf8" />
      </group>
    </group>
  );
}
