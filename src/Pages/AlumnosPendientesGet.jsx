/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 26 / 06 / 2025
 * Versión: 1.1
 *
 * Descripción:
 * Este archivo (AlumnosPendientesGet.jsx) renderiza los alumnos pendientes
 * que se autodan de alta y todavía no tienen profesor asignado.
 * Adaptado visualmente a la identidad de Altos Roca.
 *
 * Tema: Configuración
 * Capa: Frontend
 * Contacto: benjamin.orellanaof@gmail.com || 3863531891
 */

import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import NavbarStaff from '../Pages/staff/NavbarStaff';
import { Link } from 'react-router-dom';
import '../Styles/staff/background.css';
import { useAuth } from '../AuthContext';
import ParticlesBackground from '../components/ParticlesBackground';
import { formatearFecha } from '../Helpers';
import Swal from 'sweetalert2';

// Benjamin Orellana - 2026/04/13 - Componente adaptado visualmente a Altos Roca con tabla premium y modal mejorado.
const AlumnosPendientesGet = () => {
  const { userLevel } = useAuth();

  const URL = 'http://localhost:8080/students-pendientes/';

  const [modalAlumnoDetails, setModalAlumnoDetails] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [selectedAlumno, setSelectedAlumno] = useState(null);

  const [profesorAsignado, setProfesorAsignado] = useState('');
  const [alumnos, setAlumnos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [selectedProfesor, setSelectedProfesor] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const abrirModalAutorizar = (alumno) => {
    setAlumnoSeleccionado(alumno);
    setProfesorAsignado('');
    setModalOpen(true);
  };

  const searcher = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const obtenerAlumnos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(URL);
      setAlumnos(response.data || []);
    } catch (error) {
      console.log('Error al obtener los alumnos:', error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:8080/users');
      const instructores = (res.data || []).filter(
        (user) => user.level === 'instructor'
      );
      setUsuarios(instructores);
    } catch (error) {
      console.log('Error al obtener profesores:', error);
    }
  };

  useEffect(() => {
    obtenerAlumnos();
    obtenerUsuarios();
  }, []);

  const obtenerNombreProfesor = (userId) => {
    const profesor = usuarios.find((u) => Number(u.id) === Number(userId));
    return profesor ? profesor.name : 'Sin asignar';
  };

  const handleEliminarAlumno = async (id) => {
    const confirmacion = window.confirm(
      '¿Seguro que desea eliminar este alumno pendiente?'
    );

    if (!confirmacion) return;

    try {
      const url = `${URL}${id}`;
      const respuesta = await fetch(url, {
        method: 'DELETE'
      });

      await respuesta.json();

      const arrayAlumnos = alumnos.filter((user) => user.id !== id);
      setAlumnos(arrayAlumnos);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerAlumno = async (id) => {
    try {
      const url = `${URL}${id}`;
      const respuesta = await fetch(url);
      const resultado = await respuesta.json();
      setSelectedAlumno(resultado);
      setModalAlumnoDetails(true);
    } catch (error) {
      console.log('Error al obtener el alumno:', error);
    }
  };

  // Benjamin Orellana - 2026/04/13 - Reemplazo de alerts nativos por SweetAlert2 en autorización de alumno.
  const handleConfirmarAutorizar = async () => {
    try {
      await axios.post(`${URL}migrar/${alumnoSeleccionado.id}`, {
        user_id: profesorAsignado
      });

      await Swal.fire({
        icon: 'success',
        title: 'Alumno autorizado',
        text: 'El alumno fue autorizado correctamente y ya quedó asignado al profesor seleccionado.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0d',
        color: '#ffffff'
      });

      setModalOpen(false);
      setAlumnoSeleccionado(null);
      setProfesorAsignado('');
      obtenerAlumnos();
    } catch (error) {
      console.error('Error al autorizar alumno:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo autorizar',
        text: 'Ocurrió un error al autorizar el alumno. Intenta nuevamente.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0d',
        color: '#ffffff'
      });
    }
  };

  // Benjamin Orellana - 2026/04/13 - Filtrado robusto por nombre, dni, teléfono y profesor.
  const results = useMemo(() => {
    return alumnos.filter((dato) => {
      const nombre = (dato?.nomyape || '').toLowerCase();
      const dni = String(dato?.dni || '').toLowerCase();
      const telefono = String(dato?.telefono || '').toLowerCase();
      const query = search.toLowerCase();

      const searchMatch =
        nombre.includes(query) ||
        dni.includes(query) ||
        telefono.includes(query);

      const profesorMatch = selectedProfesor
        ? Number(dato.user_id) === Number(selectedProfesor)
        : true;

      return searchMatch && profesorMatch;
    });
  }, [alumnos, search, selectedProfesor]);

  const sortedAlumnos = useMemo(() => {
    return [...results].sort((a, b) => {
      const nombreA = a?.nomyape || '';
      const nombreB = b?.nomyape || '';
      return nombreA.localeCompare(nombreB);
    });
  }, [results]);

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const records = sortedAlumnos.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(sortedAlumnos.length / itemsPerPage);
  const numbers = [...Array(nPage).keys()].map((n) => n + 1);

  const prevPage = (e) => {
    e.preventDefault();
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const changeCPage = (e, id) => {
    e.preventDefault();
    setCurrentPage(id);
  };

  const nextPage = (e) => {
    e.preventDefault();
    if (currentPage < nPage) setCurrentPage(currentPage + 1);
  };

  const getEstadoClass = (estado) => {
    if (estado === 'pendiente') {
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
    }
    if (estado === 'en revision') {
      return 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30';
    }
    if (estado === 'autorizado') {
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    }
    return 'bg-white/10 text-white border border-white/10';
  };

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[#050505] pt-8 pb-12 text-white">
        <ParticlesBackground />

        <div className="relative z-10 mx-auto w-[95%] max-w-[1500px]">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Link to="/dashboard">
                <button className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-white/5 px-5 py-2.5 text-sm font-semibold text-red-200 transition-all duration-300 hover:-translate-y-[1px] hover:border-red-500/50 hover:bg-red-500/10 hover:text-white">
                  Volver
                </button>
              </Link>
            </div>
          </div>

          {/* Benjamin Orellana - 2026/04/13 - Hero superior con identidad visual Altos Roca. */}
          <div className="mb-6 overflow-hidden rounded-[28px] border border-red-500/20 bg-gradient-to-br from-[#120707] via-[#0c0c0c] to-[#170909] shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="grid gap-6 p-5 md:p-8 xl:grid-cols-[1.4fr_0.8fr]">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                  Altos Roca
                </div>

                <h1 className="text-2xl titulo uppercase font-black tracking-tight text-white md:text-4xl">
                  Alumnos pendientes de asignación
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
                  Visualizá los alumnos que se dieron de alta por su cuenta y
                  todavía no fueron asignados a un profesor. Desde aquí podés
                  buscarlos, revisarlos y autorizarlos rápidamente.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Registros
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {results.length}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Página actual
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {nPage === 0 ? 0 : currentPage}
                  </h3>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
                    Profesores disponibles
                  </p>
                  <h3 className="mt-2 text-3xl font-black text-white">
                    {usuarios.length}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-6 grid gap-4 rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Buscar alumno
              </label>
              <input
                value={search}
                onChange={searcher}
                type="text"
                placeholder="Nombre, DNI o teléfono..."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Filtrar por profesor
              </label>
              <select
                value={selectedProfesor}
                onChange={(e) => {
                  setSelectedProfesor(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
              >
                <option value="">Todos</option>
                {usuarios.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full">
                <thead className="bg-gradient-to-r from-[#2b0b0b] via-[#4a1111] to-[#2b0b0b]">
                  <tr className="text-left text-xs uppercase tracking-[0.16em] text-red-100">
                    <th className="px-5 py-4">ID</th>
                    <th className="px-5 py-4">Profesor</th>
                    <th className="px-5 py-4">Nombre y apellido</th>
                    <th className="px-5 py-4">DNI</th>
                    <th className="px-5 py-4">Teléfono</th>
                    <th className="px-5 py-4">Objetivo</th>
                    <th className="px-5 py-4">Fecha creación</th>
                    <th className="px-5 py-4">Estado</th>
                    <th className="px-5 py-4 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-5 py-10 text-center text-sm text-zinc-400"
                      >
                        Cargando alumnos pendientes...
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="px-5 py-10 text-center text-sm text-zinc-400"
                      >
                        No se encontraron alumnos pendientes.
                      </td>
                    </tr>
                  ) : (
                    records.map((alumno) => (
                      <tr
                        key={alumno.id}
                        className="border-t border-white/5 bg-transparent transition-all duration-300 hover:bg-red-500/[0.06]"
                      >
                        <td
                          className="cursor-pointer px-5 py-4 text-sm font-semibold text-white"
                          onClick={() => obtenerAlumno(alumno.id)}
                        >
                          #{alumno.id}
                        </td>

                        <td className="px-5 py-4 text-sm text-zinc-300">
                          {obtenerNombreProfesor(alumno.user_id)}
                        </td>

                        <td
                          className="cursor-pointer px-5 py-4 text-sm font-semibold text-white"
                          onClick={() => obtenerAlumno(alumno.id)}
                        >
                          {alumno.nomyape}
                        </td>

                        <td
                          className="cursor-pointer px-5 py-4 text-sm text-zinc-300"
                          onClick={() => obtenerAlumno(alumno.id)}
                        >
                          {alumno.dni}
                        </td>

                        <td
                          className="cursor-pointer px-5 py-4 text-sm text-zinc-300"
                          onClick={() => obtenerAlumno(alumno.id)}
                        >
                          {alumno.telefono || '-'}
                        </td>

                        <td
                          className="cursor-pointer px-5 py-4 text-sm text-zinc-300"
                          onClick={() => obtenerAlumno(alumno.id)}
                        >
                          {alumno.objetivo || '-'}
                        </td>

                        <td
                          className="cursor-pointer px-5 py-4 text-sm text-zinc-300"
                          onClick={() => obtenerAlumno(alumno.id)}
                        >
                          {formatearFecha(alumno.created_at)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] ${getEstadoClass(
                              alumno.estado
                            )}`}
                          >
                            {alumno.estado}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex flex-wrap items-center justify-center gap-2">
                            {userLevel === 'admin' && (
                              <button
                                onClick={() => handleEliminarAlumno(alumno.id)}
                                type="button"
                                className="rounded-xl border border-red-500/30 bg-red-500/15 px-3 py-2 text-xs font-semibold text-red-200 transition-all duration-300 hover:-translate-y-[1px] hover:bg-red-500/25 hover:text-white"
                              >
                                Eliminar
                              </button>
                            )}

                            {(userLevel === 'admin' ||
                              userLevel === 'instructor') && (
                              <button
                                onClick={() => abrirModalAutorizar(alumno)}
                                type="button"
                                className="rounded-xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 text-xs font-semibold text-emerald-200 transition-all duration-300 hover:-translate-y-[1px] hover:bg-emerald-500/25 hover:text-white"
                              >
                                Autorizar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {nPage > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-4 py-5 md:flex-row">
                <p className="text-sm text-zinc-400">
                  Mostrando{' '}
                  <span className="font-semibold text-white">
                    {records.length}
                  </span>{' '}
                  de{' '}
                  <span className="font-semibold text-white">
                    {sortedAlumnos.length}
                  </span>{' '}
                  registros
                </p>

                <nav className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={prevPage}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                  >
                    Anterior
                  </button>

                  {numbers.map((number) => (
                    <button
                      key={number}
                      onClick={(e) => changeCPage(e, number)}
                      className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                        currentPage === number
                          ? 'bg-red-600 text-white shadow-[0_8px_30px_rgba(220,38,38,0.35)]'
                          : 'border border-white/10 bg-white/5 text-zinc-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white'
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={nextPage}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Modal autorizar */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-red-500/20 bg-[#0b0b0d] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <div className="border-b border-white/10 bg-gradient-to-r from-[#2b0b0b] via-[#4a1111] to-[#2b0b0b] px-6 py-5">
                <h2 className="text-xl font-black uppercase tracking-[0.14em] text-white">
                  Asignar profesor
                </h2>
                <p className="mt-2 text-sm text-red-100/80">
                  Alumno:{' '}
                  <span className="font-semibold text-white">
                    {alumnoSeleccionado?.nomyape || '-'}
                  </span>
                </p>
              </div>

              <div className="p-6">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                  Seleccioná un profesor
                </label>

                <select
                  value={profesorAsignado}
                  onChange={(e) => setProfesorAsignado(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">-- Seleccionar --</option>
                  {usuarios.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    onClick={() => {
                      setModalOpen(false);
                      setProfesorAsignado('');
                      setAlumnoSeleccionado(null);
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleConfirmarAutorizar}
                    disabled={!profesorAsignado}
                    className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirmar asignación
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal detalle simple para evitar romper si ya usás esta lógica */}
        {modalAlumnoDetails && selectedAlumno && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-[#0b0b0d] p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-red-300">
                    Detalle del alumno
                  </p>
                  <h3 className="mt-2 text-2xl font-black">
                    {selectedAlumno?.nomyape}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    setModalAlumnoDetails(false);
                    setSelectedAlumno(null);
                  }}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                    DNI
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {selectedAlumno?.dni || '-'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                    Teléfono
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {selectedAlumno?.telefono || '-'}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 md:col-span-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
                    Objetivo
                  </p>
                  <p className="mt-2 text-base font-semibold text-white">
                    {selectedAlumno?.objetivo || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};;

export default AlumnosPendientesGet;
