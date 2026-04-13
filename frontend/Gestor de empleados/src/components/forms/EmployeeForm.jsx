import React, { useState, useEffect } from 'react';
import { departmentService, positionService } from '../../services/employeeService';
import './EmployeeForm.css';

/**
 * Componente de formulario reutilizable para crear/editar empleados
 * @param {Object} employee - Empleado existente (null para crear nuevo)
 * @param {Function} onSubmit - Función callback al enviar el formulario
 * @param {Function} onCancel - Función callback al cancelar
 */
const EmployeeForm = ({ employee = null, onSubmit, onCancel }) => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    codigo_empleado: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    fecha_contratacion: '',
    salario: '',
    activo: true,
    departamento_id: '',
    Posicion_id: ''
  });

  // Estados para las listas de departamentos y posiciones
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  
  // Estados para UI
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  // Cargar departamentos y posiciones al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [depts, poss] = await Promise.all([
          departmentService.getAll(),
          positionService.getAll()
        ]);
        setDepartments(depts);
        setPositions(poss);
      } catch (error) {
        console.error('Error loading form data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Si estamos editando, poblar el formulario con los datos del empleado
  useEffect(() => {
    if (employee) {
      setFormData({
        codigo_empleado: employee.codigo_empleado || '',
        nombre: employee.nombre || '',
        apellido: employee.apellido || '',
        email: employee.email || '',
        telefono: employee.telefono || '',
        fecha_nacimiento: employee.fecha_nacimiento || '',
        fecha_contratacion: employee.fecha_contratacion || '',
        salario: employee.salario || '',
        activo: employee.activo !== undefined ? employee.activo : true,
        departamento_id: employee.departamento?.id || '',
        Posicion_id: employee.Posicion?.id || ''
      });
    }
  }, [employee]);

  /**
   * Maneja cambios en los campos del formulario
   * Actualiza el estado formData con el valor del campo modificado
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Valida los campos del formulario
   * Retorna true si todos los campos son válidos
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.codigo_empleado.trim()) {
      newErrors.codigo_empleado = 'El código de empleado es requerido';
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.fecha_contratacion) {
      newErrors.fecha_contratacion = 'La fecha de contratación es requerida';
    }

    if (!formData.salario || parseFloat(formData.salario) <= 0) {
      newErrors.salario = 'El salario debe ser mayor a 0';
    }

    if (!formData.departamento_id) {
      newErrors.departamento_id = 'Debe seleccionar un departamento';
    }

    if (!formData.Posicion_id) {
      newErrors.Posicion_id = 'Debe seleccionar una posición';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Maneja el envío del formulario
   * Previene el comportamiento por defecto del navegador
   */
  const handleSubmit = async (e) => {
    // IMPORTANTE: Prevenir el comportamiento por defecto
    // Sin esto, el navegador recarga la página
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Preparar datos para enviar (convertir tipos)
      const dataToSubmit = {
        ...formData,
        salario: parseFloat(formData.salario),
        departamento_id: parseInt(formData.departamento_id),
        Posicion_id: parseInt(formData.Posicion_id),
        telefono: formData.telefono || null,
        fecha_nacimiento: formData.fecha_nacimiento || null
      };

      // Llamar a la función onSubmit pasada como prop
      await onSubmit(dataToSubmit);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Error al guardar el empleado' });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="form-loading">
        <div className="spinner"></div>
        <p>Cargando formulario...</p>
      </div>
    );
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{employee ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
        <p>Complete todos los campos requeridos (*)</p>
      </div>

      {errors.submit && (
        <div className="form-error-banner">
          {errors.submit}
        </div>
      )}

      <div className="form-grid">
        {/* Código de Empleado */}
        <div className="form-group">
          <label htmlFor="codigo_empleado">
            Código de Empleado <span className="required">*</span>
          </label>
          <input
            type="text"
            id="codigo_empleado"
            name="codigo_empleado"
            value={formData.codigo_empleado}
            onChange={handleChange}
            className={errors.codigo_empleado ? 'error' : ''}
            placeholder="EMP001"
          />
          {errors.codigo_empleado && (
            <span className="error-message">{errors.codigo_empleado}</span>
          )}
        </div>

        {/* Nombre */}
        <div className="form-group">
          <label htmlFor="nombre">
            Nombre <span className="required">*</span>
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={errors.nombre ? 'error' : ''}
            placeholder="Juan"
          />
          {errors.nombre && (
            <span className="error-message">{errors.nombre}</span>
          )}
        </div>

        {/* Apellido */}
        <div className="form-group">
          <label htmlFor="apellido">
            Apellido <span className="required">*</span>
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={errors.apellido ? 'error' : ''}
            placeholder="Pérez"
          />
          {errors.apellido && (
            <span className="error-message">{errors.apellido}</span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">
            Email <span className="required">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="juan.perez@example.com"
          />
          {errors.email && (
            <span className="error-message">{errors.email}</span>
          )}
        </div>

        {/* Teléfono */}
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+54 261 1234567"
          />
        </div>

        {/* Fecha de Nacimiento */}
        <div className="form-group">
          <label htmlFor="fecha_nacimiento">Fecha de Nacimiento</label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleChange}
          />
        </div>

        {/* Fecha de Contratación */}
        <div className="form-group">
          <label htmlFor="fecha_contratacion">
            Fecha de Contratación <span className="required">*</span>
          </label>
          <input
            type="date"
            id="fecha_contratacion"
            name="fecha_contratacion"
            value={formData.fecha_contratacion}
            onChange={handleChange}
            className={errors.fecha_contratacion ? 'error' : ''}
          />
          {errors.fecha_contratacion && (
            <span className="error-message">{errors.fecha_contratacion}</span>
          )}
        </div>

        {/* Salario */}
        <div className="form-group">
          <label htmlFor="salario">
            Salario <span className="required">*</span>
          </label>
          <input
            type="number"
            id="salario"
            name="salario"
            value={formData.salario}
            onChange={handleChange}
            className={errors.salario ? 'error' : ''}
            placeholder="50000"
            step="0.01"
            min="0"
          />
          {errors.salario && (
            <span className="error-message">{errors.salario}</span>
          )}
        </div>

        {/* Departamento - SELECT dinámico */}
        <div className="form-group">
          <label htmlFor="departamento_id">
            Departamento <span className="required">*</span>
          </label>
          <select
            id="departamento_id"
            name="departamento_id"
            value={formData.departamento_id}
            onChange={handleChange}
            className={errors.departamento_id ? 'error' : ''}
          >
            <option value="">Seleccione un departamento</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.nombre}
              </option>
            ))}
          </select>
          {errors.departamento_id && (
            <span className="error-message">{errors.departamento_id}</span>
          )}
        </div>

        {/* Posición - SELECT dinámico */}
        <div className="form-group">
          <label htmlFor="Posicion_id">
            Posición <span className="required">*</span>
          </label>
          <select
            id="Posicion_id"
            name="Posicion_id"
            value={formData.Posicion_id}
            onChange={handleChange}
            className={errors.Posicion_id ? 'error' : ''}
          >
            <option value="">Seleccione una posición</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>
                {pos.titulo}
              </option>
            ))}
          </select>
          {errors.Posicion_id && (
            <span className="error-message">{errors.Posicion_id}</span>
          )}
        </div>

        {/* Estado Activo - Checkbox */}
        <div className="form-group checkbox-group">
          <label htmlFor="activo" className="checkbox-label">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={formData.activo}
              onChange={handleChange}
            />
            <span>Empleado Activo</span>
          </label>
        </div>
      </div>

      {/* Botones de acción */}
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
            employee ? 'Actualizar Empleado' : 'Crear Empleado'
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;