import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { neonStore } from '../../context/NeonContext';

export function CinematicBeam({
  position,
  rotation,
  color,
  opacity = 0.08,
  scale = 1,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  opacity?: number;
  scale?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <coneGeometry args={[1.2, 5.2, 48, 1, true]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function Lighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);

  // Section lights refs for neon reactivity
  const officeWarm = useRef<THREE.PointLight>(null);
  const officeCyan = useRef<THREE.PointLight>(null);
  const officeTop = useRef<THREE.PointLight>(null);
  const officeFill = useRef<THREE.PointLight>(null);
  const aboutWarm = useRef<THREE.PointLight>(null);
  const aboutCyan = useRef<THREE.PointLight>(null);
  const skillsPurple = useRef<THREE.PointLight>(null);
  const skillsCyan = useRef<THREE.PointLight>(null);
  const projWarm = useRef<THREE.PointLight>(null);
  const projCyan = useRef<THREE.PointLight>(null);
  const expWarm = useRef<THREE.PointLight>(null);
  const expCyan = useRef<THREE.PointLight>(null);
  const achGold = useRef<THREE.PointLight>(null);
  const achCyan = useRef<THREE.PointLight>(null);
  const contactWarm = useRef<THREE.PointLight>(null);
  const portalCyan = useRef<THREE.PointLight>(null);

  const baseAmbient = useMemo(() => new THREE.Color("#0c1724"), []);
  const neonAmbient = useMemo(() => new THREE.Color("#020a18"), []);
  const baseDir = useMemo(() => new THREE.Color("#c8e4ff"), []);
  const neonDir = useMemo(() => new THREE.Color("#00f0ff"), []);
  const cyanColor = useMemo(() => new THREE.Color("#00f0ff"), []);

  useFrame((state) => {
    const t = neonStore.current;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3.0) * 0.08 * t;
    
    if (ambientRef.current) {
      ambientRef.current.color.lerpColors(baseAmbient, neonAmbient, t);
      ambientRef.current.intensity = 0.25 - t * 0.12; // darker ambient in neon
    }
    if (dirRef.current) {
      dirRef.current.color.lerpColors(baseDir, neonDir, t);
      dirRef.current.intensity = 2.0 + t * 2.5;
    }

    // All section lights shift toward electric cyan during neon mode
    if (officeWarm.current) {
      officeWarm.current.intensity = 80 * (1 - t * 0.5); // dim warm
      officeWarm.current.color.lerp(cyanColor, t * 0.4);
    }
    if (officeCyan.current) {
      officeCyan.current.intensity = 70 + t * 50 * pulse; // boost cyan
    }
    if (officeTop.current) {
      officeTop.current.intensity = 60 + t * 30;
    }
    if (officeFill.current) {
      officeFill.current.intensity = 50 + t * 20;
    }

    // About
    if (aboutWarm.current) {
      aboutWarm.current.intensity = 24 * (1 - t * 0.4);
      aboutWarm.current.color.lerp(cyanColor, t * 0.3);
    }
    if (aboutCyan.current) aboutCyan.current.intensity = 22 + t * 30 * pulse;

    // Skills
    if (skillsPurple.current) skillsPurple.current.intensity = 35 + t * 25;
    if (skillsCyan.current) skillsCyan.current.intensity = 20 + t * 40 * pulse;

    // Projects
    if (projWarm.current) {
      projWarm.current.intensity = 28 * (1 - t * 0.4);
      projWarm.current.color.lerp(cyanColor, t * 0.3);
    }
    if (projCyan.current) projCyan.current.intensity = 28 + t * 35 * pulse;

    // Experience
    if (expWarm.current) {
      expWarm.current.intensity = 26 * (1 - t * 0.4);
      expWarm.current.color.lerp(cyanColor, t * 0.3);
    }
    if (expCyan.current) expCyan.current.intensity = 24 + t * 35 * pulse;

    // Achievements
    if (achGold.current) {
      achGold.current.intensity = 36 * (1 - t * 0.3);
      achGold.current.color.lerp(cyanColor, t * 0.4);
    }
    if (achCyan.current) achCyan.current.intensity = 20 + t * 35 * pulse;

    // Contact & Portal
    if (contactWarm.current) {
      contactWarm.current.intensity = 38 * (1 - t * 0.3);
      contactWarm.current.color.lerp(cyanColor, t * 0.4);
    }
    if (portalCyan.current) portalCyan.current.intensity = 42 + t * 40 * pulse;
  });

  return (
    <group>
      {/* Ambient low light for cinematic deep blacks */}
      <ambientLight ref={ambientRef} intensity={0.25} />

      {/* Main directional key light */}
      <directionalLight
        ref={dirRef}
        position={[6, 12, 8]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
      />

      {/* Office warm key & neon rim lights */}
      <pointLight ref={officeWarm} position={[-4, 3, 3]} intensity={80} distance={20} decay={1.5} color="#ff8a30" />
      <pointLight ref={officeCyan} position={[5, 2.5, 2]} intensity={70} distance={20} decay={1.5} color="#67c9ff" />
      <pointLight ref={officeTop} position={[0, 4.2, -1]} intensity={60} distance={15} decay={1.5} color="#90b8f8" />
      {/* New Fill Light for the Chair back & Desk to prevent pure black silhouettes */}
      <pointLight ref={officeFill} position={[0, 2, 4]} intensity={50} distance={12} decay={1.5} color="#d4e8ff" />

      {/* About Section Lighting */}
      <pointLight ref={aboutWarm} position={[3, 1.5, -18]} intensity={24} distance={16} color="#ff8a30" />
      <pointLight ref={aboutCyan} position={[-4, 2, -18]} intensity={22} distance={16} color="#67c9ff" />

      {/* Skills Section Center Reactor Light */}
      <pointLight ref={skillsPurple} position={[0, 0, -34]} intensity={35} distance={18} color="#512bd4" />
      <pointLight ref={skillsCyan} position={[0, 2.5, -34]} intensity={20} distance={14} color="#00d8ff" />

      {/* Projects Section Gallery Lights */}
      <pointLight ref={projWarm} position={[-5, 2, -50]} intensity={28} distance={18} color="#ff8a30" />
      <pointLight ref={projCyan} position={[5, 2, -50]} intensity={28} distance={18} color="#67c9ff" />

      {/* Experience Section Timeline Lights */}
      <pointLight ref={expWarm} position={[-3, 1.5, -66]} intensity={26} distance={18} color="#ff8a30" />
      <pointLight ref={expCyan} position={[4, 2, -66]} intensity={24} distance={18} color="#38bdf8" />

      {/* Achievements Trophy Hall Lights */}
      <pointLight ref={achGold} position={[0, 3, -82]} intensity={36} distance={20} color="#ffc83b" />
      <pointLight ref={achCyan} position={[-5, 1, -82]} intensity={20} distance={15} color="#67c9ff" />

      {/* Contact & Final Portal Illuminations */}
      <pointLight ref={contactWarm} position={[0, 2.5, -98]} intensity={38} distance={22} color="#ff8a30" />
      <pointLight ref={portalCyan} position={[0, 0, -114]} intensity={42} distance={24} color="#67c9ff" />

      {/* Atmospheric Volumetric Cones — deep scene only */}
      <CinematicBeam position={[0, 5, -34]} rotation={[0.4, 0, 0]} color="#a855f7" opacity={0.05} scale={1.8} />
      <CinematicBeam position={[0, 6, -114]} rotation={[0.5, 0, 0]} color="#67c9ff" opacity={0.09} scale={2.2} />
    </group>
  );
}

