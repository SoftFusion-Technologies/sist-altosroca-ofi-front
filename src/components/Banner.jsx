import React from 'react';
import { motion } from 'framer-motion';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 2.0
 *
 * Descripción:
 * Banner visual adaptado a Altos Roca Gym.
 * Se mantiene la lógica existente de imágenes aleatorias, frases únicas
 * y animaciones, reemplazando la identidad anterior por una paleta rojo/negro
 * y textos alineados al nuevo proyecto.
 *
 * Tema: Banner principal - Landing pública
 * Capa: Frontend
 */

// Array de imágenes del gimnasio
const imagenesGimnasio = Array.from(
  { length: 9 },
  (_, i) => new URL(`../img/Gimnasio/img-${i + 1}.webp`, import.meta.url).href
);

// Frases motivacionales
const frasesMotivacionales = [
  'RESULTADOS QUE HABLAN.',
  'ENTRENAMIENTOS QUE TRANSFORMAN.',
  'Superá tus límites cada día.',
  'El cambio empieza en vos.',
  'Tu esfuerzo, tu orgullo.',
  'La constancia vence al talento.',
  'Entrená fuerte, viví mejor.',
  'No pares hasta estar orgulloso.',
  'Hazlo por ti, hazlo por tu salud.',
  'El dolor es temporal, la gloria es eterna.',
  'Sé más fuerte que tus excusas.',
  'El gimnasio es tu zona de poder.',
  'La motivación te impulsa, el hábito te mantiene.',
  'Entrená con pasión, viví con propósito.',
  'El progreso es mejor que la perfección.',
  'Hazlo por la versión de ti que querés ser.',
  'No te compares, superate.',
  'Hoy entrenás, mañana triunfás.',
  'El éxito es la suma de pequeños esfuerzos.',
  'La meta no es ser mejor que otros, es ser mejor que ayer.',
  'Hazlo por el placer de lograrlo.',
  'La energía que invertís vuelve multiplicada.',
  'Entrená duro, soñá en grande.',
  'El movimiento es vida.',
  'No te detengas hasta que te sientas orgulloso.',
  'La perseverancia te hace invencible.',
  'El esfuerzo nunca se desperdicia.',
  'Hoy es el mejor día para empezar.',
  'El gimnasio es tu templo.',
  'La fuerza se construye, no se hereda.',
  'Entrená con propósito, viví con pasión.',
  'El sudor es tu medalla diaria.',
  'La superación es tu mejor recompensa.',
  'Hazlo por vos, por tu salud, por tu futuro.',
  'Bienvenido a Altos Roca Gym, donde tus metas son nuestra misión.',
  'No importa tu nivel, aquí todos comienzan con un primer paso.',
  'Tu bienestar es nuestra prioridad, entrená a tu ritmo.',
  'Cada repetición cuenta, cada esfuerzo vale la pena.',
  'Transformá tu día con energía y movimiento.',
  'En Altos Roca Gym, cada día es una oportunidad para mejorar.',
  'Entrená con amigos, creá recuerdos, alcanzá tus metas.',
  'Tu salud es tu riqueza, cuidala con nosotros.',
  'No importa la experiencia, importa la actitud.',
  'Un espacio para todos, un lugar para vos.',
  'Descubrí tu mejor versión en Altos Roca Gym.',
  'Entrená con confianza, viví con energía.',
  'Tu esfuerzo inspira, tu progreso motiva.',
  'En Altos Roca Gym, cada logro es celebrado.',
  'Un espacio para crecer, un lugar para triunfar.',
  'Entrená hoy, disfrutá mañana.',
  'Tu cuerpo te lo agradecerá, tu mente también.',
  'La comunidad de Altos Roca Gym te espera, sumate hoy.',
  'Gym, fútbol y pádel en un mismo lugar.',
  'Movete, entrená y viví Altos Roca Gym.',
  'Más que un gimnasio, una experiencia completa.',
  'Activá tu energía en Altos Roca Gym.',
  'Donde el esfuerzo se convierte en progreso.',
  'Viví el deporte con intensidad.',
  'Tu lugar para entrenar, jugar y superarte.',
  'Fuerza, ritmo y actitud en cada jornada.'
];

// Estado global para evitar repeticiones hasta agotar todas las opciones
const imagenesUsadas = new Set();
const frasesUsadas = new Set();

const obtenerElementoUnico = (array, conjuntoUsado) => {
  const elementosDisponibles = array.filter((item) => !conjuntoUsado.has(item));

  if (elementosDisponibles.length === 0) {
    conjuntoUsado.clear();
    return array[Math.floor(Math.random() * array.length)];
  }

  const elemento =
    elementosDisponibles[
      Math.floor(Math.random() * elementosDisponibles.length)
    ];

  conjuntoUsado.add(elemento);
  return elemento;
};

// Usaremos esta función para generar variantes
const crearVariantes = (
  direccion = 'up',
  distancia = 25,
  duracion = 0.45,
  delay = 0
) => {
  const prop = direccion === 'left' || direccion === 'right' ? 'x' : 'y';
  const signo = direccion === 'up' || direccion === 'left' ? -1 : 1;
  const hidden = { opacity: 0, [prop]: signo * distancia };
  const visible = {
    opacity: 1,
    [prop]: 0,
    transition: { duration: duracion, ease: 'easeOut', delay }
  };

  return { hidden, visible };
};

const Banner = ({
  altura = 'h-[340px] md:h-[420px] lg:h-[480px]',
  texto_1 = 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
  texto_2 = 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl',
  direccionSuperior = 'left',
  direccionInferior = 'right',
  distancia = 30,
  duracion = 0.45,
  delayInferior = 0.06
}) => {
  const imagenBanner = obtenerElementoUnico(imagenesGimnasio, imagenesUsadas);
  const frase1 = obtenerElementoUnico(frasesMotivacionales, frasesUsadas);
  let frase2 = obtenerElementoUnico(frasesMotivacionales, frasesUsadas);

  if (frase2 === frase1) {
    frase2 =
      frasesMotivacionales[
        (frasesMotivacionales.indexOf(frase1) + 1) % frasesMotivacionales.length
      ];
  }

  // Clave única para reiniciar la animación al cambiar las frases
  const keyAnim = `${frase1.replaceAll(' ', '_')}_${frase2.replaceAll(
    ' ',
    '_'
  )}`;

  // Generar variantes a partir de las props
  const variantesSuperior = crearVariantes(
    direccionSuperior,
    distancia,
    duracion,
    0
  );

  const variantesInferior = crearVariantes(
    direccionInferior,
    distancia,
    duracion,
    delayInferior
  );

  return (
    <section
      key={keyAnim}
      className={`relative w-full ${altura} flex items-stretch overflow-hidden bg-black`}
    >
      {/* Imagen de fondo */}
      <img
        src={imagenBanner}
        alt="Banner Altos Roca Gym"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        style={{ filter: 'brightness(0.58) saturate(1.05) contrast(1.02)' }}
        aria-hidden
      />

      {/* Overlay principal rojo/negro */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/72 to-red-950/30" />

      {/* Tinte rojo suave */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(239,68,68,0.18),transparent_34%)]" />

      {/* Capa oscura adicional */}
      <div className="absolute inset-0 bg-black/18" />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col md:flex-row w-full h-full">
        <div className="flex flex-col justify-center items-start px-6 md:px-12 lg:px-20 py-8 md:py-0 w-full md:w-1/2">
          <motion.h1
            variants={variantesSuperior}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className={`font-druk ${texto_1} leading-tight uppercase mb-2 text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]`}
          >
            {frase1}
          </motion.h1>

          <motion.span
            variants={variantesInferior}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.35 }}
            className={`font-bignoodle ${texto_2} leading-tight uppercase mt-2 block text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-red-600 drop-shadow-[0_0_10px_rgba(239,68,68,0.30)]`}
          >
            {frase2}
          </motion.span>
        </div>

        <div className="hidden md:block w-1/2" />

        {/* Difuminado negro arriba y abajo */}
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/95 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/95 to-transparent pointer-events-none" />

        {/* Glow rojo lateral */}
        <div className="absolute right-0 top-0 h-full w-[18%] bg-gradient-to-l from-red-600/10 to-transparent pointer-events-none" />
      </div>
    </section>
  );
};

export default Banner;
