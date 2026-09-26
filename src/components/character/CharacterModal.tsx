import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AhmedCharacter } from './AhmedCharacter';
import { CharacterLighting } from './CharacterLighting';
import { CharacterParticles } from './CharacterParticles';
import { CharacterEffects } from './CharacterEffects';
import { CharacterRotation } from './CharacterRotation';
import { CharacterTransformationFrame } from './CharacterTransformation';
import { CharacterUI } from './CharacterUI';
import { useTransformationProgress } from '../../hooks/useTransformationProgress';
import { useCharacterInteraction } from '../../hooks/useCharacterInteraction';

export function CharacterModal({ onClose }: { onClose: () => void }) {
  const {
    progress,
    stageName,
    stageColor,
    isAutoPlaying,
    setProgress,
    toggleAutoPlay,
    setStage,
  } = useTransformationProgress(0.5);

  const {
    rotationY,
    activeAngle,
    setPresetAngle,
    resetView,
  } = useCharacterInteraction();

  return (
    <div
      className="character-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        background: 'rgba(2, 4, 8, 0.92)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100002,
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(5, 8, 15, 0.65)',
        }}
      >
        <div>
          <div
            style={{
              fontSize: '13px',
              fontFamily: 'monospace',
              fontWeight: 800,
              letterSpacing: '2px',
              color: '#00f0ff',
            }}
          >
            AHMED HAMADA // 360° CHARACTER LAB & TRANSFORMATION
          </div>
          <div
            style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              color: '#94a3b8',
              letterSpacing: '1px',
              marginTop: '2px',
            }}
          >
            DRAG TO ROTATE 360° • SCROLL TO ZOOM • SLIDER CONTROLS REAL → NEON
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            padding: '8px 18px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#f8fafc',
            fontFamily: 'monospace',
            fontSize: '11px',
            cursor: 'pointer',
            letterSpacing: '1px',
            transition: 'all 0.2s ease',
          }}
        >
          ✕ RETURN TO WORLD
        </button>
      </div>

      {/* 3D WebGL Canvas for 360° Character Inspection */}
      <div style={{ flex: 1, width: '100%', height: '100%' }}>
        <Canvas
          shadows
          camera={{ position: [0, 1.4, 4.2], fov: 46 }}
          gl={{ antialias: true, alpha: true }}
        >
          <color attach="background" args={['#03060c']} />
          <fog attach="fog" args={['#03060c', 8, 25]} />

          {/* Dynamic Adaptation Lighting */}
          <CharacterLighting progress={progress} />

          {/* Particles and Energy */}
          <CharacterParticles count={160} progress={progress} />
          <CharacterEffects progress={progress} />

          {/* 360 Platform Turntable */}
          <CharacterRotation
            rotationY={rotationY}
            onSelectAngle={setPresetAngle}
            isInteractive={true}
          />

          {/* Ahmed Hamada 3D Character */}
          <AhmedCharacter
            position={[0, 0, 0]}
            rotationY={rotationY}
            progress={progress}
            scale={1.05}
            isInteractive={true}
          />

          {/* Real Photo Identity Frame to the left */}
          <group position={[-2.8, 1.4, -0.6]}>
            <CharacterTransformationFrame progress={progress} />
          </group>

          {/* Free 360 Orbit Controls with damped inertia and zoom */}
          <OrbitControls
            enablePan={false}
            minDistance={2.5}
            maxDistance={7}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2 + 0.05}
            dampingFactor={0.06}
          />
        </Canvas>
      </div>

      {/* Bottom Interactive Transformation and 360 HUD */}
      <CharacterUI
        progress={progress}
        stageName={stageName}
        stageColor={stageColor}
        isAutoPlaying={isAutoPlaying}
        activeAngle={activeAngle}
        onProgressChange={setProgress}
        onToggleAutoPlay={toggleAutoPlay}
        onSetStage={setStage}
        onSelectAngle={setPresetAngle}
        onResetRotation={resetView}
      />
    </div>
  );
}
