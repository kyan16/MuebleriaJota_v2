// Formato de precio según especificación (Intl.NumberFormat es-AR sin decimales)
export const formatoPrecio = (precio) => {
  if (typeof precio !== 'number') return '$0';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(precio);
};

// Normalizar texto para búsquedas sin tildes e insensible a mayúsculas
export const normalizarTexto = (texto = '') =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
