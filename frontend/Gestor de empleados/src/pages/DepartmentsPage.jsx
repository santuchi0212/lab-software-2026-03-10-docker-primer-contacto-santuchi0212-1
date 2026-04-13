import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/employeeService';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import DepartmentForm from '../components/forms/DepartmentForm';
import './Page.css';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // nuevo estado para mostrar el formulario
  const [showForm, setShowForm] = useState(false);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await departmentService.getAll();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // manejadores para el formulario
  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  // función que DepartmentForm llamará para crear/actualizar
  const handleSubmit = async (formData) => {
    // delegar a service y luego refrescar lista / cerrar modal
    const created = await departmentService.create(formData);
    // cerrar y refrescar lista después de crear/guardar
    setShowForm(false);
    await fetchDepartments();
    return created;
  };

  // Definición de columnas para la tabla reutilizable
  const columns = [
    { 
      key: 'id', 
      label: 'ID',
      width: '10%'
    },
    { 
      key: 'nombre', 
      label: 'Nombre del Departamento',
      width: '30%'
    },
    { 
      key: 'descripcion', 
      label: 'Descripción',
      width: '40%',
      render: (value) => value || 'Sin descripción'
    },
    { 
      key: 'creado_en', 
      label: 'Fecha de Creación',
      width: '20%',
      render: (value) => new Date(value).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },
  ];

  if (loading) return <LoadingSpinner message="Cargando departamentos..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchDepartments} />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>🏢 Departamentos</h1>
          <p>Gestión de departamentos de la organización</p>
        </div>

        {/* botón para abrir formulario */}
        <div>
          <button className="btn btn-primary" onClick={openForm}>
            + Agregar Departamento
          </button>
        </div>
      </div>

      <div className="page-stats">
        <div className="stat-box">
          <span className="stat-label">Total Departamentos</span>
          <span className="stat-value">{departments.length}</span>
        </div>
      </div>

      <DataTable 
        data={departments}
        columns={columns}
        emptyMessage="No hay departamentos registrados"
      />

      {/* modal sencillo para el formulario */}
      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <DepartmentForm onCancel={closeForm} onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;