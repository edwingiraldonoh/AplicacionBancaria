const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:8080/account';

module.exports = {
  getAccounts: async () => {
    const res = await axios.get(`${API_URL}/all`);
    return res.data;
  },
  createAccount: async (data) => {
    // data debe ser CreateAccountDTO
    await axios.post(API_URL, data);
  },
  updateAccount: async (data) => {
    // data debe ser UpdateAccountDTO
    await axios.put(`${API_URL}/update`, data);
  },
  getAccountById: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },
  deleteAccount: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  }
};
