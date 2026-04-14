/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzasEmpresasGet.jsx) renderiza la vista administrativa de
 * empresas del módulo Alianzas para Altos Roca Gym.
 *
 * Tema: Alianzas - Empresas
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Dialog, DialogPanel } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  Eye,
  FileText,
  Filter,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCcw,
  Search,
  Trash2,
  UserRound,
  X
} from 'lucide-react';
import NavbarStaff from '../../staff/NavbarStaff';
import ParticlesBackground from '../../../components/ParticlesBackground';

// Benjamin Orellana - 2026/04/14 - URL local fija del backend para el módulo alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Tamaño de página para paginación local.
const PAGE_SIZE = 10;

// Benjamin Orellana - 2026/04/14 - Estado inicial de filtros del panel.
const INITIAL_FILTERS = {
  q: '',
  rubro: '',
  ciudad: '',
  estado: ''
};

// Benjamin Orellana - 2026/04/14 - Estado inicial del formulario de empresa.
const INITIAL_FORM = {
  razon_social: '',
  nombre_fantasia: '',
  cuit: '',
  rubro: '',
  telefono: '',
  email: '',
  sitio_web: '',
  instagram: '',
  facebook: '',
  logo_url: '',
  descripcion_empresa: '',
  ciudad: '',
  provincia: '',
  estado: 'activo'
};

// Benjamin Orellana - 2026/04/14 - Limpia strings vacíos para evitar persistir basura.
const cleanNullableString = (value) => {
  if (value === undefined || value === null) return null;
  const normalized = String(value).trim();
  return normalized === '' ? null : normalized;
};

// Benjamin Orellana - 2026/04/14 - Formatea fechas para visualización simple.
const formatDate = (value) => {
  if (!value) return '-';

  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return '-';
  }
};

// Benjamin Orellana - 2026/04/14 - Devuelve clases visuales por estado de empresa.
const getEstadoClass = (estado) => {
  if (estado === 'activo') {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
  }

  if (estado === 'inactivo') {
    return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-200';
  }

  return 'border-white/10 bg-white/5 text-zinc-200';
};

// Benjamin Orellana - 2026/04/14 - Toma empresa existente y la mapea al estado del formulario.
const buildFormFromEmpresa = (empresa) => {
  if (!empresa) return INITIAL_FORM;

  return {
    razon_social: empresa.razon_social || '',
    nombre_fantasia: empresa.nombre_fantasia || '',
    cuit: empresa.cuit || '',
    rubro: empresa.rubro || '',
    telefono: empresa.telefono || '',
    email: empresa.email || '',
    sitio_web: empresa.sitio_web || '',
    instagram: empresa.instagram || '',
    facebook: empresa.facebook || '',
    logo_url: empresa.logo_url || '',
    descripcion_empresa: empresa.descripcion_empresa || '',
    ciudad: empresa.ciudad || '',
    provincia: empresa.provincia || '',
    estado: empresa.estado || 'activo'
  };
};

// Benjamin Orellana - 2026/04/14 - Modal embebido para alta y edición de empresas.
const EmpresaFormModal = ({ open, onClose, onSaved, empresa = null }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditMode = useMemo(() => Boolean(empresa?.id), [empresa]);

  // Benjamin Orellana - 2026/04/14 - Sincroniza el formulario cuando cambia la empresa a editar.
  useEffect(() => {
    if (!open) return;
    setForm(buildFormFromEmpresa(empresa));
  }, [open, empresa]);

  // Benjamin Orellana - 2026/04/14 - Actualiza un campo puntual del formulario.
  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Benjamin Orellana - 2026/04/14 - Resetea el formulario al estado inicial.
  const resetForm = () => {
    setForm(INITIAL_FORM);
  };

  // Benjamin Orellana - 2026/04/14 - Cierra el modal evitando cierres accidentales durante guardado.
  const handleClose = () => {
    if (loadingSubmit) return;
    resetForm();
    onClose?.();
  };

  // Benjamin Orellana - 2026/04/14 - Valida campos mínimos del formulario de empresa.
  const validateForm = () => {
    if (!form.razon_social.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta la razón social',
        text: 'Ingresá la razón social para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Email inválido',
        text: 'Revisá el email cargado antes de guardar.',
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
      razon_social: form.razon_social.trim(),
      nombre_fantasia: cleanNullableString(form.nombre_fantasia),
      cuit: cleanNullableString(form.cuit),
      rubro: cleanNullableString(form.rubro),
      telefono: cleanNullableString(form.telefono),
      email: cleanNullableString(form.email),
      sitio_web: cleanNullableString(form.sitio_web),
      instagram: cleanNullableString(form.instagram),
      facebook: cleanNullableString(form.facebook),
      logo_url: cleanNullableString(form.logo_url),
      descripcion_empresa: cleanNullableString(form.descripcion_empresa),
      ciudad: cleanNullableString(form.ciudad),
      provincia: cleanNullableString(form.provincia),
      estado: form.estado || 'activo'
    };
  };

  // Benjamin Orellana - 2026/04/14 - Guarda la empresa contra el backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const payload = buildPayload();

      let response = null;

      if (isEditMode) {
        response = await axios.put(
          `${BASE_URL}/alianzas-empresas/${empresa.id}`,
          payload
        );
      } else {
        response = await axios.post(`${BASE_URL}/alianzas-empresas`, payload);
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Empresa actualizada' : 'Empresa creada',
        text: isEditMode
          ? 'La empresa fue actualizada correctamente.'
          : 'La empresa fue creada correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      onSaved?.(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al guardar empresa:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al guardar la empresa.',
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
                initial={{ opacity: 0, y: 22, scale: 0.985 }}
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
                          {isEditMode ? 'Editar empresa' : 'Nueva empresa'}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          Administrá razón social, nombre comercial, datos de
                          contacto y presencia digital de las empresas del
                          módulo alianzas.
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
                      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Building2 size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Datos principales
                              </h3>
                            </div>

                            <div className="grid gap-4">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Razón social
                                </label>
                                <input
                                  type="text"
                                  value={form.razon_social}
                                  onChange={(e) =>
                                    handleChange('razon_social', e.target.value)
                                  }
                                  placeholder="Ej. Distribuidora Norte SRL"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Nombre fantasía
                                </label>
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
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                    CUIT
                                  </label>
                                  <input
                                    type="text"
                                    value={form.cuit}
                                    onChange={(e) =>
                                      handleChange('cuit', e.target.value)
                                    }
                                    placeholder="Ej. 30-12345678-9"
                                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                  />
                                </div>

                                <div>
                                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                    Rubro
                                  </label>
                                  <input
                                    type="text"
                                    value={form.rubro}
                                    onChange={(e) =>
                                      handleChange('rubro', e.target.value)
                                    }
                                    placeholder="Ej. Salud, indumentaria"
                                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                  />
                                </div>
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
                                    value="activo"
                                    className="bg-[#101010]"
                                  >
                                    Activo
                                  </option>
                                  <option
                                    value="inactivo"
                                    className="bg-[#101010]"
                                  >
                                    Inactivo
                                  </option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <Phone size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Contacto
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Teléfono
                                </label>
                                <input
                                  type="text"
                                  value={form.telefono}
                                  onChange={(e) =>
                                    handleChange('telefono', e.target.value)
                                  }
                                  placeholder="Ej. 381..."
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={form.email}
                                  onChange={(e) =>
                                    handleChange('email', e.target.value)
                                  }
                                  placeholder="Ej. contacto@empresa.com"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <MapPin size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Ubicación y presencia digital
                              </h3>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Ciudad
                                </label>
                                <input
                                  type="text"
                                  value={form.ciudad}
                                  onChange={(e) =>
                                    handleChange('ciudad', e.target.value)
                                  }
                                  placeholder="Ej. San Miguel de Tucumán"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Provincia
                                </label>
                                <input
                                  type="text"
                                  value={form.provincia}
                                  onChange={(e) =>
                                    handleChange('provincia', e.target.value)
                                  }
                                  placeholder="Ej. Tucumán"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Sitio web
                                </label>
                                <input
                                  type="text"
                                  value={form.sitio_web}
                                  onChange={(e) =>
                                    handleChange('sitio_web', e.target.value)
                                  }
                                  placeholder="Ej. https://empresa.com"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Instagram
                                </label>
                                <input
                                  type="text"
                                  value={form.instagram}
                                  onChange={(e) =>
                                    handleChange('instagram', e.target.value)
                                  }
                                  placeholder="Ej. @marca"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  Facebook
                                </label>
                                <input
                                  type="text"
                                  value={form.facebook}
                                  onChange={(e) =>
                                    handleChange('facebook', e.target.value)
                                  }
                                  placeholder="Ej. facebook.com/marca"
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                  URL logo
                                </label>
                                <input
                                  type="text"
                                  value={form.logo_url}
                                  onChange={(e) =>
                                    handleChange('logo_url', e.target.value)
                                  }
                                  placeholder="Ej. https://..."
                                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                            <div className="mb-4 flex items-center gap-2 text-red-300">
                              <FileText size={17} />
                              <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                                Descripción
                              </h3>
                            </div>

                            <textarea
                              rows={7}
                              value={form.descripcion_empresa}
                              onChange={(e) =>
                                handleChange(
                                  'descripcion_empresa',
                                  e.target.value
                                )
                              }
                              placeholder="Describí brevemente la empresa, su foco comercial o información útil para el equipo."
                              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                            />
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
                              : 'Crear empresa'}
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

const AlianzasEmpresasGet = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [empresas, setEmpresas] = useState([]);
  const [empresasOptions, setEmpresasOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState(null);

  // Benjamin Orellana - 2026/04/14 - Actualiza filtros y reinicia paginación.
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  // Benjamin Orellana - 2026/04/14 - Limpia todos los filtros del panel.
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // Benjamin Orellana - 2026/04/14 - Carga el universo base para armar selectores de rubro y ciudad.
  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/alianzas-empresas`);
      const data = Array.isArray(response.data) ? response.data : [];
      setEmpresasOptions(data);
    } catch (error) {
      console.error('Error al obtener opciones de empresas:', error);
      setEmpresasOptions([]);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Carga el listado principal aplicando filtros del panel.
  const fetchEmpresas = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.q.trim()) params.q = filters.q.trim();
      if (filters.rubro) params.rubro = filters.rubro;
      if (filters.ciudad) params.ciudad = filters.ciudad;
      if (filters.estado) params.estado = filters.estado;

      const response = await axios.get(`${BASE_URL}/alianzas-empresas`, {
        params
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setEmpresas(data);
    } catch (error) {
      console.error('Error al obtener empresas:', error);
      setEmpresas([]);
    } finally {
      setLoading(false);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Abre el drawer de detalle con información ampliada de la empresa.
  const handleOpenDetail = async (id) => {
    try {
      setDrawerOpen(true);
      setDetailLoading(true);
      setSelectedDetail(null);

      const response = await axios.get(`${BASE_URL}/alianzas-empresas/${id}`);
      setSelectedDetail(response.data);
    } catch (error) {
      console.error('Error al obtener detalle de empresa:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo abrir el detalle',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al obtener el detalle de la empresa.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      setDrawerOpen(false);
      setSelectedDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Abre modal para alta de empresa.
  const handleOpenCreateModal = () => {
    setEditingEmpresa(null);
    setFormModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Abre modal para edición de empresa.
  const handleOpenEditModal = (empresa) => {
    setEditingEmpresa(empresa);
    setFormModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Elimina una empresa con confirmación explícita.
  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Eliminar empresa',
      text: `Se eliminará ${row.nombre_fantasia || row.razon_social}. Esto también puede afectar contactos y oportunidades relacionadas.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#3f3f46',
      background: '#080808',
      color: '#ffffff',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/alianzas-empresas/${row.id}`);

      await Swal.fire({
        icon: 'success',
        title: 'Empresa eliminada',
        text: 'La empresa fue eliminada correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      if (selectedDetail?.id === row.id) {
        setDrawerOpen(false);
        setSelectedDetail(null);
      }

      fetchEmpresas();
      fetchFilterOptions();
    } catch (error) {
      console.error('Error al eliminar empresa:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al eliminar la empresa.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
    }
  };

  // Benjamin Orellana - 2026/04/14 - Carga inicial de opciones de filtro.
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Benjamin Orellana - 2026/04/14 - Refresca el listado cuando cambian filtros.
  useEffect(() => {
    fetchEmpresas();
  }, [filters]);

  // Benjamin Orellana - 2026/04/14 - KPIs calculados sobre resultados visibles del panel.
  const kpis = useMemo(() => {
    const total = empresas.length;
    const activas = empresas.filter((item) => item.estado === 'activo').length;
    const inactivas = empresas.filter(
      (item) => item.estado === 'inactivo'
    ).length;
    const conCuit = empresas.filter((item) => item.cuit).length;
    const conEmail = empresas.filter((item) => item.email).length;
    const conWeb = empresas.filter((item) => item.sitio_web).length;

    return [
      { label: 'Total', value: total },
      { label: 'Activas', value: activas },
      { label: 'Inactivas', value: inactivas },
      { label: 'Con CUIT', value: conCuit },
      { label: 'Con email', value: conEmail },
      { label: 'Con web', value: conWeb }
    ];
  }, [empresas]);

  // Benjamin Orellana - 2026/04/14 - Opciones únicas para filtros visuales.
  const rubroOptions = useMemo(() => {
    return [
      ...new Set(empresasOptions.map((item) => item.rubro).filter(Boolean))
    ].sort((a, b) => a.localeCompare(b));
  }, [empresasOptions]);

  const ciudadOptions = useMemo(() => {
    return [
      ...new Set(empresasOptions.map((item) => item.ciudad).filter(Boolean))
    ].sort((a, b) => a.localeCompare(b));
  }, [empresasOptions]);

  // Benjamin Orellana - 2026/04/14 - Registros visibles según paginación local.
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return empresas.slice(start, start + PAGE_SIZE);
  }, [empresas, currentPage]);

  // Benjamin Orellana - 2026/04/14 - Total de páginas según resultados.
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(empresas.length / PAGE_SIZE));
  }, [empresas.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[#050505] pt-8 pb-12 text-white">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(to_bottom,rgba(0,0,0,0.12),rgba(0,0,0,0.72))]" />

        <div className="relative z-10 mx-auto w-[95%] max-w-[1600px] pt-20">
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Link to="/dashboard">
              <button className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-white/5 px-5 py-3 text-sm font-semibold text-red-200 transition-all duration-300 hover:-translate-y-[1px] hover:border-red-500/50 hover:bg-red-500/10 hover:text-white">
                <ArrowLeft size={16} />
                Volver
              </button>
            </Link>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={fetchEmpresas}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
              >
                <RefreshCcw size={16} />
                Actualizar
              </button>

              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(220,38,38,0.28)] transition-all duration-300 hover:-translate-y-[1px] hover:brightness-110"
              >
                <Plus size={16} />
                Nueva empresa
              </button>
            </div>
          </div>

          <div className="mb-6 overflow-hidden rounded-[30px] border border-red-500/20 bg-gradient-to-br from-[#140808] via-[#0b0b0d] to-[#170909] shadow-[0_20px_90px_rgba(0,0,0,0.45)]">
            <div className="grid gap-6 p-5 md:p-8 xl:grid-cols-[1.35fr_0.9fr]">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                  Altos Roca - Staff
                </div>

                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Empresas
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
                  Panel para administrar empresas vinculadas a publicidad,
                  convenios, sponsor y demás relaciones comerciales del módulo
                  alianzas.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-2">
                {kpis.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
                      {item.label}
                    </p>
                    <h3 className="mt-2 text-3xl font-black text-white">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-[30px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2">
              <Filter size={17} className="text-red-300" />
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                Filtros
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Buscar
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-red-500/40">
                  <Search size={16} className="text-red-300" />
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => handleFilterChange('q', e.target.value)}
                    placeholder="Empresa, CUIT, email..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Rubro
                </label>
                <select
                  value={filters.rubro}
                  onChange={(e) => handleFilterChange('rubro', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todos
                  </option>
                  {rubroOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-[#101010]"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Ciudad
                </label>
                <select
                  value={filters.ciudad}
                  onChange={(e) => handleFilterChange('ciudad', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todas
                  </option>
                  {ciudadOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-[#101010]"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Estado
                </label>
                <select
                  value={filters.estado}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todos
                  </option>
                  <option value="activo" className="bg-[#101010]">
                    Activo
                  </option>
                  <option value="inactivo" className="bg-[#101010]">
                    Inactivo
                  </option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[30px] border border-white/10 bg-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-5 py-4">
              <p className="text-sm font-semibold text-zinc-300">
                Resultados actuales:{' '}
                <span className="font-black text-white">{empresas.length}</span>
              </p>
            </div>

            <div className="hidden xl:block">
              <div className="overflow-x-auto">
                <table className="min-w-[1180px] w-full">
                  <thead className="bg-gradient-to-r from-[#2b0b0b] via-[#4a1111] to-[#2b0b0b]">
                    <tr className="text-left text-xs uppercase tracking-[0.16em] text-red-100">
                      <th className="px-5 py-4">Empresa</th>
                      <th className="px-5 py-4">Rubro</th>
                      <th className="px-5 py-4">Ciudad</th>
                      <th className="px-5 py-4">Estado</th>
                      <th className="px-5 py-4">CUIT</th>
                      <th className="px-5 py-4">Email</th>
                      <th className="px-5 py-4">Alta</th>
                      <th className="px-5 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-5 py-10 text-center text-sm text-zinc-400"
                        >
                          Cargando empresas...
                        </td>
                      </tr>
                    ) : paginatedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-5 py-10 text-center text-sm text-zinc-400"
                        >
                          No se encontraron empresas con los filtros actuales.
                        </td>
                      </tr>
                    ) : (
                      paginatedRecords.map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-white/5 transition-all duration-300 hover:bg-red-500/[0.05]"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-white">
                              {row.nombre_fantasia || row.razon_social}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                              {row.razon_social}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row.rubro || '-'}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row.ciudad || '-'}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${getEstadoClass(
                                row.estado
                              )}`}
                            >
                              {row.estado}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row.cuit || '-'}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row.email || '-'}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {formatDate(row.created_at)}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(row.id)}
                                className="inline-flex items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-200 transition-all duration-300 hover:bg-sky-500/20"
                              >
                                <Eye size={14} />
                                Ver
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(row)}
                                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-500/20"
                              >
                                <Pencil size={14} />
                                Editar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(row)}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition-all duration-300 hover:bg-red-500/20"
                              >
                                <Trash2 size={14} />
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="xl:hidden">
              {loading ? (
                <div className="px-5 py-10 text-center text-sm text-zinc-400">
                  Cargando empresas...
                </div>
              ) : paginatedRecords.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-zinc-400">
                  No se encontraron empresas con los filtros actuales.
                </div>
              ) : (
                <div className="grid gap-4 p-4">
                  {paginatedRecords.map((row) => (
                    <div
                      key={row.id}
                      className="rounded-[26px] border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-bold text-white">
                            {row.nombre_fantasia || row.razon_social}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {row.razon_social}
                          </p>
                        </div>

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getEstadoClass(
                            row.estado
                          )}`}
                        >
                          {row.estado}
                        </span>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            Rubro
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {row.rubro || '-'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            Ciudad
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {row.ciudad || '-'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            CUIT
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {row.cuit || '-'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            Alta
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {formatDate(row.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(row.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-200 transition-all duration-300 hover:bg-sky-500/20"
                        >
                          <Eye size={15} />
                          Ver detalle
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(row)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-500/20"
                        >
                          <Pencil size={15} />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(row)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 transition-all duration-300 hover:bg-red-500/20"
                        >
                          <Trash2 size={15} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {empresas.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 px-4 py-5 md:flex-row">
                <p className="text-sm text-zinc-400">
                  Página{' '}
                  <span className="font-semibold text-white">
                    {currentPage}
                  </span>{' '}
                  de{' '}
                  <span className="font-semibold text-white">{totalPages}</span>
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-[115] bg-black/70 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
              />

              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.28 }}
                className="fixed right-0 top-0 z-[120] h-screen w-full max-w-3xl overflow-y-auto border-l border-red-500/15 bg-[#060606] shadow-[-20px_0_80px_rgba(0,0,0,0.45)]"
              >
                <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0b0d]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-300">
                        Detalle empresa
                      </div>

                      <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                        {selectedDetail?.nombre_fantasia ||
                          selectedDetail?.razon_social ||
                          'Cargando detalle'}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {selectedDetail?.razon_social ||
                          'Obteniendo información...'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDrawerOpen(false)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>

                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  {detailLoading || !selectedDetail ? (
                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-8 text-center text-sm text-zinc-400">
                      Cargando detalle de empresa...
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <BriefcaseBusiness size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Rubro
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.rubro || '-'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <MapPin size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Ubicación
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.ciudad || selectedDetail.provincia
                              ? `${selectedDetail.ciudad || ''}${
                                  selectedDetail.ciudad &&
                                  selectedDetail.provincia
                                    ? ', '
                                    : ''
                                }${selectedDetail.provincia || ''}`
                              : '-'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <FileText size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Estado
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.estado || '-'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <Building2 size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Información general
                          </h4>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Razón social
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.razon_social || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Nombre fantasía
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.nombre_fantasia || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              CUIT
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.cuit || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Alta
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {formatDate(selectedDetail.created_at)}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Teléfono
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.telefono || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Email
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.email || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Sitio web
                            </p>
                            <p className="mt-1 text-sm text-white break-all">
                              {selectedDetail.sitio_web || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Instagram
                            </p>
                            <p className="mt-1 text-sm text-white break-all">
                              {selectedDetail.instagram || '-'}
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Descripción
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-white">
                              {selectedDetail.descripcion_empresa || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <UserRound size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Contactos
                          </h4>
                        </div>

                        {selectedDetail?.contactos?.length ? (
                          <div className="mt-4 space-y-3">
                            {selectedDetail.contactos.map((contacto) => (
                              <div
                                key={contacto.id}
                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {`${contacto.nombre || ''} ${
                                        contacto.apellido || ''
                                      }`.trim() || 'Contacto'}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                                      {contacto.cargo || 'Sin cargo'}
                                    </p>
                                  </div>

                                  {Number(contacto.es_principal) === 1 ? (
                                    <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-200">
                                      Principal
                                    </span>
                                  ) : null}
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Teléfono
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {contacto.telefono || '-'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Email
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {contacto.email || '-'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                            Esta empresa todavía no tiene contactos cargados.
                          </div>
                        )}
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <Globe size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Oportunidades asociadas
                          </h4>
                        </div>

                        {selectedDetail?.oportunidades?.length ? (
                          <div className="mt-4 space-y-3">
                            {selectedDetail.oportunidades.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                              >
                                <div className="flex flex-wrap items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {item.titulo || 'Oportunidad'}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                                      {item.tipo_relacion || '-'}
                                    </p>
                                  </div>

                                  <span
                                    className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getEstadoClass(
                                      item.estado
                                    )}`}
                                  >
                                    {item.estado}
                                  </span>
                                </div>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Responsable
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {item?.staff_responsable?.name ||
                                        'Sin asignar'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Origen
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {item.origen || '-'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Próxima acción
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {formatDate(item.fecha_proxima_accion)}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Alta
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {formatDate(item.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                            Esta empresa todavía no tiene oportunidades
                            asociadas.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <EmpresaFormModal
          open={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingEmpresa(null);
          }}
          empresa={editingEmpresa}
          onSaved={() => {
            setFormModalOpen(false);
            setEditingEmpresa(null);
            fetchEmpresas();
            fetchFilterOptions();
          }}
        />
      </div>
    </>
  );
};

export default AlianzasEmpresasGet;
