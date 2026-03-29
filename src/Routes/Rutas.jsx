import Home from "../Pages/Public/Home.jsx";
import ClasePrueba from "../Pages/Public/ClasePrueba.jsx";
import Horarios from "../Pages/Public/Horarios.jsx";
import Socios from "../Pages/Public/Socios.jsx";
import Espacios from "../Pages/Public/Espacios.jsx";
import Suplementos from "../Pages/Public/Suplementos.jsx";

const routes = [
    {
        path: "/",
        element: <Home />,
        name: "Home",
        showInNav: false, 
    },
    {
        path: "/clase-prueba",
        element: <ClasePrueba />,
        name: "Clase de Prueba",
        showInNav: false, 
    },
    {
        path: "/horarios",
        element: <Horarios />,
        name: "Horarios",
        showInNav: true,
    },
    {
        path: "/socios",
        element: <Socios />,
        name: "Socios",
        showInNav: true,
    },
    {
        path: "/espacios",
        element: <Espacios />,
        name: "Espacios",
        showInNav: true,
    },
    {
        path: "/suplementos",
        element: <Suplementos />,
        name: "Suplementos",
        showInNav: true,
    }
]

export default routes;