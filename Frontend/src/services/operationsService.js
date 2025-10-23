import api from './api';

export const operationsService = {
  getAll: () => api.get('/operations/all'),
  getById: (id) => api.get(`/operations/${id}`),
  create: (createOperationsDTO) => api.post('/operations', createOperationsDTO),
  update: (updateOperationsDTO) => api.put('/operations/update', updateOperationsDTO),
  delete: (id) => api.delete(`/operations/${id}`),
  performTransaction: (transactionRequestDTO) => api.post('/operations/transaction', transactionRequestDTO),
};