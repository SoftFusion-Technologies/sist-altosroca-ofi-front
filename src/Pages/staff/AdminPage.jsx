import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import NavbarStaff from './NavbarStaff.jsx';
import '../../Styles/staff/dashboard.css';
import '../../Styles/staff/background.css';
import { useAuth } from '../../AuthContext';
import { motion } from 'framer-motion';
import CardRecaptacion from './Components/CardRecaptacion';
import BadgeAgendaVentas from './Components/BadgeAgendaVentas';
import ParticlesBackground from '../../components/ParticlesBackground.jsx';
import BadgeTestClasses from '../MetodosGets/Leads/BadgeTestClasses.jsx';
import {
  FaArrowRight,
  FaChartBar,
  FaDumbbell,
  FaFire,
  FaRunning,
  FaUserGraduate,
  FaClipboardList,
  FaShieldAlt,
  FaLayerGroup
} from 'react-icons/fa';

/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 29 / 03 / 2026
 * Versión: 4.0
 *
 * Descripción:
 * Rediseño del AdminPage orientado a Altos Roca Gym.
 * Se mantiene la lógica de roles y accesos, pero se adapta el lenguaje visual
 * y los textos del dashboard para que representen mejor la operación diaria
 * del gimnasio: alumnos, rutinas, ejercicios, caja, prospectos y analíticas.
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

const roleLabelMap = {
  admin: 'Administrador',
  socio: 'Socio',
  administrativo: 'Administrativo',
  contable: 'Contable',
  vendedor: 'Vendedor',
  instructor: 'Instructor'
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
  const { userId, userLevel, userName, nomyape } = useAuth();

  const role = String(userLevel || '').toLowerCase();

  const displayName = useMemo(() => {
    const base = nomyape || userName || '';
    if (!base) return 'Staff';
    return base.trim().split(' ')[0] || 'Staff';
  }, [nomyape, userName]);

  const modules = useMemo(() => {
    const esAdminAmplio = ['admin', 'socio', 'administrativo', 'contable'].includes(
      role
    );
    const esVendedor = role === 'vendedor';
    const esInstructor = role === 'instructor';

    return [
      {
        key: 'ventas',
        to: '/dashboard/ventas',
        title: 'ventas',
        description:
          'Captación de leads y gestión de ventas.',
        icon: FaFire,
        accent: 'from-red-700 via-red-500 to-orange-300',
        visible: esAdminAmplio || esVendedor,
        badge: (
          <BadgeAgendaVentas
            userId={userId}
            userLevel={userLevel}
            size="lg"
          />
        )
      },
      {
        key: 'leads',
        to: '/dashboard/leads',
        title: 'Prospectos',
        description:
          'Seguimiento de consultas, pruebas y futuros ingresos.',
        icon: FaRunning,
        accent: 'from-fuchsia-700 via-red-500 to-rose-300',
        visible: esAdminAmplio || esVendedor,
        badge: (
          <BadgeTestClasses
            userId={userId}
            userLevel={userLevel}
            size="lg"
          />
        )
      },
      {
        key: 'ejercicios',
        to: '/dashboard/ejercicios',
        title: 'Ejercicios',
        description:
          'Biblioteca técnica para trabajar mejor cada rutina.',
        icon: FaDumbbell,
        accent: 'from-zinc-300 via-red-400 to-red-600',
        visible: esAdminAmplio || esInstructor
      },
      {
        key: 'alumnos',
        to: '/dashboard/alumnos',
        title: 'Alumnos',
        description:
          'Gestión de perfiles, progreso y estado de cada alumno.',
        icon: FaUserGraduate,
        accent: 'from-red-700 via-rose-500 to-pink-300',
        visible: esAdminAmplio || esInstructor
      },
      {
        key: 'rutinas',
        to: '/dashboard/routines',
        title: 'Rutinas',
        description:
          'Planificación y asignación de entrenamientos.',
        icon: FaClipboardList,
        accent: 'from-orange-500 via-red-500 to-red-300',
        visible: esAdminAmplio || esInstructor
      },
      {
        key: 'estadisticas',
        to: '/dashboard/estadisticas',
        title: 'Analíticas',
        description:
          'Vista general del rendimiento operativo del gimnasio.',
        icon: FaChartBar,
        accent: 'from-red-800 via-red-500 to-amber-300',
        visible: esAdminAmplio
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
          <p className="titulo mt-5 text-3xl uppercase text-white">
            Cargando
          </p>
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
            <motion.div
              variants={itemV}
              className="mb-8 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.05] shadow-[0_24px_70px_rgba(0,0,0,0.38)] backdrop-blur-xl"
            >
              <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-red-400/70 to-transparent" />

              <div className="relative p-6 sm:p-7">
                <div className="pointer-events-none absolute -right-10 top-0 h-28 w-28 rounded-full bg-red-500/10 blur-3xl" />

                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.18em] text-red-200/84">
                      Altos Roca Gym
                    </div>

                    <h1 className="titulo mt-2 text-4xl uppercase text-white sm:text-5xl">
                      Centro de control
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/62 sm:text-base">
                      Bienvenido, {displayName}. Desde acá gestionás la operación
                      diaria del gym con accesos rápidos a los módulos más
                      importantes según tu perfil.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-[20px] border border-white/10 bg-black/25 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                          <FaShieldAlt className="text-sm" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em] text-white/42">
                            Perfil
                          </div>
                          <div className="mt-1 text-sm font-semibold text-white/90">
                            {roleLabelMap[role] || userLevel}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-black/25 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                          <FaLayerGroup className="text-sm" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em] text-white/42">
                            Módulos
                          </div>
                          <div className="mt-1 text-sm font-semibold text-white/90">
                            {modules.length} habilitados
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-white/10 bg-black/25 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-red-500/18 bg-red-500/10 text-red-300">
                          <FaDumbbell className="text-sm" />
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.16em] text-white/42">
                            Enfoque
                          </div>
                          <div className="mt-1 text-sm font-semibold text-white/90">
                            Gestión diaria
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

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

              {/* <motion.div variants={itemV} className="h-full">
                <CardRecaptacion userLevel={userLevel} userId={userId} />
              </motion.div> */}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default AdminPage;