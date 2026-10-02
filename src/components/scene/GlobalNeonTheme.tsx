import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { neonStore } from '../../context/NeonContext';

interface MaterialCache {
  material: THREE.Material;
  origColor: THREE.Color | null;
  targetColor: THREE.Color | null;
  origEmissive: THREE.Color | null;
  targetEmissive: THREE.Color | null;
}

export function GlobalNeonTheme() {
  const { scene } = useThree();
  const gridRef = useRef<THREE.GridHelper>(null);
  const leftWireRef = useRef<THREE.MeshBasicMaterial>(null);
  const rightWireRef = useRef<THREE.MeshBasicMaterial>(null);
  const topWireRef = useRef<THREE.MeshBasicMaterial>(null);
  
  // Power lines material refs to animate them
  const powerLine1Ref = useRef<THREE.MeshBasicMaterial>(null);
  const powerLine2Ref = useRef<THREE.MeshBasicMaterial>(null);

  // Cache for all scene materials to dynamically change their themes
  const materialsCache = useRef<MaterialCache[]>([]);

  useEffect(() => {
    // Wait a brief moment to ensure all components have mounted and materials are created
    const timeout = setTimeout(() => {
      const cache: MaterialCache[] = [];

      scene.traverse((child: any) => {
        // Skip explicitly ignored components (like the Character, Neon effects, Iframe, etc)
        let node = child;
        let isIgnored = false;
        while (node) {
          if (node.userData?.neonTheme === 'ignore' || node.name === 'AhmedCharacter' || node.name === 'Avatar') {
            isIgnored = true;
            break;
          }
          node = node.parent;
        }

        if (isIgnored || !child.isMesh || !child.material) return;

        const processMaterial = (mat: any) => {
          if (mat.userData?.isNeonProcessed) return;
          mat.userData.isNeonProcessed = true;

          // Skip materials that use textures (like character skin, clothes, iframe screenshots)
          if (mat.map && !child.name.includes('Text')) return;

          const m = {
            material: mat,
            origColor: null,
            targetColor: null,
            origEmissive: null,
            targetEmissive: null,
          } as MaterialCache;

          // Process Color
          if (mat.color) {
            m.origColor = mat.color.clone();
            const hsl = {} as any;
            m.origColor!.getHSL(hsl);
            m.targetColor = new THREE.Color();

            if (hsl.l > 0.8 || mat.name.includes('Text')) {
              // White text or very light colors become bright cyan or magenta
              m.targetColor.set(Math.random() > 0.5 ? '#00f0ff' : '#d946ef');
            } else if (hsl.l > 0.2) {
              // Mid-tones become deep purple or hot pink
              m.targetColor.set('#7c3aed');
            } else {
              // Dark backgrounds become extremely dark blue/void
              m.targetColor.set('#020617');
            }
          }

          // Process Emissive
          if (mat.emissive !== undefined) {
            m.origEmissive = mat.emissive.clone();
            m.targetEmissive = new THREE.Color();
            
            if (m.origColor) {
              const hsl = {} as any;
              m.origColor.getHSL(hsl);
              if (hsl.l > 0.5) {
                // Give bright objects a subtle neon glow
                m.targetEmissive.copy(m.targetColor!).multiplyScalar(0.5);
              } else {
                m.targetEmissive.set('#000000');
              }
            }
          }

          cache.push(m);
        };

        if (Array.isArray(child.material)) {
          child.material.forEach(processMaterial);
        } else {
          processMaterial(child.material);
        }
      });

      materialsCache.current = cache;
    }, 2000);

    return () => clearTimeout(timeout);
  }, [scene]);

  useFrame((state) => {
    const t = neonStore.current;
    const time = state.clock.elapsedTime;
    
    // Update CSS variables for HTML UI components
    document.documentElement.style.setProperty('--theme-mix', t.toString());
    
    // Interpolate all scene materials
    materialsCache.current.forEach((cache) => {
      const mat = cache.material as any;
      if (cache.origColor && cache.targetColor && mat.color) {
        (mat.color as THREE.Color).lerpColors(cache.origColor, cache.targetColor, t);
      }
      if (cache.origEmissive && cache.targetEmissive && (cache.material as any).emissive) {
        (cache.material as any).emissive.lerpColors(cache.origEmissive, cache.targetEmissive, t);
      }
    });

    // Grid fading in
    if (gridRef.current && gridRef.current.material) {
      (gridRef.current.material as THREE.Material).transparent = true;
      (gridRef.current.material as THREE.Material).opacity = t * 0.4;
      
      const colorIntensity = 0.5 + Math.sin(time * 2) * 0.2;
      (gridRef.current.material as any).color.setHSL(0.5, 1, colorIntensity);
    }
    
    // Wire opacity & pulses
    const pulse1 = Math.sin(time * 4) * 0.5 + 0.5;
    const pulse2 = Math.sin(time * 3 - 2) * 0.5 + 0.5;
    const pulse3 = Math.sin(time * 5 - 1) * 0.5 + 0.5;

    if (leftWireRef.current) leftWireRef.current.opacity = t * (0.3 + pulse1 * 0.7);
    if (rightWireRef.current) rightWireRef.current.opacity = t * (0.3 + pulse2 * 0.7);
    if (topWireRef.current) topWireRef.current.opacity = t * (0.3 + pulse3 * 0.7);
    
    if (powerLine1Ref.current) {
      powerLine1Ref.current.opacity = t * (0.4 + Math.sin(time * 8) * 0.6);
    }
    if (powerLine2Ref.current) {
      powerLine2Ref.current.opacity = t * (0.4 + Math.cos(time * 6) * 0.6);
    }
  });

  return (
    <group position={[0, 0, -50]} userData={{ neonTheme: 'ignore' }}>
      {/* Massive Cyberpunk Grid */}
      <gridHelper 
        ref={gridRef} 
        args={[200, 100, '#00f0ff', '#00f0ff']} 
        position={[0, -2.8, 0]} 
      />
      
      {/* Ceiling Cyberpunk Grid */}
      <gridHelper 
        args={[200, 100, '#a855f7', '#a855f7']} 
        position={[0, 6.0, 0]} 
        rotation={[Math.PI, 0, 0]}
      >
        <meshBasicMaterial transparent opacity={0.15} />
      </gridHelper>

      {/* Electrical Power Strips (Data lines running through the whole world) */}
      
      {/* Left Wall Strip */}
      <mesh position={[-8, -2.7, 0]}>
        <boxGeometry args={[0.1, 0.05, 200]} />
        <meshBasicMaterial ref={leftWireRef} color="#00f0ff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Right Wall Strip */}
      <mesh position={[8, -2.7, 0]}>
        <boxGeometry args={[0.1, 0.05, 200]} />
        <meshBasicMaterial ref={rightWireRef} color="#ff8a30" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Top Ceiling Strip */}
      <mesh position={[0, 5.8, 0]}>
        <boxGeometry args={[0.2, 0.05, 200]} />
        <meshBasicMaterial ref={topWireRef} color="#a855f7" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Ground Center Data Streams (Fast pulsing) */}
      <mesh position={[-0.4, -2.78, 0]}>
        <boxGeometry args={[0.04, 0.02, 200]} />
        <meshBasicMaterial ref={powerLine1Ref} color="#ffffff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0.4, -2.78, 0]}>
        <boxGeometry args={[0.04, 0.02, 200]} />
        <meshBasicMaterial ref={powerLine2Ref} color="#00f0ff" transparent opacity={0} blending={THREE.AdditiveBlending} />
      </mesh>
      
      {/* Ambient Neon Atmosphere (Lights) */}
      {/* We add huge point lights spaced out to fill the entire tunnel with neon colors when active */}
      {[-100, -50, 0, 50, 100].map((z, i) => (
        <React.Fragment key={z}>
          <DynamicPointLight position={[-6, 2, z]} color="#00f0ff" delay={i} />
          <DynamicPointLight position={[6, 2, z]} color="#ff8a30" delay={i + 1} />
        </React.Fragment>
      ))}
    </group>
  );
}

function DynamicPointLight({ position, color, delay }: { position: [number, number, number], color: string, delay: number }) {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const t = neonStore.current;
    if (lightRef.current) {
      // Pulse intensity based on neon mode
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.2;
      lightRef.current.intensity = t * 15 * pulse; 
    }
  });

  return (
    <pointLight 
      ref={lightRef} 
      position={position} 
      distance={30} 
      color={color} 
      intensity={0} 
    />
  );
}
