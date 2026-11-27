// DaltoVisto — Test de Farnsworth Interactivo (Modo D-15 Rápido / Niños + Modo FM-100 Completo)
// Soporta arrastre con mouse, toque en celulares y selección clic-a-clic accesible por teclado.

const FULL_85_COLORS = [
  '#fc9e9f', '#fe9f9d', '#ffa090', '#fba58e', '#fea386', '#fcab80', '#fea984', '#fead76', '#fbaf7b', '#ffb075',
  '#feb475', '#fdbb67', '#fdbb6f', '#fdbf5c', '#fdc25a', '#fdca54', '#ffca60', '#fccc5d', '#ffcb5b', '#fad560',
  '#f8d55f', '#f3d960', '#e8e45f', '#e0de77', '#d9dd6e', '#d2e37b', '#c4dd78', '#bbdd7c', '#b5dd7d', '#b5db84',
  '#a1dc8c', '#9edc87', '#96de8c', '#87de8f', '#7bdc97', '#83dd97', '#73dd9d', '#6adca9', '#69dbaa', '#6ddab1',
  '#63e2b9', '#5fe0ba', '#59dfba', '#5ce1c2', '#68dbcc', '#57dfd1', '#4de1d3', '#40e5d5', '#4de2dc', '#4ee3df',
  '#57dce1', '#5bd6e8', '#61dcec', '#5bd5ec', '#6ccfee', '#7fcae7', '#7bc9ef', '#84c4f0', '#84c4e8', '#87c1ef',
  '#8dbcf0', '#8ebcee', '#97b8ee', '#a8b6f3', '#a6b3ea', '#abb1e5', '#aeafe5', '#c0aee0', '#c0aee2', '#c6abe2',
  '#ceaedf', '#d4afdb', '#daacdb', '#e3a9dc', '#e8aadd', '#ebaad4', '#eaa9d1', '#ebaacc', '#eea8ca', '#eea7c7',
  '#f8a3c2', '#fd9ebc', '#fda2b4', '#ff9ea6', '#fc9e9f'
];

// Muestra representativa D-15 (15 fichas reales del círculo cromático)
const D15_INDICES = [0, 5, 11, 17, 22, 28, 34, 40, 46, 52, 58, 64, 70, 76, 82];

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

document.addEventListener('DOMContentLoaded', () => {
  const modeBtns = document.querySelectorAll('[data-farnsworth-mode]');
  const trayEl = document.getElementById('farnsworth-pool');
  const slotsEl = document.getElementById('farnsworth-slots');
  const checkBtn = document.getElementById('farnsworth-check-btn');
  const solveBtn = document.getElementById('farnsworth-solve-btn');
  const resetBtn = document.getElementById('farnsworth-reset-btn');
  const resultBox = document.getElementById('farnsworth-result');
  const bandControls = document.getElementById('farnsworth-band-controls');

  if (!trayEl || !slotsEl) return;

  let mode = 'd15'; // 'd15' | 'fm100'
  let fmBand = 0; // 0..3 cuando es fm100
  let activeCaps = [];
  let slotValues = [];
  let poolValues = [];
  let pickedCapId = null;

  function buildCaps() {
    if (mode === 'd15') {
      activeCaps = D15_INDICES.map((idx, order) => ({
        id: `cap-${order}`,
        order,
        color: FULL_85_COLORS[idx]
      }));
      if (bandControls) bandControls.hidden = true;
    } else {
      // 4 bandejas de ~21 fichas para no abrumar la pantalla
      const start = fmBand * 21;
      const end = fmBand === 3 ? 85 : start + 21;
      activeCaps = FULL_85_COLORS.slice(start, end).map((color, order) => ({
        id: `cap-${order}`,
        order,
        color
      }));
      if (bandControls) bandControls.hidden = false;
    }

    const anchor = activeCaps[0];
    const rest = shuffle(activeCaps.slice(1));
    slotValues = [anchor, ...Array(rest.length).fill(null)];
    poolValues = rest;
    pickedCapId = null;
    resultBox.hidden = true;
    renderBoard();
  }

  function renderBoard() {
    // Bandeja de fichas disponibles
    trayEl.innerHTML = '';
    if (poolValues.length === 0) {
      const doneMsg = document.createElement('p');
      doneMsg.style.color = '#cbd5e1';
      doneMsg.style.fontSize = '0.9375rem';
      doneMsg.textContent = 'Todas las fichas fueron ubicadas. Presioná "Evaluar orden" para ver tu resultado.';
      trayEl.appendChild(doneMsg);
    } else {
      poolValues.forEach((cap) => {
        const el = createCapElement(cap, false);
        trayEl.appendChild(el);
      });
    }

    // Ranuras ordenadas (la posición 0 es la ficha ancla fija)
    slotsEl.innerHTML = '';
    slotValues.forEach((cap, idx) => {
      if (idx === 0) {
        const anchorEl = createCapElement(cap, true);
        anchorEl.title = 'Ficha de referencia fija';
        slotsEl.appendChild(anchorEl);
        return;
      }

      const slot = document.createElement('div');
      slot.className = 'hue-slot';
      slot.dataset.slotIndex = String(idx);
      slot.setAttribute('aria-label', `Posición ${idx + 1}`);

      if (cap) {
        const capEl = createCapElement(cap, false);
        slot.appendChild(capEl);
      } else {
        const num = document.createElement('span');
        num.style.color = '#94a3b8';
        num.style.fontSize = '0.75rem';
        num.textContent = String(idx + 1);
        slot.appendChild(num);
      }

      slot.addEventListener('dragover', (e) => {
        e.preventDefault();
        slot.classList.add('is-over');
      });
      slot.addEventListener('dragleave', () => slot.classList.remove('is-over'));
      slot.addEventListener('drop', (e) => {
        e.preventDefault();
        slot.classList.remove('is-over');
        const capId = e.dataTransfer.getData('text/plain');
        if (capId) moveCapToSlot(capId, idx);
      });

      slot.addEventListener('click', () => {
        if (pickedCapId) {
          moveCapToSlot(pickedCapId, idx);
          pickedCapId = null;
        } else if (cap) {
          pickedCapId = cap.id;
          renderBoard();
        }
      });

      slotsEl.appendChild(slot);
    });
  }

  function createCapElement(cap, isAnchor) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hue-cap' + (isAnchor ? ' is-anchor' : '') + (pickedCapId === cap.id ? ' is-picked' : '');
    btn.style.backgroundColor = cap.color;
    btn.setAttribute('aria-label', isAnchor ? 'Ficha de referencia inicial' : 'Ficha de color ordenable');

    if (isAnchor) {
      btn.textContent = 'INICIO';
      btn.style.color = '#0f172a';
      btn.style.fontSize = '0.62rem';
    } else {
      btn.draggable = true;
      btn.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', cap.id);
      });
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        pickedCapId = pickedCapId === cap.id ? null : cap.id;
        renderBoard();
      });
    }
    return btn;
  }

  function moveCapToSlot(capId, targetIdx) {
    if (targetIdx === 0) return; // Ancla protegida

    const inPoolIdx = poolValues.findIndex((c) => c.id === capId);
    const inSlotIdx = slotValues.findIndex((c) => c && c.id === capId);
    const displaced = slotValues[targetIdx];

    if (inPoolIdx !== -1) {
      const cap = poolValues.splice(inPoolIdx, 1)[0];
      slotValues[targetIdx] = cap;
      if (displaced) poolValues.push(displaced);
    } else if (inSlotIdx !== -1 && inSlotIdx !== targetIdx) {
      const cap = slotValues[inSlotIdx];
      slotValues[targetIdx] = cap;
      slotValues[inSlotIdx] = displaced;
    }

    renderBoard();
  }

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      mode = btn.dataset.farnsworthMode;
      buildCaps();
    });
  });

  document.querySelectorAll('[data-fm-band]').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-fm-band]').forEach((b) => {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      fmBand = Number(btn.dataset.fmBand);
      buildCaps();
    });
  });

  if (solveBtn) {
    solveBtn.addEventListener('click', () => {
      slotValues = [...activeCaps];
      poolValues = [];
      pickedCapId = null;
      renderBoard();
      resultBox.hidden = false;
      resultBox.innerHTML = `
        <strong>✔ Orden de referencia mostrado</strong>
        <p>Así se ve la transición continua de matices de izquierda a derecha. Podés presionar "Reiniciar" para volver a mezclarlas e intentarlo de nuevo.</p>
      `;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', buildCaps);
  }

  if (checkBtn) {
    checkBtn.addEventListener('click', () => {
      if (poolValues.length > 0) {
        resultBox.hidden = false;
        resultBox.innerHTML = `
          <strong style="color:#b45309;">⚠ Faltan ${poolValues.length} fichas por ubicar</strong>
          <p>Completá todas las ranuras antes de evaluar tu resultado.</p>
        `;
        return;
      }

      let exactMatches = 0;
      let totalJumpError = 0;
      for (let i = 1; i < slotValues.length; i++) {
        if (slotValues[i].order === i) exactMatches += 1;
        totalJumpError += Math.abs(slotValues[i].order - slotValues[i - 1].order - 1);
      }
      const totalSortable = slotValues.length - 1;
      const accuracy = Math.round((exactMatches / totalSortable) * 100);

      resultBox.hidden = false;
      if (totalJumpError === 0) {
        resultBox.innerHTML = `
          <strong style="color:#0f766e;">✔ Transición cromática perfecta (100%)</strong>
          <p>Ordenaste todas las fichas sin saltos de tonalidad. Tu discriminación de matices en esta banda es óptima.</p>
        `;
      } else if (accuracy >= 75) {
        resultBox.innerHTML = `
          <strong style="color:#1d4ed8;">● Precisión alta (${accuracy}% de coincidencia exacta)</strong>
          <p>Solo hubo pequeños intercambios entre tonos muy cercanos. Recordá subir el brillo al máximo y evitar filtros nocturnos.</p>
        `;
      } else {
        resultBox.innerHTML = `
          <strong style="color:#b45309;">▲ Se detectaron cruces de tonalidad (${accuracy}% de coincidencia)</strong>
          <p>Algunos saltos entre fichas sugieren dificultad para discriminar transiciones suaves de color. Te recomendamos realizar el Test de Ishihara y consultar a un oftalmólogo.</p>
        `;
      }
    });
  }

  buildCaps();
});
