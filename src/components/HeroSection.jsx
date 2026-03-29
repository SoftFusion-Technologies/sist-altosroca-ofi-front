import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { NavLink } from "react-router-dom";
import routes from "../Routes/Rutas";

// Variantes de entrada y del martillazo del HeroSection
const enter = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 20 },
  },
};

const smash = {
  rest: {
    scale: 1,
    rotate: 0,
    letterSpacing: "0.02em",
    filter: "brightness(1)",
  },
  hit: {
    scale: [1, 1.06, 0.995, 1],
    rotate: [0, -0.6, 0.3, 0],
    letterSpacing: ["0.02em", "0.08em", "0.03em", "0.02em"],
    filter: [
      "brightness(1)",
      "brightness(1.35)",
      "brightness(1.05)",
      "brightness(1)",
    ],
    transition: { duration: 0.6, times: [0, 0.2, 0.5, 1], ease: "easeOut" },
  },
};

// Componente para la sección principal (Hero)
const HeroSection = () => {
  // ⬇️ Definimos la ref y el flag de visibilidad
  const hitRef = useRef(null);
  const isIn = useInView(hitRef, { once: true, amount: 0.6 });

  const discFondo = encodeURI(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <g fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='2'>
        <circle cx='50' cy='50' r='40'/>
        <circle cx='50' cy='50' r='24'/>
        <circle cx='50' cy='50' r='8'/>
      </g>
      <g stroke='rgba(255,255,255,0.06)'>
        <line x1='50' y1='5' x2='50' y2='20'/>
        <line x1='50' y1='80' x2='50' y2='95'/>
        <line x1='5' y1='50' x2='20' y2='50'/>
        <line x1='80' y1='50' x2='95' y2='50'/>
      </g>
    </svg>
  `);

  const MancuernasRotando = encodeURI(`
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
    <g fill='none' stroke='rgba(255,255,255,0.75)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
      <!-- barra -->
      <line x1='10' y1='32' x2='54' y2='32' />
      <!-- discos izquierda -->
      <rect x='6' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.6)'/>
      <rect x='12' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
      <!-- discos derecha -->
      <rect x='52' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(255,255,255,0.12)' stroke='rgba(255,255,255,0.6)'/>
      <rect x='46' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
    </g>
  </svg>
`);
  return (
    <section className="relative isolate overflow-hidden bg-black text-white min-h-[88vh] md:min-h-[92vh]">
      {/* GYM LAYER 1: patrón de discos (repetido) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rotate-6 opacity-50"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${discFondo}")`,
          backgroundSize: "220px 220px",
          backgroundRepeat: "repeat",
          filter: "blur(0.3px)",
          maskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* GYM LAYER 2: kettlebell gigante sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-28 -bottom-36 w-[62vmin] h-[62vmin] opacity-30 blur-2xl"
        style={{
          background:
            "conic-gradient(from 210deg at 50% 45%, rgba(255,255,255,0.12), rgba(255,255,255,0.04), rgba(0,0,0,0.0))",
          clipPath:
            'path("M 50 10 C 34 10 26 20 26 30 C 26 37 31 43 38 45 C 28 50 20 60 20 72 C 20 87 34 98 50 98 C 66 98 80 87 80 72 C 80 60 72 50 62 45 C 69 43 74 37 74 30 C 74 20 66 10 50 10 Z")',
        }}
      />

      {/* Capa aurora + spotlight + grid + órbitas + noise (lo tuyo “wow”) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-20 -left-24 size-[38rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.14),rgba(6,182,212,0.12),rgba(99,102,241,0.12),transparent,rgba(6,182,212,0.12))]" />
        <div className="absolute -bottom-24 -right-20 size-[42rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_25%,rgba(255,255,255,0.16),transparent_70%)]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* orbitas que giran descomentar si quedan bien */}
      {/* <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_28s_linear_infinite]" />
        <div className="absolute left-1/2 top-1/2 size-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_36s_linear_infinite_reverse]" />
      </div> */}

      {/* ÓRBITAS CON MANCUERNAS (reemplaza el bloque de órbitas anterior) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Anillo guía tenue */}
        <div className="absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />

        {/* Anillo grande con 4 mancuernas (giro horario) */}
        <div className="absolute left-1/2 top-1/2 size-[72vmin] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
          {/* Top */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "42px",
              height: "42px",
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.18))",
              transform: "translate(-50%,-50%) rotate(20deg)",
            }}
          />
          {/* Right */}
          <div
            className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2"
            style={{
              width: "42px",
              height: "42px",
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.18))",
              transform: "translate(50%,-50%) rotate(20deg)",
            }}
          />
          {/* Bottom */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"
            style={{
              width: "42px",
              height: "42px",
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.18))",
              transform: "translate(-50%,50%) rotate(20deg)",
            }}
          />
          {/* Left */}
          <div
            className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "42px",
              height: "42px",
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 12px rgba(255,255,255,0.18))",
              transform: "translate(-50%,-50%) rotate(20deg)",
            }}
          />
        </div>

        {/* Anillo chico con 2 mancuernas (giro antihorario) */}
        <div className="absolute left-1/2 top-1/2 size-[54vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 animate-[orbit_reverse_36s_linear_infinite]">
          {/* Top */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: "36px",
              height: "36px",
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.16))",
              transform: "translate(-50%,-50%) rotate(20deg)",
            }}
          />
          {/* Bottom */}
          <div
            className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2"
            style={{
              width: "36px",
              height: "36px",
              backgroundImage: `url("data:image/svg+xml;utf8,${MancuernasRotando}")`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.16))",
              transform: "translate(-50%,50%) rotate(20deg)",
            }}
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)",
        }}
      />

      {/* CONTENIDO */}
      <div className="relative z-10 text-center px-4 py-36 md:py-48 lg:py-56 max-w-6xl mx-auto">
        <motion.h1
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8 leading-[1.05]"
        >
          FORJA TU{" "}
          <motion.span
            ref={hitRef}
            variants={smash}
            initial="rest"
            animate={isIn ? "hit" : "rest"}
            className="relative inline-block align-baseline"
          >
            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 drop-shadow-[0_2px_24px_rgba(255,255,255,0.18)]">
              MEJOR VERSIÓN
            </span>
            <span
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-gray-300/50"
              style={{ animation: "pulse-ring 2.5s ease-out infinite" }}
            />
          </motion.span>
        </motion.h1>

        <motion.p
          variants={enter}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.05 }}
          className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
        >
          En INFINITY, no solo levantás pesas: elevás tu potencial. Sumate a la
          comunidad y transformá tu rendimiento.
        </motion.p>

        {routes
          .filter((r) => r.name === "Clase de Prueba")
          .map((r) => (
            <motion.div
              key={r.name}
              variants={enter}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center"
            >
              <NavLink to={r.path}>
                <button
                  className="px-8 py-3 font-bold text-gray-900 rounded-md text-lg
                             bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                             transition-transform duration-200 hover:brightness-110
                             hover:-translate-y-[1px] active:translate-y-0
                             shadow-[0_0_14px_rgba(255,255,255,0.6)]"
                >
                  SOLICITÁ TU CLASE DE PRUEBA
                </button>
              </NavLink>
            </motion.div>
          ))}
        {/* Chips flotantes (detalle “wow”) */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-300">
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            Rutinas inteligentes
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            Seguimiento en tiempo real
          </span>
          <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            Coach digital
          </span>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          70%  { transform: translate(-50%, -50%) scale(3);   opacity: 0;   }
          100% { opacity: 0; }
        }
        @keyframes orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes orbit_reverse {
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }
        .animate-[orbit_28s_linear_infinite] {
          animation: orbit 28s linear infinite;
        }
        .animate-[orbit_36s_linear_infinite_reverse] {
          animation: orbit_reverse 36s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
