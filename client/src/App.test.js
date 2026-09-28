import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Datos de prueba con la misma forma que devuelve GET /api/productos
const productosMock = [
  {
    id: 1,
    nombre: 'Aparador Uspallata',
    precio: 620000,
    categoria: 'Aparadores',
    imagen: 'img/Aparador Uspallata.png',
    descripcion: 'Aparador bajo de líneas rectas en roble macizo.',
    especificaciones: [
      { label: 'Medidas', value: '160 × 45 × 75 cm' },
      { label: 'Materiales', value: 'Roble macizo FSC®, herrajes soft-close' }
    ],
    destacado: false
  },
  {
    id: 2,
    nombre: 'Biblioteca Recoleta',
    precio: 410000,
    categoria: 'Bibliotecas',
    imagen: 'img/Biblioteca Recoleta.png',
    descripcion: 'Biblioteca modular de piso a techo.',
    especificaciones: [{ label: 'Medidas', value: '90 × 30 × 200 cm' }],
    destacado: false
  },
  {
    id: 3,
    nombre: 'Butaca Mendoza',
    precio: 380000,
    categoria: 'Sillones',
    imagen: 'img/Butaca Mendoza.png',
    descripcion: 'Butaca individual tapizada en pana color terracota.',
    especificaciones: [{ label: 'Medidas', value: '75 × 80 × 85 cm' }],
    destacado: true
  }
];

const respuestaOk = () =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(productosMock) });

// Renderiza la app y espera a que termine la carga inicial de la API
const renderApp = async () => {
  render(<App />);
  await screen.findByText('Butaca Mendoza');
};

beforeAll(() => {
  window.scrollTo = jest.fn();
});

beforeEach(() => {
  global.fetch = jest.fn(respuestaOk);
});

describe('Hermanos Jota — Componentes, navegación y API', () => {
  test('Portada: muestra estado de carga, luego solo los destacados de la API', async () => {
    render(<App />);

    // Ciclo de la petición: cargando
    expect(screen.getByText(/cargando catálogo/i)).toBeInTheDocument();

    // Éxito: aparecen los destacados
    expect(await screen.findByText('Butaca Mendoza')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith('/api/productos', expect.anything());
    expect(screen.queryByText('Aparador Uspallata')).not.toBeInTheDocument();

    // Navbar, hero y footer
    expect(screen.getByRole('button', { name: /^inicio$/i })).toBeInTheDocument();
    expect(screen.getByText(/diseño que honra el pasado y abraza el futuro/i)).toBeInTheDocument();
    expect(screen.getByText(/2026 Hermanos Jota. Todos los derechos reservados./i)).toBeInTheDocument();
  });

  test('Muestra un error y permite reintentar si la API falla', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValueOnce(new Error('sin conexión'))
      .mockImplementation(respuestaOk);

    render(<App />);

    // Ciclo de la petición: error
    expect(await screen.findByRole('alert')).toHaveTextContent(/no pudimos cargar el catálogo/i);

    // Reintentar → éxito
    fireEvent.click(screen.getByRole('button', { name: /reintentar/i }));
    expect(await screen.findByText('Butaca Mendoza')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  test('Trata una respuesta HTTP no exitosa como error', async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, status: 500 }));

    render(<App />);

    expect(await screen.findByRole('alert')).toBeInTheDocument();
  });

  test('Permite navegar al Catálogo y filtrar productos', async () => {
    await renderApp();

    fireEvent.click(screen.getByRole('button', { name: /^catálogo$/i }));

    const searchInput = screen.getByPlaceholderText(/ej: sillón, mesa, silla/i);
    expect(screen.getByText('Aparador Uspallata')).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'mendoza' } });
    expect(screen.getByText('Butaca Mendoza')).toBeInTheDocument();
    expect(screen.queryByText('Biblioteca Recoleta')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Biblioteca Recoleta')).toBeInTheDocument();
  });

  test('Permite ver el detalle con especificaciones y añadir al carrito', async () => {
    await renderApp();

    fireEvent.click(screen.getByRole('button', { name: /^catálogo$/i }));
    fireEvent.click(screen.getByLabelText(/ver detalle de aparador uspallata/i));

    expect(screen.getByText('Aparador bajo de líneas rectas en roble macizo.')).toBeInTheDocument();
    expect(screen.getByText('160 × 45 × 75 cm')).toBeInTheDocument();
    expect(screen.getByText(/roble macizo fsc/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /añadir al carrito/i }));
    expect(screen.getByText('Producto añadido al carrito.')).toBeInTheDocument();
    expect(document.querySelector('#cart-count')).toHaveTextContent('1');

    fireEvent.click(screen.getByRole('button', { name: /volver al catálogo →/i }));
    expect(screen.getByPlaceholderText(/ej: sillón, mesa, silla/i)).toBeInTheDocument();
  });

  test('El carrito suma unidades, calcula el total y se puede vaciar', async () => {
    await renderApp();

    // Dos unidades de la Butaca Mendoza desde la portada
    const botonesAñadir = screen.getAllByRole('button', { name: /^añadir$/i });
    fireEvent.click(botonesAñadir[0]);
    fireEvent.click(botonesAñadir[0]);
    expect(document.querySelector('#cart-count')).toHaveTextContent('2');

    fireEvent.click(screen.getByRole('button', { name: /ver carrito de compras/i }));
    expect(screen.getByText('Butaca Mendoza')).toBeInTheDocument();
    expect(document.querySelector('#cart-total')).toHaveTextContent(/760\.000/);

    fireEvent.click(screen.getByRole('button', { name: /quitar una unidad de butaca mendoza/i }));
    expect(document.querySelector('#cart-total')).toHaveTextContent(/380\.000/);

    fireEvent.click(screen.getByRole('button', { name: /vaciar carrito/i }));
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
    expect(document.querySelector('#cart-count')).toHaveTextContent('0');
  });

  test('Permite navegar a Contacto y enviar el formulario controlado', async () => {
    await renderApp();

    fireEvent.click(screen.getByRole('button', { name: /^contacto$/i }));

    const nameInput = screen.getByLabelText(/^nombre/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const messageInput = screen.getByLabelText(/^mensaje/i);

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola, quisiera consultar por stock.' } });

    expect(nameInput.value).toBe('Juan Pérez');
    expect(emailInput.value).toBe('juan@example.com');
    expect(messageInput.value).toBe('Hola, quisiera consultar por stock.');

    fireEvent.click(screen.getByRole('button', { name: /enviar mensaje/i }));

    await waitFor(() =>
      expect(screen.getByText(/¡gracias! recibimos tu mensaje\. te contactaremos pronto\./i)).toBeInTheDocument()
    );
    expect(nameInput.value).toBe('');
  });
});
