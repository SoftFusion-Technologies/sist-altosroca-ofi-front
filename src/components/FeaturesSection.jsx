import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';
import {
  FaDumbbell,
  FaUsers,
  FaAward,
  FaArrowRight,
  FaCheckCircle,
  FaFireAlt
} from 'react-icons/fa';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Rediseño completo de la sección Features para Altos Roca Gym.
 * Se reemplaza la grilla clásica por una composición moderna tipo mosaic,
 * con fondo inmersivo rojo/negro, continuidad visual con el hero, cards
 * premium animadas y mejor jerarquía responsive.
 *
 * Tema: Features Section - Landing pública
 * Capa: Frontend
 */

const containerV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08
    }
  }
};

const itemV = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 16
    }
  }
};

const FeaturesSection = () => {
  const features = [
    {
      id: 'equipamiento',
      icon: <FaDumbbell size={24} />,
      title: 'Equipamiento y espacios',
      description:
        'Máquinas, zonas de trabajo y un entorno pensado para entrenar con energía, orden y continuidad.',
      badge: 'Infraestructura',
      accent: 'from-red-700 via-red-500 to-red-400',
      glow: 'shadow-[0_0_28px_rgba(239,68,68,0.14)]',
      points: ['Espacios bien distribuidos', 'Entrenamiento más cómodo'],
      className: 'md:col-span-2 xl:col-span-2'
    },
    {
      id: 'comunidad',
      icon: <FaUsers size={24} />,
      title: 'Comunidad activa',
      description:
        'Un ambiente real, con actitud, constancia y gente que vive el movimiento en serio.',
      badge: 'Ambiente',
      accent: 'from-red-800 via-rose-500 to-orange-400',
      glow: 'shadow-[0_0_28px_rgba(244,63,94,0.12)]',
      points: ['Motivación compartida', 'Experiencia más humana'],
      className: 'md:col-span-1 xl:col-span-1'
    },
    {
      id: 'coaches',
      icon: <FaAward size={24} />,
      title: 'Acompañamiento real',
      description:
        'Seguimiento técnico, criterio y un enfoque más claro para que progreses con sentido.',
      badge: 'Coaching',
      accent: 'from-zinc-700 via-red-500 to-zinc-300',
      glow: 'shadow-[0_0_28px_rgba(161,161,170,0.12)]',
      points: ['Corrección y guía', 'Mejor toma de decisiones'],
      className: 'md:col-span-1 xl:col-span-1'
    }
  ];

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

  const chips = ['Gym', 'Fútbol', 'Pádel', 'Comunidad', 'Progreso'];

  return (
    <section className="relative isolate overflow-hidden bg-black text-white py-20 sm:py-24 lg:py-28">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.16),transparent_24%),linear-gradient(180deg,#050505_0%,#09090b_45%,#040404_100%)]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${discFondo}")`,
          backgroundSize: '180px 180px',
          backgroundRepeat: 'repeat',
          maskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 34%, rgba(0,0,0,0.18) 74%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 34%, rgba(0,0,0,0.18) 74%, transparent 100%)'
        }}
      />

      <div className="pointer-events-none absolute -top-16 -left-20 h-[28rem] w-[28rem] rounded-full bg-red-600/18 blur-3xl" />
      <div className="pointer-events-none absolute top-[24%] -right-16 h-[30rem] w-[30rem] rounded-full bg-red-500/14 blur-3xl" />

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
        <div className="absolute left-1/2 top-[28%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-[28%] size-[44vmin] max-h-[420px] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/14" />

        <div className="absolute left-1/2 top-[28%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
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
                width: '38px',
                height: '38px',
                backgroundImage: `url("data:image/svg+xml;utf8,${mancuernaSvg}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.18))'
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div
            variants={itemV}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
                Altos Roca Gym · Experience
              </span>
            </div>

            <h2 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[0.92] uppercase tracking-[0.05em] text-white">
              Entrenar con
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
                otra energía
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70">
              Más que una sala de máquinas. Altos Roca propone una experiencia
              más completa, más intensa y mejor conectada con la forma en la que
              hoy querés entrenar y vivir el deporte.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {chips.map((chip, index) => (
                <motion.span
                  key={chip}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.06 * index }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.08] hover:text-white"
                >
                  {chip}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <motion.article
              variants={itemV}
              whileHover={{ y: -4 }}
              className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] xl:col-span-5"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
              <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative z-10 p-6 sm:p-7 lg:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaFireAlt className="text-xl" />
                  </div>

                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                      Altos Roca Gym
                    </div>
                    <div className="mt-1 text-xl sm:text-2xl font-semibold text-white">
                      Una propuesta más fuerte
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-sm sm:text-base leading-relaxed text-white/72">
                  Diseñamos un entorno donde el entrenamiento se siente más
                  vivo: mejor atmósfera, mejor comunidad y una identidad visual
                  y deportiva mucho más marcada.
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    'Entrenamiento con identidad real',
                    'Ambiente motivante y ordenado',
                    'Espacios que invitan a volver',
                    'Progreso acompañado y visible'
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                        <FaCheckCircle className="text-sm" />
                      </div>
                      <span className="text-sm sm:text-[15px] text-white/82">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-7 flex flex-col sm:flex-row gap-3">
                  <NavLink to="/espacios" className="inline-flex">
                    <button className="btn-logo btn-logo--md w-full sm:w-auto min-w-[190px]">
                      <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                        Ver espacios
                        <FaArrowRight className="text-sm" />
                      </span>
                    </button>
                  </NavLink>

                  <NavLink
                    to="/turnos"
                    className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                  >
                    Reservar turno
                  </NavLink>
                </div>
              </div>
            </motion.article>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-7">
              {features.map((f, index) => (
                <motion.article
                  key={f.id}
                  variants={itemV}
                  whileHover={{ y: -5, rotateX: -3, rotateY: 4 }}
                  whileTap={{ scale: 0.995 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                    mass: 0.6
                  }}
                  className={[
                    'group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] p-5 sm:p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.38)] [transform-style:preserve-3d]',
                    f.className,
                    f.glow
                  ].join(' ')}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${f.accent}`}
                  />
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-500/8 blur-2xl" />

                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-gradient-to-br ${f.accent} text-white shadow-[0_12px_30px_rgba(0,0,0,0.24)]`}
                    >
                      {f.icon}
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">
                      {f.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                    {f.title}
                  </h3>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/72">
                    {f.description}
                  </p>

                  <div className="mt-5 space-y-3">
                    {f.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                          <FaCheckCircle className="text-xs" />
                        </div>
                        <span className="text-sm text-white/82">{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-red-300 transition-all duration-300 group-hover:translate-x-1">
                    <span>Altos Roca Experience</span>
                    <FaArrowRight className="text-xs" />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .animate-[orbit_28s_linear_infinite] {
          animation: orbit 28s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;
