import api from './api';

export const usersService = {
  getAll: () => api.get('/users/all'),
  getById: (id) => api.get(`/users/${id}`),
  create: (createUsersDTO) => api.post('/users', createUsersDTO),
  update: (updateUsersDTO) => api.put('/users/update', updateUsersDTO),
  delete: (id) => api.delete(`/users/${id}`),
  login: (loginRequest) => api.post('/users/login', loginRequest),
};