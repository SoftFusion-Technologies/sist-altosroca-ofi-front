import React, { useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  ReferenceDot
} from 'recharts';
import {
  FiX,
  FiTrendingUp,
  FiTarget,
  FiCalendar,
  FiBarChart2
} from 'react-icons/fi';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.0
 *
 * Descripción:
 * Modal de historial de RM rediseñado para Altos Roca, con
 * mejor jerarquía visual, métricas rápidas y gráfico integrado
 * a una estética premium rojo/negro.
 *
 * Tema: Historial de RM
 * Capa: Frontend
 */

/* Benjamin Orellana - 06/04/2026 - Helpers de estilo y cálculo para integrar el historial de RM a la identidad visual Altos Roca */
const shellClass =
  'rounded-[30px] border border-white/10 bg-[#0a0a0b]/95 backdrop-blur-xl shadow-[0_30px_90px_-28px_rgba(0,0,0,0.85)]';

const statCardClass =
  'rounded-[22px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4';

const formatFechaAr = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-AR');
};

const calcularRmEstimado = (registro) => {
  if (registro?.rm_estimada !== null && registro?.rm_estimada !== undefined) {
    const n = parseFloat(registro.rm_estimada);
    return Number.isFinite(n) ? n : 0;
  }

  const peso = parseFloat(registro?.peso_levantado || 0);
  const reps = parseInt(registro?.repeticiones || 0, 10);

  if (
    !Number.isFinite(peso) ||
    !Number.isFinite(reps) ||
    peso <= 0 ||
    reps <= 0
  ) {
    return 0;
  }

  return Math.round(peso * (1 + reps / 30) * 100) / 100;
};

export default function HistorialRMModal({
  isOpen,
  onClose,
  historial,
  ejercicio
}) {
  const datosPreparados = useMemo(() => {
    const lista = Array.isArray(historial) ? [...historial] : [];

    const ordenados = lista.sort((a, b) => {
      const fa = new Date(a.fecha || a.created_at || 0).getTime();
      const fb = new Date(b.fecha || b.created_at || 0).getTime();
      return fa - fb;
    });

    const maxRM = Math.max(...ordenados.map((r) => calcularRmEstimado(r)), 0);

    const datos = ordenados.map((r, index) => {
      const rmEstimado = calcularRmEstimado(r);

      return {
        id: r.id || index,
        fecha: formatFechaAr(r.fecha),
        fechaRaw: r.fecha,
        rm: rmEstimado,
        esPR: rmEstimado === maxRM && rmEstimado > 0,
        peso: r.peso_levantado,
        repeticiones: r.repeticiones,
        comentario: r.comentario || ''
      };
    });

    return {
      datos,
      maxRM: maxRM > 0 ? maxRM : null,
      ultimo: datos.length > 0 ? datos[datos.length - 1] : null
    };
  }, [historial]);

  const { datos, maxRM, ultimo } = datosPreparados;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className={`relative z-50 w-full max-w-5xl overflow-hidden ${shellClass}`}
        >
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)]" />
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />
          <div className="absolute -left-14 top-[-40px] h-40 w-40 rounded-full bg-[#ef3347]/10 blur-3xl" />
          <div className="absolute -right-10 bottom-[-30px] h-40 w-40 rounded-full bg-[#ef3347]/10 blur-3xl" />

          <div className="relative">
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]">
                      Historial de fuerza
                    </span>

                    <span className="text-[22px] uppercase leading-none text-[#ff5a6f]">
                      Altos Roca
                    </span>
                  </div>

                  <Dialog.Title className="mt-4 text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
                    Historial de RM
                  </Dialog.Title>

                  <p className="mt-2 text-sm leading-6 text-white/60">
                    Evolución histórica del ejercicio{' '}
                    <span className="font-semibold text-white">
                      {ejercicio || '—'}
                    </span>{' '}
                    con puntos destacados de mejor marca estimada.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                  aria-label="Cerrar modal"
                  type="button"
                >
                  <FiX className="text-lg" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6">
              {datos.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
                    <div className={statCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                          Registros
                        </p>
                        <FiBarChart2 className="text-[#ff98a5]" />
                      </div>
                      <p className="mt-3 text-3xl font-black text-white">
                        {datos.length}
                      </p>
                    </div>

                    <div className={statCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                          Mejor RM
                        </p>
                        <FiTarget className="text-[#ff98a5]" />
                      </div>
                      <p className="mt-3 text-3xl font-black text-white">
                        {maxRM ? `${maxRM} kg` : '—'}
                      </p>
                    </div>

                    <div className={statCardClass}>
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                          Último registro
                        </p>
                        <FiCalendar className="text-[#ff98a5]" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-white">
                        {ultimo?.fecha || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 md:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <FiTrendingUp className="text-[#ff98a5]" />
                      <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white/80">
                        Evolución del RM estimado
                      </h3>
                    </div>

                    <ResponsiveContainer width="100%" height={360}>
                      <LineChart
                        data={datos}
                        margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.08)"
                        />

                        <XAxis
                          dataKey="fecha"
                          stroke="rgba(255,255,255,0.55)"
                          tick={{
                            fill: 'rgba(255,255,255,0.65)',
                            fontSize: 12
                          }}
                        />

                        <YAxis
                          stroke="rgba(255,255,255,0.55)"
                          tick={{
                            fill: 'rgba(255,255,255,0.65)',
                            fontSize: 12
                          }}
                          domain={['dataMin - 5', 'dataMax + 5']}
                        />

                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f0f10',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            color: '#f3f4f6'
                          }}
                          formatter={(value) => [`${value} kg`, 'RM estimado']}
                          labelStyle={{ color: '#f3f4f6' }}
                        />

                        <Legend
                          verticalAlign="top"
                          height={36}
                          wrapperStyle={{ color: '#f3f4f6' }}
                        />

                        <Line
                          type="monotone"
                          dataKey="rm"
                          name="RM Estimado"
                          stroke="#ef3347"
                          strokeWidth={3}
                          dot={{
                            r: 5,
                            stroke: '#ef3347',
                            strokeWidth: 2,
                            fill: '#0a0a0b'
                          }}
                          activeDot={{ r: 8, fill: '#ef3347' }}
                        />

                        {datos.map(
                          (entry, index) =>
                            entry.esPR && (
                              <ReferenceDot
                                key={`dot-${index}`}
                                x={entry.fecha}
                                y={entry.rm}
                                r={8}
                                fill="#ef3347"
                                stroke="#ffffff"
                                strokeWidth={2}
                                label={{
                                  position: 'top',
                                  value: 'PR',
                                  fontSize: 11,
                                  fill: '#ffffff',
                                  fontWeight: 700
                                }}
                              />
                            )
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 rounded-[26px] border border-white/10 bg-white/[0.04] p-4 md:p-5">
                    <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-white/80 mb-4">
                      Últimos registros
                    </h4>

                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                      {datos
                        .slice()
                        .reverse()
                        .slice(0, 6)
                        .map((item) => (
                          <div
                            key={item.id}
                            className="rounded-2xl border border-white/10 bg-black/20 p-4"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-white">
                                  {item.fecha}
                                </p>
                                <p className="mt-1 text-xs text-white/55">
                                  Peso: {item.peso || '—'} kg · Reps:{' '}
                                  {item.repeticiones || '—'}
                                </p>
                              </div>

                              <div className="flex items-center gap-3">
                                {item.esPR && (
                                  <span className="rounded-full border border-emerald-300/20 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                                    PR
                                  </span>
                                )}

                                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                                  {item.rm} kg
                                </span>
                              </div>
                            </div>

                            {item.comentario && (
                              <p className="mt-3 text-xs italic text-white/70 border-t border-white/10 pt-3">
                                "{item.comentario}"
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[26px] border border-dashed border-white/10 bg-white/[0.03] py-16 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff98a5]">
                    <FiBarChart2 size={24} />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-white">
                    No hay historial suficiente
                  </p>
                  <p className="mt-2 text-sm text-white/55">
                    Todavía no hay datos suficientes para este ejercicio.
                  </p>
                </div>
              )}

              <div className="text-center mt-6">
                <button
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </AnimatePresence>
  );
}
