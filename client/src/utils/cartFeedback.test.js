import { activarFeedbackCarrito } from './cartFeedback';

describe('activarFeedbackCarrito', () => {
  let matchMediaOriginal;
  let animateOriginal;
  let animateMock;

  beforeEach(() => {
    matchMediaOriginal = window.matchMedia;
    animateOriginal = HTMLElement.prototype.animate;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: jest.fn().mockReturnValue({ matches: false }),
    });

    animateMock = jest.fn(() => ({ onfinish: null, oncancel: null }));
    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      value: animateMock,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';

    if (animateOriginal) {
      Object.defineProperty(HTMLElement.prototype, 'animate', {
        configurable: true,
        value: animateOriginal,
      });
    } else {
      delete HTMLElement.prototype.animate;
    }

    if (matchMediaOriginal) {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: matchMediaOriginal,
      });
    } else {
      delete window.matchMedia;
    }
  });

  function crearElementosProducto() {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'product-card';
    const contenedorImagen = document.createElement('div');
    contenedorImagen.className = 'product-image';
    const imagen = document.createElement('img');
    const boton = document.createElement('button');
    const badge = document.createElement('span');
    badge.id = 'cart-count';

    contenedorImagen.appendChild(imagen);
    tarjeta.append(contenedorImagen, boton);
    document.body.append(tarjeta, badge);

    jest.spyOn(imagen, 'getBoundingClientRect').mockReturnValue({
      left: 10,
      top: 20,
      width: 100,
      height: 80,
    });
    jest.spyOn(badge, 'getBoundingClientRect').mockReturnValue({
      left: 200,
      top: 30,
      width: 20,
      height: 20,
    });

    return { imagen, boton };
  }

  test('anima la imagen del producto hacia el contador del carrito', () => {
    const { boton } = crearElementosProducto();

    activarFeedbackCarrito(boton);

    const imagenAnimada = document.querySelector('.cart-flying-image');
    expect(imagenAnimada).toHaveAttribute('aria-hidden', 'true');
    expect(animateMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ transform: 'translate3d(0, 0, 0) scale(1)' }),
        expect.objectContaining({ transform: expect.stringContaining('translate3d(') }),
      ]),
      expect.objectContaining({ duration: 650 })
    );
    expect(boton).toHaveClass('cart-add-feedback');
    expect(document.querySelector('#cart-count')).toHaveClass('cart-bump');

    animateMock.mock.results[0].value.onfinish();
    expect(document.querySelector('.cart-flying-image')).not.toBeInTheDocument();
  });

  test('omite la animación voladora si se prefiere movimiento reducido', () => {
    const { boton } = crearElementosProducto();
    window.matchMedia.mockReturnValue({ matches: true });

    activarFeedbackCarrito(boton);

    expect(animateMock).not.toHaveBeenCalled();
    expect(document.querySelector('.cart-flying-image')).not.toBeInTheDocument();
  });
});
