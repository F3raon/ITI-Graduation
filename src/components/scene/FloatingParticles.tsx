import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { neonStore } from '../../context/NeonContext';

export function FloatingParticles({ count = 600 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const baseColor = useMemo(() => new THREE.Color("#38bdf8"), []);
  const neonColor = useMemo(() => new THREE.Color("#00f0ff"), []);

  const particles = useRef(
    Array.from({ length: count }, () => ({
      t:      Math.random() * 100,
      speed:  0.006 + Math.random() * 0.012,
      x:      (Math.random() - 0.5) * 40,
      y:      (Math.random() - 0.5) * 20,
      z:      (Math.random() - 0.5) * 120 - 20,
      size:   0.014 + Math.random() * 0.018,
      drift:  (Math.random() - 0.5) * 0.4,
    }))
  );

  useFrame((state) => {
    if (!mesh.current || !matRef.current) return;
    
    const neonT = neonStore.current;
    
    // Interpolate color and opacity based on neon state
    matRef.current.color.lerpColors(baseColor, neonColor, neonT);
    matRef.current.opacity = 0.18 + neonT * 0.4; // brighter in neon mode

    particles.current.forEach((p, i) => {
      // Speed up particles during neon mode
      p.t += p.speed * (1 + neonT * 3.0);
      
      dummy.position.set(
        p.x + Math.sin(p.t + p.drift) * (0.3 + neonT * 0.5),
        p.y + Math.cos(p.t * 0.7) * (0.25 + neonT * 0.5),
        p.z
      );
      // Slightly larger particles in neon mode
      dummy.scale.setScalar(p.size * (1 + neonT * 0.5)); 
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
