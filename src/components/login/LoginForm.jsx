/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 21 / 06 / 2025
 * Versión: 2.0 (unificado: staff + alumno)
 *
 * Descripción:
 * Form de login con dos modos:
 *  - Staff (email + password) -> /login
 *  - Alumno (teléfono + DNI)  -> /soyalumno
 * Detecta por ruta actual con useLocation. Mantiene fondo de video, Particles,
 * modal de error, y añade loginAlumno en AuthContext.
 */

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Alerta from '../Error';
import { useNavigate, useLocation } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import '../../Styles/login.css';
import { useAuth } from '../../AuthContext';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ParticlesBackground from '../ParticlesBackground';
import VideoLogin from '../../img/staff/videoBienvenida.mp4';

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

  // Scroll al montar
  useEffect(() => {
    const element = document.getElementById('login');
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Limpia marca previa de nivel si se abre modo alumno
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

    // debug opcional
    // console.log('validationErrors', validationErrors);

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
            // ✅ pasar todos los argumentos esperados
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
          // manejar Fail del backend (asegúrate de devolver {message:'Fail'})
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
      className="h-screen w-full flex items-center justify-center bg-cover bg-center relative"
    >
      {/* VIDEO DE FONDO */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={VideoLogin}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
      />

      {/* PARTICLES */}
      <div className="absolute inset-0 z-[5] pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* CAPA OSCURA */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10" />

      {/* TARJETA / FORMULARIO */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        whileHover={{
          scale: 1.01,
          boxShadow: '0 8px 30px rgba(202,215,215,0.3)'
        }}
        className="relative z-20 bg-white shadow-2xl rounded-2xl p-8 w-[95%] max-w-md mx-auto"
      >
        <h1 className="uppercase text-5xl font-bignoodle font-bold text-center text-gray-600 mb-2">
          {isAlumno ? 'Bienvenido Alumno' : 'Bienvenido'}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center text-sm text-gray-500 mb-6"
        >
          {isAlumno
            ? 'Ingresá tu teléfono y DNI para entrar a tu perfil'
            : 'Iniciá sesión para acceder al panel'}
        </motion.p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo 1: Email o Teléfono */}
          <div>
            <label
              htmlFor={isAlumno ? 'telefono' : 'email'}
              className="block text-sm font-medium text-gray-700"
            >
              {isAlumno ? 'Teléfono' : 'Correo Electrónico'}
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              id={isAlumno ? 'telefono' : 'email'}
              type={isAlumno ? 'text' : 'email'}
              name={isAlumno ? 'telefono' : 'email'}
              placeholder={isAlumno ? 'Ej: 3811234567' : 'ejemplo@correo.com'}
              className="w-full mt-1 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
              onChange={handleInput}
            />
            {isAlumno
              ? errors.telefono && <Alerta>{errors.telefono}</Alerta>
              : errors.email && <Alerta>{errors.email}</Alerta>}
          </div>

          {/* Campo 2: DNI o Password */}
          <div>
            <label
              htmlFor={isAlumno ? 'dni' : 'password'}
              className="block text-sm font-medium text-gray-700"
            >
              {isAlumno ? 'DNI' : 'Contraseña'}
            </label>
            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                id={isAlumno ? 'dni' : 'password'}
                type={isAlumno ? 'text' : showPassword ? 'text' : 'password'}
                name={isAlumno ? 'dni' : 'password'}
                placeholder={isAlumno ? 'Documento de Identidad' : '••••••••'}
                className="w-full mt-1 p-3 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all pr-10"
                onChange={handleInput}
              />
              {!isAlumno && (
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-600"
                  aria-label={
                    showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
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

          {/* Botón */}
          <div className="text-center">
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-lg shadow-md transition-all
    ${
      loading
        ? 'bg-gray-400 cursor-not-allowed'
        : 'bg-gray-500 hover:bg-[#8d9695] text-white'
    }
  `}
            >
              {loading ? 'Ingresando…' : 'Iniciar Sesión'}
            </motion.button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400 italic">
          {isAlumno
            ? 'El esfuerzo de hoy es el éxito de mañana'
            : 'La constancia supera al talento'}
        </p>
      </motion.div>

      {/* MODAL DE ERROR */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Error Modal"
        className="flex justify-center items-center h-screen"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Error</h2>
          <p>{modalMessage}</p>
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LoginForm;
