import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaDirections, FaClock } from 'react-icons/fa';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 2.0
 *
 * Descripción:
 * Sección de ubicación rediseñada para Altos Roca Gym.
 * Se reemplaza el iframe simple por una sección visualmente integrada
 * al resto de la landing, con mapa embebido, dirección y accesos rápidos.
 *
 * Tema: Ubicación - Landing pública
 * Capa: Frontend
 */

const Ubication = () => {
  const direccion = 'Peru y Sarmiento, Tafi Viejo, Tucuman, Argentina';
  const mapaUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    direccion
  )}&z=17&output=embed`;

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    direccion
  )}`;

  return (
    <section className="relative isolate overflow-hidden bg-black text-white py-20 sm:py-24 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.16),transparent_24%),linear-gradient(180deg,#050505_0%,#09090b_45%,#040404_100%)]" />

      <div className="pointer-events-none absolute -top-16 -left-20 h-[24rem] w-[24rem] rounded-full bg-red-600/18 blur-3xl" />
      <div className="pointer-events-none absolute top-[30%] -right-16 h-[28rem] w-[28rem] rounded-full bg-red-500/12 blur-3xl" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md shadow-[0_0_24px_rgba(239,68,68,0.08)]">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-red-200/90">
              Altos Roca Gym · Ubicación
            </span>
          </div>

          <h2 className="mt-6 font-bignoodle text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[0.92] uppercase tracking-[0.05em] text-white">
            Estamos en el
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-700 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)]">
              corazón de tafí viejo
            </span>
          </h2>

          <p className="mt-5 text-base sm:text-lg md:text-xl leading-relaxed text-white/70">
            Encontranos en una ubicación accesible para que puedas entrenar,
            moverte y vivir la experiencia Altos Roca Gym más cerca que nunca.
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-6 xl:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] xl:col-span-4"
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
            <div className="absolute -top-16 right-6 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative z-10 p-6 sm:p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-red-500/18 bg-red-500/10 text-red-300">
                <FaMapMarkerAlt className="text-xl" />
              </div>

              <div className="mt-6 text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                Dirección
              </div>

              <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                Av. Perú y Sarmiento
              </h3>

              <p className="mt-2 text-base text-white/68">
                Tafí Viejo · Tucumán
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Referencia
                    </div>
                    <div className="mt-1 text-sm text-white/82">
                      Fácil acceso en una zona central de Tafí Viejo.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaClock className="text-sm" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Horarios
                    </div>
                    <div className="mt-1 text-sm text-white/82">
                      Lunes a Viernes 8.00 a 22.30 · Sábados 15.00 a 19.00
                    </div>
                  </div>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex"
              >
                <button className="btn-logo btn-logo--md min-w-[220px]">
                  <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                    Cómo llegar
                    <FaDirections className="text-sm" />
                  </span>
                </button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
            className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.045] p-3 sm:p-4 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] xl:col-span-8"
          >
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

            <div className="relative h-[340px] sm:h-[420px] lg:h-[520px] overflow-hidden rounded-[24px] border border-white/10">
              <iframe
                src={mapaUrl}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter:
                    'grayscale(1) invert(0.92) contrast(0.92) hue-rotate(160deg)'
                }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Altos Roca Gym"
                className="absolute inset-0 h-full w-full"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.18))]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Ubication;
