import React, { useRef, useState } from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { soundEngine } from '../../utils/audio';

const SECTORS = [
  { name: 'ENTRY', target: 0.0 },
  { name: '3D OFFICE', target: 0.16 },
  { name: 'REAL AHMED', target: 0.27 },
  { name: 'NEON MORPH', target: 0.32 },
  { name: '360° ORBIT', target: 0.45 },
  { name: 'ABOUT ME', target: 0.62 },
  { name: 'SKILLS LAB', target: 0.68 },
  { name: 'PROJECT LAB', target: 0.74 },
  { name: 'TIMELINE', target: 0.81 },
  { name: 'HONORS', target: 0.86 },
  { name: 'CONTACT', target: 0.91 },
  { name: 'LIVE PORTAL', target: 1.0 },
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
    <div className="hud-scroll-track">
      {/* Current Sector Badge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '2px',
        }}
      >
        <span
          style={{
            fontSize: '9px',
            fontFamily: 'monospace',
            letterSpacing: '1.5px',
            color: '#64748b',
          }}
        >
          SECTOR
        </span>
        <span
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            fontWeight: 800,
            letterSpacing: '1.5px',
            color: '#ff8a30',
            textShadow: '0 0 12px rgba(255, 138, 48, 0.4)',
          }}
        >
          {currentSector.name}
        </span>
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#38bdf8',
          }}
        >
          {Math.round(progress * 100)}%
        </span>
      </div>

      {/* Vertical Interactive Track */}
      <div
        ref={trackRef}
        onClick={handleTrackClick}
        style={{
          width: '6px',
          height: '240px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          position: 'relative',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
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
            background: 'linear-gradient(to bottom, #ff8a30, #67c9ff)',
            borderRadius: '999px',
            boxShadow: '0 0 10px #ff8a30',
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
            width: isDragging ? '16px' : '14px',
            height: isDragging ? '16px' : '14px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '2px solid #ff8a30',
            boxShadow: '0 0 14px #ff8a30',
            cursor: 'grab',
            transition: isDragging ? 'none' : 'transform 0.1s ease',
          }}
        />

        {/* Sector Tick Markers */}
        {SECTORS.map((s) => (
          <div
            key={s.name}
            style={{
              position: 'absolute',
              top: `${s.target * 100}%`,
              right: '-6px',
              width: '4px',
              height: '2px',
              background: Math.abs(progress - s.target) < 0.04 ? '#ff8a30' : 'rgba(255, 255, 255, 0.25)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
