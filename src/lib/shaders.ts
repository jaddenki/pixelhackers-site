export const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = /* glsl */`
  precision highp float;

  uniform sampler2D uTexture;
  uniform float     uProgress;
  uniform float     uTime;
  uniform vec2      uResolution;
  uniform float     uMaxBlockSize;
  uniform float     uMinBlockSize;
  uniform float     uSweepSpeed;
  uniform float     uSweepSpread;
  uniform float     uSweepOffset;
  uniform float     uJitterAmount;
  uniform float     uJitterBase;
  uniform float     uJitterFPS;

  varying vec2 vUv;

  // Simple 2D hash for per-block randomness
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  vec2 hash2(vec2 p) {
    return vec2(
      fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123),
      fract(sin(dot(p, vec2(269.5, 183.3))) * 43758.5453123)
    );
  }

  void main() {
    vec2 uv        = vUv;
    vec2 fragCoord = uv * uResolution;

    // Left-to-right sweep: each pixel gets a local progress value based on x position
    float wave          = uProgress * uSweepSpeed - uv.x * uSweepSpread - uSweepOffset;
    float localProgress = clamp(wave, 0.0, 1.0);
    localProgress = localProgress * localProgress * (3.0 - 2.0 * localProgress); // smoothstep

    // Block size shrinks from maxBlockSize → minBlockSize as the sweep passes through
    float blockPx = mix(uMaxBlockSize, uMinBlockSize, localProgress * localProgress);
    blockPx = max(floor(blockPx + 0.5), 1.0);

    // Snap this pixel to the center of its block (creates the mosaic look)
    vec2 block   = floor(fragCoord / blockPx) * blockPx;
    vec2 blockUV = (block + blockPx * 0.5) / uResolution;

    // Per-block noise determines when each block flips on within the sweep window
    float noise   = hash(block / uMaxBlockSize);
    // + 0.001 epsilon prevents blocks whose hash ≈ 0 from firing at frame 0
    float visible = step(noise + 0.001, localProgress);

    // Jitter: random UV offset that fades out as each block resolves
    float jitterAmt = uJitterAmount * (1.0 - localProgress * localProgress) + uJitterBase;
    float timeSeed  = floor(uTime * uJitterFPS);
    vec2  jitter    = (hash2(block + timeSeed) - 0.5) * jitterAmt;

    vec2 sampleUV = clamp(blockUV + jitter, 0.0, 1.0);
    vec4 texColor = texture2D(uTexture, sampleUV);

    // Hard luminance threshold — source canvas is black text on white
    float lum    = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    float isText = 1.0 - step(0.5, lum);

    // Output white text on transparent so it composites over the gradient
    gl_FragColor = vec4(1.0, 1.0, 1.0, visible * isText);
  }
`;
