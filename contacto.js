// DaltoVisto — Validación accesible y envío asíncrono del formulario de contacto

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('contact-feedback');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    feedback.hidden = true;

    const formData = new FormData(form);
    const email = String(formData.get('email') || '').trim();
    const nombre = String(formData.get('nombre') || '').trim();
    const mensaje = String(formData.get('mensaje') || '').trim();

    if (!nombre || !email.includes('@') || mensaje.length < 5) {
      feedback.hidden = false;
      feedback.innerHTML = `
        <strong style="color:#b45309;">⚠ Revisá los campos obligatorios</strong>
        <p>Ingresá tu nombre, un correo electrónico válido y un mensaje de al menos 5 caracteres.</p>
      `;
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        form.reset();
        feedback.hidden = false;
        feedback.innerHTML = `
          <strong style="color:#0f766e;">✔ ¡Mensaje enviado correctamente!</strong>
          <p>Gracias por escribirle a DaltoVisto. También podés encontrarnos en Instagram y TikTok como @daltovisto.</p>
        `;
      } else {
        throw new Error('Error en respuesta');
      }
    } catch {
      feedback.hidden = false;
      feedback.innerHTML = `
        <strong style="color:#b45309;">⚠ No pudimos enviar el formulario en este momento</strong>
        <p>Podés escribirnos directamente por Instagram en <a href="https://www.instagram.com/daltovisto/" target="_blank" rel="noopener noreferrer" style="text-decoration:underline; color:#1d4ed8;">@daltovisto</a>.</p>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensaje';
    }
  });
});
