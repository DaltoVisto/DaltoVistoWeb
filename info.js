// DaltoVisto — Contadores formateados + Explorador Interactivo de Herencia Genética (Cromosoma X)

document.addEventListener('DOMContentLoaded', () => {
  // Contadores numéricos con separador de miles
  const counters = document.querySelectorAll('.counter[data-target]');
  const formatter = new Intl.NumberFormat('es-AR');

  counters.forEach((counter) => {
    const target = Number(counter.getAttribute('data-target')) || 0;
    const duration = 900;
    const start = performance.now();

    function step(now) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      counter.textContent = formatter.format(value);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  });

  // Simulador interactivo de herencia ligada al cromosoma X
  const motherSelect = document.getElementById('genetics-mother');
  const fatherSelect = document.getElementById('genetics-father');
  const daughtersEl = document.getElementById('genetics-daughters');
  const sonsEl = document.getElementById('genetics-sons');
  const noteEl = document.getElementById('genetics-note');

  if (!motherSelect || !fatherSelect) return;

  function computeGenetics() {
    // Alelos maternos (X1, X2) y paternos (Xp, Y)
    // D = normal dominante, d = alelo recesivo daltonismo
    const mMap = {
      normal: ['D', 'D'],
      carrier: ['D', 'd'],
      affected: ['d', 'd']
    };
    const fMap = {
      normal: 'D',
      affected: 'd'
    };

    const mAlleles = mMap[motherSelect.value];
    const fX = fMap[fatherSelect.value];

    let daughterAffected = 0;
    let daughterCarrier = 0;
    let sonAffected = 0;

    mAlleles.forEach((m) => {
      // Hija recibe m + fX
      if (m === 'd' && fX === 'd') daughterAffected += 50;
      else if (m === 'd' || fX === 'd') daughterCarrier += 50;

      // Hijo recibe m + Y
      if (m === 'd') sonAffected += 50;
    });

    daughtersEl.textContent =
      daughterAffected === 100
        ? '100% con daltonismo'
        : daughterAffected > 0
        ? `${daughterAffected}% con daltonismo · ${daughterCarrier}% portadoras`
        : daughterCarrier > 0
        ? `0% con daltonismo · ${daughterCarrier}% portadoras`
        : '0% con daltonismo · 0% portadoras';

    sonsEl.textContent = `${sonAffected}% con daltonismo`;

    if (fatherSelect.value === 'affected' && motherSelect.value === 'normal') {
      noteEl.textContent =
        'Un padre con daltonismo nunca transmite el gen a sus hijos varones (les da el cromosoma Y), pero todas sus hijas serán portadoras.';
    } else if (motherSelect.value === 'carrier' && fatherSelect.value === 'normal') {
      noteEl.textContent =
        'Caso típico de herencia materna: cada hijo varón tiene 50% de probabilidad de ser daltónico y cada hija 50% de ser portadora.';
    } else if (sonAffected === 0 && daughterAffected === 0 && daughterCarrier === 0) {
      noteEl.textContent = 'Ninguno de los progenitores porta el alelo recesivo ligado al cromosoma X.';
    } else {
      noteEl.textContent =
        'Las mujeres necesitan ambos cromosomas X afectados para manifestar daltonismo rojo-verde, mientras que en varones basta un solo cromosoma X.';
    }
  }

  motherSelect.addEventListener('change', computeGenetics);
  fatherSelect.addEventListener('change', computeGenetics);
  computeGenetics();
});
