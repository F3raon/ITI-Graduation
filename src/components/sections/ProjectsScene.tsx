import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { ProjectPodium } from '../projects/ProjectPodium';
import { ITIProjectsBranch } from '../projects/ITIProjectsBranch';
import { WORLD, sectionProgress } from '../../data/world';
import { scrollStore } from '../../context/ScrollContext';

export function ProjectsScene({ position = [0, 0, WORLD.PROJECTS_Z] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.6 : aspect < 1.25 ? 0.75 : aspect < 1.6 ? 0.9 : 1.0;
  
  const rootRef = useRef<THREE.Group>(null);
  const carouselRef = useRef<THREE.Group>(null);
  
  // Combine all projects (no cap to show everything)
  const allProjects = [
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'miniature'),
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'production')
  ];

  const total = allProjects.length;
  const radius = 8.5; // Increased radius to fit all 11+ projects without overlapping

  useFrame((state) => {
    if (!carouselRef.current) return;
    
    // Local progress for this section (0 -> 1)
    const p = sectionProgress(scrollStore.current, WORLD.SCROLL_PROJECTS[0], WORLD.SCROLL_PROJECTS[1]);
    
    // Continuous 360 rotation + scroll influence
    const autoRotate = state.clock.elapsedTime * 0.15;
    const scrollRotate = p * (Math.PI * 2);
    const targetRotation = autoRotate + scrollRotate;
    
    carouselRef.current.rotation.y = THREE.MathUtils.lerp(
      carouselRef.current.rotation.y,
      targetRotation,
      0.1
    );
    if (rootRef.current) {
      // Show projects scene between 0.60 and 0.88
      const pGlobal = scrollStore.current;
      const isVisible = pGlobal > 0.60 && pGlobal < 0.88;
      const targetScale = isVisible ? scale : 0.001;
      rootRef.current.scale.setScalar(
        THREE.MathUtils.lerp(rootRef.current.scale.x, targetScale, 0.05)
      );
    }
  });

  return (
    <group position={position} ref={rootRef} scale={scale}>
      {/* Section Header */}
      <Text position={[0, 3.8, 0]} fontSize={0.16} color="#67c9ff" anchorX="center" letterSpacing={0.22}>
        // 3D RESEARCH & PRODUCTION SYSTEMS
      </Text>
      <Text position={[0, 3.1, 0]} fontSize={0.65} color="#f8fafc" anchorX="center" fontWeight={900}>
        PROJECT LAB
      </Text>
      <Text position={[0, 2.5, 0]} fontSize={0.13} color="#94a3b8" anchorX="center" letterSpacing={0.08}>
        PHYSICAL 3D DIORAMAS & PRODUCTION ARCHITECTURES // SCROLL TO BROWSE // CLICK TO OPEN
      </Text>

      {/* Rotating Carousel of Projects (Left side) */}
      <group position={[-7.5, 0, 0]} scale={0.68}>
        <group position={[0, -0.2, -radius + 1]}>
          <group ref={carouselRef}>
          {allProjects.map((project, i) => {
            const angle = -(i / total) * Math.PI * 2;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;
            
            return (
              <group key={project.id} position={[x, 0, z]} rotation={[0, angle, 0]}>
                <ProjectPodium
                  project={project}
                  position={[0, 0, 0]}
                  index={i}
                />
              </group>
            );
          })}
        </group>
        </group>
      </group>

      {/* ITI Academic Projects Branch (Right side) */}
      <group position={[2.8, 0.4, 0]} scale={0.68}>
        <ITIProjectsBranch position={[0, 0, 0]} />
      </group>
    </group>
  );
}
