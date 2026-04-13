import React, { useState, useEffect } from 'react';
import { positionService } from '../services/employeeService';
import DataTable from '../components/DataTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import PositionForm from '../components/forms/PositionForm';
import './Page.css';

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await positionService.getAll();
      setPositions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  // función que PositionForm llamará para crear/actualizar
  const handleSubmit = async (formData) => {
    const created = await positionService.create(formData);
    setShowForm(false);
    await fetchPositions();
    return created;
  };

  const columns = [
    { key: 'id', label: 'ID', width: '10%' },
    { key: 'titulo', label: 'Título', width: '30%' },
    { key: 'descripcion', label: 'Descripción', width: '40%', render: (v) => v || 'Sin descripción' },
    { key: 'creado_en', label: 'Fecha de Creación', width: '20%', render: (v) => new Date(v).toLocaleDateString('es-AR', { year: 'numeric', month: 'short', day: 'numeric' }) },
  ];

  if (loading) return <LoadingSpinner message="Cargando posiciones..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPositions} />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>💼 Posiciones</h1>
          <p>Gestión de posiciones / cargos</p>
        </div>

        <div>
          <button className="btn btn-primary" onClick={openForm}>
            + Agregar Posición
          </button>
        </div>
      </div>

      <div className="page-stats">
        <div className="stat-box">
          <span className="stat-label">Total Posiciones</span>
          <span className="stat-value">{positions.length}</span>
        </div>
      </div>

      <DataTable data={positions} columns={columns} emptyMessage="No hay posiciones registradas" />

      {showForm && (
        <div className="modal-backdrop">
          <div className="modal">
            <PositionForm onCancel={closeForm} onSubmit={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionsPage;