import React from 'react';
import { TransformationStage } from '../../hooks/useTransformationProgress';

export interface CharacterUIProps {
  progress: number;
  stageName: string;
  stageColor: string;
  isAutoPlaying: boolean;
  activeAngle: string;
  onProgressChange: (val: number) => void;
  onToggleAutoPlay: () => void;
  onSetStage: (stage: TransformationStage) => void;
  onSelectAngle: (deg: number) => void;
  onResetRotation: () => void;
  isCompact?: boolean;
}

const PRESET_ANGLES = [
  { name: 'FRONT', deg: 0 },
  { name: '45°', deg: 45 },
  { name: 'SIDE', deg: 90 },
  { name: 'BACK', deg: 180 },
];

export function CharacterUI({
  progress,
  stageName,
  stageColor,
  isAutoPlaying,
  activeAngle,
  onProgressChange,
  onToggleAutoPlay,
  onSetStage,
  onSelectAngle,
  onResetRotation,
  isCompact = false,
}: CharacterUIProps) {
  return (
    <div
      className="character-ui-hud"
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        background: 'rgba(7, 11, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '20px',
        padding: isCompact ? '10px 18px' : '14px 28px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.75)',
        userSelect: 'none',
        maxWidth: '92vw',
      }}
    >
      {/* Top Status & 360 Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: stageColor,
              boxShadow: `0 0 10px ${stageColor}`,
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '1px',
              color: stageColor,
            }}
          >
            {stageName}
          </span>
          <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>
            ({Math.round(progress * 100)}%)
          </span>
        </div>

        {/* 360 Angle Tracking & Quick Orbit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              letterSpacing: '1px',
              color: '#94a3b8',
            }}
          >
            ANGLE: <strong style={{ color: '#ffffff' }}>{activeAngle}</strong>
          </span>
          {PRESET_ANGLES.map((p) => (
            <button
              key={p.name}
              onClick={() => onSelectAngle(p.deg)}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '3px 8px',
                color: '#cbd5e1',
                fontSize: '9px',
                fontFamily: 'monospace',
                cursor: 'pointer',
              }}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={onResetRotation}
            title="Reset 360 Rotation"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '3px 6px',
              color: '#ff8a30',
              fontSize: '9px',
              fontFamily: 'monospace',
              cursor: 'pointer',
            }}
          >
            ↺
          </button>
        </div>
      </div>

      {/* Main Interactive Transformation Slider */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
        }}
      >
        <span
          style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            color: '#94a3b8',
            whiteSpace: 'nowrap',
          }}
        >
          REAL ME
        </span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => onProgressChange(parseFloat(e.target.value))}
          style={{
            flex: 1,
            height: '6px',
            borderRadius: '999px',
            accentColor: stageColor,
            cursor: 'ew-resize',
          }}
        />

        <span
          style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            color: '#00f0ff',
            whiteSpace: 'nowrap',
          }}
        >
          FULL NEON
        </span>

        {/* Auto Morph Toggle */}
        <button
          onClick={onToggleAutoPlay}
          style={{
            background: isAutoPlaying ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
            border: `1px solid ${isAutoPlaying ? '#00f0ff' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '999px',
            padding: '5px 12px',
            color: isAutoPlaying ? '#00f0ff' : '#94a3b8',
            fontSize: '10px',
            fontFamily: 'monospace',
            cursor: 'pointer',
            letterSpacing: '0.8px',
            whiteSpace: 'nowrap',
          }}
        >
          {isAutoPlaying ? '⏸ PAUSE MORPH' : '▶ AUTO MORPH'}
        </button>
      </div>

      {/* Step Buttons */}
      <div style={{ display: 'flex', gap: '8px', width: '100%', justifyContent: 'center' }}>
        {[
          { key: 'real' as TransformationStage, label: '1. REAL ME (0%)' },
          { key: 'transition' as TransformationStage, label: '2. TRANSITION (30%)' },
          { key: 'stylized' as TransformationStage, label: '3. STYLIZED 3D (60%)' },
          { key: 'neon' as TransformationStage, label: '4. FULL NEON (100%)' },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => onSetStage(s.key)}
            style={{
              flex: 1,
              padding: '5px 8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94a3b8',
              fontSize: '9.5px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
