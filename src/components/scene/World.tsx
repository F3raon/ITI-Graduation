import { Suspense } from 'react';
import { Lighting } from './Lighting';
import { Environment } from './Environment';
import { CameraRig } from './CameraRig';
import { Effects } from './Effects';
import { FloatingParticles } from './FloatingParticles';
import { IntroScene } from '../sections/IntroScene';
import { Office } from '../office/Office';
import { CharacterScene } from '../sections/CharacterScene';
import { AboutScene } from '../sections/AboutScene';
import { SkillsScene } from '../sections/SkillsScene';
import { ProjectsScene } from '../sections/ProjectsScene';
import { ExperienceScene } from '../sections/ExperienceScene';
import { AchievementsScene } from '../sections/AchievementsScene';
import { ContactScene } from '../sections/ContactScene';
import { PortfolioPortal } from '../sections/PortfolioPortal';

// World section Z-depth layout:
// Intro:         Z = +10
// Office:        Z =   0
// Character:     Z =  -9.5 (dais center)
// About:         Z = -22
// Skills:        Z = -30
// Projects:      Z = -39
// Experience:    Z = -48
// Achievements:  Z = -57
// Contact:       Z = -66
// Portal:        Z = -78

export function World() {
  return (
    <>
      {/* Background color and depth fog */}
      <color attach="background" args={['#030507']} />
      <fog attach="fog" args={['#030507', 8, 100]} />

      {/* Lighting Rig */}
      <Lighting />

      {/* Atmospheric Environment & Skyline */}
      <Environment />

      {/* Cinematic Camera Controller driven by continuous scroll */}
      <CameraRig />

      {/* Post Processing Effects */}
      <Effects />

      {/* Dust/Atmospheric Particles — sparse, subtle */}
      <FloatingParticles count={600} />

      {/* 3D World Journey Sections */}
      <Suspense fallback={null}>
        {/* 0.00: Cinematic Intro & Entry Tunnel */}
        <IntroScene position={[0, 0, 10]} />

        {/* 0.16: Full 3D Developer Office & Workstation */}
        <group position={[0, 0, 0]}>
          <Office />
        </group>

        {/* 0.24 – 0.51: Ahmed Hamada 3D Character Chamber, Transformation & 360° Orbit */}
        {/* Dais center is at Z = -9.5 so the camera orbits around it correctly */}
        <CharacterScene position={[0, -0.6, -9.5]} />

        {/* 0.60: About Me & Holographic Portrait */}
        <AboutScene position={[0, 0, -22]} />

        {/* 0.66: Skills Lab & .NET Core Reactor */}
        <SkillsScene position={[0, 0, -30]} />

        {/* 0.72: Project Lab & 3D Miniature Dioramas */}
        <ProjectsScene position={[0, 0, -39]} />

        {/* 0.79: Experience Hall & Chronological Timeline */}
        <ExperienceScene position={[0, 0, -48]} />

        {/* 0.86: Achievements & Honors Chamber */}
        <AchievementsScene position={[0, 0, -57]} />

        {/* 0.91: Contact Chamber & 3D Terminals */}
        <ContactScene position={[0, 0, -66]} />

        {/* 1.00: Final Portal & Live Interactive Embedded Screen */}
        <PortfolioPortal position={[0, 0, -78]} />

      </Suspense>
    </>
  );
}
