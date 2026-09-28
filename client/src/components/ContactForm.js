import React, { useState } from 'react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [mensajeExito, setMensajeExito] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMensajeExito('¡Gracias! Recibimos tu mensaje. Te contactaremos pronto.');
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  return (
    <section className="contact-section">
      <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre</label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          value={formData.name}
          onChange={handleChange}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="message">Mensaje</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          minLength={10}
          value={formData.message}
          onChange={handleChange}
        />

        <button className="btn" type="submit">
          ENVIAR MENSAJE
        </button>

        {mensajeExito && (
          <p id="form-message" className="form-message" aria-live="polite">
            {mensajeExito}
          </p>
        )}
      </form>

      <aside className="contact-info">
        <h2>Casa Taller</h2>
        <p>
          Av. San Juan 2847<br />
          San Cristóbal, CABA
        </p>
        <p>
          Lunes a viernes: 10:00–19:00<br />
          Sábados: 10:00–14:00
        </p>
        <p>info@hermanosjota.com.ar</p>
      </aside>
    </section>
  );
}

export default ContactForm;
