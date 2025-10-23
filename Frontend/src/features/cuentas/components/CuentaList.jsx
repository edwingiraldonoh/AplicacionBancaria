import React, { useEffect, useState } from 'react';
import { useCuentas } from '../hooks/useCuentas';
import { Spinner } from '../../../components/common/Spinner';
import { Button } from '../../../components/common/Button';
import { CuentaForm } from './CuentaForm';

export const CuentaList = () => {
  const { cuentas, loading, error, cargarCuentas, eliminarCuenta } = useCuentas();
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    cargarCuentas();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta cuenta?')) {
      try {
        await eliminarCuenta(id);
      } catch (err) {
        alert('Error al eliminar la cuenta');
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600 bg-red-100 p-4 rounded">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Cuentas</h2>
        <Button onClick={() => setMostrarForm(!mostrarForm)}>
          {mostrarForm ? 'Cancelar' : 'Nueva Cuenta'}
        </Button>
      </div>

      {mostrarForm && (
        <div className="mb-6">
          <CuentaForm 
            onSuccess={() => {
              setMostrarForm(false);
              cargarCuentas();
            }}
            onCancel={() => setMostrarForm(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cuentas.map((cuenta) => (
          <div key={cuenta.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Cuenta: {cuenta.accountNumber}
            </h3>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Tipo:</span> {cuenta.accountType}
            </p>
            <p className="text-gray-600 mb-1">
              <span className="font-medium">Saldo:</span> ${cuenta.saldo?.toLocaleString()}
            </p>
            <p className="text-gray-600 mb-4">
              <span className="font-medium">Usuario ID:</span> {cuenta.usersId}
            </p>
            <div className="flex space-x-2">
              <Button 
                variant="danger" 
                onClick={() => handleEliminar(cuenta.id)}
                className="text-sm"
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {cuentas.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No hay cuentas registradas
        </div>
      )}
    </div>
  );
};