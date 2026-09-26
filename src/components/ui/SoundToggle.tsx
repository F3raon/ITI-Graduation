import { useState } from 'react';
import { soundEngine } from '../../utils/audio';

export function SoundToggle() {
  const [isPlaying, setIsPlaying] = useState(!soundEngine.getMuted());

  const handleToggle = () => {
    const active = soundEngine.toggleMute();
    setIsPlaying(active);
  };

  return (
    <div className="fixed bottom-[14px] left-[14px] md:bottom-[24px] md:left-[24px] z-[9999] flex items-center gap-[12px] scale-[0.75] md:scale-100 origin-bottom-left">
      <button
        onClick={handleToggle}
        onMouseEnter={() => soundEngine.playHover()}
        aria-label="Toggle ambient sound"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 18px',
          borderRadius: '9999px',
          background: 'rgba(7, 11, 18, 0.75)',
          backdropFilter: 'blur(12px)',
          border: `1px solid ${isPlaying ? '#ff8a30' : 'rgba(255, 255, 255, 0.12)'}`,
          color: isPlaying ? '#ff8a30' : '#94a3b8',
          fontSize: '11px',
          fontFamily: 'monospace',
          letterSpacing: '1.5px',
          cursor: 'pointer',
          outline: 'none',
          transition: 'all 0.3s ease',
          boxShadow: isPlaying ? '0 0 20px rgba(255, 138, 48, 0.25)' : 'none',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: isPlaying ? '#ff8a30' : '#64748b',
            boxShadow: isPlaying ? '0 0 8px #ff8a30' : 'none',
          }}
        />
        <span>{isPlaying ? 'AUDIO: SYNTHESIS ON' : 'AUDIO: MUTED'}</span>
      </button>
    </div>
  );
}
