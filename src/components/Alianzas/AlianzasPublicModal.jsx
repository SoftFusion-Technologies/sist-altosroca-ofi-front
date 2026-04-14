/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzasPublicModal.jsx) renderiza el modal público para que
 * empresas, emprendimientos o marcas puedan registrar su interés en publicidad
 * o convenios con Altos Roca Gym.
 *
 * Tema: Alianzas Públicas
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Building2,
  User2,
  Phone,
  Mail,
  BriefcaseBusiness,
  MessageSquareText,
  Globe,
  Tv,
  Megaphone,
  Handshake,
  BadgeDollarSign,
  Sparkles
} from 'lucide-react';

// Benjamin Orellana - 2026/04/14 - URL local fija para consumir el backend del módulo alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Estado inicial del formulario público de alianzas.
const INITIAL_FORM = {
  razon_social: '',
  nombre_fantasia: '',
  rubro: '',
  contacto_nombre: '',
  contacto_apellido: '',
  contacto_telefono: '',
  contacto_email: '',
  tipo_relacion: 'publicidad',
  mensaje_inicial: ''
};

// Benjamin Orellana - 2026/04/14 - Íconos visuales por categoría de espacio comercial.
const CATEGORY_ICON_MAP = {
  redes: Megaphone,
  web: Globe,
  pantallas: Tv,
  carteleria: BadgeDollarSign,
  sponsor: Sparkles,
  convenio: Handshake,
  otro: BriefcaseBusiness
};

// Benjamin Orellana - 2026/04/14 - Colores y etiquetas humanizadas por categoría.
const CATEGORY_LABEL_MAP = {
  redes: 'Redes',
  web: 'Página web',
  pantallas: 'Pantallas',
  carteleria: 'Cartelería',
  sponsor: 'Sponsor',
  convenio: 'Convenio',
  otro: 'Otro'
};

const AlianzasPublicModal = ({ open, onClose, onSubmitted }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [espacios, setEspacios] = useState([]);
  const [espaciosSeleccionados, setEspaciosSeleccionados] = useState([]);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingEspacios, setLoadingEspacios] = useState(false);

  // Benjamin Orellana - 2026/04/14 - Beneficios comerciales resumidos para reforzar la conversión del modal.
  const beneficios = useMemo(
    () => [
      'Presencia de marca dentro del ecosistema de Altos Roca Gym.',
      'Visibilidad en pantallas, web, redes y acciones especiales.',
      'Posibilidad de convenios y beneficios para alumnos o socios.',
      'Espacios flexibles para publicidad fija, rotativa o colaboraciones.'
    ],
    []
  );

  // Benjamin Orellana - 2026/04/14 - Resetea el formulario y selección al estado inicial.
  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEspaciosSeleccionados([]);
  };

  // Benjamin Orellana - 2026/04/14 - Actualiza campos simples del formulario.
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Benjamin Orellana - 2026/04/14 - Abre o cierra la selección de espacios del formulario.
  const handleToggleEspacio = (espacioId) => {
    setEspaciosSeleccionados((prev) => {
      if (prev.includes(espacioId)) {
        return prev.filter((id) => id !== espacioId);
      }

      return [...prev, espacioId];
    });
  };

  // Benjamin Orellana - 2026/04/14 - Cierra el modal evitando cierres accidentales durante envíos.
  const handleClose = () => {
    if (loadingSubmit) return;
    resetForm();
    onClose?.();
  };

  // Benjamin Orellana - 2026/04/14 - Carga los espacios activos para mostrarlos como selector visual.
  const fetchEspacios = async () => {
    try {
      setLoadingEspacios(true);

      const response = await axios.get(`${BASE_URL}/alianzas-espacios`, {
        params: { activo: true }
      });

      const espaciosActivos = Array.isArray(response.data) ? response.data : [];
      setEspacios(espaciosActivos);
    } catch (error) {
      console.error('Error al obtener espacios de alianzas:', error);
      setEspacios([]);
    } finally {
      setLoadingEspacios(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchEspacios();
    }
  }, [open]);

  // Benjamin Orellana - 2026/04/14 - Valida campos mínimos para el registro público.
  const validateForm = () => {
    if (!form.razon_social.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta la empresa',
        text: 'Ingresá la razón social o nombre de la empresa.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (!form.contacto_nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el nombre de contacto',
        text: 'Ingresá al menos el nombre de la persona de contacto.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (!form.contacto_telefono.trim() && !form.contacto_email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta un medio de contacto',
        text: 'Ingresá un teléfono o un email para poder comunicarnos.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    return true;
  };

  // Benjamin Orellana - 2026/04/14 - Envía el alta pública al backend local del módulo alianzas.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const payload = {
        razon_social: form.razon_social.trim(),
        nombre_fantasia: form.nombre_fantasia.trim() || null,
        rubro: form.rubro.trim() || null,
        contacto_nombre: form.contacto_nombre.trim(),
        contacto_apellido: form.contacto_apellido.trim() || null,
        contacto_telefono: form.contacto_telefono.trim() || null,
        contacto_email: form.contacto_email.trim() || null,
        tipo_relacion: form.tipo_relacion,
        mensaje_inicial: form.mensaje_inicial.trim() || null,
        espacios_ids: espaciosSeleccionados,
        origen: 'web'
      };

      const response = await axios.post(
        `${BASE_URL}/alianzas-publico/registro`,
        payload
      );

      await Swal.fire({
        icon: 'success',
        title: 'Solicitud enviada',
        text: 'Recibimos tu propuesta correctamente. El equipo de Altos Roca Gym se pondrá en contacto a la brevedad.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      resetForm();
      onSubmitted?.(response.data);
      onClose?.();
    } catch (error) {
      console.error('Error al registrar alianza pública:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo enviar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al enviar la solicitud. Intentá nuevamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={handleClose} className="relative z-[120]">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-5">
              <motion.div
                initial={{ opacity: 0, y: 28, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.985 }}
                transition={{ duration: 0.25 }}
                className="w-full sm:max-w-6xl"
              >
                <DialogPanel className="relative overflow-hidden rounded-t-[30px] border border-red-500/20 bg-[#050505] text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:rounded-[32px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.20),transparent_34%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between border-b border-white/10 px-5 py-5 sm:px-7">
                      <div className="max-w-3xl pr-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                          Altos Roca Gym
                        </div>

                        <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl">
                          Publicidad, convenios y alianzas
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          Si tenés una empresa, marca o emprendimiento y querés
                          potenciar tu presencia junto a Altos Roca Gym, dejános
                          tus datos y te contactamos para evaluar una propuesta
                          comercial o convenio.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="grid gap-0 xl:grid-cols-[0.95fr_1.35fr]">
                      <div className="border-b border-white/10 p-5 xl:border-b-0 xl:border-r xl:border-white/10 xl:p-7">
                        <div className="rounded-[28px] border border-red-500/15 bg-gradient-to-br from-red-500/10 via-white/[0.03] to-transparent p-5">
                          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                            Beneficios
                          </div>

                          <div className="space-y-3">
                            {beneficios.map((item, index) => (
                              <div
                                key={`${item}-${index}`}
                                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-zinc-200"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="mt-5 rounded-[28px] border border-white/10 bg-white/5 p-5">
                          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                            Lo que podés solicitar
                          </h3>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                              <p className="text-sm font-semibold text-white">
                                Publicidad
                              </p>
                              <p className="mt-1 text-sm text-zinc-400">
                                Marca en web, pantallas, cartelería, redes y
                                acciones especiales.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                              <p className="text-sm font-semibold text-white">
                                Convenios
                              </p>
                              <p className="mt-1 text-sm text-zinc-400">
                                Beneficios o acuerdos comerciales para alumnos,
                                socios o comunidad.
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                              <p className="text-sm font-semibold text-white">
                                Sponsor
                              </p>
                              <p className="mt-1 text-sm text-zinc-400">
                                Participación destacada en campañas, eventos o
                                activaciones.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="p-5 sm:p-7">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="md:col-span-2">
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Empresa o razón social
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <Building2 size={18} className="text-red-300" />
                              <input
                                type="text"
                                value={form.razon_social}
                                onChange={(e) =>
                                  handleChange('razon_social', e.target.value)
                                }
                                placeholder="Ej. Distribuidora Norte SRL"
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Nombre comercial
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <BriefcaseBusiness
                                size={18}
                                className="text-red-300"
                              />
                              <input
                                type="text"
                                value={form.nombre_fantasia}
                                onChange={(e) =>
                                  handleChange(
                                    'nombre_fantasia',
                                    e.target.value
                                  )
                                }
                                placeholder="Ej. Norte Fitness"
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Rubro
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <BriefcaseBusiness
                                size={18}
                                className="text-red-300"
                              />
                              <input
                                type="text"
                                value={form.rubro}
                                onChange={(e) =>
                                  handleChange('rubro', e.target.value)
                                }
                                placeholder="Ej. Salud, indumentaria, tecnología"
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Nombre de contacto
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <User2 size={18} className="text-red-300" />
                              <input
                                type="text"
                                value={form.contacto_nombre}
                                onChange={(e) =>
                                  handleChange(
                                    'contacto_nombre',
                                    e.target.value
                                  )
                                }
                                placeholder="Ej. Juan"
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Apellido de contacto
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <User2 size={18} className="text-red-300" />
                              <input
                                type="text"
                                value={form.contacto_apellido}
                                onChange={(e) =>
                                  handleChange(
                                    'contacto_apellido',
                                    e.target.value
                                  )
                                }
                                placeholder="Ej. Pérez"
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Teléfono
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <Phone size={18} className="text-red-300" />
                              <input
                                type="text"
                                value={form.contacto_telefono}
                                onChange={(e) =>
                                  handleChange(
                                    'contacto_telefono',
                                    e.target.value
                                  )
                                }
                                placeholder="Ej. 381..."
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Email
                            </label>
                            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <Mail size={18} className="text-red-300" />
                              <input
                                type="email"
                                value={form.contacto_email}
                                onChange={(e) =>
                                  handleChange('contacto_email', e.target.value)
                                }
                                placeholder="Ej. contacto@empresa.com"
                                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Tipo de relación
                            </label>
                            <select
                              value={form.tipo_relacion}
                              onChange={(e) =>
                                handleChange('tipo_relacion', e.target.value)
                              }
                              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 focus:bg-white/[0.07]"
                            >
                              <option
                                value="publicidad"
                                className="bg-[#101010]"
                              >
                                Publicidad
                              </option>
                              <option value="convenio" className="bg-[#101010]">
                                Convenio
                              </option>
                              <option value="ambos" className="bg-[#101010]">
                                Ambos
                              </option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Espacios de interés
                            </label>

                            <div className="rounded-[26px] border border-white/10 bg-white/5 p-3">
                              {loadingEspacios ? (
                                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-sm text-zinc-400">
                                  Cargando espacios disponibles...
                                </div>
                              ) : espacios.length === 0 ? (
                                <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-sm text-zinc-400">
                                  No hay espacios cargados todavía.
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                  {espacios.map((espacio) => {
                                    const IconComponent =
                                      CATEGORY_ICON_MAP[espacio.categoria] ||
                                      BriefcaseBusiness;

                                    const active =
                                      espaciosSeleccionados.includes(
                                        espacio.id
                                      );

                                    return (
                                      <button
                                        key={espacio.id}
                                        type="button"
                                        onClick={() =>
                                          handleToggleEspacio(espacio.id)
                                        }
                                        className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                                          active
                                            ? 'border-red-500/40 bg-red-500/12 shadow-[0_12px_40px_rgba(220,38,38,0.10)]'
                                            : 'border-white/10 bg-black/20 hover:border-red-500/25 hover:bg-white/[0.03]'
                                        }`}
                                      >
                                        <div className="flex items-start gap-3">
                                          <div
                                            className={`mt-0.5 rounded-2xl p-2 ${
                                              active
                                                ? 'bg-red-500/15 text-red-200'
                                                : 'bg-white/5 text-zinc-300'
                                            }`}
                                          >
                                            <IconComponent size={18} />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                              <p className="text-sm font-semibold text-white">
                                                {espacio.nombre}
                                              </p>
                                              <span
                                                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${
                                                  active
                                                    ? 'bg-red-500/15 text-red-200'
                                                    : 'bg-white/5 text-zinc-400'
                                                }`}
                                              >
                                                {CATEGORY_LABEL_MAP[
                                                  espacio.categoria
                                                ] || 'Otro'}
                                              </span>
                                            </div>

                                            {espacio.descripcion ? (
                                              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                                                {espacio.descripcion}
                                              </p>
                                            ) : null}
                                          </div>
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="md:col-span-2">
                            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                              Comentario o idea
                            </label>
                            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                              <MessageSquareText
                                size={18}
                                className="mt-1 text-red-300"
                              />
                              <textarea
                                rows={4}
                                value={form.mensaje_inicial}
                                onChange={(e) =>
                                  handleChange(
                                    'mensaje_inicial',
                                    e.target.value
                                  )
                                }
                                placeholder="Contanos brevemente qué te interesa: publicidad en pantallas, sponsor, convenio para alumnos, presencia digital, etc."
                                className="w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 rounded-[26px] border border-red-500/15 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                          Este formulario genera una solicitud comercial inicial
                          para que el equipo de Altos Roca Gym analice la
                          propuesta y continúe el contacto.
                        </div>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={handleClose}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white sm:w-auto"
                          >
                            Cancelar
                          </button>

                          <button
                            type="submit"
                            disabled={loadingSubmit}
                            className="w-full rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(220,38,38,0.28)] transition-all duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                          >
                            {loadingSubmit ? 'Enviando...' : 'Enviar solicitud'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </DialogPanel>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default AlianzasPublicModal;
