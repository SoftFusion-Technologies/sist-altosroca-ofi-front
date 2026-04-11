import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  FiPlus,
  FiLoader,
  FiAlertCircle,
  FiBarChart2,
  FiActivity,
  FiTarget,
  FiX
} from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import RMForm from './RegistroRM';
import NavbarStaff from '../../staff/NavbarStaff';
import ParticlesBackground from '../../../components/ParticlesBackground';
import { RMCard } from './RMCard';
import ButtonBack from '../../../components/ButtonBack';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.1
 *
 * Descripción:
 * Listado de registros de RM adaptado visualmente a Altos Roca,
 * consumiendo métricas del backend sin alterar la estructura general
 * del módulo ni recargar innecesariamente el contenido visual.
 *
 * Tema: Registro de RM
 * Capa: Frontend
 */

/* Benjamin Orellana - 2026/04/11 - URL base del backend para consumir endpoints del módulo RM */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* Benjamin Orellana - 2026/04/11 - Helpers visuales para unificar la estética Altos Roca del módulo RM */
const shellClass =
  'border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.48)]';

const statCardClass =
  'rounded-[24px] sm:rounded-[26px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4 sm:p-5 shadow-[0_18px_55px_-28px_rgba(0,0,0,0.45)]';

const primaryButtonClass =
  'inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 sm:px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] shadow-[0_16px_35px_-18px_rgba(239,68,68,0.85)]';

/* Benjamin Orellana - 2026/04/11 - Normaliza números del backend para evitar métricas vacías o inconsistentes */
const toNumberOrNull = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/* Benjamin Orellana - 2026/04/11 - Formatea kilos para los KPIs del módulo RM */
const formatKg = (value) => {
  const n = toNumberOrNull(value);
  if (n === null) return '—';
  return `${n.toLocaleString('es-AR', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })} kg`;
};

/* Benjamin Orellana - 2026/04/11 - Devuelve la fecha más útil para ordenar registros del módulo RM */
const getRegistroDate = (registro) =>
  registro?.fecha || registro?.created_at || registro?.updated_at || null;

/* Benjamin Orellana - 2026/04/11 - Obtiene el mejor valor disponible de un registro RM para fallback visual */
const getRegistroRMValue = (registro) => {
  const candidatos = [
    registro?.rm_estimada,
    registro?.rm,
    registro?.valor_rm,
    registro?.kg,
    registro?.peso,
    registro?.peso_levantado
  ]
    .map(toNumberOrNull)
    .filter((item) => item !== null && item > 0);

  return candidatos.length ? Math.max(...candidatos) : null;
};

/* Benjamin Orellana - 2026/04/11 - Componente padre del módulo RM con carga de listado y dashboard */
export default function RMList({ studentId }) {
  const [rms, setRms] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  /* Benjamin Orellana - 2026/04/11 - Carga el listado de registros y el dashboard resumido del alumno */
  const fetchRMs = async () => {
    if (!studentId) {
      setError('No se recibió el ID del alumno');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [listadoResult, dashboardResult] = await Promise.allSettled([
        axios.get(`${BASE_URL}/student-rm`, {
          params: {
            student_id: studentId,
            limit: 300
          }
        }),
        axios.get(`${BASE_URL}/student-rm/dashboard`, {
          params: {
            student_id: studentId
          }
        })
      ]);

      if (listadoResult.status !== 'fulfilled') {
        throw listadoResult.reason;
      }

      const listadoData = listadoResult.value?.data;
      const registros = Array.isArray(listadoData)
        ? listadoData
        : Array.isArray(listadoData?.registros)
          ? listadoData.registros
          : [];

      setRms(registros);

      if (dashboardResult.status === 'fulfilled') {
        setDashboard(dashboardResult.value?.data || null);
      } else {
        setDashboard(null);
      }

      setError(null);
    } catch (err) {
      setError('Error al cargar los registros de RM');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRMs();
  }, [studentId]);

  const closeModal = (reload = false) => {
    setIsOpen(false);
    if (reload) fetchRMs();
  };

  /* Benjamin Orellana - 2026/04/11 - Indexa métricas del dashboard por ejercicio para reutilizarlas en la grilla */
  const dashboardByEjercicio = useMemo(() => {
    const source = Array.isArray(dashboard?.ejercicios)
      ? dashboard.ejercicios
      : [];

    return source.reduce((acc, item) => {
      const key = item?.ejercicio;
      if (key) acc[key] = item;
      return acc;
    }, {});
  }, [dashboard]);

  /* Benjamin Orellana - 2026/04/11 - Agrupa registros por ejercicio y prioriza los ejercicios con mejor resumen */
  const groupedRMs = useMemo(() => {
    const grouped = Object.entries(
      rms.reduce((acc, rm) => {
        const key = rm.ejercicio;
        if (!key) return acc;
        if (!acc[key]) acc[key] = [];
        acc[key].push(rm);
        return acc;
      }, {})
    );

    return grouped.sort((a, b) => {
      const aDashboard = dashboardByEjercicio[a[0]];
      const bDashboard = dashboardByEjercicio[b[0]];

      const aBest = toNumberOrNull(aDashboard?.resumen?.mejor_rm) ?? 0;
      const bBest = toNumberOrNull(bDashboard?.resumen?.mejor_rm) ?? 0;

      if (bBest !== aBest) return bBest - aBest;

      return b[1].length - a[1].length;
    });
  }, [rms, dashboardByEjercicio]);

  /* Benjamin Orellana - 2026/04/11 - Calcula el último registro visible para la tarjeta de actividad reciente */
  const ultimoRegistro = useMemo(() => {
    if (!rms.length) return null;

    const ordenados = [...rms].sort((a, b) => {
      const fa = new Date(getRegistroDate(a) || 0).getTime();
      const fb = new Date(getRegistroDate(b) || 0).getTime();
      return fb - fa;
    });

    return ordenados[0] || null;
  }, [rms]);

  /* Benjamin Orellana - 2026/04/11 - KPIs superiores con prioridad al dashboard y fallback al listado */
  const totalRegistros =
    dashboard?.resumen_general?.total_registros ?? rms.length;

  const totalEjercicios =
    dashboard?.resumen_general?.total_ejercicios ?? groupedRMs.length;

  const totalPRs = dashboard?.resumen_general?.total_prs ?? 0;

  const mejorMarcaTexto = useMemo(() => {
    const mejorGlobal = toNumberOrNull(
      dashboard?.resumen_general?.mejor_rm_general
    );

    if (mejorGlobal !== null) return formatKg(mejorGlobal);

    if (!rms.length) return '—';

    const candidatos = rms
      .map(getRegistroRMValue)
      .filter((n) => Number.isFinite(n) && n > 0);

    if (!candidatos.length) return '—';

    return formatKg(Math.max(...candidatos));
  }, [dashboard, rms]);

  const ultimoRegistroFechaTexto = useMemo(() => {
    const rawDate = getRegistroDate(ultimoRegistro);
    if (!rawDate) return 'Sin fecha';

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return 'Sin fecha';

    return date.toLocaleDateString('es-AR');
  }, [ultimoRegistro]);

  return (
    <>
      <NavbarStaff />

      <div className="min-h-screen bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)] pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-24%] top-[-10%] h-[220px] w-[220px] sm:left-[-12%] sm:h-[280px] sm:w-[280px] md:left-[-8%] md:h-[320px] md:w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-12%] right-[-22%] h-[220px] w-[220px] sm:right-[-12%] sm:h-[240px] sm:w-[240px] md:right-[-8%] md:h-[280px] md:w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <ButtonBack />

        <section className="relative z-10 mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8 md:py-10">
          <div
            className={`relative overflow-hidden rounded-[26px] sm:rounded-[32px] ${shellClass}`}
          >
            <div className="absolute inset-0 pointer-events-none" />

            <div className="relative border-b border-white/10 px-4 py-5 sm:px-5 sm:py-6 md:px-8">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#ff98a5]">
                      Fuerza máxima
                    </span>

                    <span className="text-lg sm:text-[22px] uppercase leading-none text-[#ff5a6f]">
                      Altos Roca
                    </span>
                  </div>

                  <h1 className="titulo mt-4 text-2xl sm:text-3xl md:text-4xl xl:text-5xl font-black uppercase tracking-tight text-white">
                    Registro de RM
                  </h1>

                  <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60 md:text-base">
                    Seguimiento de fuerza del alumno.
                  </p>
                </div>

                <div className="w-full sm:w-auto flex justify-stretch sm:justify-end">
                  <button
                    onClick={() => setIsOpen(true)}
                    className={primaryButtonClass}
                  >
                    <FiPlus className="text-lg" />
                    Nuevo RM
                  </button>
                </div>
              </div>
            </div>

            <div className="relative px-4 py-5 sm:px-5 sm:py-6 md:px-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className={statCardClass}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/45">
                      Registros
                    </p>
                    <FiBarChart2 className="shrink-0 text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-white">
                    {totalRegistros}
                  </p>
                </div>

                <div className={statCardClass}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/45">
                      Ejercicios
                    </p>
                    <FiActivity className="shrink-0 text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-white">
                    {totalEjercicios}
                  </p>
                </div>

                <div className={statCardClass}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/45">
                      PRs
                    </p>
                    <FiTarget className="shrink-0 text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-2xl sm:text-3xl font-black text-white">
                    {totalPRs}
                  </p>
                </div>

                <div className={statCardClass}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-white/45">
                      Mejor RM
                    </p>
                    <FiBarChart2 className="shrink-0 text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm sm:text-[15px] font-semibold text-white">
                    {mejorMarcaTexto}
                  </p>
                  <p className="mt-1 text-xs text-white/55">
                    {ultimoRegistro?.ejercicio || '—'}
                    {ultimoRegistro?.ejercicio ? ' · ' : ''}
                    {ultimoRegistroFechaTexto}
                  </p>
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                {loading ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] sm:rounded-[28px] border border-white/10 bg-white/[0.04] py-16 sm:py-20 text-[#ff98a5]">
                    <FiLoader className="mb-4 animate-spin text-3xl" />
                    <p className="text-base sm:text-lg font-medium text-white/80">
                      Cargando registros...
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center rounded-[24px] sm:rounded-[28px] border border-red-500/20 bg-red-500/10 py-16 sm:py-20 text-center">
                    <FiAlertCircle className="mb-4 text-4xl text-red-300" />
                    <p className="px-4 text-base sm:text-lg font-semibold text-white">
                      {error}
                    </p>
                  </div>
                ) : rms.length === 0 ? (
                  <div className="rounded-[24px] sm:rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] py-16 sm:py-20 text-center">
                    <div className="mx-auto grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff98a5]">
                      <FiBarChart2 size={24} />
                    </div>
                    <p className="mt-5 text-base sm:text-lg font-semibold text-white">
                      No hay registros de RM
                    </p>
                    <p className="mt-2 px-4 text-sm text-white/55">
                      Creá el primero.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-10 sm:space-y-12 md:space-y-14">
                    {groupedRMs.map(([ejercicio, registros]) => (
                      <RMCard
                        key={ejercicio}
                        ejercicio={ejercicio}
                        registros={registros}
                        studentId={studentId}
                        resumen={
                          dashboardByEjercicio[ejercicio]?.resumen || null
                        }
                        mejorRegistro={
                          dashboardByEjercicio[ejercicio]?.mejor_registro ||
                          null
                        }
                        ultimoRegistro={
                          dashboardByEjercicio[ejercicio]?.ultimo_registro ||
                          null
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <Dialog
                open={isOpen}
                onClose={() => closeModal(false)}
                className="relative z-50"
              >
                <div
                  className="fixed inset-0 bg-black/80 backdrop-blur-md"
                  aria-hidden="true"
                />

                <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4">
                  <Dialog.Panel
                    as={motion.div}
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.98 }}
                    className="relative flex max-h-[92vh] sm:max-h-[88vh] w-full sm:max-w-2xl flex-col overflow-hidden rounded-t-[28px] sm:rounded-[32px] border border-white/10 bg-[#0a0a0b]/95 shadow-[0_30px_90px_-28px_rgba(0,0,0,0.85)]"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)]" />
                    <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

                    <div className="relative flex min-h-0 flex-col">
                      <div className="shrink-0 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                              <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-3 sm:px-4 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#ff98a5]">
                                Nuevo registro
                              </span>

                              <span className="text-lg sm:text-[22px] uppercase leading-none text-[#ff5a6f]">
                                Altos Roca
                              </span>
                            </div>

                            <Dialog.Title className="mt-4 text-xl sm:text-2xl font-black uppercase text-white">
                              Agregar nuevo RM
                            </Dialog.Title>

                            <p className="mt-2 pr-6 text-sm text-white/60">
                              Nueva marca del alumno.
                            </p>
                          </div>

                          <button
                            onClick={() => closeModal(false)}
                            className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                            aria-label="Cerrar modal"
                            type="button"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      </div>

                      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:p-6">
                        <RMForm studentId={studentId} onClose={closeModal} />
                      </div>
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>
            )}
          </AnimatePresence>
        </section>
      </div>
    </>
  );
}
