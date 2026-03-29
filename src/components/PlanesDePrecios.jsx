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
 * Versión: 4.0
 *
 * Descripción:
 * Rediseño visual de la sección de planes para hacerla más luminosa,
 * más compacta y mejor equilibrada en responsive.
 * Se reducen alturas visuales, se simplifican bloques internos y se
 * agrega mayor brillo premium en fondos, bordes, badges y CTA.
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
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.06
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
        'Ideal para arrancar, conocer el espacio y empezar a construir constancia.',
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
      accent: 'from-rose-600 via-red-500 to-orange-300',
      glow: 'shadow-[0_18px_55px_rgba(239,68,68,0.16)]',
      badge:
        'border-red-400/25 bg-red-500/12 text-red-100 shadow-[0_0_28px_rgba(239,68,68,0.12)]',
      cta: 'Quiero este plan'
    },
    {
      titulo: 'Trimestral',
      subtitulo: 'El equilibrio ideal',
      total: 105000,
      duracionMeses: 3,
      detallePeriodo: '3 meses',
      descripcion:
        'Una opción pensada para ver progreso real y sostener mejor el ritmo.',
      beneficios: [
        'Todo lo del plan mensual',
        'Rutina personalizada',
        'Seguimiento de progreso',
        'Mejor relación precio/tiempo',
        'Mayor continuidad'
      ],
      popular: true,
      ahorro: precioTrimestralBase - 105000,
      icon: FaStar,
      etiqueta: 'Más elegido',
      accent: 'from-red-700 via-red-500 to-amber-300',
      glow: 'shadow-[0_24px_70px_rgba(239,68,68,0.24)]',
      badge:
        'border-orange-300/25 bg-orange-400/14 text-orange-50 shadow-[0_0_30px_rgba(251,146,60,0.16)]',
      cta: 'Empezar con este'
    },
    {
      titulo: 'Semestral',
      subtitulo: 'Para una evolución seria',
      total: 210000,
      duracionMeses: 6,
      detallePeriodo: '6 meses',
      descripcion:
        'Pensado para quienes buscan continuidad, resultados y mejor ahorro.',
      beneficios: [
        'Todo lo del plan trimestral',
        'Evaluación de progreso',
        'Más tiempo para resultados',
        'Mayor aprovechamiento económico'
      ],
      popular: false,
      ahorro: precioSemestralBase - 210000,
      icon: FaFire,
      etiqueta: 'Más ahorro',
      accent: 'from-fuchsia-700 via-red-500 to-red-300',
      glow: 'shadow-[0_18px_55px_rgba(244,63,94,0.16)]',
      badge:
        'border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-50 shadow-[0_0_28px_rgba(217,70,239,0.12)]',
      cta: 'Elegir este plan'
    }
  ];

  return (
    <section
      ref={contenedorRef}
      className="relative isolate overflow-hidden bg-[#050505] py-16 text-white sm:py-20"
    >
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.24),transparent_26%),linear-gradient(180deg,#070707_0%,#0b0b0d_46%,#050505_100%)]" />

      <div className="pointer-events-none absolute -top-12 left-[10%] h-72 w-72 rounded-full bg-red-500/18 blur-3xl" />
      <div className="pointer-events-none absolute top-[20%] right-[8%] h-80 w-80 rounded-full bg-orange-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-400/8 blur-3xl" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

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
            <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.07] px-4 py-2 backdrop-blur-md shadow-[0_0_34px_rgba(255,255,255,0.04)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 shadow-[0_0_18px_rgba(248,113,113,0.95)]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-100/90 sm:text-xs">
                Altos Roca Gym · Membresías
              </span>
            </div>

            <h2 className="mt-6 font-bignoodle text-5xl uppercase leading-[0.92] tracking-[0.05em] text-white sm:text-6xl md:text-7xl">
              Elegí tu
              <span className="block bg-gradient-to-r from-red-300 via-white to-red-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,255,255,0.18)]">
                mejor plan
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/76 sm:text-lg">
              Distintas opciones para entrenar con continuidad, más comodidad y
              mejor relación entre tiempo, progreso y ahorro.
            </p>
          </motion.div>

          <motion.div
            variants={itemV}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            {[
              'Acceso al gym',
              'Planes flexibles',
              'Más ahorro en planes largos',
              'Seguimiento y continuidad'
            ].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/14 bg-white/[0.07] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/86 backdrop-blur-md transition-all duration-300 hover:border-red-400/28 hover:bg-red-500/[0.10] hover:text-white sm:text-xs"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6">
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
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                    mass: 0.7
                  }}
                  className={[
                    'group relative overflow-hidden rounded-[28px] border border-white/14 bg-white/[0.09] backdrop-blur-2xl',
                    plan.glow,
                    plan.popular
                      ? 'ring-1 ring-orange-300/22 lg:-translate-y-2'
                      : 'ring-1 ring-white/6'
                  ].join(' ')}
                >
                  <img
                    src={imgFondo}
                    alt={`Plan ${plan.titulo}`}
                    className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover object-center opacity-[0.16]"
                    style={{
                      filter: 'blur(1px) saturate(1.06) brightness(0.9)'
                    }}
                    aria-hidden
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.02)_24%,rgba(0,0,0,0.08)_100%)]" />
                  <div
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${plan.accent}`}
                  />
                  <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-white/12 blur-2xl" />
                  <div className="pointer-events-none absolute left-6 top-6 h-20 w-20 rounded-full bg-red-400/10 blur-2xl" />

                  {plan.popular && (
                    <div className="absolute right-4 top-4 z-20">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-gradient-to-r from-red-700 via-red-500 to-orange-400 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-[0_14px_28px_rgba(239,68,68,0.28)]">
                        <FaCrown className="text-[10px]" />
                        Más elegido
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className={[
                          'flex h-12 w-12 items-center justify-center rounded-[18px] border',
                          plan.badge
                        ].join(' ')}
                      >
                        <IconoPlan className="text-lg" />
                      </div>

                      <span className="rounded-full border border-white/12 bg-white/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/75">
                        {plan.etiqueta}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="text-[11px] uppercase tracking-[0.18em] text-red-100/84">
                        Altos Roca Gym
                      </div>

                      <h3 className="mt-2 font-bignoodle text-3xl uppercase tracking-[0.05em] text-white sm:text-[2.1rem]">
                        Plan {plan.titulo}
                      </h3>

                      <p className="mt-1 text-sm text-white/68 sm:text-base">
                        {plan.subtitulo}
                      </p>
                    </div>

                    <div className="mt-5 rounded-[22px] border border-white/12 bg-white/[0.08] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.10)]">
                      <div className="flex items-end gap-3">
                        <span className="text-4xl font-black tracking-tight text-white sm:text-[2.8rem]">
                          ${formatearARS(plan.total)}
                        </span>
                        <span className="pb-1 text-xs uppercase tracking-[0.14em] text-white/56 sm:text-sm">
                          total
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-white/68">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-xs text-red-200" />
                          <span>{plan.detallePeriodo}</span>
                        </div>

                        <span className="rounded-full border border-white/12 bg-black/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/74">
                          ${formatearARS(equivalenteMensual)}/mes
                        </span>
                      </div>

                      <div className="mt-3">
                        {plan.ahorro ? (
                          <div className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/12 px-3 py-1 text-[11px] font-semibold text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.12)]">
                            Ahorrás ${formatearARS(plan.ahorro)}
                          </div>
                        ) : (
                          <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold text-white/66">
                            Ideal para empezar
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 text-sm leading-relaxed text-white/78 sm:text-[15px]">
                      {plan.descripcion}
                    </p>

                    <div className="mt-5 grid gap-2.5">
                      {plan.beneficios.map((beneficio) => (
                        <div
                          key={beneficio}
                          className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 transition-all duration-300 hover:border-red-400/22 hover:bg-red-500/[0.06]"
                        >
                          <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-500/14 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.12)]">
                            <FaCheck className="text-[10px]" />
                          </div>

                          <span className="text-sm leading-relaxed text-white/84">
                            {beneficio}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <NavLink to="/turnos" className="block w-full">
                        {plan.popular ? (
                          <button className="w-full rounded-2xl bg-gradient-to-r from-red-700 via-red-500 to-orange-400 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(239,68,68,0.32)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_22px_56px_rgba(239,68,68,0.38)]">
                            <span className="inline-flex items-center justify-center gap-2">
                              {plan.cta}
                              <FaArrowRight className="text-sm" />
                            </span>
                          </button>
                        ) : (
                          <button className="w-full rounded-2xl border border-white/14 bg-white/[0.08] px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-red-400/28 hover:bg-red-500/[0.10] hover:text-white">
                            <span className="inline-flex items-center justify-center gap-2">
                              {plan.cta}
                              <FaArrowRight className="text-xs" />
                            </span>
                          </button>
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
    </section>
  );
};

export default PlanesDePrecios;
