import React, { useRef, useState } from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { soundEngine } from '../../utils/audio';

const SECTORS = [
  { name: 'ENTRY', target: 0.07 },
  { name: '3D OFFICE', target: 0.20 },
  { name: 'REAL AHMED', target: 0.30 },
  { name: 'NEON MORPH', target: 0.40 },
  { name: 'ABOUT ME', target: 0.53 },
  { name: 'SKILLS LAB', target: 0.62 },
  { name: 'PROJECT LAB', target: 0.71 },
  { name: 'TIMELINE', target: 0.80 },
  { name: 'HONORS', target: 0.87 },
  { name: 'CONTACT', target: 0.93 },
  { name: 'LIVE PORTAL', target: 0.98 },
];

export function ScrollTrack() {
  const { progress, scrollTo } = useScrollProgress();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Find active sector name
  const currentSector = SECTORS.reduce((prev, curr) => {
    return Math.abs(curr.target - progress) < Math.abs(prev.target - progress) ? curr : prev;
  });

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, clickY / rect.height));
    soundEngine.playSelect();
    scrollTo(percentage);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    const onMouseMove = (e: MouseEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const percentage = Math.max(0, Math.min(1, clickY / rect.height));
      scrollTo(percentage);
    };
    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="fixed right-[6px] md:right-[24px] top-1/2 -translate-y-1/2 z-[9999] flex flex-row items-center gap-[6px] md:gap-[16px] select-none scale-[0.7] md:scale-100 origin-right">
      {/* Current Sector Badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '4px',
          marginRight: '12px',
          justifyContent: 'center',
          opacity: 0.8,
        }}
      >
        <span
          className="hidden md:inline"
          style={{
            fontSize: '11px',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            letterSpacing: '2px',
            color: '#ffffff',
            textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
            textTransform: 'uppercase',
          }}
        >
          {currentSector.name}
        </span>
      </div>

      {/* Vertical Interactive Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        onMouseEnter={() => soundEngine.playHover()}
        style={{
          width: '2px',
          height: '240px',
          background: 'rgba(255, 255, 255, 0.1)',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {/* Glow Progress Fill */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: `${progress * 100}%`,
            background: '#ffffff',
            boxShadow: '0 0 8px #ffffff',
          }}
        />

        {/* Drag Thumb */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: `${progress * 100}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isDragging ? '8px' : '6px',
            height: isDragging ? '8px' : '6px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 0 10px #ffffff',
            cursor: 'grab',
            transition: isDragging ? 'none' : 'all 0.2s ease',
          }}
        />

        {/* Sector Tick Markers */}
        {SECTORS.map((s) => (
          <div
            key={s.name}
            style={{
              position: 'absolute',
              top: `${s.target * 100}%`,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '6px',
              height: '1px',
              background: Math.abs(progress - s.target) < 0.04 ? '#ffffff' : 'rgba(255, 255, 255, 0.2)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
