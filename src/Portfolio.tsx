import { Canvas } from '@react-three/fiber';
import { useState, useEffect } from 'react';
import { World } from './components/scene/World';
import { ScrollTrack } from './components/ui/ScrollTrack';
import { ScrollProvider } from './context/ScrollContext';
import { NeonProvider } from './context/NeonContext';

export default function Portfolio() {
  const [activeIframeUrl, setActiveIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (e: any) => setActiveIframeUrl(e.detail);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIframeUrl(null);
    };

    window.addEventListener('open-iframe', handleOpen);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-iframe', handleOpen);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <NeonProvider>
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

        {/* 3D Web View Iframe Overlay */}
        {activeIframeUrl && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#030507]/90 backdrop-blur-md p-4 md:p-12 transition-all duration-300">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-black/50 border border-slate-700/50 rounded-2xl shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden flex flex-col backdrop-blur-xl">
              {/* Top Control Bar */}
              <div className="h-12 w-full bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="text-xs font-mono text-slate-400 tracking-wider truncate px-4">
                  {activeIframeUrl.replace(/^https?:\/\//, '')}
                </div>
                <button 
                  onClick={() => setActiveIframeUrl(null)}
                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors text-xs font-bold"
                >
                  CLOSE [ESC]
                </button>
              </div>
              
              {/* Iframe Content */}
              <div className="flex-1 w-full bg-black">
                <iframe 
                  src={activeIframeUrl} 
                  className="w-full h-full border-none"
                  title="Project Web View"
                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      </ScrollProvider>
    </NeonProvider>
  );
}
