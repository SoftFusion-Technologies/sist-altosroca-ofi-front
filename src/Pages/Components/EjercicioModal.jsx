import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X as IconClose,
  Save as IconSave,
  Tag as IconTag,
  Video as IconVideo,
  Dumbbell as IconDumbbell,
  Type as IconType
} from 'lucide-react';

// Puedes mover esto a env si querés
const API_URL = 'http://localhost:8080/catalogo-ejercicios';

/**
 * ChipsInput — input tokenizado accesible y sin dependencias
 * - Enter / Coma / Tab para agregar chip
 * - Backspace borra último si input está vacío
 * - Click en chip para eliminar
 */
function ChipsInput({
  label,
  placeholder,
  value = [],
  onChange,
  id,
  icon: Icon = IconTag,
  suggestions = []
}) {
  const [input, setInput] = useState('');
  const addChip = (v) => {
    const t = (v || '').trim();
    if (!t) return;
    if (!value.includes(t)) onChange([...value, t]);
    setInput('');
  };
  const removeChip = (chip) => onChange(value.filter((c) => c !== chip));
  const onKeyDown = (e) => {
    if (['Enter', ',', 'Tab'].includes(e.key)) {
      e.preventDefault();
      addChip(input);
    } else if (e.key === 'Backspace' && !input && value.length) {
      onChange(value.slice(0, -1));
    }
  };
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-sm text-slate-300 mb-1 block">
        <span className="inline-flex items-center gap-2">
          <Icon className="h-4 w-4" /> {label}
        </span>
      </label>
      <div className="rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50">
        <div className="flex flex-wrap gap-2">
          {value.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => removeChip(chip)}
              className="group inline-flex items-center gap-1 rounded-full bg-indigo-500/15 text-indigo-200 hover:bg-indigo-500/25 px-2.5 py-1 text-xs"
              title="Quitar"
            >
              <span>{chip}</span>
              <span className="rounded-full bg-indigo-400/20 p-0.5 group-hover:bg-indigo-400/30">
                ×
              </span>
            </button>
          ))}
          <input
            id={id}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-[140px] bg-transparent placeholder-slate-500 outline-none text-slate-100"
          />
        </div>
        {suggestions?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestions.slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addChip(s)}
                className="text-[11px] rounded-full border border-white/10 px-2 py-0.5 text-slate-300 hover:bg-white/5"
              >
                + {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ id, label, icon: Icon, children, help }) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="text-sm text-slate-300 mb-1 block">
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />} {label}
        </span>
      </label>
      {children}
      {help && <p className="mt-1 text-xs text-slate-500">{help}</p>}
    </div>
  );
}

function TextInput({ id, ...props }) {
  return (
    <input
      id={id}
      {...props}
      className={[
        'w-full rounded-2xl border border-white/10 bg-slate-900/70',
        'backdrop-blur px-3 py-2 ring-1 ring-white/10',
        'placeholder-slate-500 text-slate-100',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500/50'
      ].join(' ')}
    />
  );
}

function SelectMusculo({ id, value, onChange, options = [] }) {
  const base = [
    'Pecho',
    'Espalda',
    'Hombros',
    'Bíceps',
    'Tríceps',
    'Cuadríceps',
    'Isquios',
    'Glúteos',
    'Pantorrillas',
    'Core',
    'Full Body'
  ];
  const list = useMemo(
    () => Array.from(new Set([...base, ...options])),
    [options]
  );
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
    >
      <option value="">Seleccioná un grupo</option>
      {list.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900">
          {opt}
        </option>
      ))}
    </select>
  );
}

function YouTubePreview({ url }) {
  if (!url) return null;
  // soporta youtu.be y youtube.com/watch?v=
  const ytMatch = url.match(/(?:youtu\.be\/(.+)|v=([^&]+))/i);
  const videoId = ytMatch ? ytMatch[1] || ytMatch[2] : null;
  if (!videoId) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-white/10">
      <iframe
        title="Video preview"
        src={`https://www.youtube.com/embed/${videoId}`}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

export default function EjercicioModal({ onClose, onSave, editData }) {
  const [form, setForm] = useState({
    nombre: editData?.nombre || '',
    musculo: editData?.musculo || '',
    aliases:
      (editData?.aliases || '')
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [],
    tags:
      (editData?.tags || '')
        ?.split(',')
        .map((s) => s.trim())
        .filter(Boolean) || [],
    video_url: editData?.video_url || ''
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const closeOnBackdrop = (e) => {
    if (e.target === overlayRef.current) onClose?.();
  };

  const canSubmit = useMemo(
    () => form.nombre.trim().length >= 3,
    [form.nombre]
  );

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!canSubmit || saving) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        // Enviamos como string csv para compatibilidad con tu API actual
        aliases: form.aliases.join(', '),
        tags: form.tags.join(', ')
      };
      const method = editData ? 'PUT' : 'POST';
      const url = editData ? `${API_URL}/${editData.id}` : API_URL;
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      onSave?.();
      onClose?.();
    } catch (err) {
      setError('No se pudo guardar. Reintentá en unos segundos.');
      console.error('Error guardando ejercicio', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        onMouseDown={closeOnBackdrop}
        className="fixed inset-0 z-[120] grid place-items-center bg-[radial-gradient(ellipse_at_center,rgba(17,24,39,0.85),rgba(2,6,23,0.92))] backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-3xl mx-4"
          initial={{ y: 24, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 24, scale: 0.98, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 22 }}
        >
          <div className="rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            {/* Header */}
            <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 grid place-items-center rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
                  <IconDumbbell className="h-4 w-4 text-indigo-300" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100 tracking-tight">
                    {editData ? 'Editar ejercicio' : 'Nuevo ejercicio'}
                  </h2>
                  <p className="text-[12px] text-slate-400">
                    Completá los campos. Podés agregar alias y etiquetas.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
                aria-label="Cerrar"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5">
              {error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 text-sm">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nombre */}
                <Field id="nombre" label="Nombre del ejercicio" icon={IconType}>
                  <TextInput
                    id="nombre"
                    placeholder="p. ej., Sentadilla trasera"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    required
                  />
                </Field>

                {/* Músculo */}
                <Field id="musculo" label="Grupo muscular" icon={IconDumbbell}>
                  <SelectMusculo
                    id="musculo"
                    value={form.musculo}
                    onChange={(v) => setForm({ ...form, musculo: v })}
                  />
                </Field>

                {/* Aliases */}
                <ChipsInput
                  id="aliases"
                  label="Aliases (nombres alternativos)"
                  placeholder="press Enter para agregar"
                  value={form.aliases}
                  onChange={(v) => setForm({ ...form, aliases: v })}
                  suggestions={[
                    'Back squat',
                    'Sentadilla baja',
                    'High bar',
                    'Low bar'
                  ]}
                />

                {/* Tags */}
                <ChipsInput
                  id="tags"
                  label="Tags"
                  placeholder="fuerza, hipertrofia, básico..."
                  value={form.tags}
                  onChange={(v) => setForm({ ...form, tags: v })}
                  suggestions={[
                    'básico',
                    'multiarticular',
                    'barra',
                    'principiantes',
                    'avanzado'
                  ]}
                />

                {/* Video URL */}
                <Field
                  id="video_url"
                  label="Video (YouTube o Vimeo)"
                  icon={IconVideo}
                  help="Pega la URL del video para mostrar una previsualización."
                >
                  <TextInput
                    id="video_url"
                    type="url"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={form.video_url}
                    onChange={(e) =>
                      setForm({ ...form, video_url: e.target.value })
                    }
                  />
                  <YouTubePreview url={form.video_url} />
                </Field>
              </div>

              {/* Footer */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-500">
                  Tip: usá{' '}
                  <kbd className="rounded border border-white/10 px-1">Tab</kbd>{' '}
                  o
                  <kbd className="rounded border border-white/10 px-1 ml-1">
                    Enter
                  </kbd>{' '}
                  para crear chips.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={!canSubmit || saving}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white enabled:hover:bg-indigo-500 disabled:opacity-60"
                  >
                    <IconSave className="h-4 w-4" />
                    {saving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
