/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 02 /04 / 2026
 * Versión: 1.2
 *
 * Descripción:
 * Este componente renderiza un modal público ultra responsive para captar leads desde la web,
 * optimizado para mobile real, con estética moderna en tonos rojos y negros, conectado al backend
 * y montado mediante portal para evitar problemas de posicionamiento al abrirlo desde el navbar.
 *
 * Tema: Frontend - Captación de Leads
 *
 * Capa: Web pública
 */

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { FaWhatsapp, FaChevronRight } from 'react-icons/fa';

const INITIAL_FORM = {
  nombre: '',
  tel: '',
  email: '',
  interes: '',
  mensaje: ''
};

const LeadCaptureModal = ({ open, onClose }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState(false);
  const [mounted, setMounted] = useState(false);

  const BASE_URL = useMemo(
    () => import.meta.env.VITE_API_URL || 'http://localhost:8080',
    []
  );

  // Benjamin Orellana - 2026-04-02 - Se definen intereses cortos para reducir fricción y mejorar segmentación comercial
  const intereses = [
    'Quiero entrenar',
    'Planes y precios',
    'Pase diario',
    'Entrenamiento personalizado',
    'Promociones',
    'Otro'
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setForm(INITIAL_FORM);
      setError('');
      setOk(false);
      setCargando(false);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
  };

  const handleOverlayClick = (e) => {
    if (window.innerWidth >= 640 && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const construirMensajeAutomatico = () => {
    if (form.mensaje?.trim()) return form.mensaje.trim();

    if (form.interes?.trim()) {
      return `Consulta desde web pública. Interés principal: ${form.interes}.`;
    }

    return 'Consulta generada desde la web pública.';
  };

  const validar = () => {
    if (!form.nombre.trim()) return 'Ingresá tu nombre';
    if (!form.tel.trim()) return 'Ingresá tu teléfono';
    if (!form.interes.trim()) return 'Seleccioná tu interés';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mensajeValidacion = validar();
    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setCargando(true);
      setError('');

      const payload = {
        nombre: form.nombre.trim(),
        tel: form.tel.trim(),
        email: form.email.trim() || null,
        interes: form.interes.trim(),
        mensaje: construirMensajeAutomatico(),
        origen: 'web',
        estado: 'nuevo'
      };

      const res = await fetch(`${BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data?.mensajeError || 'No se pudo registrar tu solicitud'
        );
      }

      setOk(true);
      setForm(INITIAL_FORM);

      setTimeout(() => {
        onClose?.();
      }, 1800);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al enviar el formulario');
    } finally {
      setCargando(false);
    }
  };

  if (!mounted || !open) return null;

  const modalContent = (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md sm:flex sm:items-center sm:justify-center sm:p-4"
    >
      <div className="relative h-[100dvh] w-full overflow-hidden bg-[#050505] sm:h-auto sm:max-h-[94dvh] sm:max-w-5xl sm:rounded-[2rem] sm:border sm:border-red-500/20 sm:shadow-[0_0_80px_rgba(239,68,68,0.16)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.2),transparent_28%),linear-gradient(to_bottom,rgba(10,10,10,0.98),rgba(2,2,2,1))]" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-red-600/10 blur-3xl" />
          <div className="absolute top-1/3 -right-10 h-48 w-48 rounded-full bg-red-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-36 w-36 rounded-full bg-red-900/20 blur-3xl" />
        </div>

        <button
          onClick={onClose}
          type="button"
          aria-label="Cerrar formulario"
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 transition hover:bg-white/10 hover:text-red-300"
        >
          <AiOutlineClose size={20} />
        </button>

        <div className="relative z-10 grid h-full grid-cols-1 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="hidden xl:flex flex-col justify-between border-r border-white/10 p-10">
            <div>
              <span className="inline-flex items-center rounded-full border border-red-500/25 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                Altos Roca Gym
              </span>

              <h2 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[0.04em] text-white">
                Comenzá hoy
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/72">
                Dejanos tus datos y te contactamos para contarte planes,
                promociones, horarios y la mejor opción para vos.
              </p>
            </div>

            <a
              href="https://wa.me/543814480898"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-3xl border border-red-500/20 bg-gradient-to-r from-red-700/20 to-red-500/10 px-5 py-4 transition hover:border-red-400/40 hover:from-red-700/30 hover:to-red-500/20"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-900/30">
                  <FaWhatsapp size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">
                    ¿Preferís hablar ya?
                  </p>
                  <p className="text-xs text-white/65">
                    También podés escribirnos por WhatsApp
                  </p>
                </div>
              </div>

              <FaChevronRight className="text-white/55 transition group-hover:translate-x-1 group-hover:text-red-300" />
            </a>
          </div>

          <div className="flex h-[100dvh] flex-col sm:h-auto">
            <div className="sticky top-0 z-20 border-b border-white/10 bg-black/45 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-xl sm:px-6 xl:static xl:border-b-0 xl:bg-transparent xl:px-10 xl:pt-10">
              <div className="max-w-xl pr-12 xl:pr-0">
                <span className="inline-flex items-center rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300 xl:hidden">
                  Altos Roca Gym
                </span>

                <h2 className="mt-3 text-[1.9rem] font-black uppercase leading-[0.95] tracking-[0.03em] text-white sm:text-[2.2rem] xl:mt-0 xl:text-4xl">
                  Quiero comenzar
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-white/70">
                  Completá este formulario breve y te contactamos.
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 xl:px-10 xl:pb-10">
              {ok ? (
                <div className="flex min-h-full flex-col items-center justify-center py-10 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-[0_0_30px_rgba(239,68,68,0.35)]">
                    <span className="text-3xl text-white">✓</span>
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-white">
                    Solicitud enviada
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
                    Gracias por dejarnos tus datos. Te vamos a contactar a la
                    brevedad.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mx-auto w-full max-w-xl space-y-4"
                >
                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      value={form.tel}
                      onChange={handleChange}
                      placeholder="381..."
                      inputMode="tel"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      ¿Qué te interesa?
                    </label>
                    <select
                      name="interes"
                      value={form.interes}
                      onChange={handleChange}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-base text-white outline-none transition focus:border-red-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                    >
                      <option value="" className="bg-[#0c0c0c] text-white/70">
                        Seleccionar opción
                      </option>
                      {intereses.map((item) => (
                        <option
                          key={item}
                          value={item}
                          className="bg-[#0c0c0c] text-white"
                        >
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      Email opcional
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tunombre@email.com"
                      className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                      Comentario opcional
                    </label>
                    <textarea
                      name="mensaje"
                      value={form.mensaje}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Contanos si querés algo puntual. Si no, podés dejarlo vacío."
                      className="w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-red-400/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(239,68,68,0.10)]"
                    />
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-white/55">
                    Tus datos se usan solo para contactarte por tu consulta.
                  </div>

                  <button
                    type="submit"
                    disabled={cargando}
                    className="h-14 w-full rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_14px_35px_rgba(185,28,28,0.35)] transition hover:scale-[1.01] hover:shadow-[0_16px_42px_rgba(185,28,28,0.42)] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {cargando ? 'Enviando...' : 'Enviar solicitud'}
                  </button>

                  <a
                    href="https://wa.me/543814480898"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-semibold text-white/85 transition hover:border-red-400/25 hover:text-red-300 xl:hidden"
                  >
                    <FaWhatsapp size={18} />
                    Hablar por WhatsApp
                  </a>

                  <div className="h-4 sm:h-2" />
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LeadCaptureModal;
