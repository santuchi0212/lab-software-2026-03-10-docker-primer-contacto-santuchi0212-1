import React, { useState, useEffect } from 'react';
import './EmployeesPage.css';
import EmployeeForm from '../components/forms/EmployeeForm';
import DataTable from '../components/DataTable';
import { employeeService } from '../services/employeeService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './Page.css';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el modal de formulario
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [operationMessage, setOperationMessage] = useState(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Manejar creación de nuevo empleado
  const handleCreate = () => {
    setEditingEmployee(null);
    setShowForm(true);
    setOperationMessage(null);
  };

  // Manejar edición de empleado existente
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
    setOperationMessage(null);
  };

  // Manejar eliminación de empleado
  const handleDelete = async (employee) => {
    if (!window.confirm(`¿Está seguro de eliminar a ${employee.nombre} ${employee.apellido}?`)) {
      return;
    }

    try {
      await employeeService.delete(employee.id);
      
      // Actualizar la lista localmente (sin recargar desde la API)
      setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
      
      setOperationMessage({
        type: 'success',
        text: 'Empleado eliminado correctamente'
      });
      
      setTimeout(() => setOperationMessage(null), 3000);
    } catch (err) {
      setOperationMessage({
        type: 'error',
        text: `Error al eliminar: ${err.message}`
      });
    }
  };

  // Manejar envío del formulario (crear o actualizar)
  const handleFormSubmit = async (formData) => {
    try {
      if (editingEmployee) {
        // ACTUALIZAR empleado existente (PUT)
        const updated = await employeeService.update(editingEmployee.id, formData);
        
        // Actualizar la lista localmente
        setEmployees(prev => 
          prev.map(emp => emp.id === editingEmployee.id ? updated : emp)
        );
        
        setOperationMessage({
          type: 'success',
          text: 'Empleado actualizado correctamente'
        });
      } else {
        // CREAR nuevo empleado (POST)
        const created = await employeeService.create(formData);
        
        // Agregar a la lista localmente
        setEmployees(prev => [...prev, created]);
        
        setOperationMessage({
          type: 'success',
          text: 'Empleado creado correctamente'
        });
      }

      // Cerrar formulario
      setShowForm(false);
      setEditingEmployee(null);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setOperationMessage(null), 3000);
      
    } catch (err) {
      throw new Error(err.message || 'Error al guardar el empleado');
    }
  };

  // Manejar cancelación del formulario
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  // Definición de columnas para la tabla
  const columns = [
    { 
      key: 'codigo_empleado', 
      label: 'Código',
      width: '10%'
    },
    { 
      key: 'nombre_completo', 
      label: 'Nombre Completo',
      width: '18%',
      render: (value, row) => value || `${row.nombre} ${row.apellido}`
    },
    { 
      key: 'email', 
      label: 'Email',
      width: '18%'
    },
    { 
      key: 'departamento', 
      label: 'Departamento',
      width: '14%',
      render: (value) => value?.nombre || 'Sin asignar'
    },
    { 
      key: 'Posicion', 
      label: 'Posición',
      width: '14%',
      render: (value) => value?.titulo || 'Sin asignar'
    },
    { 
      key: 'salario', 
      label: 'Salario',
      width: '12%',
      render: (value) => `$${parseFloat(value).toLocaleString('es-AR')}`
    },
    { 
      key: 'activo', 
      label: 'Estado',
      width: '8%',
      render: (value) => (
        <span className={`status-badge ${value ? 'active' : 'inactive'}`}>
          {value ? '✅' : '⭕'}
        </span>
      )
    },
  ];

  // Renderizar botones de acción para cada fila
  const renderActions = (employee) => (
    <div className="action-buttons">
      <button 
        onClick={() => handleEdit(employee)}
        className="btn-action btn-edit"
        title="Editar"
      >
        ✏️
      </button>
      <button 
        onClick={() => handleDelete(employee)}
        className="btn-action btn-delete"
        title="Eliminar"
      >
        🗑️
      </button>
    </div>
  );

  if (loading) return <LoadingSpinner message="Cargando empleados..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchEmployees} />;

  return (
    <div className="page-container">
      {/* Mensaje de operación exitosa/error */}
      {operationMessage && (
        <div className={`operation-message ${operationMessage.type}`}>
          {operationMessage.text}
        </div>
      )}

      {/* Formulario modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <EmployeeForm
              employee={editingEmployee}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        </div>
      )}

      <div className="page-header">
        <div>
          <h1>👥 Empleados</h1>
          <p>Listado y gestión de empleados</p>
        </div>

        <div>
          {/* botón nuevo empleado: usa la clase btn-naranja */}
          <button className="btn-naranja" onClick={handleCreate}>
            + Nuevo Empleado
          </button>
        </div>
      </div>

      <div className="page-stats">
        <div className="stat-box">
          <span className="stat-label">Total</span>
          <span className="stat-value">{employees.length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Activos</span>
          <span className="stat-value active">{employees.filter(e => e.activo).length}</span>
        </div>
        <div className="stat-box">
          <span className="stat-label">Inactivos</span>
          <span className="stat-value inactive">{employees.filter(e => !e.activo).length}</span>
        </div>
      </div>

      <DataTable 
        data={employees}
        columns={columns}
        renderActions={renderActions}
        emptyMessage="No hay empleados registrados"
      />
    </div>
  );
};

export default EmployeesPage;