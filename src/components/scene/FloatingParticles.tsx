import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingParticles({ count = 600 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useRef(
    Array.from({ length: count }, () => ({
      t:      Math.random() * 100,
      speed:  0.006 + Math.random() * 0.012,
      x:      (Math.random() - 0.5) * 40,
      y:      (Math.random() - 0.5) * 20,
      z:      (Math.random() - 0.5) * 120 - 20,
      // Tiny fixed scale — never large enough to look like blocks
      size:   0.014 + Math.random() * 0.018,
      drift:  (Math.random() - 0.5) * 0.4,
    }))
  );

  useFrame((state) => {
    if (!mesh.current) return;
    particles.current.forEach((p, i) => {
      p.t += p.speed;
      dummy.position.set(
        p.x + Math.sin(p.t + p.drift) * 0.3,
        p.y + Math.cos(p.t * 0.7) * 0.25,
        p.z
      );
      dummy.scale.setScalar(p.size); // always tiny
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    // Single mesh: mostly blue-white, subtle, no color variety
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.18}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </instancedMesh>
  );
}
