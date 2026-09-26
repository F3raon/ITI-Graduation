import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export interface AhmedCharacterProps {
  position?: [number, number, number];
  rotationY?: number;
  rotationX?: number;
  scale?: number;
  progress?: number; // 0.0 Real -> 1.0 Full Neon
  isInteractive?: boolean;
}

// 8 Turnaround pose image paths extracted from the approved concept turnaround sheet
const POSE_PATHS = [
  '/images/character/pose_feather_0.png', // 0: Front
  '/images/character/pose_feather_1.png', // 1: Front-Left (3/4)
  '/images/character/pose_feather_2.png', // 2: Left (Profile)
  '/images/character/pose_feather_3.png', // 3: Back-Left (3/4 rear)
  '/images/character/pose_feather_4.png', // 4: Back (Illuminated "AH" Crest & Curly Hair)
  '/images/character/pose_feather_5.png', // 5: Back-Right (3/4 rear)
  '/images/character/pose_feather_6.png', // 6: Right (Profile)
  '/images/character/pose_feather_7.png', // 7: Front-Right (3/4)
];

// Transformation stage cards
const TRANS_CARD_PATHS = [
  '/images/character/trans_card_feather_0.png', // Real Photo
  '/images/character/trans_card_feather_1.png', // Lighting Ignition
  '/images/character/trans_card_feather_2.png', // Stylized 3D
  '/images/character/trans_card_feather_3.png', // Full Neon Mode
];

export function AhmedCharacter({
  position = [0, 0, 0],
  rotationY = 0,
  rotationX = 0,
  scale = 1,
  progress = 0.5,
  isInteractive = true,
}: AhmedCharacterProps) {
  const rootRef = useRef<THREE.Group>(null);
  const characterPlaneRef = useRef<THREE.Mesh>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const scanlineRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  // Check if a real GLB model exists at /models/ahmed.glb
  const [hasGlbModel, setHasGlbModel] = useState(false);
  useEffect(() => {
    fetch('/models/ahmed.glb', { method: 'HEAD' })
      .then((res) => {
        if (res.ok) setHasGlbModel(true);
      })
      .catch(() => {
        setHasGlbModel(false);
      });
  }, []);

  // Preload turnaround textures and transformation textures
  const poseTextures = useTexture(POSE_PATHS);
  const transTextures = useTexture(TRANS_CARD_PATHS);
  const realPortraitTexture = useTexture('/images/ahmed-real.png');

  // Currently active pose index based on camera viewing angle
  const [activePoseIndex, setActivePoseIndex] = useState(0);

  // Compute transformation stage description
  const stageInfo = useMemo(() => {
    if (progress < 0.25) {
      return {
        label: 'STAGE 1: REAL PORTRAIT & BIOMETRIC IDENTITY',
        color: '#67c9ff',
        energy: progress * 2.0,
      };
    }
    if (progress < 0.5) {
      return {
        label: 'STAGE 2: BLUE & VIOLET ENERGY TRANSITION',
        color: '#a855f7',
        energy: 0.5 + (progress - 0.25) * 2.5,
      };
    }
    if (progress < 0.8) {
      return {
        label: 'STAGE 3: 3D AHMED HAMADA (TECHWEAR HOODIE)',
        color: '#38bdf8',
        energy: 1.0 + (progress - 0.5) * 1.5,
      };
    }
    return {
      label: 'STAGE 4: FULL NEON CYBER OVERDRIVE (360° ORBIT)',
      color: '#00f0ff',
      energy: 1.8,
    };
  }, [progress]);

  // Which transformation card to display in the biometric scan matrix
  const transCardIndex = Math.min(3, Math.floor(progress * 4));

  useFrame((state, delta) => {
    // 1. Natural idle breathing motion
    const breath = Math.sin(state.clock.elapsedTime * 2.4) * 0.02;
    if (characterPlaneRef.current) {
      characterPlaneRef.current.position.y = 1.48 + breath;
    }

    // 2. Rotate energy rings
    if (ringsRef.current) {
      ringsRef.current.rotation.y += delta * (0.3 + progress * 0.9);
    }

    // 3. Oscillate scanline
    if (scanlineRef.current) {
      scanlineRef.current.position.y = 1.48 + Math.sin(state.clock.elapsedTime * 3.2) * 1.1;
    }

    // 4. Calculate relative viewing angle between camera and character
    if (rootRef.current) {
      const worldPos = new THREE.Vector3();
      rootRef.current.getWorldPosition(worldPos);

      // Angle from character to camera in world space
      const dx = camera.position.x - worldPos.x;
      const dz = camera.position.z - worldPos.z;
      let angle = Math.atan2(dx, dz) - rotationY;

      // Normalize to [0, 2*PI)
      while (angle < 0) angle += Math.PI * 2;
      while (angle >= Math.PI * 2) angle -= Math.PI * 2;

      // 8 sectors (each is 45 deg or PI/4)
      // Sector 0 is centered at angle 0 (Front)
      const sector = Math.round((angle / (Math.PI * 2)) * 8) % 8;
      if (sector !== activePoseIndex) {
        setActivePoseIndex(sector);
      }

      // Keep the character plane always facing the camera plane
      if (characterPlaneRef.current) {
        characterPlaneRef.current.rotation.y = Math.atan2(dx, dz);
      }
    }

    // 5. Aura scale pulse
    if (auraRef.current) {
      const s = 1.0 + Math.sin(state.clock.elapsedTime * 3.5) * 0.04 * progress;
      auraRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={rootRef} position={position} scale={[scale, scale, scale]}>
      {/* ================================================================ */}
      {/* 1. ELEVATED SCI-FI PEDESTAL & DAIS */}
      {/* ================================================================ */}
      <group position={[0, 0, 0]}>
        {/* Main Base Hexagonal Dais */}
        <mesh position={[0, 0.08, 0]} receiveShadow>
          <cylinderGeometry args={[2.3, 2.5, 0.18, 6]} />
          <meshStandardMaterial
            color="#080e18"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Outer Glowing Neon Ring on Floor */}
        <mesh position={[0, 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.2, 2.28, 48]} />
          <meshBasicMaterial
            color={progress > 0.5 ? '#00f0ff' : '#ff8a30'}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Inner Counter-Rotating Holographic Emitter Ring */}
        <mesh position={[0, 0.19, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.56, 48]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.4 + progress * 0.5}
          />
        </mesh>

        {/* 6 Peripheral Conduit Nodes */}
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
                <meshBasicMaterial color={progress > 0.4 ? '#00f0ff' : '#a855f7'} />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* ================================================================ */}
      {/* 2. DYNAMIC ENERGY RINGS & PARTICLES */}
      {/* ================================================================ */}
      <group ref={ringsRef} position={[0, 1.45, 0]}>
        {/* Orbital Cyan Ring */}
        <mesh rotation={[Math.PI / 3.5, 0, 0]}>
          <torusGeometry args={[1.35, 0.012, 16, 64]} />
          <meshBasicMaterial
            color="#00f0ff"
            transparent
            opacity={0.25 + progress * 0.7}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Orbital Violet Ring */}
        <mesh rotation={[-Math.PI / 4, Math.PI / 5, 0]}>
          <torusGeometry args={[1.5, 0.01, 16, 64]} />
          <meshBasicMaterial
            color="#a855f7"
            transparent
            opacity={0.2 + progress * 0.65}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      {/* ================================================================ */}
      {/* 3. AHMED HAMADA APPROVED 3D CHARACTER (VOLUMETRIC CONCEPT RIG) */}
      {/* ================================================================ */}
      <mesh
        ref={characterPlaneRef}
        position={[0, 1.48, 0]}
        castShadow
      >
        {/* Plane sized to preserve authentic proportions */}
        <planeGeometry args={[1.55, 2.8]} />
        <meshBasicMaterial
          map={poseTextures[activePoseIndex]}
          transparent
          alphaTest={0.02}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Dynamic Cyber Lightning & Rim Glow Aura */}
      <mesh ref={auraRef} position={[0, 1.48, 0]}>
        <planeGeometry args={[1.65, 2.9]} />
        <meshBasicMaterial
          color={progress > 0.5 ? '#00f0ff' : '#a855f7'}
          transparent
          opacity={progress * 0.28}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sweeping Laser Scanline */}
      <mesh ref={scanlineRef} position={[0, 1.48, 0.02]}>
        <planeGeometry args={[1.6, 0.035]} />
        <meshBasicMaterial
          color={progress > 0.6 ? '#00f0ff' : '#ff8a30'}
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* ================================================================ */}
      {/* 4. REAL PORTRAIT IDENTITY MATRIX & TRANSFORMATION SCREEN */}
      {/* Placed prominently during approach (scroll 0.22 - 0.28) */}
      {/* ================================================================ */}
      {progress < 0.85 && (
        <group
          position={[0, 1.45, 1.35]}
          scale={Math.max(0.01, 1.0 - progress * 0.9)}
        >
          {/* Outer Glass Scanner Frame */}
          <RoundedBox args={[1.5, 1.9, 0.06]} radius={0.05} smoothness={3}>
            <meshStandardMaterial
              color="#090d16"
              metalness={0.9}
              roughness={0.15}
              emissive={stageInfo.color}
              emissiveIntensity={0.3}
            />
          </RoundedBox>

          {/* Current Transformation Stage Image */}
          <mesh position={[0, 0.08, 0.04]}>
            <planeGeometry args={[1.32, 1.45]} />
            <meshBasicMaterial
              map={transTextures[transCardIndex]}
              transparent
              opacity={Math.max(0.2, 1.0 - progress * 0.8)}
              toneMapped={false}
            />
          </mesh>

          {/* Biometric Target Corner Brackets */}
          {[-0.62, 0.62].map((bx) =>
            [-0.62, 0.72].map((by) => (
              <mesh key={`${bx}-${by}`} position={[bx, by, 0.05]}>
                <boxGeometry args={[0.09, 0.09, 0.01]} />
                <meshBasicMaterial color="#00f0ff" />
              </mesh>
            ))
          )}

          {/* Telemetry text */}
          <Text
            position={[0, -0.74, 0.04]}
            fontSize={0.055}
            color="#38bdf8"
            anchorX="center"
            letterSpacing={0.1}
          >
            BIOMETRIC IDENTITY // AHMED HAMADA
          </Text>
        </group>
      )}

      {/* ================================================================ */}
      {/* 5. TOP HOLOGRAPHIC STATUS PANEL & GLB-READY BADGE */}
      {/* ================================================================ */}
      <group position={[0, 3.25, 0]}>
        {/* Main Title Header */}
        <Text
          position={[0, 0.35, 0]}
          fontSize={0.13}
          color="#94a3b8"
          anchorX="center"
          letterSpacing={0.22}
          fontWeight={600}
        >
          // AHMED HAMADA 3D AVATAR SYSTEM
        </Text>

        <Text
          position={[0, 0.05, 0]}
          fontSize={0.36}
          color="#ffffff"
          anchorX="center"
          fontWeight={900}
          letterSpacing={0.05}
        >
          AHMED HAMADA
        </Text>

        {/* Live Transformation Stage Indicator */}
        <Text
          position={[0, -0.22, 0]}
          fontSize={0.11}
          color={stageInfo.color}
          anchorX="center"
          letterSpacing={0.15}
          fontWeight={700}
        >
          {stageInfo.label}
        </Text>

        {/* GLB-Ready Status Notice */}
        <group position={[0, -0.44, 0]}>
          <mesh>
            <planeGeometry args={[2.7, 0.18]} />
            <meshBasicMaterial color="#0b1322" transparent opacity={0.8} />
          </mesh>
          <Text
            position={[0, 0, 0.01]}
            fontSize={0.072}
            color="#ff8a30"
            anchorX="center"
            letterSpacing={0.12}
            fontWeight={600}
          >
            {hasGlbModel
              ? 'MODEL LOADED: public/models/ahmed.glb (ACTIVE)'
              : 'STATUS: GLB-READY // WAITING FOR public/models/ahmed.glb'}
          </Text>
        </group>

        {/* Current Camera Angle Indicator */}
        <Text
          position={[0, -0.62, 0]}
          fontSize={0.07}
          color="#64748b"
          anchorX="center"
          letterSpacing={0.1}
        >
          {`CURRENT VIEW: ${
            [
              'FRONT (0°)',
              'FRONT-LEFT (45°)',
              'LEFT PROFILE (90°)',
              'BACK-LEFT (135°)',
              'BACK // "AH" EMBLEM (180°)',
              'BACK-RIGHT (225°)',
              'RIGHT PROFILE (270°)',
              'FRONT-RIGHT (315°)',
            ][activePoseIndex]
          }`}
        </Text>
      </group>
    </group>
  );
}
