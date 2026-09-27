import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { soundEngine } from '../../utils/audio';

const ITI_SESSIONS = [
  { name: "Session 1", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%201" },
  { name: "Session 2", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%202" },
  { name: "Session 3", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%203" },
  { name: "Session 4", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%204" },
  { name: "Session 5", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%205" },
  { name: "Session 6", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%206" },
  { name: "Session 7", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%207" },
  { name: "Session 8", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%208" },
  { name: "Session 9", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%209" },
  { name: "Session 10", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2010" },
  { name: "Session 12", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2012" },
  { name: "Session 13", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2013" },
  { name: "Session 14", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2014" },
  { name: "Session 15", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2015" },
  { name: "Session 16", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2016" },
  { name: "Session 17", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2017" },
  { name: "Session 18", url: "https://github.com/F3raon/ITI-react.js-Assignments/tree/main/Session%2018" }
];

function FileItem({ name, url, position }: { name: string; url: string; position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<THREE.Group>(null);
  
  useFrame((_, delta) => {
    if (!ref.current) return;
    const targetScale = hovered ? 1.05 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 1 - Math.exp(-8 * delta));
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, position[2] + (hovered ? 0.1 : 0), 1 - Math.exp(-8 * delta));
  });

  return (
    <group 
      ref={ref} 
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); soundEngine.playHover(); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      onClick={(e) => { e.stopPropagation(); soundEngine.playSelect(); window.open(url, '_blank'); }}
    >
      {/* File Base (Premium Dark Glass) */}
      <RoundedBox args={[1.8, 0.38, 0.05]} radius={0.02} smoothness={3}>
        <meshPhysicalMaterial 
          color="#0a0505"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1.0}
          transparent
          opacity={0.9}
          emissive={hovered ? "#ef4444" : "#000000"}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </RoundedBox>

      {/* Futuristic Folder Icon (Red Tint) */}
      <mesh position={[-0.7, 0, 0.03]}>
        <boxGeometry args={[0.15, 0.12, 0.02]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : "#f87171"} emissive={hovered ? "#ffffff" : "#000000"} emissiveIntensity={0.5} />
      </mesh>
      {/* Folder Flap */}
      <mesh position={[-0.74, 0.08, 0.03]}>
        <boxGeometry args={[0.07, 0.04, 0.02]} />
        <meshStandardMaterial color={hovered ? "#ffffff" : "#f87171"} />
      </mesh>

      <Text position={[-0.5, 0, 0.03]} fontSize={0.11} color={hovered ? "#ffffff" : "#cbd5e1"} anchorX="left" fontWeight={700} letterSpacing={0.05}>
        {name.toUpperCase()}
      </Text>
      
      <Text position={[0.7, 0, 0.03]} fontSize={0.08} color={hovered ? "#ef4444" : "#475569"} anchorX="right" fontWeight={500}>
        OPEN ↗
      </Text>
    </group>
  );
}

export function ITIProjectsBranch({ position = [0, 0, 0] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main Container Glass Panel */}
      <RoundedBox args={[4.4, 4.8, 0.1]} radius={0.08} smoothness={4} position={[0, 0, -0.1]} castShadow>
        <meshPhysicalMaterial
          color="#060202"
          metalness={0.9}
          roughness={0.2}
          clearcoat={1.0}
          transparent
          opacity={0.7}
        />
      </RoundedBox>

      {/* Header Text */}
      <Text position={[-1.8, 2.0, 0.0]} fontSize={0.14} color="#f87171" anchorX="left" letterSpacing={0.2}>
        // ACADEMIC BRANCH
      </Text>
      <Text position={[-1.8, 1.6, 0.0]} fontSize={0.4} color="#f8fafc" anchorX="left" fontWeight={900}>
        ITI ASSIGNMENTS
      </Text>
      <Text position={[-1.8, 1.25, 0.0]} maxWidth={3.6} fontSize={0.09} color="#94a3b8" anchorX="left" lineHeight={1.5}>
        REACT.JS TRACK • COMPREHENSIVE TASKS & PROJECTS ARCHIVE
      </Text>

      {/* Grid of Files */}
      <group position={[0, -0.2, 0.05]}>
        {ITI_SESSIONS.map((session, i) => {
          // 2 Columns layout
          const col = i % 2;
          const row = Math.floor(i / 2);
          
          const x = col === 0 ? -1.0 : 1.0;
          const y = 1.0 - (row * 0.45); // Start at top and go down
          
          return (
            <FileItem
              key={session.name}
              name={session.name}
              url={session.url}
              position={[x, y, 0]}
            />
          );
        })}
      </group>
    </group>
  );
}
