import { useState, useCallback } from 'react';

export type CameraMode = 'cinematic-world' | 'character-inspect' | 'portrait-transform';

export function useCharacterCamera() {
  const [cameraMode, setCameraMode] = useState<CameraMode>('cinematic-world');

  const focusCharacter = useCallback(() => {
    setCameraMode('character-inspect');
  }, []);

  const focusTransformation = useCallback(() => {
    setCameraMode('portrait-transform');
  }, []);

  const resumeWorld = useCallback(() => {
    setCameraMode('cinematic-world');
  }, []);

  return {
    cameraMode,
    focusCharacter,
    focusTransformation,
    resumeWorld,
    isCharacterMode: cameraMode !== 'cinematic-world',
  };
}
