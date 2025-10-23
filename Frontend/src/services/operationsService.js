const axios = require('axios');

const API_URL = process.env.OPERATIONS_API_URL || 'http://localhost:8080/operations';

module.exports = {
  getOperations: async () => {
    const res = await axios.get(`${API_URL}/all`);
    return res.data;
  },
  createOperation: async (data) => {
    // data debe ser CreateOperationsDTO
    await axios.post(API_URL, data);
  },
  updateOperation: async (data) => {
    // data debe ser UpdateOperationsDTO
    await axios.put(`${API_URL}/update`, data);
  },
  getOperationById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  deleteOperation: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
