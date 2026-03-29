import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ParticlesBackground from "./ParticlesBackground";
import { FaUsers, FaAward } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const SeccionTestimonios = () => {
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0.3 });

  const testimonios = [
    {
      nombre: "Ana Pérez",
      testimonio:
        "El cambio en mi vida ha sido increíble. Los entrenadores son súper atentos y el ambiente es genial. ¡Lo recomiendo al 100%!",
      imagen: "https://randomuser.me/api/portraits/women/44.jpg",
      cargo: "Miembro desde 2023"
    },
    {
      nombre: "Carlos Vera",
      testimonio:
        "Nunca pensé que disfrutaría tanto ir al gimnasio. INFINITY es más que un lugar para entrenar, es una segunda casa.",
      imagen: "https://randomuser.me/api/portraits/men/32.jpg",
      cargo: "Miembro desde 2022"
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
            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)'
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <FaUsers className="text-4xl text-gray-300" />
            <h2 className="text-4xl md:text-6xl font-druk uppercase tracking-tight">
              Testimonios
            </h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-6">
            De Nuestros Miembros
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Historias reales de transformación y éxito de quienes ya forman parte de la comunidad INFINITY.
          </p>
        </motion.div>

        {/* Grid de testimonios */}
        <motion.div
          ref={contenedorRef}
          variants={containerVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto"
        >
          {testimonios.map((testimonio, indice) => (
            <motion.article
              key={testimonio.nombre}
              variants={cardVariants}
              className="relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl 
                         overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] 
                         transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* Aurora suave */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -left-20 size-[28rem] rounded-full blur-2xl opacity-60 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]"
              />
              
              {/* Ribete metálico */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
              />

              <div className="relative z-10 p-8">
                {/* Avatar y información */}
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src={testimonio.imagen}
                      alt={testimonio.nombre}
                      className="w-20 h-20 rounded-full mx-auto border-4 border-white/20 shadow-lg"
                    />
                    {/* Anillo de resplandor */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-200/20 via-gray-300/20 to-gray-400/20 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-1">
                    {testimonio.nombre}
                  </h3>
                  <p className="text-gray-400 text-sm">{testimonio.cargo}</p>
                </div>

                {/* Testimonio */}
                <div className="text-center">
                  {/* Comillas decorativas */}
                  <div className="text-5xl text-gray-600/50 mb-4 leading-none select-none" aria-hidden="true">
                    "
                  </div>
                  <p className="text-gray-300 text-lg leading-relaxed italic -mt-8 mb-6">
                    {testimonio.testimonio}
                  </p>
                </div>

                {/* Estrellas decorativas */}
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <FaAward className="text-gray-400 text-sm" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Línea base metálica */}
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 rounded-b-2xl" />
            </motion.article>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          variants={titleVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            ¿Querés ser el próximo en compartir tu historia de éxito?
          </p>
          <NavLink to="/clase-prueba">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 font-bold text-gray-900 rounded-lg text-lg uppercase tracking-wide
                         bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                         transition-all duration-200 hover:brightness-110
                         shadow-[0_0_18px_rgba(255,255,255,0.55)] relative overflow-hidden"
            >
              <span className="relative z-10">
                ¡Comenzá Tu Transformación!
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
            </motion.button>
          </NavLink>
        </motion.div>
      </div>
    </section>
  );
};

export default SeccionTestimonios;