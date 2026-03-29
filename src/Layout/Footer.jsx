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
import ParticlesBackground from '../components/ParticlesBackground';
import Logo from '../img/Logo.webp';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 28 / 03 / 2026
 * Versión: 2.0
 *
 * Descripción:
 * Footer rediseñado para Altos Roca Gym.
 * Se adapta completamente la identidad visual del proyecto,
 * incorporando marca, redes sociales reales, ubicación, horarios
 * y una estructura más moderna y responsive.
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
    { name: 'Turnos', path: '/turnos' },
    { name: 'Socios', path: '/socios' },
    { name: 'Espacios', path: '/espacios' },
    { name: 'Suplementos', path: '/suplementos' }
  ];

  const quickLinks = [
    { name: 'Reservar turno', path: '/turnos' },
    { name: 'Ver horarios', path: '/horarios' },
    { name: 'Conocer espacios', path: '/espacios' }
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-black text-white">
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_24%),linear-gradient(180deg,#040404_0%,#070708_46%,#030303_100%)]" />

      <div className="pointer-events-none absolute -top-16 -left-20 h-[24rem] w-[24rem] rounded-full bg-red-600/16 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-20 h-[26rem] w-[26rem] rounded-full bg-red-500/12 blur-3xl" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />

      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-12">
          {/* Marca */}
          <div className="xl:col-span-5">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
              <div className="flex items-center gap-4">
                <img
                  src={Logo}
                  alt="Altos Roca Gym Logo"
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_18px_rgba(239,68,68,0.25)]"
                />

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                    Altos Roca Gym
                  </div>
                  <h3 className="mt-1 text-2xl sm:text-3xl font-bignoodle uppercase tracking-[0.05em] text-white">
                    Movimiento real
                  </h3>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-white/72">
                Un espacio para entrenar con actitud, constancia y energía. Gym,
                fútbol, pádel y una comunidad que vive el deporte de verdad.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md">
                  Gym
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md">
                  Fútbol
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md">
                  Pádel
                </span>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="group inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/82 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300 transition-all duration-300 group-hover:scale-105">
                        <Icon className="text-base" />
                      </span>
                      <span className="text-sm font-medium">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navegación */}
          <div className="xl:col-span-3">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] h-full">
              <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                Navegación
              </div>

              <h4 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
                Explorá el sitio
              </h4>

              <ul className="mt-6 space-y-3">
                {navigationLinks.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm sm:text-base text-white/76 transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.06] hover:text-white"
                    >
                      <span>{link.name}</span>
                      <FaArrowRight className="text-xs text-red-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacto / quick access */}
          <div className="xl:col-span-4">
            <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6 sm:p-7 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.42)] h-full">
              <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                Contacto y acceso
              </div>

              <h4 className="mt-2 text-xl sm:text-2xl font-semibold text-white">
                Estamos cerca tuyo
              </h4>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Dirección
                    </div>
                    <div className="mt-1 text-sm sm:text-base text-white/84">
                      Av. Perú y Sarmiento
                    </div>
                    <div className="text-sm text-white/62">
                      Tafí Viejo · Tucumán
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                  <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaClock />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                      Horarios
                    </div>
                    <div className="mt-1 text-sm sm:text-base text-white/84">
                      Lunes a Viernes 8.00 a 22.30
                    </div>
                    <div className="text-sm text-white/62">
                      Sábados 15.00 a 19.00
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                {quickLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                  >
                    <span>{link.name}</span>
                    <FaArrowRight className="text-xs text-red-300 transition-transform duration-300 group-hover:translate-x-1" />
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 rounded-[26px] border border-white/10 bg-white/[0.03] px-5 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm sm:text-base text-white/72">
                &copy; {new Date().getFullYear()} Altos Roca Gym. Todos los
                derechos reservados.
              </p>
              <p className="mt-1 text-xs sm:text-sm text-white/45">
                Entrená con energía, constancia y actitud.
              </p>
            </div>

            <p className="text-xs sm:text-sm text-white/52">
              Página creada y mantenida por{' '}
              <a
                href="https://softfusion.com.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-red-300 transition-colors duration-300"
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
