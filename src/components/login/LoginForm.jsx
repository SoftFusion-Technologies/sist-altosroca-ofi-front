/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 28 / 03 / 2026
 * Versión: 3.0
 *
 * Descripción:
 * Form de login rediseñado para Altos Roca Gym con dos modos:
 *  - Staff (email + password) -> /login
 *  - Alumno (teléfono + DNI)  -> /soyalumno
 * Mantiene la lógica existente de autenticación, modal de error,
 * video de fondo, particles y AuthContext, pero adapta por completo
 * la experiencia visual al lenguaje rojo/negro del proyecto.
 */

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Alerta from '../Error';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import '../../Styles/login.css';
import { useAuth } from '../../AuthContext';
import { motion } from 'framer-motion';
import {
  FaEye,
  FaEyeSlash,
  FaDumbbell,
  FaUserShield,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import ParticlesBackground from '../ParticlesBackground';
import VideoLogin from '../../img/staff/videoBienvenida.mp4';
import Logo from '../../img/Logo.webp';

Modal.setAppElement('#root');

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAlumno = location.pathname === '/soyalumno';

  const { login, loginAlumno } = useAuth();

  const [values, setValues] = useState({
    email: '',
    password: '',
    telefono: '',
    dni: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const element = document.getElementById('login');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (isAlumno) localStorage.setItem('userLevel', 'alumno');
  }, [isAlumno]);

  const toggleShowPassword = () => setShowPassword((s) => !s);

  const handleInput = (event) => {
    setValues((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = Validation(values, location.pathname);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    setLoading(true);

    const endpoint = isAlumno
      ? 'http://localhost:8080/loginAlumno'
      : 'http://localhost:8080/login';

    const payload = isAlumno
      ? { telefono: values.telefono, dni: values.dni }
      : { email: values.email, password: values.password };

    axios
      .post(endpoint, payload)
      .then((res) => {
        setLoading(false);

        if (res?.data?.message === 'Success') {
          if (isAlumno) {
            loginAlumno(res.data.token, res.data.nomyape, res.data.id);
            localStorage.setItem('userLevel', 'alumno');
            navigate(`/miperfil/student/${res.data.id}`);
          } else {
            login(
              res.data.token,
              res.data.id,
              res.data.nombre,
              res.data.email,
              res.data.rol,
              res.data.local_id,
              res.data.es_reemplazante ?? false
            );
            localStorage.setItem('userLevel', res.data.rol);
            navigate('/dashboard');
          }
        } else {
          setModalMessage(
            res?.data?.error || 'Usuario o credenciales inválidas'
          );
          setIsModalOpen(true);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error('LOGIN ERROR', err);
        setModalMessage('Error al conectar con el servidor');
        setIsModalOpen(true);
      });
  };

  return (
    <div
      id="login"
      className="relative min-h-screen w-full overflow-hidden bg-black text-white"
    >
      {/* VIDEO DE FONDO */}
      <video
        className="absolute inset-0 h-full w-full object-cover z-0"
        src={VideoLogin}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      {/* OVERLAYS */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.20),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0.70)_52%,rgba(0,0,0,0.86)_100%)]" />
      <div
        className="absolute inset-0 z-[3] opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
          backgroundSize: '42px 42px'
        }}
      />
      <div className="absolute -top-16 -left-16 z-[3] h-[26rem] w-[26rem] rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute bottom-0 -right-16 z-[3] h-[28rem] w-[28rem] rounded-full bg-red-500/14 blur-3xl" />

      {/* PARTICLES */}
      <div className="absolute inset-0 z-[4] pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* ORBITAS SUAVES */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
        <div className="absolute left-1/2 top-[26%] size-[54vmin] max-h-[480px] max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-[26%] size-[40vmin] max-h-[360px] max-w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/16" />
      </div>

      <div className="relative z-20 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="grid w-full overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] shadow-[0_24px_80px_rgba(0,0,0,0.52)] backdrop-blur-2xl lg:grid-cols-[1.08fr_0.92fr]"
        >
          {/* PANEL IZQUIERDO */}
          <div className="relative overflow-hidden border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent lg:hidden" />
            <div className="absolute inset-y-0 right-0 hidden w-[3px] bg-gradient-to-b from-transparent via-red-400/70 to-transparent lg:block" />
            <div className="absolute -top-14 left-8 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative z-10">
              <div className="flex items-center gap-4">
                <img
                  src={Logo}
                  alt="Altos Roca Gym"
                  className="h-16 sm:h-20 w-auto object-contain drop-shadow-[0_0_18px_rgba(239,68,68,0.25)]"
                />

                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                    Altos Roca Gym
                  </div>
                  <h1 className="mt-1 font-bignoodle text-3xl sm:text-4xl uppercase tracking-[0.05em] text-white">
                    Ingreso seguro
                  </h1>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-white/72">
                Accedé a tu espacio de trabajo o a tu perfil de alumno con una
                experiencia visual totalmente integrada a la identidad de Altos
                Roca Gym.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {['Gym', 'Fútbol', 'Pádel', 'Comunidad'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-white/82 backdrop-blur-md"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-black/25 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Ubicación
                  </div>
                  <div className="mt-1 text-sm text-white/84">
                    Av. Perú y Sarmiento
                  </div>
                  <div className="text-sm text-white/62">
                    Tafí Viejo · Tucumán
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-black/25 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                    <FaClock />
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/45">
                    Horarios
                  </div>
                  <div className="mt-1 text-sm text-white/84">
                    Lunes a Viernes 8.00 a 22.30
                  </div>
                  <div className="text-sm text-white/62">
                    Sábados 15.00 a 19.00
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  'Acceso rápido para staff y alumnos',
                  'Diseño visual alineado a Altos Roca Gym',
                  'Ingreso simple y claro según el perfil'
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/18 bg-red-500/10 text-red-300">
                      <FaCheckCircle className="text-xs" />
                    </div>
                    <span className="text-sm text-white/82">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://wa.me/543814480898"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <button className="btn-logo btn-logo--md min-w-[220px]">
                    <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                      WhatsApp
                      <FaWhatsapp className="text-sm" />
                    </span>
                  </button>
                </a>

                <NavLink
                  to="/"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/88 backdrop-blur-md transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
                >
                  Volver al inicio
                </NavLink>
              </div>
            </div>
          </div>

          {/* PANEL DERECHO / FORM */}
          <div className="relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />
            <div className="absolute -top-16 right-6 h-36 w-36 rounded-full bg-red-500/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-md">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                    Acceso
                  </div>
                  <h2 className="mt-1 text-2xl sm:text-3xl font-semibold text-white">
                    {isAlumno ? 'Ingreso de alumno' : 'Ingreso de staff'}
                  </h2>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                    isAlumno
                      ? 'border-red-500/18 bg-red-500/10 text-red-300'
                      : 'border-white/10 bg-white/5 text-white/86'
                  }`}
                >
                  {isAlumno ? <FaUserGraduate /> : <FaUserShield />}
                </div>
              </div>

              <p className="mb-6 text-sm sm:text-base text-white/64">
                {isAlumno
                  ? 'Ingresá tu teléfono y DNI para acceder a tu perfil.'
                  : 'Ingresá tus credenciales para acceder al panel interno.'}
              </p>

              <div className="mb-6 flex rounded-2xl border border-white/10 bg-black/25 p-1">
                <NavLink
                  to="/login"
                  className={`flex-1 rounded-[14px] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                    !isAlumno
                      ? 'bg-white text-black'
                      : 'text-white/72 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Staff
                </NavLink>

                <NavLink
                  to="/soyalumno"
                  className={`flex-1 rounded-[14px] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 ${
                    isAlumno
                      ? 'bg-gradient-to-r from-red-700 via-red-500 to-red-400 text-white'
                      : 'text-white/72 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Alumno
                </NavLink>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Campo 1 */}
                <div>
                  <label
                    htmlFor={isAlumno ? 'telefono' : 'email'}
                    className="mb-2 block text-sm font-medium text-white/82"
                  >
                    {isAlumno ? 'Teléfono' : 'Correo electrónico'}
                  </label>

                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    id={isAlumno ? 'telefono' : 'email'}
                    type={isAlumno ? 'text' : 'email'}
                    name={isAlumno ? 'telefono' : 'email'}
                    value={isAlumno ? values.telefono : values.email}
                    placeholder={
                      isAlumno ? 'Ej: 3811234567' : 'ejemplo@correo.com'
                    }
                    className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:border-red-500/30 focus:bg-red-500/[0.05]"
                    onChange={handleInput}
                  />

                  {isAlumno
                    ? errors.telefono && <Alerta>{errors.telefono}</Alerta>
                    : errors.email && <Alerta>{errors.email}</Alerta>}
                </div>

                {/* Campo 2 */}
                <div>
                  <label
                    htmlFor={isAlumno ? 'dni' : 'password'}
                    className="mb-2 block text-sm font-medium text-white/82"
                  >
                    {isAlumno ? 'DNI' : 'Contraseña'}
                  </label>

                  <div className="relative">
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      id={isAlumno ? 'dni' : 'password'}
                      type={
                        isAlumno ? 'text' : showPassword ? 'text' : 'password'
                      }
                      name={isAlumno ? 'dni' : 'password'}
                      value={isAlumno ? values.dni : values.password}
                      placeholder={
                        isAlumno ? 'Documento de identidad' : '••••••••'
                      }
                      className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 pr-12 text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:border-red-500/30 focus:bg-red-500/[0.05]"
                      onChange={handleInput}
                    />

                    {!isAlumno && (
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors duration-300 hover:text-white"
                        aria-label={
                          showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                        }
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    )}
                  </div>

                  {isAlumno
                    ? errors.dni && <Alerta>{errors.dni}</Alerta>
                    : errors.password && <Alerta>{errors.password}</Alerta>}
                </div>

                <div className="pt-2">
                  {loading ? (
                    <button
                      type="submit"
                      disabled
                      className="w-full rounded-2xl bg-white/15 px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white/70 cursor-not-allowed"
                    >
                      Ingresando...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn-logo btn-logo--lg w-full"
                    >
                      <span className="btn-logo__text inline-flex items-center justify-center gap-2">
                        {isAlumno
                          ? 'Ingresar a mi perfil'
                          : 'Ingresar al panel'}
                        <FaArrowRight className="text-sm" />
                      </span>
                    </button>
                  )}
                </div>
              </form>

              <p className="mt-6 text-center text-xs sm:text-sm italic text-white/42">
                {isAlumno
                  ? 'Tu progreso empieza con cada ingreso'
                  : 'La constancia supera al talento'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MODAL DE ERROR */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Error Modal"
        className="flex h-screen items-center justify-center p-4"
        overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[999]"
      >
        <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0a0a0b] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.60)]">
          <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
            Altos Roca Gym
          </div>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Error de acceso
          </h2>
          <p className="mt-4 text-white/72">{modalMessage}</p>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/88 transition-all duration-300 hover:border-red-500/28 hover:bg-red-500/10 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoginForm;
