import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  window.scrollTo = jest.fn();
});

describe('Hermanos Jota — Componentes y Navegación React', () => {
  test('Renderiza Navbar, Hero, Destacados y Footer en la portada', () => {
    render(<App />);

    // Navbar
    expect(screen.getByRole('button', { name: /^inicio$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^catálogo$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^contacto$/i })).toBeInTheDocument();

    // Hero
    expect(screen.getByText(/diseño que honra el pasado y abraza el futuro/i)).toBeInTheDocument();

    // Destacados
    expect(screen.getByText(/piezas destacadas/i)).toBeInTheDocument();

    // Footer
    expect(screen.getByText(/2026 Hermanos Jota. Todos los derechos reservados./i)).toBeInTheDocument();
  });

  test('Permite navegar al Catálogo y filtrar productos', () => {
    render(<App />);

    // Click en Catálogo en el navbar
    const catalogoBtn = screen.getByRole('button', { name: /^catálogo$/i });
    fireEvent.click(catalogoBtn);

    // Debe mostrar el buscador y los productos
    const searchInput = screen.getByPlaceholderText(/ej: sillón, mesa, silla/i);
    expect(searchInput).toBeInTheDocument();

    // Filtrar por "Mendoza"
    fireEvent.change(searchInput, { target: { value: 'mendoza' } });
    expect(screen.getByText('Butaca Mendoza')).toBeInTheDocument();
    expect(screen.queryByText('Biblioteca Recoleta')).not.toBeInTheDocument();

    // Limpiar búsqueda
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Biblioteca Recoleta')).toBeInTheDocument();
  });

  test('Permite seleccionar un producto y ver su ProductDetail con especificaciones', () => {
    render(<App />);

    // Navegar al catálogo
    fireEvent.click(screen.getByRole('button', { name: /^catálogo$/i }));

    // Click en el producto Aparador Uspallata
    const cardLink = screen.getByLabelText(/ver detalle de aparador uspallata/i);
    fireEvent.click(cardLink);

    // Debe mostrar ProductDetail
    expect(screen.getByText('Aparador bajo de líneas rectas en roble macizo con puertas abatibles y patas cónicas de madera torneada. Su interior cuenta con estantes regulables, ideal para living o comedor, combinando guardado funcional con una estética cálida y atemporal.')).toBeInTheDocument();
    expect(screen.getByText('160 × 45 × 75 cm')).toBeInTheDocument();
    expect(screen.getByText(/roble macizo fsc/i)).toBeInTheDocument();

    // Añadir al carrito desde el detalle
    const addBtn = screen.getByRole('button', { name: /añadir al carrito/i });
    fireEvent.click(addBtn);

    expect(screen.getByText('Producto añadido al carrito.')).toBeInTheDocument();

    // El badge del carrito debe incrementarse a 1
    const badge = document.querySelector('#cart-count');
    expect(badge).toHaveTextContent('1');

    // Volver al catálogo
    const backBtn = screen.getByRole('button', { name: /volver al catálogo →/i });
    fireEvent.click(backBtn);

    // Debe volver a la lista
    expect(screen.getByPlaceholderText(/ej: sillón, mesa, silla/i)).toBeInTheDocument();
  });

  test('Permite navegar a Contacto y enviar el formulario controlado', () => {
    render(<App />);

    // Navegar a Contacto
    fireEvent.click(screen.getByRole('button', { name: /^contacto$/i }));

    // Comprobar campos del ContactForm
    const nameInput = screen.getByLabelText(/^nombre/i);
    const emailInput = screen.getByLabelText(/^email/i);
    const messageInput = screen.getByLabelText(/^mensaje/i);

    fireEvent.change(nameInput, { target: { value: 'Juan Pérez' } });
    fireEvent.change(emailInput, { target: { value: 'juan@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Hola, quisiera consultar por stock.' } });

    expect(nameInput.value).toBe('Juan Pérez');
    expect(emailInput.value).toBe('juan@example.com');
    expect(messageInput.value).toBe('Hola, quisiera consultar por stock.');

    // Enviar mensaje
    const submitBtn = screen.getByRole('button', { name: /enviar mensaje/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/¡gracias! recibimos tu mensaje\. te contactaremos pronto\./i)).toBeInTheDocument();
    expect(nameInput.value).toBe('');
  });
});
