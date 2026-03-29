/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 26 / 06 / 2025
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlumnosGet.jsx) es el componente el cual renderiza los datos de los usuarios
 * Estos datos llegan cuando se da de alta un nuevo usuario
 *
 * Tema: Configuración
 * Capa: Frontend
 * Contacto: benjamin.orellanaof@gmail.com || 3863531891
 */
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import NavbarStaff from '../staff/NavbarStaff';
import { Link } from 'react-router-dom';
import '../../Styles/MetodsGet/Tabla.css';
import '../../Styles/staff/background.css';
import FormAltaAlumno from '../../components/Forms/FormAltaAlumno';
import { useAuth } from '../../AuthContext';
import ParticlesBackground from '../../components/ParticlesBackground';
import { formatearFecha } from '../../Helpers';
import { useNavigate } from 'react-router-dom';
import NotificationsHelps from './NotificationsHelps';

// Componente funcional que maneja la lógica relacionada con los alumnos
const AlumnosGet = () => {
  // useState que controla el modal de nuevo usuario
  const [modalNewAlumno, setModalNewAlumno] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null); // Estado para el usuario seleccionado
  const [modalAlumnoDetails, setModalAlumnoDetails] = useState(false); // Estado para controlar el modal de detalles del usuario
  const { userId, userLevel } = useAuth();
  const navigate = useNavigate();

  // console.log(userId);
  const abrirModal = () => {
    setModalNewAlumno(true);
  };
  const cerarModal = () => {
    setModalNewAlumno(false);
    obtenerAlumnos();
  };

  //URL estatica, luego cambiar por variable de entorno
  const URL = 'http://localhost:8080/students/';

  // Estado para almacenar la lista de alumnos
  const [alumnos, setAlumnos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedProfesor, setSelectedProfesor] = useState('');
  const [filtroRutina, setFiltroRutina] = useState('');

  //------------------------------------------------------
  // 1.3 Relacion al Filtrado - Inicio - Benjamin Orellana
  //------------------------------------------------------
  const [search, setSearch] = useState('');

  //Funcion de busqueda, en el cuadro
  const searcher = (e) => {
    setSearch(e.target.value);
  };

  // helpers para evitar toLowerCase() sobre undefined o números
  const safe = (v) => String(v ?? '').toLowerCase();

  let results = alumnos.filter((dato) => {
    const s = safe(search);

    const nameMatch = safe(dato.nomyape).includes(s);
    const dniMatch = safe(dato.dni).includes(s);
    const telMatch = safe(dato.telefono).includes(s);
    const searchMatch = nameMatch || dniMatch || telMatch;

    // si hay profesor seleccionado en el filtro, respetarlo
    const profesorMatch = selectedProfesor
      ? String(dato.user_id) === String(selectedProfesor)
      : true;

    // regla de rutina
    let rutinaMatch = true;
    if (filtroRutina) {
      rutinaMatch = dato.rutina_tipo === filtroRutina;

      // ⚠️ clave: si filtro = 'personalizado' y soy instructor,
      // SOLO mis personalizados (no los de otros)
      if (
        rutinaMatch &&
        filtroRutina === 'personalizado' &&
        userLevel === 'instructor'
      ) {
        rutinaMatch = String(dato.user_id) === String(userId);
      }
    }

    return searchMatch && profesorMatch && rutinaMatch;
  });

  //------------------------------------------------------
  // 1.3 Relacion al Filtrado - Final - Benjamin Orellana
  //------------------------------------------------------

  useEffect(() => {
    // utilizamos get para obtenerUsuarios los datos contenidos en la url
    axios.get(URL).then((res) => {
      setAlumnos(res.data);
      obtenerAlumnos();
      obtenerUsuarios();
    });
  }, []);

  const obtenerAlumnos = async () => {
    try {
      let endpoint = URL;

      if (userLevel === 'admin') {
        endpoint = URL; // trae todos
      } else if (userLevel === 'instructor') {
        endpoint = `${URL}?mode=instructor&viewer_id=${userId}`;
      } else {
        setAlumnos([]);
        return;
      }

      const { data } = await axios.get(endpoint);
      // Importante: reemplazar, no concatenar con los anteriores
      setAlumnos(data);
    } catch (error) {
      console.log('Error al obtener los usuarios:', error);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:8080/users');
      const instructores = res.data.filter((user) => user.rol === 'instructor');
      setUsuarios(instructores);
    } catch (error) {
      console.log('Error al obtener profesores:', error);
    }
  };

  const obtenerNombreProfesor = (userId) => {
    const profesor = usuarios.find((u) => u.id === userId);
    return profesor ? profesor.nombre : 'Sin asignar';
  };

  const handleEliminarAlumno = async (id) => {
    const confirmacion = window.confirm('¿Seguro que desea eliminar?');
    if (confirmacion) {
      try {
        const url = `${URL}${id}`;
        const respuesta = await fetch(url, {
          method: 'DELETE'
        });
        await respuesta.json();
        const arrayalumnos = alumnos.filter((user) => user.id !== id);

        setAlumnos(arrayalumnos);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const obtenerAlumno = async (id) => {
    try {
      const url = `${URL}${id}`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      setSelectedAlumno(resultado);
      setModalAlumnoDetails(true); // Abre el modal de detalles del usuario
    } catch (error) {
      console.log('Error al obtener el alumno:', error);
    }
  };

  // Función para ordenar los integrantes de forma alfabética basado en el nombre
  const ordenarIntegranteAlfabeticamente = (user) => {
    return [...user].sort((a, b) => {
      const sedeA = a.sede || ''; // Reemplaza null o undefined por una cadena vacía
      const sedeB = b.sede || '';
      return sedeA.localeCompare(sedeB);
    });
  };

  // Llamada a la función para obtener los usuarios ordenados de forma creciente
  const sortedalumnos = ordenarIntegranteAlfabeticamente(results);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 60;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const records = sortedalumnos.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(sortedalumnos.length / itemsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  function prevPage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== firstIndex) {
      setCurrentPage(currentPage + 1);
    }
  }

  const handleEditarAlumno = (user) => {
    // (NUEVO)
    setSelectedAlumno(user);
    setModalNewAlumno(true);
  };

  const handleProfesorChange = (e) => {
    setSelectedProfesor(e.target.value);
  };

  function handleVerPerfil(id) {
    navigate(`/dashboard/student/${id}`);
  }

  return (
    <>
      <NavbarStaff />
      <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(2,6,23,1),rgba(15,23,42,1))] pt-10 pb-10">
        <ParticlesBackground />

        <div className="rounded-3xl w-11/12 mx-auto pb-2 ring-1 ring-white/10 bg-white/5 backdrop-blur-xl">
          {/* Volver */}
          <div className="pl-5 pt-5">
            <Link to="/dashboard">
              <button className="py-2 px-5 rounded-xl text-sm text-slate-100 bg-slate-800/80 hover:bg-slate-700 transition ring-1 ring-white/10">
                Volver
              </button>
            </Link>
          </div>

          {/* Título */}
          <div className="flex justify-center px-4">
            <h1 className="pb-3 text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              Listado de Alumnos:&nbsp;
              <span className="text-slate-300 font-medium">
                Cantidad de registros: {results.length}
              </span>
            </h1>
          </div>

          {/* Filtros */}
          <form className="flex flex-wrap justify-center gap-3 pb-6 px-4">
            <input
              value={search}
              onChange={searcher}
              type="text"
              placeholder="Buscar alumnos…"
              className="w-full md:w-[280px] rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 placeholder-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />

            {userLevel === 'admin' && (
              <select
                value={selectedProfesor}
                onChange={handleProfesorChange}
                className="w-full md:w-[260px] rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="" className="bg-slate-900">
                  Todos los Profesores
                </option>
                {usuarios.map((prof) => (
                  <option
                    key={prof.id}
                    value={prof.id}
                    className="bg-slate-900"
                  >
                    {prof.nombre}
                  </option>
                ))}
              </select>
            )}

            <select
              value={filtroRutina}
              onChange={(e) => setFiltroRutina(e.target.value)}
              className="w-full md:w-[220px] rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-2.5 text-slate-100 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="" className="bg-slate-900">
                Todos los tipos
              </option>
              <option value="personalizado" className="bg-slate-900">
                Personalizado
              </option>
              <option value="general" className="bg-slate-900">
                General
              </option>
            </select>
          </form>

          {/* CTA Nuevo */}
          <div className="flex justify-center pb-6">
            <button
              onClick={abrirModal}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 px-5 rounded-2xl transition ring-1 ring-indigo-400/40"
            >
              Nuevo Alumno
            </button>
          </div>

          {/* Grid de Cards / vacío */}
          {results.length === 0 ? (
            <div className="px-6 pb-10">
              <div className="w-full max-w-3xl mx-auto rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-8 text-center">
                <p className="text-slate-300">
                  No se encontraron alumnos para los filtros aplicados.
                </p>
                <p className="text-slate-400 mt-1">
                  Prueba ajustando tu búsqueda.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
                  {results.map((alumno) => {
                    const isPersonal = alumno.rutina_tipo === 'personalizado';
                    return (
                      <article
                        key={alumno.id}
                        className="group relative rounded-2xl p-[1px] bg-gradient-to-br from-cyan-400/20 via-indigo-500/20 to-fuchsia-500/20 ring-1 ring-white/10 hover:from-cyan-400/30 hover:via-indigo-500/30 hover:to-fuchsia-500/30 transition-all"
                      >
                        <div className="rounded-2xl h-full bg-slate-900/70 backdrop-blur-md p-4 ring-1 ring-white/10">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <button
                                type="button"
                                onClick={() => obtenerAlumno(alumno.id)}
                                className="text-left"
                                title="Abrir perfil rápido"
                              >
                                <h3 className="truncate max-w-[220px] font-semibold text-slate-100">
                                  {alumno.nomyape}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  ID #{alumno.id} ·{' '}
                                  {formatearFecha(alumno.created_at)}
                                </p>
                              </button>
                            </div>

                            <span
                              className={
                                'shrink-0 px-2 py-1 text-[11px] rounded-full font-semibold border ring-1 ' +
                                (isPersonal
                                  ? 'bg-orange-500/15 text-orange-200 border-orange-400/30 ring-orange-400/30'
                                  : 'bg-sky-500/15 text-sky-200 border-sky-400/30 ring-sky-400/30')
                              }
                              title={
                                isPersonal
                                  ? 'Rutina Personalizada'
                                  : 'Rutina General'
                              }
                            >
                              {isPersonal ? 'Personalizado' : 'General'}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="mt-4 space-y-3 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-slate-400">Profesor</span>
                              <span className="text-slate-200 font-medium truncate max-w-[55%] text-right">
                                {obtenerNombreProfesor(alumno.user_id)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <span className="text-slate-400">DNI</span>
                              <button
                                type="button"
                                onClick={() => obtenerAlumno(alumno.id)}
                                className="text-slate-200 hover:text-slate-100 font-medium"
                                title="Ver detalle"
                              >
                                {alumno.dni}
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-3">
                              <span className="text-slate-400">Teléfono</span>
                              <button
                                type="button"
                                onClick={() => obtenerAlumno(alumno.id)}
                                className="text-slate-200 hover:text-slate-100 font-medium truncate max-w-[55%] text-right"
                                title={alumno.telefono}
                              >
                                {alumno.telefono}
                              </button>
                            </div>

                            <div className="pt-2">
                              <p className="text-slate-400 mb-1">Objetivo</p>
                              <p
                                className="text-slate-200/90 line-clamp-2"
                                title={alumno.objetivo}
                              >
                                {alumno.objetivo || '—'}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {(userLevel === 'admin' ||
                                userLevel === 'instructor') && (
                                <>
                                  <button
                                    onClick={() => handleEditarAlumno(alumno)}
                                    type="button"
                                    className="px-3.5 py-2 text-xs rounded-xl border border-white/10 text-amber-300 hover:bg-amber-400/10 hover:text-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition"
                                    title="Editar"
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleEliminarAlumno(alumno.id)
                                    }
                                    type="button"
                                    className="px-3.5 py-2 text-xs rounded-xl border border-white/10 text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/40 transition"
                                    title="Eliminar"
                                  >
                                    Eliminar
                                  </button>
                                </>
                              )}
                            </div>

                            <button
                              onClick={() => handleVerPerfil(alumno.id)}
                              type="button"
                              className="px-4 py-2 text-xs rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition"
                              title="Ver Perfil"
                            >
                              Ver Perfil
                            </button>
                          </div>
                        </div>

                        {/* Glow on hover */}
                        <div
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300"
                          style={{
                            boxShadow: '0 0 80px 8px rgba(99,102,241,0.15)'
                          }}
                        />
                      </article>
                    );
                  })}
                </div>
              </div>

              {/* Paginación */}
              <nav className="flex justify-center items-center my-8">
                <ul className="flex items-center gap-2">
                  <li>
                    <a
                      href="#"
                      className="px-3 h-9 grid place-items-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 ring-1 ring-white/10"
                      onClick={prevPage}
                    >
                      Prev
                    </a>
                  </li>

                  {numbers.map((number, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        onClick={() => changeCPage(number)}
                        className={
                          'min-w-9 px-3 h-9 grid place-items-center rounded-xl ring-1 ' +
                          (currentPage === number
                            ? 'bg-indigo-600 text-white ring-indigo-400/40'
                            : 'bg-white/5 text-slate-200 hover:bg-white/10 ring-white/10')
                        }
                      >
                        {number}
                      </a>
                    </li>
                  ))}

                  <li>
                    <a
                      href="#"
                      className="px-3 h-9 grid place-items-center rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 ring-1 ring-white/10"
                      onClick={nextPage}
                    >
                      Next
                    </a>
                  </li>
                </ul>
              </nav>
            </>
          )}

          <FormAltaAlumno
            isOpen={modalNewAlumno}
            onClose={cerarModal}
            user={selectedAlumno}
            setSelectedUser={setSelectedAlumno}
          />
        </div>
      </div>

      {/* <NotificationsHelps instructorId={userId} /> */}
    </>
  );
};

export default AlumnosGet;
