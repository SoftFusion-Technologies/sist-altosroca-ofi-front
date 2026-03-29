import React, { useEffect, useMemo, useState, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearchLocation,
  FaEye
} from 'react-icons/fa';
import Modal from 'react-modal';
import ParticlesBackground from '../../components/ParticlesBackground';
import ButtonBack from '../../components/ButtonBack';
import { getUserId } from '../../utils/authUtils';
import NavbarStaff from '../staff/NavbarStaff';

Modal.setAppElement('#root');

const API = 'http://localhost:8080/locales';

const defaultFormValues = {
  nombre: '',
  codigo: '',
  direccion: '',
  ciudad: '',
  provincia: '',
  telefono: '',
  email: '',
  responsable_nombre: '',
  responsable_dni: '',
  horario_apertura: '09:00',
  horario_cierre: '18:00',
  // printer_nombre: 'sin printer',
  estado: 'activo'
};

const LocalesGet = () => {
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

  const [viewItem, setViewItem] = useState(null);
  const openView = useCallback((local) => setViewItem(local), []);
  const closeView = useCallback(() => setViewItem(null), []);

  // cerrar con ESC
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeView();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeView]);

  const fetchLocales = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, {
        params: { page, limit, q: debouncedQ || undefined, orderBy, orderDir }
      });

      // Compat: si backend devuelve array plano
      if (Array.isArray(res.data)) {
        setData(res.data);
        setMeta(null);
      } else {
        setData(res.data.data || []);
        setMeta(res.data.meta || null);
      }
    } catch (e) {
      console.error('Error al obtener locales:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, orderBy, orderDir, debouncedQ]);

  const filteredWhenNoMeta = useMemo(() => {
    // Si NO hay meta (array plano por compat), mantené tu filtrado local
    if (meta) return data;
    const q = search.toLowerCase();
    return data.filter((l) =>
      [l.nombre, l.direccion, l.telefono].some((val) =>
        val?.toLowerCase().includes(q)
      )
    );
  }, [data, meta, search]);

  const openModal = (local = null) => {
    if (local) {
      setEditId(local.id);
      setFormValues({ ...defaultFormValues, ...local });
    } else {
      setEditId(null);
      setFormValues(defaultFormValues);
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`, { data: { usuario_log_id: usuarioId } });
    if (meta && data.length === 1 && page > 1) {
      setPage((p) => p - 1);
    } else {
      fetchLocales();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formValues, usuario_log_id: usuarioId };
    if (editId) {
      await axios.put(`${API}/${editId}`, payload);
    } else {
      await axios.post(API, payload);
    }
    setModalOpen(false);
    setPage(1);
    fetchLocales();
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

  // Datos que se muestran (server-side si hay meta, client-side si no hay)
  const rows = meta
    ? data
    : filteredWhenNoMeta.slice((page - 1) * limit, page * limit);

  return (
    <>
      <NavbarStaff></NavbarStaff>
      <div className="min-h-screen bg-gradient-to-br from-[#0c0e24] via-[#0f112b] to-[#131538] py-10 px-6 text-white relative overflow-hidden">
        <ButtonBack />
        <ParticlesBackground />
        <div className="max-w-6xl mx-auto z-10 relative">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl titulo uppercase font-extrabold text-pink-400 flex items-center gap-3 drop-shadow-lg">
              <FaSearchLocation className="animate-pulse" /> Sedes
            </h1>
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 transition-colors px-5 py-2 rounded-xl font-bold shadow-md flex items-center gap-2"
            >
              <FaPlus /> Nueva Sede
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex items-center gap-2">
              <select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700"
                aria-label="Ordenar por"
              >
                <option value="id">ID</option>
                <option value="nombre">Nombre</option>
                <option value="codigo">Código</option>
                <option value="ciudad">Ciudad</option>
                <option value="provincia">Provincia</option>
                {/* <option value="created_at">Creación</option>
              <option value="updated_at">Actualización</option> */}
              </select>
              <select
                value={orderDir}
                onChange={(e) => setOrderDir(e.target.value)}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700"
                aria-label="Dirección de orden"
              >
                <option value="ASC">Ascendente</option>
                <option value="DESC">Descendente</option>
              </select>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-gray-900 border border-gray-700"
                aria-label="Items por página"
              >
                <option value={6}>6</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Buscar Sede..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-700 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 placeholder:text-gray-400"
            />
          </div>

          {/* Info + Paginador superior */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="text-white/80 text-xs sm:text-sm">
              Total: <b>{total}</b> · Página <b>{currPage}</b> de{' '}
              <b>{totalPages}</b>
            </div>
            <div className="-mx-2 sm:mx-0">
              <div className="overflow-x-auto no-scrollbar px-2 sm:px-0">
                <div className="inline-flex items-center whitespace-nowrap gap-2">
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage(1)}
                    disabled={!hasPrev}
                  >
                    «
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={!hasPrev}
                  >
                    ‹
                  </button>

                  <div className="flex flex-wrap gap-2 max-w-[80vw]">
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
                            className={`px-3 py-2 rounded-lg border ${
                              active
                                ? 'bg-pink-600 border-pink-400'
                                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                            }`}
                            aria-current={active ? 'page' : undefined}
                          >
                            {num}
                          </button>
                        );
                      })}
                  </div>

                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={!hasNext}
                  >
                    ›
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage(totalPages)}
                    disabled={!hasNext}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid */}
          {/* ============ Grid Mejorado (UX 10x) ============ */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          >
            {/* Loading state (skeletons con layout real) */}
            {loading &&
              Array.from({ length: Math.min(limit ?? 6, 9) }).map((_, i) => (
                <div
                  key={`sk-${i}`}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-lg p-5 shadow-xl overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div className="h-6 w-40 rounded-md bg-white/10 animate-pulse" />
                    <div className="h-6 w-16 rounded-full bg-white/10 animate-pulse" />
                  </div>
                  <div className="mt-3 h-5 w-32 rounded-md bg-white/10 animate-pulse" />
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-4 w-full rounded bg-white/10 animate-pulse"
                      />
                    ))}
                  </div>
                  <div className="mt-5 h-10 w-full rounded-xl bg-white/10 animate-pulse" />
                </div>
              ))}

            {/* Empty state */}
            {!loading && rows?.length === 0 && (
              <div className="col-span-full">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg p-10 text-center">
                  <p className="text-lg font-semibold text-white">
                    No hay locales cargados
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    Crea un nuevo local para comenzar a gestionarlos.
                  </p>
                </div>
              </div>
            )}

            {/* Cards */}
            {!loading &&
              rows?.map((local) => {
                const ESTADO = String(local?.estado ?? '').toLowerCase();
                const estadoClasses =
                  ESTADO === 'activo' || ESTADO === 'habilitado'
                    ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                    : ESTADO === 'pendiente'
                    ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30';

                return (
                  <motion.div
                    key={local.id}
                    layout
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    className="
            group rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,40,.7),rgba(18,22,40,.55))]
            before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(80%_120%_at_50%_-20%,rgba(252,75,8,.14),transparent_55%)]
            relative p-5 shadow-xl backdrop-blur-xl
          "
                  >
                    {/* Header: nombre + estado */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-bold text-white leading-6">
                          {local?.nombre ?? '—'}
                        </h3>
                        <p className="mt-0.5 text-xs text-gray-400">
                          ID: <span className="text-gray-300">{local?.id}</span>
                        </p>
                      </div>

                      <span
                        className={`shrink-0 inline-flex items-center gap-2 px-3 h-8 rounded-full text-xs font-semibold ${estadoClasses}`}
                        title={`Estado: ${local?.estado ?? '—'}`}
                        aria-label={`Estado ${local?.estado ?? '—'}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            ESTADO === 'activo' || ESTADO === 'habilitado'
                              ? 'bg-emerald-400'
                              : ESTADO === 'pendiente'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        {local?.estado ?? '—'}
                      </span>
                    </div>

                    {/* Meta principal */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                      {local?.ciudad && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-gray-200 ring-1 ring-white/10">
                          <span className="i">📍</span>
                          {local.ciudad}
                          {local?.provincia ? `, ${local.provincia}` : ''}
                        </span>
                      )}
                      {local?.responsable_nombre && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-gray-200 ring-1 ring-white/10">
                          <span className="i">👤</span>
                          {local.responsable_nombre}
                          {local?.responsable_dni
                            ? ` · DNI ${local.responsable_dni}`
                            : ''}
                        </span>
                      )}
                      {(local?.horario_apertura || local?.horario_cierre) && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-gray-200 ring-1 ring-white/10">
                          <span className="i">🕒</span>
                          {local?.horario_apertura ?? '—'} –{' '}
                          {local?.horario_cierre ?? '—'}
                        </span>
                      )}
                    </div>

                    {/* Detalle en 2 columnas (mejor escaneable) */}
                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                      {local?.direccion && (
                        <div className="min-w-0">
                          <dt className="text-gray-400">Dirección</dt>
                          <dd className="truncate text-gray-200">
                            {local.direccion}
                          </dd>
                        </div>
                      )}
                      {local?.telefono && (
                        <div className="min-w-0">
                          <dt className="text-gray-400">Teléfono</dt>
                          <dd className="truncate text-gray-200">
                            {local.telefono}
                          </dd>
                        </div>
                      )}
                      {local?.email && (
                        <div className="min-w-0">
                          <dt className="text-gray-400">Email</dt>
                          <dd className="truncate text-gray-200">
                            {local.email}
                          </dd>
                        </div>
                      )}
                      {local?.codigo && (
                        <div className="min-w-0">
                          <dt className="text-gray-400">Código</dt>
                          <dd className="truncate text-gray-200">
                            {local.codigo}
                          </dd>
                        </div>
                      )}
                      {/* Podés sumar acá más campos si hace falta */}
                    </dl>

                    {/* Acciones */}
                    <div className="mt-5 flex items-center justify-between">
                      <div className="text-xs text-gray-400"></div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openView(local)}
                          title="Ver detalles"
                          aria-label={`Ver ${local?.nombre ?? 'local'}`}
                          className="
      inline-flex items-center justify-center h-10 px-3 rounded-xl
      bg-[#871cca]/10 ring-1 ring-[#871cca]/25 text-[#ffb28e]
      hover:bg-[#871cca]/20 hover:ring-[#871cca]/40 hover:text-white
      focus:outline-none focus:ring-2 focus:ring-[#871cca]/50
      transition
    "
                        >
                          <FaEye className="mr-2" /> Ver
                        </button>
                        <button
                          onClick={() => openModal(local)}
                          title="Editar local"
                          aria-label={`Editar ${local?.nombre ?? 'local'}`}
                          className="
                  inline-flex items-center justify-center h-10 w-10 rounded-xl
                  bg-white/5 ring-1 ring-white/10 text-amber-300
                  hover:bg-amber-500/15 hover:ring-amber-400/30 hover:text-amber-200
                  focus:outline-none focus:ring-2 focus:ring-amber-400/40
                  transition
                "
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() => handleDelete(local.id)}
                          title="Eliminar local"
                          aria-label={`Eliminar ${local?.nombre ?? 'local'}`}
                          className="
                  inline-flex items-center justify-center h-10 w-10 rounded-xl
                  bg-white/5 ring-1 ring-white/10 text-rose-300
                  hover:bg-rose-500/15 hover:ring-rose-400/30 hover:text-rose-200
                  focus:outline-none focus:ring-2 focus:ring-rose-400/40
                  transition
                "
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Shimmer sutil en hover */}
                    <span
                      aria-hidden
                      className="
              pointer-events-none absolute left-[-40%] top-[10%] h-[2px] w-[180%]
              opacity-0 group-hover:opacity-100
              bg-gradient-to-r from-transparent to-transparent
              -skew-x-12
            "
                      style={{ animation: 'ray 1s ease-in-out' }}
                    />
                  </motion.div>
                );
              })}
          </motion.div>

          {/* Paginador inferior (igual al superior) */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-white/80 text-xs sm:text-sm">
              Total: <b>{total}</b> · Página <b>{currPage}</b> de{' '}
              <b>{totalPages}</b>
            </div>
            <div className="-mx-2 sm:mx-0">
              <div className="overflow-x-auto no-scrollbar px-2 sm:px-0">
                <div className="inline-flex items-center whitespace-nowrap gap-2">
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage(1)}
                    disabled={!hasPrev}
                  >
                    «
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={!hasPrev}
                  >
                    ‹
                  </button>
                  <div className="flex flex-wrap gap-2 max-w-[80vw]">
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
                            className={`px-3 py-2 rounded-lg border ${
                              active
                                ? 'bg-pink-600 border-pink-400'
                                : 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                  </div>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={!hasNext}
                  >
                    ›
                  </button>
                  <button
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white disabled:opacity-40"
                    onClick={() => setPage(totalPages)}
                    disabled={!hasNext}
                  >
                    »
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Crear/Editar */}
          <Modal
            isOpen={modalOpen}
            onRequestClose={() => setModalOpen(false)}
            overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"
            className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 shadow-2xl border-l-4 border-pink-500 overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-pink-300"
          >
            <h2 className="text-2xl font-bold mb-4 text-pink-600">
              {editId ? 'Editar Sede' : 'Nuevo Sede'}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {Object.entries(defaultFormValues).map(([key]) => {
                const label = key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase());

                if (key === 'estado') {
                  return (
                    <div key={key} className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        {label}
                      </label>
                      <select
                        name={key}
                        value={formValues[key]}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                      >
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={key} className="w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>
                );
              })}
              <div className="md:col-span-2 text-right mt-4">
                <button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 transition px-6 py-2 text-white font-semibold rounded-lg shadow-md"
                >
                  {editId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </Modal>
        </div>
        <AnimatePresence>
          {viewItem && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[80] bg-black"
                onClick={closeView}
              />

              {/* Panel */}
              <motion.div
                key="panel-view"
                role="dialog"
                aria-modal="true"
                aria-label={`Detalles de ${viewItem?.nombre ?? 'local'}`}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 220, damping: 24 }}
                className="
    fixed z-[90] inset-x-4 sm:inset-x-auto sm:right-6 top-10
    w-auto sm:w-[680px] max-h-[82vh] overflow-hidden
    rounded-3xl border border-white/10
    bg-[linear-gradient(160deg,rgba(15,18,36,.95),rgba(15,18,36,.9))]
    before:absolute before:inset-0
    before:bg-[radial-gradient(80%_120%_at_50%_-20%,rgba(252,75,8,.18),transparent_55%)]
    before:pointer-events-none   /* 👈 clave */
    backdrop-blur-2xl shadow-2xl
  "
              >
                {/* Header */}
                <div className="relative px-6 py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-2xl font-bold text-white truncate">
                      {viewItem?.nombre ?? '—'}
                    </h2>
                    <p className="text-sm text-gray-400">
                      ID:{' '}
                      <span className="text-gray-200">
                        {viewItem?.id ?? '—'}
                      </span>
                    </p>
                  </div>

                  {/* Estado */}
                  {(() => {
                    const EST = String(viewItem?.estado ?? '').toLowerCase();
                    const pill =
                      EST === 'activo' || EST === 'habilitado'
                        ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30'
                        : EST === 'pendiente'
                        ? 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/30';
                    const dot =
                      EST === 'activo' || EST === 'habilitado'
                        ? 'bg-emerald-400'
                        : EST === 'pendiente'
                        ? 'bg-amber-400'
                        : 'bg-rose-400';
                    return (
                      <span
                        className={`shrink-0 inline-flex items-center gap-2 px-3 h-9 rounded-full text-xs font-semibold ${pill}`}
                      >
                        <span className={`h-2 w-2 rounded-full ${dot}`} />
                        {viewItem?.estado ?? '—'}
                      </span>
                    );
                  })()}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Content scrollable */}
                <div className="px-6 py-5 overflow-y-auto max-h-[66vh] space-y-6">
                  {/* Chips principales */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    {viewItem?.ciudad && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-gray-200 ring-1 ring-white/10">
                        📍 {viewItem.ciudad}
                        {viewItem?.provincia ? `, ${viewItem.provincia}` : ''}
                      </span>
                    )}
                    {(viewItem?.horario_apertura ||
                      viewItem?.horario_cierre) && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-gray-200 ring-1 ring-white/10">
                        🕒 {viewItem?.horario_apertura ?? '—'} –{' '}
                        {viewItem?.horario_cierre ?? '—'}
                      </span>
                    )}
                    {viewItem?.responsable_nombre && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-gray-200 ring-1 ring-white/10">
                        👤 {viewItem.responsable_nombre}
                        {viewItem?.responsable_dni
                          ? ` · DNI ${viewItem.responsable_dni}`
                          : ''}
                      </span>
                    )}
                  </div>

                  {/* Datos en 2 col */}
                  <section>
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      Información
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-[13px]">
                      <div>
                        <dt className="text-gray-400">Dirección</dt>
                        <dd className="text-gray-200">
                          {viewItem?.direccion ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Ciudad / Provincia</dt>
                        <dd className="text-gray-200">
                          {viewItem?.ciudad ?? '—'}
                          {viewItem?.provincia ? `, ${viewItem.provincia}` : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Teléfono</dt>
                        <dd className="text-gray-200">
                          {viewItem?.telefono ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Email</dt>
                        <dd className="text-gray-200">
                          {viewItem?.email ?? '—'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Responsable</dt>
                        <dd className="text-gray-200">
                          {viewItem?.responsable_nombre ?? '—'}
                          {viewItem?.responsable_dni
                            ? ` · DNI ${viewItem.responsable_dni}`
                            : ''}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-gray-400">Horario</dt>
                        <dd className="text-gray-200">
                          {viewItem?.horario_apertura ?? '—'} –{' '}
                          {viewItem?.horario_cierre ?? '—'}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-gray-400">Notas</dt>
                        <dd className="text-gray-200">
                          {viewItem?.notas ?? '—'}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  {/* (Opcional) Mapa / embed / métricas */}
                  {/* <section>...</section> */}
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Footer */}
                <div className="px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    type="button" /* 👈 evita submit */
                    onClick={() => {
                      console.log('[view] cerrar');
                      closeView();
                    }}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl
                 bg-white/5 ring-1 ring-white/10 text-gray-200
                 hover:bg-white/10 focus:outline-none focus:ring-2
                 focus:ring-[#871cca]/50 transition"
                  >
                    Cerrar
                  </button>
                  <button
                    type="button" /* 👈 evita submit */
                    onClick={() => {
                      console.log('[view] editar', viewItem);
                      closeView();
                      openModal?.(
                        viewItem
                      ); /* asegúrate que openModal exista */
                    }}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-xl
                 bg-gradient-to-r from-[#871cca] to-[#ff7a3d]
                 hover:from-[#ff6a28] hover:to-[#ff8c52]
                 text-white font-semibold
                 shadow-lg shadow-[rgba(252,75,8,.25)]
                 focus:outline-none focus:ring-2 focus:ring-[#871cca]/50
                 transition"
                  >
                    Editar
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default LocalesGet;
