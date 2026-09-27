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
import { WORLD } from '../../data/world';

/**
 * WORLD — Section Z Layout (from WORLD constants)
 *
 * INTRO:         Z = +8
 * OFFICE:        Z =  0
 * CHARACTER:     Z = -10
 * ABOUT:         Z = -22
 * SKILLS:        Z = -34
 * PROJECTS:      Z = -46
 * EXPERIENCE:    Z = -58
 * ACHIEVEMENTS:  Z = -70
 * CONTACT:       Z = -82
 * PORTAL:        Z = -94
 */
export function World() {
  return (
    <>
      {/* Scene background & fog */}
      <color attach="background" args={['#020507']} />
      {/* Fog starts at 10 units, fully opaque at 105 units — covers entire journey */}
      <fog attach="fog" args={['#020507', 10, 105]} />

      {/* Global lighting */}
      <Lighting />

      {/* HDRI / environment */}
      <Environment />

      {/* Single camera controller */}
      <CameraRig />

      {/* Postprocessing — wrapped in try boundary to prevent black screen on failure */}
      <Suspense fallback={null}>
        <Effects />
      </Suspense>

      {/* Atmospheric dust — sparse */}
      <FloatingParticles count={500} />

      {/* ── WORLD JOURNEY ─────────────────────────────────────────────────── */}
      {/* 0.00 – 0.14: INTRO — Camera at Z=13, content at Z=8 */}
      <IntroScene position={[0, 0, WORLD.INTRO_Z]} />

      {/* 0.14 – 0.26: OFFICE — Camera at Z=5, content at Z=0 */}
      <group position={[0, 0, WORLD.OFFICE_Z]}>
        <Office />
      </group>

      {/* 0.26 – 0.48: AHMED CHARACTER + TRANSFORMATION */}
      {/* Dais center: Z=-10, Camera front-face: Z=-5 */}
      <CharacterScene position={[0, -0.5, WORLD.CHARACTER_Z]} />

      {/* 0.48 – 0.58: ABOUT ME */}
      <AboutScene position={[0, 0, WORLD.ABOUT_Z]} />

      {/* 0.58 – 0.66: SKILLS LAB */}
      <SkillsScene position={[0, 0, WORLD.SKILLS_Z]} />

      {/* 0.66 – 0.76: PROJECTS */}
      <ProjectsScene position={[0, 0, WORLD.PROJECTS_Z]} />

      {/* 0.76 – 0.84: EXPERIENCE */}
      <ExperienceScene position={[0, 0, WORLD.EXPERIENCE_Z]} />

      {/* 0.84 – 0.90: ACHIEVEMENTS */}
      <AchievementsScene position={[0, 0, WORLD.ACHIEVEMENTS_Z]} />

      {/* 0.90 – 0.96: CONTACT */}
      <ContactScene position={[0, 0, WORLD.CONTACT_Z]} />

      {/* 0.96 – 1.00: FINAL PORTAL */}
      <PortfolioPortal position={[0, 0, WORLD.PORTAL_Z]} />
    </>
  );
}
