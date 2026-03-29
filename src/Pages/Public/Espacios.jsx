import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaDumbbell,
  FaFutbol,
  FaArrowRight,
  FaCheckCircle,
  FaFireAlt
} from 'react-icons/fa';
import { GiTennisRacket } from 'react-icons/gi';
import ParticlesBackground from '../../components/ParticlesBackground';

/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Página de espacios rediseñada para Altos Roca Gym.
 * Se reemplaza la identidad anterior por una experiencia visual moderna,
 * roja/negra, alineada al hero y al resto del sitio, incorporando
 * galería inmersiva, categorías de espacios y CTA principal.
 *
 * Tema: Página de Espacios - Landing pública
 * Capa: Frontend
 */

const imagenes = Array.from(
  { length: 9 },
  (_, i) =>
    new URL(`../../img/Gimnasio/img-${i + 1}.webp`, import.meta.url).href
);

const espaciosData = [
  {
    titulo: 'Zona de musculación',
    descripcion: 'Espacio para fuerza, volumen y progreso constante.',
    badge: 'Gym'
  },
  {
    titulo: 'Área funcional',
    descripcion: 'Movimiento, coordinación y sesiones más dinámicas.',
    badge: 'Funcional'
  },
  {
    titulo: 'Sector cardio',
    descripcion: 'Ritmo, resistencia y trabajo aeróbico continuo.',
    badge: 'Cardio'
  },
  {
    titulo: 'Entrenamiento libre',
    descripcion: 'Más libertad para adaptar la rutina a tu objetivo.',
    badge: 'Libre'
  },
  {
    titulo: 'Cancha de fútbol',
    descripcion: 'Juego, intensidad y espacio para activarte en serio.',
    badge: 'Fútbol'
  },
  {
    titulo: 'Cancha de pádel',
    descripcion: 'Ritmo, técnica y competencia en un mismo lugar.',
    badge: 'Pádel'
  },
  {
    titulo: 'Ambiente activo',
    descripcion: 'Una energía que acompaña cada entrenamiento.',
    badge: 'Comunidad'
  },
  {
    titulo: 'Espacios versátiles',
    descripcion: 'Un entorno pensado para distintas experiencias deportivas.',
    badge: 'Experience'
  },
  {
    titulo: 'Altos Roca Gym',
    descripcion: 'Más que un gimnasio, una experiencia completa.',
    badge: 'Altos Roca'
  }
];

const beneficios = [
  'Gym, fútbol y pádel en un mismo lugar',
  'Espacios pensados para entrenar con comodidad',
  'Ambiente moderno, intenso y visualmente fuerte',
  'Una experiencia deportiva más completa'
];

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 18 }
  }
};

const Espacios = () => {
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0 });

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
    <section className="relative isolate overflow-hidden bg-black text-white min-h-screen py-16 sm:py-20 lg:py-24">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_24%),linear-gradient(180deg,#050505_0%,#09090b_45%,#040404_100%)]" />

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
      <div className="pointer-events-none absolute top-[18%] -right-16 h-[30rem] w-[30rem] rounded-full bg-red-500/14 blur-3xl" />

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
        <div className="absolute left-1/2 top-[16%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-[16%] size-[44vmin] max-h-[420px] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/14" />

        <div className="absolute left-1/2 top-[16%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
          {[
            'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
            'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
            'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
            'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
          ].map((position, index) => (
            <div
              key={`orbit-${index}`}
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* ENCABEZADO */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-5xl text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
              Altos Roca Gym · Espacios
            </span>
          </div>

          <h2 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[0.92] uppercase tracking-[0.05em] text-white">
            Nuestros
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
              espacios
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70 max-w-3xl mx-auto">
            Un solo lugar, múltiples formas de vivir el movimiento. Gym, fútbol,
            pádel y una atmósfera diseñada para entrenar con energía.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'Gym', icon: FaDumbbell },
              { label: 'Fútbol', icon: FaFutbol },
              { label: 'Pádel', icon: GiTennisRacket }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md"
                >
                  <Icon className="text-red-300" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* BLOQUE INFO */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="grid grid-cols-1 gap-6 xl:grid-cols-12 mb-10"
        >
          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] xl:col-span-5">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
            <div className="absolute -top-16 right-6 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-red-500/18 bg-red-500/10 text-red-300">
                <FaFireAlt className="text-xl" />
              </div>

              <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                Altos Roca Experience
              </div>

              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Un espacio más completo
              </h3>

              <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/72">
                La propuesta de Altos Roca no se limita a una sala. Es una
                experiencia pensada para quienes buscan entrenamiento, juego,
                comunidad y un entorno que inspire a volver.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] xl:col-span-7">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {beneficios.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-4"
                >
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaCheckCircle className="text-sm" />
                  </div>
                  <span className="text-sm sm:text-base text-white/80 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* GALERÍA */}
        <motion.div
          ref={contenedorRef}
          variants={containerVariants}
          initial="hidden"
          animate={estaVisible ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {imagenes.map((img, idx) => {
            const espacio = espaciosData[idx % espaciosData.length];

            return (
              <motion.article
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6, rotateX: -3, rotateY: 3 }}
                whileTap={{ scale: 0.995 }}
                transition={{
                  type: 'spring',
                  stiffness: 180,
                  damping: 18,
                  mass: 0.6
                }}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
              >
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
                <div className="absolute -top-12 right-4 h-28 w-28 rounded-full bg-red-500/10 blur-3xl" />

                <div className="relative aspect-[4/4.2] overflow-hidden border-b border-white/10 bg-black/25">
                  <img
                    src={img}
                    alt={`${espacio.titulo} ${idx + 1}`}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.55))]" />

                  <div className="absolute left-4 top-4 rounded-full border border-red-500/18 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100 backdrop-blur-md">
                    {espacio.badge}
                  </div>
                </div>

                <div className="relative z-10 p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
                        {espacio.titulo}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/70">
                        {espacio.descripcion}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                      {espacio.badge === 'Fútbol' ? (
                        <FaFutbol className="text-sm" />
                      ) : espacio.badge === 'Pádel' ? (
                        <GiTennisRacket className="text-sm" />
                      ) : (
                        <FaDumbbell className="text-sm" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-10"
        >
          <NavLink to="/turnos" className="inline-flex">
            <button className="btn-logo btn-logo--lg min-w-[250px]">
              <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                Quiero conocer Altos Roca
                <FaArrowRight className="text-sm" />
              </span>
            </button>
          </NavLink>
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

export default Espacios;
