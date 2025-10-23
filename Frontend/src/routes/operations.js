const express = require('express');
const router = express.Router();
const accountsService = require('../services/accountsService'); // Necesitaremos las cuentas para el filtro
const operationsService = require('../services/operationsService');

function formatError(error) {
  return error?.response?.data?.message ||
        (error?.response?.data ? JSON.stringify(error.response.data) : error.message);
}

/**
 * Maneja errores, registra en consola e intenta renderizar la vista de operaciones con datos actualizados y un mensaje de error.
 * @param {object} res - El objeto de respuesta de Express.
 * @param {Error} error - El error capturado.
 */
async function handleErrorAndRender(res, error) {
  const errorMsg = formatError(error);
  console.error('Operations error:', errorMsg, error?.response?.data || error);
  try {
    const operaciones = await operationsService.getOperations();
    return res.render('operations', { operaciones, loading: false, error: errorMsg });
  } catch (fetchError) {
    return res.render('operations', { operaciones: [], loading: false, error: errorMsg });
  }
}

// Listar operaciones
router.get('/', async (req, res) => {
  const { accountId } = req.query;
  try {
    // Obtenemos todas las cuentas para poblar el dropdown de filtro
    const accounts = await accountsService.getAccounts();

    let operaciones = [];
    if (accountId) {
      // Si hay un accountId, filtramos las operaciones
      operaciones = await operationsService.getOperationsByAccount(accountId);
    } else {
      // Si no, obtenemos todas
      operaciones = await operationsService.getOperations();
    }

    res.render('operations', { operaciones, accounts, selectedAccountId: accountId, error: null, loading: false });
  } catch (error) {
    const errorMsg = formatError(error);
    console.error('Operations GET error:', errorMsg, error?.response?.data || error);
    res.render('operations', { operations: [], accounts: [], selectedAccountId: accountId, error: errorMsg, loading: false });
  }
});

// Crear operación
router.post('/', async (req, res) => {
  try {
    await operationsService.createOperation(req.body);
    req.flash('success', '¡Operación creada exitosamente!');
    res.redirect('/operations');
  } catch (error) {
    await handleErrorAndRender(res, error);
  }
});

// Editar operación
router.post('/update', async (req, res) => {
  try {
    // Normalizar body por si el form envía accountId
    if (req.body.accountId && !req.body.account) req.body.account = req.body.accountId;
    console.log('Operations UPDATE payload:', req.body);
    await operationsService.updateOperation(req.body);
    req.flash('success', '¡Operación actualizada exitosamente!');
    res.redirect('/operations');
  } catch (error) {
    await handleErrorAndRender(res, error);
  }
});

// Eliminar operación
router.post('/:id/delete', async (req, res) => {
  try {
    await operationsService.deleteOperation(req.params.id);
    req.flash('success', '¡Operación eliminada exitosamente!');
    res.redirect('/operations');
  } catch (error) {
    await handleErrorAndRender(res, error);
  }
});

// Ruta para manejar transacciones (depósitos y retiros)
router.post('/transaction', async (req, res) => {
  try {
    // El cuerpo del form debe tener: accountId, amount, type ('DEPOSITO' o 'RETIRO')
    await operationsService.performTransaction(req.body);
    req.flash('success', `¡${req.body.type.charAt(0).toUpperCase() + req.body.type.slice(1).toLowerCase()} realizado exitosamente!`);
    res.redirect(`/operations?accountId=${req.body.accountId}`); // Redirigir a la lista filtrada
  } catch (error) {
    const errorMsg = formatError(error);
    // En caso de error, volvemos a renderizar la vista con los datos necesarios y el mensaje de error.
    try {
      const accounts = await accountsService.getAccounts();
      const operations = await operationsService.getOperationsByAccount(req.body.accountId);
      res.render('operations', { operations, accounts, selectedAccountId: req.body.accountId, error: `Error en la transacción: ${errorMsg}`, loading: false });
    } catch (renderError) {
      // Si incluso la recarga de datos falla, mostramos un error genérico.
      res.render('operations', { operations: [], accounts: [], selectedAccountId: req.body.accountId, error: `Error en la transacción: ${errorMsg}`, loading: false });
    }
  }
});

module.exports = router;
