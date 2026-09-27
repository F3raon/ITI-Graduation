import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';
import { soundEngine } from '../../utils/audio';

const BOOT_LOGS = [
  'INITIALIZING SYSTEM ARCHITECTURE...',
  'ESTABLISHING WEBGL CONTEXT...',
  'MOUNTING 3D ENVIRONMENT...',
  'LOADING CINEMATIC ASSETS...',
  'CALIBRATING LIGHTING ENGINE...',
  'SYNCING NEURAL INTERFACE...',
  'PREPARING PORTFOLIO DATA...',
  'BOOT SEQUENCE ALMOST COMPLETE...'
];

export function CinematicLoader() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);
  const [logIndex, setLogIndex] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Fake cinematic progress to ensure it doesn't flash by too quickly
  useEffect(() => {
    let animationFrameId: number;
    let current = displayProgress;
    
    const animate = () => {
      if (current < progress) {
        // Slow down the progress intentionally for a "heavy" system boot feel
        current += (progress - current) * 0.05 + 0.1;
        if (current > progress) current = progress;
        setDisplayProgress(current);
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress, displayProgress]);

  // Cycle through boot logs
  useEffect(() => {
    if (displayProgress < 100) {
      const interval = setInterval(() => {
        setLogIndex((prev) => (prev + 1) % BOOT_LOGS.length);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [displayProgress]);

  const handleEnter = () => {
    soundEngine.playSelect();
    // Enable audio automatically if it was muted
    if (soundEngine.getMuted()) {
      soundEngine.toggleMute();
    }
    setShow(false);
  };

  if (!show) return null;

  const isReady = displayProgress >= 100;

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#010306] transition-all duration-1000 overflow-hidden ${!show ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
      
      {/* Background Grid & Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#38bdf810] to-transparent h-[10px] w-full animate-[scan_3s_linear_infinite]" />

      <div className="relative flex flex-col items-center">
        {/* Core Reactor Ring */}
        <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center">
          {/* Outer glowing dashed ring */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#0f172a" strokeWidth="2" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 20" opacity="0.5" />
          </svg>
          
          {/* Inner solid progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#0f172a" strokeWidth="4" />
            <circle 
              cx="50" 
              cy="50" 
              r="42" 
              fill="none" 
              stroke={isReady ? '#10b981' : '#38bdf8'} 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="264" // 2 * pi * r
              strokeDashoffset={264 - (264 * displayProgress) / 100}
              className="transition-all duration-100 ease-out"
              style={{ filter: `drop-shadow(0 0 12px ${isReady ? '#10b981' : '#38bdf8'})` }}
            />
          </svg>

          {/* Center Percentage */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-[#f8fafc] font-mono text-5xl md:text-6xl font-black tracking-tighter drop-shadow-[0_0_15px_${isReady ? 'rgba(16,185,129,0.8)' : 'rgba(56,189,248,0.8)'}]`}>
              {Math.min(100, Math.floor(displayProgress))}
            </span>
            <span className={`font-mono text-xs mt-1 font-bold tracking-[0.3em] ${isReady ? 'text-[#10b981]' : 'text-[#38bdf8]'}`}>
              {isReady ? 'READY' : 'PERCENT'}
            </span>
          </div>
        </div>

        {/* System Logs or Enter Button */}
        <div className="mt-16 h-24 flex flex-col items-center justify-start text-center">
          {!isReady ? (
            <>
              <div className="text-[#38bdf8] font-mono text-sm tracking-[0.2em] font-bold mb-3">
                SYSTEM_BOOT_SEQ
              </div>
              <div className="text-slate-400 font-mono text-xs tracking-widest uppercase h-4 overflow-hidden relative">
                <div className="animate-pulse">
                  {BOOT_LOGS[logIndex]}
                </div>
              </div>
            </>
          ) : (
            <button 
              onClick={handleEnter}
              className="group relative px-10 py-4 bg-[#0a1526] border border-[#38bdf8] hover:bg-[#38bdf8] transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffffff40] to-transparent translate-x-[-150%] group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10 font-mono text-sm tracking-[0.3em] font-bold text-[#38bdf8] group-hover:text-[#0a1526] transition-colors duration-500">
                ENTER DIGITAL WORLD
              </span>
              <div className="absolute inset-0 shadow-[0_0_20px_rgba(56,189,248,0.5)_inset] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          )}
        </div>
      </div>
      
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes shimmer {
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  );
}
