import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // limpia tokens/usuario cliente (ajusta claves si tu service usa otros nombres)
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  return (
    <div className="main-layout">
      <header className="topbar">
        <div className="brand">
          <div className="logo">DEV</div>
          <div className="brand-name">Cdtech</div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
          <NavLink to="/employees" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Empleados</NavLink>
          <NavLink to="/departments" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Departamentos</NavLink>
          <NavLink to="/positions" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Posiciones</NavLink>
        </nav>

        <div className="user-area">
          <button className="btn btn-ghost" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </header>

      <main className="content-wrap">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;