import { Canvas } from '@react-three/fiber';
import { World } from './components/scene/World';
import { SoundToggle } from './components/ui/SoundToggle';
import { ScrollTrack } from './components/ui/ScrollTrack';
import { ScrollProvider } from './context/ScrollContext';

export default function Portfolio() {
  return (
    <ScrollProvider>
      <div className="cinematic-app">
        {/* 3D WebGL Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 0.9, 14], fov: 72 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
          }}
        >
          <World />
        </Canvas>

        {/* Ambient Procedural Audio Control */}
        <SoundToggle />

        {/* Interactive Holographic Scroll Track Indicator */}
        <ScrollTrack />

        {/* Minimal Top Brand Watermark */}
        <div className="hud-watermark">
          <div
            style={{
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '2px',
              color: '#67c9ff',
              fontWeight: 700,
            }}
          >
            AHMED HAMADA // DIGITAL WORLD
          </div>
          <div
            style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              letterSpacing: '1px',
              color: 'rgba(148, 163, 184, 0.7)',
              marginTop: '2px',
            }}
          >
            SOFTWARE DEVELOPER • .NET & ROBOTICS
          </div>
        </div>
      </div>
    </ScrollProvider>
  );
}
