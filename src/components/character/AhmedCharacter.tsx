import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { neonStore } from '../../context/NeonContext';
import { LightningStrike } from './LightningStrike';
import { NeonHUD } from './NeonHUD';

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
function TransformBurst({ count = 72 }: { count?: number }) {
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

  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  
  useFrame((state) => {
    // Burst window: 0.15 → 0.70
    const currentProgress = neonStore.current;
    const currentBurstT = easeInOut(clamp(invLerp(0.15, 0.65, currentProgress)));
    const currentFadeT = currentBurstT * (1 - clamp(invLerp(0.65, 0.85, currentProgress)));

    if (matRef.current) {
      matRef.current.color.set(currentProgress > 0.55 ? '#00f0ff' : '#f59e0b');
      matRef.current.opacity = 0.85 * currentFadeT;
    }

    if (!meshRef.current || currentFadeT < 0.02) {
      meshRef.current?.scale.setScalar(0);
      return;
    } else {
      meshRef.current.scale.setScalar(1);
    }
    
    seeds.forEach((s, i) => {
      const angle = s.angle + state.clock.elapsedTime * s.speed * 0.3;
      const r     = s.radius * (1 + currentBurstT * 0.6);
      dummy.position.set(
        Math.cos(angle) * r,
        s.yBase + Math.sin(state.clock.elapsedTime * s.speed + s.phase) * 0.2,
        Math.sin(angle) * r * 0.3
      );
      dummy.scale.setScalar(s.size * (0.4 + currentBurstT * 1.6) * currentFadeT);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        ref={matRef}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function ElectricArcs() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  const mat1 = useRef<THREE.MeshBasicMaterial>(null);
  const mat2 = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((_, delta) => {
    if (r1.current) r1.current.rotation.z += delta * 0.55;
    if (r2.current) r2.current.rotation.z -= delta * 0.38;

    const currentArcT = easeInOut(clamp(invLerp(0.08, 0.45, neonStore.current)));
    if (mat1.current) mat1.current.opacity = currentArcT * 0.8;
    if (mat2.current) mat2.current.opacity = currentArcT * 0.55;
  });

  return (
    <group position={[0, 1.6, 0.02]}>
      <mesh ref={r1}>
        <torusGeometry args={[1.45, 0.007, 8, 128, Math.PI * 1.55]} />
        <meshBasicMaterial
          ref={mat1}
          color="#00f0ff"
          transparent
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={r2}>
        <torusGeometry args={[1.72, 0.005, 6, 96, Math.PI * 1.1]} />
        <meshBasicMaterial
          ref={mat2}
          color="#f59e0b"
          transparent
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function NeonHalo() {
  const haloRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const currentNeonT = easeInOut(clamp(invLerp(0.50, 0.78, neonStore.current)));
    if (matRef.current) matRef.current.opacity = currentNeonT * 0.18;
    
    if (haloRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3.2) * 0.025 * currentNeonT;
      haloRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={haloRef} position={[0, 1.6, -0.08]}>
      <planeGeometry args={[4.5, 5.2]} />
      <meshBasicMaterial
        ref={matRef}
        color="#0a3d5c"
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

// ─── Interactive Conduit Light ────────────────────────────────────────────────
function ConduitLight({ a, onToggle }: { a: number; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (matRef.current && !hovered) {
      const currentEnergyT = easeInOut(clamp(invLerp(0.0, 0.4, neonStore.current)));
      matRef.current.color.set(currentEnergyT > 0.4 ? '#00f0ff' : '#a855f7');
    } else if (matRef.current && hovered) {
      matRef.current.color.set('#ffffff');
    }
  });

  return (
    <group position={[Math.cos(a) * 2.1, 0.22, Math.sin(a) * 2.1]}>
      <mesh>
        <boxGeometry args={[0.14, 0.10, 0.14]} />
        <meshStandardMaterial color="#131f30" metalness={0.8} />
      </mesh>
      <mesh
        position={[0, 0.07, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[hovered ? 0.05 : 0.038, 10, 10]} />
        <meshBasicMaterial ref={matRef} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CharacterPlatform({ onToggle }: { onToggle: () => void }) {
  const ring1Mat = useRef<THREE.MeshBasicMaterial>(null);
  const ring2Mat = useRef<THREE.MeshBasicMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const currentProgress = neonStore.current;
    const currentEnergyT = easeInOut(clamp(invLerp(0.0, 0.4, currentProgress)));

    if (ring1Mat.current) {
      ring1Mat.current.color.set(currentProgress > 0.6 ? '#00f0ff' : '#ff8a30');
    }
    if (ring2Mat.current) {
      ring2Mat.current.opacity = 0.35 + currentEnergyT * 0.45;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2.5 + currentEnergyT * 8.0;
      lightRef.current.color.set(currentProgress > 0.55 ? '#00f0ff' : '#ff8a30');
    }
  });

  return (
    <group>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <cylinderGeometry args={[2.4, 2.55, 0.15, 6]} />
        <meshStandardMaterial color="#07101c" metalness={0.92} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.32, 2.40, 128]} />
        <meshBasicMaterial ref={ring1Mat} transparent opacity={0.82} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.55, 1.60, 64]} />
        <meshBasicMaterial ref={ring2Mat} color="#a855f7" transparent toneMapped={false} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <ConduitLight key={i} a={(i / 6) * Math.PI * 2} onToggle={onToggle} />
      ))}
      <pointLight ref={lightRef} position={[0, -0.1, 0]} distance={5} />
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
          uSmoothness: { value: 0.15 },
          // Estimated adjustments: scale < 1 enlarges the image, negative offset shifts the image down/left
          uNeonScale: { value: 0.88 },
          uNeonOffset: { value: new THREE.Vector2(-0.015, -0.04) }
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
        
        // Manual alignment offsets for Neon texture
        uniform vec2 uNeonOffset;
        uniform float uNeonScale;

        varying vec2 vUv;
        
        #include <fog_pars_fragment>

        void main() {
          vec4 realColor = texture2D(tReal, vUv);
          
          // Apply scale and offset to neon UVs to align with real image
          // Center the UVs before scaling, then un-center
          vec2 neonUv = (vUv - 0.5) * uNeonScale + 0.5 + uNeonOffset;
          vec4 neonColor = texture2D(tNeon, neonUv);

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
    
    // Update shader uProgress directly from the global neon state
    shaderMaterial.uniforms.uProgress.value = THREE.MathUtils.lerp(
      shaderMaterial.uniforms.uProgress.value,
      neonStore.current,
      delta * 5.0
    );
    
    // Explicitly update the cloned uniform vector from the ref
    if (shaderMaterial.uniforms.uMouse.value) {
      shaderMaterial.uniforms.uMouse.value.copy(uMouse.current);
    }
  });

  const auraMat = useRef<THREE.MeshBasicMaterial>(null);

  // ── Frame animation ────────────────────────────────────────────────────────
  useFrame((state) => {
    const t   = state.clock.elapsedTime;
    const bY  = Math.sin(t * 2.2) * 0.012; // idle breath
    
    // Smooth scroll interpolation variables manually calculated per frame for the non-React store
    const currentProgress = neonStore.current;
    const dissolveT = easeInOut(clamp(invLerp(0.20, 0.55, currentProgress)));
    const energyT   = easeInOut(clamp(invLerp(0.05, 0.35, currentProgress)));
    const neonOp    = easeInOut(clamp(invLerp(0.35, 0.65, currentProgress)));
    const auraOp    = energyT * (1 - dissolveT * 0.6) * 0.28;

    const pX  = Math.sin(t * 0.55) * 0.035 * (1 + neonOp); // subtle parallax

    if (realRef.current)  { realRef.current.position.y  = pY + bY; realRef.current.position.x  = pX; }
    if (auraRef.current)  {
      auraRef.current.position.y = pY + bY;
      const s = 1 + Math.sin(t * 3.8) * 0.035 * energyT;
      auraRef.current.scale.set(s, s, s);
    }
    if (auraMat.current) {
      auraMat.current.opacity = auraOp;
    }
  });

  return (
    <group
      ref={rootRef}
      position={position}
      rotation={[rotationX, rotationY, 0]}
      scale={[scale, scale, scale]}
      onPointerMove={(e) => {
        // Trigger A: Mouse interaction increases neon intensity based on proximity to center (assuming UV center is 0.5, 0.5)
        if (e.uv && !neonStore.isLocked) {
          const dist = new THREE.Vector2(0.5, 0.5).distanceTo(e.uv);
          // closer to center (dist ~0) = max intensity (1.0)
          // farther from center (dist ~0.5) = min intensity (0.0)
          const intensity = Math.max(0, 1.0 - dist * 2.0);
          neonStore.setTarget(intensity);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        if (!neonStore.isLocked) neonStore.setTarget(0);
      }}
    >
      <CharacterPlatform onToggle={() => neonStore.toggleLock()} />

      {/* ── Neon halo backdrop ────────────────────────────────────────────── */}
      <NeonHalo />

      {/* ── Electric orbit arcs ───────────────────────────────────────────── */}
      <ElectricArcs />

      {/* ── Blue energy aura behind Real portrait ─────────────────────────── */}
      <mesh ref={auraRef} position={[0, pY, -0.05]}>
        <planeGeometry args={[pW * 1.1, pH * 1.05]} />
        <meshBasicMaterial
          ref={auraMat}
          color="#00f0ff"
          transparent
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
      <TransformBurst count={isMobile ? 48 : 80} />

      {/* ── HUD and Lightning ─────────────────────────────────────────────── */}
      <LightningStrike />
      <NeonHUD />
    </group>
  );
}
