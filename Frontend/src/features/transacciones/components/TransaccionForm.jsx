import React, { useState } from 'react';
import { operationsService } from '../../../services/operationsService';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Spinner } from '../../../components/common/Spinner';

export const TransaccionForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    type: 'DEPOSITO'
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await operationsService.performTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setMessage('¡Transacción realizada con éxito!');
      setFormData({ fromAccount: '', toAccount: '', amount: '', type: 'DEPOSITO' });
    } catch (error) {
      setMessage('Error al realizar la transacción. Verifica los datos.');
      console.error('Transaction error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Realizar Transacción</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Cuenta Origen (DNI)"
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleChange}
              placeholder="DNI de la cuenta origen"
              required
            />
            
            <Input
              label="Cuenta Destino (DNI)"
              name="toAccount"
              value={formData.toAccount}
              onChange={handleChange}
              placeholder="DNI de la cuenta destino"
              required
            />
            
            <Input
              label="Monto"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tipo de Transacción
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DEPOSITO">Depósito</option>
                <option value="RETIRO">Retiro</option>
              </select>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded mb-4 ${
              message.includes('éxito') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? <Spinner size="small" /> : 'Realizar Transacción'}
          </Button>
        </form>
      </div>
    </div>
  );
};