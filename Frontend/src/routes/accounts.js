const express = require('express');
const router = express.Router();
const accountsService = require('../services/accountsService');
const usersService = require('../services/usersService');

// Listar cuentas
router.get('/', async (req, res) => {
  try {
    const cuentas = await accountsService.getAccounts();
    const usuarios = await usersService.getUsers();
    res.render('accounts', { cuentas, usuarios, loading: false, error: null });
  } catch (error) {
    res.render('accounts', { cuentas: [], usuarios: [], loading: false, error: error.message });
  }
});

// Crear cuenta
router.post('/accounts', async (req, res) => {
  try {
    // req.body debe ser CreateAccountDTO
    await accountsService.createAccount(req.body);
    res.redirect('/');
  } catch (error) {
  const cuentas = await accountsService.getAccounts();
  const usuarios = await usersService.getUsers();
  res.render('accounts', { cuentas, usuarios, loading: false, error: error.message });
  }
});

// Editar cuenta
router.post('/accounts/update', async (req, res) => {
  try {
    // req.body debe ser UpdateAccountDTO
    await accountsService.updateAccount(req.body);
    res.redirect('/');
  } catch (error) {
  const cuentas = await accountsService.getAccounts();
  const usuarios = await usersService.getUsers();
  res.render('accounts', { cuentas, usuarios, loading: false, error: error.message });
  }
});

// Eliminar cuenta
router.post('/accounts/:id/delete', async (req, res) => {
  try {
    await accountsService.deleteAccount(req.params.id);
    res.redirect('/');
  } catch (error) {
  const cuentas = await accountsService.getAccounts();
  const usuarios = await usersService.getUsers();
  res.render('accounts', { cuentas, usuarios, loading: false, error: error.message });
  }
});

module.exports = router;
