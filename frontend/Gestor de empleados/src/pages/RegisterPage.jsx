import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/employeeService';
import './LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', full_name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register(form); // usa la función existente del service
      // redirige al login después del registro
      navigate('/login', { replace: true });
    } catch (err) {
      // muestra mensaje del backend si viene en err.response / err.message
      setError(err?.message || (err?.response && err.response.data) || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Crear cuenta</h2>
      <p>Regístrate para administrar empleados</p>

      {error && <div className="form-error-banner">{error}</div>}

      <form className="modern-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario</label>
          <input name="username" value={form.username} onChange={handleChange} required autoFocus />
        </div>

        <div className="form-group">
          <label>Correo</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" />
        </div>

        <div className="form-group">
          <label>Nombre completo</label>
          <input name="full_name" value={form.full_name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Contraseña</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" required />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-cancel" onClick={() => navigate('/login')} disabled={loading}>
            Volver
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;