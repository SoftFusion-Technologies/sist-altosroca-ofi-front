import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearchLocation,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaStore,
  FaClock,
  FaBuilding,
  FaUsers,
  FaMapSigns
} from 'react-icons/fa';
import Modal from 'react-modal';
import Swal from 'sweetalert2';
import ParticlesBackground from '../../components/ParticlesBackground';
import ButtonBack from '../../components/ButtonBack';
import { getUserId } from '../../utils/authUtils';
import { useAuth } from '../../AuthContext';
import NavbarStaff from '../staff/NavbarStaff';

Modal.setAppElement('#root');

const API = 'http://localhost:8080/sedes';

const defaultFormValues = {
  nombre: '',
  codigo: '',
  direccion: '',
  ciudad: '',
  provincia: 'Tucumán',
  telefono: '',
  email: '',
  responsable_nombre: '',
  responsable_dni: '',
  horario_apertura: '09:00',
  horario_cierre: '18:00',
  estado: 'activo'
};

const LocalesGet = () => {
  const { userLevel, userRol, userSedeId, userSede, userName } = useAuth();

  const manageRoles = useMemo(() => ['admin', 'socio', 'administrativo'], []);

  const rolActual = String(userRol || userLevel || '').toLowerCase();

  const canManageUsers = useMemo(() => {
    return manageRoles.includes(rolActual);
  }, [rolActual, manageRoles]);

  const [data, setData] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [orderBy, setOrderBy] = useState('id');
  const [orderDir, setOrderDir] = useState('ASC');

  const [modalOpen, setModalOpen] = useState(false);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [editId, setEditId] = useState(null);
  const usuarioId = getUserId();

  const debouncedQ = useMemo(() => search.trim(), [search]);

  // Benjamin Orellana - 29 / 03 / 2026 - Se mantiene compatibilidad con backend paginado o array plano y se filtra por sede para perfiles no administradores
  const fetchLocales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, {
        params: { page, limit, q: debouncedQ || undefined, orderBy, orderDir }
      });

      if (Array.isArray(res.data)) {
        const registros = canManageUsers
          ? res.data
          : res.data.filter((item) => Number(item.id) === Number(userSedeId));
        setData(registros);
        setMeta(null);
      } else {
        let registros = res.data.data || [];

        if (!canManageUsers && userSedeId) {
          registros = registros.filter(
            (item) => Number(item.id) === Number(userSedeId)
          );
        }

        setData(registros);

        if (!canManageUsers && userSedeId) {
          setMeta({
            total: registros.length,
            page: 1,
            limit: registros.length || 1,
            totalPages: 1,
            hasNext: false,
            hasPrev: false
          });
        } else {
          setMeta(res.data.meta || null);
        }
      }
    } catch (e) {
      console.error('Error al obtener sedes:', e);
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, orderBy, orderDir, debouncedQ, canManageUsers, userSedeId]);

  const filteredWhenNoMeta = useMemo(() => {
    if (meta) return data;

    const q = search.toLowerCase();

    return data.filter((l) =>
      [l.nombre, l.direccion, l.telefono, l.codigo, l.ciudad]
        .filter(Boolean)
        .some((val) => val.toLowerCase().includes(q))
    );
  }, [data, meta, search]);

  const openModal = (local = null) => {
    if (!canManageUsers) return;

    if (local) {
      setEditId(local.id);
      setFormValues({
        ...defaultFormValues,
        ...local
      });
    } else {
      setEditId(null);
      setFormValues(defaultFormValues);
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setFormValues(defaultFormValues);
  };

  const handleDelete = async (id) => {
    if (!canManageUsers) return;

    const confirm = await Swal.fire({
      title: '¿Eliminar sede?',
      text: 'Esta acción eliminará el registro seleccionado.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      background: '#0f0f10',
      color: '#ffffff'
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`${API}/${id}`, {
        data: { usuario_log_id: usuarioId }
      });

      await Swal.fire({
        title: 'ELIMINADA',
        text: 'La sede se eliminó correctamente.',
        icon: 'success',
        confirmButtonColor: '#dc2626',
        background: '#0f0f10',
        color: '#ffffff'
      });

      if (meta && data.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        fetchLocales();
      }
    } catch (error) {
      console.error('Error al eliminar sede:', error);
      await Swal.fire({
        title: 'ERROR',
        text:
          error?.response?.data?.mensajeError || 'No se pudo eliminar la sede.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        background: '#0f0f10',
        color: '#ffffff'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canManageUsers) return;

    const payload = {
      ...formValues
    };

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, payload);
      } else {
        await axios.post(API, payload);
      }

      await Swal.fire({
        title: editId ? 'ACTUALIZADA' : 'CREADA',
        text: editId
          ? 'La sede se actualizó correctamente.'
          : 'La sede se creó correctamente.',
        icon: 'success',
        confirmButtonColor: '#dc2626',
        background: '#0f0f10',
        color: '#ffffff'
      });

      closeModal();
      setPage(1);
      fetchLocales();
    } catch (error) {
      console.error('Error al guardar sede:', error);
      await Swal.fire({
        title: 'ERROR',
        text:
          error?.response?.data?.mensajeError || 'No se pudo guardar la sede.',
        icon: 'error',
        confirmButtonColor: '#dc2626',
        background: '#0f0f10',
        color: '#ffffff'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const total = meta?.total ?? filteredWhenNoMeta.length;
  const totalPages = meta?.totalPages ?? Math.max(Math.ceil(total / limit), 1);
  const currPage = meta?.page ?? page;
  const hasPrev = meta?.hasPrev ?? currPage > 1;
  const hasNext = meta?.hasNext ?? currPage < totalPages;

  const rows = meta
    ? data
    : filteredWhenNoMeta.slice((page - 1) * limit, page * limit);

  const stats = useMemo(() => {
    const activos = rows.filter((item) => item.estado === 'activo').length;
    const inactivos = rows.filter((item) => item.estado === 'inactivo').length;

    return {
      total,
      activos,
      inactivos
    };
  }, [rows, total]);

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.16),transparent_28%),linear-gradient(135deg,#050505_0%,#111111_42%,#190909_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
        <ButtonBack />
        <ParticlesBackground />

        <div className="relative z-10 mx-auto max-w-7xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-red-800 via-red-500 to-red-300" />

            <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.35fr,0.65fr] lg:px-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  Altos Roca Gym
                </div>

                <h1 className="titulo mt-4 flex items-center gap-3 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
                  <FaSearchLocation className="text-red-400" />
                  Gestión de sedes
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  Administrá la estructura de sucursales, horarios, contacto y
                  responsables del ecosistema operativo de Altos Roca.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                    Usuario actual:{' '}
                    <span className="font-semibold text-white">
                      {userName || '-'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                    Rol:{' '}
                    <span className="font-semibold capitalize text-white">
                      {rolActual || '-'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                    Sede actual:{' '}
                    <span className="font-semibold text-white">
                      {userSede || 'Sin sede'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Total
                    </span>
                    <FaBuilding className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.total}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Activas
                    </span>
                    <FaMapSigns className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.activos}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Inactivas
                    </span>
                    <FaUsers className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.inactivos}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Benjamin Orellana - 02 / 04 / 2026 - Rediseño visual del bloque de filtros de sedes para lograr una interfaz más compacta, moderna y ordenada */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="rounded-[28px] border border-white/10 bg-[#0b0b0d]/95 p-4 sm:p-5 shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
          >
            <div className="mb-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  Gestión de sedes
                </div>

                <h2 className="text-xl font-bold tracking-tight text-white">
                  Filtros y búsqueda
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                  Buscá sedes por nombre, código, ciudad, dirección o teléfono.
                </p>
              </div>

              {canManageUsers && (
                <button
                  onClick={() => openModal()}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(220,38,38,0.24)] transition-all duration-300 hover:translate-y-[-1px]"
                >
                  <FaPlus />
                  Nueva sede
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
              <div className="xl:col-span-5">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Buscar sede
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                      />
                    </svg>
                  </span>

                  <input
                    type="text"
                    placeholder="Nombre, dirección, ciudad, código o teléfono..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full rounded-2xl border border-white/10 bg-[#09090b] py-3 pl-11 pr-4 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-[#101013]"
                  />
                </div>
              </div>

              <div className="xl:col-span-3">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Ordenar por
                </label>
                <select
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-[#101013]"
                  aria-label="Ordenar por"
                >
                  <option value="id">ID</option>
                  <option value="nombre">Nombre</option>
                  <option value="codigo">Código</option>
                  <option value="ciudad">Ciudad</option>
                  <option value="provincia">Provincia</option>
                </select>
              </div>

              <div className="xl:col-span-2">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Dirección
                </label>
                <select
                  value={orderDir}
                  onChange={(e) => setOrderDir(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-[#101013]"
                  aria-label="Dirección de orden"
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </select>
              </div>

              <div className="xl:col-span-2">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Mostrar
                </label>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-[#101013]"
                  aria-label="Items por página"
                >
                  <option value={6}>6</option>
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              Total: <b>{total}</b> · Página <b>{currPage}</b> de{' '}
              <b>{totalPages}</b>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-flex items-center gap-2 whitespace-nowrap">
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage(1)}
                  disabled={!hasPrev}
                >
                  «
                </button>
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!hasPrev}
                >
                  ‹
                </button>

                {Array.from({ length: totalPages })
                  .slice(
                    Math.max(0, currPage - 3),
                    Math.max(0, currPage - 3) + 6
                  )
                  .map((_, idx) => {
                    const start = Math.max(1, currPage - 2);
                    const num = start + idx;
                    if (num > totalPages) return null;

                    const active = num === currPage;

                    return (
                      <button
                        key={num}
                        onClick={() => setPage(num)}
                        className={`rounded-xl border px-3 py-2 text-sm ${
                          active
                            ? 'border-red-400 bg-red-600 text-white'
                            : 'border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}

                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={!hasNext}
                >
                  ›
                </button>
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage(totalPages)}
                  disabled={!hasNext}
                >
                  »
                </button>
              </div>
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6"
          >
            {loading
              ? Array.from({ length: Math.min(limit, 8) }).map((_, i) => (
                  <div
                    key={i}
                    className="h-40 rounded-2xl border border-white/10 bg-white/[0.04] animate-pulse"
                  />
                ))
              : rows.map((local) => {
                  const activo = local.estado === 'activo';

                  return (
                    <motion.div
                      key={local.id}
                      layout
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 18
                      }}
                      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.05] shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                    >
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-500/10 blur-3xl" />

                      <div className="p-5 space-y-4 relative">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                                <FaStore className="mr-1 inline text-red-300" />
                                Sede #{local.id}
                              </span>

                              {local.codigo && (
                                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">
                                  Cod: {local.codigo}
                                </span>
                              )}
                            </div>

                            <h2 className="text-lg font-bold tracking-wide text-white">
                              {local.nombre}
                            </h2>
                          </div>

                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                              activo
                                ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                                : 'border border-zinc-400/20 bg-zinc-500/10 text-zinc-200'
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                activo ? 'bg-emerald-400' : 'bg-zinc-300'
                              }`}
                            />
                            {local.estado}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-white/78">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <FaMapMarkerAlt className="mt-1 text-red-300" />
                              <div>
                                <p className="font-medium text-white">
                                  {local.direccion || 'Sin dirección'}
                                </p>
                                <p className="text-xs text-white/55">
                                  {local.ciudad || 'Ciudad no definida'}
                                  {local.provincia && ` · ${local.provincia}`}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <FaClock className="text-red-300" />
                              <p className="text-xs">
                                {local.horario_apertura} -{' '}
                                {local.horario_cierre}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FaPhoneAlt className="text-red-300" />
                              <p className="text-xs">
                                {local.telefono || 'Sin teléfono'}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <FaEnvelope className="text-red-300" />
                              <p className="truncate text-xs">
                                {local.email || 'Sin email'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {local.responsable_nombre && (
                          <div className="flex flex-wrap gap-2 text-[11px] text-white/65">
                            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">
                              Responsable: {local.responsable_nombre}
                              {local.responsable_dni &&
                                ` · DNI ${local.responsable_dni}`}
                            </span>
                          </div>
                        )}

                        {canManageUsers && (
                          <div className="mt-4 flex justify-end gap-2">
                            <button
                              onClick={() => openModal(local)}
                              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 transition-all hover:bg-amber-500/15"
                            >
                              <FaEdit />
                              Editar
                            </button>

                            <button
                              onClick={() => handleDelete(local.id)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition-all hover:bg-rose-500/15"
                            >
                              <FaTrash />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
          </motion.div>

          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-white/70">
              Total: <b>{total}</b> · Página <b>{currPage}</b> de{' '}
              <b>{totalPages}</b>
            </div>

            <div className="overflow-x-auto">
              <div className="inline-flex items-center gap-2 whitespace-nowrap">
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage(1)}
                  disabled={!hasPrev}
                >
                  «
                </button>
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={!hasPrev}
                >
                  ‹
                </button>
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={!hasNext}
                >
                  ›
                </button>
                <button
                  className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-white disabled:opacity-40"
                  onClick={() => setPage(totalPages)}
                  disabled={!hasNext}
                >
                  »
                </button>
              </div>
            </div>
          </div>

          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            className="w-full max-w-3xl rounded-[30px] border border-white/10 bg-[#0d0d0f] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] outline-none"
          >
            <div className="mb-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                Altos Roca Gym
              </div>

              <h2 className="titulo mt-2 text-2xl font-bold uppercase text-white">
                {editId ? 'Editar sede' : 'Nueva sede'}
              </h2>

              <p className="mt-2 text-sm text-white/58">
                Completá los datos estructurales y operativos de la sede.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              {Object.entries(defaultFormValues).map(([key]) => {
                const label = key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                if (key === 'estado') {
                  return (
                    <div key={key}>
                      <label className="mb-2 block text-sm font-medium text-white/78">
                        {label}
                      </label>

                      <select
                        name={key}
                        value={formValues[key]}
                        onChange={handleChange}
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05]"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={key} className="w-full">
                    <label className="mb-2 block text-sm font-medium text-white/78">
                      {label}
                    </label>

                    <input
                      type={
                        key.includes('email')
                          ? 'email'
                          : key.includes('horario')
                            ? 'time'
                            : 'text'
                      }
                      name={key}
                      value={formValues[key]}
                      onChange={handleChange}
                      placeholder={label}
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/28 outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05]"
                    />
                  </div>
                );
              })}

              <div className="mt-2 flex justify-end gap-3 md:col-span-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/86 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(220,38,38,0.24)] transition-all duration-300 hover:scale-[1.01]"
                >
                  {editId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default LocalesGet;
  