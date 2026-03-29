import React from 'react';
import { FaSearch } from 'react-icons/fa';

const BarraDeFiltros = ({ terminoBusqueda, onBusquedaChange, categoriaSeleccionada, onCategoriaChange, categorias }) => {
  const inputStyle = "w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-slate-500";

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar suplemento por nombre..."
          value={terminoBusqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className={inputStyle}
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
      </div>
      <div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-3 overflow-x-auto pb-3">
            {categorias.map((categoria) => (
              <button
                key={categoria}
                onClick={() => onCategoriaChange(categoria)}
                className={`px-4 py-2 text-sm font-semibold rounded-full border whitespace-nowrap transition-colors duration-200 ${
                  categoriaSeleccionada === categoria
                    ? 'bg-slate-200 text-black border-slate-200'
                    : 'bg-neutral-800/50 text-slate-300 border-neutral-700 hover:bg-neutral-700'
                }`}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:hidden">
          <select
            value={categoriaSeleccionada}
            onChange={(e) => onCategoriaChange(e.target.value)}
            className={inputStyle}
          >
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default BarraDeFiltros;