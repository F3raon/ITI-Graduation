import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

export function Effects() {
  return (
    <EffectComposer>
      <Bloom 
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
        eskil={false}
        offset={0.1}
        darkness={1.1}
      />
    </EffectComposer>
  );
}
