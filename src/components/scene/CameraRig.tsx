import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../../context/ScrollContext';
import { WORLD } from '../../data/world';

/**
 * CameraRig — Single camera authority.
 *
 * Scroll progress 0→1 is mapped through keyframes to a CatmullRom spline.
 * Each keyframe: [scrollProgress, splineT]
 *
 * Camera positions and look-at targets are matched to the WORLD constants
 * so that every section is always correctly framed.
 */

type Vec3 = [number, number, number];

export function CameraRig() {
  const { camera } = useThree();

  // ── Camera path ──────────────────────────────────────────────────────────
  // Each point is [x, y, z] — the camera position when looking at the corresponding section
  const cameraPoints = useMemo<Vec3[]>(
    () => [
      // idx 0  — Intro entry: camera at Z=13, looking at Z=8
      [0.0, 1.2,  WORLD.CAM_INTRO],
      // idx 1  — Office corridor approach
      [0.4, 0.9,  WORLD.CAM_OFFICE + 2],
      // idx 2  — Office desk framing
      [0.0, 0.8,  WORLD.CAM_OFFICE],
      // idx 3  — Archway / transition to Ahmed
      [0.0, 0.7,  WORLD.CAM_APPROACH],
      // idx 4  — Real Ahmed front face
      [0.0, 0.95, WORLD.CAM_CHARACTER],
      // idx 5  — Neon transformation framing
      [0.0, 1.05, WORLD.CAM_NEON],
      // idx 6  — Gentle right arc
      [1.5, 1.0,  WORLD.CAM_ARC_R],
      // idx 7  — Exit arc
      [-0.8, 0.85, WORLD.CAM_EXIT],
      // idx 8  — Glide toward About
      [0.0, 0.8,  WORLD.CAM_ABOUT + 2],
      // idx 9  — About Me settled
      [0.0, 0.75, WORLD.CAM_ABOUT],
      // idx 10 — Skills Lab
      [0.0, 0.85, WORLD.CAM_SKILLS],
      // idx 11 — Arc around Skills Core
      [3.5, 1.2, WORLD.CAM_SKILLS - 6],
      // idx 12 — Projects entry
      [0.0, 0.95, WORLD.CAM_PROJECTS],
      // idx 13 — Projects settled (slight left)
      [-0.5, 0.8, WORLD.CAM_PROJECTS2],
      // idx 14 — Experience timeline
      [0.3, 0.7,  WORLD.CAM_EXPERIENCE],
      // idx 15 — Achievements chamber
      [0.0, 0.85, WORLD.CAM_ACHIEVEMENTS],
      // idx 16 — Contact terminals
      [0.0, 0.8,  WORLD.CAM_CONTACT],
      // idx 17 — Final Portal
      [0.0, 0.2,  WORLD.CAM_PORTAL],
    ],
    []
  );

  // ── Look-at targets ──────────────────────────────────────────────────────
  // Where the camera points at each waypoint — always the section center
  const lookAtPoints = useMemo<Vec3[]>(
    () => [
      [0.0,  0.5,  WORLD.INTRO_Z],        // Intro
      [0.2,  0.2,  WORLD.OFFICE_Z + 1],   // Office approach
      [0.0,  0.1,  WORLD.OFFICE_Z - 1],   // Desk & monitors
      [0.0,  0.9,  WORLD.CHARACTER_Z],     // Archway through
      [0.0,  1.0,  WORLD.CHARACTER_Z],     // Real Ahmed face
      [0.0,  1.0,  WORLD.CHARACTER_Z],     // Neon state
      [0.0,  1.0,  WORLD.CHARACTER_Z],     // Arc right
      [0.0,  1.0,  WORLD.CHARACTER_Z],     // Arc exit
      [0.0,  0.2,  WORLD.ABOUT_Z],         // About glide
      [0.0,  0.0,  WORLD.ABOUT_Z],         // About settled
      [0.0,  0.5,  WORLD.SKILLS_Z],        // Skills
      [0.0,  0.5,  WORLD.SKILLS_Z],        // Arc around Skills Core (keep looking at it)
      [0.0,  0.5,  WORLD.PROJECTS_Z],      // Projects entry
      [0.4,  0.2,  WORLD.PROJECTS_Z],      // Projects settled
      [0.4,  0.0,  WORLD.EXPERIENCE_Z],    // Experience
      [0.0,  0.2,  WORLD.ACHIEVEMENTS_Z],  // Achievements
      [0.0,  0.5,  WORLD.CONTACT_Z],       // Contact
      [0.0, -0.1,  WORLD.PORTAL_Z],        // Portal
    ],
    []
  );

  // ── Scroll → spline keyframe map ─────────────────────────────────────────
  // [scrollProgress, splineT] pairs. splineT is normalized to 0..1 over N-1 points.
  const scrollKeyframes: [number, number][] = useMemo(
    () => [
      [0.00, 0 / 17],   // Intro entry
      [0.08, 1 / 17],   // Office approach
      [0.16, 2 / 17],   // Office desk
      [0.24, 3 / 17],   // Archway to Ahmed
      [0.29, 4 / 17],   // Real Ahmed front
      [0.38, 5 / 17],   // Neon transformation
      [0.44, 6 / 17],   // Arc right
      [0.48, 7 / 17],   // Arc exit
      [0.52, 8 / 17],   // Glide toward About
      [0.58, 9 / 17],   // About Me
      [0.65, 10 / 17],  // Skills
      [0.68, 11 / 17],  // Arc around Skills Core
      [0.72, 12 / 17],  // Projects entry
      [0.76, 13 / 17],  // Projects settled
      [0.82, 14 / 17],  // Experience
      [0.87, 15 / 17],  // Achievements
      [0.93, 16 / 17],  // Contact
      [1.00, 17 / 17],  // Portal
    ],
    []
  );

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(cameraPoints.map((p) => new THREE.Vector3(...p)), false, 'centripetal', 0.5),
    [cameraPoints]
  );

  const targetCurve = useMemo(
    () => new THREE.CatmullRomCurve3(lookAtPoints.map((p) => new THREE.Vector3(...p)), false, 'centripetal', 0.5),
    [lookAtPoints]
  );

  const desiredPos = useRef(new THREE.Vector3());
  const lookAtPos  = useRef(new THREE.Vector3());
  const lastNotify = useRef(0);

  function getCurveT(scroll: number): number {
    const kf = scrollKeyframes;
    for (let i = 0; i < kf.length - 1; i++) {
      if (scroll >= kf[i][0] && scroll <= kf[i + 1][0]) {
        const alpha = (scroll - kf[i][0]) / (kf[i + 1][0] - kf[i][0]);
        return kf[i][1] + alpha * (kf[i + 1][1] - kf[i][1]);
      }
    }
    return Math.max(0, Math.min(1, scroll));
  }

  useFrame((state, delta) => {
    // Smooth scroll interpolation
    scrollStore.current = THREE.MathUtils.lerp(
      scrollStore.current,
      scrollStore.target,
      1 - Math.exp(-6 * delta)
    );

    // Notify UI subscribers
    if (state.clock.elapsedTime - lastNotify.current > 0.03) {
      scrollStore.notify();
      lastNotify.current = state.clock.elapsedTime;
    }

    const s = Math.max(0, Math.min(1, scrollStore.current));
    const t = getCurveT(s);

    curve.getPointAt(t, desiredPos.current);
    targetCurve.getPointAt(t, lookAtPos.current);

    // Responsive pullback for narrow viewports
    const aspect = state.size.width / Math.max(1, state.size.height);
    if (aspect < 1.5) {
      const pullback = (1.5 - aspect) * 1.0;
      const dir = desiredPos.current.clone().sub(lookAtPos.current).normalize();
      desiredPos.current.add(dir.multiplyScalar(pullback));
    }

    // Subtle mouse parallax
    desiredPos.current.x += state.pointer.x * 0.22;
    desiredPos.current.y += -state.pointer.y * 0.12;

    // Smooth camera move
    camera.position.lerp(desiredPos.current, 1 - Math.exp(-6 * delta));
    camera.lookAt(lookAtPos.current);

    // Subtle cinematic bank
    const bank = -state.pointer.x * 0.015 + Math.sin(state.clock.elapsedTime * 0.25) * 0.0015;
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, bank, 1 - Math.exp(-3 * delta));

    // Dynamic FOV: slightly wider on mobile
    const baseFov = aspect < 0.8 ? 68 : aspect < 1.2 ? 60 : 54;
    const targetFov = baseFov - t * 3;
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      targetFov,
      1 - Math.exp(-2 * delta)
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  return null;
}
