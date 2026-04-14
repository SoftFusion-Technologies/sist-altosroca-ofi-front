/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzaNotaFormModal.jsx) renderiza el modal de alta y edición
 * de notas internas del módulo Alianzas.
 *
 * Tema: Alianzas - Formulario de Nota
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CalendarClock,
  FileText,
  MessageSquareText,
  UserRound,
  X
} from 'lucide-react';

// Benjamin Orellana - 2026/04/14 - URL local fija para consumo del backend del módulo alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Estado inicial del formulario de notas comerciales.
const INITIAL_FORM = {
  oportunidad_id: '',
  usuario_id: '',
  tipo: 'nota',
  titulo: '',
  nota: '',
  fecha_recordatorio: ''
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

// Benjamin Orellana - 2026/04/14 - Mapea una nota existente al estado del formulario.
const buildFormFromNota = ({ nota, oportunidadId, actorUserId }) => {
  if (!nota) {
    return {
      ...INITIAL_FORM,
      oportunidad_id: oportunidadId ? String(oportunidadId) : '',
      usuario_id: actorUserId ? String(actorUserId) : ''
    };
  }

  return {
    oportunidad_id: nota.oportunidad_id ? String(nota.oportunidad_id) : '',
    usuario_id:
      nota.usuario_id !== null && nota.usuario_id !== undefined
        ? String(nota.usuario_id)
        : actorUserId
          ? String(actorUserId)
          : '',
    tipo: nota.tipo || 'nota',
    titulo: nota.titulo || '',
    nota: nota.nota || '',
    fecha_recordatorio: toDateTimeLocalValue(nota.fecha_recordatorio)
  };
};

const AlianzaNotaFormModal = ({
  open,
  onClose,
  onSaved,
  nota = null,
  oportunidadId = null,
  oportunidadTitulo = '',
  actorUserId = null
}) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [oportunidades, setOportunidades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingCombos, setLoadingCombos] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditMode = useMemo(() => Boolean(nota?.id), [nota]);
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

  // Benjamin Orellana - 2026/04/14 - Carga selectores de oportunidades y usuarios.
  const fetchCombos = async () => {
    try {
      setLoadingCombos(true);

      const [oportunidadesRes, usuariosRes] = await Promise.all([
        axios.get(`${BASE_URL}/alianzas-oportunidades`),
        axios.get(`${BASE_URL}/users`)
      ]);

      setOportunidades(
        Array.isArray(oportunidadesRes.data) ? oportunidadesRes.data : []
      );
      setUsuarios(Array.isArray(usuariosRes.data) ? usuariosRes.data : []);
    } catch (error) {
      console.error('Error al cargar combos de notas de alianzas:', error);
      setOportunidades([]);
      setUsuarios([]);
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

    setForm(buildFormFromNota({ nota, oportunidadId, actorUserId }));
  }, [open, nota, oportunidadId, actorUserId]);

  // Benjamin Orellana - 2026/04/14 - Valida reglas mínimas del formulario de nota.
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

    if (!form.nota.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el contenido',
        text: 'Ingresá el texto de la nota o seguimiento.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    return true;
  };

  // Benjamin Orellana - 2026/04/14 - Construye el payload final para alta o edición de nota.
  const buildPayload = () => {
    return {
      oportunidad_id: Number(form.oportunidad_id),
      usuario_id: form.usuario_id ? Number(form.usuario_id) : null,
      tipo: form.tipo,
      titulo: cleanNullableString(form.titulo),
      nota: form.nota.trim(),
      fecha_recordatorio: form.fecha_recordatorio || null
    };
  };

  // Benjamin Orellana - 2026/04/14 - Guarda la nota comercial en alta o edición.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const payload = buildPayload();

      let response = null;

      if (isEditMode) {
        response = await axios.put(
          `${BASE_URL}/alianzas-notas/${nota.id}`,
          payload
        );
      } else {
        response = await axios.post(`${BASE_URL}/alianzas-notas`, payload);
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Nota actualizada' : 'Nota creada',
        text: isEditMode
          ? 'La nota comercial fue actualizada correctamente.'
          : 'La nota comercial fue creada correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      onSaved?.(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al guardar nota comercial:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al guardar la nota comercial.',
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
        <Dialog open={open} onClose={handleClose} className="relative z-[140]">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-5">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.985 }}
                transition={{ duration: 0.24 }}
                className="w-full sm:max-w-4xl"
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
                            ? 'Editar nota comercial'
                            : 'Nueva nota comercial'}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          Registrá seguimiento, reuniones, llamadas,
                          recordatorios o notas internas vinculadas a una
                          oportunidad comercial.
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
                              <FileText size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Contexto
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
                                  Usuario
                                </label>
                                <select
                                  value={form.usuario_id}
                                  onChange={(e) =>
                                    handleChange('usuario_id', e.target.value)
                                  }
                                  disabled={loadingCombos}
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40 disabled:opacity-60"
                                >
                                  <option value="" className="bg-[#101010]">
                                    Sin usuario
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

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Tipo
                                </label>
                                <select
                                  value={form.tipo}
                                  onChange={(e) =>
                                    handleChange('tipo', e.target.value)
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                >
                                  <option value="nota" className="bg-[#101010]">
                                    Nota
                                  </option>
                                  <option
                                    value="llamada"
                                    className="bg-[#101010]"
                                  >
                                    Llamada
                                  </option>
                                  <option
                                    value="reunion"
                                    className="bg-[#101010]"
                                  >
                                    Reunión
                                  </option>
                                  <option
                                    value="seguimiento"
                                    className="bg-[#101010]"
                                  >
                                    Seguimiento
                                  </option>
                                  <option
                                    value="recordatorio"
                                    className="bg-[#101010]"
                                  >
                                    Recordatorio
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <CalendarClock size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Programación
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Fecha recordatorio
                                </label>
                                <input
                                  type="datetime-local"
                                  value={form.fecha_recordatorio}
                                  onChange={(e) =>
                                    handleChange(
                                      'fecha_recordatorio',
                                      e.target.value
                                    )
                                  }
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div className="rounded-2xl border border-red-500/15 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                                Usá recordatorio cuando quieras dejar una fecha
                                puntual para seguimiento, reunión o próxima
                                acción vinculada a la oportunidad.
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <MessageSquareText size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Contenido
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Título
                                </label>
                                <input
                                  type="text"
                                  value={form.titulo}
                                  onChange={(e) =>
                                    handleChange('titulo', e.target.value)
                                  }
                                  placeholder="Ej. Reunión inicial con la empresa"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Nota
                                </label>
                                <textarea
                                  rows={10}
                                  value={form.nota}
                                  onChange={(e) =>
                                    handleChange('nota', e.target.value)
                                  }
                                  placeholder="Describí el seguimiento, la conversación, la propuesta o lo que se acordó."
                                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-red-500/15 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                            Las notas quedan asociadas a la oportunidad
                            comercial y pueden utilizarse para trazabilidad,
                            reuniones, seguimiento o recordatorios internos del
                            staff.
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
                              : 'Crear nota'}
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

export default AlianzaNotaFormModal;
