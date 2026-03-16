import {
  ShaderMount,
  grainGradientFragmentShader,
  getShaderColorFromString,
  getShaderNoiseTexture,
  GrainGradientShapes,
  ShaderFitOptions,
} from '@paper-design/shaders';

const COLOR_STRINGS  = ['#000000', '#0000FF', '#AAC9FF'];
const MAX_COLORS     = 7;

export function initGrainShader(container: HTMLElement) {
  const colors = COLOR_STRINGS.map(c => getShaderColorFromString(c));
  while (colors.length < MAX_COLORS) colors.push([0, 0, 0, 0]);

  const uniforms = {
    // Sizing (required by the vertex shader)
    u_fit:        ShaderFitOptions.contain,
    u_originX:    0.5,
    u_originY:    0.5,
    u_worldWidth: 0,
    u_worldHeight: 0,
    // Shader params (matched from the Paper design)
    u_colorBack:   getShaderColorFromString('#00000000'),
    u_colors:      colors,
    u_colorsCount: COLOR_STRINGS.length,
    u_softness:    0.71,
    u_intensity:   0.53,
    u_noise:       0.24,
    u_shape:       GrainGradientShapes.wave,
    u_scale:       1.75,
    u_rotation:    0,
    u_offsetX:     -1,
    u_offsetY:     0.14,
    u_noiseTexture: getShaderNoiseTexture(),
  };

  function mount() {
    new ShaderMount(container, grainGradientFragmentShader, uniforms, null, 0.76, 589890.566);
  }

  const tex = uniforms.u_noiseTexture;
  if (tex && (!tex.complete || tex.naturalWidth === 0)) {
    tex.onload = mount;
  } else {
    mount();
  }
}
