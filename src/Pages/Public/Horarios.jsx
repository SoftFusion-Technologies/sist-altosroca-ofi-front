import {
  FaMapMarkerAlt,
  FaCalendarDay,
  FaCalendarWeek,
  FaRegClock,
  FaCopy,
  FaMapMarkedAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useCallback } from 'react';

const Horarios = () => {
  const schedule = [
    {
      icon: <FaCalendarWeek size={28} />,
      days: 'Lunes a Viernes',
      time: '07:00 – 22:00 hs'
    },
    {
      icon: <FaCalendarDay size={28} />,
      days: 'Sábados y Feriados',
      time: '10:00 – 17:00 hs'
    }
  ];

  const address = 'Lamadrid 986 - Barrio Sur, Tucumán';
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // noop
    }
  }, []);

  // SVG patrón de mancuerna (ultra tenue, para continuidad con el Hero)
  const dumbbellURI = encodeURI(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <g fill='none' stroke='rgba(255,255,255,0.11)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
        <line x1='10' y1='32' x2='54' y2='32' />
        <rect x='4' y='22' width='8' height='20' rx='2' ry='2' fill='rgba(255,255,255,0.06)'/>
        <rect x='12' y='24' width='8' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.04)'/>
        <rect x='52' y='22' width='8' height='20' rx='2' ry='2' fill='rgba(255,255,255,0.06)'/>
        <rect x='44' y='24' width='8' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.04)'/>
      </g>
    </svg>
  `);

  // Variantes de animación
  const container = {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, delayChildren: 0.4 }
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
      {/* Partículas + auroras + grid + noise (mismo lenguaje del Hero) */}
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-28 -left-24 size-[36rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]" />
        <div className="absolute -bottom-24 -right-20 size-[40rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 38%, rgba(0,0,0,0) 100%)'
        }}
      />
      {/* Mancuernas orbitando muy suaves */}
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
            filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.15))'
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
      {/* Noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)'
        }}
      />

      {/* Divisor superior metálico (continúa del Hero) */}
      <div className="absolute -top-12 left-0 w-full h-12" aria-hidden>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,120 C300,0 1140,240 1440,60 L1440,120 L0,120 Z"
            fill="url(#silverGrad2)"
          />
          <defs>
            <linearGradient id="silverGrad2" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#e5e7eb" stopOpacity="0.10" />
              <stop offset="0.5" stopColor="#9ca3af" stopOpacity="0.18" />
              <stop offset="1" stopColor="#d1d5db" stopOpacity="0.10" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 mt-10">
        {/* Cabecera */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-4 sm:mb-6 leading-tight font-extrabold tracking-tight">
            NUESTROS{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500">
              HORARIOS
            </span>
          </h1>
          <p className="mt-3 text-gray-300">
            Siempre abiertos para ayudarte a alcanzar tu mejor versión.
          </p>
        </motion.div>

        {/* Tarjeta principal “glass” */}
        <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
          {/* borde de luz animado */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gray-300/0"
            style={{
              boxShadow:
                'inset 0 0 0 1px rgba(255,255,255,0.06), 0 0 30px rgba(255,255,255,0.06)'
            }}
          />

          {/* Top meta row */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-6">
            <div className="inline-flex items-center gap-2 text-sm text-gray-300">
              <FaRegClock className="opacity-80" />
              <span>Zona: Barrio Sur - Tucumán</span>
            </div>
            <div className="inline-flex items-center gap-3 text-sm">
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 transition"
              >
                <FaMapMarkedAlt />
                Ver en Google Maps
              </a>
              <button
                onClick={() => copy(`${address} · LV: 07–22 · S/F: 10–17`)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 transition"
              >
                <FaCopy />
                Copiar info
              </button>
            </div>
          </div>

          {/* Grid de horarios */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
            className="grid gap-6 md:grid-cols-2 px-6 py-8"
          >
            {schedule.map((item, i) => (
              <motion.div
                key={i}
                variants={cardPop}
                whileHover={{ y: -6, rotateX: -4, rotateY: 4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="
                  group relative rounded-xl border border-white/10 bg-neutral-900/70
                  px-5 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.45)]
                  [transform-style:preserve-3d] overflow-hidden
                "
              >
                {/* ribete metálico */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-gray-300/0 group-hover:ring-gray-300/20 transition"
                />
                {/* “edge light” */}
                <span
                  aria-hidden
                  className="absolute -right-8 -top-8 size-16 rotate-45 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700"
                />

                <div className="flex items-center gap-4">
                  <div className="grid place-items-center size-12 rounded-lg border border-white/10 bg-white/5 text-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-semibold tracking-tight">
                      {item.days}
                    </h3>
                    <p className="text-gray-300 text-lg">{item.time}</p>
                  </div>
                </div>

                {/* línea base plata */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 group-hover:opacity-70 transition-opacity duration-300 rounded-b-xl" />
              </motion.div>
            ))}
          </motion.div>

          {/* Footer: ubicación grande */}
          <div className="border-t border-white/10 px-6 py-6 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-200 mb-2">
              <FaMapMarkerAlt className="text-gray-200" />
              <span className="text-lg">{address}</span>
            </div>
            <p className="font-semibold text-xl text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400">
              #DaleVeniAEntrenar 💪
            </p>
          </div>
        </div>

        {/* CTA sticky fantasma (aparece al hacer scroll hacia esta sección) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="/clase-prueba"
            className="px-6 py-3 font-bold text-gray-900 rounded-md text-lg
                       bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                       transition-transform duration-200 hover:brightness-110 hover:-translate-y-[2px] active:translate-y-0
                       shadow-[0_0_18px_rgba(255,255,255,0.55)]"
          >
            SOLICITÁ TU CLASE DE PRUEBA
          </a>
        </motion.div>
      </div>

      {/* Keyframes locales (reuse con Hero) */}
      <style>{`
        @keyframes orbit { to { transform: translate(-50%, -50%) rotate(360deg); } }
        .animate-[orbit_36s_linear_infinite] { animation: orbit 36s linear infinite; }
      `}</style>
    </section>
  );
};

export default Horarios;
