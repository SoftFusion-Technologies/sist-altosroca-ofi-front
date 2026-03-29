import React from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  const socialLinks = [
    { icon: <FaInstagram />, href: "#", name: "Instagram" },
    { icon: <FaFacebookF />, href: "#", name: "Facebook" },
    { icon: <FaTiktok />, href: "#", name: "Tiktok" },
    { icon: <FaWhatsapp />, href: "#", name: "Whatsapp" },
  ];

  const sections = [
    {
      title: "Navegación",
      links: [
        { name: "Socios", path: "/socios" },
        { name: "Espacios", path: "/espacios" },
        { name: "Suplementos", path: "/suplementos" },
        { name: "Horarios", path: "/horarios" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Política de Privacidad", path: "/privacy" },
        { name: "Términos de Uso", path: "/terms" },
        { name: "Contacto", path: "/contact" },
      ],
    },
  ];

  return (
    <footer className="relative bg-black text-gray-400">
      {/* Borde superior con gradiente metálico */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent" />

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Columna del Logo y Redes Sociales */}
          <div className="space-y-6">
            <NavLink to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400">
              INFINITY
            </NavLink>
            <p className="text-sm text-slate-500">
              Forjando tu mejor versión, un día a la vez.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-slate-500 hover:text-white transition-colors duration-300"
                  aria-label={social.name}
                >
                  {React.cloneElement(social.icon, { size: 20 })}
                </a>
              ))}
            </div>
          </div>

          {/* Columnas de Links */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <NavLink
                      to={link.path}
                      className="text-base text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Columna de Contacto */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3 text-base text-slate-400">
              <li>Lamadrid 986 - Tucumán</li>
              <li>L-V: 7:00 a 22:00 hs</li>
              <li>contacto@infinity.com</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 border-t border-neutral-800 pt-8 text-center">
          <p className="text-base text-slate-500">
            &copy; {new Date().getFullYear()} INFINITY Academia. Todos los
            derechos reservados.
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Página creada y mantenida por{" "}
            <a
              href="https://softfusion.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-slate-300 transition-colors duration-300"
            >
              SoftFusion
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;