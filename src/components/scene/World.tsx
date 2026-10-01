import { Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { neonStore } from '../../context/NeonContext';
import { Lighting } from './Lighting';
import { Environment } from './Environment';
import { CameraRig } from './CameraRig';
import { Effects } from './Effects';
import { FloatingParticles } from './FloatingParticles';
import { NeonSectionGlow } from './NeonSectionGlow';
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
 * SceneAtmosphere — Manages background and fog colors efficiently
 */
function SceneAtmosphere() {
  const { scene } = useThree();
  
  const baseColor = useMemo(() => new THREE.Color('#020507'), []);
  const neonColor = useMemo(() => new THREE.Color('#010815'), []);

  useFrame(() => {
    const t = neonStore.current;
    
    // Background color
    if (scene.background instanceof THREE.Color) {
      scene.background.lerpColors(baseColor, neonColor, t);
    } else {
      scene.background = baseColor.clone();
    }
    
    // Fog color
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.lerpColors(baseColor, neonColor, t);
    } else {
      scene.fog = new THREE.Fog(baseColor, 10, 22);
    }
  });

  return null;
}

import { GlobalNeonTheme } from './GlobalNeonTheme';

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
      <SceneAtmosphere />
      <GlobalNeonTheme />

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
      <NeonSectionGlow position={[0, 1, WORLD.INTRO_Z]} width={14} height={8} groundY={-1.2} intensity={0.7} />

      {/* 0.14 – 0.26: OFFICE — Camera at Z=5, content at Z=0 */}
      <group position={[0, 0, WORLD.OFFICE_Z]}>
        <Office />
      </group>
      <NeonSectionGlow position={[0, 1, WORLD.OFFICE_Z]} width={10} height={6} groundY={-0.5} intensity={0.5} />

      {/* 0.26 – 0.48: AHMED CHARACTER + TRANSFORMATION */}
      {/* Dais center: Z=-10, Camera front-face: Z=-5 */}
      <CharacterScene position={[0, -0.5, WORLD.CHARACTER_Z]} />

      {/* 0.48 – 0.58: ABOUT ME */}
      <AboutScene position={[0, 0, WORLD.ABOUT_Z]} />
      <NeonSectionGlow position={[0, 0, WORLD.ABOUT_Z]} width={14} height={8} groundY={-3.5} intensity={0.8} />

      {/* 0.58 – 0.66: SKILLS LAB */}
      <SkillsScene position={[0, 0, WORLD.SKILLS_Z]} />
      <NeonSectionGlow position={[0, 0.5, WORLD.SKILLS_Z]} width={12} height={10} groundY={-3} intensity={0.9} />

      {/* 0.66 – 0.76: PROJECTS */}
      <ProjectsScene position={[0, 0, WORLD.PROJECTS_Z]} />
      <NeonSectionGlow position={[0, 0.5, WORLD.PROJECTS_Z]} width={18} height={8} groundY={-2} intensity={0.85} />

      {/* 0.76 – 0.84: EXPERIENCE */}
      <ExperienceScene position={[0, 0, WORLD.EXPERIENCE_Z]} />
      <NeonSectionGlow position={[0, 1, WORLD.EXPERIENCE_Z]} width={14} height={10} groundY={-3} intensity={0.8} />

      {/* 0.84 – 0.90: ACHIEVEMENTS */}
      <AchievementsScene position={[0, 0, WORLD.ACHIEVEMENTS_Z]} />
      <NeonSectionGlow position={[0, 1, WORLD.ACHIEVEMENTS_Z]} width={14} height={10} groundY={-2.5} intensity={0.9} />

      {/* 0.90 – 0.96: CONTACT */}
      <ContactScene position={[0, 0, WORLD.CONTACT_Z]} />
      <NeonSectionGlow position={[0, 1.5, WORLD.CONTACT_Z]} width={16} height={10} groundY={-2} intensity={1.0} />

      {/* 0.96 – 1.00: FINAL PORTAL */}
      <PortfolioPortal position={[0, 0, WORLD.PORTAL_Z]} />
      <NeonSectionGlow position={[0, 0, WORLD.PORTAL_Z]} width={12} height={8} groundY={-1.5} intensity={1.0} />
    </>
  );
}

