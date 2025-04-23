// Minimal Chromatic Aberration Pass for Three.js EffectComposer
// Based on https://github.com/vanruesc/postprocessing/blob/main/source/effects/ChromaticAberrationEffect.js
import {
  ShaderPass
} from 'three/examples/jsm/postprocessing/ShaderPass';
import { Vector2 } from 'three';

const ChromaticAberrationShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'offset': { value: new Vector2(0.001, 0.001) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 offset;
    varying vec2 vUv;
    void main() {
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `
};

export class ChromaticAberrationPass extends ShaderPass {
  constructor(offset = new Vector2(0.001, 0.001)) {
    super(ChromaticAberrationShader);
    this.uniforms['offset'].value = offset;
  }
}
