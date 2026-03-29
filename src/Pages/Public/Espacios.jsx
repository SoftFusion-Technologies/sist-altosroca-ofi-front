import React from 'react'


import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ParticlesBackground from '../../components/ParticlesBackground';

const imagenes = Array.from({ length: 9 }, (_, i) =>
  new URL(`../../img/Gimnasio/img-${i + 1}.webp`, import.meta.url).href
);

const frasesMotivacion = [
  "¡Hoy es el día para superarte!",
  "Cada repetición te acerca a tu mejor versión.",
  "No hay límites, solo nuevos objetivos.",
  "El esfuerzo de hoy es el éxito de mañana.",
  "Transforma el sudor en orgullo.",
  "La constancia vence al talento.",
  "Entrena fuerte, vive mejor.",
  "Tu cuerpo puede soportar más de lo que tu mente cree.",
  "El dolor es temporal, la gloria es eterna.",
  "Hazlo por ti, hazlo por tu salud.",
  "No pares hasta estar orgulloso.",
  "El único mal entrenamiento es el que no se hace.",
  "La disciplina es el puente entre metas y logros.",
  "Cada día es una nueva oportunidad.",
  "El éxito empieza con el primer paso.",
  "No busques excusas, busca resultados.",
  "El cambio comienza en tu mente.",
  "Sé más fuerte que tus excusas.",
  "El gimnasio es tu zona de poder.",
  "La motivación te impulsa, el hábito te mantiene.",
  "Entrena con pasión, vive con propósito.",
  "El progreso es mejor que la perfección.",
  "Hazlo por la versión de ti que quieres ser.",
  "El sudor es solo tu cuerpo cambiando.",
  "No te compares, supérate.",
  "La fuerza no viene de ganar, viene de luchar.",
  "Hoy entrenas, mañana triunfas.",
  "El éxito es la suma de pequeños esfuerzos.",
  "No hay atajos para ningún lugar que valga la pena.",
  "El dolor que sientes hoy será tu fuerza mañana.",
  "La meta no es ser mejor que otros, es ser mejor que ayer.",
  "El gimnasio es tu laboratorio de superación.",
  "Hazlo por el placer de lograrlo.",
  "La energía que inviertes vuelve multiplicada.",
  "El único fracaso es rendirse.",
  "Entrena duro, sueña en grande.",
  "La actitud lo es todo.",
  "El movimiento es vida.",
  "No te detengas hasta que te sientas orgulloso.",
  "El éxito es la mejor revancha.",
  "La perseverancia te hace invencible.",
  "El esfuerzo nunca se desperdicia.",
  "Hoy es el mejor día para empezar.",
  "El gimnasio es tu templo.",
  "La fuerza se construye, no se hereda.",
  "El verdadero reto está en tu mente.",
  "Entrena con propósito, vive con pasión.",
  "El sudor es tu medalla diaria.",
  "La superación es tu mejor recompensa.",
  "Hazlo por ti, por tu salud, por tu futuro."
];

const Espacios = () => {
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0.2 });

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 18 },
    },
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white min-h-screen py-16 sm:py-20 lg:py-24">
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-40 sm:opacity-60"
      >
        <div className="absolute -top-12 -left-12 sm:-top-24 sm:-left-24 size-[20rem] sm:size-[36rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]" />
        <div className="absolute -bottom-12 -right-10 sm:-bottom-24 sm:-right-20 size-[24rem] sm:size-[40rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-4 sm:mb-6 leading-tight font-extrabold tracking-tight">
            Nuestros{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500">
              Espacios
            </span>
          </h2>
          
          <h3 className="text-xl sm:text-2xl md:text-3xl font-druk uppercase tracking-tight mb-4 sm:mb-6 leading-tight text-gray-200">
            Un Gimnasio, Mil Experiencias
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Descubrí cada rincón de Infinity: máquinas de última generación, zonas de fuerza, cardio, funcional y relax. ¡Viví la energía y el diseño que nos hace únicos!
          </p>
        </motion.div>

        {/* Galería creativa */}
        <motion.div
          ref={contenedorRef}
          variants={containerVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10"
        >
          {imagenes.map((img, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ scale: 1.08, rotate: idx % 2 === 0 ? 2 : -2, zIndex: 2 }}
              className="relative group rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.45)] border border-white/10 bg-white/5 backdrop-blur-xl"
            >
              {/* Efecto de resplandor */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-gray-300/30 transition"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
              />
              {/* Imagen principal */}
              <img
                src={img}
                alt={`Gimnasio Infinity ${idx + 1}`}
                className="w-full h-40 sm:h-56 lg:h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105 group-hover:brightness-110"
                loading="lazy"
              />
              {/* Overlay de info */}
              <div className="absolute inset-0 flex flex-col justify-end items-center bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                <span className="text-xs sm:text-sm text-gray-300 mt-1">
                  {frasesMotivacion[idx % frasesMotivacion.length]}
                </span>
              </div>
              {/* Partículas decorativas */}
              <div className="absolute top-2 left-2 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
              <div className="absolute bottom-2 right-2 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={estaVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mt-8"
        >
          <a
            href="/clase-prueba"
            className="inline-block px-8 py-4 font-bold text-gray-900 rounded-lg text-lg uppercase tracking-wide bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400 transition-all duration-200 hover:brightness-110 shadow-[0_0_18px_rgba(255,255,255,0.55)]"
          >
            ¡Quiero entrenar en Infinity!
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default Espacios;
