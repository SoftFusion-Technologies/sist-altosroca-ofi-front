/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzaOportunidadFormModal.jsx) renderiza el modal de alta y
 * edición de oportunidades comerciales del módulo Alianzas.
 *
 * Tema: Alianzas - Formulario de Oportunidad
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  CalendarClock,
  CircleDollarSign,
  FileText,
  Handshake,
  Mail,
  MessageSquareText,
  ShieldCheck,
  UserRound,
  X
} from 'lucide-react';

// Benjamin Orellana - 2026/04/14 - URL local fija para consumo del backend del módulo alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Estado inicial del formulario de oportunidad.
const INITIAL_FORM = {
  empresa_id: '',
  contacto_principal_id: '',
  staff_responsable_id: '',
  tipo_relacion: 'publicidad',
  origen: 'staff',
  estado: 'nuevo',
  titulo: '',
  mensaje_inicial: '',
  beneficios_ofrecidos: '',
  observaciones_internas: '',
  fecha_primer_contacto: '',
  fecha_proxima_accion: '',
  fecha_inicio: '',
  fecha_fin: '',
  monto_estimado: '',
  moneda: 'ARS',
  logo_aprobado: false,
  contrato_firmado: false,
  creado_desde_publico: false
};

// Benjamin Orellana - 2026/04/14 - Limpia strings vacíos antes de enviar al backend.
const cleanNullableString = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized === '' ? null : normalized;
};

// Benjamin Orellana - 2026/04/14 - Convierte fechas del backend a formato input datetime-local.
const toDateTimeLocalValue = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Benjamin Orellana - 2026/04/14 - Convierte fechas del backend a formato input date.
const toDateValue = (value) => {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const pad = (n) => String(n).padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());

  return `${year}-${month}-${day}`;
};

// Benjamin Orellana - 2026/04/14 - Mapea oportunidad existente a estado del formulario.
const buildFormFromOportunidad = (oportunidad) => {
  if (!oportunidad) return INITIAL_FORM;

  return {
    empresa_id: oportunidad.empresa_id ? String(oportunidad.empresa_id) : '',
    contacto_principal_id: oportunidad.contacto_principal_id
      ? String(oportunidad.contacto_principal_id)
      : '',
    staff_responsable_id: oportunidad.staff_responsable_id
      ? String(oportunidad.staff_responsable_id)
      : '',
    tipo_relacion: oportunidad.tipo_relacion || 'publicidad',
    origen: oportunidad.origen || 'staff',
    estado: oportunidad.estado || 'nuevo',
    titulo: oportunidad.titulo || '',
    mensaje_inicial: oportunidad.mensaje_inicial || '',
    beneficios_ofrecidos: oportunidad.beneficios_ofrecidos || '',
    observaciones_internas: oportunidad.observaciones_internas || '',
    fecha_primer_contacto: toDateTimeLocalValue(
      oportunidad.fecha_primer_contacto
    ),
    fecha_proxima_accion: toDateTimeLocalValue(
      oportunidad.fecha_proxima_accion
    ),
    fecha_inicio: toDateValue(oportunidad.fecha_inicio),
    fecha_fin: toDateValue(oportunidad.fecha_fin),
    monto_estimado:
      oportunidad.monto_estimado !== null &&
      oportunidad.monto_estimado !== undefined
        ? String(oportunidad.monto_estimado)
        : '',
    moneda: oportunidad.moneda || 'ARS',
    logo_aprobado: Number(oportunidad.logo_aprobado) === 1,
    contrato_firmado: Number(oportunidad.contrato_firmado) === 1,
    creado_desde_publico: Number(oportunidad.creado_desde_publico) === 1
  };
};

const AlianzaOportunidadFormModal = ({
  open,
  onClose,
  onSaved,
  oportunidad = null,
  actorUserId = null
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [empresas, setEmpresas] = useState([]);
  const [contactos, setContactos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditMode = useMemo(() => Boolean(oportunidad?.id), [oportunidad]);

  // Benjamin Orellana - 2026/04/14 - Actualiza un campo simple del formulario.
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Benjamin Orellana - 2026/04/14 - Resetea el estado local del formulario.
  const resetLocalState = () => {
    setForm(INITIAL_FORM);
    setContactos([]);
  };

  // Benjamin Orellana - 2026/04/14 - Cierra el modal evitando cierres durante guardado.
  const handleClose = () => {
    if (loadingSubmit) return;
    resetLocalState();
    onClose?.();
  };

  // Benjamin Orellana - 2026/04/14 - Carga empresas y usuarios para los selectores del formulario.
  const fetchCombos = async () => {
    try {
      setLoadingCombos(true);

      const [empresasRes, usuariosRes] = await Promise.all([
        axios.get(`${BASE_URL}/alianzas-empresas`),
        axios.get(`${BASE_URL}/users`)
      ]);

      setEmpresas(Array.isArray(empresasRes.data) ? empresasRes.data : []);
      setUsuarios(Array.isArray(usuariosRes.data) ? usuariosRes.data : []);
    } catch (error) {
      console.error('Error al cargar combos de oportunidad:', error);
      setEmpresas([]);
      setUsuarios([]);
    } finally {
      setLoadingCombos(false);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Carga contactos según la empresa seleccionada.
  const fetchContactosByEmpresa = async (empresaId) => {
    if (!empresaId) {
      setContactos([]);
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/alianzas-contactos`, {
        params: { empresa_id: empresaId }
      });

      setContactos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al obtener contactos de la empresa:', error);
      setContactos([]);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchCombos();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (oportunidad) {
      const nextForm = buildFormFromOportunidad(oportunidad);
      setForm(nextForm);

      if (nextForm.empresa_id) {
        fetchContactosByEmpresa(nextForm.empresa_id);
      } else {
        setContactos([]);
      }

      return;
    }

    setForm(INITIAL_FORM);
    setContactos([]);
  }, [open, oportunidad]);

  useEffect(() => {
    if (!open) return;

    if (!form.empresa_id) {
      setContactos([]);
      handleChange('contacto_principal_id', '');
      return;
    }

    fetchContactosByEmpresa(form.empresa_id);
  }, [form.empresa_id, open]);

  // Benjamin Orellana - 2026/04/14 - Valida reglas mínimas del formulario antes de guardar.
  const validateForm = () => {
    if (!form.empresa_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta la empresa',
        text: 'Seleccioná una empresa para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (!form.titulo.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el título',
        text: 'Ingresá un título para la oportunidad.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      form.fecha_inicio &&
      form.fecha_fin &&
      new Date(form.fecha_inicio) > new Date(form.fecha_fin)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Rango de fechas inválido',
        text: 'La fecha fin no puede ser anterior a la fecha inicio.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      form.monto_estimado &&
      (Number.isNaN(Number(form.monto_estimado)) ||
        Number(form.monto_estimado) < 0)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Monto inválido',
        text: 'El monto estimado debe ser numérico y mayor o igual a 0.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    return true;
  };

  // Benjamin Orellana - 2026/04/14 - Construye el payload final para alta o edición.
  const buildPayload = () => {
    return {
      empresa_id: Number(form.empresa_id),
      contacto_principal_id: form.contacto_principal_id
        ? Number(form.contacto_principal_id)
        : null,
      staff_responsable_id: form.staff_responsable_id
        ? Number(form.staff_responsable_id)
        : null,
      tipo_relacion: form.tipo_relacion,
      origen: form.origen,
      estado: form.estado,
      titulo: form.titulo.trim(),
      mensaje_inicial: cleanNullableString(form.mensaje_inicial),
      beneficios_ofrecidos: cleanNullableString(form.beneficios_ofrecidos),
      observaciones_internas: cleanNullableString(form.observaciones_internas),
      fecha_primer_contacto: form.fecha_primer_contacto || null,
      fecha_proxima_accion: form.fecha_proxima_accion || null,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
      monto_estimado:
        form.monto_estimado !== '' ? Number(form.monto_estimado) : null,
      moneda: form.moneda || 'ARS',
      logo_aprobado: form.logo_aprobado ? 1 : 0,
      contrato_firmado: form.contrato_firmado ? 1 : 0,
      creado_desde_publico: form.creado_desde_publico ? 1 : 0,
      ...(isEditMode
        ? { updated_by: actorUserId || null }
        : {
            created_by: actorUserId || null,
            updated_by: actorUserId || null
          })
    };
  };

  // Benjamin Orellana - 2026/04/14 - Guarda la oportunidad en alta o edición.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const payload = buildPayload();

      let response = null;

      if (isEditMode) {
        response = await axios.put(
          `${BASE_URL}/alianzas-oportunidades/${oportunidad.id}`,
          payload
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/alianzas-oportunidades`,
          payload
        );
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Oportunidad actualizada' : 'Oportunidad creada',
        text: isEditMode
          ? 'La oportunidad comercial fue actualizada correctamente.'
          : 'La oportunidad comercial fue creada correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      onSaved?.(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al guardar oportunidad:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al guardar la oportunidad.',
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
        <Dialog open={open} onClose={handleClose} className="relative z-[130]">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-5">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.985 }}
                transition={{ duration: 0.24 }}
                className="w-full sm:max-w-6xl"
              >
                <DialogPanel className="relative overflow-hidden rounded-t-[30px] border border-red-500/20 bg-[#050505] text-white shadow-[0_30px_120px_rgba(0,0,0,0.65)] sm:rounded-[32px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between border-b border-white/10 px-5 py-5 sm:px-7">
                      <div className="max-w-3xl pr-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                          Altos Roca Gym
                        </div>

                        <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl">
                          {isEditMode
                            ? 'Editar oportunidad comercial'
                            : 'Nueva oportunidad comercial'}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          Gestioná oportunidades internas de publicidad,
                          sponsor, convenios o relaciones mixtas, siempre con
                          empresa, contacto y responsable definidos desde
                          selectores.
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

                    <form onSubmit={handleSubmit} className="p-5 sm:p-7">
                      <div className="grid gap-5 xl:grid-cols-[1.02fr_1.18fr]">
                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Building2 size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Empresa y responsables
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Empresa
                                </label>
                                <select
                                  value={form.empresa_id}
                                  onChange={(e) =>
                                    setForm((prev) => ({
                                      ...prev,
                                      empresa_id: e.target.value,
                                      contacto_principal_id: ''
                                    }))
                                  }
                                  disabled={loadingCombos}
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 disabled:opacity-60"
                                >
                                  <option value="" className="bg-[#101010]">
                                    Seleccionar empresa
                                  </option>
                                  {empresas.map((empresa) => (
                                    <option
                                      key={empresa.id}
                                      value={empresa.id}
                                      className="bg-[#101010]"
                                    >
                                      {empresa.nombre_fantasia ||
                                        empresa.razon_social}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Contacto principal
                                </label>
                                <select
                                  value={form.contacto_principal_id}
                                  onChange={(e) =>
                                    handleChange(
                                      'contacto_principal_id',
                                      e.target.value
                                    )
                                  }
                                  disabled={!form.empresa_id}
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 disabled:opacity-60"
                                >
                                  <option value="" className="bg-[#101010]">
                                    Seleccionar contacto
                                  </option>
                                  {contactos.map((contacto) => (
                                    <option
                                      key={contacto.id}
                                      value={contacto.id}
                                      className="bg-[#101010]"
                                    >
                                      {`${contacto.nombre || ''} ${
                                        contacto.apellido || ''
                                      }`.trim() || `Contacto #${contacto.id}`}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Responsable
                                </label>
                                <select
                                  value={form.staff_responsable_id}
                                  onChange={(e) =>
                                    handleChange(
                                      'staff_responsable_id',
                                      e.target.value
                                    )
                                  }
                                  disabled={loadingCombos}
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 disabled:opacity-60"
                                >
                                  <option value="" className="bg-[#101010]">
                                    Sin asignar
                                  </option>
                                  {usuarios.map((user) => (
                                    <option
                                      key={user.id}
                                      value={user.id}
                                      className="bg-[#101010]"
                                    >
                                      {user.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Handshake size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Configuración comercial
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Tipo de relación
                                </label>
                                <select
                                  value={form.tipo_relacion}
                                  onChange={(e) =>
                                    handleChange(
                                      'tipo_relacion',
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                >
                                  <option
                                    value="publicidad"
                                    className="bg-[#101010]"
                                  >
                                    Publicidad
                                  </option>
                                  <option
                                    value="convenio"
                                    className="bg-[#101010]"
                                  >
                                    Convenio
                                  </option>
                                  <option
                                    value="ambos"
                                    className="bg-[#101010]"
                                  >
                                    Ambos
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Origen
                                </label>
                                <select
                                  value={form.origen}
                                  onChange={(e) =>
                                    handleChange('origen', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                >
                                  <option value="web" className="bg-[#101010]">
                                    Web
                                  </option>
                                  <option
                                    value="instagram"
                                    className="bg-[#101010]"
                                  >
                                    Instagram
                                  </option>
                                  <option
                                    value="whatsapp"
                                    className="bg-[#101010]"
                                  >
                                    WhatsApp
                                  </option>
                                  <option
                                    value="referido"
                                    className="bg-[#101010]"
                                  >
                                    Referido
                                  </option>
                                  <option
                                    value="staff"
                                    className="bg-[#101010]"
                                  >
                                    Staff
                                  </option>
                                  <option value="otro" className="bg-[#101010]">
                                    Otro
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Estado
                                </label>
                                <select
                                  value={form.estado}
                                  onChange={(e) =>
                                    handleChange('estado', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                >
                                  <option
                                    value="nuevo"
                                    className="bg-[#101010]"
                                  >
                                    Nuevo
                                  </option>
                                  <option
                                    value="contactado"
                                    className="bg-[#101010]"
                                  >
                                    Contactado
                                  </option>
                                  <option
                                    value="reunion_pendiente"
                                    className="bg-[#101010]"
                                  >
                                    Reunión pendiente
                                  </option>
                                  <option
                                    value="propuesta_enviada"
                                    className="bg-[#101010]"
                                  >
                                    Propuesta enviada
                                  </option>
                                  <option
                                    value="negociacion"
                                    className="bg-[#101010]"
                                  >
                                    Negociación
                                  </option>
                                  <option
                                    value="activo"
                                    className="bg-[#101010]"
                                  >
                                    Activo
                                  </option>
                                  <option
                                    value="pausado"
                                    className="bg-[#101010]"
                                  >
                                    Pausado
                                  </option>
                                  <option
                                    value="cerrado"
                                    className="bg-[#101010]"
                                  >
                                    Cerrado
                                  </option>
                                  <option
                                    value="rechazado"
                                    className="bg-[#101010]"
                                  >
                                    Rechazado
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Moneda
                                </label>
                                <input
                                  type="text"
                                  value={form.moneda}
                                  onChange={(e) =>
                                    handleChange('moneda', e.target.value)
                                  }
                                  placeholder="Ej. ARS"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Título
                                </label>
                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-red-500/40">
                                  <FileText
                                    size={17}
                                    className="text-red-300"
                                  />
                                  <input
                                    type="text"
                                    value={form.titulo}
                                    onChange={(e) =>
                                      handleChange('titulo', e.target.value)
                                    }
                                    placeholder="Ej. Sponsor anual en pantallas y convenios"
                                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <ShieldCheck size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Flags operativos
                              </h3>
                            </div>

                            <div className="grid gap-3">
                              <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                                <span className="text-sm text-zinc-200">
                                  Logo aprobado
                                </span>
                                <input
                                  type="checkbox"
                                  checked={form.logo_aprobado}
                                  onChange={(e) =>
                                    handleChange(
                                      'logo_aprobado',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 accent-red-600"
                                />
                              </label>

                              <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                                <span className="text-sm text-zinc-200">
                                  Contrato firmado
                                </span>
                                <input
                                  type="checkbox"
                                  checked={form.contrato_firmado}
                                  onChange={(e) =>
                                    handleChange(
                                      'contrato_firmado',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 accent-red-600"
                                />
                              </label>

                              <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                                <span className="text-sm text-zinc-200">
                                  Creado desde público
                                </span>
                                <input
                                  type="checkbox"
                                  checked={form.creado_desde_publico}
                                  onChange={(e) =>
                                    handleChange(
                                      'creado_desde_publico',
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 accent-red-600"
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <MessageSquareText size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Información comercial
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Mensaje inicial
                                </label>
                                <textarea
                                  rows={4}
                                  value={form.mensaje_inicial}
                                  onChange={(e) =>
                                    handleChange(
                                      'mensaje_inicial',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Primer contexto o interés expresado por la empresa."
                                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Beneficios ofrecidos
                                </label>
                                <textarea
                                  rows={4}
                                  value={form.beneficios_ofrecidos}
                                  onChange={(e) =>
                                    handleChange(
                                      'beneficios_ofrecidos',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ej. Presencia en pantallas, mención en redes, beneficios para alumnos."
                                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Observaciones internas
                                </label>
                                <textarea
                                  rows={4}
                                  value={form.observaciones_internas}
                                  onChange={(e) =>
                                    handleChange(
                                      'observaciones_internas',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Notas internas del staff sobre negociación, perfil de la empresa o próximos pasos."
                                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <CalendarClock size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Fechas y monto
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Primer contacto
                                </label>
                                <input
                                  type="datetime-local"
                                  value={form.fecha_primer_contacto}
                                  onChange={(e) =>
                                    handleChange(
                                      'fecha_primer_contacto',
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Próxima acción
                                </label>
                                <input
                                  type="datetime-local"
                                  value={form.fecha_proxima_accion}
                                  onChange={(e) =>
                                    handleChange(
                                      'fecha_proxima_accion',
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Fecha inicio
                                </label>
                                <input
                                  type="date"
                                  value={form.fecha_inicio}
                                  onChange={(e) =>
                                    handleChange('fecha_inicio', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Fecha fin
                                </label>
                                <input
                                  type="date"
                                  value={form.fecha_fin}
                                  onChange={(e) =>
                                    handleChange('fecha_fin', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Monto estimado
                                </label>
                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-red-500/40">
                                  <CircleDollarSign
                                    size={17}
                                    className="text-red-300"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={form.monto_estimado}
                                    onChange={(e) =>
                                      handleChange(
                                        'monto_estimado',
                                        e.target.value
                                      )
                                    }
                                    placeholder="Ej. 150000"
                                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-red-500/15 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                            Este formulario administra la oportunidad comercial
                            central del módulo. Empresa, contacto y responsable
                            se resuelven siempre desde selectores y no por carga
                            manual de IDs.
                          </div>
                        </div>
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
                          {loadingSubmit
                            ? 'Guardando...'
                            : isEditMode
                              ? 'Guardar cambios'
                              : 'Crear oportunidad'}
                        </button>
                      </div>
                    </form>
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

export default AlianzaOportunidadFormModal;
