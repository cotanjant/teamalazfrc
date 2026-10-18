'use client';

import { useEffect, useRef } from 'react';

// 68 lines x 100 columns from C:\Users\Efe\Desktop\art.txt
const ART_LINES: readonly string[] = [
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@+%@*=*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-:%@#@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@%@@*:#*+*%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+::*+*@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@*@*--#++*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+:.:==%@%*@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@#-*=::=++*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+:.::.*%*.*@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@*@@-.-=::-+=+%@@%*+#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@@@@@=..=..-*:.*@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@*=%:..-:::===*@#+==*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@**%@@%:..:..:=..*@+#@@%@@@@@@@",
  "@@@@@@@@@@@@@@%:#=:::::.:=:-*==:-**@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:=#%=..-...=:..**:=@*@@@@@@@",
  "@@@@@@@@@@@@@@:-=:::-::.:::*=:::=:#*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=..:=..-...=:..:#::%*@@@@@@@",
  "@@@@@@@@@@@*@=::-=::::..:.:-.::=:#+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:..::.::..=:...*::===@@@@@@",
  "@@@@@@@@@@@-+:::-.=.:::.-.:..:-.=-@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+%=..:-.:::.=:.:.=::-=:%*@@@@",
  "@@@@@@@@@@%-+::.=:--::.:-.:.-:-::%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*=+:.::.:::::::.:=::--:#+@@@@",
  "@@@@@@@@@@*:+:.:=:-#-::=-.:.=::.+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=--::-.-:-:.::.:=::=::=*@@@@",
  "@@@@@@@@@*-:%::.=--+-:=-::..==:.%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#-:=:-.---.:--:--:-=::=#@@@@",
  "@@@@@@@@#--:*=:::-%==-:=:*:.-*::@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%::=::--=:.-=:.=::==:--%@@@@",
  "@@@@@@=%=::.:#:::*%%+**+=#---*=:%@@@@@@@@@@@@*@@@@@@@@@@@@@@@@@@@@@@@@@@%==--:*==.::=:--::=::-:@@*@@",
  "@@@@@@==%-.-.=#:-:#@#=:*--#.=+::%@%@@@@@@@@*=-*%@@@@@@@@@@@@@@@@@@@@@@@@#:%-=**+-..====-==-:--+@@=@@",
  "@@@@@@-.==.:::=+-:-*@=::#-%.=*..=%@@@@@@@@@=:--%@@@@@@@@@@@@@@@@@@@@@@@%..#=.**==:-#=====-::--%@+=@@",
  "@@@@@@*::--.:::===-:#%=.=-=**%:::=#@@@@@@@@#=:=*%%@%%%@+@@@@@@@@@@@@@@#:::==+%:=:-*%*===:::--+#*.#%%",
  "@@@**%*:.:=:.-::--*%.:#=:#==@@=:-:-*@@@@@@@#*-::+*=**+==#@@@@@@@@@**#=.::.==+.:==*+.*=+---::===::%%%",
  "@@@%:=*-=.:=:..::-%@+.-*****+##%+:.:+=@@@@@@==--:::==-+-+@@@@@@@%:=*:-+==:==:.-*=..:#===-::++-.:=+=%",
  "@@@%:::*--..==:..==%.:+==#@%=*-*+=-::-:@@@@@#*=:::.:...::#@@@@@@*:...:.*+.--:*#:....#+=-:===:.:=*:*%",
  "@@@@%-::-==...::::%=:+**+=*:*%==*=#-=.:%@@@%*+==:.....:-:+@@@@@@=::-=--**.=*#%=:.:-%@%===+=::-==--*%",
  "@@@@%#=:::-=::-::-%*.:-+#*@*::=*::::::+%@@@+:==-::::---*#=.*@@@@----::+::=*--*=-=+:.#*=*=:-:==-=:+@#",
  "@@@@@**+-::---::=.:=*=*++#%::==-:-=-=..%@@@#**====-:=*@@@@%*@@@@-:----:.:+==-===:.:#%==:---=---:=-:#",
  "@@@@@@#==-:...:=+*:.:-=*#%=::-=::--=:.:@@@@*+**===:::#@@@@@@@@@@=::-::::=*=:=:=-:=*=::==-==-----:.*%",
  "@@@@@@@#:..:==:.:+#+:::-=*%*==-:::--:::@@@@@@@***==::::=*%@@@@@@+:--:--=##:=*===:.::+%+=-=--==:..*%@",
  "@@@@@@@@%*::..::---.:::::=**=:---=:=::=@@@@@@@@@*:-::::.-:+@@@@@=::-:+-::-:-*+===*#*#*+++==-:::+*@@@",
  "@@@@@@@*===....::-=#%+...+#%*:-:*::..-:@@@@@@@@@--.. .::.-:-@@@@:-:-=-:*#%:*+:::...=%+-:.:=*==*%@@@@",
  "@@@@@@@+==*+-::...:=*#..:-=:..*===::..:-%@@@@@%*: :. :.. ::-@@=::-:=***=*+=*%%*=:#@@%**+==+****%@@@@",
  "@@@@@@@@*-:-==**+=:-+*#**=*%*======:=::::=++===. ::.  ...=::-:.:==:=++++#**=====#*+*==++**#*+==#@@@@",
  "@@@@@@@@@@@#*=-::::-=%%*=.:*=:::=%#=:+=::-:--:...:...... =--::.:--==:#*=..#%#==#*::::::--=--=*%@@@@@",
  "@@@@@@@@@@@@@@%##***=::..::--:...:#*+--=:-:=-=-=..:...::+:==-:-++-+=%+=:-=*@*-::::-==++***%@@@@@@@@@",
  "@@@@@@@@@@@%*+===-:.:::=-::.:%%%%::::*%%=%+%*%===+:=:::::+%***==%**%==%***===**+++====+++**#%@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@#*=:...:-=*=+*@@:-*.+:#+==*%--#-:-=-*-%=**%+#.*::%%%#*=+-:-:*%@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@%*-:-+===-.:=+*@%@@%%@:%=##@@%:#=-:*=+*@=#:#.%*+@@@@##==+=*+=+**%@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@%%%%%*+=::-=--=+:===**-=@@@@@%-@*:+:++=#=*####+@%%+*+===*=:---=#*#%@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@%%*+=-=++:.:-=::==**::==:=#:-:@%+%==*=%.+=*===*=+===-==::====-:=#@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@%#+-:::---::-:=#=::%=-+:--*:%++=#=+*=:#:==:+==-==-==-:.:=+###%%@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@#***#%%#+-=-:*%=:-%@::#-**%.%:*-=++=+**--=-%*=::+::===*+===+%@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@%%@*=*@*-:+%%:-@:#%+.::#*#:::*%#:-:=:%@#+.:#=:#%#*@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#=-:.:#%%%#*==.==+%-:+:%%*#*@@@+::-::*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%@@@*==-*=::@@%:.:--:.--@-+-*::=%%:.=...:+@%*@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@=--===*%@==:=+@%#*-:::-==:..::%-=-:..-==#@:...+@#*:=**=#@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@-::-----:.%%=::::-==::::=-:.-.=-:*-.-:..:-:....=*::.:..::-@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@%:--==*%%=-:=@%==:.::::=-=-..:=.-::.=-:::...:.:=:*:::=*#=::.@%@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@*=*-==%%#-:-@@@@%+=--:=--:..-:=:*=::.:===::::=-*%#:.:::.+-::*%@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@%**-=+=:=*%@#=+=++::-:.....=--=:-=::...::.::*%%%@%@%@@:-:=-:=@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@+=-=:::*=*+..:---:.....:==@=:=:.-=:.=..:.......==+-%::-=:=#@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@%*==-...:::--........::=-@-::--::*:=..--.::--=:==+=:.---%@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@#*::::..:::..::...:-=+#-:.:=.=:::*#-=:...:.::----:::-*@@@@%@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@#-:..:--=--==-::--==+#=::::-==--:-:+@##-:::::-:-==-====--+#@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@%*=+#*++=::-===#@@*:-::-=%:=:--.-:-%@@%*-::.-=**+=-%@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@%%%@**+::*+%=:::=---::==#-+=*=:--===#*::*+==:-=+*%**@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@%@*:-@*@%:==--++-===*=**==:%:=-+-#::##=%@@:::**%*%@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*::@@@%:=--*=*:*=*++==:::.#:+==*=::%::@@%-==*@%%@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*:=:@@:=.==%+*-**=+-==::=:-%*+==%@:-.:-@@=--#@*@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-:-=**#:*+%@#=*%-++*:#%=:==+=-=%=--**=@====#%*@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#=::--==+*@%%+*+-++*:#@@%:===+*@%=-:-:--:-#@#@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#+==+*%@@@%*******=-:+=:-=-=++++:::::.-##+@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%##**++*=--::---+@@@@+:::=#%@@%@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%***++=-::=::#@%#%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#*====*:*@@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
  "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
];

const ROWS = ART_LINES.length; // 68
const COLS = ART_LINES[0].length; // 100

// Vertex shader
const VS = `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

// Phoenix field shader: transforms art.txt mask with slow-motion flame dynamics & identical Oklab color ramp
const FS_FIELD = `#version 300 es
precision highp float;
uniform sampler2D uMask;
uniform float uTime;
uniform vec3 uRamp[8];
uniform int uCount;
in vec2 vUv;
layout(location = 0) out vec4 outColor;
layout(location = 1) out vec4 outAux;

vec3 labToRgb(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  );
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}

vec4 tone(float t) {
  float x = smoothstep(0.12, 1.0, t) * float(uCount - 1);
  int index = int(floor(x));
  return vec4(mix(uRamp[index], uRamp[min(index + 1, uCount - 1)], fract(x)), smoothstep(0.0, 0.18, t));
}

void main() {
  // Flip Y coordinate because WebGL texture V coordinates are inverted relative to DOM canvas
  vec2 baseUv = vec2(vUv.x, 1.0 - vUv.y);

  // Subtle liquid-heat wave displacement across space ("sanki dalgalaniyor gibi")
  vec2 waveDisp = vec2(
    sin(baseUv.y * 18.0 - uTime * 1.8 + baseUv.x * 8.0) * 0.003,
    cos(baseUv.x * 14.0 + uTime * 1.5 + baseUv.y * 6.0) * 0.002
  );
  vec2 uv = clamp(baseUv + waveDisp, 0.0, 1.0);

  float raw = texture(uMask, uv).r;
  
  if (raw <= 0.001) {
    outColor = vec4(0.0);
    outAux = vec4(0.0);
    return;
  }

  // Harmonic vertical undulating flame waves traveling up the wings
  float wave1 = sin(uv.y * 16.0 - uTime * 2.0 + cos(uv.x * 11.0 + uTime * 1.3) * 1.4);
  float wave2 = cos(uv.y * 25.0 - uTime * 2.7 + sin(uv.x * 16.0 - uTime * 1.0) * 1.1);
  float flameWave = (wave1 * 0.65 + wave2 * 0.35) * 0.18;

  // Modulate energy with fluid flame transition
  float energy = clamp(raw + flameWave, 0.12, 1.0);

  // Dynamic corona color sweep across the 8-stop Oklab ramp (deep flame orange to incandescent gold)
  float coronaTone = smoothstep(0.12, 0.96, energy * 0.88 + 0.14);
  vec4 mixed = tone(coronaTone);
  vec3 color = encode(labToRgb(mixed.rgb));
  
  // Radiant glow with living breath
  float alpha = smoothstep(0.04, 0.28, raw) * (0.85 + energy * 0.38);

  outColor = vec4(color * alpha, alpha);
  outAux = vec4(energy, 0.0, 0.0, 1.0);
}`;

// Gaussian blur shader for bloom/shine halo
const FS_BLUR = `#version 300 es
precision highp float;
uniform sampler2D uSource;
uniform vec2 uStep;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 sum = texture(uSource, vUv) * 0.2270270270;
  sum += texture(uSource, vUv + uStep * 1.3846153846) * 0.3162162162;
  sum += texture(uSource, vUv - uStep * 1.3846153846) * 0.3162162162;
  sum += texture(uSource, vUv + uStep * 3.2307692308) * 0.0702702703;
  sum += texture(uSource, vUv - uStep * 3.2307692308) * 0.0702702703;
  outColor = sum;
}`;

// Composite shader: blends the ASCII phoenix with its own radiant halo
const FS_COMPOSITE = `#version 300 es
precision highp float;
uniform sampler2D uField;
uniform sampler2D uHalo;
in vec2 vUv;
out vec4 outColor;
void main() {
  vec4 base = texture(uField, vUv);
  vec4 halo = texture(uHalo, vUv);
  
  // Identical additive shine & glow matching GradientASCII
  vec3 color = base.rgb + halo.rgb * 1.45;
  float alpha = clamp(base.a + halo.a * 0.8, 0.0, 1.0);
  
  outColor = vec4(color, alpha);
}`;

const toLinear = (value: number) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);

const toLab = ([r, g, b]: number[]): number[] => {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  ];
};

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
};

const link = (gl: WebGL2RenderingContext, vertexSrc: string, fragmentSrc: string) => {
  const vs = compile(gl, gl.VERTEX_SHADER, vertexSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSrc);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const info = gl.getActiveUniform(program, i);
    if (!info) continue;
    const name = info.name.replace(/\[0\]$/, '');
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, uniforms };
};

function charToNormalizedIntensity(ch: string): number {
  switch (ch) {
    case "@": return 0;
    case "%": return 0.42;
    case "#": return 0.54;
    case "*": return 0.65;
    case "+": return 0.76;
    case "=": return 0.84;
    case "-": return 0.90;
    case ":": return 0.95;
    case ".": return 0.98;
    case " ": return 1.0;
    default: return 0;
  }
}

export function AsciiPhoenixCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    // 1. Build art.txt ASCII Mask Texture with actual characters rendered at high DPI
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = 1200;
    maskCanvas.height = Math.round(1200 * (ROWS / COLS) * 1.55);
    const mCtx = maskCanvas.getContext('2d');
    if (mCtx) {
      mCtx.fillStyle = '#000000';
      mCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
      const cellW = maskCanvas.width / COLS;
      const cellH = maskCanvas.height / ROWS;
      const fontSize = Math.round(cellH * 1.05);
      mCtx.font = `800 ${fontSize}px "Geist Mono", ui-monospace, monospace`;
      mCtx.textAlign = 'center';
      mCtx.textBaseline = 'middle';

      for (let r = 0; r < ROWS; r++) {
        const line = ART_LINES[r];
        for (let c = 0; c < line.length; c++) {
          const ch = line[c];
          const intensity = charToNormalizedIntensity(ch);
          if (intensity <= 0) continue;
          if ((r <= 2 || r >= 65) && ch === '%') continue;

          // Discard any isolated stray character with no neighbors
          let neighbors = 0;
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              if (dr === 0 && dc === 0) continue;
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
                if (ART_LINES[nr][nc] !== '@') neighbors++;
              }
            }
          }
          if (neighbors < 2) continue;

          const byteVal = Math.round(intensity * 255);
          mCtx.fillStyle = `rgb(${byteVal}, ${byteVal}, ${byteVal})`;
          mCtx.fillText(ch === ' ' ? '.' : ch, (c + 0.5) * cellW, (r + 0.5) * cellH);
        }
      }
    }

    const maskTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, maskTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, gl.RED, gl.UNSIGNED_BYTE, maskCanvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 2. Build WebGL2 Shader Pipeline
    const fieldProg = link(gl, VS, FS_FIELD);
    const blurProg = link(gl, VS, FS_BLUR);
    const compProg = link(gl, VS, FS_COMPOSITE);
    if (!fieldProg || !blurProg || !compProg) return;

    // 3. Exact 8-Stop Oklab Color Ramp matching GradientASCII
    const COLORS = [
      [90 / 255, 15 / 255, 5 / 255],     // #5A0F05
      [143 / 255, 27 / 255, 10 / 255],   // #8F1B0A
      [201 / 255, 42 / 255, 10 / 255],   // #C92A0A
      [232 / 255, 58 / 255, 10 / 255],   // #E83A0A
      [255 / 255, 75 / 255, 11 / 255],   // #FF4B0B
      [255 / 255, 120 / 255, 0 / 255],   // #FF7800
      [255 / 255, 176 / 255, 0 / 255],   // #FFB000
      [255 / 255, 210 / 255, 28 / 255],  // #FFD21C
    ];
    const rampData = new Float32Array(COLORS.length * 3);
    COLORS.forEach((col, i) => rampData.set(toLab(col), i * 3));

    // 4. Framebuffers for Bloom & Shine Pass
    const createFbo = (w: number, h: number) => {
      const fb = gl.createFramebuffer();
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { fb, tex, w, h };
    };

    let fboField: ReturnType<typeof createFbo> | null = null;
    let fboHaloA: ReturnType<typeof createFbo> | null = null;
    let fboHaloB: ReturnType<typeof createFbo> | null = null;

    let rafId = 0;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) * 0.001;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        const downW = Math.max(1, Math.round(width * 0.5));
        const downH = Math.max(1, Math.round(height * 0.5));
        fboField = createFbo(width, height);
        fboHaloA = createFbo(downW, downH);
        fboHaloB = createFbo(downW, downH);
      }

      if (!fboField || !fboHaloA || !fboHaloB) {
        rafId = requestAnimationFrame(render);
        return;
      }

      // PASS 1: Render Phoenix field into fboField
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboField.fb);
      gl.viewport(0, 0, fboField.w, fboField.h);
      gl.useProgram(fieldProg.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, maskTexture);
      gl.uniform1i(fieldProg.uniforms.uMask, 0);
      gl.uniform1f(fieldProg.uniforms.uTime, elapsed);
      gl.uniform3fv(fieldProg.uniforms.uRamp, rampData);
      gl.uniform1i(fieldProg.uniforms.uCount, COLORS.length);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // PASS 2: Downsample and Gaussian Blur for Bloom & Shine Halo
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboHaloA.fb);
      gl.viewport(0, 0, fboHaloA.w, fboHaloA.h);
      gl.useProgram(blurProg.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fboField.tex);
      gl.uniform1i(blurProg.uniforms.uSource, 0);
      gl.uniform2f(blurProg.uniforms.uStep, 1.4 / fboHaloA.w, 0.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fboHaloB.fb);
      gl.bindTexture(gl.TEXTURE_2D, fboHaloA.tex);
      gl.uniform2f(blurProg.uniforms.uStep, 0.0, 1.4 / fboHaloA.h);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // PASS 3: Composite base + glowing shine halo onto canvas
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(compProg.program);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fboField.tex);
      gl.uniform1i(compProg.uniforms.uField, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, fboHaloB.tex);
      gl.uniform1i(compProg.uniforms.uHalo, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteTexture(maskTexture);
      if (fboField) {
        gl.deleteFramebuffer(fboField.fb);
        gl.deleteTexture(fboField.tex);
      }
      if (fboHaloA) {
        gl.deleteFramebuffer(fboHaloA.fb);
        gl.deleteTexture(fboHaloA.tex);
      }
      if (fboHaloB) {
        gl.deleteFramebuffer(fboHaloB.fb);
        gl.deleteTexture(fboHaloB.tex);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
    >
      <div
        className="relative flex items-center justify-center rounded-full overflow-hidden"
        style={{
          width: "min(33.75dvh, 44vw)",
          height: "min(33.75dvh, 44vw)",
          maskImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 75%, rgba(0,0,0,0) 98%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.95) 75%, rgba(0,0,0,0) 98%)",
        }}
      >
        <canvas ref={canvasRef} className="h-full w-full block" />
      </div>
    </div>
  );
}

export default AsciiPhoenixCore;
