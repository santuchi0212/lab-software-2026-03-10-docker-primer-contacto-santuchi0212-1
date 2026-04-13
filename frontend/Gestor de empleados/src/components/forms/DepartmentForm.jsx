import React, { useState, useEffect } from 'react';
import './FormStyles.css';

const DepartmentForm = ({ department = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (department) {
      setFormData({
        nombre: department.nombre || '',
        descripcion: department.descripcion || ''
      });
    }
  }, [department]);

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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
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
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Error al guardar el departamento' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="modern-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{department ? '✏️ Editar Departamento' : '➕ Nuevo Departamento'}</h2>
        <p>Complete la información del departamento</p>
      </div>

      {errors.submit && (
        <div className="form-error-banner">
          {errors.submit}
        </div>
      )}

      <div className="form-body">
        <div className="form-group full-width">
          <label htmlFor="nombre">
            Nombre del Departamento <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            placeholder="Ej: Recursos Humanos"
            autoFocus
          />
          {errors.nombre && (
            <span className="error-message">{errors.nombre}</span>
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
            placeholder="Descripción del departamento..."
          />
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
            department ? 'Actualizar' : 'Crear Departamento'
          )}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;