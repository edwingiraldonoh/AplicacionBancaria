import React, { useState } from 'react';
import { useCuentas } from '../hooks/useCuentas';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { Spinner } from '../../../components/common/Spinner';

export const CuentaForm = ({ onSuccess, onCancel }) => {
  const { crearCuenta } = useCuentas();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountType: '',
    saldo: '',
    customerId: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'El número de cuenta es requerido';
    }
    
    if (!formData.accountType.trim()) {
      newErrors.accountType = 'El tipo de cuenta es requerido';
    }
    
    if (!formData.saldo || parseFloat(formData.saldo) < 0) {
      newErrors.saldo = 'El saldo debe ser un número positivo';
    }
    
    if (!formData.customerId) {
      newErrors.customerId = 'El ID del cliente es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await crearCuenta({
        ...formData,
        saldo: parseFloat(formData.saldo),
        customerId: parseInt(formData.customerId)
      });
      onSuccess();
      setFormData({ accountNumber: '', accountType: '', saldo: '', customerId: '' });
    } catch (error) {
      console.error('Error al crear cuenta:', error);
      alert('Error al crear la cuenta. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Crear Nueva Cuenta</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Número de Cuenta"
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
            error={errors.accountNumber}
            placeholder="Ej: 1234567890"
          />
          
          <Input
            label="Tipo de Cuenta"
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            error={errors.accountType}
            placeholder="Ej: Ahorros, Corriente"
          />
          
          <Input
            label="Saldo Inicial"
            name="saldo"
            type="number"
            value={formData.saldo}
            onChange={handleChange}
            error={errors.saldo}
            placeholder="0.00"
            step="0.01"
          />
          
          <Input
            label="ID del Cliente"
            name="customerId"
            type="number"
            value={formData.customerId}
            onChange={handleChange}
            error={errors.customerId}
            placeholder="ID del usuario"
          />
        </div>
        
        <div className="flex space-x-3 mt-6">
          <Button 
            type="submit" 
            disabled={loading}
            className="flex-1"
          >
            {loading ? <Spinner size="small" /> : 'Crear Cuenta'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};