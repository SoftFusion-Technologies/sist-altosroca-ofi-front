import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import {
  FiX,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiLoader,
  FiTrendingUp
} from 'react-icons/fi';

export default function LogPesoModal({
  open,
  onClose,
  ejercicio,
  serie,
  ultimoLog,
  onSave,
  logs = []
}) {
  const [peso, setPeso] = useState('');
  const [obs, setObs] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [editLogId, setEditLogId] = useState(null);
  const inputRef = useRef(null);

  // Benjamin Orellana - 11/04/2026 - Adaptación visual responsive del modal de log de peso al branding Altos Roca
  useEffect(() => {
    if (!open) return;

    if (editLogId) {
      const log = logs.find((l) => l.id === editLogId);
      setPeso(log ? String(log.peso ?? '') : '');
      setObs(log ? (log.observaciones ?? '') : '');
    } else {
      setPeso('');
      setObs('');
    }

    setMensaje('');

    const t = setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => clearTimeout(t);
  }, [open, editLogId, logs]);

  const handleGuardar = async () => {
    if (loading) return;

    const n = Number(peso);
    if (!peso || isNaN(n) || n <= 0 || n > 999.99) {
      setMensaje('Ingresá un peso válido entre 0.01 y 999.99 kg');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      let res;

      if (editLogId) {
        res = await fetch(
          `http://localhost:8080/routine_exercise_logs/${editLogId}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              peso: parseFloat(peso),
              observaciones: obs
            })
          }
        );
      } else {
        res = await fetch('http://localhost:8080/routine_exercise_logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serie_id: serie?.id,
            student_id: ejercicio?.student_id,
            fecha: new Date().toISOString().slice(0, 10),
            peso: parseFloat(peso),
            observaciones: obs
          })
        });
      }

      if (res.ok) {
        setMensaje(
          editLogId
            ? 'Registro actualizado correctamente'
            : 'Registro guardado correctamente'
        );

        setTimeout(() => {
          onSave && onSave();

          if (editLogId) {
            setEditLogId(null);
            setPeso('');
            setObs('');
          } else {
            onClose();
          }
        }, 900);
      } else {
        setMensaje('Hubo un error al guardar. Intenta nuevamente.');
      }
    } catch (err) {
      setMensaje('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const eliminarLog = async (logId) => {
    if (!window.confirm('¿Eliminar este registro?')) return;

    setLoading(true);
    setMensaje('');

    try {
      const res = await fetch(
        `http://localhost:8080/routine_exercise_logs/${logId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setMensaje('Registro eliminado correctamente');

        setTimeout(() => {
          onSave && onSave();
          setEditLogId(null);
          setPeso('');
          setObs('');
          setMensaje('');
        }, 700);
      } else {
        setMensaje('No se pudo eliminar');
      }
    } catch (e) {
      setMensaje('Error al eliminar');
    } finally {
      setLoading(false);
    }
  };

  const editarLog = (log) => setEditLogId(log.id);

  const cancelarEdicion = () => {
    setEditLogId(null);
    setPeso('');
    setObs('');
    setMensaje('');
  };

  const handleClose = () => {
    if (loading) return;
    setEditLogId(null);
    setMensaje('');
    onClose();
  };

  const enEdicion = Boolean(editLogId);

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          as="div"
          open={open}
          onClose={handleClose}
          className="fixed inset-0 z-50"
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />

          <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.985 }}
              transition={{ duration: 0.24 }}
              className="relative flex max-h-[94vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[30px] border border-white/10 bg-[#0a0a0b]/95 shadow-[0_30px_90px_-25px_rgba(0,0,0,0.85)] sm:rounded-[32px]"
            >
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.14)_0%,rgba(255,255,255,0.02)_42%,rgba(0,0,0,0.45)_100%)]" />
              <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />
              <div className="absolute -left-10 top-[-25px] h-28 w-28 rounded-full bg-[#ef3347]/10 blur-3xl sm:h-40 sm:w-40" />
              <div className="absolute -right-8 bottom-[-20px] h-28 w-28 rounded-full bg-[#ef3347]/10 blur-3xl sm:h-36 sm:w-36" />

              <div className="relative flex min-h-0 flex-1 flex-col">
                <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#ff98a5]">
                          Altos Roca
                        </span>

                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-white/60">
                          {enEdicion ? 'Edición' : 'Carga de peso'}
                        </span>
                      </div>

                      <Dialog.Title className="mt-4 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                        {ejercicio?.nombre || 'Ejercicio'}
                        {serie?.numero_serie
                          ? ` · Serie ${serie.numero_serie}`
                          : ''}
                      </Dialog.Title>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        Registrá el peso utilizado en la serie y mantené el
                        seguimiento de progresión dentro del sistema.
                      </p>
                    </div>

                    <button
                      onClick={handleClose}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50 sm:h-11 sm:w-11"
                      disabled={loading}
                      aria-label="Cerrar"
                      type="button"
                    >
                      <FiX className="text-lg" />
                    </button>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <FiTrendingUp className="text-[#ff98a5]" />
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                            Último registro
                          </p>
                        </div>

                        {ultimoLog ? (
                          <div className="space-y-1">
                            <p className="text-2xl font-black text-white">
                              {ultimoLog.peso} kg
                            </p>
                            <p className="text-sm text-white/55">
                              Fecha: {ultimoLog.fecha || '—'}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-white/50">
                            Sin registros previos para esta serie.
                          </p>
                        )}
                      </div>

                      {logs?.length > 0 && (
                        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                            Historial reciente
                          </p>

                          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                            {logs.slice(0, 5).map((l) => (
                              <div
                                key={l.id}
                                className={`rounded-2xl border p-3 transition ${
                                  editLogId === l.id
                                    ? 'border-[#ef3347]/40 bg-[#ef3347]/10'
                                    : 'border-white/10 bg-black/20'
                                }`}
                              >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white">
                                      {l.fecha}
                                    </p>
                                    <p className="mt-1 text-lg font-black text-[#ff98a5]">
                                      {l.peso} kg
                                    </p>
                                    {l.observaciones ? (
                                      <p className="mt-1 line-clamp-2 text-xs text-white/50">
                                        {l.observaciones}
                                      </p>
                                    ) : null}
                                  </div>

                                  <div className="flex items-center gap-2 sm:justify-end">
                                    <button
                                      onClick={() => editarLog(l)}
                                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-white/75 transition hover:border-[#ef3347]/30 hover:bg-[#ef3347]/10 hover:text-[#ff98a5]"
                                      title="Editar"
                                      disabled={loading}
                                      type="button"
                                    >
                                      <FiEdit2 />
                                    </button>

                                    <button
                                      onClick={() => eliminarLog(l.id)}
                                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 transition hover:bg-red-500/20 hover:text-red-200"
                                      title="Eliminar"
                                      disabled={loading}
                                      type="button"
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                            Peso en kg
                          </label>
                          <input
                            type="number"
                            inputMode="decimal"
                            min={0}
                            max={999.99}
                            step={0.01}
                            ref={inputRef}
                            disabled={loading}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-white/25 focus:border-[#ef3347]/40 focus:ring-4 focus:ring-[#ef3347]/10 sm:text-lg"
                            placeholder="Ej. 80.00"
                            value={peso}
                            onChange={(e) => setPeso(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === 'Enter' && handleGuardar()
                            }
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                            Observaciones
                          </label>
                          <textarea
                            className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#ef3347]/40 focus:ring-4 focus:ring-[#ef3347]/10"
                            placeholder="Notas, sensaciones, técnica, pausa o cualquier detalle relevante"
                            rows={4}
                            value={obs}
                            disabled={loading}
                            onChange={(e) => setObs(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <button
                          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white transition ${
                            loading
                              ? 'bg-white/15'
                              : 'bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] hover:scale-[1.01] shadow-[0_16px_35px_-18px_rgba(239,68,68,0.85)]'
                          }`}
                          onClick={handleGuardar}
                          disabled={
                            loading || !serie?.id || !ejercicio?.student_id
                          }
                          title={
                            !serie?.id
                              ? 'Falta serie_id'
                              : !ejercicio?.student_id
                                ? 'Falta student_id'
                                : ''
                          }
                          type="button"
                        >
                          {loading ? (
                            <>
                              <FiLoader className="animate-spin" />
                              {enEdicion ? 'Actualizando...' : 'Guardando...'}
                            </>
                          ) : (
                            <>
                              <FiSave />
                              {enEdicion
                                ? 'Actualizar registro'
                                : 'Guardar registro'}
                            </>
                          )}
                        </button>

                        {enEdicion && (
                          <button
                            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-bold text-white/80 transition hover:bg-white/[0.09]"
                            onClick={cancelarEdicion}
                            disabled={loading}
                            type="button"
                          >
                            Cancelar edición
                          </button>
                        )}
                      </div>

                      {(!serie?.id || !ejercicio?.student_id) && (
                        <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                          No se puede guardar hasta contar con una serie válida
                          y un alumno activo.
                        </div>
                      )}

                      {mensaje && (
                        <div
                          className={`mt-4 rounded-2xl px-4 py-3 text-center text-sm font-semibold ${
                            mensaje.toLowerCase().includes('correctamente')
                              ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                              : 'border border-red-500/20 bg-red-500/10 text-red-300'
                          }`}
                        >
                          {mensaje}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
