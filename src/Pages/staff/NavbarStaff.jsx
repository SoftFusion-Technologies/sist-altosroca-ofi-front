/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 29 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Navbar staff rediseñado para alinearlo visualmente con el navbar público
 * de Altos Roca Gym, manteniendo roles, menú mobile, notificaciones
 * y dropdown de usuario.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { logo } from '../../img';
import { useAuth } from '../../AuthContext';
import NotificationBell from './NotificationBell';

const linksDef = [
  {
    id: 1,
    href: 'dashboard',
    title: 'Dashboard',
    roles: ['admin', 'socio', 'vendedor']
  },
  {
    id: 2,
    href: 'dashboard/usuarios',
    title: 'Usuarios',
    roles: ['admin', 'socio']
  },
  {
    id: 3,
    href: 'dashboard/Sedes',
    title: 'Sedes',
    roles: ['admin', 'socio']
  },
  {
    id: 4,
    href: 'dashboard/administracion-colores',
    title: 'Adm. Colores',
    roles: ['admin', 'instructor']
  },
  // {
  //   id: 5,
  //   href: 'dashboard/logs',
  //   title: 'Log de Detalle',
  //   roles: ['admin', 'socio']
  // }
];

const NavbarStaff = () => {
  const { logout, userName, nomyape, userLevel } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);

  const displayUserName = useMemo(() => {
    if (nomyape) return nomyape.trim().split(' ')[0] || '';
    if (!userName) return '';
    if (userName.includes('@')) {
      return userName.substring(0, userName.indexOf('@'));
    }
    return userName.trim().split(' ')[0] || '';
  }, [userName, nomyape]);

  const userInitial = (displayUserName?.[0] || 'U').toUpperCase();

  const filteredLinks = useMemo(
    () => linksDef.filter((l) => l.roles.includes(userLevel)),
    [userLevel]
  );

  const isActive = (href) => pathname.startsWith(`/${href}`);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function onDocClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  const handleLogout = () => {
    logout();
    navigate('/inicio');
  };

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`
          relative border-b text-white
          ${
            scrolled
              ? 'bg-black/88 backdrop-blur-xl border-red-500/18 shadow-[0_12px_36px_rgba(0,0,0,0.35)]'
              : 'bg-black/72 backdrop-blur-lg border-white/8'
          }
        `}
        aria-label="Navegación principal staff"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_72%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-400/60 to-transparent" />

        <div
          className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Marca */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 shrink-0 focus:outline-none"
          >
            <img
              src={logo}
              alt="Altos Roca Gym"
              className={`w-auto object-contain transition-all duration-300 drop-shadow-[0_0_18px_rgba(239,68,68,0.24)] ${
                scrolled ? 'h-11' : 'h-14'
              }`}
            />

            {/* <div className="hidden md:flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.24em] text-red-200/84">
                Altos Roca Gym
              </span>
              <span className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/82">
                Panel Staff
              </span>
            </div> */}
          </Link>

          {/* Links desktop */}
          <ul className="hidden xl:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {filteredLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <li key={link.id} className="relative group">
                  <Link
                    to={`/${link.href}`}
                    className={`
                      relative uppercase tracking-[0.16em] text-sm font-semibold transition-all duration-300
                      ${
                        active
                          ? 'text-red-300'
                          : 'text-white/78 hover:text-white'
                      }
                    `}
                    aria-current={active ? 'page' : undefined}
                  >
                    {link.title}

                    <span className="pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-white/10" />
                    <span
                      className={`
                        pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full origin-left transition-all duration-300
                        ${
                          active
                            ? 'scale-x-100 bg-gradient-to-r from-red-700 via-red-500 to-red-400'
                            : 'scale-x-0 bg-gradient-to-r from-red-700 via-red-500 to-red-400 group-hover:scale-x-100'
                        }
                      `}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Acciones desktop */}
          <div className="hidden xl:flex items-center gap-3">
            {/* <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-200 transition-all duration-300 hover:bg-red-500/18 hover:text-white"
              title="Notificaciones"
            >
              <NotificationBell />
            </button> */}

            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-2 py-1.5 text-left transition-all duration-300 hover:border-red-500/24 hover:bg-red-500/[0.08]"
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-red-700 via-red-500 to-red-400 text-sm font-bold text-white shadow-[0_10px_24px_rgba(239,68,68,0.24)]">
                  {userInitial}
                </span>

                <div className="hidden md:block">
                  <div className="text-xs uppercase tracking-[0.16em] text-white/45">
                    Sesión
                  </div>
                  <div className="text-sm font-medium text-white">
                    {displayUserName || 'Usuario'}
                  </div>
                </div>

                <FiChevronDown className="text-white/55 transition-transform duration-300 group-hover:text-white" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="absolute right-0 mt-3 w-60 rounded-[24px] border border-white/10 bg-[rgba(8,8,10,0.94)] p-3 backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.50)]"
                    role="menu"
                  >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-red-200/84">
                        Altos Roca Gym
                      </p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {displayUserName || 'Usuario'}
                      </p>
                      <p className="mt-1 text-xs capitalize text-white/46">
                        Rol: {userLevel || '—'}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/18 bg-red-500/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-red-100 transition-all duration-300 hover:bg-red-500/18 hover:text-white"
                      role="menuitem"
                    >
                      <FiLogOut />
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile */}
          <div className="xl:hidden flex items-center gap-2">
            {/* <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-200 transition-all duration-300 hover:bg-red-500/18 hover:text-white"
              title="Notificaciones"
            >
              <NotificationBell />
            </button> */}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-200 transition-all duration-300 hover:bg-red-500/18 hover:text-white"
              aria-label="Abrir menú"
            >
              <FiMenu className="text-xl" />
            </button>
          </div>
        </div>

        <div className="pointer-events-none relative z-10">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/45 to-transparent" />
        </div>
      </nav>

      {/* Drawer móvil */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black"
              onClick={() => setDrawerOpen(false)}
            />

            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 240 }}
              className="fixed right-0 top-0 z-[70] flex h-full w-[88%] max-w-sm flex-col overflow-y-auto border-l border-white/10 bg-[linear-gradient(180deg,rgba(8,8,10,0.96),rgba(10,10,12,0.96))] p-4 backdrop-blur-2xl"
              aria-label="Menú móvil staff"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_26%)]" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="Altos Roca Gym"
                    className="h-11 w-auto object-contain rounded-md"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {displayUserName || 'Usuario'}
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.14em] text-white/42">
                      {userLevel || '—'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-200 transition-all duration-300 hover:bg-red-500/18 hover:text-white"
                  aria-label="Cerrar menú"
                >
                  <FiX className="text-xl" />
                </button>
              </div>

              <div className="relative z-10 mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.16em] text-red-200/84">
                  Altos Roca Gym
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  Panel Staff
                </div>
              </div>

              <div className="relative z-10 mt-6">
                <ul className="space-y-2">
                  {filteredLinks.map((link) => {
                    const active = isActive(link.href);

                    return (
                      <li key={link.id}>
                        <Link
                          to={`/${link.href}`}
                          onClick={() => setDrawerOpen(false)}
                          className={`
                            block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300
                            ${
                              active
                                ? 'bg-gradient-to-r from-red-700 via-red-500 to-red-400 text-white shadow-[0_10px_24px_rgba(239,68,68,0.22)]'
                                : 'border border-white/10 bg-white/[0.03] text-white/76 hover:border-red-500/24 hover:bg-red-500/[0.08] hover:text-white'
                            }
                          `}
                          aria-current={active ? 'page' : undefined}
                        >
                          {link.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="relative z-10 mt-auto pt-5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-500 to-red-400 px-4 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_26px_rgba(239,68,68,0.22)] transition-all duration-300 hover:brightness-110"
                >
                  <FiLogOut />
                  Cerrar sesión
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavbarStaff;
