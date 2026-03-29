import React from 'react';
import { motion } from 'framer-motion';

const EncabezadoSuplementos = () => (
  <section className="relative bg-black text-white overflow-hidden">
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(200,200,200,0.05),transparent_50%)]" />
    </div>
    <div className="relative z-10 text-center px-4 py-20 md:py-28 mt-10">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-4 sm:mb-6 leading-tight font-extrabold tracking-tight"
      >
        Nuestro Catálogo de{' '}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500">
          Suplementos
        </span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto"
      >
        Potencia tu rendimiento con nuestra selección de productos de la más alta calidad, diseñados para atletas como tú.
      </motion.p>
    </div>
  </section>
);

export default EncabezadoSuplementos;