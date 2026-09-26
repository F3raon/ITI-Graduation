import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { ProjectPodium } from '../projects/ProjectPodium';
import { useScrollProgress } from '../../context/ScrollContext';

export function ProjectsScene({ position = [0, 0, -40] }: { position?: [number, number, number] }) {
  const { size } = useThree();
  const aspect = size.width / Math.max(1, size.height);
  const scale = aspect < 0.9 ? 0.58 : aspect < 1.25 ? 0.74 : aspect < 1.6 ? 0.9 : 1.0;
  
  const { progress } = useScrollProgress();

  const allProjects = [
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'miniature'),
    ...PORTFOLIO_DATA.projects.filter((p) => p.category === 'production').slice(0, 4)
  ];

  // Projects active range in scroll: roughly 0.72 to 0.79
  const isActive = progress >= 0.70 && progress <= 0.81;
  
  if (!isActive) return null; // Phase 7: VISIBILITY - completely hide when not active

  // Map progress (0.72 to 0.79) to a project index (0 to 7)
  const progressRatio = Math.max(0, Math.min(1, (progress - 0.73) / 0.05));
  const activeIndex = Math.min(allProjects.length - 1, Math.floor(progressRatio * allProjects.length));
  
  const activeProject = allProjects[activeIndex];

  return (
    <group position={position} scale={scale}>
      {/* Centered Section Header to prevent clipping */}
      <group position={[0, 4.2, -4]}>
        <Text position={[0, 0, 0]} fontSize={0.18} color="#94a3b8" anchorX="center" letterSpacing={0.22}>
          // 3D RESEARCH & PRODUCTION SYSTEMS
        </Text>
        <Text position={[0, -0.75, 0]} fontSize={0.72} color="#f8fafc" anchorX="center" fontWeight={900}>
          PROJECT LAB
        </Text>
        <Text position={[0, -1.4, 0]} maxWidth={4} textAlign="center" fontSize={0.15} color="#38bdf8" anchorX="center" letterSpacing={0.08}>
          PHYSICAL 3D DIORAMAS & PRODUCTION ARCHITECTURES // SCROLL TO NAVIGATE
        </Text>
        <Text position={[0, -1.9, 0]} fontSize={0.12} color="#cbd5e1" anchorX="center">
          {activeIndex + 1} / {allProjects.length}
        </Text>
      </group>

      {/* ONE HERO PROJECT positioned directly in the focal area */}
      <group position={[0, -0.5, -4]}>
        <ProjectPodium
          key={activeProject.id}
          project={activeProject}
          position={[0, 0, 0]}
          index={activeIndex}
        />
      </group>
    </group>
  );
}
