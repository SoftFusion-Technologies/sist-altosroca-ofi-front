// NavbarStaff.jsx — versión moderna “glass”
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiBell, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { logo } from '../../img';
import { useAuth } from '../../AuthContext';
 import NotificationBell from './NotificationBell'; // si ya lo tenés, descomenta

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
    roles: ['admin', 'instructor'] // Benjamin Orellana INI / 12/06/2024 /nueva forma de gestionar los accesos
  },
  {
    id:5,
    href: 'dashboard/logs',
    title: 'Log de Detalle',
    roles: ['admin', 'socio']
  }
];

const NavbarStaff = () => {
  const { logout, userName, nomyape, userLevel } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Derivar nombre para saludo/avatar
  const displayUserName = useMemo(() => {
    if (nomyape) return nomyape.trim().split(' ')[0] || '';
    if (!userName) return '';
    if (userName.includes('@'))
      return userName.substring(0, userName.indexOf('@'));
    return userName.trim().split(' ')[0] || '';
  }, [userName, nomyape]);

  const userInitial = (displayUserName?.[0] || 'U').toUpperCase();

  // Navegación visible por rol
  const filteredLinks = useMemo(
    () => linksDef.filter((l) => l.roles.includes(userLevel)),
    [userLevel]
  );

  // Activo por ruta
  const isActive = (href) => pathname.startsWith(`/${href}`);

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    // Cerrar user menu al click fuera
    function onDocClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/inicio');
  };

  // hook de bloqueo de scroll del body
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* barra “glass aurora” */}
      <nav
        className="
      relative
      border-b border-white/10
      bg-[linear-gradient(180deg,rgba(10,12,28,.65),rgba(10,12,28,.55))]
      before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(60%_100%_at_50%_-10%,rgba(252,75,8,.20),transparent_60%)]
      backdrop-blur-xl
      text-gray-100
    "
        aria-label="Navegación principal"
      >
        {/* brillo superior sutil */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* logo + marca */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="shrink-0 focus:outline-none focus:ring-2 focus:ring-[#b61254]/50 rounded-lg"
            >
              <img
                src={logo}
                alt="Infinity Logo"
                className="h-10 w-auto rounded-md shadow-sm ring-1 ring-white/15"
              />
            </Link>
            <span className="hidden sm:inline-block text-sm text-gray-300/90 tracking-wide">
              Panel Staff
            </span>
          </div>

          {/* links desktop */}
          <ul className="hidden lg:flex items-center gap-2">
            {filteredLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.id} className="relative">
                  <Link
                    to={`/${link.href}`}
                    className="
                  group relative px-3 py-2 rounded-xl text-sm
                  transition
                  focus:outline-none focus:ring-2 focus:ring-[#b61254]/50
                "
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={
                        active
                          ? 'text-white font-semibold'
                          : 'text-gray-300 group-hover:text-white'
                      }
                    >
                      {link.title}
                    </span>

                    {/* shimmer rápido al hover */}
                    <span
                      aria-hidden
                      className="
                    absolute left-[-60%] top-1/2 h-[2px] w-[220%]
                    bg-gradient-to-r from-transparent to-transparent
                    -translate-y-1/2 -skew-x-12 opacity-0
                    group-hover:opacity-100
                  "
                      style={{ animation: 'ray 1.1s ease-in-out' }}
                    />

                    {/* indicador animado + gradiente naranja */}
                    <AnimatePresence>
                      {active && (
                        <motion.span
                          layoutId="active-pill"
                          className="
                        absolute inset-0 -z-10 rounded-xl
                        bg-gradient-to-r from-[#b61254]/25 via-[#ff7a3d]/20 to-transparent
                        ring-1 ring-[#b61254]/25
                      "
                          transition={{
                            type: 'spring',
                            bounce: 0.25,
                            duration: 0.5
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* subrayado de acento en hover */}
                    <span
                      aria-hidden
                      className="
                    absolute inset-x-2 -bottom-[2px] h-[2px] rounded-full
                    bg-gradient-to-r from-transparent via-[#b61254] to-transparent
                    opacity-0 group-hover:opacity-100 transition
                  "
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* acciones derecha desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              type="button"
              className="
            relative inline-flex items-center justify-center h-9 w-9
            rounded-xl bg-[#b61254]/10 ring-1 ring-[#b61254]/25
            hover:bg-[#b61254]/20 text-[#ffb28e]
            transition focus:outline-none focus:ring-2 focus:ring-[#b61254]/50
          "
              title="Notificaciones"
            >
              <NotificationBell></NotificationBell>
            </button>

            {/* avatar + menú usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((v) => !v)}
                className="
              group flex items-center gap-2 pl-1 pr-2 py-1
              rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/[0.12]
              transition focus:outline-none focus:ring-2 focus:ring-[#b61254]/50
            "
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span
                  aria-hidden
                  className="
                grid place-items-center h-8 w-8 rounded-full
                bg-gradient-to-br from-[#b61254] to-[#ff7a3d]
                text-white font-bold text-sm ring-1 ring-white/20
                shadow-[0_8px_24px_rgba(252,75,8,.25)]
              "
                >
                  {userInitial}
                </span>
                <span className="hidden md:block text-sm text-white">
                  {displayUserName || 'Usuario'}
                </span>
                <FiChevronDown className="text-gray-300 group-hover:text-white transition" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.16 }}
                    className="
                  absolute right-0 mt-2 w-56
                  rounded-2xl bg-[rgba(17,20,40,0.95)] backdrop-blur-xl
                  border border-white/10 shadow-2xl p-2
                "
                    role="menu"
                  >
                    <div className="px-3 py-2">
                      <p className="text-xs text-gray-400">Sesión</p>
                      <p className="text-sm text-white font-medium">
                        {displayUserName || 'Usuario'}
                      </p>
                      <p className="text-[11px] text-gray-400 capitalize">
                        Rol: {userLevel || '—'}
                      </p>
                    </div>
                    <div className="my-2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    <button
                      onClick={handleLogout}
                      className="
                    w-full inline-flex items-center gap-2 px-3 py-2
                    rounded-xl text-sm
                    bg-gradient-to-r from-[#ff3d3d1a] to-[#b612541a]
                    hover:from-[#ff3d3d2b] hover:to-[#b6125430]
                    text-rose-100 hover:text-white
                    transition
                  "
                      role="menuitem"
                    >
                      <FiLogOut /> Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* botón burger móvil */}
          <div className="lg:hidden flex items-center">
            <NotificationBell></NotificationBell>

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="
            inline-flex items-center justify-center h-10 w-10 rounded-xl
            bg-[#b61254]/10 ring-1 ring-[#b61254]/25
            hover:bg-[#b61254]/20 transition
            focus:outline-none focus:ring-2 focus:ring-[#b61254]/50
          "
              aria-label="Abrir menú"
            >
              <FiMenu className="text-white text-xl" />
            </button>
          </div>
        </div>

        {/* sombra inferior sutil + barra de acento */}
        <div className="relative">
          <div className="pointer-events-none h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="pointer-events-none h-[2px] w-full bg-gradient-to-r from-transparent via-[#b61254]/60 to-transparent" />
        </div>
      </nav>

      {/* Drawer móvil */}
      {/* Drawer móvil */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-[60]"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Panel */}
            <motion.aside
              key="panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 22, stiffness: 240 }}
              className="
          fixed right-0 top-0 h-full w-[86%] max-w-sm z-[70]
          bg-[linear-gradient(160deg,rgba(15,18,36,.95),rgba(15,18,36,.9))]
          before:absolute before:inset-0
          before:bg-[radial-gradient(60%_100%_at_50%_-10%,rgba(252,75,8,.18),transparent_60%)]
          before:pointer-events-none              /* 👈 no bloquea taps */
          backdrop-blur-xl
          border-l border-white/10
          p-4 flex flex-col
          overflow-y-auto overscroll-contain     /* 👈 scroll interno */
          [ -webkit-overflow-scrolling:touch ]   /* 👈 suaviza iOS (Tailwind JIT)
        "
              aria-label="Menú móvil"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={logo}
                    alt="infinity logo"
                    className="h-9 w-9 rounded-md ring-1 ring-white/10"
                  />
                  <div>
                    <p className="text-white font-semibold leading-5">
                      {displayUserName || 'Usuario'}
                    </p>
                    <p className="text-gray-300 text-xs capitalize">
                      Rol: {userLevel || '—'}
                    </p>
                  </div>
                </div>

                <button
                  type="button" /* 👈 */
                  onClick={() => setDrawerOpen(false)}
                  className="
              inline-flex h-10 w-10 items-center justify-center rounded-xl
              bg-[#b61254]/10 ring-1 ring-[#b61254]/25 hover:bg-[#b61254]/20
              focus:outline-none focus:ring-2 focus:ring-[#b61254]/50
            "
                  aria-label="Cerrar menú"
                >
                  <FiX className="text-white text-xl" />
                </button>
              </div>

              <div className="mt-6">
                <ul className="space-y-1">
                  {filteredLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.id}>
                        <Link
                          to={`/${link.href}`}
                          onClick={() => setDrawerOpen(false)}
                          className={`
                      block px-3 py-3 rounded-xl text-sm transition
                      ${
                        active
                          ? 'bg-[#b61254]/20 text-white font-semibold ring-1 ring-[#b61254]/30'
                          : 'text-gray-200 hover:text-white hover:bg-white/5'
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

              <div className="mt-auto pt-4 border-t border-white/10">
                <button
                  type="button" /* 👈 */
                  onClick={handleLogout}
                  className="
              w-full inline-flex items-center justify-center gap-2
              rounded-xl px-4 py-3
              bg-gradient-to-r from-[#b61254] to-[#ff7a3d]
              hover:from-[#ff6a28] hover:to-[#ff8c52]
              text-white font-semibold
              shadow-lg shadow-[rgba(252,75,8,.25)]
              focus:outline-none focus:ring-2 focus:ring-[#b61254]/50
            "
                >
                  <FiLogOut className="text-white" />
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
