// DaltoVisto — Matrices fisiológicas de simulación CVD y generador procedural de láminas Ishihara

export const CVD_MODES = {
  normal: {
    id: 'normal',
    name: 'Visión Tricromática (Normal)',
    short: 'Normal',
    cone: 'Conos L, M y S activos',
    description: 'Los tres tipos de conos (rojo, verde y azul) funcionan en equilibrio y distinguen el espectro completo.'
  },
  deuteranopia: {
    id: 'deuteranopia',
    name: 'Deuteranopía (Sin conos verdes M)',
    short: 'Deuteranopía',
    cone: 'Déficit en conos M (verde)',
    description: 'Es el tipo más frecuente. Los tonos verdes y rojos se confunden entre sí y tienden hacia amarillos y marrones.'
  },
  protanopia: {
    id: 'protanopia',
    name: 'Protanopía (Sin conos rojos L)',
    short: 'Protanopía',
    cone: 'Déficit en conos L (rojo)',
    description: 'Los rojos se perciben mucho más oscuros, apagados o amarronados, confundiéndose con verdes oscuros y negros.'
  },
  tritanopia: {
    id: 'tritanopia',
    name: 'Tritanopía (Sin conos azules S)',
    short: 'Tritanopía',
    cone: 'Déficit en conos S (azul)',
    description: 'Poco frecuente. Se confunden los azules con verdes y los amarillos con rosas o violetas claros.'
  },
  deuteranomalia: {
    id: 'deuteranomalia',
    name: 'Deuteranomalía (Leve en verde)',
    short: 'Deuteranomalía',
    cone: 'Conos M desplazados',
    description: 'Forma parcial más común en la población: menor sensibilidad para diferenciar matices sutiles entre verde y rojo.'
  },
  protanomalia: {
    id: 'protanomalia',
    name: 'Protanomalía (Leve en rojo)',
    short: 'Protanomalía',
    cone: 'Conos L desplazados',
    description: 'Dificultad parcial para distinguir rojos puros, naranjas y amarillos en condiciones de poca luz.'
  },
  acromatopsia: {
    id: 'acromatopsia',
    name: 'Acromatopsia (Visión monocromática)',
    short: 'Acromatopsia',
    cone: 'Ausencia de percepción cromática',
    description: 'Condición muy poco común donde el mundo se percibe exclusivamente en escala de grises y luminancias.'
  }
};

// Matrices lineales aproximadas (Viénot / Machado) aplicadas en RGB linealizado
const MATRICES = {
  protanopia: [
    0.152286, 1.052583, -0.204868,
    0.114503, 0.786281, 0.099216,
    -0.003882, -0.048116, 1.051998
  ],
  deuteranopia: [
    0.367322, 0.860646, -0.227968,
    0.280085, 0.672501, 0.047413,
    -0.011820, 0.042940, 0.968881
  ],
  tritanopia: [
    1.255528, -0.076749, -0.178779,
    -0.078411, 0.930809, 0.147602,
    0.004733, 0.691367, 0.303900
  ],
  protanomalia: [
    0.458064, 0.679578, -0.137642,
    0.092785, 0.846313, 0.060902,
    -0.007494, -0.016807, 1.024301
  ],
  deuteranomalia: [
    0.547494, 0.607765, -0.155259,
    0.181692, 0.781742, 0.036566,
    -0.010410, 0.027275, 0.983136
  ]
};

function srgbToLinear(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v) {
  const clamped = Math.max(0, Math.min(1, v));
  const out = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  return Math.round(out * 255);
}

export function applyCvdToImageData(sourceData, mode) {
  if (mode === 'normal') {
    return new ImageData(new Uint8ClampedArray(sourceData.data), sourceData.width, sourceData.height);
  }

  const out = new Uint8ClampedArray(sourceData.data.length);
  const src = sourceData.data;

  if (mode === 'acromatopsia') {
    for (let i = 0; i < src.length; i += 4) {
      const lum = Math.round(0.2126 * src[i] + 0.7152 * src[i + 1] + 0.0722 * src[i + 2]);
      out[i] = lum;
      out[i + 1] = lum;
      out[i + 2] = lum;
      out[i + 3] = src[i + 3];
    }
    return new ImageData(out, sourceData.width, sourceData.height);
  }

  const m = MATRICES[mode];
  if (!m) {
    return new ImageData(new Uint8ClampedArray(src), sourceData.width, sourceData.height);
  }

  // Tabla LUT para acelerar sRGB -> lineal
  const toLin = new Float32Array(256);
  for (let i = 0; i < 256; i++) toLin[i] = srgbToLinear(i);

  for (let i = 0; i < src.length; i += 4) {
    const r = toLin[src[i]];
    const g = toLin[src[i + 1]];
    const b = toLin[src[i + 2]];

    out[i] = linearToSrgb(m[0] * r + m[1] * g + m[2] * b);
    out[i + 1] = linearToSrgb(m[3] * r + m[4] * g + m[5] * b);
    out[i + 2] = linearToSrgb(m[6] * r + m[7] * g + m[8] * b);
    out[i + 3] = src[i + 3];
  }

  return new ImageData(out, sourceData.width, sourceData.height);
}

// Generador determinista pseudoaleatorio para láminas consistentes
function createRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * Dibuja una lámina estilo Ishihara nítida en un canvas dado.
 * @param {HTMLCanvasElement} canvas
 * @param {{ kind: 'number'|'shape', value: string, palette: 'rg'|'by'|'control', seed: number }} config
 */
export function renderIshiharaPlate(canvas, config) {
  const size = 320;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, size, size);

  // Máscara offscreen para el símbolo o número
  const maskCanvas = document.createElement('canvas');
  maskCanvas.width = size;
  maskCanvas.height = size;
  const mctx = maskCanvas.getContext('2d');
  mctx.fillStyle = '#000000';
  mctx.fillRect(0, 0, size, size);
  mctx.fillStyle = '#ffffff';
  mctx.strokeStyle = '#ffffff';

  if (config.kind === 'number') {
    mctx.font = '800 155px "Plus Jakarta Sans", Arial, sans-serif';
    mctx.textAlign = 'center';
    mctx.textBaseline = 'middle';
    mctx.fillText(config.value, size / 2, size / 2 + 8);
  } else {
    drawShapeMask(mctx, config.value, size);
  }

  const maskPixels = mctx.getImageData(0, 0, size, size).data;
  const isInsideSymbol = (x, y) => {
    const ix = Math.round(x);
    const iy = Math.round(y);
    if (ix < 0 || ix >= size || iy < 0 || iy >= size) return false;
    return maskPixels[(iy * size + ix) * 4] > 128;
  };

  // Paletas cromáticas calibradas por eje de confusión
  const palettes = {
    control: {
      fg: ['#ea580c', '#f97316', '#dc2626', '#fb923c'],
      bg: ['#475569', '#64748b', '#334155', '#94a3b8']
    },
    rg: {
      fg: ['#dc4c3e', '#e06346', '#c94a38', '#e67e51', '#d9534f'],
      bg: ['#6f8f48', '#83a154', '#5c7c3e', '#93ab60', '#79944e']
    },
    rgAlt: {
      fg: ['#5d8b47', '#6c9c55', '#4c7a38', '#7ba864'],
      bg: ['#d96b38', '#e28344', '#c95c2d', '#eb9654', '#d4743b']
    },
    by: {
      fg: ['#2563eb', '#3b82f6', '#1d4ed8', '#60a5fa'],
      bg: ['#65a30d', '#84cc16', '#4d7c0f', '#a3e635', '#71a825']
    }
  };

  const pal = palettes[config.palette] || palettes.rg;
  const rng = createRng(config.seed || 42);
  const cx = size / 2;
  const cy = size / 2;
  const plateRadius = size * 0.46;
  const circles = [];

  const radiiSteps = [9, 7.5, 6, 4.8, 3.6];
  for (const baseR of radiiSteps) {
    const attempts = baseR > 6 ? 1200 : 2000;
    for (let i = 0; i < attempts; i++) {
      const r = baseR * (0.88 + rng() * 0.24);
      const angle = rng() * Math.PI * 2;
      const dist = Math.sqrt(rng()) * (plateRadius - r - 2);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      let overlaps = false;
      for (let j = 0; j < circles.length; j++) {
        const c = circles[j];
        const dx = x - c.x;
        const dy = y - c.y;
        const minD = r + c.r + 1.4;
        if (dx * dx + dy * dy < minD * minD) {
          overlaps = true;
          break;
        }
      }
      if (!overlaps) {
        const inside = isInsideSymbol(x, y);
        const list = inside ? pal.fg : pal.bg;
        const color = list[Math.floor(rng() * list.length)];
        circles.push({ x, y, r, color });
      }
    }
  }

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, plateRadius + 4, 0, Math.PI * 2);
  ctx.fill();

  for (const c of circles) {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShapeMask(ctx, shape, size) {
  const cx = size / 2;
  const cy = size / 2;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (shape === 'circle') {
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.arc(cx, cy, 74, 0, Math.PI * 2);
    ctx.stroke();
  } else if (shape === 'triangle') {
    ctx.lineWidth = 34;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 84);
    ctx.lineTo(cx + 82, cy + 68);
    ctx.lineTo(cx - 82, cy + 68);
    ctx.closePath();
    ctx.stroke();
  } else if (shape === 'star') {
    ctx.beginPath();
    const spikes = 5;
    const outerR = 92;
    const innerR = 44;
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const a = (i * Math.PI) / spikes - Math.PI / 2;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else if (shape === 'square') {
    ctx.lineWidth = 34;
    ctx.strokeRect(cx - 68, cy - 68, 136, 136);
  } else if (shape === 'heart') {
    ctx.beginPath();
    ctx.moveTo(cx, cy + 72);
    ctx.bezierCurveTo(cx - 108, cy + 6, cx - 96, cy - 86, cx, cy - 30);
    ctx.bezierCurveTo(cx + 96, cy - 86, cx + 108, cy + 6, cx, cy + 72);
    ctx.fill();
  } else if (shape === 'house') {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 88);
    ctx.lineTo(cx + 84, cy - 14);
    ctx.lineTo(cx + 62, cy - 14);
    ctx.lineTo(cx + 62, cy + 72);
    ctx.lineTo(cx - 62, cy + 72);
    ctx.lineTo(cx - 62, cy - 14);
    ctx.lineTo(cx - 84, cy - 14);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}
