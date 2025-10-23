import { useState } from 'react';
import { accountService } from '../../../services/accountService';

export const useCuentas = () => {
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarCuentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accountService.getAll();
      setCuentas(response.data);
    } catch (err) {
      setError('Error al cargar las cuentas');
    } finally {
      setLoading(false);
    }
  };

  const crearCuenta = async (cuentaData) => {
    try {
      const response = await accountService.create(cuentaData);
      await cargarCuentas(); // Recargar la lista
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const eliminarCuenta = async (id) => {
    try {
      await accountService.delete(id);
      await cargarCuentas(); // Recargar la lista
    } catch (err) {
      throw err;
    }
  };

  return {
    cuentas,
    loading,
    error,
    cargarCuentas,
    crearCuenta,
    eliminarCuenta
  };
};