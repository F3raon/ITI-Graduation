import { Suspense } from 'react';
import { Lighting } from './Lighting';
import { Environment } from './Environment';
import { CameraRig } from './CameraRig';
import { NavigationHUD } from '../ui/NavigationHUD';
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

export function World() {
  return (
    <>
      {/* Background color and depth fog */}
      <color attach="background" args={['#030507']} />
      <fog attach="fog" args={['#030507', 12, 140]} />

      {/* Lighting Rig */}
      <Lighting />

      {/* Atmospheric Environment & Skyline */}
      <Environment />

      {/* Cinematic Camera Controller driven by continuous scroll */}
      <CameraRig />

      {/* 3D World Journey Sections */}
      <Suspense fallback={null}>
        {/* 0.00: Cinematic Intro & Entry Tunnel */}
        <IntroScene position={[0, 0, 10]} />

        {/* 0.18: Full 3D Developer Office & Workstation */}
        <group position={[0, 0, 0]}>
          <Office />
        </group>

        {/* 0.25 - 0.45: Ahmed Hamada 3D Character Chamber, Transformation & 360 Orbit */}
        <CharacterScene position={[0, -0.6, -8.0]} />

        {/* 0.52: About Area & Holographic Portrait */}
        <AboutScene position={[0, 0, -18]} />

        {/* 0.46: Skills Chamber & .NET Core Reactor */}
        <SkillsScene position={[0, 0, -34]} />

        {/* 0.60: Project Lab & 3D Dioramas */}
        <ProjectsScene position={[0, 0, -50]} />

        {/* 0.74: Experience Hall & Chronological Timeline */}
        <ExperienceScene position={[0, 0, -66]} />

        {/* 0.85: Achievements & Honors Chamber */}
        <AchievementsScene position={[0, 0, -82]} />

        {/* 0.93: Contact Chamber & 3D Terminals */}
        <ContactScene position={[0, 0, -98]} />

        {/* 1.00: Final Portal & Live Interactive Embedded Screen */}
        <PortfolioPortal position={[0, 0, -114]} />

        {/* Floating 3D Navigation HUD */}
        <NavigationHUD />
      </Suspense>
    </>
  );
}
