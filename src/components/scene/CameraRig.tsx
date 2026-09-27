import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../../context/ScrollContext';

type Vec3 = [number, number, number];

export function CameraRig() {
  const { camera } = useThree();

  // Cinematic Camera Spline Path — tightly matched to World section positions
  const points = useMemo<Vec3[]>(
    () => [
      [0.0, 1.20, 14.5],    // 0.00: Intro wide establishing shot
      [0.6, 1.00,  6.2],    // 0.08: Approaching office corridor
      [0.0, 0.85,  4.5],    // 0.16: Office workstation & desk
      [0.0, 0.75, -1.8],    // 0.22: Through archway toward character
      [0.0, 0.95, -5.0],    // 0.27: Real Ahmed — front-on
      [0.0, 1.05, -5.4],    // 0.32: Neon transformation complete
      [1.8, 1.00, -6.8],    // 0.37: Gentle right-arc view
      [-1.2, 0.90, -7.0],   // 0.44: Return arc / exit
      [-0.6, 0.80, -15.0],  // 0.56: Exiting toward About Me
      [0.0, 0.80, -16.0],   // 0.62: About scene
      [0.0, 0.90, -24.0],   // 0.68: Skills Lab
      [0.0, 1.00, -32.0],   // 0.74: Project Lab entry
      [-0.6, 0.85, -36.0],  // 0.77: Project Lab settled
      [0.4, 0.70, -42.0],   // 0.81: Experience
      [0.0, 0.90, -51.0],   // 0.86: Achievements
      [0.0, 0.80, -60.0],   // 0.91: Contact Room
      [0.0, 0.15, -72.0],   // 1.00: Final Portal
    ],
    []
  );

  // LookAt targets — each points toward the section center
  const targets = useMemo<Vec3[]>(
    () => [
      [0.0, 0.5, 6.0],     // Tunnel focal point
      [0.2, 0.2, 0.0],     // Office reveal
      [0.0, 0.1, -0.6],     // Desk & code monitors
      [0.0, 0.9, -9.5],     // Looking through arch to character dais
      [0.0, 1.0, -9.5],     // Real Ahmed face
      [0.0, 1.0, -9.5],     // Neon transformation complete
      [0.0, 1.0, -9.5],     // Gentle arc right
      [0.0, 1.0, -9.5],     // Arc exit
      [0.4, 0.0, -20.0],    // About portrait approach
      [0.0, 0.0, -22.0],    // About center
      [0.0, 0.0, -30.0],    // Skills reactor core
      [0.0, 0.0, -39.0],    // Project dioramas entry
      [-0.4, 0.0, -43.0],   // Project settled view
      [0.5, 0.0, -48.0],    // Experience milestones
      [0.0, 0.2, -57.0],    // Achievements trophies
      [0.0, 0.5, -66.0],    // Contact
      [0.0, -0.1, -78.0],   // Final Portal
    ],
    []
  );

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'centripetal', 0.5),
    [points]
  );

  const targetCurve = useMemo(
    () => new THREE.CatmullRomCurve3(targets.map((p) => new THREE.Vector3(...p)), false, 'centripetal', 0.5),
    [targets]
  );

  const desiredPos = useRef(new THREE.Vector3());
  const lookAtPos = useRef(new THREE.Vector3());
  const lastNotifyTime = useRef(0);

  // Remap user scroll (0..1) → calibrated curve arc distance
  // With 22 spline points (indices 0-21), each point i is at t = i/21
  // Keyframe: [scrollProgress, curveT]
  const getCurveT = (s: number) => {
    const kf: [number, number][] = [
      [0.00, 0.000],  // Intro
      [0.16, 0.062],  // Office
      [0.24, 0.125],  // Approaching Ahmed
      [0.28, 0.187],  // Real Ahmed face
      [0.42, 0.250],  // Neon transformation — camera stays here longer
      [0.55, 0.312],  // Arc right
      [0.60, 0.375],  // Arc exit
      [0.64, 0.437],  // Journey to About
      [0.68, 0.500],  // About Me
      [0.74, 0.562],  // Skills Lab
      [0.79, 0.625],  // Projects Lab entry
      [0.82, 0.687],  // Projects settled
      [0.86, 0.750],  // Experience Timeline
      [0.90, 0.812],  // Achievements
      [0.94, 0.875],  // Contact Room
      [1.00, 1.000],  // Final Portal
    ];
    for (let i = 0; i < kf.length - 1; i++) {
      if (s >= kf[i][0] && s <= kf[i + 1][0]) {
        const alpha = (s - kf[i][0]) / (kf[i + 1][0] - kf[i][0]);
        return kf[i][1] + alpha * (kf[i + 1][1] - kf[i][1]);
      }
    }
    return Math.max(0, Math.min(1, s));
  };

  useFrame((state, delta) => {
    // Ultra-smooth physical easing
    scrollStore.current = THREE.MathUtils.lerp(
      scrollStore.current,
      scrollStore.target,
      1 - Math.exp(-6 * delta)
    );

    // Periodically notify UI subscribers
    if (state.clock.elapsedTime - lastNotifyTime.current > 0.03) {
      scrollStore.notify();
      lastNotifyTime.current = state.clock.elapsedTime;
    }

    const s = Math.max(0, Math.min(1, scrollStore.current));
    const t = getCurveT(s);
    curve.getPointAt(t, desiredPos.current);
    targetCurve.getPointAt(t, lookAtPos.current);

    // Responsive aspect ratio compensation
    const aspect = state.size.width / Math.max(1, state.size.height);
    if (aspect < 1.6) {
      const pullback = (1.6 - aspect) * 1.8;
      const dir = desiredPos.current.clone().sub(lookAtPos.current).normalize();
      desiredPos.current.add(dir.multiplyScalar(pullback));
    }

    // Subtle natural mouse parallax
    desiredPos.current.x += state.pointer.x * 0.28;
    desiredPos.current.y += -state.pointer.y * 0.16;

    camera.position.lerp(desiredPos.current, 1 - Math.exp(-6 * delta));
    camera.lookAt(lookAtPos.current);

    // Cinematic banking on turns
    const bank = -state.pointer.x * 0.02 + Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, bank, 1 - Math.exp(-3 * delta));

    // Dynamic FOV: wider on mobile/narrow screens
    const baseFov = aspect < 0.8 ? 72 : aspect < 1.2 ? 64 : 54;
    const targetFov = baseFov - t * 4;
    (camera as THREE.PerspectiveCamera).fov = THREE.MathUtils.lerp(
      (camera as THREE.PerspectiveCamera).fov,
      targetFov,
      1 - Math.exp(-2 * delta)
    );
    (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
  });

  return null;
}
