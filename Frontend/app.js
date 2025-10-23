require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

// 1. Inicialización de la App
const app = express();

// 2. Configuración del motor de plantillas (View Engine)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// 3. Middlewares
// Para servir archivos estáticos como CSS, JS, imágenes
app.use(express.static(path.join(__dirname, 'src/public'))); // Servirá style.css y auth.js
// Para parsear el cuerpo de las peticiones (req.body)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middlewares para sesiones y mensajes flash (deben ir en este orden)
app.use(cookieParser(process.env.COOKIE_SECRET || 'default-secret'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // Cookie válida por 1 hora
}));
app.use(flash());

// Middleware para pasar mensajes flash a todas las vistas
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// 4. Rutas
const accountRoutes = require('./src/routes/accounts');
const usersRoutes = require('./src/routes/users');
const operationsRoutes = require('./src/routes/operations');

// Ruta de inicio que renderiza la página de login/registro
app.get('/', (req, res) => {
  // Si el usuario ya está en sesión, lo redirigimos directamente al dashboard
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('home', { user: null }); // Pasamos los mensajes flash automáticamente con res.locals
});

app.use('/accounts', accountRoutes); // Cambiado para evitar conflicto con la raíz
app.use('/users', usersRoutes);
app.use('/operations', operationsRoutes);

// Ruta para el panel de control principal
app.get('/dashboard', (req, res) => {
  // Middleware de protección: si no hay usuario en la sesión, no puede entrar
  if (!req.session.user) {
    req.flash('error', 'Debes iniciar sesión para ver esta página.');
    return res.redirect('/');
  }
  // Si hay usuario, renderizamos el dashboard y le pasamos los datos del usuario
  // Aseguramos que las cuentas del usuario se pasen como un array, incluso si está vacío
  const user = req.session.user;
  if (user && !user.accounts) {
      user.accounts = [];
  }
  res.render('dashboard', { user });
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      // Manejar el error, por ejemplo, mostrando un mensaje
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid'); // Limpia la cookie de sesión
    res.redirect('/');
  });
});

// 5. Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Frontend bancario escuchando en puerto ${PORT}`);
});
