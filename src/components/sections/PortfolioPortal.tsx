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

  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const portalRingsRef = useRef<THREE.Group>(null);
  const energyPulseRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (portalRingsRef.current) {
      portalRingsRef.current.children.forEach((child, i) => {
        child.rotation.z += delta * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
      });
    }
    if (energyPulseRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
      energyPulseRef.current.scale.set(s, s, 1);
    }
  });

  const handleLaunch = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    soundEngine.playSelect();
    setIsOpen(true);
    scrollStore.locked = true;
  };

  const handleClose = () => {
    setIsOpen(false);
    scrollStore.locked = false;
  };

  useEffect(() => {
    return () => {
      // Ensure scroll lock is cleared if component unmounts
      scrollStore.locked = false;
    };
  }, []);

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[0, 4.2, 0]} fontSize={0.16} color="#94a3b8" anchorX="center" letterSpacing={0.25}>
        // THE PREVIOUS CHAPTER
      </Text>
      <Text position={[0, 3.4, 0]} fontSize={0.8} color="#ffffff" anchorX="center" fontWeight={900}>
        ORIGINAL PORTFOLIO
      </Text>
      <Text position={[0, 2.7, 0]} fontSize={0.15} color="#38bdf8" anchorX="center" letterSpacing={0.1}>
        AHMED HAMADA'S WEB APPS & DEPLOYMENTS
      </Text>

      {/* Massive Concentric Energy Portal Rings Framing the Screen */}
      <group ref={portalRingsRef} position={[0, 0, -0.6]}>
        {[7.4, 6.8, 6.2].map((r, i) => (
          <mesh key={i}>
            <torusGeometry args={[r, 0.04, 16, 64]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? '#ff8a30' : '#67c9ff'}
              transparent
              opacity={0.8 - i * 0.15}
            />
          </mesh>
        ))}
      </group>

      {/* Minimal Gateway Node */}
      <group position={[0, -0.5, 0]} onClick={handleLaunch} onPointerOver={() => setIsHovered(true)} onPointerOut={() => setIsHovered(false)}>
        {/* Gateway Sphere */}
        <mesh ref={energyPulseRef}>
          <sphereGeometry args={[1.5, 64, 64]} />
          <meshStandardMaterial
            color="#05070a"
            metalness={0.9}
            roughness={0.1}
            emissive="#38bdf8"
            emissiveIntensity={isHovered ? 1.2 : 0.4}
            wireframe={!isHovered}
          />
        </mesh>

        {/* Enter Label */}
        <Html transform position={[0, 0, 1.6]} pointerEvents="none" center>
          <div style={{
            color: isHovered ? '#ffffff' : '#38bdf8',
            fontFamily: 'monospace',
            fontSize: '18px',
            fontWeight: 800,
            letterSpacing: '3px',
            textShadow: isHovered ? '0 0 15px #38bdf8' : 'none',
            pointerEvents: 'none',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}>
            [ ENTER OLD PORTFOLIO ↗ ]
          </div>
        </Html>
        
        {/* Ambient Portal illumination */}
        <pointLight position={[0, 0, 2.2]} intensity={isHovered ? 40 : 15} distance={14} color="#38bdf8" />
      </group>

      {/* Real Fullscreen Iframe Portal */}
      {isOpen && (
        <Html fullscreen zIndexRange={[1000, 0]} portal={document.body as any}>
          <div className="fixed inset-0 z-[1000] flex flex-col bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
            {/* Header / Controls */}
            <div className="flex justify-between items-center px-6 py-4 bg-black/80 border-b border-[#1e293b] backdrop-blur-md">
              <div className="text-[#38bdf8] font-mono text-sm tracking-widest flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#ff8a30] animate-pulse"></span>
                EXTERNAL PORTAL ACTIVE
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-2 bg-[#0f172a] hover:bg-[#1e293b] text-[#f8fafc] text-sm font-mono tracking-wider border border-[#334155] hover:border-[#38bdf8] transition-all rounded"
              >
                BACK TO 3D WORLD ✕
              </button>
            </div>
            
            {/* Iframe content */}
            <div className="flex-1 w-full h-full relative">
              {/* Note: if the target site sets X-Frame-Options to DENY or SAMEORIGIN, it will fail to load and show browser default blocked message. */}
              <iframe
                src={PORTFOLIO_DATA.identity.oldPortfolioUrl}
                className="w-full h-full border-none bg-white"
                title="Ahmed Hamada Old Portfolio"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
