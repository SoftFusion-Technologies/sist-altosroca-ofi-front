/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 13 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Modal mobile-first para que alumnos se registren sin asignación de profesor.
 * Envía la información a students_pendientes con una experiencia moderna,
 * liviana y optimizada para celular.
 *
 * Tema: Registro público de alumnos
 * Capa: Frontend
 */

import { Dialog, DialogPanel } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useMemo, useState } from 'react';
import { X, User, Phone, CreditCard, Target } from 'lucide-react';

// Benjamin Orellana - 2026/04/13 - Modal ultra moderno de auto registro para alumnos pendientes.
export default function StudentSelfRegisterModal({ open, onClose }) {
  const API_URL = useMemo(
    () => import.meta.env.VITE_API_URL || 'http://localhost:8080',
    []
  );

  const objetivos = [
    'Bajar grasa',
    'Ganar masa muscular',
    'Tonificar',
    'Mejorar salud',
    'Volver a entrenar',
    'Rendimiento'
  ];

  const [form, setForm] = useState({
    nomyape: '',
    telefono: '',
    dni: '',
    objetivo: ''
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({
      nomyape: '',
      telefono: '',
      dni: '',
      objetivo: ''
    });
  };

  const handleClose = () => {
    if (loading) return;
    resetForm();
    onClose?.();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nomyape.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta tu nombre',
        text: 'Ingresá tu nombre y apellido para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0d',
        color: '#ffffff'
      });
      return;
    }

    if (!form.telefono.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta tu teléfono',
        text: 'Ingresá un teléfono para que podamos contactarte.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0d',
        color: '#ffffff'
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API_URL}/students-pendientes`, {
        nomyape: form.nomyape.trim(),
        telefono: form.telefono.trim(),
        dni: form.dni.trim() || null,
        objetivo: form.objetivo.trim() || null
      });

      await Swal.fire({
        icon: 'success',
        title: 'Registro enviado',
        text: 'Recibimos tus datos correctamente. En breve el equipo de Altos Roca se pondrá en contacto.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0d',
        color: '#ffffff'
      });

      resetForm();
      onClose?.();
    } catch (error) {
      console.error('Error al registrar alumno pendiente:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo enviar',
        text: 'Ocurrió un error al enviar tu registro. Intentá nuevamente.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0d',
        color: '#ffffff'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          static
          open={open}
          onClose={handleClose}
          className="relative z-[200]"
        >
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" />

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-0 sm:items-center sm:p-4">
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.98 }}
                transition={{ duration: 0.28 }}
                className="w-full sm:max-w-xl"
              >
                <DialogPanel className="relative overflow-hidden rounded-t-[32px] border border-white/10 bg-[#070707] text-white shadow-[0_30px_80px_rgba(0,0,0,0.55)] sm:rounded-[32px]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between border-b border-white/10 px-5 py-5 sm:px-6">
                      <div className="pr-4">
                        <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                          Altos Roca
                        </span>

                        <h2 className="mt-3 titulo uppercase text-2xl font-black tracking-tight sm:text-3xl">
                          Registrarme
                        </h2>

                        <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
                          Dejanos solo tus datos principales y te contactamos
                          para continuar con tu alta.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleClose}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="px-5 py-5 sm:px-6 sm:py-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Nombre y apellido
                          </label>

                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                            <User size={18} className="text-red-300" />
                            <input
                              type="text"
                              value={form.nomyape}
                              onChange={(e) =>
                                updateField('nomyape', e.target.value)
                              }
                              placeholder="Ej. Juan Pérez"
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
                              type="tel"
                              value={form.telefono}
                              onChange={(e) =>
                                updateField('telefono', e.target.value)
                              }
                              placeholder="Ej. 381..."
                              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            DNI
                            <span className="ml-2 text-zinc-500 normal-case tracking-normal">
                              Opcional
                            </span>
                          </label>

                          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-red-500/40 focus-within:bg-white/[0.07]">
                            <CreditCard size={18} className="text-red-300" />
                            <input
                              type="text"
                              value={form.dni}
                              onChange={(e) =>
                                updateField('dni', e.target.value)
                              }
                              placeholder="Solo si querés adelantarlo"
                              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                            Objetivo
                            <span className="ml-2 text-zinc-500 normal-case tracking-normal">
                              Opcional
                            </span>
                          </label>

                          <div className="flex flex-wrap gap-2">
                            {objetivos.map((item) => {
                              const active = form.objetivo === item;

                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() =>
                                    updateField('objetivo', active ? '' : item)
                                  }
                                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                                    active
                                      ? 'border-red-500/40 bg-red-500/15 text-red-200'
                                      : 'border-white/10 bg-white/5 text-zinc-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white'
                                  }`}
                                >
                                  <span className="inline-flex items-center gap-2">
                                    <Target size={14} />
                                    {item}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 rounded-2xl border border-red-500/10 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                        Tu registro entra como solicitud pendiente. Después el
                        equipo te contacta y continúa el alta internamente.
                      </div>

                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white sm:w-auto"
                        >
                          Cancelar
                        </button>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                        >
                          {loading ? 'Enviando...' : 'Enviar registro'}
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
}
