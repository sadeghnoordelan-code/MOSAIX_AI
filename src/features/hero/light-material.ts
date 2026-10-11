export type LightFrame = Readonly<{
  x: number;
  y: number;
  strength: number;
  tilt: number;
  time: number;
}>;

const vertexSource = `
attribute vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }
`;

// CSS coordinates use a top-left origin. Only this shader converts GL's origin.
// A translucent material is composited over the native video, never a video texture.
const fragmentSource = `
precision highp float;
uniform vec2 uResolution;
uniform vec2 uSize;
uniform vec2 uLight;
uniform float uStrength;
uniform float uTilt;
uniform float uTime;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), f.x), f.y);
}
float surface(vec2 p) {
  return noise(p) * 0.62 + noise(p * 2.07 + 7.3) * 0.26
       + noise(p * 4.13 + 19.1) * 0.12;
}
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 point = vec2(uv.x, 1.0 - uv.y) * uSize;
  float radius = min(uSize.x * 0.43, min(uSize.y * 0.37, 360.0));
  vec2 offset = (point - uLight) / max(radius, 1.0);
  float angle = -0.24 + uTilt;
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  vec2 q = rotation * offset;
  q /= vec2(1.18, 0.86);

  // Low-frequency roughness gently deforms an oblique beam's penumbra.
  // It never makes a hard clip or a cursor-sized disc.
  float grainField = surface(point * 0.006 + vec2(uTime * 0.007, -uTime * 0.004));
  float roughness = surface(q * 2.1 + vec2(13.2, uTime * 0.008));
  q *= 1.0 + (roughness - 0.5) * 0.19;
  q += vec2(sin(q.y * 2.4), sin(q.x * 1.9)) * 0.025;
  float r2 = dot(q, q);
  float core = exp(-r2 * 11.5);
  float body = exp(-r2 * 2.0);
  float spill = exp(-r2 * 0.58);
  float exposure = 5.2 * core + 3.15 * body;
  float transmission = (1.0 - exp(-exposure)) * uStrength;
  transmission *= 1.0 - smoothstep(1.65, 2.6, sqrt(r2));

  vec3 material = mix(vec3(0.012, 0.019, 0.031), vec3(0.021, 0.029, 0.046), grainField);
  float blueSheen = exp(-pow(q.x * 0.68 + q.y * 1.12 - 0.25, 2.0) * 20.0);
  float scattering = max(spill - body, 0.0);
  material += vec3(0.028, 0.042, 0.068) * scattering * uStrength;
  material += vec3(0.035, 0.047, 0.067) * blueSheen * body * uStrength * 0.45;
  // Static subpixel grain prevents flat, banded chromatic blacks.
  material += (hash(floor(point)) - 0.5) * 0.0023;
  float alpha = 1.0 - min(transmission, 0.975);
  gl_FragColor = vec4(material * alpha, alpha);
}
`;

export interface LightMaterial {
  resize(width: number, height: number, pixelRatio: number): void;
  draw(frame: LightFrame): void;
  dispose(): void;
}

export function createLightMaterial(canvas: HTMLCanvasElement): LightMaterial {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  });
  if (!gl) throw new Error('Light rendering unavailable');

  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const dispose = () => {
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
  };
  try {
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Light shader unavailable');
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Light shader compilation failed');
    }
    program = gl.createProgram();
    if (!program) throw new Error('Light program unavailable');
    shaders.forEach((shader) => gl.attachShader(program!, shader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Light program link failed');
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error('Light geometry unavailable');
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => gl.getUniformLocation(program!, name);
    const uniforms = {
      resolution: uniform('uResolution'), size: uniform('uSize'), light: uniform('uLight'),
      strength: uniform('uStrength'), tilt: uniform('uTilt'), time: uniform('uTime'),
    };
    return {
      resize(width, height, pixelRatio) {
        // Keep the same shader/composition while bounding the fill rate on high-DPI panels.
        const maximumRatio=window.matchMedia('(pointer: coarse)').matches?1.25:1.75;
        const ratio = Math.min(pixelRatio, maximumRatio, Math.sqrt(2_400_000 / Math.max(1, width * height)));
        canvas.width = Math.max(1, Math.round(width * ratio));
        canvas.height = Math.max(1, Math.round(height * ratio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
        gl.uniform2f(uniforms.size, width, height);
      },
      draw(frame) {
        gl.uniform2f(uniforms.light, frame.x, frame.y);
        gl.uniform1f(uniforms.strength, frame.strength);
        gl.uniform1f(uniforms.tilt, frame.tilt);
        gl.uniform1f(uniforms.time, frame.time);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
