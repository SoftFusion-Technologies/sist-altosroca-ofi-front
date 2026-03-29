import React from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import { FaDumbbell, FaUsers, FaAward } from "react-icons/fa";

// Variants para el pop-up y el stagger del FeaturesSection
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.6 },
  },
};

const pop = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 20, mass: 0.6 },
  },
};


const FeaturesSection = () => {
  const features = [
    {
      icon: <FaDumbbell size={28} />,
      title: "Equipamiento Moderno",
      description: "Máquinas de última generación con mantenimiento al día.",
    },
    {
      icon: <FaUsers size={28} />,
      title: "Comunidad Activa",
      description: "Ambiente enfocado, respeto por el proceso y progreso real.",
    },
    {
      icon: <FaAward size={28} />,
      title: "Coaches Certificados",
      description: "Metodologías probadas y seguimiento técnico cercano.",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-black pt-24 pb-28 px-6 -mt-8">
      {/* DIVISOR entre Hero y Features (onda metálica) */}
      <div className="absolute -top-12 left-0 w-full h-12" aria-hidden>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d="M0,120 C300,0 1140,240 1440,60 L1440,120 L0,120 Z"
            fill="url(#silverGrad)"
          />
          <defs>
            <linearGradient id="silverGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#e5e7eb" stopOpacity="0.10" />
              <stop offset="0.5" stopColor="#9ca3af" stopOpacity="0.18" />
              <stop offset="1" stopColor="#d1d5db" stopOpacity="0.10" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* CAPAS: aurora + grid + noise para continuidad con el Hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-24 -left-24 size-[32rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.10),rgba(6,182,212,0.08),rgba(99,102,241,0.08),transparent,rgba(6,182,212,0.08))]" />
        <div className="absolute -bottom-16 -right-20 size-[36rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_60%)]" />
      </div>

      {/* grid sutil con máscara central */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)",
        }}
      />
      {/* noise para textura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)",
        }}
      />

      <ParticlesBackground />

      <div className="mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <motion.div
          variants={pop}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mb-14 text-center"
        >
          <h2 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
            Entrenamiento Redefinido
          </h2>
          <p className="text-gray-300 mt-3">
            Tecnología, diseño y metodología al servicio de tu mejor versión.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          className="grid gap-8 md:grid-cols-3 [perspective:1200px]"
        >
          {features.map((f) => (
            <motion.article
              key={f.title}
              variants={pop}
              className="
                group relative rounded-2xl
                bg-neutral-900/90
                border border-neutral-800
                px-6 pt-10 pb-8
                shadow-[0_12px_40px_rgba(0,0,0,0.45)]
                [transform-style:preserve-3d]
                overflow-hidden
                motion-reduce:transform-none motion-reduce:transition-none
              "
              whileHover={{ rotateX: -6, rotateY: 6, y: -8 }}
              whileTap={{ scale: 0.995 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 18,
                mass: 0.6,
              }}
            >
              {/* Caras isométricas (ahora plata, no sky) */}
              <span
                aria-hidden
                className="
                  absolute inset-0 -z-10 rounded-2xl
                  before:content-[''] before:absolute before:-top-2 before:left-2
                  before:w-[calc(100%-4px)] before:h-3 before:rounded-t-2xl
                  before:bg-gradient-to-r before:from-gray-500/30 before:to-gray-300/30
                  before:blur-[1px]
                  after:content-[''] after:absolute after:-left-2 after:top-2
                  after:w-3 after:h-[calc(100%-4px)] after:rounded-l-2xl
                  after:bg-gradient-to-b after:from-gray-500/30 after:to-gray-300/30
                  after:blur-[1px]
                "
              />

              {/* Corte diagonal */}
              <span
                aria-hidden
                className="
                  absolute -right-6 -top-6 size-16 rotate-45
                  bg-gradient-to-br from-neutral-800 to-neutral-900
                  border border-neutral-700
                "
              />

              {/* Borde activo sutil en hover (plata) */}
              <span
                aria-hidden
                className="
                  pointer-events-none absolute inset-0 rounded-2xl
                  ring-0 ring-gray-300/0 group-hover:ring-1 group-hover:ring-gray-300/30
                  transition-all duration-300
                "
              />

              {/* Icono en rombo (flotante) */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 250, damping: 16 }}
                className="
                  mx-auto grid place-items-center size-16
                  rotate-45 rounded-xl
                  bg-gradient-to-br from-neutral-800 to-neutral-900
                  border border-neutral-700
                  shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                "
                style={{ transform: "translateZ(40px) rotate(45deg)" }}
              >
                <div className="-rotate-45 text-gray-200 group-hover:text-gray-100 transition-colors duration-300">
                  {f.icon}
                </div>
              </motion.div>

              {/* titulo y descripcion */}
              <h3 className="mt-6 text-white text-xl font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-gray-300 leading-relaxed">
                {f.description}
              </p>

              {/* Linea base (acento plata) */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-40 group-hover:opacity-70 transition-opacity duration-300 rounded-b-2xl" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;