import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface AhmedCharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  rotationX?: number;
  scale?: number;
  progress?: number; // 0.0 Real Ahmed -> 1.0 Full Neon Ahmed
  isInteractive?: boolean;
}

// ============================================================
// Easing helpers
// ============================================================
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function invLerp(a: number, b: number, v: number) {
  return clamp((v - a) / (b - a), 0, 1);
}

// ============================================================
// Particle geometry for the transformation burst
// ============================================================
function TransformParticles({ progress, count = 80 }: { progress: number; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        t: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        radius: 0.4 + Math.random() * 1.2,
        yBase: -0.8 + Math.random() * 3.0,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
        size: 0.015 + Math.random() * 0.03,
      })),
    [count]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    // burst window: progress 0.3 → 0.8
    const burstT = clamp(invLerp(0.25, 0.85, progress), 0, 1);
    const opacity = burstT < 0.5 ? easeInOut(burstT * 2) : easeInOut((1 - burstT) * 2);

    seeds.forEach((s, i) => {
      const angle = s.ry + state.clock.elapsedTime * s.speed * 0.4;
      const r = s.radius * (1 + burstT * 0.8);
      dummy.position.set(Math.cos(angle) * r, s.yBase + Math.sin(state.clock.elapsedTime * s.speed + s.phase) * 0.25, Math.sin(angle) * r);
      dummy.scale.setScalar(s.size * (0.5 + burstT * 1.5) * opacity);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (progress < 0.1) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color={progress > 0.5 ? '#00f0ff' : '#ff8a30'}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ============================================================
// Electric streak lines that trace the silhouette
// ============================================================
function ElectricStreaks({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * (0.6 + progress * 1.4);
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2.2) * 0.15;
    }
  });

  const streakProgress = clamp(invLerp(0.2, 0.8, progress), 0, 1);
  if (streakProgress < 0.05) return null;

  return (
    <group ref={groupRef} position={[0, 1.4, 0]}>
      {/* Cyan orbital rings */}
      <mesh rotation={[Math.PI / 3.2, 0, 0]}>
        <torusGeometry args={[1.1, 0.008, 12, 64]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={streakProgress * 0.85}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
        <torusGeometry args={[1.3, 0.006, 12, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={streakProgress * 0.7}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      {/* Yellow accent ring (neon power) */}
      <mesh rotation={[Math.PI / 5, Math.PI / 3, 0]}>
        <torusGeometry args={[0.9, 0.005, 12, 48]} />
        <meshBasicMaterial
          color="#facc15"
          transparent
          opacity={clamp(invLerp(0.5, 0.9, progress), 0, 1) * 0.7}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// Main Component
// ============================================================
export function AhmedCharacter({
  position = [0, 0, 0],
  rotationY = 0,
  rotationX = 0,
  scale = 1,
  progress = 0.0,
}: AhmedCharacterProps) {
  const rootRef = useRef<THREE.Group>(null);
  const realPlaneRef = useRef<THREE.Mesh>(null);
  const neonPlaneRef = useRef<THREE.Mesh>(null);
  const neonGlowRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  // Load the two authoritative portrait textures
  const realTexture = useTexture('/models/REAL_AHMED.png');
  const neonTexture = useTexture('/models/NEON_AHMED.png');

  // ---- Texture setup ----
  useMemo(() => {
    [realTexture, neonTexture].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.premultiplyAlpha = false;
    });
  }, [realTexture, neonTexture]);

  // ---- Derived scroll-stage values ----
  const isMobile = size.width / size.height < 1.0;
  const planeW = isMobile ? 1.6 : 2.2;
  const planeH = isMobile ? 3.0 : 4.0;
  const planeY = isMobile ? 1.2 : 1.6;

  // Stage breakpoints (0→1 global progress)
  const energyT   = easeInOut(clamp(invLerp(0.15, 0.35, progress), 0, 1)); // energy buildup
  const dissolveT = easeInOut(clamp(invLerp(0.35, 0.65, progress), 0, 1)); // crossfade
  const neonT     = easeInOut(clamp(invLerp(0.55, 0.80, progress), 0, 1)); // neon hero

  // Flash: bright spike around midpoint
  const flashT = Math.max(0, 1 - Math.abs(progress - 0.52) / 0.08);

  // Real image: opaque 0→0.35, dissolves 0.35→0.65
  const realOpacity = 1.0 - dissolveT;
  // Neon image: invisible until 0.5, fully visible at 0.75
  const neonOpacity = neonT;
  // Aura glow expands with energy
  const auraOpacity = energyT * (1 - dissolveT * 0.5) * 0.3;

  useFrame((state, delta) => {
    // Dais ring rotation
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * (0.2 + progress * 0.9);
    }

    // Idle breathing on the character planes
    const breath = Math.sin(state.clock.elapsedTime * 2.2) * 0.015;
    const parallaxX = Math.sin(state.clock.elapsedTime * 0.6) * 0.04 * (1 + neonT);
    if (realPlaneRef.current) {
      realPlaneRef.current.position.y = planeY + breath;
      realPlaneRef.current.position.x = parallaxX;
    }
    if (neonPlaneRef.current) {
      neonPlaneRef.current.position.y = planeY + breath;
      neonPlaneRef.current.position.x = parallaxX;
    }
    if (neonGlowRef.current) {
      neonGlowRef.current.position.y = planeY + breath;
      neonGlowRef.current.position.x = parallaxX;
    }
    if (auraRef.current) {
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 3.8) * 0.04 * energyT;
      auraRef.current.scale.set(s, s, s);
    }
    // Flash intensity
    if (flashRef.current) {
      const mat = flashRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = flashT * 0.85;
    }
  });

  return (
    <group ref={rootRef} position={position} rotation={[rotationX, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* ── PEDESTAL ─────────────────────────────────────────── */}
      <group>
        {/* Hex base */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[2.3, 2.5, 0.18, 6]} />
          <meshStandardMaterial color="#080e18" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Outer neon floor ring */}
        <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.28, 48]} />
          <meshBasicMaterial
            color={progress > 0.5 ? '#00f0ff' : '#ff8a30'}
            transparent
            opacity={0.85}
            toneMapped={false}
          />
        </mesh>
        {/* Inner purple emitter ring */}
        <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.56, 48]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.4 + energyT * 0.5}
            toneMapped={false}
          />
        </mesh>
        {/* 6 conduit nodes */}
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 2.05, 0.22, Math.sin(a) * 2.05]}>
              <mesh>
                <boxGeometry args={[0.16, 0.12, 0.16]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} />
              </mesh>
              <mesh position={[0, 0.08, 0]}>
                <sphereGeometry args={[0.045, 12, 12]} />
                <meshBasicMaterial color={energyT > 0.4 ? '#00f0ff' : '#a855f7'} toneMapped={false} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ── DAIS ROTATION RINGS ───────────────────────────────── */}
      <group ref={ringsRef} position={[0, planeY, 0]}>
        <mesh rotation={[Math.PI / 3.5, 0, 0]}>
          <torusGeometry args={[isMobile ? 1.0 : 1.35, 0.01, 16, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.2 + energyT * 0.7}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
          <torusGeometry args={[isMobile ? 1.15 : 1.5, 0.008, 16, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.15 + energyT * 0.55}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ── REAL AHMED PORTRAIT ───────────────────────────────── */}
      <mesh ref={realPlaneRef} position={[0, planeY, 0.01]} castShadow>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={realTexture}
          transparent
          opacity={realOpacity}
          alphaTest={0.01}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* ── ELECTRIC AURA over REAL (energy buildup) ─────────── */}
      <mesh ref={auraRef} position={[0, planeY, 0.015]}>
        <planeGeometry args={[planeW * 1.08, planeH * 1.04]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={auraOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* ── TRANSFORMATION FLASH ──────────────────────────────── */}
      <mesh ref={flashRef} position={[0, planeY, 0.05]}>
        <planeGeometry args={[planeW * 1.5, planeH * 1.3]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* ── NEON AHMED PORTRAIT ───────────────────────────────── */}
      <mesh ref={neonPlaneRef} position={[0, planeY, 0.02]} castShadow>
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          map={neonTexture}
          transparent
          opacity={neonOpacity}
          alphaTest={0.01}
          side={THREE.DoubleSide}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* ── NEON GLOW BLOOM OVERLAY ───────────────────────────── */}
      <mesh ref={neonGlowRef} position={[0, planeY, 0.01]}>
        <planeGeometry args={[planeW * 1.12, planeH * 1.06]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={neonOpacity * 0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* ── ELECTRIC ORBIT STREAKS ────────────────────────────── */}
      <ElectricStreaks progress={progress} />

      {/* ── BURST PARTICLES ───────────────────────────────────── */}
      <TransformParticles progress={progress} count={isMobile ? 50 : 90} />
    </group>
  );
}
