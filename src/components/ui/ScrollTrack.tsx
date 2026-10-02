import React, { useRef, useState, useEffect } from 'react';
import { useScrollProgress } from '../../context/ScrollContext';
import { soundEngine } from '../../utils/audio';
import { SECTIONS, getSection } from '../../data/sections';

export function ScrollTrack() {
  const { progress, scrollTo } = useScrollProgress();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (window.location.search.includes('debug')) {
      setShowDebug(true);
    }
  }, []);

  const activeSection = getSection(progress);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateProgress(e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateProgress(e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updateProgress = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = clientY - rect.top;
    const percentage = Math.max(0, Math.min(1, clickY / rect.height));
    scrollTo(percentage);
  };

  return (
    <>
      {showDebug && (
        <div className="fixed top-4 left-4 z-[10000] bg-black/80 text-white p-4 font-mono text-xs border border-cyan-500/30">
          <div>Progress: {progress.toFixed(4)}</div>
          <div>Active: {activeSection.name}</div>
          <div>Range: [{activeSection.start.toFixed(2)}, {activeSection.end.toFixed(2)}]</div>
        </div>
      )}

      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] h-[240px] select-none scale-[0.75] md:scale-100 origin-right pr-[6px] md:pr-[24px]">
        {/* Interactive Track Area */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerEnter={() => soundEngine.playHover()}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          aria-valuetext={activeSection.name}
          style={{
            width: '24px', // Hit area is 24px wide
            height: '100%',
            position: 'relative',
            cursor: 'pointer',
            touchAction: 'none',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {/* Visual 2px line */}
          <div
            style={{
              width: '2px',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.1)',
              position: 'relative',
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
                transition: isDragging ? 'none' : 'all 0.2s ease',
              }}
            />

            {/* Sector Tick Markers */}
            {SECTIONS.map((s) => {
              const isActive = s.name === activeSection.name;
              return (
                <div
                  key={s.name}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    scrollTo(s.start);
                    soundEngine.playSelect();
                  }}
                  onPointerEnter={() => soundEngine.playHover()}
                  className="group"
                  style={{
                    position: 'absolute',
                    top: `${s.start * 100}%`,
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '24px', // generous hit area
                    height: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                  }}
                >
                  <div
                    style={{
                      width: '6px',
                      height: '1px',
                      background: isActive ? '#00f0ff' : 'rgba(255, 255, 255, 0.4)',
                      boxShadow: isActive ? '0 0 6px #00f0ff' : 'none',
                    }}
                  />
                  {/* Hover Label (Desktop) */}
                  <div className="absolute right-[100%] mr-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block pointer-events-none">
                    <span className="text-[9px] text-white/70 uppercase tracking-widest whitespace-nowrap bg-black/40 px-1.5 py-0.5 rounded border border-white/10">
                      {s.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Section Label - always visible, matching active section */}
          <div
            style={{
              position: 'absolute',
              top: `${progress * 100}%`,
              right: '20px', // Right aligned next to the track
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'sans-serif',
                fontWeight: 600,
                letterSpacing: '2px',
                color: '#ffffff',
                textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {activeSection.name}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
