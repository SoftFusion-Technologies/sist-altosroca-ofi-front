/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzaEspacioFormModal.jsx) renderiza el modal de alta y
 * edición de espacios vinculados a oportunidades comerciales del módulo Alianzas.
 *
 * Tema: Alianzas - Formulario de Espacio por Oportunidad
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarClock,
  CircleDollarSign,
  FileText,
  Layers3,
  Repeat,
  ShieldCheck,
  Sparkles,
  X
} from 'lucide-react';

// Benjamin Orellana - 2026/04/14 - URL local fija para consumo del backend del módulo alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Estado inicial del formulario de espacios por oportunidad.
const INITIAL_FORM = {
  oportunidad_id: '',
  espacio_id: '',
  modalidad: 'fijo',
  cantidad: '1',
  frecuencia: '',
  precio_unitario: '',
  descuento_pct: '0',
  precio_final: '',
  fecha_inicio: '',
  fecha_fin: '',
  beneficios_texto: '',
  observaciones: '',
  estado: 'propuesto'
};

// Benjamin Orellana - 2026/04/14 - Limpia strings vacíos antes de enviar al backend.
const cleanNullableString = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized === '' ? null : normalized;
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

// Benjamin Orellana - 2026/04/14 - Mapea un registro existente al estado del formulario.
const buildFormFromRegistro = ({ registro, oportunidadId }) => {
  if (!registro) {
    return {
      ...INITIAL_FORM,
      oportunidad_id: oportunidadId ? String(oportunidadId) : ''
    };
  }

  return {
    oportunidad_id: registro.oportunidad_id
      ? String(registro.oportunidad_id)
      : '',
    espacio_id: registro.espacio_id ? String(registro.espacio_id) : '',
    modalidad: registro.modalidad || 'fijo',
    cantidad:
      registro.cantidad !== null && registro.cantidad !== undefined
        ? String(registro.cantidad)
        : '1',
    frecuencia: registro.frecuencia || '',
    precio_unitario:
      registro.precio_unitario !== null &&
      registro.precio_unitario !== undefined
        ? String(registro.precio_unitario)
        : '',
    descuento_pct:
      registro.descuento_pct !== null && registro.descuento_pct !== undefined
        ? String(registro.descuento_pct)
        : '0',
    precio_final:
      registro.precio_final !== null && registro.precio_final !== undefined
        ? String(registro.precio_final)
        : '',
    fecha_inicio: toDateValue(registro.fecha_inicio),
    fecha_fin: toDateValue(registro.fecha_fin),
    beneficios_texto: registro.beneficios_texto || '',
    observaciones: registro.observaciones || '',
    estado: registro.estado || 'propuesto'
  };
};

const AlianzaEspacioFormModal = ({
  open,
  onClose,
  onSaved,
  registro = null,
  oportunidadId = null,
  oportunidadTitulo = ''
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [oportunidades, setOportunidades] = useState([]);
  const [espacios, setEspacios] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditMode = useMemo(() => Boolean(registro?.id), [registro]);
  const isOportunidadLocked = useMemo(
    () => Boolean(oportunidadId),
    [oportunidadId]
  );

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
  };

  // Benjamin Orellana - 2026/04/14 - Cierra el modal evitando cierres durante guardado.
  const handleClose = () => {
    if (loadingSubmit) return;
    resetLocalState();
    onClose?.();
  };

  // Benjamin Orellana - 2026/04/14 - Carga selectores de oportunidades y espacios comerciales.
  const fetchCombos = async () => {
    try {
      setLoadingCombos(true);

      const [oportunidadesRes, espaciosRes] = await Promise.all([
        axios.get(`${BASE_URL}/alianzas-oportunidades`),
        axios.get(`${BASE_URL}/alianzas-espacios`, {
          params: { activo: true }
        })
      ]);

      setOportunidades(
        Array.isArray(oportunidadesRes.data) ? oportunidadesRes.data : []
      );
      setEspacios(Array.isArray(espaciosRes.data) ? espaciosRes.data : []);
    } catch (error) {
      console.error('Error al cargar combos de espacios de alianzas:', error);
      setOportunidades([]);
      setEspacios([]);
    } finally {
      setLoadingCombos(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchCombos();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setForm(buildFormFromRegistro({ registro, oportunidadId }));
  }, [open, registro, oportunidadId]);

  // Benjamin Orellana - 2026/04/14 - Valida reglas mínimas del formulario antes de guardar.
  const validateForm = () => {
    if (!form.oportunidad_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta la oportunidad',
        text: 'Seleccioná una oportunidad para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (!form.espacio_id) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el espacio',
        text: 'Seleccioná un espacio comercial para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      !form.cantidad ||
      Number.isNaN(Number(form.cantidad)) ||
      Number(form.cantidad) <= 0
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'La cantidad debe ser un número mayor a 0.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      form.precio_unitario !== '' &&
      (Number.isNaN(Number(form.precio_unitario)) ||
        Number(form.precio_unitario) < 0)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio unitario inválido',
        text: 'El precio unitario debe ser un número mayor o igual a 0.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      form.descuento_pct !== '' &&
      (Number.isNaN(Number(form.descuento_pct)) ||
        Number(form.descuento_pct) < 0)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Descuento inválido',
        text: 'El descuento debe ser un número mayor o igual a 0.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      form.precio_final !== '' &&
      (Number.isNaN(Number(form.precio_final)) || Number(form.precio_final) < 0)
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Precio final inválido',
        text: 'El precio final debe ser un número mayor o igual a 0.',
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

    return true;
  };

  // Benjamin Orellana - 2026/04/14 - Construye el payload final para alta o edición.
  const buildPayload = () => {
    return {
      oportunidad_id: Number(form.oportunidad_id),
      espacio_id: Number(form.espacio_id),
      modalidad: form.modalidad,
      cantidad: Number(form.cantidad),
      frecuencia: cleanNullableString(form.frecuencia),
      precio_unitario:
        form.precio_unitario !== '' ? Number(form.precio_unitario) : null,
      descuento_pct: form.descuento_pct !== '' ? Number(form.descuento_pct) : 0,
      precio_final: form.precio_final !== '' ? Number(form.precio_final) : null,
      fecha_inicio: form.fecha_inicio || null,
      fecha_fin: form.fecha_fin || null,
      beneficios_texto: cleanNullableString(form.beneficios_texto),
      observaciones: cleanNullableString(form.observaciones),
      estado: form.estado
    };
  };

  // Benjamin Orellana - 2026/04/14 - Guarda el espacio vinculado a una oportunidad.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const payload = buildPayload();

      let response = null;

      if (isEditMode) {
        response = await axios.put(
          `${BASE_URL}/alianzas-oportunidad-espacios/${registro.id}`,
          payload
        );
      } else {
        response = await axios.post(
          `${BASE_URL}/alianzas-oportunidad-espacios`,
          payload
        );
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Espacio actualizado' : 'Espacio agregado',
        text: isEditMode
          ? 'El espacio vinculado fue actualizado correctamente.'
          : 'El espacio fue agregado correctamente a la oportunidad.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      onSaved?.(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al guardar espacio vinculado:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al guardar el espacio vinculado.',
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
        <Dialog open={open} onClose={handleClose} className="relative z-[145]">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-5">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.985 }}
                transition={{ duration: 0.24 }}
                className="w-full sm:max-w-5xl"
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
                            ? 'Editar espacio vinculado'
                            : 'Agregar espacio a oportunidad'}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          Vinculá espacios comerciales a oportunidades con
                          modalidad, fechas, cantidad, precios y estado
                          operativo.
                        </p>

                        {isOportunidadLocked && oportunidadTitulo ? (
                          <div className="mt-4 rounded-2xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm text-zinc-200">
                            Oportunidad actual: {oportunidadTitulo}
                          </div>
                        ) : null}
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
                      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Layers3 size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Contexto comercial
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Oportunidad
                                </label>
                                <select
                                  value={form.oportunidad_id}
                                  onChange={(e) =>
                                    handleChange(
                                      'oportunidad_id',
                                      e.target.value
                                    )
                                  }
                                  disabled={
                                    isOportunidadLocked || loadingCombos
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 disabled:opacity-60"
                                >
                                  <option value="" className="bg-[#101010]">
                                    Seleccionar oportunidad
                                  </option>
                                  {oportunidades.map((item) => (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      className="bg-[#101010]"
                                    >
                                      {item?.empresa?.nombre_fantasia ||
                                        item?.empresa?.razon_social ||
                                        item.titulo}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Espacio
                                </label>
                                <select
                                  value={form.espacio_id}
                                  onChange={(e) =>
                                    handleChange('espacio_id', e.target.value)
                                  }
                                  disabled={loadingCombos}
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 disabled:opacity-60"
                                >
                                  <option value="" className="bg-[#101010]">
                                    Seleccionar espacio
                                  </option>
                                  {espacios.map((item) => (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      className="bg-[#101010]"
                                    >
                                      {item.nombre}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Repeat size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Modalidad y operación
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Modalidad
                                </label>
                                <select
                                  value={form.modalidad}
                                  onChange={(e) =>
                                    handleChange('modalidad', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                >
                                  <option value="fijo" className="bg-[#101010]">
                                    Fijo
                                  </option>
                                  <option
                                    value="rotativo"
                                    className="bg-[#101010]"
                                  >
                                    Rotativo
                                  </option>
                                  <option
                                    value="eventual"
                                    className="bg-[#101010]"
                                  >
                                    Eventual
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
                                    value="propuesto"
                                    className="bg-[#101010]"
                                  >
                                    Propuesto
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
                                    value="finalizado"
                                    className="bg-[#101010]"
                                  >
                                    Finalizado
                                  </option>
                                  <option
                                    value="cancelado"
                                    className="bg-[#101010]"
                                  >
                                    Cancelado
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Cantidad
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  step="1"
                                  value={form.cantidad}
                                  onChange={(e) =>
                                    handleChange('cantidad', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Frecuencia
                                </label>
                                <input
                                  type="text"
                                  value={form.frecuencia}
                                  onChange={(e) =>
                                    handleChange('frecuencia', e.target.value)
                                  }
                                  placeholder="Ej. semanal, mensual, rotación quincenal"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <CalendarClock size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Vigencia
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
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
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <CircleDollarSign size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Valores
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Precio unitario
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={form.precio_unitario}
                                  onChange={(e) =>
                                    handleChange(
                                      'precio_unitario',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ej. 25000"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Descuento %
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={form.descuento_pct}
                                  onChange={(e) =>
                                    handleChange(
                                      'descuento_pct',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ej. 10"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div className="md:col-span-2">
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Precio final
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={form.precio_final}
                                  onChange={(e) =>
                                    handleChange('precio_final', e.target.value)
                                  }
                                  placeholder="Ej. 22500"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Sparkles size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Beneficios y observaciones
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Beneficios
                                </label>
                                <textarea
                                  rows={4}
                                  value={form.beneficios_texto}
                                  onChange={(e) =>
                                    handleChange(
                                      'beneficios_texto',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Ej. Presencia destacada en pantallas internas + mención en redes."
                                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Observaciones
                                </label>
                                <textarea
                                  rows={5}
                                  value={form.observaciones}
                                  onChange={(e) =>
                                    handleChange(
                                      'observaciones',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Notas internas sobre vigencia, operación o condiciones especiales."
                                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-red-500/15 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                            Cada vínculo entre oportunidad y espacio representa
                            una pieza operativa concreta del acuerdo comercial:
                            modalidad, vigencia, cantidad, condiciones y estado.
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
                              : 'Agregar espacio'}
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

export default AlianzaEspacioFormModal;
