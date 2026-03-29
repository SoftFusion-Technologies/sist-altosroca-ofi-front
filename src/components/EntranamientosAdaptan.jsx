import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  FaUsers, 
  FaHeart, 
  FaDumbbell, 
  FaRunning, 
  FaClock,
  FaChevronRight,
  FaCheck
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import ParticlesBackground from './ParticlesBackground';

const EntranamientosAdaptan = () => {
  const [categoriaActiva, setCategoriaActiva] = useState('principiantes');
  const contenedorRef = useRef(null);
  const estaVisible = useInView(contenedorRef, { once: true, amount: 0.2 });

  const categorias = [
    {
      id: 'principiantes',
      nombre: 'Principiantes',
      icono: FaUsers,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'definicion',
      nombre: 'Definición',
      icono: FaHeart,
      color: 'from-red-500 to-red-700'
    },
    {
      id: 'masa-muscular',
      nombre: 'Masa muscular',
      icono: FaDumbbell,
      color: 'from-green-500 to-green-700'
    },
    {
      id: 'alto-rendimiento',
      nombre: 'Alto rendimiento',
      icono: FaRunning,
      color: 'from-orange-500 to-orange-700'
    },
    {
      id: 'adultos-mayores',
      nombre: 'Adultos mayores',
      icono: FaRunning,
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: 'adolescentes',
      nombre: 'Adolescentes',
      icono: FaClock,
      color: 'from-cyan-500 to-cyan-700'
    }
  ];

  const contenidoCategorias = {
    'principiantes': {
      titulo: 'PRINCIPIANTES',
      descripcion: 'Entrenamiento general para mejorar tu resistencia, fuerza y bienestar general.',
      beneficios: [
        'Introducción segura al mundo del fitness',
        'Aprendizaje de técnicas correctas',
        'Desarrollo gradual de fuerza y resistencia',
        'Acompañamiento personalizado de nuestros coaches',
        'Rutinas adaptadas a tu nivel actual'
      ],
      duracion: '45-60 min',
      frecuencia: '3-4x semana',
      intensidad: 'Baja'
    },
    'definicion': {
      titulo: 'DEFINICIÓN',
      descripcion: 'Programas específicos para quemar grasa y definir tu musculatura con entrenamientos intensivos.',
      beneficios: [
        'Quema efectiva de grasa corporal',
        'Tonificación y definición muscular',
        'Entrenamiento cardiovascular integrado',
        'Rutinas de alta intensidad (HIIT)',
        'Seguimiento nutricional especializado'
      ],
      duracion: '50-70 min',
      frecuencia: '4-5x semana',
      intensidad: 'Moderada'
    },
    'masa-muscular': {
      titulo: 'MASA MUSCULAR',
      descripcion: 'Desarrollo de masa muscular con técnicas avanzadas de hipertrofia y fuerza.',
      beneficios: [
        'Aumento significativo de masa muscular',
        'Entrenamiento con cargas progresivas',
        'Técnicas avanzadas de hipertrofia',
        'Periodización específica para crecimiento',
        'Asesoramiento en suplementación deportiva'
      ],
      duracion: '60-80 min',
      frecuencia: '4-6x semana',
      intensidad: 'Alta'
    },
    'alto-rendimiento': {
      titulo: 'ALTO RENDIMIENTO',
      descripcion: 'Entrenamiento de élite para atletas y personas con experiencia avanzada.',
      beneficios: [
        'Programas de entrenamiento de élite',
        'Análisis biomecánico avanzado',
        'Preparación física especializada',
        'Periodización competitiva',
        'Seguimiento con tecnología de vanguardia'
      ],
      duracion: '70-90 min',
      frecuencia: '5-6x semana',
      intensidad: 'Muy alta'
    },
    'adultos-mayores': {
      titulo: 'ADULTOS MAYORES',
      descripcion: 'Programas adaptados para mantener la vitalidad y movilidad en la edad dorada.',
      beneficios: [
        'Mantenimiento de la movilidad articular',
        'Fortalecimiento funcional',
        'Prevención de caídas',
        'Mejora del equilibrio y coordinación',
        'Actividades de bajo impacto'
      ],
      duracion: '40-50 min',
      frecuencia: '2-3x semana',
      intensidad: 'Baja'
    },
    'adolescentes': {
      titulo: 'ADOLESCENTES',
      descripcion: 'Entrenamiento seguro y supervisado para jóvenes en etapa de crecimiento.',
      beneficios: [
        'Desarrollo físico integral',
        'Educación en hábitos saludables',
        'Fortalecimiento del sistema óseo',
        'Mejora de la autoestima',
        'Supervisión especializada constante'
      ],
      duracion: '45-60 min',
      frecuencia: '3-4x semana',
      intensidad: 'Moderada'
    }
  };

  const categoriaSeleccionada = contenidoCategorias[categoriaActiva];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white py-16 sm:py-20 lg:py-24">
      {/* Fondo galáctico */}
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-40 sm:opacity-60"
      >
        <div className="absolute -top-12 -left-12 sm:-top-24 sm:-left-24 size-[20rem] sm:size-[36rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]" />
        <div className="absolute -bottom-12 -right-10 sm:-bottom-24 sm:-right-20 size-[24rem] sm:size-[40rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[18rem] sm:size-[32rem] rounded-full bg-[conic-gradient(from_90deg_at_50%_50%,rgba(6,182,212,0.08),rgba(99,102,241,0.08),transparent,rgba(59,130,246,0.08))]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15] sm:opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          WebkitMaskImage:
            'radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(70% 60% at 50% 50%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <motion.div
          variants={titleVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-4 sm:mb-6 leading-tight">
            Entrenamientos
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-druk uppercase tracking-tight mb-4 sm:mb-6 leading-tight">
            Que Se Adaptan
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
            Descubre el programa perfecto para ti. Cada entrenamiento está diseñado para adaptarse a tu nivel, objetivos y estilo de vida.
          </p>
        </motion.div>

        {/* Filtros/Botones de Categorías - Grid responsivo */}
        <motion.div
          ref={contenedorRef}
          variants={containerVariants}
          initial="hidden"
          animate={estaVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center gap-2 sm:gap-3 lg:gap-4 mb-12 sm:mb-16 px-2"
        >
          {categorias.map((categoria) => {
            const IconoCategoria = categoria.icono;
            const esActiva = categoriaActiva === categoria.id;
            
            return (
              <motion.button
                key={categoria.id}
                variants={itemVariants}
                onClick={() => setCategoriaActiva(categoria.id)}
                className={`
                  flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 px-3 sm:px-4 lg:px-6 py-3 sm:py-3 rounded-lg sm:rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wide
                  transition-all duration-300 border backdrop-blur-sm min-h-[64px] sm:min-h-[48px]
                  ${esActiva
                    ? 'bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400 text-gray-900 border-gray-300 shadow-[0_0_18px_rgba(255,255,255,0.4)]'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:border-white/30 hover:text-white'
                  }
                `}
              >
                <IconoCategoria className={`text-sm sm:text-base ${esActiva ? 'text-gray-900' : 'text-gray-400'}`} />
                <span className="text-center text-xs sm:text-sm leading-tight">{categoria.nombre}</span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Contenido Principal */}
        <motion.div
          key={categoriaActiva} // Fuerza re-render para animación
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start"
        >
          {/* Información de la categoría */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] order-2 lg:order-1">
            {/* Aurora suave */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 -left-10 sm:-top-20 sm:-left-20 size-[20rem] sm:size-[28rem] rounded-full blur-2xl opacity-40 sm:opacity-60 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]"
            />
            
            {/* Ribete metálico */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
            />

            <div className="relative z-10 p-6 sm:p-8">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-druk text-gray-100 mb-4 leading-tight">
                {categoriaSeleccionada.titulo}
              </h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
                {categoriaSeleccionada.descripcion}
              </p>

              {/* Información adicional - Stack en móvil */}
              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="text-center p-3 sm:p-4 rounded-lg bg-white/5">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100">
                    {categoriaSeleccionada.duracion}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                    Duración
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-lg bg-white/5">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100">
                    {categoriaSeleccionada.frecuencia}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                    Frecuencia
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 rounded-lg bg-white/5">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-100">
                    {categoriaSeleccionada.intensidad}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide">
                    Intensidad
                  </div>
                </div>
              </div>

              {/* Botón de acción */}
              <NavLink to="/clase-prueba" className="inline-block w-full">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-bold text-gray-900 rounded-lg text-base sm:text-lg uppercase tracking-wide
                             bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                             transition-all duration-200 hover:brightness-110
                             shadow-[0_0_18px_rgba(255,255,255,0.55)] relative overflow-hidden"
                >
                  <span className="relative z-10 text-sm sm:text-base">
                    Comenzá Tu Entrenamiento
                  </span>
                  <FaChevronRight className="relative z-10 text-sm" />
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </motion.button>
              </NavLink>
            </div>

            {/* Línea base metálica */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 rounded-b-2xl" />
          </div>

          {/* Lista de beneficios */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)] order-1 lg:order-2">
            {/* Aurora suave */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-10 -right-10 sm:-top-20 sm:-right-20 size-[20rem] sm:size-[28rem] rounded-full blur-2xl opacity-40 sm:opacity-60 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(99,102,241,0.12),rgba(6,182,212,0.10),rgba(59,130,246,0.10),transparent,rgba(6,182,212,0.10))]"
            />
            
            {/* Ribete metálico */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
            />

            <div className="relative z-10 p-6 sm:p-8">
              <h4 className="text-xl sm:text-2xl font-bold text-gray-100 mb-6 sm:mb-8 text-center">
                ¿Qué vas a lograr?
              </h4>

              <ul className="space-y-3 sm:space-y-4">
                {categoriaSeleccionada.beneficios.map((beneficio, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex items-start gap-3 sm:gap-4"
                  >
                    <div className="mt-1 p-1.5 sm:p-2 rounded-full bg-green-500/20 flex-shrink-0">
                      <FaCheck className="text-green-400 text-xs sm:text-sm" />
                    </div>
                    <span className="text-gray-300 leading-relaxed text-sm sm:text-base">
                      {beneficio}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Línea base metálica */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 rounded-b-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EntranamientosAdaptan;