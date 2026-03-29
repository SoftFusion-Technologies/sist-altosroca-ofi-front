/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 29 / 03 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Form de ingreso simplificado y optimizado para mobile.
 * Se separa visualmente el acceso de Staff (/login) del acceso
 * de Alumno (/soyalumno), evitando tabs o bloques compartidos.
 * Se mantiene la lógica existente de autenticación, modal de error,
 * video de fondo, particles y AuthContext, pero con una interfaz
 * mucho más limpia, compacta y responsive.
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
  FaUserShield,
  FaUserGraduate,
  FaArrowRight,
  FaWhatsapp
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
      className="relative min-h-screen overflow-hidden bg-black text-white"
    >
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src={VideoLogin}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(0,0,0,0.50)_0%,rgba(0,0,0,0.68)_45%,rgba(0,0,0,0.88)_100%)]" />
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.16),transparent_26%)]" />

      <div className="pointer-events-none absolute inset-0 z-[3]">
        <ParticlesBackground />
      </div>

      <div className="pointer-events-none absolute -top-20 left-1/2 z-[2] h-72 w-72 -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-[2] h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0b]/85 shadow-[0_24px_70px_rgba(0,0,0,0.55)] backdrop-blur-xl">
            <div className="h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-red-400" />

            <div className="p-5 sm:p-7">
              <div className="flex flex-col items-center text-center">
                <img
                  src={Logo}
                  alt="Altos Roca Gym"
                  className="h-16 w-auto object-contain sm:h-20"
                />

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200">
                  {isAlumno ? <FaUserGraduate /> : <FaUserShield />}
                  {isAlumno ? 'Acceso alumno' : 'Acceso staff'}
                </div>

                <h1 className="titulo uppercase mt-4 text-2xl font-semibold text-white sm:text-3xl">
                  {isAlumno ? 'Ingresá a tu perfil' : 'Ingresá al panel'}
                </h1>

                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/62">
                  {isAlumno
                    ? 'Accedé con tu teléfono y DNI.'
                    : 'Accedé con tu correo y contraseña.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-500/30 focus:bg-red-500/[0.05]"
                    onChange={handleInput}
                  />

                  {isAlumno
                    ? errors.telefono && <Alerta>{errors.telefono}</Alerta>
                    : errors.email && <Alerta>{errors.email}</Alerta>}
                </div>

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
                      className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pr-12 text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-500/30 focus:bg-red-500/[0.05]"
                      onChange={handleInput}
                    />

                    {!isAlumno && (
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 transition-colors duration-300 hover:text-white"
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
                      className="w-full cursor-not-allowed rounded-2xl bg-white/15 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white/70"
                    >
                      Ingresando...
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-gradient-to-r from-red-700 via-red-500 to-red-400 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(239,68,68,0.28)] transition-all duration-300 hover:scale-[1.01]"
                    >
                      <span className="titulo uppercase inline-flex items-center justify-center gap-2">
                        {isAlumno
                          ? 'Ingresar a mi perfil'
                          : 'Ingresar al panel'}
                        <FaArrowRight className="text-sm" />
                      </span>
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-center">
                <NavLink
                  to={isAlumno ? '/login' : '/soyalumno'}
                  className="inline-flex items-center gap-2 text-sm text-white/62 transition-colors duration-300 hover:text-white"
                >
                  {isAlumno
                    ? '¿Sos staff? Ingresá acá'
                    : '¿Sos alumno? Ingresá acá'}
                  <FaArrowRight className="text-[11px]" />
                </NavLink>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <NavLink
                    to="/"
                    className="text-sm text-white/46 transition-colors duration-300 hover:text-white"
                  >
                    Volver al inicio
                  </NavLink>

                  <span className="hidden text-white/18 sm:inline">•</span>

                  <a
                    href="https://wa.me/543814480898"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/46 transition-colors duration-300 hover:text-white"
                  >
                    WhatsApp
                    <FaWhatsapp className="text-xs" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Error Modal"
        className="flex h-screen items-center justify-center p-4"
        overlayClassName="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
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
