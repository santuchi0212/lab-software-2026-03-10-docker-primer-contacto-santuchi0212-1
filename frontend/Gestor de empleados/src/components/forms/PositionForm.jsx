import React, { useState, useEffect } from 'react';
import './FormStyles.css';

const PositionForm = ({ position = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    salario_min: '',
    salario_max: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (position) {
      setFormData({
        titulo: position.titulo || '',
        descripcion: position.descripcion || '',
        salario_min: position.salario_min || '',
        salario_max: position.salario_max || ''
      });
    }
  }, [position]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (formData.salario_min && formData.salario_max) {
      if (parseFloat(formData.salario_min) > parseFloat(formData.salario_max)) {
        newErrors.salario_max = 'El salario máximo debe ser mayor al mínimo';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        salario_min: formData.salario_min ? parseFloat(formData.salario_min) : null,
        salario_max: formData.salario_max ? parseFloat(formData.salario_max) : null
      };

      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Error al guardar la posición' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{position ? '✏️ Editar Posición' : '➕ Nueva Posición'}</h2>
        <p>Complete la información de la posición</p>
      </div>

      {errors.submit && (
        <div className="form-error-banner">
          {errors.submit}
        </div>
      )}

      <div className="form-body">
        <div className="form-group full-width">
          <label htmlFor="titulo">
            Título de la Posición <span className="required">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            className={errors.titulo ? 'error' : ''}
            placeholder="Ej: Desarrollador Senior"
            autoFocus
          />
          {errors.titulo && (
            <span className="error-message">{errors.titulo}</span>
          )}
        </div>

        <div className="form-group full-width">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            placeholder="Descripción de responsabilidades y requisitos..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="salario_min">Salario Mínimo</label>
          <input
            type="number"
            id="salario_min"
            name="salario_min"
            value={formData.salario_min}
            onChange={handleChange}
            placeholder="50000"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="salario_max">Salario Máximo</label>
          <input
            type="number"
            id="salario_max"
            name="salario_max"
            value={formData.salario_max}
            onChange={handleChange}
            className={errors.salario_max ? 'error' : ''}
            placeholder="80000"
            step="0.01"
            min="0"
          />
          {errors.salario_max && (
            <span className="error-message">{errors.salario_max}</span>
          )}
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-cancel"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="btn-spinner"></span>
              Guardando...
            </>
          ) : (
            position ? 'Actualizar' : 'Crear Posición'
          )}
        </button>
      </div>
    </form>
  );
};

export default PositionForm;