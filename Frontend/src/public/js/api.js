const API_BASE_URL = 'http://localhost:8080';

async function fetchAPI(endpoint, options = {}) {
    try {
        const userData = sessionStorage.getItem('user');
        let authHeaders = {};

        if (userData) {
            const user = JSON.parse(userData);
            authHeaders = {
                'User-Id': user.id,
                'User-DNI': user.dni
            };
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
                ...options.headers,
            },
            credentials: 'include',
            ...options,
        });

        console.log(`🔍 API Response [${endpoint}]:`, response.status, response.statusText);

        if (!response.ok) {
            const contentType = response.headers.get('content-type');
            let errorData = {};

            if (contentType && contentType.includes('application/json')) {
                errorData = await response.json();
            } else {
                const errorText = await response.text();
                errorData.message = errorText || `Error ${response.status}: ${response.statusText}`;
            }

            throw new Error(errorData.message || `Error ${response.status}`);
        }

        // CORRECCIÓN: Siempre retornar algo, incluso si no es JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const jsonResponse = await response.json();
            console.log(`🔍 API JSON Response [${endpoint}]:`, jsonResponse);
            return jsonResponse;
        }

        // Si no es JSON, retornar el texto o un objeto de éxito
        const textResponse = await response.text();
        console.log(`🔍 API Text Response [${endpoint}]:`, textResponse);

        // Si hay texto, retornarlo, sino retornar un objeto de éxito por defecto
        return textResponse ? { success: true, message: textResponse } : { success: true };

    } catch (error) {
        console.error(`❌ API Error en ${endpoint}:`, error);
        throw error;
    }
}

// Funciones específicas de la API - MEJORADAS
const createAccount = (accountData) => fetchAPI('/api/accounts', {
    method: 'POST',
    body: JSON.stringify(accountData),
});

const getOperationsByAccountId = (accountId) => fetchAPI(`/api/operations/account/${accountId}`);

const getAccountByNumber = (accountNumber) => fetchAPI(`/api/accounts/byNumber/${accountNumber}`);

// FUNCIÓN MEJORADA con mejor logging
const performTransaction = async (transactionData) => {
    console.log('📤 Enviando transacción:', transactionData);
    try {
        const result = await fetchAPI('/api/operations/transaction', {
            method: 'POST',
            body: JSON.stringify(transactionData),
        });
        console.log('✅ Transacción exitosa, respuesta:', result);
        return result;
    } catch (error) {
        console.error('❌ Error en performTransaction:', error);
        throw error;
    }
};

const changePassword = (passwordData) => fetchAPI('/api/users/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
});

// Exportar funciones
window.performTransaction = performTransaction;
window.getAccountByNumber = getAccountByNumber;
window.createAccount = createAccount;
window.changePassword = changePassword;