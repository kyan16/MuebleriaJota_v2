import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resetea el scroll al instante en cada cambio de ruta.
// Debe ser instantáneo: un scroll suave compite con el render de la página
// nueva y produce un parpadeo al navegar.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
