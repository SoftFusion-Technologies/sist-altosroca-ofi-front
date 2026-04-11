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
  FiTrendingDown,
  FiTarget,
  FiCalendar,
  FiBarChart2
} from 'react-icons/fi';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.1
 *
 * Descripción:
 * Modal de historial de RM ajustado al nuevo flujo del módulo,
 * con métricas rápidas más precisas y gráfico alineado al backend.
 *
 * Tema: Historial de RM
 * Capa: Frontend
 */

/* Benjamin Orellana - 2026/04/11 - Helpers de estilo y cálculo para integrar el historial de RM a la identidad visual Altos Roca */
const shellClass =
  'rounded-t-[28px] sm:rounded-[30px] border border-white/10 bg-[#0a0a0b]/95 backdrop-blur-xl shadow-[0_30px_90px_-28px_rgba(0,0,0,0.85)]';

const statCardClass =
  'rounded-[20px] sm:rounded-[22px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4';

const toNumberOrNull = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const formatFechaAr = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-AR');
};

const formatKg = (value) => {
  const n = toNumberOrNull(value);
  if (n === null) return '—';

  return `${n.toLocaleString('es-AR', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })} kg`;
};

const calcularRmEstimado = (registro) => {
  const rmDirecto = toNumberOrNull(registro?.rm_estimada);
  if (rmDirecto !== null) return rmDirecto;

  const peso = toNumberOrNull(registro?.peso_levantado);
  const reps = parseInt(registro?.repeticiones || 0, 10);

  if (peso === null || !Number.isFinite(reps) || peso <= 0 || reps <= 0) {
    return 0;
  }

  return Math.round((peso * (1 + reps / 30) + Number.EPSILON) * 100) / 100;
};

const getRegistroDate = (registro) =>
  registro?.fecha || registro?.created_at || registro?.updated_at || null;

const calcularTendencia = (datos) => {
  if (!Array.isArray(datos) || datos.length < 2) return '—';

  const primero = toNumberOrNull(datos[0]?.rm);
  const ultimo = toNumberOrNull(datos[datos.length - 1]?.rm);

  if (primero === null || ultimo === null) return '—';

  const delta = ultimo - primero;

  if (delta > 0) return 'En alza';
  if (delta < 0) return 'En baja';
  return 'Estable';
};

const getTendenciaIcon = (tendencia) => {
  if (tendencia === 'En alza') {
    return <FiTrendingUp className="shrink-0 text-emerald-300" />;
  }

  if (tendencia === 'En baja') {
    return <FiTrendingDown className="shrink-0 text-red-300" />;
  }

  return <FiBarChart2 className="shrink-0 text-[#ff98a5]" />;
};

/* Benjamin Orellana - 2026/04/11 - Ajustes del modal de historial RM para métricas y gráfico del nuevo módulo */
export default function HistorialRMModal({
  isOpen,
  onClose,
  historial,
  ejercicio
}) {
  const datosPreparados = useMemo(() => {
    const lista = Array.isArray(historial) ? [...historial] : [];

    const ordenados = lista.sort((a, b) => {
      const fa = new Date(getRegistroDate(a) || 0).getTime();
      const fb = new Date(getRegistroDate(b) || 0).getTime();
      return fa - fb;
    });

    const valoresRm = ordenados
      .map((r) => calcularRmEstimado(r))
      .filter((n) => Number.isFinite(n) && n > 0);

    const maxRM = valoresRm.length ? Math.max(...valoresRm) : null;

    const datos = ordenados.map((r, index) => {
      const rmEstimado = calcularRmEstimado(r);

      return {
        id: r.id || index,
        fecha: formatFechaAr(getRegistroDate(r)),
        fechaRaw: getRegistroDate(r),
        rm: rmEstimado,
        esPR: maxRM !== null && rmEstimado === maxRM && rmEstimado > 0,
        peso: toNumberOrNull(r.peso_levantado),
        repeticiones: r.repeticiones,
        comentario: r.comentario || '',
        confiabilidad: r.confiabilidad_rm || null
      };
    });

    const primero = datos.length ? datos[0] : null;
    const ultimo = datos.length ? datos[datos.length - 1] : null;

    const delta =
      primero &&
      ultimo &&
      Number.isFinite(primero.rm) &&
      Number.isFinite(ultimo.rm)
        ? Math.round((ultimo.rm - primero.rm + Number.EPSILON) * 100) / 100
        : null;

    return {
      datos,
      maxRM,
      ultimo,
      primero,
      delta,
      tendencia: calcularTendencia(datos)
    };
  }, [historial]);

  const { datos, maxRM, ultimo, delta, tendencia } = datosPreparados;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        <div className="fixed inset-0 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <Dialog.Panel
            as={motion.div}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className={`relative z-50 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden ${shellClass}`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />
            <div className="absolute -left-14 top-[-40px] h-32 w-32 rounded-full bg-[#ef3347]/10 blur-3xl sm:h-40 sm:w-40" />
            <div className="absolute -right-10 bottom-[-30px] h-32 w-32 rounded-full bg-[#ef3347]/10 blur-3xl sm:h-40 sm:w-40" />

            <div className="relative flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-3 py-1 text-[10px] uppercase tracking-[0.20em] text-[#ff98a5] sm:px-4 sm:text-[11px] sm:tracking-[0.24em]">
                        Historial de fuerza
                      </span>

                      <span className="text-lg uppercase leading-none text-[#ff5a6f] sm:text-[22px]">
                        Altos Roca
                      </span>
                    </div>

                    <Dialog.Title className="mt-4 text-xl font-black uppercase tracking-tight text-white sm:text-2xl md:text-3xl">
                      Historial de RM
                    </Dialog.Title>

                    <p className="mt-2 max-w-3xl pr-2 text-sm leading-6 text-white/60">
                      <span className="font-semibold text-white">
                        {ejercicio || '—'}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={onClose}
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white sm:h-11 sm:w-11"
                    aria-label="Cerrar modal"
                    type="button"
                  >
                    <FiX className="text-lg" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                {datos.length > 0 ? (
                  <>
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div className={statCardClass}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px] sm:tracking-[0.16em]">
                            Registros
                          </p>
                          <FiBarChart2 className="shrink-0 text-[#ff98a5]" />
                        </div>
                        <p className="mt-3 text-2xl font-black text-white sm:text-3xl">
                          {datos.length}
                        </p>
                      </div>

                      <div className={statCardClass}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px] sm:tracking-[0.16em]">
                            Mejor RM
                          </p>
                          <FiTarget className="shrink-0 text-[#ff98a5]" />
                        </div>
                        <p className="mt-3 break-words text-2xl font-black text-white sm:text-3xl">
                          {formatKg(maxRM)}
                        </p>
                      </div>

                      <div className={statCardClass}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px] sm:tracking-[0.16em]">
                            Último RM
                          </p>
                          <FiCalendar className="shrink-0 text-[#ff98a5]" />
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">
                          {formatKg(ultimo?.rm)}
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          {ultimo?.fecha || '—'}
                        </p>
                      </div>

                      <div className={statCardClass}>
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 sm:text-[11px] sm:tracking-[0.16em]">
                            Tendencia
                          </p>
                          {getTendenciaIcon(tendencia)}
                        </div>
                        <p className="mt-3 text-sm font-semibold text-white">
                          {tendencia}
                        </p>
                        <p className="mt-1 text-xs text-white/55">
                          {delta === null
                            ? '—'
                            : `${delta > 0 ? '+' : ''}${delta.toLocaleString(
                                'es-AR',
                                {
                                  minimumFractionDigits:
                                    delta % 1 === 0 ? 0 : 2,
                                  maximumFractionDigits: 2
                                }
                              )} kg`}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 sm:rounded-[26px] md:p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <FiTrendingUp className="text-[#ff98a5]" />
                        <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-white/80 sm:text-sm sm:tracking-[0.16em]">
                          Evolución
                        </h3>
                      </div>

                      <div className="h-[250px] w-full sm:h-[320px] lg:h-[360px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={datos}
                            margin={{
                              top: 10,
                              right: 10,
                              left: -15,
                              bottom: 0
                            }}
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
                                fontSize: 11
                              }}
                              minTickGap={18}
                              tickMargin={8}
                            />

                            <YAxis
                              stroke="rgba(255,255,255,0.55)"
                              tick={{
                                fill: 'rgba(255,255,255,0.65)',
                                fontSize: 11
                              }}
                              width={42}
                              domain={['dataMin - 5', 'dataMax + 5']}
                            />

                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#0f0f10',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '16px',
                                color: '#f3f4f6'
                              }}
                              formatter={(value, _name, props) => [
                                `${value} kg`,
                                props?.payload?.repeticiones
                                  ? `RM estimado · ${props.payload.repeticiones} reps`
                                  : 'RM estimado'
                              ]}
                              labelStyle={{ color: '#f3f4f6' }}
                            />

                            <Legend
                              verticalAlign="top"
                              height={28}
                              wrapperStyle={{
                                color: '#f3f4f6',
                                fontSize: '12px'
                              }}
                            />

                            <Line
                              type="monotone"
                              dataKey="rm"
                              name="RM Estimado"
                              stroke="#ef3347"
                              strokeWidth={3}
                              dot={{
                                r: 4,
                                stroke: '#ef3347',
                                strokeWidth: 2,
                                fill: '#0a0a0b'
                              }}
                              activeDot={{ r: 7, fill: '#ef3347' }}
                            />

                            {datos.map(
                              (entry, index) =>
                                entry.esPR && (
                                  <ReferenceDot
                                    key={`dot-${index}`}
                                    x={entry.fecha}
                                    y={entry.rm}
                                    r={7}
                                    fill="#ef3347"
                                    stroke="#ffffff"
                                    strokeWidth={2}
                                    label={{
                                      position: 'top',
                                      value: 'PR',
                                      fontSize: 10,
                                      fill: '#ffffff',
                                      fontWeight: 700
                                    }}
                                  />
                                )
                            )}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="mt-6 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 sm:rounded-[26px] md:p-5">
                      <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-white/80 sm:text-sm sm:tracking-[0.16em]">
                        Últimos registros
                      </h4>

                      <div className="max-h-[260px] space-y-3 overflow-y-auto pr-1">
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
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-white">
                                    {item.fecha}
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-white/55">
                                    Peso: {formatKg(item.peso)} · Reps:{' '}
                                    {item.repeticiones || '—'}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                  {item.esPR && (
                                    <span className="rounded-full border border-emerald-300/20 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                                      PR
                                    </span>
                                  )}

                                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                                    {formatKg(item.rm)}
                                  </span>
                                </div>
                              </div>

                              {item.comentario && (
                                <p className="mt-3 border-t border-white/10 pt-3 text-xs italic leading-5 text-white/70">
                                  "{item.comentario}"
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] py-14 text-center sm:rounded-[26px] sm:py-16">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff98a5] sm:h-16 sm:w-16">
                      <FiBarChart2 size={24} />
                    </div>
                    <p className="mt-5 text-base font-semibold text-white sm:text-lg">
                      No hay historial
                    </p>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={onClose}
                    className="inline-flex w-full items-center justify-center rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] sm:w-auto"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </AnimatePresence>
  );
}
