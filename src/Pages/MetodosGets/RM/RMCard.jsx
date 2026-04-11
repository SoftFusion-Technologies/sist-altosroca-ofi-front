import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { GiWeightLiftingUp, GiStrong, GiMuscleUp } from 'react-icons/gi';
import { MdOutlineFitnessCenter } from 'react-icons/md';
import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiCalendar
} from 'react-icons/fi';
import HistorialRMModal from './HistorialRMModal';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.1
 *
 * Descripción:
 * Tarjeta de agrupación de registros RM por ejercicio, adaptada al
 * nuevo backend del módulo para mostrar métricas reales sin alterar
 * la estética general del diseño.
 *
 * Tema: Card de RM por ejercicio
 * Capa: Frontend
 */

/* Benjamin Orellana - 2026/04/11 - URL base del backend para consumo del historial de RM */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* Benjamin Orellana - 2026/04/11 - Íconos por ejercicio para mantener identidad visual del módulo */
const getIcon = (ejercicio = '') => {
  const e = ejercicio.toLowerCase();

  if (e.includes('press')) {
    return <MdOutlineFitnessCenter className="text-3xl text-white" />;
  }

  if (e.includes('sentadilla')) {
    return <GiWeightLiftingUp className="text-3xl text-white" />;
  }

  if (e.includes('dominadas')) {
    return <GiMuscleUp className="text-3xl text-white" />;
  }

  return <GiStrong className="text-3xl text-white" />;
};

/* Benjamin Orellana - 2026/04/11 - Gradientes por ejercicio para sostener la paleta Altos Roca */
const getColorClass = (ejercicio = '') => {
  const e = ejercicio.toLowerCase();

  if (e.includes('sentadilla')) {
    return 'from-[#5a0912] via-[#b71c2b] to-[#ef3347]';
  }

  if (e.includes('press')) {
    return 'from-[#3b0a12] via-[#8b1324] to-[#d11f2f]';
  }

  if (e.includes('peso muerto')) {
    return 'from-[#5f1f08] via-[#a53a17] to-[#ef6b3b]';
  }

  return 'from-[#420911] via-[#7b1120] to-[#c11c2f]';
};

/* Benjamin Orellana - 2026/04/11 - Formateo seguro de números para métricas del módulo RM */
const toNumberOrNull = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/* Benjamin Orellana - 2026/04/11 - Formateo visual de kilos en cards y cabeceras */
const formatKg = (value) => {
  const n = toNumberOrNull(value);
  if (n === null) return '—';

  return `${n.toLocaleString('es-AR', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })} kg`;
};

/* Benjamin Orellana - 2026/04/11 - Fecha más útil disponible por registro para ordenar y mostrar */
const getRegistroDate = (registro) =>
  registro?.fecha || registro?.created_at || registro?.updated_at || null;

/* Benjamin Orellana - 2026/04/11 - Formateo seguro de fecha para tarjetas y resumen */
const formatFecha = (fecha) => {
  if (!fecha) return '—';

  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return '—';

  return d.toLocaleDateString('es-AR');
};

/* Benjamin Orellana - 2026/04/11 - Normaliza la tendencia enviada por backend para badges y resúmenes */
const formatTendencia = (value) => {
  if (!value) return '—';

  switch (value) {
    case 'ascendente':
      return 'En alza';
    case 'descendente':
      return 'En baja';
    case 'estable':
      return 'Estable';
    default:
      return '—';
  }
};

/* Benjamin Orellana - 2026/04/11 - Color visual por tendencia del ejercicio */
const getTendenciaClass = (value) => {
  switch (value) {
    case 'ascendente':
      return 'bg-emerald-500/20 text-emerald-100 border border-emerald-300/20';
    case 'descendente':
      return 'bg-red-500/20 text-red-100 border border-red-300/20';
    case 'estable':
      return 'bg-white/15 text-white border border-white/10';
    default:
      return 'bg-white/10 text-white/70 border border-white/10';
  }
};

/* Benjamin Orellana - 2026/04/11 - Badge corto para confiabilidad del cálculo de RM */
const formatConfiabilidad = (value) => {
  switch (value) {
    case 'alta':
      return 'Alta';
    case 'media':
      return 'Media';
    case 'baja':
      return 'Baja';
    case 'muy_baja':
      return 'Muy baja';
    default:
      return '—';
  }
};

/* Benjamin Orellana - 2026/04/11 - Determina si un registro coincide con la mejor marca del ejercicio */
const isPRRegistro = (rm, mejorRegistro, resumen) => {
  if (!rm) return false;

  if (mejorRegistro?.id && rm.id === mejorRegistro.id) return true;

  const mejorRm = toNumberOrNull(resumen?.mejor_rm);
  const actualRm = toNumberOrNull(rm?.rm_estimada);

  return mejorRm !== null && actualRm !== null && actualRm === mejorRm;
};

export const RMCard = ({
  ejercicio,
  registros,
  studentId,
  resumen = null,
  mejorRegistro = null,
  ultimoRegistro = null
}) => {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [historialActual, setHistorialActual] = useState([]);
  const [ejercicioActual, setEjercicioActual] = useState('');
  const [loadingHistorial, setLoadingHistorial] = useState(false);

  /* Benjamin Orellana - 2026/04/11 - Registros visibles priorizando el orden actual del backend */
  const visibles = useMemo(
    () => (mostrarTodos ? registros : registros.slice(0, 4)),
    [mostrarTodos, registros]
  );

  /* Benjamin Orellana - 2026/04/11 - Mejor marca con prioridad al resumen del backend */
  const mejorMarca = useMemo(() => {
    const fromResumen = toNumberOrNull(resumen?.mejor_rm);
    if (fromResumen !== null) return fromResumen;

    const valores = registros
      .map((r) => toNumberOrNull(r.rm_estimada))
      .filter((n) => n !== null && n > 0);

    if (!valores.length) return null;
    return Math.max(...valores);
  }, [registros, resumen]);

  /* Benjamin Orellana - 2026/04/11 - Último registro con prioridad al resumen/dashboard */
  const ultimoRegistroReal = useMemo(() => {
    if (ultimoRegistro) return ultimoRegistro;
    if (!registros.length) return null;

    const ordenados = [...registros].sort((a, b) => {
      const fa = new Date(getRegistroDate(a) || 0).getTime();
      const fb = new Date(getRegistroDate(b) || 0).getTime();
      return fb - fa;
    });

    return ordenados[0] || null;
  }, [registros, ultimoRegistro]);

  /* Benjamin Orellana - 2026/04/11 - Obtiene historial enriquecido del backend nuevo para el modal */
  const handleVerHistorial = async (ejercicioSeleccionado) => {
    try {
      setLoadingHistorial(true);

      const res = await fetch(
        `${BASE_URL}/student-rm/historial?student_id=${studentId}&ejercicio=${encodeURIComponent(
          ejercicioSeleccionado
        )}`
      );

      const data = await res.json();

      const historial = Array.isArray(data)
        ? data
        : Array.isArray(data?.historial)
          ? data.historial
          : [];

      setHistorialActual(historial);
      setEjercicioActual(ejercicioSeleccionado);
      setModalOpen(true);
    } catch (error) {
      console.error('No se pudo obtener el historial del ejercicio', error);
      setHistorialActual([]);
      setEjercicioActual(ejercicioSeleccionado);
      setModalOpen(true);
    } finally {
      setLoadingHistorial(false);
    }
  };

  return (
    <div className="mb-16">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-black uppercase tracking-wide text-white">
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
              {getIcon(ejercicio)}
            </span>

            <span>{ejercicio}</span>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm font-semibold text-white/60">
              {registros.length}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[420px]">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Mejor RM
            </p>
            <p className="mt-2 text-2xl font-black text-white">
              {formatKg(mejorMarca)}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Último registro
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {formatFecha(getRegistroDate(ultimoRegistroReal))}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Tendencia
            </p>
            <div className="mt-2 flex items-center gap-2">
              {resumen?.tendencia === 'ascendente' ? (
                <FiTrendingUp className="text-emerald-300" />
              ) : resumen?.tendencia === 'descendente' ? (
                <FiTrendingDown className="text-red-300" />
              ) : (
                <FiBarChart2 className="text-white/70" />
              )}

              <p className="text-sm font-semibold text-white">
                {formatTendencia(resumen?.tendencia)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {visibles.map((rm) => {
          const esPR = isPRRegistro(rm, mejorRegistro, resumen);

          return (
            <motion.div
              key={rm.id}
              className={`relative overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br ${getColorClass(
                rm.ejercicio
              )} text-white shadow-[0_22px_50px_-24px_rgba(0,0,0,0.6)]`}
              whileHover={{ scale: 1.02, y: -2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0.08)_100%)]" />
              <div className="absolute -right-6 top-[-18px] h-24 w-24 rounded-full bg-white/10 blur-2xl" />

              {esPR && (
                <span className="absolute right-3 top-3 rounded-full border border-emerald-300/20 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow">
                  PR
                </span>
              )}

              <div className="relative flex min-h-[320px] h-full flex-col justify-between bg-black/10 p-6 backdrop-blur-sm">
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/15 bg-white/10">
                      {getIcon(rm.ejercicio)}
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/80">
                      <FiCalendar />
                      {formatFecha(getRegistroDate(rm))}
                    </div>
                  </div>

                  <h3 className="text-lg font-black capitalize">
                    {rm.ejercicio}
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                        Peso levantado
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {formatKg(rm.peso_levantado)}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                        Repeticiones
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {rm.repeticiones ?? '—'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                        RM estimado
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {formatKg(rm.rm_estimada)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getTendenciaClass(
                        resumen?.tendencia
                      )}`}
                    >
                      {formatTendencia(resumen?.tendencia)}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white/85">
                      Confianza {formatConfiabilidad(rm?.confiabilidad_rm)}
                    </span>
                  </div>

                  {rm.comentario && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/50">
                        Comentario
                      </p>
                      <p className="mt-2 text-xs italic text-white/80">
                        "{rm.comentario}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleVerHistorial(rm.ejercicio)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                  >
                    {loadingHistorial ? 'Cargando...' : 'Ver historial'}
                  </button>

                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-white/80">
                    {resumen?.tendencia === 'descendente' ? (
                      <FiTrendingDown />
                    ) : (
                      <FiTrendingUp />
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {registros.length > 4 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setMostrarTodos(!mostrarTodos)}
            className="inline-flex items-center justify-center rounded-full border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
          >
            {mostrarTodos ? 'Ver menos' : 'Ver más'}
          </button>
        </div>
      )}

      <HistorialRMModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        historial={historialActual}
        ejercicio={ejercicioActual}
      />
    </div>
  );
};
