import Home from "../Pages/Public/Home.jsx";
import ClasePrueba from "../Pages/Public/ClasePrueba.jsx";
import Horarios from "../Pages/Public/Horarios.jsx";
import Socios from "../Pages/Public/Socios.jsx";
import Espacios from "../Pages/Public/Espacios.jsx";
import Suplementos from "../Pages/Public/Suplementos.jsx";
import TurnosPage from "../Pages/TurnosPage.jsx";

const routes = [
  {
    path: '/',
    element: <Home />,
    name: 'Inicio',
    showInNav: true
  },
  {
    path: '/horarios',
    element: <Horarios />,
    name: 'Horarios',
    showInNav: true
  },
  // {
  //     path: "/socios",
  //     element: <Socios />,
  //     name: "Socios",
  //     showInNav: true,
  // },
  {
    path: '/soyalumno',
    element: <Socios />,
    name: 'Soy Alumno',
    showInNav: true
  },
  {
    path: '/espacios',
    element: <Espacios />,
    name: 'Espacios',
    showInNav: true
  },
  {
    path: '/suplementos',
    element: <Suplementos />,
    name: 'Suplementos',
    showInNav: true
  },
  {
    path: '/turnos',
    element: <TurnosPage />,
    name: 'Turnos',
    showInNav: true
  }

];

export default routes;