import React, { useEffect, useMemo, useState } from 'react';
import '../../Styles/login.css';
import NavbarStaff from '../staff/NavbarStaff';
import axios from 'axios';
import CountUp from 'react-countup';
import 'react-circular-progressbar/dist/styles.css';
import ParticlesBackground from '../../components/ParticlesBackground';
import {
  FaArrowLeft,
  FaArrowRight,
  FaUserGraduate,
  FaClipboardList,
  FaLifeRing,
  FaCommentDots,
  FaChalkboardTeacher
} from 'react-icons/fa';

const fontTitle = {
  fontFamily: 'var(--font-family-base, "Montserrat", sans-serif)'
};
const fontBody = {
  fontFamily: 'var(--font-family-body, "MessinaRegular", sans-serif)'
};
const fontDisplay = {
  fontFamily: 'var(--font-family-display, "BigNoodle", sans-serif)'
};

const getMonthName = (month) => {
  const months = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE'
  ];
  return months[month - 1];
};

const sumByField = (arr = [], field) =>
  arr.reduce((acc, item) => acc + Number(item?.[field] || 0), 0);

const EmptyState = ({ text = 'No hay datos disponibles.' }) => (
  <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-10 text-center">
    <p className="text-base text-white/60" style={fontBody}>
      {text}
    </p>
  </div>
);

const SkeletonCard = () => (
  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 animate-pulse">
    <div className="mb-3 h-3 w-24 rounded-full bg-white/10" />
    <div className="mb-3 h-6 w-2/3 rounded-full bg-white/10" />
    <div className="h-4 w-1/2 rounded-full bg-white/10" />
    <div className="mt-6 h-14 w-28 rounded-2xl bg-white/10" />
  </div>
);

const StatCard = ({ titulo, contenido, subtitulo }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:border-[#ef3347]/18"
      style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.24)' }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.10)_0%,rgba(255,255,255,0.02)_46%,rgba(0,0,0,0.38)_100%)] opacity-95" />
      <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.04)_0%,rgba(239,51,71,0.35)_50%,rgba(239,51,71,0.04)_100%)]" />
      <div className="absolute -right-8 top-[-18px] h-24 w-24 rounded-full bg-[#ef3347]/10 blur-2xl transition-all duration-300 group-hover:bg-[#ef3347]/16" />

      <div className="relative">
        <p
          className="text-[11px] uppercase tracking-[0.18em] text-white/42"
          style={fontTitle}
        >
          {subtitulo || 'Profesor'}
        </p>

        <h3
          className="mt-3 line-clamp-2 text-lg font-black leading-tight text-white"
          style={fontTitle}
        >
          {titulo}
        </h3>

        <div className="mt-5">
          <p className="text-4xl leading-none text-white" style={fontDisplay}>
            <CountUp
              start={0}
              end={Number(contenido || 0)}
              duration={2}
              separator="."
            />
          </p>
        </div>
      </div>
    </div>
  );
};

const KPIBox = ({ icon, label, value }) => (
  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
    <div className="flex items-center justify-between gap-3">
      <div>
        <p
          className="text-[11px] uppercase tracking-[0.2em] text-white/45"
          style={fontTitle}
        >
          {label}
        </p>
        <p
          className="mt-2 text-3xl leading-none text-white"
          style={fontDisplay}
        >
          <CountUp
            start={0}
            end={Number(value || 0)}
            duration={1.6}
            separator="."
          />
        </p>
      </div>

      <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
        {icon}
      </div>
    </div>
  </div>
);

const StatsSection = ({ icon, title, data, field }) => {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
          {icon}
        </div>

        <div>
          <span
            className="rounded-full border border-[#ef3347]/18 bg-[#ef3347]/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#ff98a5]"
            style={fontTitle}
          >
            Estadística
          </span>

          <h2
            className="mt-3 text-2xl font-black uppercase text-white md:text-3xl"
            style={fontTitle}
          >
            {title}
          </h2>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {data.map((stat) => (
            <StatCard
              key={stat.profesor_id}
              titulo={stat.profesor_nombre || 'Profesor'}
              contenido={stat[field]}
              subtitulo="Profesor"
            />
          ))}
        </div>
      )}
    </section>
  );
};

const EstadisticasIns = () => {
  const [alumnosPorProfesor, setAlumnosPorProfesor] = useState([]);
  const [rutinasPorProfesor, setRutinasPorProfesor] = useState([]);
  const [ayudasResueltasPorProfesor, setAyudasResueltasPorProfesor] = useState(
    []
  );
  const [feedbacksPorProfesor, setFeedbacksPorProfesor] = useState([]);

  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const URL = 'http://localhost:8080';

  const selectedMonthName = useMemo(
    () => getMonthName(selectedMonth),
    [selectedMonth]
  );

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      fetchAllStats();
    }
  }, [selectedMonth, selectedYear]);

  const fetchAllStats = async () => {
    try {
      setLoading(true);

      const [
        alumnosResponse,
        rutinasResponse,
        ayudasResponse,
        feedbacksResponse
      ] = await Promise.all([
        axios.get(`${URL}/estadisticas/alumnos-por-profesor`),
        axios.get(`${URL}/estadisticas/rutinas-por-profesor`, {
          params: { mes: selectedMonth, anio: selectedYear }
        }),
        axios.get(`${URL}/estadisticas/ayudas-por-profesor`, {
          params: { mes: selectedMonth, anio: selectedYear }
        }),
        axios.get(`${URL}/estadisticas/feedbacks-por-profesor`, {
          params: { mes: selectedMonth, anio: selectedYear }
        })
      ]);

      setAlumnosPorProfesor(alumnosResponse.data || []);
      setRutinasPorProfesor(rutinasResponse.data || []);
      setAyudasResueltasPorProfesor(ayudasResponse.data || []);
      setFeedbacksPorProfesor(feedbacksResponse.data || []);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      setAlumnosPorProfesor([]);
      setRutinasPorProfesor([]);
      setAyudasResueltasPorProfesor([]);
      setFeedbacksPorProfesor([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prevYear) => prevYear - 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prevYear) => prevYear + 1);
    } else {
      setSelectedMonth((prevMonth) => prevMonth + 1);
    }
  };

  const totalAlumnos = useMemo(
    () => sumByField(alumnosPorProfesor, 'total_alumnos'),
    [alumnosPorProfesor]
  );

  const totalRutinas = useMemo(
    () => sumByField(rutinasPorProfesor, 'total_rutinas'),
    [rutinasPorProfesor]
  );

  const totalAyudas = useMemo(
    () => sumByField(ayudasResueltasPorProfesor, 'total_ayudas'),
    [ayudasResueltasPorProfesor]
  );

  const totalFeedbacks = useMemo(
    () => sumByField(feedbacksPorProfesor, 'total_feedbacks'),
    [feedbacksPorProfesor]
  );

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)] pt-8 pb-10">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-[95%] max-w-[1600px]">
          <section className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.10)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.40)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

            <div className="relative px-5 py-6 md:px-7 md:py-7">
              <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]"
                      style={fontTitle}
                    >
                      Panel estadístico
                    </span>

                    <span
                      className="text-[24px] uppercase leading-none text-[#ff5a6f]"
                      style={fontDisplay}
                    >
                      Altos Roca
                    </span>
                  </div>

                  <h1
                    className="mt-4 titulo uppercase text-3xl font-black uppercase tracking-tight text-white md:text-5xl"
                    style={fontTitle}
                  >
                    {selectedMonthName} {selectedYear}
                  </h1>

                  <p
                    className="mt-3 max-w-3xl text-sm leading-6 text-white/62 md:text-base"
                    style={fontBody}
                  >
                    Visualizá el rendimiento mensual por profesor en alumnos,
                    rutinas y feedbacks.
                  </p>
                </div>

                {/* <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-white/82 transition hover:bg-white/[0.08]"
                    onClick={handlePreviousMonth}
                    style={fontTitle}
                  >
                    <FaArrowLeft />
                    Mes anterior
                  </button>

                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]"
                    onClick={handleNextMonth}
                    style={fontTitle}
                  >
                    Mes siguiente
                    <FaArrowRight />
                  </button>
                </div> */}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <KPIBox
                  icon={<FaUserGraduate />}
                  label="Alumnos"
                  value={totalAlumnos}
                />
                <KPIBox
                  icon={<FaClipboardList />}
                  label="Rutinas"
                  value={totalRutinas}
                />
                <KPIBox
                  icon={<FaLifeRing />}
                  label="Ayudas"
                  value={totalAyudas}
                />
                <KPIBox
                  icon={<FaCommentDots />}
                  label="Feedbacks"
                  value={totalFeedbacks}
                />
              </div>
            </div>
          </section>

          <div className="mt-6 space-y-6">
            {loading ? (
              <>
                <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
                      <FaUserGraduate />
                    </div>
                    <div>
                      <div className="h-3 w-28 rounded-full bg-white/10" />
                      <div className="mt-3 h-8 w-72 rounded-full bg-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                </section>

                <section className="rounded-[32px] border border-white/10 bg-white/[0.04] p-5 md:p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
                      <FaClipboardList />
                    </div>
                    <div>
                      <div className="h-3 w-28 rounded-full bg-white/10" />
                      <div className="mt-3 h-8 w-72 rounded-full bg-white/10" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <>
                <StatsSection
                  icon={<FaUserGraduate />}
                  title="Total de Alumnos por Profesor"
                  data={alumnosPorProfesor}
                  field="total_alumnos"
                />

                <StatsSection
                  icon={<FaClipboardList />}
                  title="Total de Rutinas por Profesor"
                  data={rutinasPorProfesor}
                  field="total_rutinas"
                />

                {/* <StatsSection
                  icon={<FaLifeRing />}
                  title="Ayudas Resueltas por Profesor"
                  data={ayudasResueltasPorProfesor}
                  field="total_ayudas"
                /> */}

                <StatsSection
                  icon={<FaCommentDots />}
                  title="Feedbacks por Profesor"
                  data={feedbacksPorProfesor}
                  field="total_feedbacks"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EstadisticasIns;
