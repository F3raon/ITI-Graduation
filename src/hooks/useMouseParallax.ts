import { useState, useEffect, useRef } from 'react';

export interface MouseParallaxState {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1
  normalizedY: number; // -1 to 1
}

export function useMouseParallax(intensity = 1.0): MouseParallaxState {
  const [pos, setPos] = useState<MouseParallaxState>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      target.current = { x: nx * intensity, y: ny * intensity };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId: number;
    const step = () => {
      setPos((prev) => {
        const nx = prev.normalizedX + (target.current.x - prev.normalizedX) * 0.08;
        const ny = prev.normalizedY + (target.current.y - prev.normalizedY) * 0.08;
        return {
          x: nx * 50,
          y: ny * 50,
          normalizedX: nx,
          normalizedY: ny,
        };
      });
      animId = requestAnimationFrame(step);
    };
    animId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [intensity]);

  return pos;
}
