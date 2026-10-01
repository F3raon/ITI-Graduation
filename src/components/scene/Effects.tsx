import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { neonStore } from '../../context/NeonContext';

function NeonBloom() {
  const bloomRef = useRef<any>(null);
  const vignetteRef = useRef<any>(null);

  useFrame(() => {
    const t = neonStore.current;
    if (bloomRef.current) {
      bloomRef.current.intensity = 1.2 + t * 2.0;
      bloomRef.current.luminanceThreshold = 0.8 - t * 0.25;
    }
    if (vignetteRef.current) {
      vignetteRef.current.darkness = 1.1 + t * 0.4;
    }
  });

  return (
    <EffectComposer>
      <Bloom 
        ref={bloomRef}
        luminanceThreshold={0.8}
        mipmapBlur
        intensity={1.2}
      />
      <Noise 
        premultiply
        blendFunction={BlendFunction.ADD}
        opacity={0.03}
      />
      <Vignette
        ref={vignetteRef}
        eskil={false}
        offset={0.1}
        darkness={1.1}
      />
    </EffectComposer>
  );
}

export function Effects() {
  return <NeonBloom />;
}
