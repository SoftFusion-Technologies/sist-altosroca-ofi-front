import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import {
  FaArrowRight,
  FaCalendarAlt,
  FaClock,
  FaDumbbell,
  FaPhoneAlt,
  FaUserAlt,
  FaWhatsapp
} from 'react-icons/fa';

/* Benjamin Orellana - 2026/04/11 - Página pública de turnos Altos Roca con fallback automático a WhatsApp cuando el backend aún no esté disponible */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const TURNOS_WHATSAPP = import.meta.env.VITE_TURNOS_WHATSAPP || '5493814480898';

const SERVICIOS = [
  {
    id: 'evaluacion-inicial',
    label: 'Evaluación inicial',
    desc: 'Primer contacto, objetivos y planificación.'
  },
  {
    id: 'asesoramiento',
    label: 'Asesoramiento',
    desc: 'Consultá por planes, modalidad y horarios.'
  },
  {
    id: 'entrenamiento-personalizado',
    label: 'Entrenamiento personalizado',
    desc: 'Turno para seguimiento o trabajo guiado.'
  },
  {
    id: 'clase-prueba',
    label: 'Clase de prueba',
    desc: 'Conocé el espacio y arrancá con el equipo.'
  }
];

const HORARIOS = [
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00'
];

const initialForm = {
  nombre: '',
  telefono: '',
  servicio: 'evaluacion-inicial',
  fecha: '',
  horario: '',
  comentario: '',
  sede: 'Altos Roca - Tafí Viejo'
};

const itemMotion = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 }
};

function TurnosPage() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const minDate = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const servicioActivo = useMemo(
    () => SERVICIOS.find((item) => item.id === form.servicio),
    [form.servicio]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.nombre.trim()) return 'Ingresá el nombre y apellido.';
    if (!form.telefono.trim()) return 'Ingresá un teléfono o WhatsApp.';
    if (form.telefono.replace(/\D/g, '').length < 8)
      return 'El teléfono ingresado no parece válido.';
    if (!form.fecha) return 'Seleccioná una fecha.';
    if (!form.horario) return 'Seleccioná un horario.';
    return null;
  };

  const buildWhatsappMessage = () => {
    const texto = [
      'Hola, quiero reservar un turno en Altos Roca.',
      '',
      `Nombre: ${form.nombre}`,
      `Teléfono: ${form.telefono}`,
      `Servicio: ${servicioActivo?.label || form.servicio}`,
      `Fecha: ${form.fecha}`,
      `Horario: ${form.horario}`,
      `Sede: ${form.sede}`,
      `Comentario: ${form.comentario?.trim() || 'Sin comentario'}`
    ].join('\n');

    return `https://wa.me/${TURNOS_WHATSAPP}?text=${encodeURIComponent(texto)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      Swal.fire({
        icon: 'warning',
        title: 'Revisá el formulario',
        text: error,
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#ffffff'
      });
      return;
    }

    const payload = {
      ...form,
      servicio_label: servicioActivo?.label || form.servicio,
      origen: 'web_turnos_altos_roca'
    };

    try {
      setLoading(true);

      const response = await fetch(`${API_BASE}/turnos-publicos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('No se pudo registrar el turno en backend');
      }

      await Swal.fire({
        icon: 'success',
        title: 'Turno solicitado',
        text: 'Recibimos tu solicitud. En breve te confirmamos el horario.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#ffffff'
      });

      setForm(initialForm);
    } catch (errorSubmit) {
      await Swal.fire({
        icon: 'info',
        title: 'Seguimos por WhatsApp',
        text: 'Todavía no está activo el registro automático. Te abrimos WhatsApp con el turno ya cargado.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#ffffff'
      });

      window.open(buildWhatsappMessage(), '_blank', 'noopener,noreferrer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.20),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(239,68,68,0.10),transparent_25%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:34px_34px]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-28 sm:px-6 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } }
          }}
          className="flex flex-col justify-center"
        >
          <motion.div
            variants={itemMotion}
            className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200"
          >
            Turnos online
          </motion.div>

          <motion.h1
            variants={itemMotion}
            className="max-w-3xl text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-family-display)' }}
          >
            Reservá tu turno
            <span className="block text-red-500">en Altos Roca</span>
          </motion.h1>

          <motion.p
            variants={itemMotion}
            className="mt-5 max-w-2xl text-base leading-7 text-white/72 sm:text-lg"
            style={{ fontFamily: 'var(--font-family-body)' }}
          >
            Elegí el tipo de atención, la fecha y el horario que mejor te quede.
            Diseñamos una experiencia clara, rápida y moderna para que el primer
            paso también se sienta premium.
          </motion.p>

          <motion.div
            variants={itemMotion}
            className="mt-8 grid gap-4 sm:grid-cols-2"
          >
            {SERVICIOS.map((item) => {
              const active = form.servicio === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleChange('servicio', item.id)}
                  className={`group rounded-[26px] border p-5 text-left transition-all duration-300 ${
                    active
                      ? 'border-red-500/50 bg-gradient-to-br from-red-600/20 to-red-500/5 shadow-[0_20px_80px_-35px_rgba(239,68,68,0.55)]'
                      : 'border-white/10 bg-white/[0.04] hover:border-red-500/30 hover:bg-red-500/[0.06]'
                  }`}
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/8 text-red-300 transition-transform duration-300 group-hover:scale-105">
                    <FaDumbbell />
                  </div>

                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-white">
                    {item.label}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-white/62">
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </motion.div>

          <motion.div
            variants={itemMotion}
            className="mt-8 grid gap-4 sm:grid-cols-3"
          >
            <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Sede
              </p>
              <p className="mt-2 text-lg font-bold text-white">Tafí Viejo</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative"
        >
          <div className="absolute -inset-2 rounded-[34px] bg-gradient-to-br from-red-600/20 via-transparent to-red-500/10 blur-2xl" />

          <div className="relative rounded-[30px] border border-white/10 bg-white/[0.05] p-4 shadow-[0_32px_120px_-40px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-6">
            <div className="rounded-[26px] border border-red-500/18 bg-[#0b0b0f]/90 p-5 sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                    Formulario de reserva
                  </p>
                  <h2
                    className="mt-2 text-2xl font-black uppercase text-white"
                    style={{ fontFamily: 'var(--font-family-display)' }}
                  >
                    Coordiná tu turno
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/12 text-red-300">
                  <FaCalendarAlt />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      <FaUserAlt className="text-red-400" />
                      Nombre y apellido
                    </span>
                    <input
                      type="text"
                      value={form.nombre}
                      onChange={(e) => handleChange('nombre', e.target.value)}
                      placeholder="Ej. Juan Perez"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-red-500/45 focus:bg-white/[0.08]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      <FaPhoneAlt className="text-red-400" />
                      WhatsApp
                    </span>
                    <input
                      type="tel"
                      value={form.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      placeholder="381..."
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-red-500/45 focus:bg-white/[0.08]"
                    />
                  </label>
                </div>

                <div>
                  <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Tipo de turno
                  </span>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {SERVICIOS.map((item) => {
                      const active = form.servicio === item.id;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleChange('servicio', item.id)}
                          className={`rounded-2xl border px-4 py-4 text-left transition-all duration-300 ${
                            active
                              ? 'border-red-500/50 bg-red-500/10 text-white'
                              : 'border-white/10 bg-white/[0.04] text-white/72 hover:border-red-500/25'
                          }`}
                        >
                          <p className="text-sm font-bold">{item.label}</p>
                          <p className="mt-1 text-xs leading-5 text-white/50">
                            {item.desc}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      <FaCalendarAlt className="text-red-400" />
                      Fecha
                    </span>
                    <input
                      type="date"
                      min={minDate}
                      value={form.fecha}
                      onChange={(e) => handleChange('fecha', e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition-all focus:border-red-500/45 focus:bg-white/[0.08]"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                      <FaClock className="text-red-400" />
                      Horario
                    </span>
                    <select
                      value={form.horario}
                      onChange={(e) => handleChange('horario', e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white outline-none transition-all focus:border-red-500/45 focus:bg-white/[0.08]"
                    >
                      <option value="" className="text-slate-900">
                        Seleccionar horario
                      </option>
                      {HORARIOS.map((hora) => (
                        <option
                          key={hora}
                          value={hora}
                          className="text-slate-900"
                        >
                          {hora}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
                    Comentario adicional
                  </span>
                  <textarea
                    rows={4}
                    value={form.comentario}
                    onChange={(e) => handleChange('comentario', e.target.value)}
                    placeholder="Contanos qué buscás, si es tu primera vez, o cualquier dato útil."
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-4 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-red-500/45 focus:bg-white/[0.08]"
                  />
                </label>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    Sede seleccionada
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {form.sede}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 text-sm font-bold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? 'Procesando...' : 'Solicitar turno'}
                    <FaArrowRight className="text-xs" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        buildWhatsappMessage(),
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-green-500/25 bg-green-500/10 px-5 text-sm font-bold uppercase tracking-[0.14em] text-green-200 transition-all duration-300 hover:bg-green-500/16"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TurnosPage;
