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
  
  const carouselRef = useRef<THREE.Group>(null);
  
  // Combine all projects
  const allProjects = [
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'miniature'),
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'production')
  ].slice(0, 6); // Cap at 6 for presentation stability

  const total = allProjects.length;
  const radius = 6.5; // Radius of the carousel cylinder

  useFrame(() => {
    if (!carouselRef.current) return;
    
    // Local progress for this section (0 -> 1)
    const p = sectionProgress(scrollStore.current, WORLD.SCROLL_PROJECTS[0], WORLD.SCROLL_PROJECTS[1]);
    
    // As we scroll through the section, rotate the carousel to show different projects
    // p=0 shows the first project, p=1 shows the last project
    const targetRotation = p * (Math.PI * 2 * ((total - 1) / total));
    
    carouselRef.current.rotation.y = THREE.MathUtils.lerp(
      carouselRef.current.rotation.y,
      targetRotation,
      0.1
    );
  });

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[-5.8, 3.8, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // 3D RESEARCH & PRODUCTION SYSTEMS
      </Text>
      <Text position={[-5.8, 3.0, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        PROJECT LAB
      </Text>
      <Text position={[-5.8, 2.35, 0]} fontSize={0.15} color="#67c9ff" anchorX="left" letterSpacing={0.08}>
        PHYSICAL 3D DIORAMAS & PRODUCTION ARCHITECTURES // SCROLL TO BROWSE // CLICK TO OPEN
      </Text>

      {/* Rotating Carousel of Projects */}
      {/* We move it back by radius so the front-most item is at Z=0 relative to the scene */}
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

      {/* ITI Academic Projects Branch (Right side) */}
      <ITIProjectsBranch position={[6.0, 0.5, 0]} />
    </group>
  );
}
