import { renderIshiharaPlate } from './cvd-math.js';

// Láminas para Modo Adultos (combina las 5 láminas reales de DaltoVisto + 3 láminas calibradas extra)
const ADULT_PLATES = [
  {
    id: 'control-12',
    type: 'image',
    src: 'img/test1.jpg',
    axis: 'control',
    expected: '12',
    label: 'Lámina de control (12)',
    explanation: 'Visible tanto para visión tricromática como para daltónicos. Sirve para verificar comprensión y pantalla.',
    options: ['12', '8', '24', 'No distingo ningún número']
  },
  {
    id: 'rg-15',
    type: 'image',
    src: 'img/test2.png',
    axis: 'rg',
    expected: '15',
    label: 'Lámina rojo-verde (15)',
    explanation: 'Evalúa la discriminación rojo-verde. Personas con déficit rojo-verde suelen ver 17 o ningún número.',
    options: ['15', '17', '10', 'No distingo ningún número']
  },
  {
    id: 'rg-5',
    type: 'image',
    src: 'img/test3.jpg',
    axis: 'rg',
    expected: '5',
    label: 'Lámina rojo-verde (5)',
    explanation: 'Evalúa sensibilidad entre naranjas y verdes medios. Déficit rojo-verde puede percibir un 2 o nada.',
    options: ['5', '2', '36', 'No distingo ningún número']
  },
  {
    id: 'rg-2',
    type: 'image',
    src: 'img/test4.jpg',
    axis: 'rg',
    expected: '2',
    label: 'Lámina rojo-verde (2)',
    explanation: 'Prueba tonos cálidos sobre fondo verde bosque. Quienes tienen daltonismo rojo-verde suelen no distinguir el 2.',
    options: ['2', '74', '15', 'No distingo ningún número']
  },
  {
    id: 'rg-6',
    type: 'image',
    src: 'img/test5.jpg',
    axis: 'rg',
    expected: '6',
    label: 'Lámina rojo-verde (6)',
    explanation: 'Evalúa contraste sutil naranja-oliva característico del eje Protan/Deutan.',
    options: ['6', '8', '9', 'No distingo ningún número']
  },
  {
    id: 'rg-74',
    type: 'canvas',
    canvasConfig: { kind: 'number', value: '74', palette: 'rg', seed: 1074 },
    axis: 'rg',
    expected: '74',
    label: 'Lámina de contraste fino (74)',
    explanation: 'Diferencia entre visión normal (74) y déficit rojo-verde (suelen leer 21 o no distinguir figura).',
    options: ['74', '21', '47', 'No distingo ningún número']
  },
  {
    id: 'rg-42',
    type: 'canvas',
    canvasConfig: { kind: 'number', value: '42', palette: 'rgAlt', seed: 2042 },
    axis: 'rg',
    expected: '42',
    label: 'Lámina invertida verde/naranja (42)',
    explanation: 'Números verdes sobre fondo cálido para detectar anomalías leves en conos M y L.',
    options: ['42', '24', '12', 'No distingo ningún número']
  },
  {
    id: 'by-8',
    type: 'canvas',
    canvasConfig: { kind: 'number', value: '8', palette: 'by', seed: 3008 },
    axis: 'by',
    expected: '8',
    label: 'Lámina eje azul-amarillo (8)',
    explanation: 'Prueba complementaria orientada al eje Tritan (conos azules S).',
    options: ['8', '3', '6', 'No distingo ningún número']
  }
];

// Láminas para Modo Niños (figuras grandes y amigables, sin necesidad de leer números)
const KIDS_PLATES = [
  {
    id: 'kids-control',
    type: 'canvas',
    canvasConfig: { kind: 'shape', value: 'circle', palette: 'control', seed: 501 },
    axis: 'control',
    expected: 'Círculo',
    label: 'Figura de práctica (Círculo)',
    explanation: 'Lámina de práctica para comprobar que el juego se ve con claridad.',
    options: [
      { label: 'Círculo', icon: '◯' },
      { label: 'Estrella', icon: '★' },
      { label: 'Triángulo', icon: '△' },
      { label: 'No veo ninguna figura', icon: '✕' }
    ]
  },
  {
    id: 'kids-star',
    type: 'canvas',
    canvasConfig: { kind: 'shape', value: 'star', palette: 'rg', seed: 502 },
    axis: 'rg',
    expected: 'Estrella',
    label: 'Misión Estrella (Rojo-Verde)',
    explanation: 'Evalúa cómo distinguís formas rojas entre puntos verdes.',
    options: [
      { label: 'Estrella', icon: '★' },
      { label: 'Corazón', icon: '♥' },
      { label: 'Cuadrado', icon: '□' },
      { label: 'No veo ninguna figura', icon: '✕' }
    ]
  },
  {
    id: 'kids-triangle',
    type: 'canvas',
    canvasConfig: { kind: 'shape', value: 'triangle', palette: 'rgAlt', seed: 503 },
    axis: 'rg',
    expected: 'Triángulo',
    label: 'Misión Triángulo (Verde-Naranja)',
    explanation: 'Evalúa formas verdes sobre puntos naranjas y amarillos.',
    options: [
      { label: 'Triángulo', icon: '△' },
      { label: 'Círculo', icon: '◯' },
      { label: 'Casa', icon: '⌂' },
      { label: 'No veo ninguna figura', icon: '✕' }
    ]
  },
  {
    id: 'kids-heart',
    type: 'canvas',
    canvasConfig: { kind: 'shape', value: 'heart', palette: 'rg', seed: 504 },
    axis: 'rg',
    expected: 'Corazón',
    label: 'Misión Corazón (Rojo-Verde)',
    explanation: 'Prueba de discriminación en tonos cálidos frente a oliva.',
    options: [
      { label: 'Corazón', icon: '♥' },
      { label: 'Estrella', icon: '★' },
      { label: 'Triángulo', icon: '△' },
      { label: 'No veo ninguna figura', icon: '✕' }
    ]
  },
  {
    id: 'kids-house',
    type: 'canvas',
    canvasConfig: { kind: 'shape', value: 'house', palette: 'rgAlt', seed: 505 },
    axis: 'rg',
    expected: 'Casa',
    label: 'Misión Casa (Verde-Naranja)',
    explanation: 'Evalúa figuras complejas en el eje rojo-verde.',
    options: [
      { label: 'Casa', icon: '⌂' },
      { label: 'Cuadrado', icon: '□' },
      { label: 'Corazón', icon: '♥' },
      { label: 'No veo ninguna figura', icon: '✕' }
    ]
  },
  {
    id: 'kids-square-by',
    type: 'canvas',
    canvasConfig: { kind: 'shape', value: 'square', palette: 'by', seed: 506 },
    axis: 'by',
    expected: 'Cuadrado',
    label: 'Misión Cuadrado (Azul-Lima)',
    explanation: 'Comprueba la percepción de tonos azules frente a amarillos/lima.',
    options: [
      { label: 'Cuadrado', icon: '□' },
      { label: 'Círculo', icon: '◯' },
      { label: 'Estrella', icon: '★' },
      { label: 'No veo ninguna figura', icon: '✕' }
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const modeRadios = document.querySelectorAll('[data-test-mode]');
  const startBtn = document.getElementById('start-test-btn');
  const setupView = document.getElementById('test-setup-view');
  const playView = document.getElementById('test-play-view');
  const resultView = document.getElementById('test-result-view');

  const progressText = document.getElementById('progress-text');
  const progressBar = document.getElementById('progress-bar-fill');
  const questionPrompt = document.getElementById('question-prompt');
  const plateContainer = document.getElementById('plate-container');
  const optionsContainer = document.getElementById('options-container');
  const nextBtn = document.getElementById('next-plate-btn');
  const timerBox = document.getElementById('plate-timer-label');
  const timerToggle = document.getElementById('enable-timer-toggle');

  let currentMode = new URLSearchParams(window.location.search).get('modo') === 'ninos' ? 'kids' : 'adult';
  let plates = ADULT_PLATES;
  let currentIndex = 0;
  let answers = [];
  let selectedAnswer = null;
  let timerInterval = null;

  function syncModeButtons() {
    modeRadios.forEach((btn) => {
      const active = btn.dataset.testMode === currentMode;
      btn.setAttribute('aria-pressed', String(active));
      btn.classList.toggle('is-active', active);
    });
  }

  modeRadios.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.testMode;
      syncModeButtons();
    });
  });

  syncModeButtons();

  function startTest() {
    plates = currentMode === 'kids' ? KIDS_PLATES : ADULT_PLATES;
    currentIndex = 0;
    answers = [];
    setupView.hidden = true;
    resultView.hidden = true;
    playView.hidden = false;
    renderCurrentPlate();
  }

  if (startBtn) {
    startBtn.addEventListener('click', startTest);
  }

  function clearTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function renderCurrentPlate() {
    clearTimer();
    selectedAnswer = null;
    nextBtn.disabled = true;
    nextBtn.textContent = currentIndex === plates.length - 1 ? 'Ver diagnóstico orientativo' : 'Siguiente lámina';

    const plate = plates[currentIndex];
    const total = plates.length;
    const step = currentIndex + 1;

    progressText.textContent = `Lámina ${step} de ${total}`;
    progressBar.style.width = `${(step / total) * 100}%`;
    questionPrompt.textContent =
      currentMode === 'kids'
        ? '¿Qué figura descubrís escondida dentro del círculo?'
        : '¿Qué número distinguís dentro del círculo?';

    // Renderizar lámina (foto real o canvas procedural)
    plateContainer.innerHTML = '';
    if (plate.type === 'image') {
      const img = document.createElement('img');
      img.src = plate.src;
      img.alt = `Lámina ${step} del test de Ishihara`;
      img.className = 'plate-visual';
      plateContainer.appendChild(img);
    } else {
      const canvas = document.createElement('canvas');
      canvas.className = 'plate-visual';
      canvas.setAttribute('aria-label', `Lámina ${step} generada del test`);
      renderIshiharaPlate(canvas, plate.canvasConfig);
      plateContainer.appendChild(canvas);
    }

    // Opciones de respuesta (dual-coded con ícono en modo niños)
    optionsContainer.innerHTML = '';
    plate.options.forEach((opt, idx) => {
      const label = typeof opt === 'string' ? opt : opt.label;
      const icon = typeof opt === 'string' ? null : opt.icon;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      if (idx === plate.options.length - 1 && plate.options.length % 2 === 1) {
        btn.classList.add('option-btn-wide');
      }

      if (icon) {
        const spanIcon = document.createElement('span');
        spanIcon.setAttribute('aria-hidden', 'true');
        spanIcon.textContent = icon;
        btn.appendChild(spanIcon);
      }

      const spanLabel = document.createElement('span');
      spanLabel.textContent = label;
      btn.appendChild(spanLabel);

      btn.addEventListener('click', () => {
        selectedAnswer = label;
        optionsContainer.querySelectorAll('.option-btn').forEach((b) => {
          b.classList.remove('is-selected');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
        nextBtn.disabled = false;
      });

      optionsContainer.appendChild(btn);
    });

    // Temporizador opcional (no bloqueante, solo guía visual)
    if (timerToggle && timerToggle.checked) {
      let secondsLeft = 5;
      timerBox.hidden = false;
      timerBox.textContent = `Tiempo sugerido: ${secondsLeft}s`;
      timerInterval = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft > 0) {
          timerBox.textContent = `Tiempo sugerido: ${secondsLeft}s`;
        } else {
          timerBox.textContent = 'Respondé con tu primera impresión';
          clearTimer();
        }
      }, 1000);
    } else if (timerBox) {
      timerBox.hidden = true;
    }
  }

  nextBtn.addEventListener('click', () => {
    if (!selectedAnswer) return;
    const plate = plates[currentIndex];
    answers.push({
      plate,
      chosen: selectedAnswer,
      correct: selectedAnswer === plate.expected
    });

    if (currentIndex < plates.length - 1) {
      currentIndex += 1;
      renderCurrentPlate();
    } else {
      clearTimer();
      showResults();
    }
  });

  function showResults() {
    playView.hidden = true;
    resultView.hidden = false;

    const total = answers.length;
    const correctCount = answers.filter((a) => a.correct).length;
    const controlOk = answers.find((a) => a.plate.axis === 'control')?.correct ?? true;
    const rgMisses = answers.filter((a) => a.plate.axis === 'rg' && !a.correct).length;
    const byMisses = answers.filter((a) => a.plate.axis === 'by' && !a.correct).length;

    const badgeEl = document.getElementById('result-status-label');
    const titleEl = document.getElementById('result-title');
    const descEl = document.getElementById('result-summary');
    const scoreEl = document.getElementById('result-score');
    const breakdownEl = document.getElementById('result-breakdown');

    scoreEl.textContent = `${correctCount} / ${total}`;

    if (!controlOk) {
      badgeEl.textContent = '⚠ Revisar iluminación o calibración';
      badgeEl.style.color = '#b45309';
      titleEl.textContent = 'No se distinguió la lámina de control';
      descEl.textContent =
        'La primera lámina es visible para casi todas las personas, incluso con daltonismo. Te sugerimos subir el brillo al 100%, apagar filtros nocturnos y volver a intentarlo.';
    } else if (rgMisses === 0 && byMisses === 0) {
      badgeEl.textContent = '✔ Visión cromática sin indicios de alteración';
      badgeEl.style.color = '#0f766e';
      titleEl.textContent =
        currentMode === 'kids'
          ? '¡Excelente trabajo! Distinguiste todas las figuras'
          : 'Visión tricromática probable';
      descEl.textContent =
        'Identificaste correctamente todas las láminas del recorrido. Si notás dificultades en la vida cotidiana, realizá igualmente un control oftalmológico.';
    } else if (rgMisses >= 1 && byMisses === 0) {
      badgeEl.textContent = '▲ Posible alteración en eje rojo-verde';
      badgeEl.style.color = '#b45309';
      titleEl.textContent = 'Posible daltonismo rojo-verde (Protan / Deutan)';
      descEl.textContent =
        'Se detectaron errores en láminas del eje rojo-verde. Este resultado es orientativo: un oftalmólogo u optómetra puede confirmar el tipo exacto (Protanopía o Deuteranopía) y su grado.';
    } else if (byMisses >= 1 && rgMisses === 0) {
      badgeEl.textContent = '▲ Posible alteración en eje azul-amarillo';
      badgeEl.style.color = '#b45309';
      titleEl.textContent = 'Posible dificultad en eje azul-amarillo (Tritan)';
      descEl.textContent =
        'Fallaste la lámina orientada al eje azul-amarillo. Te recomendamos complementar con el Test de Farnsworth y consultar a un profesional visual.';
    } else {
      badgeEl.textContent = '▲ Alteración mixta detectada en la prueba';
      badgeEl.style.color = '#b45309';
      titleEl.textContent = 'Se recomienda evaluación oftalmológica completa';
      descEl.textContent =
        'Se observaron dificultades en más de un eje cromático. Recordá verificar el brillo de la pantalla y consultar con un especialista.';
    }

    // Desglose lámina por lámina
    breakdownEl.innerHTML = '';
    answers.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'card';
      row.style.padding = '16px';
      const statusText = item.correct ? '✔ Acertada' : '✕ Diferencia detectada';
      const statusColor = item.correct ? '#0f766e' : '#b45309';
      row.innerHTML = `
        <div style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; align-items:center;">
          <strong>${i + 1}. ${item.plate.label}</strong>
          <span style="font-weight:700; color:${statusColor};">${statusText}</span>
        </div>
        <p style="font-size:0.9375rem;">
          Tu respuesta: <strong>${item.chosen}</strong> · Esperada: <strong>${item.plate.expected}</strong>
        </p>
        <p style="font-size:0.875rem;">${item.plate.explanation}</p>
      `;
      breakdownEl.appendChild(row);
    });
  }

  const retryBtn = document.getElementById('retry-test-btn');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      resultView.hidden = true;
      setupView.hidden = false;
    });
  }
});
