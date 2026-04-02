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
import React, { useEffect, useMemo, useState } from 'react';
import NavbarStaff from '../staff/NavbarStaff';
import { Link, useNavigate } from 'react-router-dom';
import '../../Styles/MetodsGet/Tabla.css';
import '../../Styles/staff/background.css';
import FormAltaAlumno from '../../components/Forms/FormAltaAlumno';
import { useAuth } from '../../AuthContext';
import ParticlesBackground from '../../components/ParticlesBackground';
import { formatearFecha } from '../../Helpers';
import NotificationsHelps from './NotificationsHelps';
import {
  FaPlus,
  FaSearch,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaListUl,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaEdit,
  FaTrash,
  FaIdCard,
  FaPhoneAlt,
  FaBullseye
} from 'react-icons/fa';

// Benjamin Orellana - 2026-04-02 - Rediseño completo del listado de alumnos para usar una tabla premium con identidad Altos Roca, manteniendo filtros, acciones y lógica existente.
const fontTitle = {
  fontFamily: 'var(--font-family-base, "Montserrat", sans-serif)'
};
const fontBody = {
  fontFamily: 'var(--font-family-body, "MessinaRegular", sans-serif)'
};
const fontDisplay = {
  fontFamily: 'var(--font-family-display, "BigNoodle", sans-serif)'
};

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
    setCurrentPage(1);
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

  const obtenerNombreProfesor = (userIdAlumno) => {
    const profesor = usuarios.find(
      (u) => String(u.id) === String(userIdAlumno)
    );
    return profesor ? profesor.nombre || profesor.name : 'Sin asignar';
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
      const nombreA = a.nomyape || '';
      const nombreB = b.nomyape || '';
      return nombreA.localeCompare(nombreB);
    });
  };

  // Llamada a la función para obtener los usuarios ordenados de forma creciente
  const sortedalumnos = ordenarIntegranteAlfabeticamente(results);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const records = sortedalumnos.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(sortedalumnos.length / itemsPerPage);
  const numbers = [...Array(nPage + 1).keys()].slice(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedProfesor, filtroRutina]);

  useEffect(() => {
    if (currentPage > nPage && nPage > 0) {
      setCurrentPage(nPage);
    }
    if (nPage === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [currentPage, nPage]);

  function prevPage(e) {
    e?.preventDefault?.();
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id, e) {
    e?.preventDefault?.();
    setCurrentPage(id);
  }

  function nextPage(e) {
    e?.preventDefault?.();
    if (currentPage < nPage) {
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
    setCurrentPage(1);
  };

  function handleVerPerfil(id) {
    navigate(`/dashboard/student/${id}`);
  }

  const totalPersonalizados = useMemo(
    () =>
      results.filter((alumno) => alumno.rutina_tipo === 'personalizado').length,
    [results]
  );

  const totalGenerales = useMemo(
    () => results.filter((alumno) => alumno.rutina_tipo === 'general').length,
    [results]
  );

  const desde = results.length === 0 ? 0 : firstIndex + 1;
  const hasta = Math.min(lastIndex, sortedalumnos.length);

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)] pt-8 pb-10">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-[95%] max-w-[1700px]">
          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.08)_0%,rgba(255,255,255,0.025)_48%,rgba(0,0,0,0.35)_100%)]" />

            {/* Volver + Hero */}
            <div className="relative border-b border-white/10 px-5 py-5 md:px-7 md:py-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <Link to="/dashboard">
                    <button
                      className="mb-5 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm text-white/85 transition hover:bg-white/[0.08]"
                      style={fontTitle}
                    >
                      Volver
                    </button>
                  </Link>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]"
                      style={fontTitle}
                    >
                      Gestión de alumnos
                    </span>

                    <span
                      className="text-[24px] uppercase leading-none text-[#ff5a6f]"
                      style={fontDisplay}
                    >
                      Altos Roca
                    </span>
                  </div>

                  <h1
                    className="mt-4 titulo uppercase text-3xl font-black uppercase tracking-tight text-white md:text-4xl"
                    style={fontTitle}
                  >
                    Listado de alumnos
                  </h1>

                  <p
                    className="mt-3 max-w-3xl text-sm leading-6 text-white/65 md:text-base"
                    style={fontBody}
                  >
                    Visualizá, filtrá y gestioná alumnos desde una tabla
                    operativa más clara, compacta y eficiente para trabajo
                    administrativo e instructores.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[640px]">
                  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                          style={fontTitle}
                        >
                          Total visible
                        </p>
                        <p
                          className="mt-2 text-3xl leading-none text-white"
                          style={fontDisplay}
                        >
                          {results.length}
                        </p>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
                        <FaUserGraduate />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                          style={fontTitle}
                        >
                          Personalizados
                        </p>
                        <p
                          className="mt-2 text-3xl leading-none text-white"
                          style={fontDisplay}
                        >
                          {totalPersonalizados}
                        </p>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
                        <FaListUl />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p
                          className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                          style={fontTitle}
                        >
                          Generales
                        </p>
                        <p
                          className="mt-2 text-3xl leading-none text-white"
                          style={fontDisplay}
                        >
                          {totalGenerales}
                        </p>
                      </div>
                      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
                        <FaChalkboardTeacher />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros + CTA */}
            <div className="relative border-b border-white/10 px-5 py-5 md:px-7">
              <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
                <form className="flex w-full flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
                  <div className="relative w-full xl:max-w-[320px]">
                    <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                    <input
                      value={search}
                      onChange={searcher}
                      type="text"
                      placeholder="Buscar por nombre, DNI o teléfono"
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/28 ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                      style={fontBody}
                    />
                  </div>

                  {userLevel === 'admin' && (
                    <select
                      value={selectedProfesor}
                      onChange={handleProfesorChange}
                      className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15 xl:w-[260px]"
                      style={fontBody}
                    >
                      <option value="" className="bg-[#0a0a0b]">
                        Todos los profesores
                      </option>
                      {usuarios.map((prof) => (
                        <option
                          key={prof.id}
                          value={prof.id}
                          className="bg-[#0a0a0b]"
                        >
                          {prof.nombre || prof.name}
                        </option>
                      ))}
                    </select>
                  )}

                  <select
                    value={filtroRutina}
                    onChange={(e) => {
                      setFiltroRutina(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15 xl:w-[220px]"
                    style={fontBody}
                  >
                    <option value="" className="bg-[#0a0a0b]">
                      Todos los tipos
                    </option>
                    <option value="personalizado" className="bg-[#0a0a0b]">
                      Personalizado
                    </option>
                    <option value="general" className="bg-[#0a0a0b]">
                      General
                    </option>
                  </select>

                  <div
                    className="inline-flex h-12 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70"
                    style={fontBody}
                  >
                    Mostrando {desde} a {hasta} de {results.length}
                  </div>
                </form>

                <div className="flex w-full 2xl:w-auto">
                  <button
                    onClick={abrirModal}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-5 text-sm font-semibold text-white transition hover:scale-[1.01] 2xl:w-auto"
                    style={fontTitle}
                  >
                    <FaPlus />
                    Nuevo Alumno
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla / vacío */}
            {results.length === 0 ? (
              <div className="relative px-5 py-10 md:px-7">
                <div className="mx-auto max-w-3xl rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-2xl text-[#ff98a5]">
                    <FaUserGraduate />
                  </div>
                  <h3
                    className="text-2xl font-black text-white"
                    style={fontTitle}
                  >
                    No se encontraron alumnos
                  </h3>
                  <p
                    className="mt-2 text-sm leading-6 text-white/58"
                    style={fontBody}
                  >
                    No hay registros para los filtros aplicados. Probá ajustando
                    la búsqueda, el profesor o el tipo de rutina.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="relative px-3 py-4 md:px-5">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0b]/75 ring-1 ring-white/10">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1180px] w-full border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.04]">
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Alumno
                            </th>
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Profesor
                            </th>
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Rutina
                            </th>
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              DNI
                            </th>
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Teléfono
                            </th>
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Objetivo
                            </th>
                            <th
                              className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Alta
                            </th>
                            <th
                              className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                              style={fontTitle}
                            >
                              Acciones
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {records.map((alumno, index) => {
                            const isPersonal =
                              alumno.rutina_tipo === 'personalizado';

                            return (
                              <tr
                                key={alumno.id}
                                className={
                                  'border-b border-white/6 transition hover:bg-white/[0.04] ' +
                                  (index % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-white/[0.015]')
                                }
                              >
                                <td className="px-5 py-4 align-top">
                                  <div className="flex items-start gap-3">
                                    <button
                                      type="button"
                                      onClick={() => obtenerAlumno(alumno.id)}
                                      className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#ef3347]/18 bg-[#ef3347]/10 text-[#ff98a5] transition hover:bg-[#ef3347]/15"
                                      title="Abrir perfil rápido"
                                    >
                                      <FaUserGraduate />
                                    </button>

                                    <div className="min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => obtenerAlumno(alumno.id)}
                                        className="max-w-[240px] truncate text-left text-base font-semibold text-white hover:text-[#ffd5db]"
                                        style={fontTitle}
                                        title={alumno.nomyape}
                                      >
                                        {alumno.nomyape}
                                      </button>

                                      <div
                                        className="mt-1 text-xs text-white/42"
                                        style={fontBody}
                                      >
                                        ID #{alumno.id}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/78">
                                    <FaChalkboardTeacher className="text-[#ff98a5]" />
                                    <span style={fontBody}>
                                      {obtenerNombreProfesor(alumno.user_id)}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <span
                                    className={
                                      'inline-flex rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ' +
                                      (isPersonal
                                        ? 'border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ffd5db]'
                                        : 'border-white/10 bg-white/[0.05] text-white/78')
                                    }
                                    style={fontTitle}
                                    title={
                                      isPersonal
                                        ? 'Rutina Personalizada'
                                        : 'Rutina General'
                                    }
                                  >
                                    {isPersonal ? 'Personalizado' : 'General'}
                                  </span>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <button
                                    type="button"
                                    onClick={() => obtenerAlumno(alumno.id)}
                                    className="inline-flex items-center gap-2 text-sm text-white/82 transition hover:text-white"
                                    style={fontBody}
                                    title="Ver detalle"
                                  >
                                    <FaIdCard className="text-[#ff98a5]" />
                                    {alumno.dni || '—'}
                                  </button>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <button
                                    type="button"
                                    onClick={() => obtenerAlumno(alumno.id)}
                                    className="inline-flex max-w-[170px] items-center gap-2 truncate text-sm text-white/82 transition hover:text-white"
                                    style={fontBody}
                                    title={alumno.telefono || 'Sin teléfono'}
                                  >
                                    <FaPhoneAlt className="text-[#ff98a5]" />
                                    <span className="truncate">
                                      {alumno.telefono || '—'}
                                    </span>
                                  </button>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div
                                    className="max-w-[260px] truncate text-sm text-white/65"
                                    style={fontBody}
                                    title={alumno.objetivo || 'Sin objetivo'}
                                  >
                                    <span className="mr-2 inline-block text-[#ff98a5]">
                                      <FaBullseye />
                                    </span>
                                    {alumno.objetivo || '—'}
                                  </div>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div
                                    className="text-sm text-white/68"
                                    style={fontBody}
                                  >
                                    {formatearFecha(alumno.created_at)}
                                  </div>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div className="flex justify-end gap-2">
                                    {(userLevel === 'admin' ||
                                      userLevel === 'instructor') && (
                                      <>
                                        <button
                                          onClick={() =>
                                            handleEditarAlumno(alumno)
                                          }
                                          type="button"
                                          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-amber-200 transition hover:bg-amber-400/10"
                                          style={fontTitle}
                                          title="Editar"
                                        >
                                          <FaEdit />
                                          Editar
                                        </button>

                                        <button
                                          onClick={() =>
                                            handleEliminarAlumno(alumno.id)
                                          }
                                          type="button"
                                          className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#ef3347]/14 bg-[#ef3347]/10 px-4 text-xs font-semibold text-[#ffd5db] transition hover:bg-[#ef3347]/16"
                                          style={fontTitle}
                                          title="Eliminar"
                                        >
                                          <FaTrash />
                                          Eliminar
                                        </button>
                                      </>
                                    )}

                                    <button
                                      onClick={() => handleVerPerfil(alumno.id)}
                                      type="button"
                                      className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 text-xs font-semibold text-white transition hover:scale-[1.01]"
                                      style={fontTitle}
                                      title="Ver Perfil"
                                    >
                                      <FaEye />
                                      Ver Perfil
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Paginación */}
                {nPage > 1 && (
                  <nav className="relative flex justify-center items-center px-4 pb-8 pt-3">
                    <ul className="flex flex-wrap items-center justify-center gap-2">
                      <li>
                        <a
                          href="#"
                          className={
                            'inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm transition ' +
                            (currentPage === 1
                              ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                              : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]')
                          }
                          onClick={prevPage}
                          style={fontTitle}
                        >
                          <FaChevronLeft className="mr-2" />
                          Prev
                        </a>
                      </li>

                      {numbers.map((number) => (
                        <li key={number}>
                          <a
                            href="#"
                            onClick={(e) => changeCPage(number, e)}
                            className={
                              'min-w-[40px] px-3 h-10 grid place-items-center rounded-2xl border text-sm font-semibold transition ' +
                              (currentPage === number
                                ? 'border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] text-white'
                                : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]')
                            }
                            style={fontTitle}
                          >
                            {number}
                          </a>
                        </li>
                      ))}

                      <li>
                        <a
                          href="#"
                          className={
                            'inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm transition ' +
                            (currentPage === nPage
                              ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                              : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]')
                          }
                          onClick={nextPage}
                          style={fontTitle}
                        >
                          Next
                          <FaChevronRight className="ml-2" />
                        </a>
                      </li>
                    </ul>
                  </nav>
                )}
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
      </div>

      {/* <NotificationsHelps instructorId={userId} /> */}
    </>
  );
};

export default AlumnosGet;
