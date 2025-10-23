document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.item-de-navegacion');
    const contentContainers = document.querySelectorAll('.vista-contenedor');
    const menuToggle = document.getElementById('alternar-menu');
    const navPrincipal = document.getElementById('navegacion-principal');
    const userHeader = document.querySelector('h2[data-user-id]');
    const userId = userHeader ? userHeader.dataset.userId : null;
    const userDNI = userHeader ? userHeader.dataset.userDni : null;
    const formCrearCuenta = document.getElementById('formulario-crear-cuenta');
    const errorCrearCuenta = document.getElementById('error-crear-cuenta');
    const formCambiarPassword = document.getElementById('formulario-de-cambio-de-contraseña');
    const errorCambiarPassword = document.getElementById('contraseña-erronea');
    const formTransaccion = document.getElementById('formulario-de-transaccion');
    const errorTransaccion = document.getElementById('error-en-transaccion');

    // Manejador de menú lateral (para pantallas pequeñas)
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navPrincipal.classList.toggle('activo');
        });
    }

    // Manejador de navegación (cambio de pestañas)
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // No prevenir el comportamiento por defecto si es el botón de logout
            if (item.id === 'boton-cerrar-sesion') return;

            e.preventDefault();

            const contentId = item.getAttribute('data-content');
            if (!contentId) return;

            navItems.forEach(nav => nav.classList.remove('activo'));
            item.classList.add('activo');

            contentContainers.forEach(container => container.classList.remove('activo'));
            const targetContent = document.getElementById(`content-${contentId}`);
            if (targetContent) {
                targetContent.classList.add('activo');
            }
        });
    });

    // ======================================================================
// MANEJADOR DE TRANSACCIONES CON DIAGNÓSTICO INTEGRADO
// ======================================================================
if (formTransaccion && userDNI) {
    formTransaccion.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log('=== INICIANDO TRANSFERENCIA ===');
        errorTransaccion.style.display = 'none';
        errorTransaccion.textContent = '';

        const fromAccountDNI = userDNI;
        const toAccount = document.getElementById('to-account-number').value;
        const amountInput = document.getElementById('transaction-amount').value;
        const amount = parseFloat(amountInput.replace(/\./g, '').replace(',', '.'));

        // Validaciones
        if (isNaN(amount) || amount <= 0) {
            errorTransaccion.textContent = 'El monto debe ser un número positivo.';
            errorTransaccion.style.display = 'block';
            return;
        }

        if (!toAccount || toAccount.trim() === '') {
            errorTransaccion.textContent = 'El número de cuenta destino es requerido.';
            errorTransaccion.style.display = 'block';
            return;
        }

        const transactionData = {
            fromAccount: fromAccountDNI,
            toAccount: toAccount,
            amount: amount,
            type: 'RETIRO'
        };

        try {
            const submitButton = formTransaccion.querySelector('button[type="submit"]');
            submitButton.textContent = 'Procesando...';
            submitButton.disabled = true;

            // EJECUTAR TRANSFERENCIA
            await performTransaction(transactionData);

            // DIAGNÓSTICO Y ACTUALIZACIÓN MEJORADA
            await smartBalanceUpdate(amount);

            alert(`¡Transferencia de $${amount.toLocaleString('es-CO')} realizada con éxito!`);
            formTransaccion.reset();

        } catch (error) {
            console.error('❌ ERROR EN TRANSFERENCIA:', error);
            errorTransaccion.textContent = `Error: ${error.message}`;
            errorTransaccion.style.display = 'block';
        } finally {
            const submitButton = formTransaccion.querySelector('button[type="submit"]');
            submitButton.textContent = 'Transferir Dinero';
            submitButton.disabled = false;
        }
    });
}

// Función inteligente de actualización con diagnóstico
async function smartBalanceUpdate(amount) {
    console.log('🔄 Iniciando actualización inteligente de saldo...');

    // PRIMERO: Intentar encontrar elementos automáticamente
    const foundElements = await findAndUpdateBalanceElements(amount);

    if (foundElements > 0) {
        console.log(`✅ ${foundElements} elementos actualizados automáticamente`);
        return;
    }

    // SEGUNDO: Si no se encontraron, hacer diagnóstico
    console.log('❌ No se pudieron encontrar elementos automáticamente. Ejecutando diagnóstico...');
    const diagnosticResults = await runBalanceDiagnostic();

    // TERCERO: Recargar como último recurso
    console.log('🔄 Recargando página para actualizar saldos...');
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

// Función mejorada para encontrar y actualizar elementos de saldo
async function findAndUpdateBalanceElements(amount) {
    let updatedCount = 0;

    // Estrategia 1: Buscar por patrones de texto de dinero
    const moneyElements = findElementsByMoneyPattern();
    moneyElements.forEach(item => {
        if (updateElementWithNewBalance(item.element, amount)) {
            updatedCount++;
        }
    });

    // Estrategia 2: Buscar por clases y atributos comunes
    const commonSelectors = [
        '.saldo', '.balance', '.account-balance', '.saldo-actual',
        '.monto', '.amount', '.total', '.valor',
        '[data-saldo]', '[data-balance]', '[data-amount]',
        '.card .amount', '.account .balance', '.balance-display'
    ];

    commonSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (updateElementWithNewBalance(element, amount)) {
                updatedCount++;
            }
        });
    });

    return updatedCount;
}

// Encontrar elementos por patrón de dinero
function findElementsByMoneyPattern() {
    const elements = [];
    const allElements = document.querySelectorAll('*');
    const moneyRegex = /\$?\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/;

    allElements.forEach(el => {
        if (el.children.length === 0) { // Solo elementos hoja
            const text = el.textContent || el.innerText;
            const match = text.match(moneyRegex);
            if (match && match[1]) {
                // Verificar que sea un número razonable (no un año, etc.)
                const potentialBalance = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
                if (potentialBalance > 100 && potentialBalance < 1000000000) { // Entre 100 y 1 billón
                    elements.push({ element: el, originalText: text, balance: potentialBalance });
                }
            }
        }
    });

    return elements;
}

// Actualizar un elemento con nuevo balance
function updateElementWithNewBalance(element, amount) {
    try {
        const originalText = element.textContent || element.innerText;
        console.log('🔍 Analizando elemento:', originalText);

        // Extraer el número del texto
        const cleanText = originalText.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
        const currentBalance = parseFloat(cleanText);

        if (!isNaN(currentBalance) && currentBalance > 0) {
            const newBalance = currentBalance - amount;

            // Formatear el nuevo saldo
            const formattedBalance = new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(newBalance);

            // Actualizar el elemento
            element.textContent = formattedBalance;
            console.log(`✅ Actualizado: ${currentBalance} → ${newBalance}`);
            return true;
        }
    } catch (error) {
        console.warn('No se pudo actualizar elemento:', error);
    }
    return false;
}

// Ejecutar diagnóstico completo
async function runBalanceDiagnostic() {
    console.log('🔍 EJECUTANDO DIAGNÓSTICO COMPLETO...');

    // Buscar todos los elementos posibles
    const allElements = document.querySelectorAll('*');
    const results = [];

    allElements.forEach(el => {
        const text = el.textContent || el.innerText;
        if (text && text.includes('$')) {
            results.push({
                element: el,
                text: text.trim(),
                tagName: el.tagName,
                className: el.className,
                id: el.id
            });
        }
    });

    console.log('📊 RESULTADOS DEL DIAGNÓSTICO:');
    results.forEach((result, index) => {
        console.log(`[${index}] ${result.tagName}.${result.className}#${result.id}: "${result.text}"`);
    });

    return results;
}

    // ======================================================================
    // MANEJADOR DE CREACIÓN DE CUENTAS
    // ======================================================================
    if (formCrearCuenta) {
        formCrearCuenta.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorCrearCuenta.style.display = 'none';
            errorCrearCuenta.textContent = '';

            const accountType = document.getElementById('tipo-de-cuenta').value;
            const initialAmount = parseFloat(document.getElementById('monto-inicial').value);

            if (initialAmount < 0 || isNaN(initialAmount)) {
                errorCrearCuenta.textContent = 'El monto inicial debe ser un número positivo o cero.';
                errorCrearCuenta.style.display = 'block';
                return;
            }

            try {
                const accountData = {
                    userId: userId,
                    accountType: accountType,
                    saldo: initialAmount
                };

                await createAccount(accountData);
                alert('¡Cuenta creada con éxito! Recargue la página para verla.');
                formCrearCuenta.reset();
            } catch (error) {
                errorCrearCuenta.textContent = `Error al crear cuenta: ${error.message}`;
                errorCrearCuenta.style.display = 'block';
            }
        });
    }

    // ======================================================================
    // MANEJADOR DE CAMBIO DE CONTRASEÑA
    // ======================================================================
    if (formCambiarPassword) {
        formCambiarPassword.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorCambiarPassword.style.display = 'none';
            errorCambiarPassword.textContent = '';

            const oldPassword = document.getElementById('vieja-contraseña').value;
            const newPassword = document.getElementById('nueva-contraseña').value;
            const confirmPassword = document.getElementById('confirmar-contraseña').value;

            if (newPassword !== confirmPassword) {
                errorCambiarPassword.textContent = 'La nueva contraseña y la confirmación no coinciden.';
                errorCambiarPassword.style.display = 'block';
                return;
            }

            try {
                const passwordData = {
                    userId: userId,
                    oldPassword: oldPassword,
                    newPassword: newPassword
                };

                await changePassword(passwordData);
                alert('¡Contraseña actualizada con éxito! Debe iniciar sesión de nuevo.');
                window.location.href = '/logout';

            } catch (error) {
                errorCambiarPassword.textContent = `Error al cambiar contraseña: ${error.message}`;
                errorCambiarPassword.style.display = 'block';
            }
        });
    }
});