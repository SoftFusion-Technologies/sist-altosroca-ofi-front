import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EjercicioModal from './EjercicioModal';
import ButtonBack from '../../components/ButtonBack';
import ParticlesBackground from '../../components/ParticlesBackground';
import NavbarStaff from '../staff/NavbarStaff';

const API_URL = 'http://localhost:8080/catalogo-ejercicios';
const PAGE_LIMIT = 12; // + visual

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function EmptyState({ onNew }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-10 text-center rounded-3xl border border-white/10 bg-slate-900/60 ring-1 ring-white/10">
      <div className="text-5xl">🏋️‍♂️</div>
      <div>
        <h3 className="text-lg font-semibold text-slate-100">Sin ejercicios</h3>
        <p className="text-slate-400 text-sm">
          Crea tu primer ejercicio para comenzar el catálogo.
        </p>
      </div>
      <button
        onClick={onNew}
        className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
      >
        <FaPlus className="inline mr-2" /> Nuevo ejercicio
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 ring-1 ring-white/10 p-4 animate-pulse">
      <div className="h-4 w-2/3 bg-white/10 rounded mb-2" />
      <div className="h-3 w-1/3 bg-white/10 rounded mb-3" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-white/10 rounded-full" />
        <div className="h-6 w-12 bg-white/10 rounded-full" />
      </div>
      <div className="mt-4 h-8 w-24 bg-white/10 rounded" />
    </div>
  );
}

function ConfirmDelete({ open, onClose, onConfirm }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[130] grid place-items-center bg-black/70 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => e.currentTarget === e.target && onClose()}
      >
        <motion.div
          initial={{ y: 24, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 24, opacity: 0, scale: 0.97 }}
          className="w-full max-w-md mx-4 rounded-2xl border border-white/10 bg-slate-950/90 p-5 ring-1 ring-white/10"
        >
          <h4 className="text-slate-100 font-semibold text-lg mb-2">
            Eliminar ejercicio
          </h4>
          <p className="text-slate-400 text-sm mb-5">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500"
            >
              Eliminar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function EjerciciosCatalogo() {
  const [ejercicios, setEjercicios] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const limit = PAGE_LIMIT;
  const maxBotones = 5;

  // Delete modal
  const [pendingDelete, setPendingDelete] = useState(null);

  // Search input ref + keyboard shortcuts
  const searchRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if ((e.key === 'n' || e.key === 'N') && !modalOpen) {
        setEditData(null);
        setModalOpen(true);
      }
      if (e.key === 'Escape') {
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalOpen]);

  const debouncedSearch = useDebounced(search, 400);

  const fetchEjercicios = async (page = 1, q = '') => {
    try {
      setLoading(true);
      setError('');
      const query = new URLSearchParams({
        page,
        limit,
        ...(q && { q })
      }).toString();
      const res = await fetch(`${API_URL}?${query}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEjercicios(data.rows || []);
      setTotalPaginas(Math.max(1, Math.ceil((data.total || 0) / limit)));
      setPaginaActual(page);
    } catch (err) {
      console.error('Error cargando ejercicios', err);
      setError('No se pudo cargar el catálogo. Reintentá en unos segundos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEjercicios(1, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    fetchEjercicios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    setPendingDelete(id);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await fetch(`${API_URL}/${pendingDelete}`, { method: 'DELETE' });
      setPendingDelete(null);
      fetchEjercicios(paginaActual, debouncedSearch);
    } catch (err) {
      console.error('Error eliminando ejercicio', err);
    }
  };

  // Paginación dinámica
  const getPaginasVisibles = () => {
    let start = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let end = Math.min(totalPaginas, start + maxBotones - 1);
    if (end - start + 1 < maxBotones) start = Math.max(1, end - maxBotones + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const renderAliases = (aliases) => {
    if (!aliases) return null;
    const chips = String(aliases)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    if (chips.length === 0) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c}
            className="text-[11px] rounded-full border border-white/10 bg-white/5 text-slate-300 px-2 py-0.5"
          >
            {c}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <NavbarStaff />
      <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,1),rgba(2,6,23,1))]">
        <ParticlesBackground />
        <div className="relative z-10 p-4 md:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <ButtonBack />

          <div className="mt-2 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <h1 className="titulo uppercase text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-purple-300 bg-clip-text text-transparent select-none">
              Ejercicios predefinidos
            </h1>

            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-1 md:flex-none">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Buscar"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full md:w-[300px] rounded-2xl border border-white/10 bg-slate-900/70 px-9 py-2 text-slate-100 placeholder-slate-500 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <button
                onClick={() => {
                  setEditData(null);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 shadow-sm"
              >
                <FaPlus /> Nuevo
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
              {error}
            </div>
          )}

          {/* Lista de ejercicios */}
          {loading ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : ejercicios.length > 0 ? (
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {ejercicios.map((ej) => (
                <motion.div
                  key={ej.id}
                  className="group rounded-2xl border border-white/10 bg-slate-900/60 ring-1 ring-white/10 p-4 hover:bg-slate-900/70 hover:shadow-xl transition-shadow"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
                        {ej.nombre}
                      </h2>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {ej.musculo || '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 opacity-90">
                      <button
                        onClick={() => {
                          setEditData(ej);
                          setModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(ej.id)}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-white/10 text-red-300 hover:bg-red-500/10"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {renderAliases(ej.aliases)}

                  {ej.tags && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {String(ej.tags)
                        .split(',')
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .slice(0, 4)
                        .map((t) => (
                          <span
                            key={t}
                            className="text-[10px] rounded-full bg-indigo-500/15 text-indigo-200 px-2 py-0.5"
                          >
                            #{t}
                          </span>
                        ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              onNew={() => {
                setEditData(null);
                setModalOpen(true);
              }}
            />
          )}

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              <button
                disabled={paginaActual === 1}
                onClick={() => fetchEjercicios(1, debouncedSearch)}
                className={`h-9 w-9 grid place-items-center rounded-xl ${
                  paginaActual === 1
                    ? 'bg-white/5 text-slate-500 border border-white/10'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
                aria-label="Primera página"
              >
                <FaAngleDoubleLeft />
              </button>

              <button
                disabled={paginaActual === 1}
                onClick={() =>
                  fetchEjercicios(paginaActual - 1, debouncedSearch)
                }
                className={`h-9 w-9 grid place-items-center rounded-xl ${
                  paginaActual === 1
                    ? 'bg-white/5 text-slate-500 border border-white/10'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
                aria-label="Página anterior"
              >
                <FaChevronLeft />
              </button>

              {getPaginasVisibles().map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => fetchEjercicios(pagina, debouncedSearch)}
                  className={`min-w-9 px-3 h-9 rounded-xl font-bold ring-1 ${
                    pagina === paginaActual
                      ? 'bg-indigo-600 text-white ring-indigo-400/40'
                      : 'bg-white/5 text-slate-200 hover:bg-white/10 ring-white/10'
                  }`}
                >
                  {pagina}
                </button>
              ))}

              <button
                disabled={paginaActual === totalPaginas}
                onClick={() =>
                  fetchEjercicios(paginaActual + 1, debouncedSearch)
                }
                className={`h-9 w-9 grid place-items-center rounded-xl ${
                  paginaActual === totalPaginas
                    ? 'bg-white/5 text-slate-500 border border-white/10'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
                aria-label="Página siguiente"
              >
                <FaChevronRight />
              </button>

              <button
                disabled={paginaActual === totalPaginas}
                onClick={() => fetchEjercicios(totalPaginas, debouncedSearch)}
                className={`h-9 w-9 grid place-items-center rounded-xl ${
                  paginaActual === totalPaginas
                    ? 'bg-white/5 text-slate-500 border border-white/10'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
                aria-label="Última página"
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          )}

          {/* Modales */}
          <AnimatePresence>
            {modalOpen && (
              <EjercicioModal
                onClose={() => setModalOpen(false)}
                onSave={() => fetchEjercicios(paginaActual, debouncedSearch)}
                editData={editData}
              />
            )}
          </AnimatePresence>

          <ConfirmDelete
            open={Boolean(pendingDelete)}
            onClose={() => setPendingDelete(null)}
            onConfirm={confirmDelete}
          />

          {/* Footer hint */}
          <div className="mt-8 text-center text-xs text-slate-500">
            Atajos: <kbd className="px-1 rounded border border-white/10">/</kbd>{' '}
            buscar ·{' '}
            <kbd className="px-1 rounded border border-white/10">N</kbd> nuevo
          </div>
        </div>
      </div>
    </>
  );
}
