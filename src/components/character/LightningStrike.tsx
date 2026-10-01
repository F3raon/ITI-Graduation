import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { neonStore } from '../../context/NeonContext';

export function LightningStrike() {
  const lineRef = useRef<THREE.LineSegments>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  
  // Create a fixed size buffer for line segments
  const maxSegments = 60;
  const positions = useMemo(() => new Float32Array(maxSegments * 6), []);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const state = useRef({
    timer: 0,
    active: false,
    life: 0,
    cooldown: Math.random() * 2 + 1,
  });

  useFrame((_, delta) => {
    const neonT = neonStore.current;
    if (neonT < 0.6) {
      if (matRef.current) matRef.current.opacity = 0;
      return;
    }

    state.current.timer += delta;

    if (!state.current.active && state.current.timer > state.current.cooldown) {
      // Strike!
      state.current.active = true;
      state.current.life = 0;
      state.current.timer = 0;
      state.current.cooldown = Math.random() * 1.5 + 0.5 - neonT * 0.3;

      // Generate random zigzag branches
      let cx = (Math.random() - 0.5) * 3;
      let cy = 4.5;
      let cz = -0.5;

      for (let i = 0; i < maxSegments; i++) {
        const nx = cx + (Math.random() - 0.5) * 1.2;
        const ny = cy - (Math.random() * 0.8 + 0.2);
        const nz = cz + (Math.random() - 0.5) * 0.5;
        
        positions[i * 6] = cx;
        positions[i * 6 + 1] = cy;
        positions[i * 6 + 2] = cz;
        
        positions[i * 6 + 3] = nx;
        positions[i * 6 + 4] = ny;
        positions[i * 6 + 5] = nz;

        cx = nx;
        cy = ny;
        cz = nz;

        // Random branching (rare)
        if (Math.random() < 0.15) {
          cx = positions[i * 6];
          cy = positions[i * 6 + 1];
          cz = positions[i * 6 + 2];
        }
      }
      geometry.attributes.position.needsUpdate = true;
    }

    if (state.current.active) {
      state.current.life += delta * 15; // flashes very quickly
      
      if (matRef.current) {
        // Flicker intensity
        matRef.current.opacity = Math.random() > 0.3 ? (1.0 - state.current.life) : 0.2;
      }

      if (state.current.life > 1.0) {
        state.current.active = false;
        if (matRef.current) matRef.current.opacity = 0;
      }
    }
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        ref={matRef}
        color="#00f0ff"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
