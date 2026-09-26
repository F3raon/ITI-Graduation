import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function CharacterParticles({ count = 120, progress = 0.5 }: { count?: number; progress?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    const cyan = new THREE.Color('#38bdf8');
    const magenta = new THREE.Color('#c084fc');
    const orange = new THREE.Color('#ff8a30');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 1.8;
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.2) * 3.5;
      pos[i * 3 + 2] = Math.sin(theta) * radius;

      // Color based on index and progress
      const color = i % 3 === 0 ? cyan : i % 3 === 1 ? magenta : orange;
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      spd[i] = 0.4 + Math.random() * 1.2;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const activity = 0.5 + progress * 2.5;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta * activity;
      if (arr[i * 3 + 1] > 3.6) {
        arr[i * 3 + 1] = -0.4;
      }
    }
    posAttr.needsUpdate = true;
    pointsRef.current.rotation.y += delta * 0.15 * activity;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.045 + progress * 0.04}
        vertexColors
        transparent
        opacity={0.3 + progress * 0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
