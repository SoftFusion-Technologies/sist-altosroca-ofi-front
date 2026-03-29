import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import {
  FaArrowRight,
  FaDumbbell,
  FaFutbol,
  FaMapMarkerAlt,
  FaWhatsapp
} from 'react-icons/fa';
import { GiTennisRacket } from 'react-icons/gi';
import { MdSportsSoccer } from 'react-icons/md';
import Logo from '../img/Logo.webp';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Hero principal completamente rediseñado para Altos Roca Gym.
 * Se reemplaza el layout clásico izquierda/derecha por una composición
 * central inmersiva con cards flotantes, fondo deportivo con discos y
 * mancuernas orbitando, mayor foco en Gym + Fútbol + Pádel, y animaciones
 * más interactivas alineadas a la identidad rojo/negro del proyecto.
 *
 * Tema: Hero Section - Landing pública
 * Capa: Frontend
 */

const containerV = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08
    }
  }
};

const itemV = {
  hidden: { opacity: 0, y: 18, scale: 0.985 },
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

const floatingV = (delay = 0) => ({
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3.6,
      repeat: Infinity,
      ease: 'easeInOut',
      delay
    }
  }
});

const HeroSection = () => {
  const heroRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    const x = (px - 0.5) * 24;
    const y = (py - 0.5) * 18;

    setParallax({ x, y });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  const discFondo = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <g fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='2'>
        <circle cx='60' cy='60' r='44'/>
        <circle cx='60' cy='60' r='28'/>
        <circle cx='60' cy='60' r='10'/>
      </g>
      <g stroke='rgba(239,68,68,0.10)' stroke-width='1.5'>
        <line x1='60' y1='6' x2='60' y2='22'/>
        <line x1='60' y1='98' x2='60' y2='114'/>
        <line x1='6' y1='60' x2='22' y2='60'/>
        <line x1='98' y1='60' x2='114' y2='60'/>
      </g>
    </svg>
  `);

  const MancuernasRotando = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <g fill='none' stroke='rgba(255,255,255,0.78)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
        <line x1='10' y1='32' x2='54' y2='32' />
        <rect x='6' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(239,68,68,0.14)' stroke='rgba(255,255,255,0.55)'/>
        <rect x='12' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.07)'/>
        <rect x='52' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(239,68,68,0.14)' stroke='rgba(255,255,255,0.55)'/>
        <rect x='46' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.07)'/>
      </g>
    </svg>
  `);

  const floatingCards = [
    {
      id: 'gym',
      title: 'Gym',
      desc: 'Fuerza, energía y constancia.',
      icon: FaDumbbell,
      className: 'hidden lg:block absolute left-[4%] top-[18%] w-[220px]',
      factorX: -0.8,
      factorY: -0.55,
      delay: 0
    },
    {
      id: 'futbol',
      title: 'Fútbol',
      desc: 'Espacio para jugar y activar.',
      icon: MdSportsSoccer,
      className: 'hidden lg:block absolute right-[4%] top-[16%] w-[220px]',
      factorX: 0.9,
      factorY: -0.65,
      delay: 0.3
    },
    {
      id: 'padel',
      title: 'Pádel',
      desc: 'Movimiento, ritmo y competencia.',
      icon: GiTennisRacket,
      className: 'hidden lg:block absolute left-[10%] bottom-[14%] w-[240px]',
      factorX: -1.1,
      factorY: 0.8,
      delay: 0.6
    },
    {
      id: 'espacios',
      title: 'Más espacios',
      desc: 'Un solo lugar, múltiples experiencias.',
      icon: FaFutbol,
      className: 'hidden lg:block absolute right-[8%] bottom-[12%] w-[250px]',
      factorX: 1.05,
      factorY: 0.9,
      delay: 0.9
    }
  ];

  const chips = ['Gym', 'Fútbol', 'Pádel', 'Energía', 'Comunidad'];

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate overflow-hidden bg-black text-white min-h-[100svh]"
    >
      {/* Fondo base */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_26%),linear-gradient(180deg,#050505_0%,#0a0a0b_46%,#040404_100%)]" />

      {/* Patrón de discos */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${discFondo}")`,
          backgroundSize: '180px 180px',
          backgroundRepeat: 'repeat',
          transform: `translate(${parallax.x * -0.18}px, ${parallax.y * -0.18}px) rotate(4deg)`,
          transition: 'transform 180ms ease-out',
          maskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 32%, rgba(0,0,0,0.22) 74%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 32%, rgba(0,0,0,0.22) 74%, transparent 100%)'
        }}
      />

      {/* Glow rojo izquierdo */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-[28rem] w-[28rem] rounded-full bg-red-600/18 blur-3xl"
        style={{
          transform: `translate(${parallax.x * -0.8}px, ${parallax.y * -0.6}px)`,
          transition: 'transform 180ms ease-out'
        }}
      />

      {/* Glow rojo derecho */}
      <div
        className="pointer-events-none absolute top-[20%] -right-24 h-[32rem] w-[32rem] rounded-full bg-red-500/14 blur-3xl"
        style={{
          transform: `translate(${parallax.x * 0.7}px, ${parallax.y * 0.55}px)`,
          transition: 'transform 180ms ease-out'
        }}
      />

      {/* Grid técnico */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

      {/* Rings centrales */}
      <div
        className="pointer-events-none absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate(calc(-50% + ${parallax.x * 0.35}px), calc(-50% + ${parallax.y * 0.35}px))`,
          transition: 'transform 160ms ease-out'
        }}
      >
        <div className="relative h-[78vmin] w-[78vmin] max-h-[760px] max-w-[760px] rounded-full border border-white/10">
          <div className="absolute inset-[9%] rounded-full border border-red-500/18" />
          <div className="absolute inset-[20%] rounded-full border border-white/8" />
          <div className="absolute inset-[32%] rounded-full border border-red-500/12" />
        </div>
      </div>

      {/* Mancuernas orbitando */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[48%] size-[74vmin] max-h-[700px] max-w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_28s_linear_infinite]">
          {[
            'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
            'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
            'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
            'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
          ].map((position, index) => (
            <div
              key={`ring-1-${index}`}
              className={`absolute ${position}`}
              style={{
                width: '42px',
                height: '42px',
                backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.18))'
              }}
            />
          ))}
        </div>

        <div className="absolute left-1/2 top-[48%] size-[54vmin] max-h-[520px] max-w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_reverse_20s_linear_infinite]">
          {[
            'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
            'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2'
          ].map((position, index) => (
            <div
              key={`ring-2-${index}`}
              className={`absolute ${position}`}
              style={{
                width: '38px',
                height: '38px',
                backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.16))'
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating cards desktop */}
      {floatingCards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            variants={floatingV(card.delay)}
            animate="animate"
            className={card.className}
            style={{
              transform: `translate3d(${parallax.x * card.factorX}px, ${parallax.y * card.factorY}px, 0)`,
              transition: 'transform 180ms ease-out'
            }}
          >
            <div className="rounded-[26px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.34)] transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.06]">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/16 bg-red-500/10 text-red-300">
                  <Icon className="text-lg" />
                </div>

                <div>
                  <div className="text-sm font-black uppercase tracking-[0.14em] text-white">
                    {card.title}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-white/62">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Contenido central */}
      <div className="relative z-10 flex min-h-[100svh] items-center justify-center px-4 sm:px-6 lg:px-8 py-28">
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mx-auto flex w-full max-w-6xl flex-col items-center text-center"
        >
          <motion.div variants={itemV}>
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.26em] text-red-200/90">
                Altos Roca Gym · Tafí Viejo
              </span>
            </div>
          </motion.div>

          <motion.div
            variants={itemV}
            className="relative mt-8"
            style={{
              transform: `translate3d(${parallax.x * 0.38}px, ${parallax.y * 0.28}px, 0)`,
              transition: 'transform 180ms ease-out'
            }}
          >
            <div className="absolute inset-0 rounded-full bg-red-500/16 blur-3xl scale-[1.35]" />
            <img
              src={Logo}
              alt="Altos Roca Gym"
              className="relative mx-auto h-28 sm:h-32 md:h-36 lg:h-40 w-auto object-contain drop-shadow-[0_0_26px_rgba(239,68,68,0.30)]"
            />
          </motion.div>

          <motion.h1
            variants={itemV}
            className="titulo mt-8 max-w-5xl text-5xl sm:text-6xl md:text-7xl lg:text-[5.8rem] font-black uppercase leading-[0.92] tracking-[-0.04em]"
          >
            Más que un gym
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
              una experiencia
            </span>
            <span className="block text-white/92">para moverte en serio</span>
          </motion.h1>

          <motion.p
            variants={itemV}
            className="mt-6 max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-white/70"
          >
            Entrená, jugá y activá tu rutina en un solo lugar.
            <span className="text-white font-semibold"> Altos Roca Gym </span>
            reúne
            <span className="text-red-300 font-semibold">
              {' '}
              gimnasio, fútbol, pádel{' '}
            </span>
            y más espacios para vivir el movimiento con intensidad.
          </motion.p>

          <motion.div
            variants={itemV}
            className="mt-7 flex flex-wrap items-center justify-center gap-3"
          >
            {chips.map((chip, index) => (
              <motion.span
                key={chip}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.08 * index }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.08] hover:text-white"
              >
                {chip}
              </motion.span>
            ))}
          </motion.div>

          <motion.div
            variants={itemV}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4"
          >
            <NavLink to="/espacios" className="inline-flex">
              <button className="btn-logo btn-logo--lg min-w-[230px]">
                <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                  Ver espacios
                  <FaArrowRight className="text-sm" />
                </span>
              </button>
            </NavLink>
          </motion.div>

          <motion.div
            variants={itemV}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-white/62"
          >
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <FaMapMarkerAlt className="text-red-400 shrink-0" />
              <span>Av. Perú y Sarmiento · Tafí Viejo</span>
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <FaWhatsapp className="text-red-400 shrink-0" />
              <span>Turnos y consultas online</span>
            </div>
          </motion.div>

          {/* Cards mobile / tablet */}
          <motion.div
            variants={itemV}
            className="mt-12 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-2 lg:hidden gap-4"
          >
            {[
              {
                title: 'Gym',
                desc: 'Fuerza, disciplina y constancia.',
                icon: FaDumbbell
              },
              {
                title: 'Fútbol',
                desc: 'Movimiento y juego en un mismo lugar.',
                icon: MdSportsSoccer
              },
              {
                title: 'Pádel',
                desc: 'Ritmo, técnica y experiencia activa.',
                icon: GiTennisRacket
              },
              {
                title: 'Más espacios',
                desc: 'Una propuesta más amplia que un gym tradicional.',
                icon: FaFutbol
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-500/16 bg-red-500/10 text-red-300">
                      <Icon className="text-lg" />
                    </div>

                    <div className="text-left">
                      <div className="text-sm font-black uppercase tracking-[0.14em] text-white">
                        {item.title}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-white/62">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
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

export default HeroSection;
