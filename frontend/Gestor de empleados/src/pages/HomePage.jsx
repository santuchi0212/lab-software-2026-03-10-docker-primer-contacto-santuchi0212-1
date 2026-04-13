import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeService, departmentService, positionService } from '../services/employeeService';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    employees: 0,
    departments: 0,
    positions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        const [emps, depts, pos] = await Promise.all([
          employeeService.getAll(),
          departmentService.getAll(),
          positionService.getAll()
        ]);
        setCounts({
          employees: Array.isArray(emps) ? emps.length : 0,
          departments: Array.isArray(depts) ? depts.length : 0,
          positions: Array.isArray(pos) ? pos.length : 0
        });
      } catch (err) {
        // silenciar; si quieres mostrar error añade estado para ello
        console.error('Error fetching dashboard counts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const Card = ({ variant = 'blue', title, value, emoji, to }) => (
    <div
      className={`stat-card stat-card--${variant}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => { if(e.key === 'Enter') navigate(to); }}
      style={{ cursor: 'pointer' }}
    >
      <div className="stat-icon" aria-hidden>{emoji}</div>
      <div className="stat-title">{title}</div>
      <div className="stat-value">{loading ? '...' : value}</div>
      <div className="stat-link">Ver listado →</div>
    </div>
  );

  return (
    <div className="home-page">
      <section className="page-hero">
        <h1>Bienvenido al Sistema de Gestión</h1>
        <p className="text-muted">Administra empleados, departamentos y posiciones de forma eficiente</p>
      </section>

      <section className="dashboard-grid">
        <Card variant="blue" title="Empleados" value={counts.employees} emoji="👥" to="/employees" />
        <Card variant="green" title="Departamentos" value={counts.departments} emoji="🏢" to="/departments" />
        <Card variant="orange" title="Posiciones" value={counts.positions} emoji="💼" to="/positions" />
      </section>

      {/* quick actions removed as requested */}
    </div>
  );
};

export default HomePage;