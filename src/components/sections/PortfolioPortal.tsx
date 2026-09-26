import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';
import { useScrollProgress } from '../../context/ScrollContext';

export function PortfolioPortal({ position = [0, 0, -114] }: { position?: [number, number, number] }) {
  const { progress } = useScrollProgress();
  const isNearPortal = progress >= 0.88;
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.55 : aspect < 1.25 ? 0.72 : aspect < 1.6 ? 0.88 : 1.0;

  const [isHovered, setIsHovered] = useState(false);
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

  const handleLaunch = () => {
    soundEngine.playSelect();
    window.open(PORTFOLIO_DATA.identity.oldPortfolioUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[0, 4.8, 0]} fontSize={0.18} color="#94a3b8" anchorX="center" letterSpacing={0.22}>
        // ARCHIVE ARCHITECTURE // INTERACTIVE PORTAL
      </Text>
      <Text position={[0, 4.15, 0]} fontSize={0.72} color="#f8fafc" anchorX="center" fontWeight={900}>
        THE ORIGINAL PORTFOLIO
      </Text>
      <Text position={[0, 3.55, 0]} fontSize={0.14} color="#ff8a30" anchorX="center" letterSpacing={0.12}>
        AHMED HAMADA'S WEB APPS, REST APIS & PRODUCTION DEPLOYMENTS
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

      {/* 3D Giant Screen Chassis */}
      <group position={[0, -0.2, 0]}>
        {/* Outer Heavy Beveled Chassis */}
        <RoundedBox args={[12.8, 7.6, 0.45]} radius={0.24} smoothness={6} castShadow>
          <meshStandardMaterial
            color="#070b12"
            metalness={0.94}
            roughness={0.18}
            emissive="#0369a1"
            emissiveIntensity={isHovered ? 0.35 : 0.15}
          />
        </RoundedBox>

        {/* Browser Top Navigation Bar */}
        <mesh position={[0, 3.42, 0.23]}>
          <planeGeometry args={[12.2, 0.44]} />
          <meshBasicMaterial color="#0f172a" />
        </mesh>
        {/* Browser Window Action Dots */}
        {[-5.8, -5.6, -5.4].map((x, i) => (
          <mesh key={i} position={[x, 3.42, 0.24]}>
            <circleGeometry args={[0.06, 16]} />
            <meshBasicMaterial color={['#ef4444', '#eab308', '#10b981'][i]} />
          </mesh>
        ))}
        {/* URL Pill Bar */}
        <mesh position={[0, 3.42, 0.24]}>
          <planeGeometry args={[7.2, 0.26]} />
          <meshBasicMaterial color="#1e293b" />
        </mesh>
        <Text position={[0, 3.42, 0.25]} fontSize={0.1} color="#67c9ff" anchorX="center">
          https://ahmed-hamada-eta.vercel.app
        </Text>

        {/* Screen Bezel Depth Backing */}
        <mesh ref={energyPulseRef} position={[0, -0.15, 0.23]}>
          <planeGeometry args={[12.2, 6.6]} />
          <meshBasicMaterial color="#030712" />
        </mesh>

        {/* High-Tech Realistic Preview of Ahmed Hamada's Original Site */}
        {isNearPortal && (
          <Html
          transform
          position={[0, -0.15, 0.32]}
          distanceFactor={7.4}
          occlude="blending"
          pointerEvents="auto"
          style={{
            width: '1220px',
            height: '660px',
            borderRadius: '0 0 16px 16px',
            overflow: 'hidden',
            background: 'radial-gradient(ellipse at 50% 30%, #150928 0%, #030014 80%)',
            boxShadow: '0 30px 100px rgba(0,0,0,0.85)',
            color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '36px 48px',
            boxSizing: 'border-box',
          }}
        >
          <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onWheel={(e) => e.stopPropagation()}
            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}
          >
            {/* Header / Intro */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(112,66,248,0.25)', border: '1px solid rgba(112,66,248,0.6)', color: '#c084fc', fontSize: '13px', fontWeight: 600 }}>
                  <span>⚡</span>
                  <span>ORIGINAL PRODUCTION PORTFOLIO</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '13px', fontFamily: 'monospace' }}>
                  LOCATION: EGYPT // .NET BACKEND ARCHITECTURE
                </div>
              </div>

              <h1 style={{ fontSize: '42px', fontWeight: 900, margin: '0 0 12px 0', background: 'linear-gradient(to right, #ffffff, #c084fc, #67c9ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Ahmed Hamada — .NET Developer
              </h1>

              <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', maxWidth: '960px', margin: 0 }}>
                .NET Backend Developer with 2 years of experience delivering production-grade desktop, web, and backend applications using C#, ASP.NET Core MVC, .NET Framework, and SQL Server. Built and deployed 6+ live web applications and 3 REST APIs, including a multi-module ERP system serving a Next.js frontend built with Clean Architecture.
              </p>
            </div>

            {/* Quick Live Projects Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '20px 0' }}>
              {[
                { name: 'Koky Sweets', tech: 'ASP.NET Core 8 / SignalR', url: 'https://koky-sweets.runasp.net/' },
                { name: 'Axon ERP API', tech: 'Clean Architecture / JWT', url: 'https://axon-api.runasp.net/swagger/index.html' },
                { name: 'EduSaaS API', tech: 'REST / Swagger / Roles', url: 'https://edusaas-api.runasp.net/Swagger' },
                { name: 'Pills Dispenser API', tech: 'IoT Backend / Dosage', url: 'https://pills-despinser.runasp.net/swagger/index.html' },
              ].map((p, i) => (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: 'rgba(17, 14, 39, 0.65)',
                    border: '1px solid rgba(112, 66, 248, 0.35)',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '15px' }}>{p.name}</div>
                  <div style={{ color: '#67c9ff', fontSize: '12px' }}>{p.tech}</div>
                  <div style={{ color: '#ff8a30', fontSize: '11px', marginTop: '6px' }}>OPEN LIVE APP ↗</div>
                </a>
              ))}
            </div>

            {/* Bottom Actions Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '18px' }}>
              <div style={{ display: 'flex', gap: '24px', color: '#94a3b8', fontSize: '13px', fontFamily: 'monospace' }}>
                <span>GITHUB: github.com/F3raon</span>
                <span>LINKEDIN: /in/ahmed-hamada-saad</span>
              </div>

              {/* Direct Fullscreen Launcher CTA */}
              <button
                onClick={handleLaunch}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  borderRadius: '9999px',
                  border: '1px solid #ff8a30',
                  background: 'linear-gradient(135deg, rgba(255,138,48,0.9), rgba(192,132,252,0.85))',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  boxShadow: '0 8px 35px rgba(255,138,48,0.4)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <span>OPEN FULL LIVE SITE (AHMED-HAMADA-ETA.VERCEL.APP)</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </Html>
      )}

        {/* Ambient Portal illumination */}
        <pointLight position={[0, 0, 2.2]} intensity={25} distance={14} color="#ff8a30" />
      </group>

      {/* Screen Subtitle Instructions */}
      <Text position={[0, -4.5, 0]} fontSize={0.14} color="#67c9ff" anchorX="center" letterSpacing={0.14}>
        CLICK THE BUTTON ABOVE TO VISIT THE FULL SITE // SCROLL UP TO RETURN TO THE 3D WORLD
      </Text>
    </group>
  );
}
