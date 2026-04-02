import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaDumbbell,
  FaBolt,
  FaLayerGroup,
  FaTimes
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import EjercicioModal from './EjercicioModal';
import ButtonBack from '../../components/ButtonBack';
import ParticlesBackground from '../../components/ParticlesBackground';
import NavbarStaff from '../staff/NavbarStaff';

const API_URL = 'http://localhost:8080/catalogo-ejercicios';
const PAGE_LIMIT = 12;

const fontDisplay = {
  fontFamily: 'var(--font-family-display, "BigNoodle", sans-serif)'
};
const fontTitle = {
  fontFamily: 'var(--font-family-base, "Montserrat", sans-serif)'
};
const fontBody = {
  fontFamily: 'var(--font-family-body, "MessinaRegular", sans-serif)'
};

function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function MetricCard({ icon, label, value, sublabel }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.10)_0%,rgba(255,255,255,0.035)_48%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-white/50"
            style={fontTitle}
          >
            {label}
          </p>
          <div className="mt-2 flex items-end gap-2">
            <span
              className="text-3xl leading-none text-white"
              style={{ ...fontDisplay, letterSpacing: '0.04em' }}
            >
              {value}
            </span>
          </div>
          {sublabel && (
            <p className="mt-2 text-xs text-white/65" style={fontBody}>
              {sublabel}
            </p>
          )}
        </div>

        <div
          className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/12 text-[#ff98a5]"
          style={{ boxShadow: '0 0 24px rgba(239, 51, 71, 0.18)' }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 md:p-12 text-center backdrop-blur-xl"
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.03)_48%,rgba(0,0,0,0.35)_100%)]" />
      <div className="absolute -top-14 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#d11f2f]/15 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div
          className="mb-5 grid h-20 w-20 place-items-center rounded-[26px] border border-[#ef3347]/20 bg-[#ef3347]/10 text-3xl text-[#ff98a5]"
          style={{ boxShadow: '0 0 24px rgba(239, 51, 71, 0.18)' }}
        >
          <FaDumbbell />
        </div>

        <span
          className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]"
          style={fontTitle}
        >
          Catálogo vacío
        </span>

        <h3
          className="mt-5 text-2xl font-black text-white md:text-3xl"
          style={fontTitle}
        >
          Todavía no hay ejercicios cargados
        </h3>

        <p
          className="mt-3 max-w-xl text-sm leading-6 text-white/68 md:text-base"
          style={fontBody}
        >
          Empezá construyendo tu biblioteca de ejercicios predefinidos para que
          el equipo trabaje con mayor velocidad, consistencia y orden en la
          carga de rutinas.
        </p>

        <button
          onClick={onNew}
          className="mt-7 inline-flex items-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02]"
          style={{
            ...fontTitle,
            boxShadow: '0 0 24px rgba(239, 51, 71, 0.22)'
          }}
        >
          <FaPlus />
          Nuevo ejercicio
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl animate-pulse">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.08)_0%,rgba(255,255,255,0.025)_48%,rgba(0,0,0,0.30)_100%)]" />
      <div className="relative">
        <div className="mb-3 h-3 w-24 rounded-full bg-white/10" />
        <div className="mb-2 h-5 w-2/3 rounded-full bg-white/10" />
        <div className="mb-5 h-4 w-1/3 rounded-full bg-white/10" />
        <div className="mb-5 flex gap-2">
          <div className="h-6 w-20 rounded-full bg-white/10" />
          <div className="h-6 w-16 rounded-full bg-white/10" />
          <div className="h-6 w-14 rounded-full bg-white/10" />
        </div>
        <div className="flex justify-between">
          <div className="h-10 w-24 rounded-2xl bg-white/10" />
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-2xl bg-white/10" />
            <div className="h-10 w-10 rounded-2xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmDelete({ open, onClose, onConfirm, loadingDelete = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] grid place-items-center bg-black/75 px-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.currentTarget === e.target && onClose()}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0b]/95 p-6 md:p-7"
            style={{ boxShadow: '0 0 36px rgba(239, 51, 71, 0.18)' }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.14)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span
                    className="inline-flex rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-[#ff98a5]"
                    style={fontTitle}
                  >
                    Confirmación
                  </span>
                  <h4
                    className="mt-4 text-2xl font-black text-white"
                    style={fontTitle}
                  >
                    Eliminar ejercicio
                  </h4>
                  <p
                    className="mt-2 text-sm leading-6 text-white/65"
                    style={fontBody}
                  >
                    Esta acción eliminará el ejercicio del catálogo y no se
                    podrá deshacer desde esta pantalla.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={onClose}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                  style={fontTitle}
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loadingDelete}
                  className="rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-5 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    ...fontTitle,
                    boxShadow: '0 0 24px rgba(239, 51, 71, 0.22)'
                  }}
                >
                  {loadingDelete ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PaginationButton({
  disabled,
  onClick,
  children,
  active = false,
  ariaLabel
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        'min-w-[42px] h-[42px] rounded-2xl px-3 text-sm font-semibold transition-all duration-200',
        active
          ? 'border border-[#ef3347]/30 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] text-white'
          : 'border border-white/10 bg-white/[0.04] text-white/82 hover:border-[#ef3347]/20 hover:bg-white/[0.08]',
        disabled ? 'cursor-not-allowed opacity-40 hover:bg-white/[0.04]' : ''
      ].join(' ')}
      style={{
        ...fontTitle,
        boxShadow: active ? '0 0 24px rgba(239, 51, 71, 0.18)' : 'none'
      }}
    >
      {children}
    </button>
  );
}

export default function EjerciciosCatalogo() {
  const [ejercicios, setEjercicios] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalEjercicios, setTotalEjercicios] = useState(0);

  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const limit = PAGE_LIMIT;
  const maxBotones = 5;

  const [pendingDelete, setPendingDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      const targetTag = e.target?.tagName?.toLowerCase();
      const isTypingField =
        targetTag === 'input' ||
        targetTag === 'textarea' ||
        e.target?.isContentEditable;

      if (e.key === '/') {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if ((e.key === 'n' || e.key === 'N') && !modalOpen && !isTypingField) {
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
      const total = Number(data.total || 0);

      setEjercicios(data.rows || []);
      setTotalEjercicios(total);
      setTotalPaginas(Math.max(1, Math.ceil(total / limit)));
      setPaginaActual(page);
    } catch (err) {
      console.error('Error cargando ejercicios', err);
      setError('No se pudo cargar el catálogo. Reintentá en unos segundos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Benjamin Orellana - 2026-04-02 - Se centraliza la carga inicial y la recarga por búsqueda en un único efecto para evitar requests duplicados al montar el componente.
    fetchEjercicios(1, debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleDelete = async (id) => {
    setPendingDelete(id);
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setLoadingDelete(true);
      const res = await fetch(`${API_URL}/${pendingDelete}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setPendingDelete(null);

      const paginaObjetivo =
        ejercicios.length === 1 && paginaActual > 1
          ? paginaActual - 1
          : paginaActual;

      fetchEjercicios(paginaObjetivo, debouncedSearch);
    } catch (err) {
      console.error('Error eliminando ejercicio', err);
      setError('No se pudo eliminar el ejercicio. Reintentá nuevamente.');
    } finally {
      setLoadingDelete(false);
    }
  };

  const getPaginasVisibles = () => {
    let start = Math.max(1, paginaActual - Math.floor(maxBotones / 2));
    let end = Math.min(totalPaginas, start + maxBotones - 1);

    if (end - start + 1 < maxBotones) {
      start = Math.max(1, end - maxBotones + 1);
    }

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
      <div className="mt-4 flex flex-wrap gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] text-white/76"
            style={fontBody}
          >
            {c}
          </span>
        ))}
      </div>
    );
  };

  const resumenPaginacion = useMemo(() => {
    const desde = totalEjercicios === 0 ? 0 : (paginaActual - 1) * limit + 1;
    const hasta = Math.min(paginaActual * limit, totalEjercicios);

    return { desde, hasta };
  }, [paginaActual, totalEjercicios, limit]);

  const hasActiveSearch = debouncedSearch.trim().length > 0;

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)]">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-10%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 pt-5 md:px-6 md:pb-14">
          <ButtonBack />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="mb-5 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-200">
                  Altos Roca Gym
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-12 w-1.5 rounded-full bg-gradient-to-b from-red-400 to-red-700" />

                  <div className="min-w-0">
                    <h1 className="titulo uppercase text-3xl font-black tracking-tight text-white">
                      Ejercicios
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                      Definí los ejercicios para luego crear de forma rápida en las rutinas.
                    </p>
                  
                  </div>
                </div>
              </div>
            
            </div>
          </motion.div>

          <section className="mt-6">
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl md:p-5">
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.08)_0%,rgba(255,255,255,0.02)_48%,rgba(0,0,0,0.28)_100%)]" />

              <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative w-full md:max-w-[420px]">
                    <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Buscar por nombre, músculo, alias o tags"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/20 pl-12 pr-12 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#ef3347]/30 focus:ring-2 focus:ring-[#ef3347]/15"
                      style={fontBody}
                    />

                    {search && (
                      <button
                        onClick={() => setSearch('')}
                        className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                        aria-label="Limpiar búsqueda"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {hasActiveSearch && (
                      <span
                        className="inline-flex rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-[#ff98a5]"
                        style={fontTitle}
                      >
                        Filtro activo
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <div
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72"
                    style={fontBody}
                  >
                    Mostrando{' '}
                    <span
                      className="font-semibold text-white"
                      style={fontTitle}
                    >
                      {resumenPaginacion.desde}
                    </span>{' '}
                    a{' '}
                    <span
                      className="font-semibold text-white"
                      style={fontTitle}
                    >
                      {resumenPaginacion.hasta}
                    </span>{' '}
                    de{' '}
                    <span
                      className="font-semibold text-white"
                      style={fontTitle}
                    >
                      {totalEjercicios}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setEditData(null);
                      setModalOpen(true);
                    }}
                    className="titulo uppercase inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-5 text-sm font-semibold text-white transition hover:scale-[1.01]"
                    style={{
                      ...fontTitle,
                      boxShadow: '0 0 24px rgba(239, 51, 71, 0.22)'
                    }}
                  >
                    <FaPlus />
                    Nuevo ejercicio
                  </button>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <div
              className="mt-4 rounded-[24px] border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-3 text-sm text-[#ffd5db]"
              style={fontBody}
            >
              {error}
            </div>
          )}

          <section className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : ejercicios.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {ejercicios.map((ej, index) => (
                  <motion.article
                    key={ej.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.02 }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#ef3347]/18"
                    style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.18)' }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.08)_0%,rgba(255,255,255,0.03)_48%,rgba(0,0,0,0.35)_100%)] opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.02)_0%,rgba(239,51,71,0.35)_50%,rgba(239,51,71,0.02)_100%)]" />
                    <div className="absolute -right-10 top-[-28px] h-24 w-24 rounded-full bg-[#ef3347]/10 blur-2xl transition-all duration-300 group-hover:bg-[#ef3347]/16" />

                    <div className="relative">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <span
                            className="inline-flex rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50"
                            style={fontTitle}
                          >
                            Ejercicio #{ej.id}
                          </span>

                          <h2
                            className="mt-4 line-clamp-2 text-xl font-black uppercase leading-tight text-white"
                            style={fontTitle}
                          >
                            {ej.nombre}
                          </h2>

                          <p
                            className="mt-2 text-sm text-white/60"
                            style={fontBody}
                          >
                            {ej.musculo || 'Sin grupo muscular definido'}
                          </p>
                        </div>

                        <div
                          className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#ef3347]/18 bg-[#ef3347]/10 text-[#ff98a5]"
                          style={{
                            boxShadow: '0 0 14px rgba(239, 51, 71, 0.18)'
                          }}
                        >
                          <FaDumbbell />
                        </div>
                      </div>

                      {renderAliases(ej.aliases)}

                      {ej.tags && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {String(ej.tags)
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean)
                            .slice(0, 4)
                            .map((t) => (
                              <span
                                key={t}
                                className="rounded-full border border-[#ef3347]/16 bg-[#ef3347]/10 px-3 py-1 text-[11px] text-[#ffd5db]"
                                style={fontBody}
                              >
                                #{t}
                              </span>
                            ))}
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between gap-3">
                        <div
                          className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/55"
                          style={fontBody}
                        >
                          Catálogo operativo
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditData(ej);
                              setModalOpen(true);
                            }}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/78 transition hover:border-[#ef3347]/20 hover:bg-white/[0.08] hover:text-white"
                            title="Editar"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() => handleDelete(ej.id)}
                            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ef3347]/16 bg-[#ef3347]/10 text-[#ff98a5] transition hover:bg-[#ef3347]/16 hover:text-white"
                            title="Eliminar"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
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
          </section>

          {totalPaginas > 1 && (
            <section className="mt-8">
              <div className="flex flex-col items-center justify-center gap-4 rounded-[30px] border border-white/10 bg-white/[0.04] px-4 py-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <PaginationButton
                    disabled={paginaActual === 1}
                    onClick={() => fetchEjercicios(1, debouncedSearch)}
                    ariaLabel="Primera página"
                  >
                    <FaAngleDoubleLeft />
                  </PaginationButton>

                  <PaginationButton
                    disabled={paginaActual === 1}
                    onClick={() =>
                      fetchEjercicios(paginaActual - 1, debouncedSearch)
                    }
                    ariaLabel="Página anterior"
                  >
                    <FaChevronLeft />
                  </PaginationButton>

                  {getPaginasVisibles().map((pagina) => (
                    <PaginationButton
                      key={pagina}
                      onClick={() => fetchEjercicios(pagina, debouncedSearch)}
                      active={pagina === paginaActual}
                    >
                      {pagina}
                    </PaginationButton>
                  ))}

                  <PaginationButton
                    disabled={paginaActual === totalPaginas}
                    onClick={() =>
                      fetchEjercicios(paginaActual + 1, debouncedSearch)
                    }
                    ariaLabel="Página siguiente"
                  >
                    <FaChevronRight />
                  </PaginationButton>

                  <PaginationButton
                    disabled={paginaActual === totalPaginas}
                    onClick={() =>
                      fetchEjercicios(totalPaginas, debouncedSearch)
                    }
                    ariaLabel="Última página"
                  >
                    <FaAngleDoubleRight />
                  </PaginationButton>
                </div>

                <p className="text-xs text-white/45" style={fontBody}>
                  Página actual: {paginaActual} de {totalPaginas}
                </p>
              </div>
            </section>
          )}

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
            loadingDelete={loadingDelete}
          />
        </div>
      </div>
    </>
  );
}
