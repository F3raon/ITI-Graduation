import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface AhmedCharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  rotationX?: number;
  scale?: number;
  /** 0.0 = Real Ahmed, 1.0 = Full Neon Ahmed */
  progress?: number;
  isInteractive?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
function clamp(v: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}
function invLerp(a: number, b: number, v: number) {
  return clamp((v - a) / (b - a));
}

// ─── Burst particle ring — emitted during transformation ─────────────────────
function TransformBurst({ progress, count = 72 }: { progress: number; count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy   = useMemo(() => new THREE.Object3D(), []);
  const seeds   = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        angle:  Math.random() * Math.PI * 2,
        radius: 0.35 + Math.random() * 1.3,
        yBase:  -0.5 + Math.random() * 3.6,
        speed:  0.3 + Math.random() * 0.7,
        phase:  Math.random() * Math.PI * 2,
        size:   0.012 + Math.random() * 0.022,
        isAmber: Math.random() < 0.18,
      })),
    [count]
  );

  // Burst window: 0.15 → 0.70
  const burstT = easeInOut(clamp(invLerp(0.15, 0.65, progress)));
  // Fade out after neon arrives
  const fadeT  = burstT * (1 - clamp(invLerp(0.65, 0.85, progress)));

  useFrame((state) => {
    if (!meshRef.current || fadeT < 0.02) return;
    seeds.forEach((s, i) => {
      const angle = s.angle + state.clock.elapsedTime * s.speed * 0.3;
      const r     = s.radius * (1 + burstT * 0.6);
      dummy.position.set(
        Math.cos(angle) * r,
        s.yBase + Math.sin(state.clock.elapsedTime * s.speed + s.phase) * 0.2,
        Math.sin(angle) * r * 0.3
      );
      dummy.scale.setScalar(s.size * (0.4 + burstT * 1.6) * fadeT);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (fadeT < 0.02) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color={progress > 0.55 ? '#00f0ff' : '#f59e0b'}
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

// ─── Electric orbit arcs (energy build-up & neon state) ──────────────────────
function ElectricArcs({ progress }: { progress: number }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (r1.current) r1.current.rotation.z += delta * 0.55;
    if (r2.current) r2.current.rotation.z -= delta * 0.38;
  });

  const arcT = easeInOut(clamp(invLerp(0.08, 0.45, progress)));
  if (arcT < 0.04) return null;

  return (
    <group position={[0, 1.6, 0.02]}>
      <mesh ref={r1}>
        <torusGeometry args={[1.45, 0.007, 8, 128, Math.PI * 1.55]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={arcT * 0.8}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[1.72, 0.005, 6, 96, Math.PI * 1.1]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={arcT * 0.55}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ─── Neon glow halo ───────────────────────────────────────────────────────────
function NeonHalo({ progress }: { progress: number }) {
  const haloRef = useRef<THREE.Mesh>(null);
  const neonT   = easeInOut(clamp(invLerp(0.50, 0.78, progress)));

  useFrame((state) => {
    if (!haloRef.current) return;
    const s = 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.025 * neonT;
    haloRef.current.scale.set(s, s, s);
  });

  if (neonT < 0.02) return null;

  return (
    <mesh ref={haloRef} position={[0, 1.6, -0.08]}>
      {/* Large soft cyan disc behind portrait */}
      <planeGeometry args={[4.5, 5.2]} />
      <meshBasicMaterial
        color="#0a3d5c"
        transparent
        opacity={neonT * 0.18}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Cinematic platform ───────────────────────────────────────────────────────
function CharacterPlatform({ progress }: { progress: number }) {
  const energyT = easeInOut(clamp(invLerp(0.0, 0.4, progress)));

  return (
    <group>
      {/* Main hex dais */}
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.55, 0.15, 6]} />
        <meshStandardMaterial color="#07101c" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Outer cyan emissive ring */}
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.32, 2.40, 128]} />
        <meshBasicMaterial
          color={progress > 0.6 ? '#00f0ff' : '#ff8a30'}
          transparent
          opacity={0.82}
          toneMapped={false}
        />
      </mesh>

      {/* Subtle inner purple ring */}
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.60, 64]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.35 + energyT * 0.45}
          toneMapped={false}
        />
      </mesh>

      {/* 6 corner conduit lights */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <group key={i} position={[Math.cos(a) * 2.1, 0.22, Math.sin(a) * 2.1]}>
            <mesh>
              <boxGeometry args={[0.14, 0.10, 0.14]} />
              <meshStandardMaterial color="#131f30" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0.07, 0]}>
              <sphereGeometry args={[0.038, 10, 10]} />
              <meshBasicMaterial
                color={energyT > 0.4 ? '#00f0ff' : '#a855f7'}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}

      {/* Platform under-glow */}
      <pointLight
        position={[0, -0.1, 0]}
        intensity={2.5 + energyT * 4}
        distance={5}
        color={progress > 0.55 ? '#00f0ff' : '#ff8a30'}
      />
    </group>
  );
}

export function AhmedCharacter({
  position = [0, 0, 0],
  rotationY = 0,
  rotationX = 0,
  scale = 1,
  progress = 0.0,
}: AhmedCharacterProps) {
  const rootRef    = useRef<THREE.Group>(null);
  const realRef    = useRef<THREE.Mesh>(null);
  const auraRef    = useRef<THREE.Mesh>(null);
  const { size }   = useThree();

  const [hovered, setHovered] = useState(false);

  // ── Textures (authoritative assets) ────────────────────────────────────────
  const realTex = useTexture('/models/REAL_AHMED.png');
  const neonTex = useTexture('/models/NEON_AHMED.png');

  useMemo(() => {
    [realTex, neonTex].forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.needsUpdate = true;
    });
  }, [realTex, neonTex]);

  // ── Responsive sizing ──────────────────────────────────────────────────────
  const aspect   = size.width / Math.max(1, size.height);
  const isMobile = aspect < 1.0;

  // Portrait plane dimensions — keep face + shoulders always visible
  const pW = isMobile ? 1.55 : 2.15;
  const pH = isMobile ? 3.0  : 4.1;
  const pY = isMobile ? 1.2  : 1.65; // plane center Y above dais

  // ── Hover Reveal Shader ───────────────────────────────────────────────────
  const uMouse = useRef(new THREE.Vector2(-1, -1));
  const uHover = useRef(0);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib["fog"],
        {
          tReal: { value: realTex },
          tNeon: { value: neonTex },
          uMouse: { value: uMouse.current },
          uHover: { value: 0 },
          uProgress: { value: 0 },
          uAspect: { value: 1.0 },
          uRadius: { value: 0.35 },
          uSmoothness: { value: 0.15 }
        }
      ]),
      vertexShader: `
        varying vec2 vUv;
        #include <fog_pars_vertex>
        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }
      `,
      fragmentShader: `
        uniform sampler2D tReal;
        uniform sampler2D tNeon;
        uniform vec2 uMouse;
        uniform float uHover;
        uniform float uProgress;
        uniform float uRadius;
        uniform float uSmoothness;
        uniform float uAspect;

        varying vec2 vUv;
        
        #include <fog_pars_fragment>

        void main() {
          vec4 realColor = texture2D(tReal, vUv);
          vec4 neonColor = texture2D(tNeon, vUv);

          vec2 uv = vUv;
          vec2 mouse = uMouse;
          
          uv.y /= uAspect;
          mouse.y /= uAspect;

          // Mouse hover circular mask
          float dist = distance(uv, mouse);
          float hoverMask = (1.0 - smoothstep(uRadius - uSmoothness, uRadius, dist)) * uHover;

          // Scroll-based full reveal (happens between progress 0.35 and 0.65)
          float scrollMask = smoothstep(0.35, 0.65, uProgress);

          // Combine both masks
          float finalMask = clamp(hoverMask + scrollMask, 0.0, 1.0);

          vec4 finalColor = mix(realColor, neonColor, finalMask);
          
          if (finalColor.a < 0.05) discard;
          gl_FragColor = finalColor;
          
          #include <fog_fragment>
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      toneMapped: false,
      fog: true,
    });
  }, [realTex, neonTex]);

  useMemo(() => {
    shaderMaterial.uniforms.uAspect.value = pW / pH;
  }, [pW, pH, shaderMaterial]);

  // Smoothly interpolate the hover uniform and update mouse
  useFrame((_, delta) => {
    const targetHover = hovered ? 1.0 : 0.0;
    uHover.current = THREE.MathUtils.lerp(uHover.current, targetHover, delta * 8.0);
    shaderMaterial.uniforms.uHover.value = uHover.current;
    
    // Update scroll progress
    shaderMaterial.uniforms.uProgress.value = progress;
    
    // Explicitly update the cloned uniform vector from the ref
    if (shaderMaterial.uniforms.uMouse.value) {
      shaderMaterial.uniforms.uMouse.value.copy(uMouse.current);
    }
  });

  // ── Scroll stage derivations ───────────────────────────────────────────────
  // ── Scroll stage derivations (For platform and environment) ────────────────
  const dissolveT = easeInOut(clamp(invLerp(0.20, 0.55, progress)));
  const energyT   = easeInOut(clamp(invLerp(0.05, 0.35, progress)));
  const neonOp    = easeInOut(clamp(invLerp(0.35, 0.65, progress)));
  const auraOp    = energyT * (1 - dissolveT * 0.6) * 0.28;

  // ── Frame animation ────────────────────────────────────────────────────────
  useFrame((state) => {
    const t   = state.clock.elapsedTime;
    const bY  = Math.sin(t * 2.2) * 0.012; // idle breath
    const pX  = Math.sin(t * 0.55) * 0.035 * (1 + neonOp); // subtle parallax

    if (realRef.current)  { realRef.current.position.y  = pY + bY; realRef.current.position.x  = pX; }
    if (auraRef.current)  {
      auraRef.current.position.y = pY + bY;
      const s = 1 + Math.sin(t * 3.8) * 0.035 * energyT;
      auraRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group
      ref={rootRef}
      position={position}
      rotation={[rotationX, rotationY, 0]}
      scale={[scale, scale, scale]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
    >
      {/* ── Platform ──────────────────────────────────────────────────────── */}
      <CharacterPlatform progress={progress} />

      {/* ── Neon halo backdrop ────────────────────────────────────────────── */}
      <NeonHalo progress={progress} />

      {/* ── Electric orbit arcs ───────────────────────────────────────────── */}
      <ElectricArcs progress={progress} />

      {/* ── Blue energy aura behind Real portrait ─────────────────────────── */}
      <mesh ref={auraRef} position={[0, pY, -0.05]}>
        <planeGeometry args={[pW * 1.1, pH * 1.05]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={auraOp}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* ── INTERACTIVE REVEAL PORTRAIT ───────────────────────────────────── */}
      <mesh 
        ref={realRef} 
        position={[0, pY, 0.01]} 
        castShadow
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.uv) {
            uMouse.current.copy(e.uv);
          }
        }}
      >
        <planeGeometry args={[pW, pH]} />
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      {/* ── Transformation burst particles ────────────────────────────────── */}
      <TransformBurst progress={progress} count={isMobile ? 48 : 80} />
    </group>
  );
}
