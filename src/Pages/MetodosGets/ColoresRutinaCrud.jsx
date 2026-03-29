import React, { useEffect, useState } from 'react';
import ParticlesBackground from '../../components/ParticlesBackground';
import ButtonBack from '../../components/ButtonBack';

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
      setColores(data);
    } catch (err) {
      setFeedback({ type: 'error', msg: 'Error al cargar colores' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColores();
  }, []);

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
        msg: editing ? 'Color actualizado' : 'Color creado'
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
      setFeedback({ type: 'success', msg: 'Color eliminado' });
      fetchColores();
    } catch {
      setFeedback({ type: 'error', msg: 'Error al eliminar' });
    } finally {
      setDeletingId(null);
    }
  };

  // Colores a mostrar según el límite
  const displayedColors = showAll ? colores : colores.slice(0, MAX_COLORS);

  return (
    <section className="relative w-full min-h-screen mx-auto bg-[radial-gradient(ellipse_at_top,rgba(2,6,23,1),rgba(2,6,23,1))]">
      <ButtonBack></ButtonBack>
      <ParticlesBackground />

      {/* Capa principal */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-slate-200 via-zinc-300 to-slate-200 bg-clip-text text-transparent">
            🎨 Colores de Rutinas
          </h1>
          <button
            onClick={() => openModal(null)}
            className="px-5 py-2 rounded-xl font-semibold text-slate-100 bg-slate-900/80 hover:bg-slate-800 transition ring-1 ring-white/10"
          >
            + Nuevo color
          </button>
        </div>

        {feedback && (
          <div
            className={`mb-6 px-4 py-2 rounded-lg text-sm font-semibold ring-1 ${
              feedback.type === 'error'
                ? 'bg-rose-900/60 text-rose-100 ring-rose-500/30'
                : 'bg-emerald-900/60 text-emerald-100 ring-emerald-500/30'
            }`}
          >
            {feedback.msg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="animate-spin w-10 h-10 border-4 border-slate-400/40 border-t-transparent rounded-full inline-block" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedColors.map((color) => (
                <article
                  key={color.id}
                  className="group rounded-2xl p-[1px] bg-gradient-to-br from-white/10 via-white/5 to-transparent hover:from-white/20 hover:via-white/10 transition"
                >
                  <div className="rounded-2xl h-full bg-slate-950/80 backdrop-blur p-4 ring-1 ring-white/10">
                    <div className="flex items-center gap-4">
                      <div
                        className="rounded-xl w-16 h-16 ring-1 ring-white/20 shadow"
                        style={{ background: color.color_hex }}
                        title={color.color_hex}
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-100 truncate">
                          {color.nombre}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono">
                          {color.color_hex}
                        </p>
                        {color.descripcion && (
                          <p className="text-sm text-slate-300/90 line-clamp-2 mt-1">
                            {color.descripcion}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-slate-200 hover:bg-white/5"
                          title="Editar"
                          onClick={() => openModal(color)}
                        >
                          Editar
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-rose-300 hover:bg-rose-500/10 disabled:opacity-60"
                          title="Eliminar"
                          onClick={() => handleDelete(color.id)}
                          disabled={deletingId === color.id}
                        >
                          {deletingId === color.id ? 'Eliminando…' : 'Eliminar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {colores.length > MAX_COLORS && (
              <div className="flex justify-center mt-8">
                <button
                  className="px-5 py-2 rounded-xl font-semibold text-slate-100 bg-slate-900/80 hover:bg-slate-800 transition ring-1 ring-white/10"
                  onClick={() => setShowAll((show) => !show)}
                >
                  {showAll
                    ? 'Mostrar menos'
                    : `Mostrar ${colores.length - MAX_COLORS} más`}
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal crear/editar */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-slate-950/95 ring-1 ring-white/10 p-6 relative">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200 text-xl"
                title="Cerrar"
              >
                ✕
              </button>

              <h2 className="text-xl font-bold text-slate-100">
                {editing ? 'Editar color' : 'Nuevo color'}
              </h2>

              <form className="mt-5 space-y-5" onSubmit={handleSave}>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nombre del color <span className="text-rose-300">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/60"
                    maxLength={30}
                    required
                    placeholder="Ej: Rojo fuerte"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Color
                  </label>
                  <input
                    type="color"
                    value={form.color_hex}
                    onChange={(e) =>
                      setForm({ ...form, color_hex: e.target.value })
                    }
                    className="w-16 h-10 p-0 border border-white/10 bg-slate-900/70 rounded-lg cursor-pointer"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Descripción
                  </label>
                  <input
                    type="text"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/60"
                    maxLength={60}
                    placeholder="Breve descripción opcional"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-200 border border-white/10 hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-semibold text-slate-900 bg-slate-200 hover:bg-white transition"
                  >
                    {editing ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
