function animarProductoAlCarrito(boton, badge) {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  const contenedor = boton?.closest('.product-card, .product-detail-container');
  const imagen = contenedor?.querySelector('.product-image img, .detail-image img');

  if (!imagen || !badge || typeof imagen.animate !== 'function') return;

  const origen = imagen.getBoundingClientRect();
  const destino = badge.getBoundingClientRect();

  if (!origen.width || !origen.height || !destino.width || !destino.height) return;

  const escala = Math.min(destino.width / origen.width, destino.height / origen.height);
  const x = destino.left + destino.width / 2 - origen.left - (origen.width * escala) / 2;
  const y = destino.top + destino.height / 2 - origen.top - (origen.height * escala) / 2;
  const imagenAnimada = imagen.cloneNode();

  imagenAnimada.setAttribute('alt', '');
  imagenAnimada.setAttribute('aria-hidden', 'true');
  imagenAnimada.removeAttribute('id');
  imagenAnimada.classList.add('cart-flying-image');
  Object.assign(imagenAnimada.style, {
    left: `${origen.left}px`,
    top: `${origen.top}px`,
    width: `${origen.width}px`,
    height: `${origen.height}px`,
  });
  document.body.appendChild(imagenAnimada);

  const animacion = imagenAnimada.animate(
    [
      { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
      { transform: `translate3d(${x}px, ${y}px, 0) scale(${escala})`, opacity: 0.5 },
    ],
    {
      duration: 650,
      easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      fill: 'forwards',
    }
  );

  const limpiarImagen = () => imagenAnimada.remove();
  animacion.onfinish = limpiarImagen;
  animacion.oncancel = limpiarImagen;
}

export function activarFeedbackCarrito(boton) {
  const badge = document.getElementById('cart-count');

  if (badge) {
    badge.classList.remove('cart-bump');
    void badge.offsetWidth;
    badge.classList.add('cart-bump');
  }

  if (boton) {
    boton.classList.remove('cart-add-feedback');
    void boton.offsetWidth;
    boton.classList.add('cart-add-feedback');
  }

  animarProductoAlCarrito(boton, badge);

  const AudioContexto = window.AudioContext || window.webkitAudioContext;
  if (!AudioContexto) return;

  try {
    const contexto = new AudioContexto();
    const oscilador = contexto.createOscillator();
    const volumen = contexto.createGain();
    const ahora = contexto.currentTime;

    oscilador.type = 'sine';
    oscilador.frequency.setValueAtTime(740, ahora);
    oscilador.frequency.exponentialRampToValueAtTime(980, ahora + 0.07);
    volumen.gain.setValueAtTime(0.0001, ahora);
    volumen.gain.exponentialRampToValueAtTime(0.035, ahora + 0.01);
    volumen.gain.exponentialRampToValueAtTime(0.0001, ahora + 0.11);
    oscilador.connect(volumen);
    volumen.connect(contexto.destination);
    oscilador.onended = () => contexto.close();
    oscilador.start(ahora);
    oscilador.stop(ahora + 0.12);
  } catch {
    return;
  }
}