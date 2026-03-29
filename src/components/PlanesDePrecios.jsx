import React, { useRef } from "react";
// Array de imágenes del gimnasio
const imagenesGimnasio = Array.from({ length: 9 }, (_, i) =>
  new URL(`../img/Gimnasio/img-${i + 1}.webp`, import.meta.url).href
);
import { NavLink } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { FaDumbbell, FaCheck, FaStar, FaFire } from "react-icons/fa";
import ParticlesBackground from "./ParticlesBackground";

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

const PlanesDePrecios = () => {
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0.3 });

  const precioMensual = 40000;
  const precioTrimestralBase = precioMensual * 3;
  const precioSemestralBase = precioMensual * 6;

  // Selecciona 3 imágenes únicas y aleatorias para las cards
  const imagenesRandom = getRandomUniqueImages(imagenesGimnasio, 3);

  const planes = [
    {
      titulo: "Plan Mensual",
      subtitulo: "Probá sin compromiso",
      precio: "40.000",
      descripcion:
        "Entrená todo el mes con acceso libre a nuestras instalaciones. Perfecto para empezar a moverte y conocernos.",
      beneficios: [
        "Acceso ilimitado al gimnasio",
        "Sin matrícula de ingreso",
        "Acompañamiento de coach en sala",
        "Uso libre de todos los equipos",
      ],
      popular: false,
      ahorro: null,
      icon: FaDumbbell,
    },
    {
      titulo: "Plan Trimestral",
      subtitulo: "Resultados reales en poco tiempo",
      precio: "105.000",
      descripcion:
        "Tres meses de entrenamiento con seguimiento y una rutina pensada para vos. Ideal para ver cambios visibles.",
      beneficios: [
        "Todo lo del Plan Mensual",
        "Rutina personalizada cada mes",
        "Acceso a clases grupales",
        "Seguimiento de progreso",
        "Asesoramiento nutricional básico",
      ],
      popular: true,
      ahorro: precioTrimestralBase - 105000,
      icon: FaStar,
    },
    {
      titulo: "Plan Semestral",
      subtitulo: "Tu mejor versión asegurada",
      precio: "210.000",
      descripcion:
        "Seis meses para transformar tu cuerpo con beneficios premium y la compañía de un coach que te guía paso a paso.",
      beneficios: [
        "Todo lo del Plan Trimestral",
        "Coach personal 2 veces por semana",
        "Plan nutricional personalizado",
        "Evaluación física mensual",
        "Acceso prioritario a instalaciones",
      ],
      popular: false,
      ahorro: precioSemestralBase - 210000,
      icon: FaFire,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        mass: 0.8,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white py-24">
      {/* Fondo galáctico */}
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-24 -left-24 size-[36rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]" />
        <div className="absolute -bottom-24 -right-20 size-[40rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[32rem] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(6,182,212,0.08),rgba(99,102,241,0.08),transparent,rgba(59,130,246,0.08))]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)",
          maskImage:
            "radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Encabezado */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 px-4">
            <FaDumbbell className="text-3xl md:text-4xl text-gray-300 flex-shrink-0" />
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-druk uppercase tracking-tight text-center">
              Nuestros Planes
            </h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-6">
            De Entrenamiento
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Encuentra la membresía perfecta para forjar tu mejor versión y
            alcanzar tus objetivos de fitness.
          </p>
        </motion.div>

        {/* Grid de planes */}
        <motion.div
          ref={contenedorRef}
          variants={containerVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="grid gap-8 lg:grid-cols-3 lg:gap-8"
        >
          {planes.map((plan, indice) => {
            // Selecciona una imagen única y aleatoria para cada card
            const imgFondo = imagenesRandom[indice];
            return (
              <motion.article
                key={plan.titulo}
                variants={cardVariants}
                className={`
                  relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl 
                  overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] 
                  transition-all duration-300 hover:-translate-y-2
                  ${
                    plan.popular
                      ? "scale-[1.05] lg:scale-[1.08]"
                      : "hover:scale-[1.02]"
                  }
                `}
              >
                {/* Fondo de imagen gimnasio */}
                <img
                  src={imgFondo}
                  alt="Fondo gimnasio"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-10 pointer-events-none select-none z-0"
                  style={{ filter: 'blur(2px) grayscale(0.3)' }}
                  aria-hidden
                />
                {/* Aurora suave */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-20 -left-20 size-[28rem] rounded-full blur-2xl opacity-60 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]"
                />

                {/* Ribete metálico */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent ${
                    plan.popular
                      ? "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15),0_0_20px_rgba(255,255,255,0.1)]"
                      : "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                  }`}
                  style={{
                    boxShadow: plan.popular
                      ? "inset 0 0 0 1px rgba(255,255,255,0.15), 0 0 20px rgba(255,255,255,0.1)"
                      : "inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                />

                {/* Badge de más popular */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -12 }}
                    animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -top-2 -right-2 z-20"
                  >
                    <div className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400 text-gray-900 font-bold px-4 py-2 rounded-lg shadow-lg transform rotate-12 mt-2">
                      <span className="text-sm uppercase tracking-wide">
                        Más Popular
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Badge de ahorro */}
                {plan.ahorro && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute top-4 left-4 bg-green-500/20 border border-green-400/30 backdrop-blur-sm rounded-full px-3 py-1"
                  >
                    <span className="text-green-400 text-xs font-semibold">
                      Ahorras ${plan.ahorro.toLocaleString("es-AR")}
                    </span>
                  </motion.div>
                )}

                <div className="relative z-10 p-8 flex flex-col h-full">
                  {/* Ícono y título */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                      <plan.icon className="text-2xl text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-2">
                      {plan.titulo}
                    </h3>
                    <p className="text-gray-400">{plan.subtitulo}</p>
                  </div>

                  {/* Precio */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-bold text-white">
                        ${plan.precio}
                      </span>
                      <span className="text-gray-400 text-lg">/mes</span>
                    </div>
                  </div>

                  {/* Descripción */}
                  <p className="text-gray-300 text-center mb-8 leading-relaxed">
                    {plan.descripcion}
                  </p>

                  {/* Beneficios */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.beneficios.map((beneficio, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + idx * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 p-1 rounded-full bg-green-500/20">
                          <FaCheck className="text-green-400 text-xs" />
                        </div>
                        <span className="text-gray-300 text-sm leading-relaxed">
                          {beneficio}
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Botón */}
                  <NavLink to="/clase-prueba" className="w-full mt-auto">
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full px-8 py-4 font-bold rounded-lg text-lg uppercase tracking-wide
                        transition-all duration-200 relative overflow-hidden
                        ${
                          plan.popular
                            ? "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400 text-gray-900 shadow-[0_0_18px_rgba(255,255,255,0.55)]"
                            : "bg-white/10 border border-white/20 text-white hover:bg-white/15 backdrop-blur-sm"
                        }
                      `}
                    >
                      <span className="relative z-10">¡Quiero Comenzar Ya!</span>
                      {plan.popular && (
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                      )}
                    </motion.button>
                  </NavLink>
                </div>

                {/* Línea base metálica */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 rounded-b-2xl" />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PlanesDePrecios;
