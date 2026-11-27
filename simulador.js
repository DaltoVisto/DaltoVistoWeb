import { CVD_MODES, applyCvdToImageData } from './cvd-math.js';

// Dibuja escenas educativas nítidas en canvas (sin depender de URLs externas)
export function drawEducationalScene(canvas, sceneId) {
  const w = 800;
  const h = 500;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);

  if (sceneId === 'semaforo') {
    // Cielo y escena urbana con semáforo y señales
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#bae6fd');
    sky.addColorStop(0.65, '#e0f2fe');
    sky.addColorStop(0.66, '#334155');
    sky.addColorStop(1, '#1e293b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Árboles y follaje con frutos rojos (contraste rojo-verde clásico)
    ctx.fillStyle = '#5c4033';
    ctx.fillRect(90, 220, 26, 115);
    ctx.fillStyle = '#2e7d32';
    ctx.beginPath();
    ctx.arc(103, 185, 76, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#43a047';
    ctx.beginPath();
    ctx.arc(145, 200, 52, 0, Math.PI * 2);
    ctx.fill();

    // Manzanas rojas en el árbol (invisibles casi para protan/deutan)
    const apples = [[80, 165], [125, 155], [95, 210], [148, 195], [68, 195]];
    apples.forEach(([ax, ay]) => {
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(ax, ay, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Poste y cuerpo del semáforo
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(384, 240, 22, 160);
    roundRect(ctx, 345, 50, 100, 210, 18, '#1e293b');

    // Luces: Roja arriba, Ámbar medio, Verde abajo
    drawLight(ctx, 395, 95, 24, '#ef4444');
    drawLight(ctx, 395, 155, 24, '#f59e0b');
    drawLight(ctx, 395, 215, 24, '#22c55e');

    // Cartel de tránsito rojo y cartel verde de autopista
    roundRect(ctx, 540, 100, 180, 74, 10, '#15803d');
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('AV. LIBERTAD', 630, 145);

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8;
      const rx = 630 + Math.cos(a) * 46;
      const ry = 250 + Math.sin(a) * 46;
      if (i === 0) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('PARE', 630, 257);

    // Senda peatonal
    ctx.fillStyle = '#f8fafc';
    for (let x = 140; x < 700; x += 95) {
      ctx.fillRect(x, 405, 55, 42);
    }
  } else if (sceneId === 'frutas') {
    // Mesa con alimentos frescos vs maduros (ejemplo clásico de la vida diaria)
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(0, 355, w, 145);

    // Bowl central
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(400, 345, 290, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Frutas coloridas: frutillas rojas, manzanas verdes, bananas amarillas, arándanos azules, uvas violetas
    const items = [
      { x: 200, y: 270, r: 48, color: '#dc2626', label: 'Tomate maduro' },
      { x: 300, y: 255, r: 46, color: '#16a34a', label: 'Manzana verde' },
      { x: 400, y: 275, r: 46, color: '#eab308', label: 'Limón / Banana' },
      { x: 500, y: 255, r: 46, color: '#2563eb', label: 'Arándanos' },
      { x: 600, y: 275, r: 46, color: '#9333ea', label: 'Uvas violetas' }
    ];

    items.forEach((it) => {
      ctx.fillStyle = it.color;
      ctx.beginPath();
      ctx.arc(it.x, it.y, it.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.beginPath();
      ctx.arc(it.x - 14, it.y - 14, it.r * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Etiqueta debajo
      ctx.fillStyle = '#0f172a';
      ctx.font = '700 15px "DM Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(it.label, it.x, 420);
    });

    // Hojas verdes
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.ellipse(210, 216, 16, 8, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(310, 202, 16, 8, -0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (sceneId === 'subte') {
    // Mapa de transporte por líneas de colores
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    // Grilla suave
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 40; x < w; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 40; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const lines = [
      { pts: [[80, 120], [280, 120], [420, 250], [700, 250]], color: '#dc2626', name: 'Línea Roja' },
      { pts: [[80, 340], [260, 340], [420, 250], [640, 100]], color: '#16a34a', name: 'Línea Verde' },
      { pts: [[160, 60], [320, 210], [320, 420], [680, 420]], color: '#2563eb', name: 'Línea Azul' },
      { pts: [[120, 230], [500, 230], [620, 350], [730, 350]], color: '#ca8a04', name: 'Línea Amarilla' }
    ];

    lines.forEach((line) => {
      ctx.strokeStyle = line.color;
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      line.pts.forEach(([x, y], idx) => (idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();

      line.pts.forEach(([x, y]) => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.stroke();
      });
    });

    // Leyenda sin texto de apoyo visual extra para mostrar cómo el color solo confunde
    roundRect(ctx, 40, 395, 420, 75, 10, '#ffffff');
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(40, 395, 420, 75);
    lines.forEach((line, i) => {
      const lx = 64 + i * 98;
      ctx.fillStyle = line.color;
      ctx.fillRect(lx, 415, 22, 12);
      ctx.fillStyle = '#0f172a';
      ctx.font = '600 13px "DM Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(line.name.replace('Línea ', ''), lx + 28, 425);
    });
  } else if (sceneId === 'rana') {
    // Mini-reto para niños: Encontrá la rana roja/naranja oculta entre hojas verdes
    ctx.fillStyle = '#14532d';
    ctx.fillRect(0, 0, w, h);

    const leafGreens = ['#166534', '#15803d', '#22c55e', '#4d7c0f', '#65a30d'];
    for (let i = 0; i < 65; i++) {
      const lx = ((i * 137) % 760) + 20;
      const ly = ((i * 97) % 440) + 30;
      ctx.fillStyle = leafGreens[i % leafGreens.length];
      ctx.beginPath();
      ctx.ellipse(lx, ly, 42, 24, (i * 0.7) % Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rana naranja/roja en (520, 260)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(520, 265, 44, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(496, 232, 15, 0, Math.PI * 2);
    ctx.arc(544, 232, 15, 0, Math.PI * 2);
    ctx.fill();
    // Ojos blancos de la rana
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(496, 230, 8, 0, Math.PI * 2);
    ctx.arc(544, 230, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(496, 230, 4, 0, Math.PI * 2);
    ctx.arc(544, 230, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLight(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

// Inicializa un visor split-screen reutilizable
export function initSplitSimulator(config) {
  const viewer = document.getElementById(config.viewerId);
  if (!viewer) return null;

  const baseCanvas = document.getElementById(config.baseCanvasId);
  const simCanvas = document.getElementById(config.simCanvasId);
  const divider = document.getElementById(config.dividerId);
  const handle = document.getElementById(config.handleId);
  const rangeInput = document.getElementById(config.rangeId);
  const modeInfoTitle = document.getElementById(config.modeTitleId);
  const modeInfoDesc = document.getElementById(config.modeDescId);

  let currentScene = config.defaultScene || 'semaforo';
  let currentMode = config.defaultMode || 'deuteranopia';
  let splitPct = 50;
  let customImage = null;
  let webcamStream = null;
  let webcamVideo = null;
  let rafId = null;

  function updateSplitUI() {
    simCanvas.style.clipPath = `inset(0 0 0 ${splitPct}%)`;
    if (divider) divider.style.left = `${splitPct}%`;
    if (handle) handle.style.left = `${splitPct}%`;
    if (rangeInput) rangeInput.value = String(Math.round(splitPct));
  }

  function renderSimulationFrame() {
    const bctx = baseCanvas.getContext('2d');
    const sctx = simCanvas.getContext('2d');
    simCanvas.width = baseCanvas.width;
    simCanvas.height = baseCanvas.height;
    const raw = bctx.getImageData(0, 0, baseCanvas.width, baseCanvas.height);
    const filtered = applyCvdToImageData(raw, currentMode);
    sctx.putImageData(filtered, 0, 0);
  }

  function renderSource() {
    stopWebcam();
    if (customImage) {
      const w = 800;
      const h = 500;
      baseCanvas.width = w;
      baseCanvas.height = h;
      const bctx = baseCanvas.getContext('2d');
      bctx.fillStyle = '#0f172a';
      bctx.fillRect(0, 0, w, h);
      const scale = Math.min(w / customImage.width, h / customImage.height);
      const dw = customImage.width * scale;
      const dh = customImage.height * scale;
      bctx.drawImage(customImage, (w - dw) / 2, (h - dh) / 2, dw, dh);
      renderSimulationFrame();
    } else {
      drawEducationalScene(baseCanvas, currentScene);
      renderSimulationFrame();
    }
  }

  function stopWebcam() {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (webcamStream) {
      webcamStream.getTracks().forEach((t) => t.stop());
      webcamStream = null;
    }
  }

  async function startWebcam(statusEl) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      if (statusEl) statusEl.textContent = 'Tu navegador no permite acceso a la cámara.';
      return;
    }
    try {
      stopWebcam();
      webcamStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      webcamVideo = document.createElement('video');
      webcamVideo.srcObject = webcamStream;
      webcamVideo.playsInline = true;
      await webcamVideo.play();
      if (statusEl) statusEl.textContent = 'Cámara activa en tiempo real.';

      const tick = () => {
        if (!webcamStream) return;
        baseCanvas.width = 640;
        baseCanvas.height = 400;
        const bctx = baseCanvas.getContext('2d');
        bctx.drawImage(webcamVideo, 0, 0, 640, 400);
        renderSimulationFrame();
        rafId = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      if (statusEl) statusEl.textContent = 'No se pudo activar la cámara (permiso denegado o sin dispositivo).';
    }
  }

  function setMode(modeId) {
    currentMode = modeId;
    const info = CVD_MODES[modeId];
    if (info && modeInfoTitle && modeInfoDesc) {
      modeInfoTitle.textContent = info.name;
      modeInfoDesc.textContent = `${info.cone}. ${info.description}`;
    }
    if (!webcamStream) {
      renderSimulationFrame();
    }
  }

  function setScene(sceneId) {
    customImage = null;
    currentScene = sceneId;
    renderSource();
  }

  function setCustomFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        customImage = img;
        renderSource();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Dragging del divisor split-screen
  let dragging = false;
  const updateFromClientX = (clientX) => {
    const rect = viewer.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    splitPct = Math.max(5, Math.min(95, pct));
    updateSplitUI();
  };

  viewer.addEventListener('pointerdown', (e) => {
    dragging = true;
    updateFromClientX(e.clientX);
  });
  window.addEventListener('pointermove', (e) => {
    if (dragging) updateFromClientX(e.clientX);
  });
  window.addEventListener('pointerup', () => {
    dragging = false;
  });

  if (rangeInput) {
    rangeInput.addEventListener('input', (e) => {
      splitPct = Number(e.target.value);
      updateSplitUI();
    });
  }

  updateSplitUI();
  setMode(currentMode);
  renderSource();

  return { setMode, setScene, setCustomFile, startWebcam, stopWebcam };
}

document.addEventListener('DOMContentLoaded', () => {
  const sim = initSplitSimulator({
    viewerId: 'sim-viewer',
    baseCanvasId: 'sim-base-canvas',
    simCanvasId: 'sim-filtered-canvas',
    dividerId: 'sim-divider',
    handleId: 'sim-handle',
    rangeId: 'sim-split-range',
    modeTitleId: 'sim-mode-title',
    modeDescId: 'sim-mode-desc',
    defaultScene: 'semaforo',
    defaultMode: 'deuteranopia'
  });

  if (!sim) return;

  const modeBtns = document.querySelectorAll('[data-cvd-mode]');
  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      sim.setMode(btn.dataset.cvdMode);
    });
  });

  const sceneBtns = document.querySelectorAll('[data-sim-scene]');
  sceneBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      sceneBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      sim.setScene(btn.dataset.simScene);
    });
  });

  const uploadInput = document.getElementById('sim-upload-input');
  if (uploadInput) {
    uploadInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) sim.setCustomFile(file);
    });
  }

  const webcamBtn = document.getElementById('sim-webcam-btn');
  const webcamStopBtn = document.getElementById('sim-webcam-stop-btn');
  const webcamStatus = document.getElementById('sim-webcam-status');

  if (webcamBtn) {
    webcamBtn.addEventListener('click', () => {
      sim.startWebcam(webcamStatus);
      if (webcamStopBtn) webcamStopBtn.hidden = false;
    });
  }
  if (webcamStopBtn) {
    webcamStopBtn.addEventListener('click', () => {
      sim.stopWebcam();
      if (webcamStatus) webcamStatus.textContent = 'Cámara detenida.';
      webcamStopBtn.hidden = true;
      sim.setScene('semaforo');
    });
  }
});
