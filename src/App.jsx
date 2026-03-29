import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import Navbar from './Layout/Navbar.jsx';
import routes from './Routes/Rutas.jsx';
import Login from './Pages/Admin/Login.jsx';
import Footer from './Layout/Footer.jsx';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

import { AuthProvider } from './AuthContext';
import LoginForm from './components/login/LoginForm.jsx';

// cambio agregado por Benjamin Orellana
// aqui dentro ponemos las rutas en las que no queremos mostrar el nav
import { hiddenNavbarRoutes } from './Helpers/uiConfig';
import UsuariosGet from './Pages/MetodosGets/UsuariosGet.jsx';
import LocalesGet from './Pages/MetodosGets/LocalesGet.jsx';
import LogsSistema from './Pages/MetodosGets/LogsSistema.jsx';
import LeadsGet from './Pages/MetodosGets/Leads/LeadsGet.jsx';
import VentasProspectosGet from './Pages/MetodosGets/VentasProspectosGet.jsx';
import RecaptacionGet from './Pages/MetodosGets/RecaptacionGet.jsx';
import EjerciciosCatalogo from './Pages/Components/EjerciciosCatalogo';
import AlumnosGet from './Pages/MetodosGets/AlumnosGet.jsx';
import PerfilAlumno from './Pages/MetodosGets/AlumnoPerfil/PerfilAlumno.jsx';
import ColoresRutinaCrud from './Pages/MetodosGets/ColoresRutinaCrud.jsx';
import PSEDashboard from './Pages/MetodosGets/PSEDashboard.jsx';
import RMListWrapper from './Pages/MetodosGets/RM/RMListWrapper.jsx';
import LogsGlobalAlumno from './Pages/MetodosGets/AlumnoPerfil/LogsGlobalAlumno.jsx';
import RutinasExplorer from './Pages/MetodosGets/RutinasExplorer.jsx';
import EstadisticasIns from './Pages/MetodosGets/EstadisticasIns.jsx';
const AdminPage = lazy(() => import('./Pages/staff/AdminPage'));

export default function App() {
  const { pathname } = useLocation();

  const token = localStorage.getItem('token');
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const hideNavbar = hiddenNavbarRoutes.some((route) =>
    pathname.startsWith(route)
  );
  return (
    <AuthProvider>
      {/* El Navbar se mostrará en todas las páginas si está fuera de <Routes> */}
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Ruta pública para Login */}
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {' '}
              <AdminPage />{' '}
            </ProtectedRoute>
          }
        />
        <Route path="/soyalumno" element={<LoginForm />} />
        <Route
          path="/dashboard/usuarios"
          element={
            <ProtectedRoute>
              {' '}
              <UsuariosGet />{' '}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/sedes"
          element={
            <ProtectedRoute>
              {' '}
              <LocalesGet />{' '}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/logs"
          element={
            <ProtectedRoute>
              {' '}
              <LogsSistema />{' '}
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/leads"
          element={
            <ProtectedRoute>
              {' '}
              <LeadsGet />
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/ventas"
          element={
            <ProtectedRoute>
              {' '}
              <VentasProspectosGet />
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/recaptacion"
          element={
            <ProtectedRoute>
              {' '}
              <RecaptacionGet />
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/ejercicios"
          element={
            <ProtectedRoute>
              {' '}
              <EjerciciosCatalogo />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/alumnos"
          element={
            <ProtectedRoute>
              {' '}
              <AlumnosGet />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/student/:id"
          element={
            <ProtectedRoute>
              {' '}
              <PerfilAlumno />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/miperfil/student/:id"
          element={
            <ProtectedRoute>
              {' '}
              <PerfilAlumno />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/administracion-colores"
          element={
            <ProtectedRoute>
              {' '}
              <ColoresRutinaCrud />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/pse"
          element={
            <ProtectedRoute>
              <PSEDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/rm"
          element={
            <ProtectedRoute>
              <RMListWrapper />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/logs-global"
          element={
            <ProtectedRoute>
              {' '}
              <LogsGlobalAlumno />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/routines"
          element={
            <ProtectedRoute>
              {' '}
              <RutinasExplorer />{' '}
            </ProtectedRoute>
          }
        />{' '}
        <Route
          path="/dashboard/estadisticas"
          element={
            <ProtectedRoute>
              {' '}
              <EstadisticasIns />{' '}
            </ProtectedRoute>
          }
        />{' '}
        {/* Rutas protegidas */}
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {/* Ruta para redirigir si se intenta acceder a la raíz sin estar logueado */}
        <Route path="/" element={!token ? <Navigate to="/login" /> : null} />
        {/* Ruta para 404 */}
        <Route path="*" element={<div>404 - Página no encontrada</div>} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
}
