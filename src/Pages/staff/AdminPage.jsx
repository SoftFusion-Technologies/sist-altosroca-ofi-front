import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import NavbarStaff from './NavbarStaff.jsx';
import '../../Styles/staff/dashboard.css';
import '../../Styles/staff/background.css';
import { useAuth } from '../../AuthContext';
import { motion } from 'framer-motion';
import ParticlesBackground from '../../components/ParticlesBackground.jsx';
import BadgeTestClasses from '../MetodosGets/Leads/BadgeTestClasses.jsx';
import {
  FaArrowRight,
  FaChartBar,
  FaDumbbell,
  FaRunning,
  FaUserGraduate,
  FaClipboardList
} from 'react-icons/fa';

/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 02 / 04 / 2026
 * Versión: 4.1
 *
 * Descripción:
 * Se ajusta el dashboard principal de Altos Roca Gym para trabajar únicamente
 * con los roles válidos actuales (admin, vendedor, instructor), se elimina
 * temporalmente el módulo de ventas y se reordena la grilla priorizando
 * Ejercicios primero y Alumnos segundo.
 *
 * Tema: Dashboard principal - Staff
 * Capa: Frontend
 */

const containerV = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04
    }
  }
};

const itemV = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 16
    }
  }
};

const ModuleCard = ({
  to,
  title,
  description,
  icon: Icon,
  accent,
  badge = null
}) => {
  return (
    <motion.div variants={itemV} className="h-full">
      <Link to={to} className="block h-full">
        <div className="group relative flex h-full min-h-[178px] flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.30)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-red-400/28 hover:bg-white/[0.09] sm:min-h-[190px] sm:p-6">
          <div
            className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${accent}`}
          />

          <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 left-0 h-20 w-20 rounded-full bg-red-500/8 blur-2xl" />

          {badge && <div className="absolute right-4 top-4 z-20">{badge}</div>}

          <div className="relative z-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-red-500/18 bg-red-500/12 text-red-200 shadow-[0_0_24px_rgba(239,68,68,0.10)]">
              <Icon className="text-lg" />
            </div>

            <h3 className="titulo mt-4 text-2xl uppercase text-white sm:text-[1.8rem]">
              {title}
            </h3>

            <p className="mt-3 max-w-[28ch] text-sm leading-relaxed text-white/62 sm:text-[15px]">
              {description}
            </p>
          </div>

          <div className="relative z-10 mt-5 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-white/80 transition-all duration-300 group-hover:text-white">
            <span>Abrir módulo</span>
            <FaArrowRight className="text-[11px] transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const AdminPage = () => {
  const { userId, userLevel } = useAuth();

  const role = String(userLevel || '').toLowerCase();

  const modules = useMemo(() => {
    const esAdmin = role === 'admin';
    const esVendedor = role === 'vendedor';
    const esInstructor = role === 'instructor';

    return [
      {
        key: 'ejercicios',
        to: '/dashboard/ejercicios',
        title: 'Ejercicios',
        description: 'Ejercicios predefinidos para trabajar mejor cada rutina.',
        icon: FaDumbbell,
        accent: 'from-zinc-300 via-red-400 to-red-600',
        visible: esAdmin || esInstructor
      },
      {
        key: 'alumnos',
        to: '/dashboard/alumnos',
        title: 'Alumnos',
        description: 'Gestión de perfiles, progreso y estado de cada alumno.',
        icon: FaUserGraduate,
        accent: 'from-red-700 via-rose-500 to-pink-300',
        visible: esAdmin || esInstructor
      },
      {
        key: 'rutinas',
        to: '/dashboard/routines',
        title: 'Rutinas',
        description: 'Planificación y asignación de entrenamientos.',
        icon: FaClipboardList,
        accent: 'from-orange-500 via-red-500 to-red-300',
        visible: esAdmin || esInstructor
      },
      {
        key: 'leads',
        to: '/dashboard/leads',
        title: 'Prospectos',
        description: 'Seguimiento de consultas, pruebas y futuros ingresos.',
        icon: FaRunning,
        accent: 'from-fuchsia-700 via-red-500 to-rose-300',
        visible: esAdmin || esVendedor,
        badge: (
          <BadgeTestClasses userId={userId} userLevel={userLevel} size="lg" />
        )
      },
      {
        key: 'estadisticas',
        to: '/dashboard/estadisticas',
        title: 'Analíticas',
        description: 'Vista general del rendimiento operativo del gimnasio.',
        icon: FaChartBar,
        accent: 'from-red-800 via-red-500 to-amber-300',
        visible: esAdmin
      }
    ].filter((item) => item.visible);
  }, [role, userId, userLevel]);

  if (!userLevel) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070707] px-6 text-white">
        <ParticlesBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_25%),linear-gradient(180deg,#060606_0%,#0b0b0d_48%,#050505_100%)]" />

        <div className="relative z-10 w-full max-w-md rounded-[26px] border border-white/10 bg-white/[0.05] p-6 text-center shadow-[0_24px_70px_rgba(0,0,0,0.42)] backdrop-blur-xl">
          <div className="mx-auto h-14 w-14 animate-pulse rounded-2xl bg-gradient-to-br from-red-700 via-red-500 to-red-300 shadow-[0_0_30px_rgba(239,68,68,0.30)]" />
          <p className="titulo mt-5 text-3xl uppercase text-white">Cargando</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <NavbarStaff />

      <section className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
        <ParticlesBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_24%),linear-gradient(180deg,#080808_0%,#101014_48%,#070707_100%)]" />
        <div className="pointer-events-none absolute left-[10%] top-20 h-72 w-72 rounded-full bg-red-600/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[6%] top-[25%] h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '42px 42px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <motion.div variants={containerV} initial="hidden" animate="show">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {modules.map((module) => (
                <ModuleCard
                  key={module.key}
                  to={module.to}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  accent={module.accent}
                  badge={module.badge}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AdminPage;
