import { useState } from 'react';
import { operationsService } from '../../../services/operationsService';

export const useTransacciones = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const realizarTransaccion = async (transactionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await operationsService.performTransaction(transactionData);
      return response.data;
    } catch (err) {
      setError('Error al realizar la transacción');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    realizarTransaccion
  };
};