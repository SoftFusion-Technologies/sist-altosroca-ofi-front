import React, { useEffect, useMemo, useState } from 'react';
import ParticlesBackground from '../../components/ParticlesBackground';
import ButtonBack from '../../components/ButtonBack';
import NavbarStaff from '../staff/NavbarStaff';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPalette,
  FaSwatchbook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

const MAX_COLORS = 8; // Máximo a mostrar antes del botón "Mostrar más"

export default function ColoresRutinaCrud() {
  const [colores, setColores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    color_hex: '#ef4444',
    descripcion: ''
  });
  const [feedback, setFeedback] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const endpoint = 'http://localhost:8080/rutina-colores';

  const fetchColores = async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setColores(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Error al cargar colores' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColores();
  }, []);

  // Benjamin Orellana - 02 / 04 / 2026 - Se normaliza la apertura del modal para crear o editar colores conservando la lógica CRUD existente
  const openModal = (color) => {
    setEditing(color || null);
    setForm(
      color
        ? {
            nombre: color.nombre,
            color_hex: color.color_hex,
            descripcion: color.descripcion || ''
          }
        : { nombre: '', color_hex: '#ef4444', descripcion: '' }
    );
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      setFeedback({ type: 'error', msg: 'El nombre es obligatorio' });
      return;
    }

    try {
      setLoading(true);
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `${endpoint}/${editing.id}` : endpoint;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error();

      setModalOpen(false);
      setFeedback({
        type: 'success',
        msg: editing
          ? 'Color actualizado correctamente'
          : 'Color creado correctamente'
      });
      fetchColores();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al guardar' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este color?')) return;

    setDeletingId(id);
    try {
      await fetch(`${endpoint}/${id}`, { method: 'DELETE' });
      setFeedback({ type: 'success', msg: 'Color eliminado correctamente' });
      fetchColores();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar' });
    } finally {
      setDeletingId(null);
    }
  };

  // Benjamin Orellana - 02 / 04 / 2026 - Se mejora la presentación visual limitando y resumiendo colores visibles sin alterar la lógica original
  const displayedColors = showAll ? colores : colores.slice(0, MAX_COLORS);

  const resumen = useMemo(() => {
    return {
      total: colores.length,
      visibles: displayedColors.length
    };
  }, [colores, displayedColors]);

  return (
    <>
      <NavbarStaff />

      <section className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.10),transparent_24%),linear-gradient(180deg,#050505_0%,#090909_50%,#060606_100%)]">
        <ParticlesBackground />
        <ButtonBack />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="mb-6 rounded-[30px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  Rutinas
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 via-red-600 to-red-500 text-white shadow-[0_14px_30px_rgba(220,38,38,0.28)]">
                    <FaPalette />
                  </div>

                  <div className="min-w-0">
                    <h1 className="text-2xl titulo uppercase font-black tracking-tight text-white sm:text-3xl">
                      Colores de rutinas
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                      Administrá la paleta visual utilizada en bloques, rutinas
                      y organización interna.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <FaSwatchbook className="text-red-300" />
                        {resumen.total} colores
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        Mostrando {resumen.visibles}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openModal(null)}
                className="inline-flex titulo uppercase items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(220,38,38,0.28)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(220,38,38,0.34)]"
              >
                <FaPlus />
                Nuevo color
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`mb-5 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  feedback.type === 'error'
                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-200'
                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                {feedback.type === 'error' ? (
                  <FaExclamationTriangle />
                ) : (
                  <FaCheckCircle />
                )}
                <span>{feedback.msg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="flex justify-center py-20">
              <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-red-500" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.05 }}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
              >
                {displayedColors.map((color, index) => (
                  <motion.article
                    key={color.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.24, delay: index * 0.03 }}
                    className="group overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0d]/95 shadow-[0_16px_38px_rgba(0,0,0,0.28)] transition-all duration-300 hover:border-red-500/25 hover:shadow-[0_20px_45px_rgba(220,38,38,0.10)]"
                  >
                    <div
                      className="h-1.5 w-full"
                      style={{ background: color.color_hex }}
                    />

                    <div className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="shrink-0">
                          <div
                            className="h-20 w-20 rounded-2xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                            style={{ background: color.color_hex }}
                            title={color.color_hex}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-lg font-bold text-white">
                              {color.nombre}
                            </h3>

                            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-300">
                              {color.color_hex}
                            </span>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                            <div className="text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
                              Descripción
                            </div>
                            <p className="mt-1 min-h-[40px] text-sm leading-relaxed text-zinc-300">
                              {color.descripcion?.trim()
                                ? color.descripcion
                                : 'Sin descripción cargada.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <button
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:border-red-500/35 hover:bg-red-600/10 hover:text-white"
                          title="Editar"
                          onClick={() => openModal(color)}
                        >
                          <FaEdit />
                          Editar
                        </button>

                        <button
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:border-red-500/35 hover:bg-red-600/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                          title="Eliminar"
                          onClick={() => handleDelete(color.id)}
                          disabled={deletingId === color.id}
                        >
                          <FaTrash />
                          {deletingId === color.id
                            ? 'Eliminando...'
                            : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>

              {colores.length > MAX_COLORS && (
                <div className="mt-8 flex justify-center">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                    onClick={() => setShowAll((show) => !show)}
                  >
                    {showAll ? <FaChevronUp /> : <FaChevronDown />}
                    {showAll
                      ? 'Mostrar menos'
                      : `Mostrar ${colores.length - MAX_COLORS} más`}
                  </button>
                </div>
              )}

              {colores.length === 0 && !loading && (
                <div className="mt-6 rounded-[28px] border border-white/10 bg-[#0b0b0d]/95 p-10 text-center shadow-[0_14px_38px_rgba(0,0,0,0.25)]">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-300">
                    <FaPalette />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    No hay colores cargados
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400">
                    Creá el primer color para comenzar a organizar visualmente
                    tus rutinas.
                  </p>
                  <button
                    onClick={() => openModal(null)}
                    className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(220,38,38,0.28)] transition-all duration-300 hover:translate-y-[-1px]"
                  >
                    <FaPlus />
                    Crear color
                  </button>
                </div>
              )}
            </>
          )}

          <AnimatePresence>
            {modalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 grid place-items-center bg-black/75 p-4 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 18, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="w-full max-w-xl overflow-hidden rounded-[30px] border border-white/10 bg-[#09090b] shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                >
                  <div
                    className="h-1.5 w-full"
                    style={{ background: form.color_hex || '#ef4444' }}
                  />

                  <div className="p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                          Rutinas
                        </div>

                        <h2 className="text-2xl font-black tracking-tight text-white">
                          {editing ? 'Editar color' : 'Nuevo color'}
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                          Configurá el nombre, color y descripción para
                          reutilizarlo en las rutinas.
                        </p>
                      </div>

                      <button
                        onClick={() => setModalOpen(false)}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-300 transition-all duration-200 hover:border-red-500/35 hover:bg-red-600/10 hover:text-white"
                        title="Cerrar"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSave}>
                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          Nombre del color
                        </label>
                        <input
                          type="text"
                          value={form.nombre}
                          onChange={(e) =>
                            setForm({ ...form, nombre: e.target.value })
                          }
                          className="w-full rounded-2xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-[#101013]"
                          maxLength={30}
                          required
                          placeholder="Ej: Rojo fuerte"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-[140px,1fr]">
                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Color
                          </label>
                          <input
                            type="color"
                            value={form.color_hex}
                            onChange={(e) =>
                              setForm({ ...form, color_hex: e.target.value })
                            }
                            className="h-14 w-full cursor-pointer rounded-2xl border border-white/10 bg-[#0b0b0d] p-2"
                            required
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Vista previa / HEX
                          </label>
                          <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-[#0b0b0d] px-4">
                            <div
                              className="h-8 w-8 rounded-xl border border-white/10"
                              style={{ background: form.color_hex }}
                            />
                            <span className="font-mono text-sm text-zinc-200">
                              {form.color_hex}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                          Descripción
                        </label>
                        <textarea
                          value={form.descripcion}
                          onChange={(e) =>
                            setForm({ ...form, descripcion: e.target.value })
                          }
                          className="min-h-[110px] w-full resize-none rounded-2xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-[#101013]"
                          maxLength={120}
                          placeholder="Breve descripción opcional"
                        />
                      </div>

                      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200 transition-all duration-300 hover:border-red-500/25 hover:bg-red-500/10 hover:text-white"
                        >
                          Cancelar
                        </button>

                        <button
                          type="submit"
                          className="rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(220,38,38,0.24)] transition-all duration-300 hover:translate-y-[-1px]"
                        >
                          {editing ? 'Actualizar' : 'Crear'}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
