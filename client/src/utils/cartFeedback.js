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