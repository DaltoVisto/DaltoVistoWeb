// DaltoVisto — Simulador interactivo de Miopía por Dioptrías

document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('myopia-diopter-slider');
  const valueLabel = document.getElementById('myopia-diopter-value');
  const blurTarget = document.getElementById('myopia-blur-target');
  const statusLabel = document.getElementById('myopia-severity-label');

  if (!slider || !blurTarget) return;

  function updateBlur() {
    const diopter = Number(slider.value);
    const absD = Math.abs(diopter);
    const blurPx = (absD * 1.35).toFixed(2);

    valueLabel.textContent = diopter === 0 ? '0.00 D (Visión emétrope)' : `-${absD.toFixed(2)} D`;
    blurTarget.style.filter = `blur(${blurPx}px)`;

    if (absD === 0) {
      statusLabel.textContent = '● Enfoque nítido a distancia';
      statusLabel.style.color = '#0f766e';
    } else if (absD < 3) {
      statusLabel.textContent = '● Miopía leve (menor a -3.00 D)';
      statusLabel.style.color = '#1d4ed8';
    } else if (absD < 6) {
      statusLabel.textContent = '▲ Miopía moderada (-3.00 D a -5.75 D)';
      statusLabel.style.color = '#b45309';
    } else {
      statusLabel.textContent = '▲ Miopía magna / alta (-6.00 D o más)';
      statusLabel.style.color = '#b45309';
    }
  }

  slider.addEventListener('input', updateBlur);
  updateBlur();
});
