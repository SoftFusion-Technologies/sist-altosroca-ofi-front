import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import {
  FaUsers,
  FaHeart,
  FaDumbbell,
  FaRunning,
  FaClock,
  FaCheck,
  FaArrowRight,
  FaChartLine,
  FaShieldAlt
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Rediseño completo de la sección de entrenamientos para Altos Roca Gym.
 * Se reemplaza el layout clásico por una escena central moderna,
 * inmersiva, responsive y animada, alineada visualmente al hero principal.
 *
 * Tema: Sección Entrenamientos - Landing pública
 * Capa: Frontend
 */

const EntranamientosAdaptan = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('principiantes');
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0.15 });

  const categorias = [
    {
      id: 'principiantes',
      nombre: 'Principiantes',
      icono: FaUsers,
      accent: 'from-red-700 via-red-500 to-red-400',
      soft: 'border-red-500/25 bg-red-500/10 text-red-200 shadow-[0_0_22px_rgba(239,68,68,0.12)]'
    },
    {
      id: 'definicion',
      nombre: 'Definición',
      icono: FaHeart,
      accent: 'from-rose-700 via-red-500 to-orange-400',
      soft: 'border-rose-500/25 bg-rose-500/10 text-rose-200 shadow-[0_0_22px_rgba(244,63,94,0.12)]'
    },
    {
      id: 'masa-muscular',
      nombre: 'Masa muscular',
      icono: FaDumbbell,
      accent: 'from-red-800 via-red-600 to-amber-400',
      soft: 'border-red-400/25 bg-red-500/10 text-red-100 shadow-[0_0_22px_rgba(220,38,38,0.12)]'
    },
    {
      id: 'alto-rendimiento',
      nombre: 'Alto rendimiento',
      icono: FaRunning,
      accent: 'from-orange-700 via-red-500 to-red-300',
      soft: 'border-orange-400/25 bg-orange-500/10 text-orange-100 shadow-[0_0_22px_rgba(249,115,22,0.12)]'
    },
    {
      id: 'adultos-mayores',
      nombre: 'Adultos mayores',
      icono: FaShieldAlt,
      accent: 'from-zinc-700 via-red-600 to-zinc-300',
      soft: 'border-zinc-400/25 bg-zinc-500/10 text-zinc-100 shadow-[0_0_22px_rgba(161,161,170,0.12)]'
    },
    {
      id: 'adolescentes',
      nombre: 'Adolescentes',
      icono: FaClock,
      accent: 'from-red-700 via-fuchsia-500 to-red-300',
      soft: 'border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-100 shadow-[0_0_22px_rgba(217,70,239,0.12)]'
    }
  ];

  const contenidoCategorias = {
    principiantes: {
      titulo: 'PRINCIPIANTES',
      descripcion:
        'Entrenamiento general para mejorar tu resistencia, fuerza y bienestar general.',
      beneficios: [
        'Introducción segura al mundo del fitness',
        'Aprendizaje de técnicas correctas',
        'Desarrollo gradual de fuerza y resistencia',
        'Acompañamiento personalizado de nuestros coaches',
        'Rutinas adaptadas a tu nivel actual'
      ],
      duracion: '45-60 min',
      frecuencia: '3-4x semana',
      intensidad: 'Baja',
      resumen:
        'Ideal para comenzar con confianza, aprender la base técnica y desarrollar constancia desde el primer día.'
    },
    definicion: {
      titulo: 'DEFINICIÓN',
      descripcion:
        'Programas específicos para quemar grasa y definir tu musculatura con entrenamientos intensivos.',
      beneficios: [
        'Quema efectiva de grasa corporal',
        'Tonificación y definición muscular',
        'Entrenamiento cardiovascular integrado',
        'Rutinas de alta intensidad (HIIT)',
        'Seguimiento nutricional especializado'
      ],
      duracion: '50-70 min',
      frecuencia: '4-5x semana',
      intensidad: 'Moderada',
      resumen:
        'Pensado para quienes buscan un físico más atlético, mejor condición y sesiones dinámicas con foco en resultados.'
    },
    'masa-muscular': {
      titulo: 'MASA MUSCULAR',
      descripcion:
        'Desarrollo de masa muscular con técnicas avanzadas de hipertrofia y fuerza.',
      beneficios: [
        'Aumento significativo de masa muscular',
        'Entrenamiento con cargas progresivas',
        'Técnicas avanzadas de hipertrofia',
        'Periodización específica para crecimiento',
        'Asesoramiento en suplementación deportiva'
      ],
      duracion: '60-80 min',
      frecuencia: '4-6x semana',
      intensidad: 'Alta',
      resumen:
        'Orientado a progresar en fuerza y volumen con estructura, control y una planificación seria.'
    },
    'alto-rendimiento': {
      titulo: 'ALTO RENDIMIENTO',
      descripcion:
        'Entrenamiento de élite para atletas y personas con experiencia avanzada.',
      beneficios: [
        'Programas de entrenamiento de élite',
        'Análisis biomecánico avanzado',
        'Preparación física especializada',
        'Periodización competitiva',
        'Seguimiento con tecnología de vanguardia'
      ],
      duracion: '70-90 min',
      frecuencia: '5-6x semana',
      intensidad: 'Muy alta',
      resumen:
        'Una propuesta intensa para quienes ya entrenan fuerte y quieren llevar su rendimiento al siguiente nivel.'
    },
    'adultos-mayores': {
      titulo: 'ADULTOS MAYORES',
      descripcion:
        'Programas adaptados para mantener la vitalidad y movilidad en la edad dorada.',
      beneficios: [
        'Mantenimiento de la movilidad articular',
        'Fortalecimiento funcional',
        'Prevención de caídas',
        'Mejora del equilibrio y coordinación',
        'Actividades de bajo impacto'
      ],
      duracion: '40-50 min',
      frecuencia: '2-3x semana',
      intensidad: 'Baja',
      resumen:
        'Diseñado para cuidar la salud, preservar la independencia y entrenar de manera segura y efectiva.'
    },
    adolescentes: {
      titulo: 'ADOLESCENTES',
      descripcion:
        'Entrenamiento seguro y supervisado para jóvenes en etapa de crecimiento.',
      beneficios: [
        'Desarrollo físico integral',
        'Educación en hábitos saludables',
        'Fortalecimiento del sistema óseo',
        'Mejora de la autoestima',
        'Supervisión especializada constante'
      ],
      duracion: '45-60 min',
      frecuencia: '3-4x semana',
      intensidad: 'Moderada',
      resumen:
        'Un espacio guiado para crecer bien, incorporar hábitos sanos y entrenar con técnica y acompañamiento.'
    }
  };

  const categoriaMeta = useMemo(
    () => categorias.find((c) => c.id === categoriaActiva) || categorias[0],
    [categoriaActiva]
  );

  const categoriaSeleccionada = contenidoCategorias[categoriaActiva];
  const IconoActivo = categoriaMeta.icono;

  const discFondo = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <g fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='2'>
        <circle cx='60' cy='60' r='44'/>
        <circle cx='60' cy='60' r='28'/>
        <circle cx='60' cy='60' r='10'/>
      </g>
      <g stroke='rgba(239,68,68,0.10)' stroke-width='1.4'>
        <line x1='60' y1='8' x2='60' y2='22'/>
        <line x1='60' y1='98' x2='60' y2='112'/>
        <line x1='8' y1='60' x2='22' y2='60'/>
        <line x1='98' y1='60' x2='112' y2='60'/>
      </g>
    </svg>
  `);

  const mancuernaSvg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <g fill='none' stroke='rgba(255,255,255,0.78)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
        <line x1='10' y1='32' x2='54' y2='32'/>
        <rect x='6' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(239,68,68,0.15)' stroke='rgba(255,255,255,0.58)'/>
        <rect x='12' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
        <rect x='52' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(239,68,68,0.15)' stroke='rgba(255,255,255,0.58)'/>
        <rect x='46' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
      </g>
    </svg>
  `);

  return (
    <section
      ref={contenedorRef}
      className="relative isolate overflow-hidden bg-black text-white py-20 sm:py-24 lg:py-32"
    >
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_26%),linear-gradient(180deg,#050505_0%,#0a0a0b_46%,#040404_100%)]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${discFondo}")`,
          backgroundSize: '190px 190px',
          backgroundRepeat: 'repeat',
          maskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 34%, rgba(0,0,0,0.18) 74%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 34%, rgba(0,0,0,0.18) 74%, transparent 100%)'
        }}
      />

      <div className="pointer-events-none absolute -top-16 -left-16 h-[28rem] w-[28rem] rounded-full bg-red-600/18 blur-3xl" />
      <div className="pointer-events-none absolute top-[22%] -right-16 h-[30rem] w-[30rem] rounded-full bg-red-500/14 blur-3xl" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[40%] size-[72vmin] max-h-[720px] max-w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-[40%] size-[56vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/14" />

        <div className="absolute left-1/2 top-[40%] size-[72vmin] max-h-[720px] max-w-[720px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
          {[
            'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
            'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
            'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
            'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
          ].map((position, index) => (
            <div
              key={`outer-${index}`}
              className={`absolute ${position}`}
              style={{
                width: '42px',
                height: '42px',
                backgroundImage: `url("data:image/svg+xml;utf8,${mancuernaSvg}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.18))'
              }}
            />
          ))}
        </div>

        <div className="absolute left-1/2 top-[40%] size-[52vmin] max-h-[500px] max-w-[500px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_reverse_20s_linear_infinite]">
          {[
            'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
            'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2'
          ].map((position, index) => (
            <div
              key={`inner-${index}`}
              className={`absolute ${position}`}
              style={{
                width: '36px',
                height: '36px',
                backgroundImage: `url("data:image/svg+xml;utf8,${mancuernaSvg}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.14))'
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
              Altos Roca Gym · Entrenamientos
            </span>
          </div>

          <h2 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[0.92] uppercase tracking-[0.04em] text-white">
            Planes que
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.25)]">
              se adaptan
            </span>
            <span className="block text-white/92">a tu nivel</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70">
            Elegí un camino de entrenamiento pensado para tu momento actual, tus
            objetivos y tu ritmo. Todo con una estética más fuerte, moderna y
            alineada a la identidad de Altos Roca.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-12"
        >
          <div className="mx-auto max-w-6xl overflow-x-auto pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max min-w-full gap-3 px-1 lg:w-full lg:min-w-0 lg:flex-wrap lg:justify-center">
              {categorias.map((categoria) => {
                const IconoCategoria = categoria.icono;
                const esActiva = categoriaActiva === categoria.id;

                return (
                  <motion.button
                    key={categoria.id}
                    whileHover={{ y: -2, scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setCategoriaActiva(categoria.id)}
                    className={[
                      'group relative inline-flex items-center gap-3 rounded-2xl border px-4 sm:px-5 py-3 sm:py-3.5 text-left transition-all duration-300 backdrop-blur-xl',
                      'min-w-[190px] sm:min-w-[210px] lg:min-w-[unset]',
                      esActiva
                        ? `bg-gradient-to-r ${categoria.accent} border-white/10 text-white shadow-[0_18px_40px_rgba(0,0,0,0.34)]`
                        : 'border-white/10 bg-white/[0.045] text-white/76 hover:border-red-500/22 hover:bg-red-500/[0.06]'
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'flex h-11 w-11 items-center justify-center rounded-2xl border transition-all duration-300',
                        esActiva
                          ? 'border-white/15 bg-black/20 text-white'
                          : categoria.soft
                      ].join(' ')}
                    >
                      <IconoCategoria className="text-base" />
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                        Categoría
                      </span>
                      <span className="truncate text-sm sm:text-[15px] font-semibold uppercase tracking-[0.08em]">
                        {categoria.nombre}
                      </span>
                    </div>

                    {esActiva && (
                      <motion.span
                        layoutId="activeTrainingGlow"
                        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="relative mt-12 sm:mt-14">
          <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-red-500/8 blur-3xl" />

          <AnimatePresence mode="wait">
            <motion.div
              key={categoriaActiva}
              initial={{ opacity: 0, y: 26, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.985 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

              <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />
              <div className="absolute -bottom-24 right-10 h-56 w-56 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative z-10 p-5 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl text-center">
                  <div
                    className={[
                      'mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-[24px] border',
                      categoriaMeta.soft
                    ].join(' ')}
                  >
                    <IconoActivo className="text-2xl sm:text-3xl" />
                  </div>

                  <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/72">
                    <span className="inline-flex h-2 w-2 rounded-full bg-red-400" />
                    Programa activo
                  </div>

                  <h3 className="mt-5 font-bignoodle text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.05em] text-white">
                    {categoriaSeleccionada.titulo}
                  </h3>

                  <p className="mx-auto mt-4 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-white/72">
                    {categoriaSeleccionada.descripcion}
                  </p>

                  <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-white/52">
                    {categoriaSeleccionada.resumen}
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                  {[
                    {
                      label: 'Duración',
                      value: categoriaSeleccionada.duracion,
                      icon: FaClock
                    },
                    {
                      label: 'Frecuencia',
                      value: categoriaSeleccionada.frecuencia,
                      icon: FaChartLine
                    },
                    {
                      label: 'Intensidad',
                      value: categoriaSeleccionada.intensidad,
                      icon: FaHeart
                    }
                  ].map((item, index) => {
                    const Icono = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 * index }}
                        className="rounded-[24px] border border-white/10 bg-black/30 p-4 sm:p-5 text-center transition-all duration-300 hover:border-red-500/22 hover:bg-red-500/[0.05]"
                      >
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                          <Icono />
                        </div>
                        <div className="mt-3 text-[11px] uppercase tracking-[0.18em] text-white/48">
                          {item.label}
                        </div>
                        <div className="mt-1 text-lg sm:text-xl font-bold text-white/92">
                          {item.value}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {categoriaSeleccionada.beneficios.map((beneficio, index) => (
                    <motion.div
                      key={beneficio}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + index * 0.06 }}
                      whileHover={{ y: -2 }}
                      className="group rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5 transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.05]"
                    >
                      <div className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                          <FaCheck className="text-sm" />
                        </div>

                        <div className="min-w-0 text-left">
                          <div className="text-[10px] uppercase tracking-[0.18em] text-white/44">
                            Beneficio {String(index + 1).padStart(2, '0')}
                          </div>
                          <p className="mt-1 text-sm sm:text-base leading-relaxed text-white/78">
                            {beneficio}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 rounded-[26px] border border-red-500/16 bg-red-500/[0.06] p-4 sm:p-5 lg:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="text-left">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                        Altos Roca Gym
                      </div>
                      <p className="mt-2 max-w-2xl text-sm sm:text-base leading-relaxed text-white/76">
                        Elegí esta categoría y empezá un recorrido más claro,
                        más profesional y mejor adaptado a vos.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* <NavLink to="/turnos" className="inline-flex">
                        <button className="btn-logo btn-logo--md w-full sm:w-auto min-w-[200px]">
                          <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                            Quiero empezar
                            <FaArrowRight className="text-sm" />
                          </span>
                        </button>
                      </NavLink> */}

                      <NavLink
                        to="/espacios"
                        className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                      >
                        Ver espacios
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @keyframes orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes orbit_reverse {
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        .animate-[orbit_28s_linear_infinite] {
          animation: orbit 28s linear infinite;
        }

        .animate-[orbit_reverse_20s_linear_infinite] {
          animation: orbit_reverse 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default EntranamientosAdaptan;
