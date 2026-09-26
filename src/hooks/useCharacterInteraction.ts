import { useRef, useCallback, useEffect, useState } from 'react';
import * as THREE from 'three';

export interface CharacterInteractionState {
  rotationY: number;
  rotationX: number;
  zoom: number;
  isDragging: boolean;
  activeAngle: string;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: () => void;
  setPresetAngle: (angleDeg: number) => void;
  resetView: () => void;
}

const ANGLES = [
  { name: 'FRONT', deg: 0 },
  { name: 'FRONT LEFT', deg: 45 },
  { name: 'LEFT', deg: 90 },
  { name: 'BACK LEFT', deg: 135 },
  { name: 'BACK', deg: 180 },
  { name: 'BACK RIGHT', deg: 225 },
  { name: 'RIGHT', deg: 270 },
  { name: 'FRONT RIGHT', deg: 315 },
];

export function useCharacterInteraction(): CharacterInteractionState {
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    lastPointer.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      velocity.current = { x: dx * 0.006, y: dy * 0.003 };

      setRotationY((prev) => prev + dx * 0.008);
      setRotationX((prev) => Math.max(-0.4, Math.min(0.4, prev + dy * 0.004)));
    },
    [isDragging]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Inertia damping when pointer released
  useEffect(() => {
    if (isDragging) return;
    let animId: number;
    const step = () => {
      if (Math.abs(velocity.current.x) > 0.0001 || Math.abs(velocity.current.y) > 0.0001) {
        setRotationY((prev) => prev + velocity.current.x);
        setRotationX((prev) => Math.max(-0.4, Math.min(0.4, prev + velocity.current.y)));
        velocity.current.x *= 0.92;
        velocity.current.y *= 0.92;
        animId = requestAnimationFrame(step);
      }
    };
    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isDragging]);

  // Wheel zoom listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Check if target is inside character viewport or active
      const target = e.target as HTMLElement | null;
      if (target?.closest?.('.character-360-container')) {
        e.preventDefault();
        setZoom((prev) => Math.max(0.7, Math.min(1.5, prev - e.deltaY * 0.001)));
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const setPresetAngle = useCallback((angleDeg: number) => {
    const rad = THREE.MathUtils.degToRad(angleDeg);
    setRotationY(rad);
    setRotationX(0);
    velocity.current = { x: 0, y: 0 };
  }, []);

  const resetView = useCallback(() => {
    setRotationY(0);
    setRotationX(0);
    setZoom(1);
    velocity.current = { x: 0, y: 0 };
  }, []);

  // Determine current closest named angle
  const normalizedDeg = ((THREE.MathUtils.radToDeg(rotationY) % 360) + 360) % 360;
  const closest = ANGLES.reduce((prev, curr) => {
    const diffCurr = Math.min(Math.abs(curr.deg - normalizedDeg), 360 - Math.abs(curr.deg - normalizedDeg));
    const diffPrev = Math.min(Math.abs(prev.deg - normalizedDeg), 360 - Math.abs(prev.deg - normalizedDeg));
    return diffCurr < diffPrev ? curr : prev;
  });

  return {
    rotationY,
    rotationX,
    zoom,
    isDragging,
    activeAngle: closest.name,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    setPresetAngle,
    resetView,
  };
}
