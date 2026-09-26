import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { scrollStore } from '../../context/ScrollContext';
import { soundEngine } from '../../utils/audio';

interface NavPoint {
  id: string;
  name: string;
  target: number;
}

const NAV_POINTS: NavPoint[] = [
  { id: '01', name: 'ENTRY', target: 0.0 },
  { id: '02', name: 'OFFICE', target: 0.16 },
  { id: '03', name: 'AHMED 3D', target: 0.27 },
  { id: '04', name: 'ORBIT', target: 0.45 },
  { id: '05', name: 'ABOUT', target: 0.62 },
  { id: '06', name: 'SKILLS', target: 0.68 },
  { id: '07', name: 'PROJECTS', target: 0.74 },
  { id: '08', name: 'TIMELINE', target: 0.81 },
  { id: '09', name: 'HONORS', target: 0.86 },
  { id: '10', name: 'CONTACT', target: 0.91 },
  { id: '11', name: 'PORTAL', target: 1.0 },
];

function NavNode({
  point,
  active,
  position,
  onSelect,
}: {
  point: NavPoint;
  active: boolean;
  position: [number, number, number];
  onSelect: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
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
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playSelect();
        onSelect();
      }}
    >
      {/* Node Dot */}
      <mesh scale={active || hovered ? 1.3 : 1}>
        <circleGeometry args={[0.075, 24]} />
        <meshBasicMaterial color={active ? '#ff8a30' : hovered ? '#67c9ff' : '#475569'} />
      </mesh>

      {/* Number Tag */}
      <Text
        position={[-0.18, 0, 0]}
        fontSize={0.075}
        color={active ? '#ff8a30' : hovered ? '#f8fafc' : '#64748b'}
        anchorX="right"
        anchorY="middle"
        fontWeight={700}
      >
        {point.id}
      </Text>

      {/* Label on Hover / Active */}
      {(hovered || active) && (
        <Text
          position={[0.2, 0, 0]}
          fontSize={0.068}
          color={active ? '#ff8a30' : '#67c9ff'}
          anchorX="left"
          anchorY="middle"
          letterSpacing={0.12}
        >
          {point.name}
        </Text>
      )}
    </group>
  );
}

export function NavigationHUD() {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [activeTarget, setActiveTarget] = useState(0);

  useFrame(() => {
    if (!groupRef.current) return;
    // Follow camera orientation and maintain a fixed screen-space anchor on the right side
    const anchor = new THREE.Vector3(3.8, 1.4, -3.2);
    anchor.applyQuaternion(camera.quaternion);
    anchor.add(camera.position);

    groupRef.current.position.lerp(anchor, 0.12);
    groupRef.current.quaternion.copy(camera.quaternion);

    // Update active node based on scrollStore.current
    const closest = NAV_POINTS.reduce((prev, curr) => {
      return Math.abs(curr.target - scrollStore.current) < Math.abs(prev.target - scrollStore.current)
        ? curr
        : prev;
    });
    if (closest.target !== activeTarget) {
      setActiveTarget(closest.target);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Header Tag */}
      <Text
        position={[-0.18, 0.35, 0]}
        fontSize={0.055}
        color="#64748b"
        anchorX="right"
        letterSpacing={0.18}
      >
        NAV / WAYPOINTS
      </Text>

      {/* Vertical Rail Line */}
      <mesh position={[0, -1.8, -0.01]}>
        <planeGeometry args={[0.01, 3.8]} />
        <meshBasicMaterial color="#1e293b" />
      </mesh>

      {/* Nav Node Buttons */}
      {NAV_POINTS.map((pt, i) => {
        const isActive = pt.target === activeTarget;
        return (
          <NavNode
            key={pt.id}
            point={pt}
            active={isActive}
            position={[0, -i * 0.42, 0]}
            onSelect={() => scrollStore.scrollTo(pt.target)}
          />
        );
      })}
    </group>
  );
}
