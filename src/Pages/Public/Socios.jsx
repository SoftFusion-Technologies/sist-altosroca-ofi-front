import React, { useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaExternalLinkAlt, FaCopy, FaPercent } from 'react-icons/fa';
import ParticlesBackground from '../../components/ParticlesBackground';

const Socios = () => {
  const socios = [
    {
      id: 1,
      name: 'Farmacia Saludable',
      benefit: '15% de descuento en suplementos deportivos.',
      href: '#',
      logo: 'https://placehold.co/400x200/1a1a1a/f97316/png?text=Farmacia+Saludable'
    },
    {
      id: 2,
      name: 'NutriVida Market',
      benefit: '10% de descuento en compras orgánicas.',
      href: '#',
      logo: 'https://placehold.co/400x200/1a1a1a/a855f7/png?text=NutriVida'
    },
    {
      id: 3,
      name: 'Deportes Activos',
      benefit: '20% OFF en indumentaria y calzado.',
      href: '#',
      logo: 'https://placehold.co/400x200/1a1a1a/ffffff/png?text=Deportes+Activos'
    },
    {
      id: 4,
      name: 'Kine-Fisio Center',
      benefit: 'Primera consulta de kinesiología sin cargo.',
      href: '#',
      logo: 'https://placehold.co/400x200/1a1a1a/f97316/png?text=Kine-Fisio'
    },
    {
      id: 5,
      name: 'Barra Energética',
      benefit: 'Batidos post-entreno con 10% OFF.',
      href: '#',
      logo: 'https://placehold.co/400x200/1a1a1a/a855f7/png?text=Barra+Energética'
    },
    {
      id: 6,
      name: 'Mente Zen',
      benefit: 'Clases de meditación y yoga con descuento.',
      href: '#',
      logo: 'https://placehold.co/400x200/1a1a1a/ffffff/png?text=Mente+Zen'
    }
  ];

  const [pressedId, setPressedId] = useState(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }, []);

  // Animations
  const container = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.08, delayChildren: 0.06 }
    }
  };
  const card = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 220, damping: 20 }
    }
  };

  const addressCTA = `Únete a la familia INFINITY para acceder a descuentos y promociones exclusivas de nuestros partners.`;

  return (
    <section className="relative isolate overflow-hidden bg-black text-white min-h-screen py-24">
      {/* Fondo galáctico */}
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-24 -left-24 size-[36rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]" />
        <div className="absolute -bottom-24 -right-20 size-[40rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)'
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,.35) 0, rgba(255,255,255,.35) 1px, transparent 1px, transparent 3px)'
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-druk uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400 mb-4 sm:mb-6 leading-tight font-extrabold tracking-tight">
            NUESTROS{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-100 to-slate-500">
              PARTNERS
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto ">
            Por ser miembro de INFINITY, accedés a beneficios exclusivos con
            marcas y servicios aliados.
          </p>
        </motion.div>

        {/* Grid de socios */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {socios.map((s) => {
            const isPressed = pressedId === s.id;
            return (
              <motion.article
                key={s.id}
                variants={card}
                whileHover={{ y: -8, rotateX: -5, rotateY: 5 }}
                animate={isPressed ? { y: -8, rotateX: -5, rotateY: 5 } : {}}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-[0_18px_50px_rgba(0,0,0,0.45)] [transform-style:preserve-3d] focus-within:ring-1 focus-within:ring-gray-300/30"
                // mobile: simular hover con tap/focus
                onTouchStart={() => setPressedId(s.id)}
                onTouchEnd={() => setPressedId(null)}
                onMouseLeave={() => setPressedId(null)}
                onFocus={() => setPressedId(s.id)}
                onBlur={() => setPressedId(null)}
                tabIndex={0}
              >
                {/* Ribete plata + brillo lateral */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-gray-300/20 transition"
                />
                <span
                  aria-hidden
                  className="absolute -right-8 -top-8 size-16 rotate-45 bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700"
                />

                {/* Logo: gris → color en hover y en mobile al tocar */}
                <div className="p-8 grid place-items-center bg-neutral-900/40 border-b border-white/10 h-44">
                  <img
                    src={s.logo}
                    alt={`Logo de ${s.name}`}
                    className={`max-h-24 w-auto transition-all duration-500 ${
                      isPressed
                        ? 'grayscale-0 scale-105'
                        : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                    }`}
                  />
                </div>

                {/* Contenido */}
                <div className="p-6">
                  <div className="flex items-center justify-center gap-2 text-gray-200">
                    <FaPercent className="opacity-80" />
                    <p className="text-center text-gray-200">{s.benefit}</p>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-center tracking-tight">
                    {s.name}
                  </h3>

                  {/* Acciones rápidas (tap-friendly) */}
                  <div className="mt-5 flex items-center justify-center gap-3">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 active:scale-[0.98] transition"
                    >
                      <FaExternalLinkAlt />
                      Visitar
                    </a>
                    <button
                      onClick={() => copy(`${s.name} · ${s.benefit}`)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 active:scale-[0.98] transition"
                    >
                      <FaCopy />
                      Copiar beneficio
                    </button>
                  </div>
                </div>

                {/* Línea base plata */}
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 group-hover:opacity-70 transition-opacity duration-300 rounded-b-2xl" />
              </motion.article>
            );
          })}
        </motion.div>

        {/* CTA plata coherente (tu contenedor + look del sistema) */}
        <div className="mt-24 relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl text-center overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {/* aurora suave */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-20 -left-20 size-[28rem] rounded-full blur-2xl opacity-60 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]"
          />
          {/* ribete metálico */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
          />

          <div className="relative z-10 p-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Disfrutá estos y más beneficios
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
              {addressCTA}
            </p>
            <NavLink to="/clase-prueba">
              <button
                className="px-8 py-3 font-bold text-gray-900 rounded-md text-lg
                           bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                           transition-transform duration-200 hover:brightness-110 hover:-translate-y-[2px] active:translate-y-0
                           shadow-[0_0_18px_rgba(255,255,255,0.55)]"
              >
                Quiero ser Socio
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Socios;
