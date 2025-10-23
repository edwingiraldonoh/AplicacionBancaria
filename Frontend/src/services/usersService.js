const axios = require('axios');

// Asegúrate de que la URL base apunte a tu backend de Java
const API_URL = 'http://localhost:8080/api'; // Cambia el puerto si es diferente

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Registra un nuevo usuario.
 * El backend debe tener un endpoint como POST /api/users
 * @param {object} userData - Datos del usuario { name, dni, email, password }
 */
const registerUser = (userData) => {
    return apiClient.post('/users', userData);
};

/**
 * Autentica a un usuario.
 * El backend debe tener un endpoint como POST /api/users/login
 * @param {object} credentials - { email, password }
 */
const loginUser = (credentials) => {
    // Asumimos que el backend devuelve los datos del usuario y su cuenta al hacer login
    return apiClient.post('/users/login', credentials);
};

module.exports = {
    registerUser,
    loginUser
};