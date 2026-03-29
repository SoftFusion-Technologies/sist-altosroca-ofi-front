import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavbarStaff from './NavbarStaff.jsx';
import '../../Styles/staff/dashboard.css';
import '../../Styles/staff/background.css';
import { useAuth } from '../../AuthContext';
import { motion } from 'framer-motion';
import CardRecaptacion from './Components/CardRecaptacion';
import BadgeAgendaVentas from './Components/BadgeAgendaVentas';
import ParticlesBackground from '../../components/ParticlesBackground.jsx';
import BadgeTestClasses from '../MetodosGets/Leads/BadgeTestClasses.jsx';

const AdminPage = () => {
  const { userId, userLevel, userName } = useAuth();
  // Evita que el componente se renderice hasta que userLevel esté definido
  if (!userLevel) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <p className="text-lg font-semibold">Cargando...</p>

        {/* Si tarda demasiado en cargar, mostramos un mensaje de error */}
        <p className="text-sm text-gray-500 mt-2">
          Si esto toma demasiado tiempo, intenta recargar la página.
        </p>

        {/* Botón para recargar la página */}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
        >
          Recargar
        </button>

        {/* Mensaje de contacto si el problema persiste */}
        <p className="text-sm text-gray-500 mt-2">
          Si el problema continúa, contacta a los administradores de{' '}
          <span className="font-semibold text-purple-600">SoftFusion</span>.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Navbar section */}
      <NavbarStaff />
      {/* Hero section*/}
      <section className="relative w-full min-h-screen mx-auto bg-white">
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#12121b] to-[#1a1a2e]">
          <ParticlesBackground></ParticlesBackground>
          <div className="xl:px-0 titulo sm:px-16 px-6 max-w-7xl mx-auto grid grid-cols-2 max-sm:grid-cols-1 max-md:gap-y-10 md:gap-10 py-28 sm:pt-44 lg:pt-28 md:w-5/6 ">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative overflow-visible bg-white font-bignoodle
             w-[250px] h-[100px] text-[20px]
             lg:w-[400px] lg:h-[150px] lg:text-[30px]
             mx-auto flex justify-center items-center
             rounded-tr-xl rounded-bl-xl"
            >
              {/* 🔴 Badge de Test Classes (pendientes) */}
              <BadgeTestClasses
                userId={userId}
                userLevel={userLevel}
                size="lg"
              />

              <Link to="/dashboard/leads">
                <button className="btnstaff">Leads y Prospectos</button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="relative overflow-visible bg-white font-bignoodle
                 w-[250px] h-[100px] text-[20px]
                 lg:w-[400px] lg:h-[150px] lg:text-[30px]
                 mx-auto flex justify-center items-center
                 rounded-tr-xl rounded-bl-xl"
            >
              {/* 🔔 grande y pegado al borde */}
              <BadgeAgendaVentas
                userId={userId}
                userLevel={userLevel}
                size="lg"
              />

              <Link to="/dashboard/ventas">
                <button className="btnstaff flex items-center gap-2">
                  Ventas
                </button>
              </Link>
            </motion.div>

            <CardRecaptacion
              userLevel={userLevel}
              userId={userId}
              // mes={mesActual}
              // anio={anioActual}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="relative overflow-visible bg-white font-bignoodle
                 w-[250px] h-[100px] text-[20px]
                 lg:w-[400px] lg:h-[150px] lg:text-[30px]
                 mx-auto flex justify-center items-center
                 rounded-tr-xl rounded-bl-xl"
            >
              <Link to="/dashboard/ejercicios">
                <button className="btnstaff">Ejercicios</button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.0 }}
              className="relative overflow-visible bg-white font-bignoodle
                 w-[250px] h-[100px] text-[20px]
                 lg:w-[400px] lg:h-[150px] lg:text-[30px]
                 mx-auto flex justify-center items-center
                 rounded-tr-xl rounded-bl-xl"
            >
              <Link to="/dashboard/alumnos">
                <button className="btnstaff">Alumnos</button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.2 }}
              className="relative overflow-visible bg-white font-bignoodle
                 w-[250px] h-[100px] text-[20px]
                 lg:w-[400px] lg:h-[150px] lg:text-[30px]
                 mx-auto flex justify-center items-center
                 rounded-tr-xl rounded-bl-xl"
            >
              <Link to="/dashboard/routines">
                <button className="btnstaff">Rutinas</button>
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 2.3 }}
              className="relative overflow-visible bg-white font-bignoodle
                 w-[250px] h-[100px] text-[20px]
                 lg:w-[400px] lg:h-[150px] lg:text-[30px]
                 mx-auto flex justify-center items-center
                 rounded-tr-xl rounded-bl-xl"
            >
              <Link to="/dashboard/estadisticas">
                <button className="btnstaff">Estadísticas</button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminPage;
