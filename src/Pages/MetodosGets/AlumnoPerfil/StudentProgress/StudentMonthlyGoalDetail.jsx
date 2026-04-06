import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import dayjs from 'dayjs';
import RegistrarProgresoModal from './RegistrarProgresoModal';
import CardProgreso from './CardProgreso';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.0
 *
 * Descripción:
 * Detalle del objetivo mensual del alumno con estética Altos Roca,
 * modo edición mejorado y feedback visual con SweetAlert para
 * guardado, error y validación de cambios.
 *
 * Tema: Objetivo mensual del alumno
 * Capa: Frontend
 */

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      when: 'beforeChildren'
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 }
};

/* Benjamin Orellana - 06/04/2026 - Helpers visuales y de formato para adaptar el detalle mensual a la identidad Altos Roca */
const surfaceCard =
  'rounded-[28px] border border-white/10 bg-[#0a0a0b]/95 backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.6)]';

const softPanel =
  'rounded-[22px] border border-white/10 bg-white/[0.04] backdrop-blur-md';

const inputAltosRoca =
  'w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-[#ef3347]/30 focus:ring-2 focus:ring-[#ef3347]/15';

const buttonPrimary =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01]';

const buttonSoft =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]';

const formatDateTimeAr = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('es-AR');
};

const formatFieldValue = (value, unit) => {
  if (value === null || value === undefined || value === '') return '—';
  return `${value}${unit ? ` ${unit}` : ''}`;
};

const getEstadoConfig = (estado) => {
  const current = estado || 'EN_PROGRESO';

  if (current === 'CUMPLIDO') {
    return {
      label: 'Cumplido',
      icon: CheckCircleIcon,
      chipClass: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
    };
  }

  if (current === 'CANCELADO') {
    return {
      label: 'Cancelado',
      icon: XCircleIcon,
      chipClass: 'border-red-400/20 bg-red-500/10 text-red-300'
    };
  }

  return {
    label: 'En progreso',
    icon: ClockIcon,
    chipClass: 'border-amber-400/20 bg-amber-500/10 text-amber-300'
  };
};

const StudentMonthlyGoalDetail = ({ studentId, reloadTrigger }) => {
  const [goal, setGoal] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [mostrarModalProgreso, setMostrarModalProgreso] = useState(false);
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
  const [mostrarFormSemana, setMostrarFormSemana] = useState(null);

  /* Benjamin Orellana - 06/04/2026 - Configuración de SweetAlert con estilo Altos Roca */
  const swalAltosRoca = (options = {}) =>
    Swal.fire({
      background: '#0a0a0b',
      color: '#f3f4f6',
      confirmButtonColor: '#d11f2f',
      customClass: {
        popup: 'rounded-[24px] border border-white/10',
        confirmButton: 'rounded-xl'
      },
      ...options
    });

  /* Benjamin Orellana - 06/04/2026 - Toast visual reutilizable para feedback no intrusivo */
  const toastAltosRoca = (options = {}) =>
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1800,
      timerProgressBar: true,
      background: '#0a0a0b',
      color: '#f3f4f6',
      customClass: {
        popup: 'rounded-[18px] border border-white/10'
      },
      ...options
    });

  useEffect(() => {
    setFormData(goal || {});
  }, [goal]);

  const fetchGoal = async () => {
    try {
      const fechaActual = new Date();
      const mes = fechaActual.getMonth() + 1;
      const anio = fechaActual.getFullYear();

      const queryString = new URLSearchParams({
        student_id: studentId,
        mes,
        anio
      }).toString();

      const res = await axios.get(
        `http://localhost:8080/student-monthly-goals?${queryString}`
      );

      const objetivo =
        Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;

      setGoal(objetivo);
    } catch (error) {
      console.error('Error al obtener el objetivo:', error);
      setGoal(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [studentId, reloadTrigger]);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto mt-10 rounded-[24px] border border-white/10 bg-[#0a0a0b]/95 px-6 py-8 text-center text-white/70 shadow-[0_16px_45px_-30px_rgba(0,0,0,0.65)]">
        Cargando objetivo mensual...
      </div>
    );

  if (!goal)
    return (
      <div className="max-w-4xl mx-auto mt-10 rounded-[24px] border border-dashed border-white/10 bg-[#0a0a0b]/95 px-6 py-8 text-center text-white/75 shadow-[0_16px_45px_-30px_rgba(0,0,0,0.65)]">
        No cargó el objetivo aún.
      </div>
    );

  const estado = goal.estado || 'EN_PROGRESO';

  /* Benjamin Orellana - 06/04/2026 - Configuración visual derivada del estado actual del objetivo */
  const estadoConfig = getEstadoConfig(estado);
  const EstadoIcon = estadoConfig.icon;

  const createdAt = dayjs(goal.created_at);
  const hoy = dayjs();
  const diasDesdeCreacion = hoy.diff(createdAt, 'day');

  /* Benjamin Orellana - 06/04/2026 - Validación de progreso semanal sin depender del plugin isBetween de dayjs */
  const progresoYaRegistrado = (semana) => {
    if (!goal.progressList || !Array.isArray(goal.progressList)) return false;

    const inicioSemana = dayjs(goal.created_at)
      .add((semana - 1) * 7, 'day')
      .startOf('day');

    const finSemana = dayjs(goal.created_at)
      .add(semana * 7, 'day')
      .endOf('day');

    return goal.progressList.some((p) => {
      const fechaProgreso = dayjs(p.fecha);
      return (
        fechaProgreso.valueOf() >= inicioSemana.valueOf() &&
        fechaProgreso.valueOf() <= finSemana.valueOf()
      );
    });
  };

  const semanasDisponibles = [];
  for (let i = 1; i <= 4; i++) {
    if (diasDesdeCreacion >= i * 7 && !progresoYaRegistrado(i)) {
      semanasDisponibles.push(i);
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  /* Benjamin Orellana - 06/04/2026 - Guardado mejorado con validación de cambios y feedback visual Altos Roca */
  const handleSave = async () => {
    const normalizedGoal = {
      ...goal,
      objetivo: goal?.objetivo ?? '',
      altura_cm: goal?.altura_cm ?? '',
      peso_kg: goal?.peso_kg ?? '',
      edad: goal?.edad ?? '',
      grasa_corporal: goal?.grasa_corporal ?? '',
      cintura_cm: goal?.cintura_cm ?? '',
      imc: goal?.imc ?? ''
    };

    const normalizedForm = {
      ...formData,
      objetivo: formData?.objetivo ?? '',
      altura_cm: formData?.altura_cm ?? '',
      peso_kg: formData?.peso_kg ?? '',
      edad: formData?.edad ?? '',
      grasa_corporal: formData?.grasa_corporal ?? '',
      cintura_cm: formData?.cintura_cm ?? '',
      imc: formData?.imc ?? ''
    };

    const noCambios =
      JSON.stringify(normalizedForm) === JSON.stringify(normalizedGoal);

    if (noCambios) {
      setEditMode(false);
      setFormData(goal || {});

      await toastAltosRoca({
        icon: 'info',
        title: 'No hubo cambios para guardar'
      });
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8080/student-monthly-goals/${goal.id}`,
        formData
      );

      setEditMode(false);
      setGoal(res.data.updatedGoal || goal);
      setFormData(res.data.updatedGoal || formData);
      await fetchGoal();

      await toastAltosRoca({
        icon: 'success',
        title: 'Objetivo actualizado correctamente'
      });
    } catch (err) {
      console.error('Error al actualizar objetivo', err);

      await swalAltosRoca({
        icon: 'error',
        title: 'No se pudo actualizar',
        text:
          err?.response?.data?.mensajeError ||
          'Ocurrió un error al guardar los cambios del objetivo.'
      });
    }
  };

  const campos = [
    { label: 'Mes', key: 'mes' },
    { label: 'Año', key: 'anio' },
    { label: 'Altura', key: 'altura_cm', unit: 'cm' },
    { label: 'Peso', key: 'peso_kg', unit: 'kg' },
    { label: 'Edad', key: 'edad', unit: 'años' },
    { label: 'Grasa Corporal', key: 'grasa_corporal', unit: '%' },
    { label: 'Cintura', key: 'cintura_cm', unit: 'cm' },
    { label: 'IMC', key: 'imc' }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto mt-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`${surfaceCard} relative overflow-hidden`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.11)_0%,rgba(255,255,255,0.02)_46%,rgba(0,0,0,0.42)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.04)_0%,rgba(239,51,71,0.38)_50%,rgba(239,51,71,0.04)_100%)]" />
            <div className="absolute -left-10 top-[-30px] h-36 w-36 rounded-full bg-[#ef3347]/10 blur-3xl" />
            <div className="absolute bottom-[-25px] right-[-15px] h-36 w-36 rounded-full bg-[#ef3347]/10 blur-3xl" />

            <div className="relative p-5 md:p-7">
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]">
                      Objetivo mensual
                    </span>

                    <span className="text-[22px] uppercase leading-none text-[#ff5a6f]">
                      Altos Roca
                    </span>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] ${estadoConfig.chipClass}`}
                    >
                      <EstadoIcon className="h-4 w-4" />
                      {estadoConfig.label}
                    </span>
                  </div>

                  <div className="mt-4">
                    {!editMode ? (
                      <>
                        <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
                          Objetivo actual
                        </p>
                        <h3 className="mt-2 text-2xl md:text-3xl font-black uppercase leading-tight text-white">
                          {goal.objetivo}
                        </h3>
                      </>
                    ) : (
                      <div>
                        <label className="mb-2 block text-[11px] uppercase tracking-[0.18em] text-white/45">
                          Objetivo actual
                        </label>
                        <input
                          type="text"
                          name="objetivo"
                          value={formData?.objetivo ?? ''}
                          onChange={handleChange}
                          className={inputAltosRoca}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                      {diasDesdeCreacion} día(s) desde creación
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5">
                      {goal.progressList?.length || 0} progreso(s) registrado(s)
                    </span>
                  </div>
                </div>

                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className={buttonSoft}
                    aria-label="Editar objetivo"
                  >
                    Editar objetivo
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={handleSave}
                      className={buttonPrimary}
                      aria-label="Guardar cambios"
                    >
                      Guardar cambios
                    </button>

                    <button
                      onClick={() => {
                        setEditMode(false);
                        setFormData(goal || {});
                      }}
                      className={buttonSoft}
                      aria-label="Cancelar edición"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </motion.div>

              {!editMode ? (
                <motion.div
                  variants={itemVariants}
                  className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                >
                  {campos.map(({ label, key, unit }) => (
                    <div key={key} className={`${softPanel} p-4`}>
                      <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">
                        {formatFieldValue(goal[key], unit)}
                      </p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {campos.map(({ label, key, unit }) => (
                      <motion.div
                        key={key}
                        variants={itemVariants}
                        className={`${softPanel} p-4`}
                      >
                        <label
                          htmlFor={key}
                          className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/40"
                        >
                          {label}
                        </label>

                        {key === 'anio' || key === 'mes' ? (
                          <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm font-medium text-white/85">
                            {formatFieldValue(goal[key], unit)}
                          </div>
                        ) : (
                          <input
                            id={key}
                            type="text"
                            name={key}
                            value={formData?.[key] ?? ''}
                            onChange={handleChange}
                            className={inputAltosRoca}
                          />
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}

              <motion.div variants={itemVariants} className="mt-8">
                <div className={`${softPanel} p-5`}>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.20em] text-[#ff98a5]">
                        Seguimiento semanal
                      </p>
                      <h4 className="mt-2 text-xl font-black uppercase text-white">
                        Registrar progreso
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-white/58 max-w-2xl">
                        Generá el seguimiento semanal solo cuando corresponda
                        según la antigüedad del objetivo y los registros ya
                        cargados.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/75">
                      Semanas disponibles: {semanasDisponibles.length}
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {semanasDisponibles.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-center text-white/52">
                        No hay semanas disponibles para registrar progreso.
                      </div>
                    ) : (
                      semanasDisponibles.map((semana) => (
                        <button
                          key={semana}
                          onClick={() => {
                            setSemanaSeleccionada(semana);
                            setMostrarModalProgreso(true);
                            setMostrarFormSemana(semana);
                          }}
                          className={`${buttonPrimary} w-full`}
                          aria-label={`Registrar progreso semana ${semana}`}
                        >
                          Registrar progreso semana {semana}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.footer
                variants={itemVariants}
                className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                <div className={`${softPanel} px-4 py-3 text-sm`}>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                    Creado
                  </p>
                  <time
                    dateTime={goal.created_at}
                    className="mt-2 block text-white/78"
                  >
                    {formatDateTimeAr(goal.created_at)}
                  </time>
                </div>

                <div className={`${softPanel} px-4 py-3 text-sm`}>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                    Actualizado
                  </p>
                  <time
                    dateTime={goal.updated_at}
                    className="mt-2 block text-white/78"
                  >
                    {formatDateTimeAr(goal.updated_at)}
                  </time>
                </div>
              </motion.footer>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className={`${surfaceCard} overflow-hidden`}
          >
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-[11px] uppercase tracking-[0.20em] text-[#ff98a5]">
                Progreso
              </p>
              <h4 className="mt-2 text-xl font-black uppercase text-white">
                Panel del alumno
              </h4>
            </div>

            <div className="p-4">
              <CardProgreso studentId={studentId} />
            </div>
          </motion.div>
        </div>
      </div>

      {mostrarModalProgreso && mostrarFormSemana && (
        <RegistrarProgresoModal
          semana={mostrarFormSemana}
          studentId={studentId}
          onClose={() => {
            setMostrarModalProgreso(false);
            setMostrarFormSemana(null);
            setSemanaSeleccionada(null);
          }}
        />
      )}
    </>
  );
};

export default StudentMonthlyGoalDetail;
