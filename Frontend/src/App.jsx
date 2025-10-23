import React, { useState, useEffect } from 'react';
import { accountService } from './services/accountService';
import { usersService } from './services/usersService';
import { operationsService } from './services/operationsService';

function App() {
  const [activeTab, setActiveTab] = useState('cuentas');
  const [cuentas, setCuentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [authMode, setAuthMode] = useState('login');

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [cuentasRes, usuariosRes, transaccionesRes] = await Promise.all([
        accountService.getAll(),
        usersService.getAll(),
        operationsService.getAll()
      ]);
      
      setCuentas(cuentasRes.data);
      setUsuarios(usuariosRes.data);
      setTransacciones(transaccionesRes.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showLogin) {
      cargarDatos();
    }
  }, [showLogin]);

  const handleLogin = async (loginData) => {
    try {
      console.log('🔐 Intentando login con:', loginData);
      const response = await usersService.login(loginData);
      console.log('✅ Login exitoso:', response.data);
      setUser(response.data);
      setShowLogin(false);
      cargarDatos();
    } catch (error) {
      console.error('❌ Error en login:', error);
      alert('Error en login: ' + (error.response?.data?.message || 'Credenciales incorrectas'));
    }
  };

  const handleRegister = async (registerData) => {
    try {
      console.log('📝 Registrando usuario:', registerData);
      const response = await usersService.create(registerData);
      console.log('✅ Registro exitoso:', response.data);
      alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
      setAuthMode('login');
    } catch (error) {
      console.error('❌ Error en registro:', error);
      alert('Error en registro: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    setAuthMode('login');
    setCuentas([]);
    setUsuarios([]);
    setTransacciones([]);
  };

  const realizarTransaccion = async (transactionData) => {
    try {
      await operationsService.performTransaction(transactionData);
      alert('Transacción realizada con éxito!');
      cargarDatos();
    } catch (error) {
      alert('Error en transacción: ' + (error.response?.data?.message || error.message));
    }
  };

  if (showLogin) {
    return (
      <AuthForm 
        mode={authMode} 
        onLogin={handleLogin} 
        onRegister={handleRegister}
        onSwitchMode={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
      />
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>🏦 Sistema Bancario</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: '500' }}>Bienvenido, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      
      <main className="main-content">
        <div className="content-wrapper">
          {/* Navegación por pestañas */}
          <div className="tabs-container">
            <div 
              className={activeTab === 'cuentas' ? 'tab active-tab' : 'tab'}
              onClick={() => setActiveTab('cuentas')}
            >
              📊 Cuentas
            </div>
            <div 
              className={activeTab === 'usuarios' ? 'tab active-tab' : 'tab'}
              onClick={() => setActiveTab('usuarios')}
            >
              👥 Usuarios
            </div>
            <div 
              className={activeTab === 'transacciones' ? 'tab active-tab' : 'tab'}
              onClick={() => setActiveTab('transacciones')}
            >
              💰 Transacciones
            </div>
            <div 
              className={activeTab === 'nueva-transaccion' ? 'tab active-tab' : 'tab'}
              onClick={() => setActiveTab('nueva-transaccion')}
            >
              ➕ Nueva Transacción
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="text-gray-600" style={{ fontSize: '1.2rem' }}>Cargando datos...</p>
            </div>
          )}

          {/* Pestaña de Cuentas */}
          {activeTab === 'cuentas' && !loading && (
            <div className="flex-col-center w-full">
              <h2 className="text-gray-800" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>
                Lista de Cuentas Bancarias
              </h2>
              
              <div className="grid-centered">
                {cuentas.map((cuenta) => (
                  <div key={cuenta.id} className="card">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      🏦 Cuenta: {cuenta.accountNumber}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Tipo:</strong> {cuenta.accountType}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Saldo:</strong> ${cuenta.saldo?.toLocaleString()}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Usuario ID:</strong> {cuenta.usersId}
                    </p>
                  </div>
                ))}
              </div>

              {cuentas.length === 0 && (
                <div className="text-center" style={{ padding: '3rem' }}>
                  <p className="text-gray-600" style={{ fontSize: '1.2rem' }}>No hay cuentas registradas en la base de datos</p>
                  <p className="text-gray-600" style={{ marginTop: '0.5rem' }}>
                    Las cuentas se crean automáticamente al registrar usuarios
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pestaña de Usuarios */}
          {activeTab === 'usuarios' && !loading && (
            <div className="flex-col-center w-full">
              <h2 className="text-gray-800" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>
                Lista de Usuarios Registrados
              </h2>
              
              <div className="grid-centered">
                {usuarios.map((usuario) => (
                  <div key={usuario.id} className="card">
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                      👤 {usuario.name}
                    </h3>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Email:</strong> {usuario.email}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>DNI:</strong> {usuario.dni}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Cuenta Principal:</strong> {usuario.accountNumber || 'No asignada'}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Saldo:</strong> ${usuario.saldo?.toLocaleString() || '0'}
                    </p>
                  </div>
                ))}
              </div>

              {usuarios.length === 0 && (
                <div className="text-center" style={{ padding: '3rem' }}>
                  <p className="text-gray-600" style={{ fontSize: '1.2rem' }}>No hay usuarios registrados en la base de datos</p>
                </div>
              )}
            </div>
          )}

          {/* Pestaña de Transacciones */}
          {activeTab === 'transacciones' && !loading && (
            <div className="flex-col-center w-full">
              <h2 className="text-gray-800" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>
                Historial de Transacciones
              </h2>
              
              <div className="grid-centered">
                {transacciones.map((transaccion) => (
                  <div key={transaccion.id} className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                        {transaccion.operationType === 'DEPOSITO' ? '⬆️ Depósito' : '⬇️ Retiro'}
                      </h3>
                      <span style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: transaccion.operationType === 'DEPOSITO' ? '#10b981' : '#ef4444'
                      }}>
                        ${transaccion.amount?.toLocaleString()}
                      </span>
                    </div>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Usuario ID:</strong> {transaccion.usersId}
                    </p>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Cuenta ID:</strong> {transaccion.account}
                    </p>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                      <strong>ID Transacción:</strong> {transaccion.id}
                    </p>
                  </div>
                ))}
              </div>

              {transacciones.length === 0 && (
                <div className="text-center" style={{ padding: '3rem' }}>
                  <p className="text-gray-600" style={{ fontSize: '1.2rem' }}>No hay transacciones registradas</p>
                  <p className="text-gray-600" style={{ marginTop: '0.5rem' }}>
                    Realiza tu primera transacción en la pestaña "Nueva Transacción"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Pestaña de Nueva Transacción */}
          {activeTab === 'nueva-transaccion' && !loading && (
            <div className="flex-col-center w-full">
              <h2 className="text-gray-800" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '3rem' }}>
                Realizar Nueva Transacción
              </h2>
              
              <div className="card" style={{ maxWidth: '500px' }}>
                <TransaccionForm onTransaccionRealizada={realizarTransaccion} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Componente de Autenticación (Login y Registro)
function AuthForm({ mode, onLogin, onRegister, onSwitchMode }) {
  const [formData, setFormData] = useState({
    dni: '',
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') {
      onLogin({ email: formData.email, password: formData.password });
    } else {
      onRegister(formData);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          🏦 Sistema Bancario
        </h2>
        
        <h3 style={{ 
          marginBottom: '2rem',
          color: '#000000ff',
          fontSize: '1.5rem'
        }}>
          {mode === 'login' ? 'Iniciar Sesión' : 'Registrar Usuario'}
        </h3>
        
        <form onSubmit={handleSubmit} className="form-container">
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label className="form-label">
                  DNI (10 dígitos):
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength="10"
                  className="form-input"
                  placeholder="1234567890"
                />
                <small style={{ color: '#000000ff', fontSize: '0.8rem' }}>
                  Debe tener exactamente 10 números
                </small>
              </div>
              
              <div className="form-group">
                <label className="form-label">
                  Nombre Completo:
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  pattern="[A-Za-zÀ-ÿ\s]{2,20}"
                  className="form-input"
                  placeholder="Juan Pérez"
                />
                <small style={{ color: '#000000ff', fontSize: '0.8rem' }}>
                  Solo letras y espacios (2-20 caracteres)
                </small>
              </div>
            </>
          )}
          
          <div className="form-group">
            <label className="form-label">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Contraseña:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="8"
              className="form-input"
              placeholder="••••••••"
            />
            <small style={{ color: '#000000ff', fontSize: '0.8rem' }}>
              Mínimo 8 caracteres
            </small>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ marginTop: '1rem' }}
          >
            {mode === 'login' ? 'Iniciar Sesión' : 'Registrar Usuario'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={onSwitchMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#000000ff',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            {mode === 'login' 
              ? '¿No tienes cuenta? Regístrate aquí' 
              : '¿Ya tienes cuenta? Inicia sesión aquí'}
          </button>
        </div>
      </div>
    </div>
  );
}

function TransaccionForm({ onTransaccionRealizada }) {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    type: 'DEPOSITO'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onTransaccionRealizada({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      setFormData({ fromAccount: '', toAccount: '', amount: '', type: 'DEPOSITO' });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label">
          Cuenta Origen (DNI):
        </label>
        <input
          type="text"
          name="fromAccount"
          value={formData.fromAccount}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Ej: 1234567890"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Cuenta Destino (DNI):
        </label>
        <input
          type="text"
          name="toAccount"
          value={formData.toAccount}
          onChange={handleChange}
          required
          className="form-input"
          placeholder="Ej: 0987654321"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Monto:
        </label>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
          step="0.01"
          min="0.01"
          className="form-input"
          placeholder="0.00"
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Tipo de Transacción:
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-input"
        >
          <option value="DEPOSITO">💰 Depósito</option>
          <option value="RETIRO">💸 Retiro</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
        style={{ 
          backgroundColor: loading ? '#000000ff' : '#000000ff',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '⏳ Procesando...' : ' Realizar Transacción'}
      </button>
    </form>
  );
}

export default App;