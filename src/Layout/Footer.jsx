import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight
} from 'react-icons/fa';
import Logo from '../img/Logo.webp';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 29 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Nueva propuesta visual para el footer público de Altos Roca Gym.
 * Se reemplaza la estructura anterior por una composición más limpia,
 * elegante y moderna, con mejor jerarquía visual, menos ruido gráfico
 * y mejor lectura en desktop y mobile, manteniendo la paleta actual.
 *
 * Tema: Footer - Landing pública
 * Capa: Frontend
 */

const Footer = () => {
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/altosroca/',
      icon: FaInstagram
    },
    {
      name: 'Facebook',
      href: 'https://www.facebook.com/altosroca.gym/',
      icon: FaFacebookF
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/543814480898',
      icon: FaWhatsapp
    }
  ];

  const navigationLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Horarios', path: '/horarios' },
    // { name: 'Turnos', path: '/turnos' },
    { name: 'Socios', path: '/socios' },
    { name: 'Espacios', path: '/espacios' },
    { name: 'Suplementos', path: '/suplementos' }
  ];

  const quickLinks = [
    // { name: 'Reservar turno', path: '/turnos' },
    { name: 'Ver horarios', path: '/horarios' },
    { name: 'Conocer espacios', path: '/espacios' }
  ];

  return (
    <footer className="relative overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#0a0a0a_45%,#040404_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Franja superior */}
        <div className="border-b border-white/10 py-10 sm:py-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_.9fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
                Altos Roca Gym
              </div>

              <div className="flex items-center gap-4 sm:gap-5">
                <img
                  src={Logo}
                  alt="Altos Roca Gym Logo"
                  className="h-14 w-auto object-contain sm:h-16"
                />

                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-[0.08em] text-white sm:text-4xl">
                    Entrená con actitud
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/68 sm:text-base">
                    Un espacio pensado para quienes viven el deporte con energía,
                    constancia y compromiso real.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {quickLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/86 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/10 hover:text-white"
                >
                  <span>{link.name}</span>
                  <FaArrowRight className="text-xs text-red-300 transition-transform duration-300 group-hover:translate-x-1" />
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Cuerpo principal */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:py-14 md:grid-cols-2 xl:grid-cols-4">
          {/* Marca */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-red-200/80">
              Identidad
            </div>

            <h4 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
              Movimiento real
            </h4>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65 sm:text-base">
              Gym, fútbol, pádel y una comunidad que elige superarse todos los
              días en un entorno preparado para dar más.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {['Gym', 'Fútbol', 'Pádel'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/78"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Navegación */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-red-200/80">
              Sitio
            </div>

            <h4 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
              Navegación
            </h4>

            <ul className="mt-5 space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    className="group inline-flex items-center gap-3 text-sm text-white/68 transition-colors duration-300 hover:text-white sm:text-base"
                  >
                    <span className="h-px w-5 bg-red-400/60 transition-all duration-300 group-hover:w-7 group-hover:bg-red-300" />
                    <span>{link.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-red-200/80">
              Información
            </div>

            <h4 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
              Contacto
            </h4>

            <div className="mt-5 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Dirección
                  </div>
                  <p className="mt-1 text-sm text-white/84 sm:text-base">
                    Av. Perú y Sarmiento
                  </p>
                  <p className="text-sm text-white/58">Tafí Viejo · Tucumán</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
                  <FaClock />
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                    Horarios
                  </div>
                  <p className="mt-1 text-sm text-white/84 sm:text-base">
                    Lunes a Viernes 8.00 a 22.30
                  </p>
                  <p className="text-sm text-white/58">
                    Sábados 15.00 a 19.00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Redes */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-red-200/80">
              Comunidad
            </div>

            <h4 className="mt-3 text-xl font-semibold text-white sm:text-2xl">
              Seguinos
            </h4>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/62 sm:text-base">
              Mantenete al día con novedades, horarios, actividades y contenido
              del gym en nuestras redes.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/72 transition-all duration-300 hover:border-red-500/35 hover:bg-red-500/10 hover:text-white"
                  >
                    <Icon className="text-base transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-white/70">
                &copy; {new Date().getFullYear()} Altos Roca Gym. Todos los
                derechos reservados.
              </p>
              <p className="mt-1 text-xs text-white/42 sm:text-sm">
                Entrená con energía, constancia y actitud.
              </p>
            </div>

            <p className="text-xs text-white/48 sm:text-sm">
              Página creada y mantenida por{' '}
              <a
                href="https://softfusion.com.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white transition-colors duration-300 hover:text-red-300"
              >
                SoftFusion
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;