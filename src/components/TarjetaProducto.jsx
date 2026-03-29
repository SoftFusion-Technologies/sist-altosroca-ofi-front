import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const TarjetaProducto = ({ producto }) => {
  const formatoPrecio = new Intl.NumberFormat('es-AR', {
    style: 'currency', currency: 'ARS', minimumFractionDigits: 0,
  });

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-neutral-900 rounded-xl border border-neutral-800 shadow-lg overflow-hidden flex flex-col group transition-all duration-300 hover:border-neutral-700 hover:shadow-white/5 hover:-translate-y-1"
    >
      <div className="relative">
        <img src={producto.imagen} alt={producto.nombre} className="w-full h-56 object-cover" />
        <span className="absolute top-3 right-3 bg-neutral-950/50 text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-neutral-700">
          {producto.categoria}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-slate-100 tracking-tight flex-grow">
          {producto.nombre}
        </h3>
        <p className="text-slate-400 mt-2 text-sm">{producto.descripcion}</p>
        <div className="mt-6 flex justify-between items-center space-x-4">
          <p className="text-2xl font-semibold text-white">{formatoPrecio.format(producto.precio)}</p>
          <button className="inline-flex items-center gap-2 bg-neutral-800 text-slate-200 font-semibold text-sm px-4 py-2 rounded-lg border border-neutral-700 transition-colors duration-300 group-hover:bg-slate-200 group-hover:text-black group-hover:border-slate-200">
            <FaShoppingCart />
            <span>Añadir</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
};

export default TarjetaProducto;