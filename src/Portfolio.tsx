import { Canvas } from '@react-three/fiber';
import { World } from './components/scene/World';
import { SoundToggle } from './components/ui/SoundToggle';
import { ScrollTrack } from './components/ui/ScrollTrack';
import { ScrollProvider } from './context/ScrollContext';
import { CinematicLoader } from './components/ui/Loader';

export default function Portfolio() {
  return (
    <ScrollProvider>
      <div className="fixed inset-0 w-screen h-screen bg-[#030507] overflow-hidden">
        <CinematicLoader />
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
          className="!w-screen !h-screen block"
        >
          <World />
        </Canvas>

        {/* Ambient Procedural Audio Control */}
        <SoundToggle />

        {/* Interactive Holographic Scroll Track Indicator */}
        <ScrollTrack />

        {/* Minimal Top Brand Watermark */}
        <div className="fixed top-[14px] left-[14px] md:top-[24px] md:left-[28px] z-[9999] pointer-events-none select-none scale-[0.75] md:scale-100 origin-top-left">
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
