import React, { useMemo, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FaDumbbell,
  FaCheck,
  FaStar,
  FaFire,
  FaArrowRight,
  FaClock,
  FaCrown
} from 'react-icons/fa';
import ParticlesBackground from './ParticlesBackground';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Rediseño completo de la sección de planes para Altos Roca Gym.
 * Se reemplaza la grilla tradicional por una propuesta visual más moderna,
 * inmersiva, animada y responsive, alineada a la identidad rojo/negro
 * del hero y del resto de la landing.
 *
 * Tema: Planes de precios - Landing pública
 * Capa: Frontend
 */

// Array de imágenes del gimnasio
const imagenesGimnasio = Array.from(
  { length: 9 },
  (_, i) => new URL(`../img/Gimnasio/img-${i + 1}.webp`, import.meta.url).href
);

function getRandomUniqueImages(arr, count) {
  const arrCopy = [...arr];
  const result = [];

  while (result.length < count && arrCopy.length > 0) {
    const idx = Math.floor(Math.random() * arrCopy.length);
    result.push(arrCopy[idx]);
    arrCopy.splice(idx, 1);
  }

  return result;
}

const formatearARS = (valor) =>
  new Intl.NumberFormat('es-AR').format(Number(valor || 0));

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
  hidden: { opacity: 0, y: 24, scale: 0.985 },
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

const PlanesDePrecios = () => {
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0.15 });

  const precioMensual = 40000;
  const precioTrimestralBase = precioMensual * 3;
  const precioSemestralBase = precioMensual * 6;

  const imagenesRandom = useMemo(
    () => getRandomUniqueImages(imagenesGimnasio, 3),
    []
  );

  const planes = [
    {
      titulo: 'Mensual',
      subtitulo: 'Empezá sin complicarte',
      total: 40000,
      duracionMeses: 1,
      detallePeriodo: '1 mes',
      descripcion:
        'La opción ideal para arrancar, conocer el espacio y empezar a construir constancia.',
      beneficios: [
        'Acceso al gimnasio',
        'Sin matrícula de ingreso',
        'Acompañamiento en sala',
        'Uso libre de equipos'
      ],
      popular: false,
      ahorro: null,
      icon: FaDumbbell,
      etiqueta: 'Flexible',
      accent: 'from-red-800 via-red-600 to-red-400',
      soft: 'border-red-500/22 bg-red-500/10 text-red-200 shadow-[0_0_26px_rgba(239,68,68,0.12)]',
      cta: 'Quiero este plan'
    },
    {
      titulo: 'Trimestral',
      subtitulo: 'El equilibrio ideal',
      total: 105000,
      duracionMeses: 3,
      detallePeriodo: '3 meses',
      descripcion:
        'Una propuesta pensada para ver progreso real, sostener el ritmo y entrenar con más estructura.',
      beneficios: [
        'Todo lo del plan mensual',
        'Rutina personalizada',
        'Seguimiento de progreso',
        'Mejor relación precio/tiempo',
        'Mayor continuidad de entrenamiento'
      ],
      popular: true,
      ahorro: precioTrimestralBase - 105000,
      icon: FaStar,
      etiqueta: 'Más elegido',
      accent: 'from-red-700 via-red-500 to-orange-400',
      soft: 'border-orange-400/22 bg-orange-500/10 text-orange-100 shadow-[0_0_26px_rgba(249,115,22,0.12)]',
      cta: 'Empezar con este'
    },
    {
      titulo: 'Semestral',
      subtitulo: 'Para una evolución seria',
      total: 210000,
      duracionMeses: 6,
      detallePeriodo: '6 meses',
      descripcion:
        'Un plan para quienes quieren comprometerse, sostener el proceso y aprovechar mejor cada etapa.',
      beneficios: [
        'Todo lo del plan trimestral',
        'Mayor continuidad en objetivos',
        'Evaluación de progreso periódica',
        'Más tiempo para resultados visibles',
        'Mejor aprovechamiento económico'
      ],
      popular: false,
      ahorro: precioSemestralBase - 210000,
      icon: FaFire,
      etiqueta: 'Más ahorro',
      accent: 'from-zinc-700 via-red-500 to-red-300',
      soft: 'border-zinc-400/22 bg-zinc-500/10 text-zinc-100 shadow-[0_0_26px_rgba(161,161,170,0.12)]',
      cta: 'Elegir este plan'
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

  return (
    <section
      ref={contenedorRef}
      className="relative isolate overflow-hidden bg-black text-white py-20 sm:py-24 lg:py-30"
    >
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_26%),linear-gradient(180deg,#050505_0%,#0a0a0b_46%,#040404_100%)]" />

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
        <div className="absolute left-1/2 top-[24%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-[24%] size-[44vmin] max-h-[420px] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/14" />

        <div className="absolute left-1/2 top-[24%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerV}
          initial="hidden"
          animate={estaVisible ? 'show' : 'hidden'}
        >
          <motion.div
            variants={itemV}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
                Altos Roca Gym · Membresías
              </span>
            </div>

            <h2 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[0.92] uppercase tracking-[0.05em] text-white">
              Elegí tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
                mejor plan
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70">
              Distintas formas de entrenar con continuidad, según tu momento,
              tus objetivos y el nivel de compromiso que querés asumir.
            </p>
          </motion.div>

          <motion.div
            variants={itemV}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              'Acceso al gym',
              'Acompañamiento en sala',
              'Opciones flexibles',
              'Más ahorro en planes largos'
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.08] hover:text-white"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          <div className="mt-14 grid grid-cols-1 gap-6 xl:grid-cols-3 xl:items-stretch">
            {planes.map((plan, indice) => {
              const IconoPlan = plan.icon;
              const imgFondo = imagenesRandom[indice];
              const equivalenteMensual = Math.round(
                plan.total / plan.duracionMeses
              );

              return (
                <motion.article
                  key={plan.titulo}
                  variants={itemV}
                  whileHover={{
                    y: -6,
                    rotateX: plan.popular ? -2 : -3,
                    rotateY: plan.popular ? 2 : 3
                  }}
                  whileTap={{ scale: 0.995 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                    mass: 0.6
                  }}
                  className={[
                    'group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] [transform-style:preserve-3d]',
                    plan.popular
                      ? 'xl:-translate-y-4 xl:scale-[1.03] shadow-[0_28px_80px_rgba(0,0,0,0.50)]'
                      : ''
                  ].join(' ')}
                >
                  <img
                    src={imgFondo}
                    alt={`Plan ${plan.titulo}`}
                    className="absolute inset-0 h-full w-full object-cover object-center opacity-[0.12] pointer-events-none select-none"
                    style={{
                      filter: 'blur(1.6px) saturate(1.05) contrast(1.02)'
                    }}
                    aria-hidden
                  />

                  <div
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${plan.accent}`}
                  />

                  <div className="absolute -top-16 right-6 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />
                  <div className="absolute -bottom-16 left-6 h-36 w-36 rounded-full bg-red-500/8 blur-3xl" />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[30px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  />

                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 }}
                      className="absolute right-5 top-5 z-20"
                    >
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-red-700 via-red-500 to-orange-400 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(0,0,0,0.26)]">
                        <FaCrown className="text-[10px]" />
                        Más elegido
                      </div>
                    </motion.div>
                  )}

                  <div className="relative z-10 flex h-full flex-col p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={[
                          'flex h-14 w-14 items-center justify-center rounded-[20px] border',
                          plan.soft
                        ].join(' ')}
                      >
                        <IconoPlan className="text-xl" />
                      </div>

                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62">
                        {plan.etiqueta}
                      </span>
                    </div>

                    <div className="mt-6">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                        Altos Roca Gym
                      </div>

                      <h3 className="mt-2 text-3xl sm:text-4xl font-bignoodle uppercase tracking-[0.05em] text-white">
                        Plan {plan.titulo}
                      </h3>

                      <p className="mt-2 text-sm sm:text-base text-white/62">
                        {plan.subtitulo}
                      </p>
                    </div>

                    <div className="mt-6 rounded-[24px] border border-white/10 bg-black/28 p-5">
                      <div className="flex items-end gap-3">
                        <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                          ${formatearARS(plan.total)}
                        </span>
                        <span className="pb-1 text-sm uppercase tracking-[0.14em] text-white/50">
                          total
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-red-300 text-xs" />
                          <span>{plan.detallePeriodo}</span>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/66">
                          Equivale a ${formatearARS(equivalenteMensual)}/mes
                        </span>
                      </div>

                      {plan.ahorro ? (
                        <div className="mt-3 inline-flex rounded-full border border-emerald-400/18 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                          Ahorrás ${formatearARS(plan.ahorro)}
                        </div>
                      ) : (
                        <div className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/56">
                          Ideal para empezar
                        </div>
                      )}
                    </div>

                    <p className="mt-6 text-sm sm:text-base leading-relaxed text-white/74">
                      {plan.descripcion}
                    </p>

                    <div className="mt-6 space-y-3 flex-1">
                      {plan.beneficios.map((beneficio, idx) => (
                        <motion.div
                          key={beneficio}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.14 + idx * 0.05 }}
                          className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:border-red-500/22 hover:bg-red-500/[0.05]"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                            <FaCheck className="text-xs" />
                          </div>

                          <span className="text-sm leading-relaxed text-white/82">
                            {beneficio}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-7">
                      <NavLink to="/turnos" className="block w-full">
                        {plan.popular ? (
                          <button className="btn-logo btn-logo--lg w-full">
                            <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                              {plan.cta}
                              <FaArrowRight className="text-sm" />
                            </span>
                          </button>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                          >
                            <span className="inline-flex items-center justify-center gap-2">
                              {plan.cta}
                              <FaArrowRight className="text-xs" />
                            </span>
                          </motion.button>
                        )}
                      </NavLink>
                    </div>
                  </div>
                </motion.article>
              );
            })}
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

export default PlanesDePrecios;
