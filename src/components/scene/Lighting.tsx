import * as THREE from 'three';

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
  return (
    <group>
      {/* Ambient low light for cinematic deep blacks */}
      <ambientLight intensity={0.25} color="#0c1724" />

      {/* Main directional key light */}
      <directionalLight
        position={[6, 12, 8]}
        intensity={2.0}
        color="#c8e4ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
      />

      {/* Office warm key & neon rim lights */}
      <pointLight position={[-4, 3, 3]} intensity={80} distance={20} decay={1.5} color="#ff8a30" />
      <pointLight position={[5, 2.5, 2]} intensity={70} distance={20} decay={1.5} color="#67c9ff" />
      <pointLight position={[0, 4.2, -1]} intensity={60} distance={15} decay={1.5} color="#90b8f8" />
      {/* New Fill Light for the Chair back & Desk to prevent pure black silhouettes */}
      <pointLight position={[0, 2, 4]} intensity={50} distance={12} decay={1.5} color="#d4e8ff" />

      {/* About Section Lighting */}
      <pointLight position={[3, 1.5, -18]} intensity={24} distance={16} color="#ff8a30" />
      <pointLight position={[-4, 2, -18]} intensity={22} distance={16} color="#67c9ff" />

      {/* Skills Section Center Reactor Light */}
      <pointLight position={[0, 0, -34]} intensity={35} distance={18} color="#512bd4" />
      <pointLight position={[0, 2.5, -34]} intensity={20} distance={14} color="#00d8ff" />

      {/* Projects Section Gallery Lights */}
      <pointLight position={[-5, 2, -50]} intensity={28} distance={18} color="#ff8a30" />
      <pointLight position={[5, 2, -50]} intensity={28} distance={18} color="#67c9ff" />

      {/* Experience Section Timeline Lights */}
      <pointLight position={[-3, 1.5, -66]} intensity={26} distance={18} color="#ff8a30" />
      <pointLight position={[4, 2, -66]} intensity={24} distance={18} color="#38bdf8" />

      {/* Achievements Trophy Hall Lights */}
      <pointLight position={[0, 3, -82]} intensity={36} distance={20} color="#ffc83b" />
      <pointLight position={[-5, 1, -82]} intensity={20} distance={15} color="#67c9ff" />

      {/* Contact & Final Portal Illuminations */}
      <pointLight position={[0, 2.5, -98]} intensity={38} distance={22} color="#ff8a30" />
      <pointLight position={[0, 0, -114]} intensity={42} distance={24} color="#67c9ff" />

      {/* Atmospheric Volumetric Cones — deep scene only */}
      <CinematicBeam position={[0, 5, -34]} rotation={[0.4, 0, 0]} color="#a855f7" opacity={0.05} scale={1.8} />
      <CinematicBeam position={[0, 6, -114]} rotation={[0.5, 0, 0]} color="#67c9ff" opacity={0.09} scale={2.2} />
    </group>
  );
}
