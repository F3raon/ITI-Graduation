import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollStore } from '../../context/ScrollContext';

type Vec3 = [number, number, number];

export function CameraRig() {
  const { camera } = useThree();

  // Cinematic Camera Spline Path through the continuous 3D world
  const points = useMemo<Vec3[]>(
    () => [
      [0.0, 0.90, 14.5],    // 0.00: Tunnel entry & Cinema Intro
      [0.6, 1.00, 6.2],     // 0.08: Approaching office
      [0.2, 0.45, 2.2],     // 0.15: Office workstation (monitors & desk)
      [0.0, 0.65, -1.8],    // 0.20: Corridor arch to Character Arena
      [0.0, 0.75, -4.6],    // 0.25: In front of Ahmed (Real Portrait / Identity Matrix)
      [0.0, 0.80, -4.6],    // 0.30: Transformation underway -> Full Neon Ahmed
      [2.4, 0.85, -5.8],    // 0.34: Orbit: Front-Right
      [3.4, 0.90, -8.0],    // 0.37: Orbit: Right Profile
      [2.2, 0.95, -10.4],   // 0.40: Orbit: Back-Right
      [0.0, 1.00, -11.4],   // 0.43: Orbit: Back view ("AH" illuminated crest & curly hair)
      [-2.2, 0.95, -10.4],  // 0.45: Orbit: Back-Left
      [-3.4, 0.90, -8.0],   // 0.47: Orbit: Left Profile
      [-2.0, 0.85, -5.8],   // 0.49: Orbit: Front-Left exit
      [-0.8, 0.70, -13.5],  // 0.54: Journey toward About Me Scene
      [0.0, 0.90, -28.5],   // 0.63: Skills Reactor & .NET Core
      [0.0, 1.10, -44.0],   // 0.73: Project Lab & 3D Dioramas
      [-1.2, 0.70, -60.0],  // 0.82: Experience Timeline
      [0.0, 0.90, -76.0],   // 0.89: Achievements Chamber
      [0.0, 0.80, -91.5],   // 0.94: Contact Room
      [0.0, 0.10, -107.0],  // 1.00: Final Live Portal
    ],
    []
  );

  // LookAt Targets matching each world area
  const targets = useMemo<Vec3[]>(
    () => [
      [0.0, 0.5, 6.0],      // Tunnel focal point
      [0.2, 0.2, 0.0],      // Office reveal
      [0.0, 0.1, -0.6],     // Desk & code monitors
      [0.0, 0.75, -8.0],    // Looking through archway to Character Dais
      [0.0, 0.75, -8.0],    // Real Ahmed face & identity
      [0.0, 0.75, -8.0],    // Neon Ahmed & energy
      [0.0, 0.75, -8.0],    // Orbit 1: Facing Ahmed center
      [0.0, 0.75, -8.0],    // Orbit 2: Facing Ahmed center
      [0.0, 0.75, -8.0],    // Orbit 3: Facing Ahmed center
      [0.0, 0.75, -8.0],    // Orbit 4: Facing Ahmed back
      [0.0, 0.75, -8.0],    // Orbit 5: Facing Ahmed center
      [0.0, 0.75, -8.0],    // Orbit 6: Facing Ahmed center
      [0.0, 0.75, -8.0],    // Orbit 7: Facing Ahmed center
      [0.8, 0.0, -18.0],    // About portrait & bio
      [0.0, 0.0, -34.0],    // .NET Core Reactor
      [0.0, 0.0, -50.0],    // Project dioramas
      [0.5, 0.0, -66.0],    // Experience milestones
      [0.0, 0.2, -82.0],    // Trophies
      [0.0, 0.5, -98.0],    // "LET'S BUILD SOMETHING"
      [0.0, -0.1, -114.0],  // Embedded interactive screen
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

  // Remap uniform user scroll (0..1) to calibrated curve arc distance
  const getCurveT = (s: number) => {
    const kf: [number, number][] = [
      [0.00, 0.000], // Intro
      [0.15, 0.090], // Office workstation
      [0.24, 0.125], // Directly approaching Ahmed dais
      [0.30, 0.130], // In front of Ahmed (Transformation complete)
      [0.34, 0.150], // Orbit: Front-Right
      [0.37, 0.170], // Orbit: Right Profile
      [0.40, 0.200], // Orbit: Back view ("AH" emblem & curly hair)
      [0.43, 0.230], // Orbit: Left Profile
      [0.46, 0.270], // Orbit: Front-Left completion
      [0.54, 0.360], // About Scene
      [0.63, 0.480], // Skills Reactor
      [0.73, 0.600], // Projects Lab
      [0.82, 0.720], // Timeline
      [0.89, 0.810], // Achievements
      [0.94, 0.910], // Contact
      [1.00, 1.000], // Portal
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
    // Ultra-smooth physical easing to user target scroll position
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
    // On narrower viewports (tablets, mobile, or split screens), pull camera back subtly
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

    // Cinematic banking (roll on turns and pointer horizontal motion)
    const bank = -state.pointer.x * 0.02 + Math.sin(state.clock.elapsedTime * 0.3) * 0.002;
    camera.rotation.z = THREE.MathUtils.lerp(camera.rotation.z, bank, 1 - Math.exp(-3 * delta));

    // Dynamic FOV adjustment: wider on mobile/narrow screens to ensure all 3D content stays visible
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
