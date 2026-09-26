import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function FloatingParticles({ count = 800 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const lightMesh = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  const particles = useRef(
    Array.from({ length: count }, () => ({
      t: Math.random() * 100,
      factor: 0.2 + Math.random() * 0.8,
      speed: 0.01 + Math.random() * 0.015,
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 20,
      z: (Math.random() - 0.5) * 120 - 20,
    }))
  );

  useFrame((state) => {
    if (!mesh.current || !lightMesh.current) return;
    particles.current.forEach((particle, i) => {
      particle.t += particle.speed;
      dummy.position.set(
        particle.x + Math.sin(particle.t) * particle.factor,
        particle.y + Math.cos(particle.t) * particle.factor,
        particle.z
      );
      dummy.scale.setScalar(particle.factor);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
      lightMesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    lightMesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.02, 0]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.15} />
      </instancedMesh>
      <instancedMesh ref={lightMesh} args={[undefined, undefined, Math.floor(count / 4)]}>
        <dodecahedronGeometry args={[0.04, 0]} />
        <meshBasicMaterial color="#ff8a30" transparent opacity={0.3} />
      </instancedMesh>
    </>
  );
}
