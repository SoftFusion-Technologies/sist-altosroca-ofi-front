import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { GiWeightLiftingUp, GiStrong, GiMuscleUp } from 'react-icons/gi';
import { MdOutlineFitnessCenter } from 'react-icons/md';
import { FiTrendingUp, FiBarChart2, FiCalendar } from 'react-icons/fi';
import HistorialRMModal from './HistorialRMModal';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.0
 *
 * Descripción:
 * Tarjeta de agrupación de registros RM por ejercicio, rediseñada para
 * Altos Roca con mejor jerarquía visual, badges más claros y acciones
 * más consistentes para historial y lectura de progreso.
 *
 * Tema: Card de RM por ejercicio
 * Capa: Frontend
 */

const getIcon = (ejercicio) => {
  const e = ejercicio.toLowerCase();
  if (e.includes('press'))
    return <MdOutlineFitnessCenter className="text-3xl text-white" />;
  if (e.includes('sentadilla'))
    return <GiWeightLiftingUp className="text-3xl text-white" />;
  if (e.includes('dominadas'))
    return <GiMuscleUp className="text-3xl text-white" />;
  return <GiStrong className="text-3xl text-white" />;
};

const getColorClass = (ejercicio) => {
  const e = ejercicio.toLowerCase();
  if (e.includes('sentadilla'))
    return 'from-[#5a0912] via-[#b71c2b] to-[#ef3347]';
  if (e.includes('press')) return 'from-[#3b0a12] via-[#8b1324] to-[#d11f2f]';
  if (e.includes('peso muerto'))
    return 'from-[#5f1f08] via-[#a53a17] to-[#ef6b3b]';
  return 'from-[#420911] via-[#7b1120] to-[#c11c2f]';
};

const isPR = (rm) => rm.rm_estimada && rm.rm_estimada > 100;

const tablasFuerza = {
  sentadilla: { male: [60, 100, 130, 160], female: [40, 60, 80, 100] },
  'press banca': { male: [50, 80, 110, 140], female: [20, 40, 60, 80] },
  'peso muerto': { male: [70, 120, 160, 200], female: [50, 80, 100, 130] },
  'remo con barra': { male: [40, 70, 100, 130], female: [20, 40, 60, 80] },
  'press militar': { male: [30, 60, 80, 100], female: [15, 30, 50, 70] },
  'dominadas lastradas': { male: [5, 15, 25, 40], female: [0, 5, 15, 25] }
};

const calcularNivelFuerza = (ejercicio, rm, sexo) => {
  if (!sexo || !rm) return 'Desconocido';
  const key = ejercicio.toLowerCase();
  const t = tablasFuerza[key]?.[sexo];
  if (!t) return 'Sin referencia';

  if (rm < t[0]) return 'Novato';
  if (rm < t[1]) return 'Intermedio';
  if (rm < t[2]) return 'Avanzado';
  return 'Élite';
};

const getColorPorNivel = (nivel) => {
  switch (nivel) {
    case 'Novato':
      return 'bg-white/15 text-white border border-white/10';
    case 'Intermedio':
      return 'bg-amber-400/20 text-amber-100 border border-amber-300/20';
    case 'Avanzado':
      return 'bg-orange-400/20 text-orange-100 border border-orange-300/20';
    case 'Élite':
      return 'bg-red-500/20 text-red-100 border border-red-300/20';
    default:
      return 'bg-white/10 text-white/70 border border-white/10';
  }
};

const formatFecha = (fecha) => {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-AR');
};

export const RMCard = ({ ejercicio, registros, studentId }) => {
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [historialActual, setHistorialActual] = useState([]);
  const [ejercicioActual, setEjercicioActual] = useState('');
  const [sexo, setSexo] = useState(null);

  useEffect(() => {
    async function fetchSexo() {
      try {
        const res1 = await fetch(`http://localhost:8080/students/${studentId}`);
        const student = await res1.json();
        const nombre = student?.nomyape?.split(' ')[0] || '';
        const res2 = await fetch(
          `https://api.genderize.io?name=${encodeURIComponent(nombre)}`
        );
        const data = await res2.json();
        setSexo(data.gender);
      } catch (error) {
        console.error('No se pudo obtener el sexo estimado del alumno', error);
        setSexo(null);
      }
    }

    fetchSexo();
  }, [studentId]);

  const visibles = mostrarTodos ? registros : registros.slice(0, 4);

  const mejorMarca = useMemo(() => {
    const valores = registros
      .map((r) => Number(r.rm_estimada || 0))
      .filter((n) => Number.isFinite(n) && n > 0);

    if (!valores.length) return null;
    return Math.max(...valores);
  }, [registros]);

  const ultimoRegistro = useMemo(() => {
    if (!registros.length) return null;

    const ordenados = [...registros].sort((a, b) => {
      const fa = new Date(a.fecha || a.created_at || 0).getTime();
      const fb = new Date(b.fecha || b.created_at || 0).getTime();
      return fb - fa;
    });

    return ordenados[0] || null;
  }, [registros]);

  const handleVerHistorial = async (ejercicioSeleccionado) => {
    const res = await fetch(
      `http://localhost:8080/rm-historial?student_id=${studentId}&ejercicio=${encodeURIComponent(
        ejercicioSeleccionado
      )}`
    );
    const data = await res.json();
    setHistorialActual(data);
    setEjercicioActual(ejercicioSeleccionado);
    setModalOpen(true);
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

          <p className="mt-3 text-sm text-white/55">
            Seguimiento agrupado por ejercicio para visualizar evolución, marcas
            estimadas y acceso rápido al historial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:min-w-[420px]">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Mejor RM
            </p>
            <p className="mt-2 text-2xl font-black text-white">
              {mejorMarca ? `${mejorMarca} kg` : '—'}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Último registro
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {formatFecha(ultimoRegistro?.fecha)}
            </p>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              Historial
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {registros.length} intento(s)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {visibles.map((rm) => {
          const nivel = calcularNivelFuerza(rm.ejercicio, rm.rm_estimada, sexo);

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

              {isPR(rm) && (
                <span className="absolute top-3 right-3 rounded-full border border-emerald-300/20 bg-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow">
                  Nuevo PR
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
                      {formatFecha(rm.fecha)}
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
                        {rm.peso_levantado} kg
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                        Repeticiones
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {rm.repeticiones}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/10 p-3">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">
                        RM estimado
                      </p>
                      <p className="mt-1 text-lg font-bold text-white">
                        {rm.rm_estimada ? `${rm.rm_estimada} kg` : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white/85">
                      Nivel:
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getColorPorNivel(
                        nivel
                      )}`}
                    >
                      {nivel}
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
                    Ver historial
                  </button>

                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-white/80">
                    <FiTrendingUp />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {registros.length > 4 && (
        <div className="text-center mt-8">
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
