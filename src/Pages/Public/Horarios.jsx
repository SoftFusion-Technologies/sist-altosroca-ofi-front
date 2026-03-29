import {
  FaMapMarkerAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaRegClock,
  FaCopy,
  FaMapMarkedAlt,
  FaArrowRight,
  FaWhatsapp
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useCallback } from 'react';
import { NavLink } from 'react-router-dom';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 2.0
 *
 * Descripción:
 * Página de horarios adaptada para Altos Roca Gym.
 * Se reemplaza la identidad anterior por el lenguaje visual rojo/negro
 * del proyecto, actualizando dirección, horarios y CTA principal.
 *
 * Tema: Página de Horarios - Landing pública
 * Capa: Frontend
 */

const Horarios = () => {
  const schedule = [
    {
      icon: <FaCalendarWeek size={28} />,
      days: 'Lunes a Viernes',
      time: '08:00 – 22:30 hs',
      detail: 'Amplio rango horario para entrenar a tu ritmo.'
    },
    {
      icon: <FaCalendarDay size={28} />,
      days: 'Sábados',
      time: '15:00 – 19:00 hs',
      detail: 'Una ventana ideal para cerrar la semana en movimiento.'
    }
  ];

  const address = 'Av. Peru y Sarmiento, Tafi Viejo, Tucuman, Argentina';
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const whatsappHref = 'https://wa.me/543814480898';

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // noop
    }
  }, []);

  const dumbbellURI = encodeURI(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <g fill='none' stroke='rgba(255,255,255,0.11)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
        <line x1='10' y1='32' x2='54' y2='32' />
        <rect x='4' y='22' width='8' height='20' rx='2' ry='2' fill='rgba(239,68,68,0.09)'/>
        <rect x='12' y='24' width='8' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.04)'/>
        <rect x='52' y='22' width='8' height='20' rx='2' ry='2' fill='rgba(239,68,68,0.09)'/>
        <rect x='44' y='24' width='8' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.04)'/>
      </g>
    </svg>
  `);

  const container = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.18 }
    }
  };

  const cardPop = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 220, damping: 20 }
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white py-20 md:py-28">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_24%),linear-gradient(180deg,#050505_0%,#09090b_45%,#040404_100%)]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 100%)'
        }}
      />

      <div className="pointer-events-none absolute -top-20 -left-20 h-[28rem] w-[28rem] rounded-full bg-red-600/18 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-[30rem] w-[30rem] rounded-full bg-red-500/12 blur-3xl" />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[64vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/5 animate-[orbit_36s_linear_infinite]" />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '40px',
            height: '40px',
            backgroundImage: `url("data:image/svg+xml;utf8,${dumbbellURI}")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            filter: 'drop-shadow(0 0 10px rgba(239,68,68,0.15))'
          }}
        />
        <div
          className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
          style={{
            width: '34px',
            height: '34px',
            backgroundImage: `url("data:image/svg+xml;utf8,${dumbbellURI}")`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.12))'
          }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)'
        }}
      />

      <div className="absolute -top-12 left-0 w-full h-12" aria-hidden>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,120 C300,0 1140,240 1440,60 L1440,120 L0,120 Z"
            fill="url(#redGradTop)"
          />
          <defs>
            <linearGradient id="redGradTop" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#7f1d1d" stopOpacity="0.10" />
              <stop offset="0.5" stopColor="#ef4444" stopOpacity="0.20" />
              <stop offset="1" stopColor="#7f1d1d" stopOpacity="0.10" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
              Altos Roca Gym · Horarios
            </span>
          </div>

          <h1 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[0.92] uppercase tracking-[0.05em] text-white">
            Nuestros
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
              horarios
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70 max-w-3xl mx-auto">
            Organizá tu semana y elegí el mejor momento para entrenar en Altos
            Roca Gym.
          </p>
        </motion.div>

        <div className="relative rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] overflow-hidden">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[30px]"
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 30px rgba(239,68,68,0.05)'
            }}
          />

          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

          <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
            <div className="inline-flex items-center gap-2 text-sm text-white/72">
              <FaRegClock className="text-red-300 opacity-90" />
              <span>Zona: Tafí Viejo · Tucumán</span>
            </div>

            <div className="inline-flex flex-wrap items-center gap-3 text-sm">
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/86 hover:bg-red-500/10 hover:border-red-500/24 transition"
              >
                <FaMapMarkedAlt className="text-red-300" />
                Ver en Google Maps
              </a>

              <button
                onClick={() =>
                  copy(
                    `${address} · Lunes a Viernes: 08:00–22:30 hs · Sábados: 15:00–19:00 hs`
                  )
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-white/86 hover:bg-red-500/10 hover:border-red-500/24 transition"
              >
                <FaCopy className="text-red-300" />
                Copiar info
              </button>
            </div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-6 md:grid-cols-2 px-6 py-8"
          >
            {schedule.map((item, i) => (
              <motion.div
                key={i}
                variants={cardPop}
                whileHover={{ y: -6, rotateX: -4, rotateY: 4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="
                  group relative rounded-[24px] border border-white/10 bg-black/35
                  px-5 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.45)]
                  [transform-style:preserve-3d] overflow-hidden
                "
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-red-300/0 group-hover:ring-red-300/20 transition"
                />
                <span
                  aria-hidden
                  className="absolute -right-8 -top-8 size-16 rotate-45 bg-gradient-to-br from-red-900/50 to-black border border-white/10"
                />

                <div className="flex items-center gap-4">
                  <div className="grid place-items-center size-12 rounded-2xl border border-red-500/18 bg-red-500/10 text-red-200 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-white text-xl font-semibold tracking-tight">
                      {item.days}
                    </h3>
                    <p className="text-white/86 text-lg">{item.time}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm text-white/58 leading-relaxed">
                  {item.detail}
                </p>

                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-700 via-red-400 to-red-700 opacity-40 group-hover:opacity-75 transition-opacity duration-300 rounded-b-[24px]" />
              </motion.div>
            ))}
          </motion.div>

          <div className="border-t border-white/10 px-6 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-3 text-white mb-2">
                  <FaMapMarkerAlt className="text-red-300" />
                  <span className="text-lg sm:text-xl font-semibold">
                    Av. Perú y Sarmiento · Tafí Viejo
                  </span>
                </div>
                <p className="text-white/58 text-sm sm:text-base">
                  Un punto accesible para que puedas entrenar con comodidad.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex"
                >
                  <button className="btn-logo btn-logo--md min-w-[210px]">
                    <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                      Consultar por WhatsApp
                      <FaWhatsapp className="text-sm" />
                    </span>
                  </button>
                </a>

                <NavLink
                  to="/turnos"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    Reservar turno
                    <FaArrowRight className="text-xs text-red-300" />
                  </span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit { 
          to { transform: translate(-50%, -50%) rotate(360deg); } 
        }

        .animate-[orbit_36s_linear_infinite] { 
          animation: orbit 36s linear infinite; 
        }
      `}</style>
    </section>
  );
};

export default Horarios;
