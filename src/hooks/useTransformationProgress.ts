import { useState, useCallback, useEffect } from 'react';

export type TransformationStage = 'real' | 'transition' | 'stylized' | 'cyber' | 'neon';

export interface TransformationState {
  progress: number; // 0.0 to 1.0
  stage: TransformationStage;
  stageName: string;
  stageColor: string;
  isAutoPlaying: boolean;
  setProgress: (val: number) => void;
  toggleAutoPlay: () => void;
  setStage: (stage: TransformationStage) => void;
}

export function getStageFromProgress(val: number): {
  stage: TransformationStage;
  stageName: string;
  stageColor: string;
} {
  if (val < 0.2) {
    return { stage: 'real', stageName: 'REAL AHMED', stageColor: '#94a3b8' };
  } else if (val < 0.45) {
    return { stage: 'transition', stageName: 'ENERGY TRANSITION', stageColor: '#ff8a30' };
  } else if (val < 0.7) {
    return { stage: 'stylized', stageName: 'STYLIZED 3D MODEL', stageColor: '#38bdf8' };
  } else if (val < 0.9) {
    return { stage: 'cyber', stageName: 'CYBER LIGHTNING', stageColor: '#a855f7' };
  } else {
    return { stage: 'neon', stageName: 'FULL NEON AHMED', stageColor: '#67c9ff' };
  }
}

export function useTransformationProgress(initialProgress = 0.5): TransformationState {
  const [progress, setProgressState] = useState(initialProgress);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  const setProgress = useCallback((val: number) => {
    setProgressState(Math.max(0, Math.min(1, val)));
  }, []);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  const setStage = useCallback(
    (stage: TransformationStage) => {
      switch (stage) {
        case 'real':
          setProgress(0.0);
          break;
        case 'transition':
          setProgress(0.3);
          break;
        case 'stylized':
          setProgress(0.55);
          break;
        case 'cyber':
          setProgress(0.8);
          break;
        case 'neon':
          setProgress(1.0);
          break;
      }
    },
    [setProgress]
  );

  useEffect(() => {
    if (!isAutoPlaying) return;
    let direction = 1;
    const interval = window.setInterval(() => {
      setProgressState((prev) => {
        let next = prev + direction * 0.015;
        if (next >= 1.0) {
          next = 1.0;
          direction = -1;
        } else if (next <= 0.0) {
          next = 0.0;
          direction = 1;
        }
        return next;
      });
    }, 32);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const { stage, stageName, stageColor } = getStageFromProgress(progress);

  return {
    progress,
    stage,
    stageName,
    stageColor,
    isAutoPlaying,
    setProgress,
    toggleAutoPlay,
    setStage,
  };
}
