import { Canvas } from '@react-three/fiber';
import { World } from './components/scene/World';
import { ScrollTrack } from './components/ui/ScrollTrack';
import { ScrollProvider } from './context/ScrollContext';

export default function Portfolio() {
  return (
    <ScrollProvider>
      <div className="fixed inset-0 w-screen h-screen bg-[#030507] overflow-hidden">
        {/* 3D WebGL Canvas */}
        <Canvas
          shadows
          camera={{ position: [0, 0.9, 13], fov: 58, near: 0.1, far: 120 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
            alpha: false,
          }}
          className="!w-screen !h-screen block"
        >
          <World />
        </Canvas>

        {/* Interactive Holographic Scroll Track Indicator */}
        <ScrollTrack />
      </div>
    </ScrollProvider>
  );
}
