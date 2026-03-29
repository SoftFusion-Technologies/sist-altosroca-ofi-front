import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch,
  FaDumbbell,
  FaFire,
  FaTags,
  FaWhatsapp,
  FaArrowRight,
  FaFilter,
  FaCheckCircle,
  FaCapsules
} from 'react-icons/fa';
import ParticlesBackground from '../../components/ParticlesBackground';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Rediseño completo de la página de suplementos para Altos Roca Gym.
 * Se reemplaza el layout anterior por una experiencia moderna, inmersiva,
 * responsive y alineada al lenguaje visual rojo/negro del proyecto,
 * manteniendo búsqueda, filtros y listado de productos.
 *
 * Tema: Página de Suplementos - Landing pública
 * Capa: Frontend
 */

// --- Base de Datos Ficticia
const suplementos = [
  {
    id: 1,
    nombre: 'Proteína Whey Gold Standard',
    categoria: 'Proteína',
    precio: 75000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Proteína',
    descripcion: 'Proteína de suero de leche de alta calidad para recuperación.'
  },
  {
    id: 2,
    nombre: 'Creatina Monohidratada Micronizada',
    categoria: 'Creatina',
    precio: 42000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Creatina',
    descripcion: 'Aumenta la fuerza, potencia y rendimiento en entrenamientos.'
  },
  {
    id: 3,
    nombre: 'Pre-Entreno C4 Original',
    categoria: 'Pre-Entreno',
    precio: 55000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Pre-Entreno',
    descripcion: 'Fórmula energética para maximizar tu enfoque y resistencia.'
  },
  {
    id: 4,
    nombre: 'BCAA 2:1:1 Esencial',
    categoria: 'Aminoácidos',
    precio: 38500,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=BCAA',
    descripcion: 'Reduce la fatiga y mejora la síntesis de proteínas.'
  },
  {
    id: 5,
    nombre: 'Multivitamínico Performance',
    categoria: 'Vitaminas',
    precio: 29000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Vitaminas',
    descripcion: 'Complejo de vitaminas y minerales para la salud del atleta.'
  },
  {
    id: 6,
    nombre: 'Quemador de Grasa Thermo Pro',
    categoria: 'Quemadores',
    precio: 61000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Quemador',
    descripcion: 'Fórmula termogénica para acelerar el metabolismo.'
  },
  {
    id: 7,
    nombre: 'Ganador de Peso Serious Mass',
    categoria: 'Ganadores de Peso',
    precio: 89000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Gainer',
    descripcion: 'Aporte calórico extra para un aumento de masa efectivo.'
  },
  {
    id: 8,
    nombre: 'Intra-Workout EAA+ Hydration',
    categoria: 'Intra-Entreno',
    precio: 45000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Intra',
    descripcion: 'Mantiene la hidratación y energía durante el entrenamiento.'
  },
  {
    id: 9,
    nombre: 'Colágeno Hidrolizado + Magnesio',
    categoria: 'Salud Articular',
    precio: 35000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Colágeno',
    descripcion: 'Fortalece articulaciones, tendones y ligamentos.'
  },
  {
    id: 10,
    nombre: 'Proteína Vegana Plant-Based',
    categoria: 'Proteína',
    precio: 78000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Proteína',
    descripcion: 'Proteína completa a base de guisante y arroz.'
  },
  {
    id: 11,
    nombre: 'Creatina HCL Pro',
    categoria: 'Creatina',
    precio: 48000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Creatina',
    descripcion: 'Máxima absorción sin fase de carga.'
  },
  {
    id: 12,
    nombre: 'Pre-Entreno The Curse!',
    categoria: 'Pre-Entreno',
    precio: 58000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Pre-Entreno',
    descripcion: 'Energía extrema, enfoque mental y congestiones masivas.'
  },
  {
    id: 13,
    nombre: 'Glutamina Micronizada',
    categoria: 'Aminoácidos',
    precio: 33000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Glutamina',
    descripcion:
      'Aminoácido clave para la recuperación muscular y sistema inmune.'
  },
  {
    id: 14,
    nombre: 'Omega 3 Fish Oil',
    categoria: 'Vitaminas',
    precio: 25000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Omega+3',
    descripcion: 'Soporte cardiovascular y antiinflamatorio natural.'
  },
  {
    id: 15,
    nombre: 'L-Carnitina Líquida',
    categoria: 'Quemadores',
    precio: 40000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Carnitina',
    descripcion: 'Ayuda a convertir la grasa en energía de forma eficiente.'
  },
  {
    id: 16,
    nombre: 'Ganador de Peso Mutant Mass',
    categoria: 'Ganadores de Peso',
    precio: 92000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Gainer',
    descripcion: 'Diseñado para los que les cuesta ganar peso.'
  },
  {
    id: 17,
    nombre: 'Carbohidratos Dextrosa',
    categoria: 'Intra-Entreno',
    precio: 22000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Carbs',
    descripcion: 'Fuente de energía rápida para reponer glucógeno.'
  },
  {
    id: 18,
    nombre: 'Glucosamina y Condroitina',
    categoria: 'Salud Articular',
    precio: 39000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Articular',
    descripcion: 'Combinación clásica para la salud del cartílago.'
  },
  {
    id: 19,
    nombre: 'Proteína Isolate ISO-100',
    categoria: 'Proteína',
    precio: 95000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Proteína',
    descripcion: 'Máxima pureza, rápida absorción, cero carbos y grasas.'
  },
  {
    id: 20,
    nombre: 'Citrulina Malato',
    categoria: 'Pre-Entreno',
    precio: 31000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Citrulina',
    descripcion: 'Mejora el bombeo sanguíneo y reduce la fatiga.'
  },
  {
    id: 21,
    nombre: 'Arginina AAKG',
    categoria: 'Aminoácidos',
    precio: 28000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Arginina',
    descripcion: 'Precursor del óxido nítrico para una mejor vascularización.'
  },
  {
    id: 22,
    nombre: 'Vitamina D3 + K2',
    categoria: 'Vitaminas',
    precio: 26000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Vitaminas',
    descripcion: 'Esencial para la salud ósea y el sistema inmune.'
  },
  {
    id: 23,
    nombre: 'CLA (Ácido Linoleico Conjugado)',
    categoria: 'Quemadores',
    precio: 43000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=CLA',
    descripcion: 'Ayuda a reducir la grasa corporal y aumentar la masa magra.'
  },
  {
    id: 24,
    nombre: 'Proteína de Caseína',
    categoria: 'Proteína',
    precio: 82000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Caseína',
    descripcion:
      'Proteína de digestión lenta, ideal para tomar antes de dormir.'
  },
  {
    id: 25,
    nombre: 'Beta-Alanina',
    categoria: 'Pre-Entreno',
    precio: 29500,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Beta-Alanina',
    descripcion: 'Aumenta la resistencia muscular y retrasa la fatiga.'
  },
  {
    id: 26,
    nombre: 'MSM (Metilsulfonilmetano)',
    categoria: 'Salud Articular',
    precio: 27000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=MSM',
    descripcion: 'Compuesto de azufre con propiedades antiinflamatorias.'
  },
  {
    id: 27,
    nombre: 'ZMA (Zinc, Magnesio, B6)',
    categoria: 'Vitaminas',
    precio: 31000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=ZMA',
    descripcion: 'Mejora la recuperación, el sueño y la producción hormonal.'
  },
  {
    id: 28,
    nombre: 'Ganador de Peso Anabolic',
    categoria: 'Ganadores de Peso',
    precio: 99000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Gainer',
    descripcion: 'Fórmula avanzada con creatina para máximas ganancias.'
  },
  {
    id: 29,
    nombre: 'HMB',
    categoria: 'Aminoácidos',
    precio: 41000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=HMB',
    descripcion:
      'Metabolito de la leucina que previene el catabolismo muscular.'
  },
  {
    id: 30,
    nombre: 'Cluster Dextrin',
    categoria: 'Intra-Entreno',
    precio: 52000,
    imagen: 'https://placehold.co/600x600/0a0a0a/9ca3af/png?text=Dextrin',
    descripcion: 'Carbohidrato de última generación para energía sostenida.'
  }
];

const categorias = [
  'Todos',
  'Proteína',
  'Creatina',
  'Pre-Entreno',
  'Aminoácidos',
  'Vitaminas',
  'Quemadores',
  'Ganadores de Peso',
  'Intra-Entreno',
  'Salud Articular'
];

const formatearARS = (valor) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor);

const containerV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
};

const itemV = {
  hidden: { opacity: 0, y: 22, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 16
    }
  }
};

const Suplementos = () => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  const productosFiltrados = useMemo(() => {
    return suplementos
      .filter(
        (producto) =>
          categoriaSeleccionada === 'Todos' ||
          producto.categoria === categoriaSeleccionada
      )
      .filter((producto) =>
        producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
      );
  }, [terminoBusqueda, categoriaSeleccionada]);

  const whatsappBase = 'https://wa.me/543814480898';

  const discFondo = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <g fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='2'>
        <circle cx='60' cy='60' r='44'/>
        <circle cx='60' cy='60' r='28'/>
        <circle cx='60' cy='60' r='10'/>
      </g>
      <g stroke='rgba(239,68,68,0.10)' stroke-width='1.4'>
        <line x1='60' y1='8' x2='60' y2='22'/>
        <line x1='60' y1='98' x2='60' y2='112'/>
        <line x1='8' y1='60' x2='22' y2='60'/>
        <line x1='98' y1='60' x2='112' y2='60'/>
      </g>
    </svg>
  `);

  const mancuernaSvg = encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
      <g fill='none' stroke='rgba(255,255,255,0.78)' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'>
        <line x1='10' y1='32' x2='54' y2='32'/>
        <rect x='6' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(239,68,68,0.15)' stroke='rgba(255,255,255,0.58)'/>
        <rect x='12' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
        <rect x='52' y='24' width='6' height='16' rx='2' ry='2' fill='rgba(239,68,68,0.15)' stroke='rgba(255,255,255,0.58)'/>
        <rect x='46' y='26' width='6' height='12' rx='2' ry='2' fill='rgba(255,255,255,0.08)'/>
      </g>
    </svg>
  `);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-black text-white">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_24%),linear-gradient(180deg,#050505_0%,#09090b_45%,#040404_100%)]" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${discFondo}")`,
          backgroundSize: '180px 180px',
          backgroundRepeat: 'repeat',
          maskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 34%, rgba(0,0,0,0.18) 74%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, rgba(0,0,0,1) 34%, rgba(0,0,0,0.18) 74%, transparent 100%)'
        }}
      />

      <div className="pointer-events-none absolute -top-16 -left-20 h-[28rem] w-[28rem] rounded-full bg-red-600/18 blur-3xl" />
      <div className="pointer-events-none absolute top-[18%] -right-16 h-[30rem] w-[30rem] rounded-full bg-red-500/14 blur-3xl" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[16%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-[16%] size-[44vmin] max-h-[420px] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/14" />

        <div className="absolute left-1/2 top-[16%] size-[60vmin] max-h-[560px] max-w-[560px] -translate-x-1/2 -translate-y-1/2 animate-[orbit_28s_linear_infinite]">
          {[
            'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2',
            'right-0 top-1/2 translate-x-1/2 -translate-y-1/2',
            'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2',
            'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2'
          ].map((position, index) => (
            <div
              key={`orbit-${index}`}
              className={`absolute ${position}`}
              style={{
                width: '38px',
                height: '38px',
                backgroundImage: `url("data:image/svg+xml;utf8,${mancuernaSvg}")`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 0 12px rgba(239,68,68,0.18))'
              }}
            />
          ))}
        </div>
      </div>

      <main className="relative z-10">
        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="mx-auto max-w-5xl text-center"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
                Altos Roca Gym · Suplementos
              </span>
            </div>

            <h1 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem] leading-[0.92] uppercase tracking-[0.05em] text-white">
              Potenciá tu
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
                rendimiento
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70">
              Encontrá suplementos para fuerza, recuperación, energía y salud
              articular, con una experiencia visual mucho más moderna y alineada
              al universo Altos Roca.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {[
                'Proteínas',
                'Creatinas',
                'Pre-entrenos',
                'Recuperación',
                'Vitaminas'
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] sm:text-xs font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.08] hover:text-white"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>

          {/* KPI / SUMMARY */}
          <motion.div
            variants={containerV}
            initial="hidden"
            animate="show"
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {[
              {
                label: 'Productos',
                value: suplementos.length,
                icon: FaCapsules
              },
              {
                label: 'Categorías',
                value: categorias.length - 1,
                icon: FaTags
              },
              {
                label: 'Con búsqueda',
                value: terminoBusqueda ? 'Activa' : 'Lista',
                icon: FaSearch
              },
              {
                label: 'Filtrados',
                value: productosFiltrados.length,
                icon: FaFilter
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={itemV}
                  className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.38)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                      <Icon />
                    </div>

                    <div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/44">
                        {item.label}
                      </div>
                      <div className="mt-1 text-2xl font-bold text-white/92">
                        {item.value}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* FILTERS */}
        <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="rounded-[28px] border border-white/10 bg-white/[0.045] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.38)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xl">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-red-300" />
                <input
                  type="text"
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  placeholder="Buscar por nombre del suplemento..."
                  className="w-full rounded-2xl border border-white/10 bg-black/25 py-3.5 pl-12 pr-4 text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:border-red-500/30 focus:bg-red-500/[0.05]"
                />
              </div>

              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/16 bg-red-500/[0.08] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                <FaDumbbell className="text-[10px]" />
                Altos Roca Store
              </div>
            </div>

            <div className="mt-4 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex w-max min-w-full gap-3">
                {categorias.map((categoria) => {
                  const activa = categoriaSeleccionada === categoria;

                  return (
                    <button
                      key={categoria}
                      onClick={() => setCategoriaSeleccionada(categoria)}
                      className={[
                        'rounded-2xl border px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300',
                        activa
                          ? 'border-white/10 bg-gradient-to-r from-red-700 via-red-500 to-red-400 text-white shadow-[0_14px_32px_rgba(0,0,0,0.30)]'
                          : 'border-white/10 bg-white/[0.04] text-white/76 hover:border-red-500/24 hover:bg-red-500/[0.06] hover:text-white'
                      ].join(' ')}
                    >
                      {categoria}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </section>

        {/* PRODUCTS */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 pt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45 }}
            className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                Resultados
              </div>
              <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                {productosFiltrados.length} producto
                {productosFiltrados.length === 1 ? '' : 's'} encontrado
                {productosFiltrados.length === 1 ? '' : 's'}
              </h2>
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
              Categoría actual:{' '}
              <span className="font-semibold text-white">
                {categoriaSeleccionada}
              </span>
            </div>
          </motion.div>

          {productosFiltrados.length > 0 ? (
            <motion.div
              variants={containerV}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.08 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            >
              <AnimatePresence>
                {productosFiltrados.map((producto, index) => {
                  const mensajeWhatsApp = encodeURIComponent(
                    `Hola, quiero consultar por ${producto.nombre} (${producto.categoria}) que vi en Altos Roca Gym.`
                  );
                  const whatsappHref = `${whatsappBase}?text=${mensajeWhatsApp}`;

                  return (
                    <motion.article
                      key={producto.id}
                      variants={itemV}
                      layout
                      whileHover={{ y: -6, rotateX: -3, rotateY: 3 }}
                      whileTap={{ scale: 0.995 }}
                      transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 18,
                        mass: 0.6
                      }}
                      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
                    >
                      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
                      <div className="absolute -top-14 right-4 h-28 w-28 rounded-full bg-red-500/10 blur-3xl" />

                      <div className="relative aspect-square overflow-hidden border-b border-white/10 bg-black/30">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.30))]" />

                        <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-red-500/18 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-red-100 backdrop-blur-md">
                          <FaTags className="text-[9px]" />
                          {producto.categoria}
                        </div>

                        {index % 3 === 1 && (
                          <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/82 backdrop-blur-md">
                            Recomendado
                          </div>
                        )}
                      </div>

                      <div className="relative z-10 flex h-full flex-col p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg sm:text-xl font-semibold leading-tight text-white">
                            {producto.nombre}
                          </h3>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                            <FaCapsules className="text-sm" />
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                          {producto.descripcion}
                        </p>

                        <div className="mt-5 flex items-center gap-3 rounded-[22px] border border-white/10 bg-black/22 p-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                            <FaFire className="text-sm" />
                          </div>

                          <div>
                            <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                              Precio
                            </div>
                            <div className="mt-1 text-2xl font-bold text-white">
                              {formatearARS(producto.precio)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 space-y-3">
                          {[
                            'Consultá disponibilidad',
                            'Ideal según objetivos'
                          ].map((point) => (
                            <div
                              key={point}
                              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                            >
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                                <FaCheckCircle className="text-xs" />
                              </div>
                              <span className="text-sm text-white/82">
                                {point}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <a
                            href={whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1"
                          >
                            <button className="btn-logo btn-logo--md w-full">
                              <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                                Consultar
                                <FaWhatsapp className="text-sm" />
                              </span>
                            </button>
                          </a>

                          <button className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white">
                            <span className="inline-flex items-center gap-2">
                              Ver más
                              <FaArrowRight className="text-xs text-red-300" />
                            </span>
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-white/10 bg-white/[0.045] p-10 text-center backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)]"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] border border-red-500/18 bg-red-500/10 text-red-300">
                <FaSearch className="text-xl" />
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-white">
                No encontramos coincidencias
              </h3>

              <p className="mt-3 text-base leading-relaxed text-white/68">
                Probá con otro término de búsqueda o seleccioná una categoría
                diferente.
              </p>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setTerminoBusqueda('');
                    setCategoriaSeleccionada('Todos');
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes orbit {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        .animate-[orbit_28s_linear_infinite] {
          animation: orbit 28s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Suplementos;
