/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzasEspaciosGet.jsx) renderiza la vista administrativa de
 * espacios comerciales del módulo Alianzas para Altos Roca Gym.
 *
 * Tema: Alianzas - Espacios
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
  BadgeDollarSign,
  BriefcaseBusiness,
  Eye,
  FileText,
  Filter,
  Globe,
  Layers3,
  Megaphone,
  Pencil,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Trash2,
  Tv,
  X
} from 'lucide-react';
import NavbarStaff from '../../staff/NavbarStaff';
import ParticlesBackground from '../../../components/ParticlesBackground';

// Benjamin Orellana - 2026/04/14 - URL local fija del backend para el módulo alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Tamaño de página para paginación local.
const PAGE_SIZE = 10;

// Benjamin Orellana - 2026/04/14 - Estado inicial de filtros.
const INITIAL_FILTERS = {
  q: '',
  categoria: '',
  activo: ''
};

// Benjamin Orellana - 2026/04/14 - Estado inicial del formulario de espacio.
const INITIAL_FORM = {
  codigo: '',
  nombre: '',
  categoria: 'otro',
  descripcion: '',
  activo: true,
  orden: '0'
};

const CATEGORY_ICON_MAP = {
  redes: Megaphone,
  web: Globe,
  pantallas: Tv,
  carteleria: BadgeDollarSign,
  sponsor: Sparkles,
  convenio: Layers3,
  otro: BriefcaseBusiness
};

const CATEGORY_LABEL_MAP = {
  redes: 'Redes',
  web: 'Página web',
  pantallas: 'Pantallas',
  carteleria: 'Cartelería',
  sponsor: 'Sponsor',
  convenio: 'Convenio',
  otro: 'Otro'
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

// Benjamin Orellana - 2026/04/14 - Devuelve clases visuales por estado activo del espacio.
const getActivoClass = (activo) => {
  if (Number(activo) === 1) {
    return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
  }

  return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-200';
};

// Benjamin Orellana - 2026/04/14 - Devuelve clases visuales por categoría del espacio.
const getCategoriaClass = (categoria) => {
  switch (categoria) {
    case 'redes':
      return 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200';
    case 'web':
      return 'border-sky-500/30 bg-sky-500/10 text-sky-200';
    case 'pantallas':
      return 'border-violet-500/30 bg-violet-500/10 text-violet-200';
    case 'carteleria':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
    case 'sponsor':
      return 'border-orange-500/30 bg-orange-500/10 text-orange-200';
    case 'convenio':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
    default:
      return 'border-white/10 bg-white/5 text-zinc-200';
  }
};

// Benjamin Orellana - 2026/04/14 - Mapea espacio existente al estado del formulario.
const buildFormFromEspacio = (espacio) => {
  if (!espacio) return INITIAL_FORM;

  return {
    codigo: espacio.codigo || '',
    nombre: espacio.nombre || '',
    categoria: espacio.categoria || 'otro',
    descripcion: espacio.descripcion || '',
    activo: Number(espacio.activo) === 1,
    orden:
      espacio.orden !== null && espacio.orden !== undefined
        ? String(espacio.orden)
        : '0'
  };
};

// Benjamin Orellana - 2026/04/14 - Modal embebido para alta y edición de espacios.
const EspacioFormModal = ({ open, onClose, onSaved, espacio = null }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const isEditMode = useMemo(() => Boolean(espacio?.id), [espacio]);

  useEffect(() => {
    if (!open) return;
    setForm(buildFormFromEspacio(espacio));
  }, [open, espacio]);

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

  // Benjamin Orellana - 2026/04/14 - Cierra el modal evitando cierres durante guardado.
  const handleClose = () => {
    if (loadingSubmit) return;
    resetForm();
    onClose?.();
  };

  // Benjamin Orellana - 2026/04/14 - Valida campos mínimos del formulario de espacio.
  const validateForm = () => {
    if (!form.codigo.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el código',
        text: 'Ingresá el código del espacio para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (!form.nombre.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Falta el nombre',
        text: 'Ingresá el nombre del espacio para continuar.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
      return false;
    }

    if (form.orden === '' || Number.isNaN(Number(form.orden))) {
      Swal.fire({
        icon: 'warning',
        title: 'Orden inválido',
        text: 'El orden debe ser numérico.',
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
      codigo: form.codigo.trim(),
      nombre: form.nombre.trim(),
      categoria: form.categoria || 'otro',
      descripcion: cleanNullableString(form.descripcion),
      activo: form.activo ? 1 : 0,
      orden: Number(form.orden)
    };
  };

  // Benjamin Orellana - 2026/04/14 - Guarda el espacio contra el backend.
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoadingSubmit(true);

      const payload = buildPayload();

      let response = null;

      if (isEditMode) {
        response = await axios.put(
          `${BASE_URL}/alianzas-espacios/${espacio.id}`,
          payload
        );
      } else {
        response = await axios.post(`${BASE_URL}/alianzas-espacios`, payload);
      }

      await Swal.fire({
        icon: 'success',
        title: isEditMode ? 'Espacio actualizado' : 'Espacio creado',
        text: isEditMode
          ? 'El espacio fue actualizado correctamente.'
          : 'El espacio fue creado correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      onSaved?.(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al guardar espacio:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al guardar el espacio.',
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
                          {isEditMode ? 'Editar espacio' : 'Nuevo espacio'}
                        </h2>

                        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
                          Administrá el catálogo base de espacios comerciales
                          disponibles para publicidad, sponsor, convenio y
                          presencia de marca.
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
                      <div className="grid gap-5">
                        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                          <div className="mb-4 flex items-center gap-2 text-red-300">
                            <Layers3 size={17} />
                            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                              Identificación del espacio
                            </h3>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                Código
                              </label>
                              <input
                                type="text"
                                value={form.codigo}
                                onChange={(e) =>
                                  handleChange('codigo', e.target.value)
                                }
                                placeholder="Ej. WEB_BANNER"
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                Nombre
                              </label>
                              <input
                                type="text"
                                value={form.nombre}
                                onChange={(e) =>
                                  handleChange('nombre', e.target.value)
                                }
                                placeholder="Ej. Banner destacado en página"
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                              />
                            </div>

                            <div>
                              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                Categoría
                              </label>
                              <select
                                value={form.categoria}
                                onChange={(e) =>
                                  handleChange('categoria', e.target.value)
                                }
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                              >
                                <option value="redes" className="bg-[#101010]">
                                  Redes
                                </option>
                                <option value="web" className="bg-[#101010]">
                                  Web
                                </option>
                                <option
                                  value="pantallas"
                                  className="bg-[#101010]"
                                >
                                  Pantallas
                                </option>
                                <option
                                  value="carteleria"
                                  className="bg-[#101010]"
                                >
                                  Cartelería
                                </option>
                                <option
                                  value="sponsor"
                                  className="bg-[#101010]"
                                >
                                  Sponsor
                                </option>
                                <option
                                  value="convenio"
                                  className="bg-[#101010]"
                                >
                                  Convenio
                                </option>
                                <option value="otro" className="bg-[#101010]">
                                  Otro
                                </option>
                              </select>
                            </div>

                            <div>
                              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                Orden
                              </label>
                              <input
                                type="number"
                                value={form.orden}
                                onChange={(e) =>
                                  handleChange('orden', e.target.value)
                                }
                                placeholder="Ej. 1"
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                          <div className="mb-4 flex items-center gap-2 text-red-300">
                            <FileText size={17} />
                            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                              Contenido
                            </h3>
                          </div>

                          <div className="grid gap-4">
                            <div>
                              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                                Descripción
                              </label>
                              <textarea
                                rows={6}
                                value={form.descripcion}
                                onChange={(e) =>
                                  handleChange('descripcion', e.target.value)
                                }
                                placeholder="Describí cómo se utiliza este espacio dentro del ecosistema comercial del gimnasio."
                                className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 transition-all duration-300 focus:border-red-500/40"
                              />
                            </div>

                            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                              <span className="text-sm text-zinc-200">
                                Activo
                              </span>
                              <input
                                type="checkbox"
                                checked={form.activo}
                                onChange={(e) =>
                                  handleChange('activo', e.target.checked)
                                }
                                className="h-4 w-4 accent-red-600"
                              />
                            </label>
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
                              : 'Crear espacio'}
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

const AlianzasEspaciosGet = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingEspacio, setEditingEspacio] = useState(null);

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

  // Benjamin Orellana - 2026/04/14 - Carga el listado principal aplicando filtros.
  const fetchEspacios = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.q.trim()) params.q = filters.q.trim();
      if (filters.categoria) params.categoria = filters.categoria;
      if (filters.activo !== '') params.activo = filters.activo;

      const response = await axios.get(`${BASE_URL}/alianzas-espacios`, {
        params
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setEspacios(data);
    } catch (error) {
      console.error('Error al obtener espacios:', error);
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Abre el drawer de detalle con información ampliada del espacio.
  const handleOpenDetail = async (id) => {
    try {
      setDrawerOpen(true);
      setDetailLoading(true);
      setSelectedDetail(null);

      const response = await axios.get(`${BASE_URL}/alianzas-espacios/${id}`);
      setSelectedDetail(response.data);
    } catch (error) {
      console.error('Error al obtener detalle de espacio:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo abrir el detalle',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al obtener el detalle del espacio.',
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

  // Benjamin Orellana - 2026/04/14 - Abre modal para alta de espacio.
  const handleOpenCreateModal = () => {
    setEditingEspacio(null);
    setFormModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Abre modal para edición de espacio.
  const handleOpenEditModal = (espacio) => {
    setEditingEspacio(espacio);
    setFormModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Elimina un espacio con confirmación explícita.
  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: 'Eliminar espacio',
      text: `Se eliminará el espacio ${row.nombre}.`,
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
      await axios.delete(`${BASE_URL}/alianzas-espacios/${row.id}`);

      await Swal.fire({
        icon: 'success',
        title: 'Espacio eliminado',
        text: 'El espacio fue eliminado correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      if (selectedDetail?.id === row.id) {
        setDrawerOpen(false);
        setSelectedDetail(null);
      }

      fetchEspacios();
    } catch (error) {
      console.error('Error al eliminar espacio:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al eliminar el espacio.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, [filters]);

  // Benjamin Orellana - 2026/04/14 - KPIs calculados sobre resultados visibles.
  const kpis = useMemo(() => {
    const total = espacios.length;
    const activos = espacios.filter((item) => Number(item.activo) === 1).length;
    const inactivos = espacios.filter(
      (item) => Number(item.activo) === 0
    ).length;
    const web = espacios.filter((item) => item.categoria === 'web').length;
    const pantallas = espacios.filter(
      (item) => item.categoria === 'pantallas'
    ).length;
    const convenios = espacios.filter(
      (item) => item.categoria === 'convenio'
    ).length;

    return [
      { label: 'Total', value: total },
      { label: 'Activos', value: activos },
      { label: 'Inactivos', value: inactivos },
      { label: 'Web', value: web },
      { label: 'Pantallas', value: pantallas },
      { label: 'Convenios', value: convenios }
    ];
  }, [espacios]);

  // Benjamin Orellana - 2026/04/14 - Registros visibles según paginación local.
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return espacios.slice(start, start + PAGE_SIZE);
  }, [espacios, currentPage]);

  // Benjamin Orellana - 2026/04/14 - Total de páginas según resultados.
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(espacios.length / PAGE_SIZE));
  }, [espacios.length]);

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
                onClick={fetchEspacios}
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
                Nuevo espacio
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
                  Espacios comerciales
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
                  Panel para administrar el catálogo de espacios que luego se
                  vinculan a oportunidades comerciales, sponsor, publicidad y
                  convenios.
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
                    placeholder="Código, nombre o descripción..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Categoría
                </label>
                <select
                  value={filters.categoria}
                  onChange={(e) =>
                    handleFilterChange('categoria', e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todas
                  </option>
                  <option value="redes" className="bg-[#101010]">
                    Redes
                  </option>
                  <option value="web" className="bg-[#101010]">
                    Web
                  </option>
                  <option value="pantallas" className="bg-[#101010]">
                    Pantallas
                  </option>
                  <option value="carteleria" className="bg-[#101010]">
                    Cartelería
                  </option>
                  <option value="sponsor" className="bg-[#101010]">
                    Sponsor
                  </option>
                  <option value="convenio" className="bg-[#101010]">
                    Convenio
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
                  value={filters.activo}
                  onChange={(e) => handleFilterChange('activo', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todos
                  </option>
                  <option value="true" className="bg-[#101010]">
                    Activos
                  </option>
                  <option value="false" className="bg-[#101010]">
                    Inactivos
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
                <span className="font-black text-white">{espacios.length}</span>
              </p>
            </div>

            <div className="hidden xl:block">
              <div className="overflow-x-auto">
                <table className="min-w-[1180px] w-full">
                  <thead className="bg-gradient-to-r from-[#2b0b0b] via-[#4a1111] to-[#2b0b0b]">
                    <tr className="text-left text-xs uppercase tracking-[0.16em] text-red-100">
                      <th className="px-5 py-4">Espacio</th>
                      <th className="px-5 py-4">Código</th>
                      <th className="px-5 py-4">Categoría</th>
                      <th className="px-5 py-4">Estado</th>
                      <th className="px-5 py-4">Orden</th>
                      <th className="px-5 py-4">Alta</th>
                      <th className="px-5 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-5 py-10 text-center text-sm text-zinc-400"
                        >
                          Cargando espacios...
                        </td>
                      </tr>
                    ) : paginatedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-5 py-10 text-center text-sm text-zinc-400"
                        >
                          No se encontraron espacios con los filtros actuales.
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
                              {row.nombre}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                              {row.descripcion || 'Sin descripción'}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row.codigo || '-'}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${getCategoriaClass(
                                row.categoria
                              )}`}
                            >
                              {CATEGORY_LABEL_MAP[row.categoria] ||
                                row.categoria}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${getActivoClass(
                                row.activo
                              )}`}
                            >
                              {Number(row.activo) === 1 ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row.orden}
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
                  Cargando espacios...
                </div>
              ) : paginatedRecords.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-zinc-400">
                  No se encontraron espacios con los filtros actuales.
                </div>
              ) : (
                <div className="grid gap-4 p-4">
                  {paginatedRecords.map((row) => {
                    const IconComponent =
                      CATEGORY_ICON_MAP[row.categoria] || BriefcaseBusiness;

                    return (
                      <div
                        key={row.id}
                        className="rounded-[26px] border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-2xl bg-red-500/10 p-3 text-red-300">
                            <IconComponent size={18} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-base font-bold text-white">
                                  {row.nombre}
                                </p>
                                <p className="mt-1 text-sm text-zinc-400">
                                  {row.codigo}
                                </p>
                              </div>

                              <span
                                className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getActivoClass(
                                  row.activo
                                )}`}
                              >
                                {Number(row.activo) === 1
                                  ? 'Activo'
                                  : 'Inactivo'}
                              </span>
                            </div>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                  Categoría
                                </p>
                                <p className="mt-1 text-sm text-zinc-200">
                                  {CATEGORY_LABEL_MAP[row.categoria] ||
                                    row.categoria}
                                </p>
                              </div>

                              <div>
                                <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                  Orden
                                </p>
                                <p className="mt-1 text-sm text-zinc-200">
                                  {row.orden}
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
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {espacios.length > 0 && (
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
                        Detalle espacio
                      </div>

                      <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                        {selectedDetail?.nombre || 'Cargando detalle'}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {selectedDetail?.codigo || 'Obteniendo información...'}
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
                      Cargando detalle de espacio...
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <Layers3 size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Categoría
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {CATEGORY_LABEL_MAP[selectedDetail.categoria] ||
                              selectedDetail.categoria ||
                              '-'}
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
                            {Number(selectedDetail.activo) === 1
                              ? 'Activo'
                              : 'Inactivo'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <BriefcaseBusiness size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Orden
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.orden}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <BriefcaseBusiness size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Información general
                          </h4>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Código
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.codigo || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Nombre
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail.nombre || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Categoría
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {CATEGORY_LABEL_MAP[selectedDetail.categoria] ||
                                selectedDetail.categoria ||
                                '-'}
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

                          <div className="md:col-span-2">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Descripción
                            </p>
                            <p className="mt-1 text-sm leading-relaxed text-white">
                              {selectedDetail.descripcion || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <Globe size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Usos en oportunidades
                          </h4>
                        </div>

                        {selectedDetail?.oportunidades_espacios?.length ? (
                          <div className="mt-4 space-y-3">
                            {selectedDetail.oportunidades_espacios.map(
                              (item) => (
                                <div
                                  key={item.id}
                                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <p className="text-sm font-semibold text-white">
                                        {item?.oportunidad?.titulo ||
                                          'Oportunidad'}
                                      </p>
                                      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                                        {item?.oportunidad?.empresa
                                          ?.nombre_fantasia ||
                                          item?.oportunidad?.empresa
                                            ?.razon_social ||
                                          'Sin empresa'}
                                      </p>
                                    </div>

                                    <span
                                      className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${getActivoClass(
                                        item.estado === 'activo' ? 1 : 0
                                      )}`}
                                    >
                                      {item.estado}
                                    </span>
                                  </div>

                                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                    <div>
                                      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                        Modalidad
                                      </p>
                                      <p className="mt-1 text-sm text-white">
                                        {item.modalidad || '-'}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                        Cantidad
                                      </p>
                                      <p className="mt-1 text-sm text-white">
                                        {item.cantidad || '-'}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                        Inicio
                                      </p>
                                      <p className="mt-1 text-sm text-white">
                                        {formatDate(item.fecha_inicio)}
                                      </p>
                                    </div>

                                    <div>
                                      <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                        Fin
                                      </p>
                                      <p className="mt-1 text-sm text-white">
                                        {formatDate(item.fecha_fin)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        ) : (
                          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                            Este espacio todavía no está vinculado a
                            oportunidades.
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

        <EspacioFormModal
          open={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingEspacio(null);
          }}
          espacio={editingEspacio}
          onSaved={() => {
            setFormModalOpen(false);
            setEditingEspacio(null);
            fetchEspacios();
          }}
        />
      </div>
    </>
  );
};

export default AlianzasEspaciosGet;
