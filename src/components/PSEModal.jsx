import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTachometerAlt } from 'react-icons/fa';

const escalaRanges = {
  RPE_10: { min: 0, max: 10, label: '0–10' },
  CR10: { min: 0, max: 10, label: '0–10 (CR10)' },
  BORG_6_20: { min: 6, max: 20, label: '6–20 (Borg)' }
};

/*
 * Benjamin Orellana - 09/04/2026 - Adaptación visual del modal PSE al branding Altos Roca y corrección de flujo para serie, bloque, ejercicio y sesión
 */

/**
 * props:
 * - open, onClose
 * - mode: 'serie' | 'bloque' | 'ejercicio' | 'sesion' | 'rutina'
 * - context:
 *    si mode==='serie': { student_id, rutina_id, bloque_id, ejercicio_id, serie_id, ejNombre, serieNum }
 *    si mode==='bloque': { student_id, rutina_id, bloque_id, bloqueNombre }
 *    si mode==='ejercicio': { student_id, rutina_id, bloque_id, ejercicio_id, ejNombre }
 *    si mode==='sesion' || mode==='rutina': { student_id, rutina_id, rutinaNombre }
 * - onSaved(pse) -> callback al guardar
 * - onSubmit(payload) -> función async que llama al endpoint correspondiente
 */
export default function PSEModal({
  open,
  onClose,
  mode,
  context,
  onSaved,
  onSubmit
}) {
  const [escala, setEscala] = useState('RPE_10');
  const [rpeReal, setRpeReal] = useState('');
  const [rir, setRir] = useState('');
  const [duracion, setDuracion] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open) {
      setEscala('RPE_10');
      setRpeReal('');
      setRir('');
      setDuracion('');
      setComentarios('');
      setError(null);
      setSaving(false);
    }
  }, [open]);

  const rpeRange = escalaRanges[escala];

  const modeMeta = useMemo(() => {
    if (mode === 'serie') {
      return {
        title: `Registrar PSE / RIR`,
        subtitle: `${context?.ejNombre || 'Ejercicio'} · Serie ${
          context?.serieNum || '-'
        }`,
        chip: 'Serie'
      };
    }

    if (mode === 'bloque') {
      return {
        title: 'Registrar PSE del bloque',
        subtitle: context?.bloqueNombre || 'Bloque de rutina',
        chip: 'Bloque'
      };
    }

    if (mode === 'ejercicio') {
      return {
        title: 'Registrar PSE del ejercicio',
        subtitle: context?.ejNombre || 'Ejercicio',
        chip: 'Ejercicio'
      };
    }

    return {
      title: 'Registrar sRPE de la sesión',
      subtitle: context?.rutinaNombre || 'Rutina',
      chip: 'Sesión'
    };
  }, [mode, context]);

  const isSerieMode = mode === 'serie';
  const isSesionMode = mode === 'sesion' || mode === 'rutina';

  const labelClass =
    'mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60';

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-white/30 focus:border-red-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-red-500/10';

  const textareaClass =
    'w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white outline-none transition duration-200 placeholder:text-white/30 focus:border-red-500/60 focus:bg-white/[0.06] focus:ring-4 focus:ring-red-500/10 resize-none';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const payloadBase = {
        escala,
        rpe_real: rpeReal === '' ? null : Number(rpeReal),
        comentarios: comentarios?.trim() || null
      };

      let payload;

      if (mode === 'serie') {
        payload = {
          ...payloadBase,
          student_id: Number(context.student_id),
          rutina_id:
            context.rutina_id != null ? Number(context.rutina_id) : null,
          bloque_id:
            context.bloque_id != null ? Number(context.bloque_id) : null,
          ejercicio_id: Number(context.ejercicio_id),
          serie_id: Number(context.serie_id),
          rir: rir === '' ? null : Number(rir)
        };
      } else if (mode === 'bloque') {
        payload = {
          ...payloadBase,
          nivel: 'bloque',
          student_id: Number(context.student_id),
          rutina_id: Number(context.rutina_id),
          bloque_id: Number(context.bloque_id)
        };
      } else if (mode === 'ejercicio') {
        payload = {
          ...payloadBase,
          nivel: 'ejercicio',
          student_id: Number(context.student_id),
          rutina_id: Number(context.rutina_id),
          bloque_id: Number(context.bloque_id),
          ejercicio_id: Number(context.ejercicio_id)
        };
      } else {
        payload = {
          ...payloadBase,
          student_id: Number(context.student_id),
          rutina_id: Number(context.rutina_id),
          duracion_min: duracion === '' ? null : Number(duracion)
        };
      }

      const res = await onSubmit(payload);
      onSaved?.(res?.pse);
      alert('Registro guardado correctamente');
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.mensajeError || 'No se pudo guardar el PSE';
      alert(msg);
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[95] bg-black/75 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !saving && onClose()}
          />

          <motion.div
            className="fixed inset-0 z-[96] flex items-end justify-center p-3 sm:items-center sm:p-6"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 28 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0a] shadow-[0_30px_90px_-30px_rgba(0,0,0,0.75)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.20),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(127,29,29,0.18),transparent_35%)]" />

              <div className="relative border-b border-white/10 px-5 py-5 sm:px-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-600 to-red-800 text-white shadow-[0_12px_30px_-12px_rgba(220,38,38,0.65)]">
                      <FaTachometerAlt className="text-base" />
                    </div>

                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-red-300">
                          Altos Roca
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
                          {modeMeta.chip}
                        </span>
                      </div>

                      <h3 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                        {modeMeta.title}
                      </h3>

                      <p className="mt-1 text-sm text-white/55">
                        {modeMeta.subtitle}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={saving}
                    type="button"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="relative px-5 py-5 sm:px-6"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelClass}>Escala</label>
                    <select
                      className={inputClass}
                      value={escala}
                      onChange={(e) => setEscala(e.target.value)}
                    >
                      <option className="bg-[#111]" value="RPE_10">
                        RPE 0–10
                      </option>
                      <option className="bg-[#111]" value="CR10">
                        CR10
                      </option>
                      <option className="bg-[#111]" value="BORG_6_20">
                        Borg 6–20
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>
                      RPE real ({rpeRange.label})
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      className={inputClass}
                      value={rpeReal}
                      onChange={(e) => setRpeReal(e.target.value)}
                      min={rpeRange.min}
                      max={rpeRange.max}
                      step="1"
                      required
                      placeholder="Ingresar valor"
                    />
                  </div>

                  {isSerieMode ? (
                    <div>
                      <label className={labelClass}>RIR (0–10)</label>
                      <input
                        type="number"
                        inputMode="numeric"
                        className={inputClass}
                        value={rir}
                        onChange={(e) => setRir(e.target.value)}
                        min={0}
                        max={10}
                        step="1"
                        placeholder="Opcional"
                      />
                    </div>
                  ) : isSesionMode ? (
                    <div>
                      <label className={labelClass}>
                        Duración sesión (min)
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        className={inputClass}
                        value={duracion}
                        onChange={(e) => setDuracion(e.target.value)}
                        min={0}
                        max={1440}
                        step="1"
                        required
                        placeholder="Ej. 60"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        Alcance
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white/85">
                        Registro general a nivel {modeMeta.chip.toLowerCase()}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-white/45">
                        Este nivel no requiere duración ni RIR para guardar.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label className={labelClass}>Comentarios</label>
                  <textarea
                    className={textareaClass}
                    rows={4}
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Fatiga, dolor, técnica, sensaciones generales o cualquier observación relevante"
                  />
                </div>

                {error && (
                  <div className="mt-4 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
                    {error}
                  </div>
                )}

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={onClose}
                    disabled={saving}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-5 py-3 text-sm font-bold text-white shadow-[0_18px_40px_-18px_rgba(220,38,38,0.85)] transition hover:scale-[1.01] hover:from-red-500 hover:via-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saving}
                  >
                    {saving ? 'Guardando...' : 'Guardar registro'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
