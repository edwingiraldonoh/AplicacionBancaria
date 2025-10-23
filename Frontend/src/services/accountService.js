import api from './api';

export const accountService = {
  getAll: () => api.get('/accounts/all'),
  getById: (id) => api.get(`/accounts/${id}`),
  getByAccountNumber: (accountNumber) => api.get(`/accounts/byNumber/${accountNumber}`),
  create: (createAccountDTO) => api.post('/accounts', createAccountDTO),
  update: (updateAccountDTO) => api.put('/accounts/update', updateAccountDTO),
  delete: (id) => api.delete(`/accounts/${id}`),
};