import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { ProjectPodium } from '../projects/ProjectPodium';

export function ProjectsScene({ position = [0, 0, -50] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.58 : aspect < 1.25 ? 0.74 : aspect < 1.6 ? 0.9 : 1.0;

  // 4 Featured 3D Miniature Dioramas placed prominently in foreground
  const miniatureProjects = PORTFOLIO_DATA.projects.filter((p) => p.category === 'miniature');
  // Verified Production Systems placed in supporting gallery
  const productionProjects = PORTFOLIO_DATA.projects.filter((p) => p.category === 'production');
  const isMobile = aspect < 0.9;

  return (
    <group position={position} scale={scale}>
      {/* Section Header */}
      <Text position={[-6.2, 3.6, 0]} fontSize={0.18} color="#94a3b8" anchorX="left" letterSpacing={0.22}>
        // 3D RESEARCH & PRODUCTION SYSTEMS
      </Text>
      <Text position={[-6.2, 2.85, 0]} fontSize={0.72} color="#f8fafc" anchorX="left" fontWeight={900}>
        PROJECT LAB
      </Text>
      <Text position={[-6.2, 2.2, 0]} fontSize={0.15} color="#67c9ff" anchorX="left" letterSpacing={0.08}>
        PHYSICAL 3D DIORAMAS & PRODUCTION ARCHITECTURES // CLICK ANY SYSTEM TO OPEN LIVE REPOSITORY
      </Text>

      {/* Row 1: The 4 Interactive 3D Miniature Worlds */}
      <group position={[0, isMobile ? 1.8 : 0.4, 0]}>
        {miniatureProjects.map((project, i) => {
          const x = isMobile ? (i % 2 === 0 ? -1.9 : 1.9) : (i - 1.5) * 3.8;
          const y = isMobile ? (i < 2 ? 1.6 : -1.6) : 0;
          return (
            <ProjectPodium
              key={project.id}
              project={project}
              position={[x, y, 0]}
              index={i}
            />
          );
        })}
      </group>

      {/* Row 2: Production Systems & APIs */}
      <group position={[0, isMobile ? -3.4 : -2.6, 0]}>
        {productionProjects.slice(0, 4).map((project, i) => {
          const x = isMobile ? (i % 2 === 0 ? -1.9 : 1.9) : (i - 1.5) * 3.8;
          const y = isMobile ? (i < 2 ? 1.6 : -1.6) : 0;
          return (
            <ProjectPodium
              key={project.id}
              project={project}
              position={[x, y, 0]}
              index={i + 4}
            />
          );
        })}
      </group>
    </group>
  );
}
