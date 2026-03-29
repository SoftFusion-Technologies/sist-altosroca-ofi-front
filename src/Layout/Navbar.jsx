import { useState, useEffect, useMemo } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import routes from '../Routes/Rutas';
import { NavLink } from 'react-router-dom';
import Logo from '../img/Logo.webp';
import ParticlesBackground from '../components/ParticlesBackground';
import { FaInstagram, FaFacebook, FaWhatsapp } from 'react-icons/fa';

const fallbackNavItems = [
  { label: 'HORARIOS', path: '/horarios' },
  { label: 'TURNOS', path: '/turnos' },
  { label: 'SOCIOS', path: '/socios' },
  { label: 'ESPACIOS', path: '/espacios' },
  { label: 'SUPLEMENTOS', path: '/suplementos' }
];

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNav = () => setNav(!nav);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (nav) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [nav]);

  const navItems = useMemo(() => {
    const itemsFromRoutes = Array.isArray(routes)
      ? routes
          .filter((route) => route.showInNav)
          .map((route) => ({
            label:
              route.navLabel ||
              route.label ||
              route.name ||
              route.title ||
              String(route.path || route.to || '')
                .replace('/', '')
                .toUpperCase(),
            path: route.path || route.to || '/'
          }))
          .filter((item) => item.label && item.path)
      : [];

    return itemsFromRoutes.length ? itemsFromRoutes : fallbackNavItems;
  }, []);

  const mobileItems = useMemo(() => {
    const hasHome = navItems.some((item) => item.path === '/');
    return hasHome ? navItems : [{ label: 'INICIO', path: '/' }, ...navItems];
  }, [navItems]);

  const socialLinks = [
    {
      platform: 'Instagram',
      href: 'https://www.instagram.com/altosroca/',
      icon: FaInstagram,
      size: 22
    },
    {
      platform: 'Facebook',
      href: 'https://www.facebook.com/altosroca.gym/',
      icon: FaFacebook,
      size: 20
    },
    {
      platform: 'WhatsApp',
      href: 'https://wa.me/543814480898',
      icon: FaWhatsapp,
      size: 22
    }
  ];

  return (
    <nav
      className={`
        fixed top-0 left-0 w-full z-50 flex items-center max-w-full mx-auto px-6 border-b
        ${
          nav
            ? 'h-24 bg-black border-red-600/30 shadow-[0_10px_40px_rgba(220,38,38,0.18)]'
            : scrolled
              ? 'h-20 bg-black/85 backdrop-blur-xl border-red-500/20 shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 ease-in-out'
              : 'h-24 bg-transparent border-transparent transition-all duration-300 ease-in-out'
        }
      `}
    >
      {/* Fondo partículas */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            scrolled ? 'opacity-25' : 'opacity-55'
          }`}
        >
          <ParticlesBackground />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_40%),linear-gradient(to_bottom,rgba(0,0,0,0.1),rgba(0,0,0,0.4))]" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex w-full items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className={`flex items-center transition-transform duration-300 ${
            scrolled ? 'scale-95' : 'scale-100'
          }`}
        >
          <img
            src={Logo}
            alt="Altos Roca Gym Logo"
            className={`w-auto object-contain transition-all duration-300 drop-shadow-[0_0_18px_rgba(239,68,68,0.28)] ${
              scrolled ? 'h-12' : 'h-16'
            }`}
          />
        </NavLink>

        {/* Navegación desktop */}
        <ul
          className={`hidden xl:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
            scrolled ? 'text-xs' : 'text-xs 2xl:text-sm'
          }`}
        >
          {navItems.map((item) => (
            <li key={`${item.label}-${item.path}`} className="relative group">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  [
                    'uppercase tracking-[0.18em] font-semibold transition-all duration-200',
                    scrolled
                      ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.10)]'
                      : 'text-white/90 drop-shadow-[0_0_6px_rgba(255,255,255,0.08)]',
                    'group-hover:-translate-y-[1px] group-hover:text-red-300',
                    isActive
                      ? 'text-red-400 opacity-100'
                      : 'opacity-90 hover:opacity-100'
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>

              <span className="pointer-events-none absolute -bottom-2 left-0 w-full h-[2px] rounded-full bg-white/10" />
              <span className="pointer-events-none absolute -bottom-2 left-0 h-[2px] w-full rounded-full origin-left scale-x-0 bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-300 group-hover:scale-x-100" />
            </li>
          ))}
        </ul>

        {/* Acciones desktop */}
        <div
          className={`ml-auto hidden xl:flex items-center gap-6 transition-all duration-300 ${
            scrolled ? 'text-xs' : 'text-xs 2xl:text-sm'
          }`}
        >
          <div
            className={`flex items-center transition-all duration-300 ${
              scrolled ? 'gap-3' : 'gap-4'
            }`}
          >
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className={`transition-all duration-200 ${
                  scrolled
                    ? 'text-white/85 hover:text-red-400 hover:scale-110'
                    : 'text-white/75 hover:text-red-400 hover:scale-110'
                }`}
              >
                <link.icon size={scrolled ? link.size - 1 : link.size} />
              </a>
            ))}
          </div>

          <NavLink to="/turnos">
            <button
              className={`btn-logo ${scrolled ? 'btn-logo--sm' : 'btn-logo--md'}`}
            >
              <span className="btn-logo__text">
                {scrolled ? 'Turnos' : 'Pedir turno'}
              </span>
            </button>
          </NavLink>
        </div>

        {/* Menú mobile */}
        <div
          onClick={handleNav}
          className={`block xl:hidden ml-auto z-[120] text-white cursor-pointer transition-all duration-300 ${
            scrolled ? 'hover:scale-110' : ''
          }`}
        >
          {nav ? (
            <AiOutlineClose size={scrolled ? 24 : 26} />
          ) : (
            <AiOutlineMenu size={scrolled ? 24 : 26} />
          )}
        </div>
      </div>

      {/* Drawer mobile */}
      <div
        className={
          nav
            ? 'fixed xl:hidden left-0 top-0 w-full h-full bg-black z-[110] ease-in-out duration-300'
            : 'fixed top-0 left-[-100%] w-full h-full xl:hidden z-[110] ease-in-out duration-300'
        }
      >
        <div className="absolute inset-0 overflow-hidden">
          <ParticlesBackground />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.22),transparent_38%),linear-gradient(to_bottom,rgba(0,0,0,0.75),rgba(0,0,0,0.96))]" />
        </div>

        <button
          onClick={handleNav}
          className="absolute top-6 right-6 text-white/80 hover:text-red-400 text-3xl z-[120] focus:outline-none"
          aria-label="Cerrar menú"
        >
          <AiOutlineClose />
        </button>

        <div className="relative z-[120] flex flex-col h-full">
          <NavLink
            to="/"
            onClick={handleNav}
            className="inline-flex items-center justify-center m-8"
          >
            <img
              src={Logo}
              alt="Altos Roca Gym Logo"
              className="h-24 sm:h-28 md:h-32 w-auto object-contain drop-shadow-[0_0_22px_rgba(239,68,68,0.35)]"
            />
          </NavLink>

          <ul className="px-8 text-center">
            {mobileItems.map((item) => (
              <li
                key={`${item.label}-${item.path}`}
                className="py-4 border-b border-white/10"
              >
                <NavLink
                  to={item.path}
                  onClick={handleNav}
                  className={({ isActive }) =>
                    [
                      'text-2xl font-semibold uppercase tracking-[0.12em] transition-all duration-200',
                      isActive
                        ? 'text-red-400'
                        : 'text-white/85 hover:text-red-300'
                    ].join(' ')
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="mt-auto pb-10">
            <div className="flex justify-center items-center gap-5 mb-8">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className="text-white/75 hover:text-red-400 transition-colors"
                >
                  <link.icon size={link.size} />
                </a>
              ))}
            </div>

            <div className="flex justify-center">
              <NavLink to="/turnos" onClick={handleNav}>
                <button className="btn-logo btn-logo--lg">
                  <span className="btn-logo__text">Pedir turno</span>
                </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
