import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { ProjectPodium } from '../projects/ProjectPodium';
import { ITIProjectsBranch } from '../projects/ITIProjectsBranch';
import { WORLD } from '../../data/world';
import { scrollStore } from '../../context/ScrollContext';
import { SECTION_MAP, sectionProgress } from '../../data/sections';

export function ProjectsScene({ position = [0, 0, WORLD.PROJECTS_Z] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.6 : aspect < 1.25 ? 0.75 : aspect < 1.6 ? 0.9 : 1.0;
  
  const carouselRef = useRef<THREE.Group>(null);
  
  // Combine all projects (no cap to show everything)
  const allProjects = [
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'miniature'),
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'production')
  ];

  const total = allProjects.length;
  const radius = 8.5; // Increased radius to fit all 11+ projects without overlapping

  const [visible, setVisible] = useState(false);

  useFrame((state) => {
    // Visible from just before PROJECT LAB to slightly after
    const isVisible = scrollStore.current > SECTION_MAP['PROJECTS'].start - 0.1 && scrollStore.current < SECTION_MAP['PROJECTS'].end + 0.1;
    if (visible !== isVisible) setVisible(isVisible);

    if (!carouselRef.current || !visible) return;
    
    // Local progress for this section (0 -> 1)
    const p = sectionProgress(scrollStore.current, SECTION_MAP['PROJECTS']);
    
    // Continuous smooth 360 rotation
    const targetRotation = state.clock.elapsedTime * 0.12;
    
    carouselRef.current.rotation.y = THREE.MathUtils.lerp(
      carouselRef.current.rotation.y,
      targetRotation,
      0.1
    );
  });

  if (!visible) return null;

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}

      <Text position={[0, 3.1, 0]} fontSize={0.65} color="#f8fafc" anchorX="center" fontWeight={900}>
        PROJECT LAB
      </Text>
      <Text position={[0, 2.5, 0]} fontSize={0.13} color="#94a3b8" anchorX="center" letterSpacing={0.08}>
        PHYSICAL 3D DIORAMAS & PRODUCTION ARCHITECTURES // SCROLL TO BROWSE // CLICK TO OPEN
      </Text>

      {/* Rotating Carousel of Projects (Left side) */}
      <group position={[-12, 0, -10]} scale={0.68}>
        <group position={[0, -0.2, 0]}>
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
