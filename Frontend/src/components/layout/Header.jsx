import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const location = useLocation();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sistema Bancario</h1>
          <nav className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded transition-colors ${
                location.pathname === '/' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Cuentas
            </Link>
            <Link 
              to="/transacciones" 
              className={`px-3 py-2 rounded transition-colors ${
                location.pathname === '/transacciones' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Transacciones
            </Link>
            <Link 
              to="/usuarios" 
              className={`px-3 py-2 rounded transition-colors ${
                location.pathname === '/usuarios' ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              Usuarios
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};