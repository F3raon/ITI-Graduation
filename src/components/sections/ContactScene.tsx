import { useState, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { soundEngine } from '../../utils/audio';

export function ContactScene({ position = [0, 0, -98] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.6 : aspect < 1.25 ? 0.76 : aspect < 1.6 ? 0.92 : 1.0;

  return (
    <group position={position} scale={scale}>
      {/* Clean Typography Layout */}
      <group position={[0, 1.0, 0]}>
        <Text position={[0, 0.8, 0]} fontSize={0.7} color="#ffffff" anchorX="center" fontWeight={900}>
          LET'S BUILD
        </Text>
        <Text position={[0, -0.1, 0]} fontSize={0.7} color="#38bdf8" anchorX="center" fontWeight={900}>
          SOMETHING.
        </Text>
        <Text position={[0, -0.9, 0]} fontSize={0.14} color="#94a3b8" anchorX="center" letterSpacing={0.1}>
          HAVE AN IDEA, A PROJECT, OR SOMETHING WORTH BUILDING?
        </Text>
      </group>

      <group position={[0, -1.2, 0]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#ffffff" anchorX="center" fontWeight={700} letterSpacing={0.2}>
          AHMED HAMADA
        </Text>
        
        <group position={[0, -0.6, 0]}>
          <Text 
            position={[-1.5, 0, 0]} 
            fontSize={0.12} 
            color="#cbd5e1" 
            anchorX="center" 
            onClick={() => {
              soundEngine.playSelect();
              window.open(PORTFOLIO_DATA.identity.linkedin, '_blank');
            }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            LINKEDIN
          </Text>
          <Text 
            position={[0, 0, 0]} 
            fontSize={0.12} 
            color="#cbd5e1" 
            anchorX="center"
            onClick={() => {
              soundEngine.playSelect();
              window.open(PORTFOLIO_DATA.identity.github, '_blank');
            }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            GITHUB
          </Text>
          <Text 
            position={[1.5, 0, 0]} 
            fontSize={0.12} 
            color="#cbd5e1" 
            anchorX="center"
            onClick={() => {
              soundEngine.playSelect();
              window.open(`mailto:${PORTFOLIO_DATA.identity.email}`, '_blank');
            }}
            onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            EMAIL
          </Text>
        </group>
      </group>
    </group>
  );
}
