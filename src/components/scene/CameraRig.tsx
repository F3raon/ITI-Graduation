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
      [0.0, 1.20, 14.5],    // 0.00: Tunnel entry — Intro (Object Z=10)
      [0.6, 1.00,  6.2],    // 0.08: Approaching office corridor
      [0.2, 0.55,  2.0],    // 0.16: Office workstation & desk (Object Z=0)
      [0.0, 0.75, -1.8],    // 0.22: Through the archway toward character
      [0.0, 0.90, -5.0],    // 0.27: Facing Real Ahmed portrait (Object Z=-9.5)
      [0.0, 1.00, -5.2],    // 0.32: Neon transformation complete
      [2.8, 1.00, -7.2],    // 0.36: Orbit Front-Right
      [4.0, 1.00, -9.5],    // 0.39: Orbit Right Profile
      [2.8, 1.00, -11.8],   // 0.42: Orbit Back-Right
      [0.0, 1.00, -12.8],   // 0.45: Orbit Back — "AH" crest & curly hair
      [-2.8, 1.00, -11.8],  // 0.47: Orbit Back-Left
      [-4.0, 1.00, -9.5],   // 0.49: Orbit Left Profile
      [-2.4, 0.90, -7.2],   // 0.51: Orbit Front-Left exit
      [-0.6, 0.80, -15.0],  // 0.56: Exiting toward About Me
      [0.0, 0.80, -16.0],   // 0.62: About scene (Object Z=-22) -> Cam Z=-16
      [0.0, 0.90, -24.0],   // 0.68: Skills Lab (Object Z=-30) -> Cam Z=-24
      [0.0, 1.00, -32.0],   // 0.74: Project Lab entry (Object Z=-39) -> Cam Z=-32
      [-0.6, 0.85, -36.0],  // 0.77: Project Lab settled -> Cam Z=-36
      [0.4, 0.70, -42.0],   // 0.81: Experience (Object Z=-48) -> Cam Z=-42
      [0.0, 0.90, -51.0],   // 0.86: Achievements (Object Z=-57) -> Cam Z=-51
      [0.0, 0.80, -60.0],   // 0.91: Contact Room (Object Z=-66) -> Cam Z=-60
      [0.0, 0.15, -72.0],   // 1.00: Final Portal (Object Z=-78) -> Cam Z=-72
    ],
    []
  );

  // LookAt targets — each points toward the section center
  const targets = useMemo<Vec3[]>(
    () => [
      [0.0, 0.5,  6.0],     // Tunnel focal point
      [0.2, 0.2,  0.0],     // Office reveal
      [0.0, 0.1, -0.6],     // Desk & code monitors
      [0.0, 0.9, -9.5],     // Looking through arch to character dais
      [0.0, 1.0, -9.5],     // Real Ahmed face
      [0.0, 1.0, -9.5],     // Neon Ahmed & energy
      [0.0, 1.0, -9.5],     // Orbit 1
      [0.0, 1.0, -9.5],     // Orbit 2
      [0.0, 1.0, -9.5],     // Orbit 3
      [0.0, 1.0, -9.5],     // Orbit 4 (back)
      [0.0, 1.0, -9.5],     // Orbit 5
      [0.0, 1.0, -9.5],     // Orbit 6
      [0.0, 1.0, -9.5],     // Orbit 7 exit
      [0.4, 0.0, -20.0],    // About portrait & bio (approach)
      [0.0, 0.0, -22.0],    // About center
      [0.0, 0.0, -30.0],    // Skills reactor core
      [0.0, 0.0, -39.0],    // Project dioramas entry
      [-0.4, 0.0, -43.0],   // Project settled view
      [0.5, 0.0, -48.0],    // Experience milestones
      [0.0, 0.2, -57.0],    // Achievements trophies
      [0.0, 0.5, -66.0],    // "LET'S BUILD SOMETHING"
      [0.0, -0.1, -78.0],   // Embedded live portal
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
      [0.00, 0.000],  // Intro → spline[0] at Z=14.5
      [0.16, 0.095],  // Office → spline[2] at Z=2.0
      [0.24, 0.143],  // Approaching Ahmed → spline[3] at Z=-1.8
      [0.28, 0.190],  // Real Ahmed face → spline[4] at Z=-5.0
      [0.32, 0.238],  // Neon transformation → spline[5] at Z=-5.2
      [0.36, 0.286],  // Orbit: Front-Right → spline[6] at Z=-7.2
      [0.39, 0.333],  // Orbit: Right Profile → spline[7]
      [0.42, 0.381],  // Orbit: Back-Right → spline[8]
      [0.45, 0.429],  // Orbit: Back → spline[9] at Z=-12.8
      [0.47, 0.476],  // Orbit: Back-Left → spline[10]
      [0.49, 0.524],  // Orbit: Left Profile → spline[11]
      [0.51, 0.571],  // Orbit: Front-Left exit → spline[12]
      [0.56, 0.619],  // Journey to About → spline[13] at Z=-15
      [0.62, 0.667],  // About Me → spline[14] at Z=-22
      [0.68, 0.714],  // Skills Lab → spline[15] at Z=-30
      [0.74, 0.762],  // Projects Lab entry → spline[16] at Z=-39
      [0.77, 0.810],  // Projects settled → spline[17] at Z=-43
      [0.81, 0.857],  // Experience Timeline → spline[18] at Z=-48
      [0.86, 0.905],  // Achievements → spline[19] at Z=-57
      [0.91, 0.952],  // Contact Room → spline[20] at Z=-66
      [1.00, 1.000],  // Final Portal → spline[21] at Z=-78
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
