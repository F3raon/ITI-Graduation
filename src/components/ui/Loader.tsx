import { useProgress } from '@react-three/drei';
import { useEffect, useState } from 'react';

export function CinematicLoader() {
  const { progress } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (progress === 100) {
      const t = setTimeout(() => setShow(false), 800);
      return () => clearTimeout(t);
    }
  }, [progress]);

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#030507] transition-opacity duration-700 ${progress === 100 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-64">
        <div className="text-[#38bdf8] font-mono text-xs mb-2 tracking-[0.2em] flex justify-between">
          <span>SYSTEM_INIT</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-[2px] w-full bg-slate-800 rounded overflow-hidden">
          <div 
            className="h-full bg-[#38bdf8] shadow-[0_0_15px_#38bdf8] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-slate-500 font-mono text-[10px] mt-4 tracking-widest text-center animate-pulse">
          LOADING CINEMATIC ENVIRONMENT
        </div>
      </div>
    </div>
  );
}
