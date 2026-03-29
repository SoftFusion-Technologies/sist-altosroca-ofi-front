import { useState, useEffect } from "react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import routes from "../Routes/Rutas";
import { NavLink } from "react-router-dom";
import { naranja } from "../constants/colores";
import Logo from "../img/Logo.webp";
import ParticlesBackground from "../components/ParticlesBackground";
import {
  FaInfinity,
  FaInstagram,
  FaTiktok,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNav = () => {
    setNav(!nav);
  };

  // Efecto para detectar el scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filtra las rutas que deben mostrarse en la navegación
  const navItems = routes.filter((route) => route.showInNav);
  const activeLinkStyle = {
    color: "#f97316", // Naranja para el enlace activo
  };

  const socialLinks = [
    {
      platform: "Instagram",
      href: "https://www.instagram.com/infinityacademia.ok/",
      icon: FaInstagram,
      size: 22,
    },
    {
      platform: "TikTok",
      href: "https://tiktok.com",
      icon: FaTiktok,
      size: 20,
    },
    {
      platform: "Facebook",
      href: "https://facebook.com",
      icon: FaFacebook,
      size: 20,
    },
    {
      platform: "WhatsApp",
      href: "https://wa.me/NUMERODETELEFONO",
      icon: FaWhatsapp,
      size: 22,
    },
  ];

return (
  <nav
    className={`
      fixed top-0 left-0 w-full z-50 text-gray-100 flex items-center max-w-full mx-auto px-6 border-b
      ${
        nav
          ? "h-24 bg-gray-900 border-gray-700 opacity-100 backdrop-blur-0 transition-none" // Menú mobile abierto: fondo sólido instantáneo
          : scrolled
          ? "h-20 bg-gray-900/80 backdrop-blur-md border-gray-700/50 shadow-lg shadow-black/20 transition-all duration-300 ease-in-out"
          : "h-24 bg-transparent border-transparent transition-all duration-300 ease-in-out"
      }
    `}
  >
    {/* Partículas con opacidad dinámica */}
    <div
      className={`transition-opacity duration-300 ${
        scrolled ? "opacity-30" : "opacity-100"
      }`}
    >
      <ParticlesBackground />
    </div>

    {/* Logo (izquierda) con animación de escala */}
    <NavLink
      to="/"
      className={`flex items-center gap-3 transition-transform duration-300 ${
        scrolled ? "scale-95" : "scale-100"
      }`}
    >
      <img
        src={Logo}
        alt="Infinity Academia Logo"
        className={`w-auto transition-all duration-300 ${
          scrolled ? "h-8" : "h-10"
        }`}
      />
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span
            className={`font-custom-montserrat text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600 transition-all duration-300 ${
              scrolled ? "text-2xl" : "text-3xl"
            }`}
          >
            INFINITY
          </span>
        </div>
        <span
          className={`font-custom-montserrat text-gray-300 text-center transition-all duration-300 ${
            scrolled ? "text-lg" : "text-xl"
          }`}
        >
          Academia
        </span>
      </div>
    </NavLink>

    {/* Ítems centrados (desktop) con efectos mejorados */}
    <ul
      className={`hidden xl:flex items-center gap-10 absolute left-1/2 -translate-x-1/2 transition-all duration-300 ${
        scrolled ? "text-xs" : "text-xs 2xl:text-lg"
      }`}
    >
      {[
        { name: "HORARIOS", path: "/horarios" },
        { name: "SOCIOS", path: "/socios" },
        { name: "ESPACIOS", path: "/espacios" },
        { name: "SUPLEMENTOS", path: "/suplementos" },
      ].map((item) => (
        <li key={item.name} className="relative group">
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              [
                "uppercase tracking-[0.12em] font-semibold transition-all duration-200",
                scrolled
                  ? "text-gray-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.35)]"
                  : "text-gray-200 drop-shadow-[0_0_6px_rgba(200,200,200,0.25)]",
                "group-hover:-translate-y-[1px] group-hover:tracking-[0.14em]",
                isActive ? "opacity-100" : "opacity-90 hover:opacity-100",
              ].join(" ")
            }
          >
            {item.name}
          </NavLink>

          {/* subrayado con efecto mejorado */}
          <span className="pointer-events-none absolute -bottom-1 left-0 w-full h-[2px] bg-gray-600 rounded-full" />
          <span
            className={`pointer-events-none absolute -bottom-1 left-0 h-[2px] w-full rounded-full origin-left scale-x-0 transition-all duration-200 group-hover:scale-x-100 ${
              scrolled ? "bg-gray-100" : "bg-gray-300"
            }`}
          />
        </li>
      ))}
    </ul>

    {/* CTA derecha (desktop) con animación */}
    <div
      className={`ml-auto hidden xl:flex items-center gap-6 transition-all duration-300 ${
        scrolled ? "text-xs" : "text-xs 2xl:text-lg"
      }`}
    >
      <div
        className={`flex items-center transition-all duration-300 ${
          scrolled ? "gap-3" : "gap-4"
        }`}
      >
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-all duration-200 ${
              scrolled
                ? "text-gray-200 hover:text-white hover:scale-110"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <link.icon size={scrolled ? link.size - 2 : link.size} />
          </a>
        ))}
      </div>
      <NavLink to="/clase-prueba">
        <button
          className={`
            font-bold text-gray-900 rounded-md
            bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
            transition-all duration-300
            hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0
            relative overflow-hidden
            ${
              scrolled
                ? "px-4 py-2 text-sm shadow-[0_0_8px_rgba(255,255,255,0.4)]"
                : "px-5 py-2 text-base shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            }
          `}
        >
          <span className="relative z-10 uppercase">
            {scrolled ? "CLASE GRATIS" : "PRIMERA CLASE GRATIS"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </button>
      </NavLink>
    </div>

    {/* Ícono mobile con animación */}
    <div
      onClick={handleNav}
      className={`block xl:hidden ml-auto z-50 transition-all duration-300 ${
        scrolled ? "hover:scale-110" : ""
      }`}
    >
      {nav ? (
        <AiOutlineClose size={scrolled ? 22 : 24} />
      ) : (
        <AiOutlineMenu size={scrolled ? 22 : 24} />
      )}
    </div>

    {/* Menú Mobile - sin cambios significativos */}
    <div
      className={
        nav
          ? "fixed xl:hidden left-0 top-0 w-full h-full bg-gray-900 ease-in-out duration-300 z-[100]"
          : "ease-in-out w-full duration-300 fixed top-0 bottom-0 left-[-100%] z-[100]"
      }
    >
      {/* Botón cerrar menú hamburguesa */}
      {nav && (
        <button
          onClick={handleNav}
          className="absolute top-6 right-6 text-gray-300 hover:text-white text-3xl z-[101] focus:outline-none"
          aria-label="Cerrar menú"
        >
          <AiOutlineClose />
        </button>
      )}
      <NavLink
        to="/"
        onClick={handleNav}
        className="inline-flex items-center gap-2 m-8"
      >
        <img
          src={Logo}
          alt="Infinity Academia Logo"
          className={`w-auto transition-all duration-300 ${
            scrolled ? "h-8" : "h-10"
          }`}
        />
        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
          INFINITY
        </span>
      </NavLink>

      <ParticlesBackground />

      <ul className="p-8 text-center">
        {[
          { name: "INICIO", path: "/" },
          { name: "HORARIOS", path: "/horarios" },
          { name: "SOCIOS", path: "/socios" },
          { name: "ESPACIOS", path: "/espacios" },
          { name: "SUPLEMENTOS", path: "/suplementos" },
        ].map((item) => (
          <li key={item.name} className="p-4 border-b border-gray-600/40">
            <NavLink
              to={item.path}
              onClick={handleNav}
              className="text-2xl font-semibold uppercase tracking-[0.1em]
                   text-gray-200 drop-shadow-[0_0_6px_rgba(200,200,200,0.25)]
                   transition-all duration-200 hover:tracking-[0.12em]"
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="flex justify-center items-center gap-4">
        {socialLinks.map((link) => (
          <a
            key={link.platform}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            <link.icon size={link.size} />
          </a>
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <NavLink to="/clase-prueba" onClick={handleNav}>
          <button
            className="
      px-8 py-3 font-bold text-gray-900 rounded-md text-xl
      bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
      transition-all duration-200 hover:brightness-110
      shadow-[0_0_14px_rgba(255,255,255,0.6)]
    "
          >
            PRIMERA CLASE GRATIS
          </button>
        </NavLink>
      </div>
    </div>
  </nav>
);
};


export default Navbar;
