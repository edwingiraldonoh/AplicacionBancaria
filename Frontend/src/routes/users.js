const express = require('express');
const router = express.Router();
const usersService = require('../services/usersService');

function formatError(error) {
  return error?.response?.data?.message ||
        (error?.response?.data ? JSON.stringify(error.response.data) : error.message);
}

// Ruta para el formulario de registro
router.post('/register', async (req, res) => {
  try {
    // Llamamos al servicio para registrar el usuario en el backend de Java
    await usersService.registerUser(req.body);
    req.flash('success', '¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
    res.redirect('/');
  } catch (error) {
    const errorMsg = formatError(error);
    console.error('Register error:', errorMsg);
    req.flash('error', `Error en el registro: ${errorMsg}`);
    res.redirect('/');
  }
});

// Ruta para el inicio de sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await usersService.loginUser({ email, password });
        const user = response.data;

        if (!user || !user.id) {
            throw new Error('Credenciales inválidas. Por favor, inténtalo de nuevo.');
        }

        req.session.user = user;

        // ⬇️ AGREGAR: Guardar también en flash para que el frontend lo tome
        req.flash('userData', JSON.stringify(user));

        res.redirect('/dashboard');
    } catch (error) {
        const errorMsg = formatError(error);
        console.error('Login error:', errorMsg);
        req.flash('error', `Error al iniciar sesión: ${errorMsg}`);
        res.redirect('/');
    }
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/dashboard'); // Si hay error, que se quede ahí
    }
    res.clearCookie('connect.sid'); // Limpiamos la cookie de sesión
    res.redirect('/');
  });
});

module.exports = router;