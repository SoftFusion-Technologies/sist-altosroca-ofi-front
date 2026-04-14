/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzasOportunidadesGet.jsx) renderiza la vista principal del
 * módulo de oportunidades comerciales para el staff de Altos Roca Gym.
 *
 * Tema: Alianzas - Oportunidades
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CircleDollarSign,
  Eye,
  Filter,
  Handshake,
  Mail,
  Megaphone,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserRound,
  X
} from 'lucide-react';
import NavbarStaff from '../../staff/NavbarStaff';
import ParticlesBackground from '../../../components/ParticlesBackground';
// Benjamin Orellana - 2026/04/14 - Modal de alta y edición de oportunidades comerciales.
import AlianzaOportunidadFormModal from '../../../components/Alianzas/AlianzaOportunidadFormModal';
// Benjamin Orellana - 2026/04/14 - Modal de alta y edición de notas comerciales.
import AlianzaNotaFormModal from '../../../components/Alianzas/AlianzaNotaFormModal';
// Benjamin Orellana - 2026/04/14 - Modal de alta y edición de espacios vinculados a oportunidades.
import AlianzaEspacioFormModal from '../../../components/Alianzas/AlianzaEspacioFormModal';
// Benjamin Orellana - 2026/04/14 - URL local fija para consumo del backend de alianzas.
const BASE_URL = 'http://localhost:8080';

// Benjamin Orellana - 2026/04/14 - Cantidad de registros por página en el panel principal.
const PAGE_SIZE = 10;

// Benjamin Orellana - 2026/04/14 - Estado inicial de filtros del módulo.
const INITIAL_FILTERS = {
  q: '',
  estado: '',
  tipo_relacion: '',
  origen: '',
  staff_responsable_id: '',
  creado_desde_publico: ''
};

// Benjamin Orellana - 2026/04/14 - Formatea fechas para mostrar en la interfaz.
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

// Benjamin Orellana - 2026/04/14 - Formatea fecha y hora para el drawer de detalle.
const formatDateTime = (value) => {
  if (!value) return '-';

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    return '-';
  }
};

// Benjamin Orellana - 2026/04/14 - Resuelve el contacto principal desde contacto_principal o, como fallback, desde empresa.contactos.
const resolveContactoPrincipal = (row) => {
  if (!row) return null;

  if (row?.contacto_principal) {
    return row.contacto_principal;
  }

  if (Array.isArray(row?.empresa?.contactos)) {
    return (
      row.empresa.contactos.find(
        (item) => Number(item.es_principal) === 1
      ) || null
    );
  }

  return null;
};
// Benjamin Orellana - 2026/04/14 - Devuelve el nombre visible del contacto principal con fallback desde empresa.contactos.
const getContactoLabel = (row) => {
  const contacto = resolveContactoPrincipal(row);

  const nombre = contacto?.nombre || '';
  const apellido = contacto?.apellido || '';
  const fullName = `${nombre} ${apellido}`.trim();

  if (fullName) return fullName;
  return 'Sin contacto principal';
};

// Benjamin Orellana - 2026/04/14 - Devuelve el nombre visible de la empresa.
const getEmpresaLabel = (row) => {
  return (
    row?.empresa?.nombre_fantasia || row?.empresa?.razon_social || 'Sin empresa'
  );
};

// Benjamin Orellana - 2026/04/14 - Estilos visuales por estado comercial.
const getEstadoClass = (estado) => {
  switch (estado) {
    case 'nuevo':
      return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
    case 'contactado':
      return 'border-blue-500/30 bg-blue-500/10 text-blue-200';
    case 'reunion_pendiente':
      return 'border-violet-500/30 bg-violet-500/10 text-violet-200';
    case 'propuesta_enviada':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-200';
    case 'negociacion':
      return 'border-orange-500/30 bg-orange-500/10 text-orange-200';
    case 'activo':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
    case 'pausado':
      return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-200';
    case 'cerrado':
      return 'border-sky-500/30 bg-sky-500/10 text-sky-200';
    case 'rechazado':
      return 'border-red-500/30 bg-red-500/10 text-red-200';
    default:
      return 'border-white/10 bg-white/5 text-zinc-200';
  }
};

// Benjamin Orellana - 2026/04/14 - Estilos visuales por tipo de relación.
const getTipoRelacionClass = (tipoRelacion) => {
  switch (tipoRelacion) {
    case 'publicidad':
      return 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200';
    case 'convenio':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';
    case 'ambos':
      return 'border-red-500/30 bg-red-500/10 text-red-200';
    default:
      return 'border-white/10 bg-white/5 text-zinc-200';
  }
};

const AlianzasOportunidadesGet = () => {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [oportunidades, setOportunidades] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // Benjamin Orellana - 2026/04/14 - Estados de alta y edición del modal de oportunidades.
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingOportunidad, setEditingOportunidad] = useState(null);
  // Benjamin Orellana - 2026/04/14 - Estados del modal de notas comerciales.
  const [notaModalOpen, setNotaModalOpen] = useState(false);
  const [editingNota, setEditingNota] = useState(null);
  const [notaTargetOportunidad, setNotaTargetOportunidad] = useState(null);
  // Benjamin Orellana - 2026/04/14 - Estados del modal de espacios vinculados.
  const [espacioModalOpen, setEspacioModalOpen] = useState(false);
  const [editingEspacio, setEditingEspacio] = useState(null);
  const [espacioTargetOportunidad, setEspacioTargetOportunidad] =
    useState(null);

  // Benjamin Orellana - 2026/04/14 - Actualiza un filtro puntual y reinicia la paginación.
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  // Benjamin Orellana - 2026/04/14 - Limpia filtros del panel.
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // Benjamin Orellana - 2026/04/14 - Carga usuarios para selector de responsable.
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      const data = Array.isArray(response.data) ? response.data : [];
      setUsuarios(data);
    } catch (error) {
      console.error('Error al obtener usuarios para alianzas:', error);
      setUsuarios([]);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Carga oportunidades aplicando filtros del panel.
  const fetchOportunidades = async () => {
    try {
      setLoading(true);

      const params = {};

      if (filters.q.trim()) params.q = filters.q.trim();
      if (filters.estado) params.estado = filters.estado;
      if (filters.tipo_relacion) params.tipo_relacion = filters.tipo_relacion;
      if (filters.origen) params.origen = filters.origen;
      if (filters.staff_responsable_id) {
        params.staff_responsable_id = filters.staff_responsable_id;
      }
      if (filters.creado_desde_publico !== '') {
        params.creado_desde_publico = filters.creado_desde_publico;
      }

      const response = await axios.get(`${BASE_URL}/alianzas-oportunidades`, {
        params
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setOportunidades(data);
    } catch (error) {
      console.error('Error al obtener oportunidades:', error);
      setOportunidades([]);
    } finally {
      setLoading(false);
    }
  };

  // Benjamin Orellana - 2026/04/14 - Carga el detalle ampliado para el drawer lateral.
  const handleOpenDetail = async (id) => {
    try {
      setDrawerOpen(true);
      setDetailLoading(true);
      setSelectedDetail(null);

      const response = await axios.get(
        `${BASE_URL}/alianzas-oportunidades/${id}/detalle`
      );

      setSelectedDetail(response.data);
    } catch (error) {
      console.error('Error al obtener detalle de oportunidad:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo abrir el detalle',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al obtener el detalle de la oportunidad.',
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

  // Benjamin Orellana - 2026/04/14 - Elimina una oportunidad con confirmación visual.
  const handleDelete = async (row) => {
    const empresaLabel = getEmpresaLabel(row);

    const result = await Swal.fire({
      title: 'Eliminar oportunidad',
      text: `Se eliminará la oportunidad vinculada a ${empresaLabel}.`,
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
      await axios.delete(`${BASE_URL}/alianzas-oportunidades/${row.id}`);

      await Swal.fire({
        icon: 'success',
        title: 'Oportunidad eliminada',
        text: 'La oportunidad fue eliminada correctamente.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });

      if (selectedDetail?.id === row.id) {
        setDrawerOpen(false);
        setSelectedDetail(null);
      }

      fetchOportunidades();
    } catch (error) {
      console.error('Error al eliminar oportunidad:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un error al eliminar la oportunidad.',
        confirmButtonColor: '#dc2626',
        background: '#080808',
        color: '#ffffff'
      });
    }
  };

  // Benjamin Orellana - 2026/04/14 - Carga inicial del selector de responsables.
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Benjamin Orellana - 2026/04/14 - Refresca listado cada vez que cambian filtros.
  useEffect(() => {
    fetchOportunidades();
  }, [filters]);

  // Benjamin Orellana - 2026/04/14 - KPIs calculados sobre resultados actuales.
  const kpis = useMemo(() => {
    const total = oportunidades.length;
    const nuevas = oportunidades.filter(
      (item) => item.estado === 'nuevo'
    ).length;
    const activas = oportunidades.filter(
      (item) => item.estado === 'activo'
    ).length;
    const contactadas = oportunidades.filter(
      (item) => item.estado === 'contactado'
    ).length;
    const rechazadas = oportunidades.filter(
      (item) => item.estado === 'rechazado'
    ).length;
    const desdeWeb = oportunidades.filter(
      (item) => Number(item.creado_desde_publico) === 1
    ).length;

    return [
      { label: 'Total', value: total },
      { label: 'Nuevas', value: nuevas },
      { label: 'Contactadas', value: contactadas },
      { label: 'Activas', value: activas },
      { label: 'Rechazadas', value: rechazadas },
      { label: 'Desde web', value: desdeWeb }
    ];
  }, [oportunidades]);

  // Benjamin Orellana - 2026/04/14 - Registros visibles según paginación local.
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return oportunidades.slice(start, start + PAGE_SIZE);
  }, [oportunidades, currentPage]);

  // Benjamin Orellana - 2026/04/14 - Total de páginas según resultados actuales.
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(oportunidades.length / PAGE_SIZE));
  }, [oportunidades.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Benjamin Orellana - 2026/04/14 - Abre el modal para crear una nueva oportunidad.
  const handleOpenCreateModal = () => {
    setEditingOportunidad(null);
    setFormModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Abre el modal para editar una oportunidad existente.
  const handleOpenEditModal = (row) => {
    setEditingOportunidad(row);
    setFormModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Abre el modal para crear una nota sobre una oportunidad.
  const handleOpenCreateNotaModal = (oportunidadRow) => {
    setEditingNota(null);
    setNotaTargetOportunidad(oportunidadRow);
    setNotaModalOpen(true);
  };
  // Benjamin Orellana - 2026/04/14 - Abre el modal para editar una nota existente.
  const handleOpenEditNotaModal = (notaRow, oportunidadRow) => {
    setEditingNota(notaRow);
    setNotaTargetOportunidad(oportunidadRow || null);
    setNotaModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Abre el modal para agregar un espacio a una oportunidad.
  const handleOpenCreateEspacioModal = (oportunidadRow) => {
    setEditingEspacio(null);
    setEspacioTargetOportunidad(oportunidadRow);
    setEspacioModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Abre el modal para editar un espacio ya vinculado.
  const handleOpenEditEspacioModal = (espacioRow, oportunidadRow) => {
    setEditingEspacio(espacioRow);
    setEspacioTargetOportunidad(oportunidadRow || null);
    setEspacioModalOpen(true);
  };

  // Benjamin Orellana - 2026/04/14 - Contacto principal resuelto para el drawer de detalle.
  const contactoPrincipalResolved = resolveContactoPrincipal(selectedDetail);

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

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_rgba(220,38,38,0.28)] transition-all duration-300 hover:-translate-y-[1px] hover:brightness-110"
            >
              Nueva oportunidad
            </button>

            <button
              type="button"
              onClick={fetchOportunidades}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
            >
              <RefreshCcw size={16} />
              Actualizar
            </button>
          </div>

          <div className="mb-6 overflow-hidden rounded-[30px] border border-red-500/20 bg-gradient-to-br from-[#140808] via-[#0b0b0d] to-[#170909] shadow-[0_20px_90px_rgba(0,0,0,0.45)]">
            <div className="grid gap-6 p-5 md:p-8 xl:grid-cols-[1.35fr_0.9fr]">
              <div>
                <div className="mb-4 inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-red-300">
                  Altos Roca - Staff
                </div>

                <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                  Oportunidades comerciales
                </h1>

                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
                  Panel principal para gestionar empresas, publicidad,
                  convenios, sponsor y seguimiento comercial dentro del
                  ecosistema de Altos Roca Gym.
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

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
              <div className="2xl:col-span-2">
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Buscar
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-red-500/40">
                  <Search size={16} className="text-red-300" />
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => handleFilterChange('q', e.target.value)}
                    placeholder="Empresa, contacto o título..."
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
                  />
                </div>
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
                  <option value="nuevo" className="bg-[#101010]">
                    Nuevo
                  </option>
                  <option value="contactado" className="bg-[#101010]">
                    Contactado
                  </option>
                  <option value="reunion_pendiente" className="bg-[#101010]">
                    Reunión pendiente
                  </option>
                  <option value="propuesta_enviada" className="bg-[#101010]">
                    Propuesta enviada
                  </option>
                  <option value="negociacion" className="bg-[#101010]">
                    Negociación
                  </option>
                  <option value="activo" className="bg-[#101010]">
                    Activo
                  </option>
                  <option value="pausado" className="bg-[#101010]">
                    Pausado
                  </option>
                  <option value="cerrado" className="bg-[#101010]">
                    Cerrado
                  </option>
                  <option value="rechazado" className="bg-[#101010]">
                    Rechazado
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Tipo
                </label>
                <select
                  value={filters.tipo_relacion}
                  onChange={(e) =>
                    handleFilterChange('tipo_relacion', e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todos
                  </option>
                  <option value="publicidad" className="bg-[#101010]">
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

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Origen
                </label>
                <select
                  value={filters.origen}
                  onChange={(e) => handleFilterChange('origen', e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todos
                  </option>
                  <option value="web" className="bg-[#101010]">
                    Web
                  </option>
                  <option value="instagram" className="bg-[#101010]">
                    Instagram
                  </option>
                  <option value="whatsapp" className="bg-[#101010]">
                    WhatsApp
                  </option>
                  <option value="referido" className="bg-[#101010]">
                    Referido
                  </option>
                  <option value="staff" className="bg-[#101010]">
                    Staff
                  </option>
                  <option value="otro" className="bg-[#101010]">
                    Otro
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
                  Responsable
                </label>
                <select
                  value={filters.staff_responsable_id}
                  onChange={(e) =>
                    handleFilterChange('staff_responsable_id', e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todos
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
                  Fuente
                </label>
                <select
                  value={filters.creado_desde_publico}
                  onChange={(e) =>
                    handleFilterChange('creado_desde_publico', e.target.value)
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/40"
                >
                  <option value="" className="bg-[#101010]">
                    Todas
                  </option>
                  <option value="1" className="bg-[#101010]">
                    Desde web
                  </option>
                  <option value="0" className="bg-[#101010]">
                    Carga interna
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
                <span className="font-black text-white">
                  {oportunidades.length}
                </span>
              </p>
            </div>

            <div className="hidden xl:block">
              <div className="overflow-x-auto">
                <table className="min-w-[1200px] w-full">
                  <thead className="bg-gradient-to-r from-[#2b0b0b] via-[#4a1111] to-[#2b0b0b]">
                    <tr className="text-left text-xs uppercase tracking-[0.16em] text-red-100">
                      <th className="px-5 py-4">Empresa</th>
                      <th className="px-5 py-4">Contacto</th>
                      <th className="px-5 py-4">Tipo</th>
                      <th className="px-5 py-4">Estado</th>
                      <th className="px-5 py-4">Origen</th>
                      <th className="px-5 py-4">Responsable</th>
                      <th className="px-5 py-4">Próxima acción</th>
                      <th className="px-5 py-4">Alta</th>
                      <th className="px-5 py-4 text-center">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-5 py-10 text-center text-sm text-zinc-400"
                        >
                          Cargando oportunidades...
                        </td>
                      </tr>
                    ) : paginatedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="px-5 py-10 text-center text-sm text-zinc-400"
                        >
                          No se encontraron oportunidades con los filtros
                          actuales.
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
                              {getEmpresaLabel(row)}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400">
                              {row.titulo || '-'}
                            </p>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {getContactoLabel(row)}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${getTipoRelacionClass(
                                row.tipo_relacion
                              )}`}
                            >
                              {row.tipo_relacion}
                            </span>
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
                            {row.origen || '-'}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {row?.staff_responsable?.name || 'Sin asignar'}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-300">
                            {formatDate(row.fecha_proxima_accion)}
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
                                onClick={() =>
                                  handleOpenCreateEspacioModal(row)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200 transition-all duration-300 hover:bg-emerald-500/20"
                              >
                                Espacio
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenCreateNotaModal(row)}
                                className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-200 transition-all duration-300 hover:bg-violet-500/20"
                              >
                                Nota
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(row)}
                                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-500/20"
                              >
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
                  Cargando oportunidades...
                </div>
              ) : paginatedRecords.length === 0 ? (
                <div className="px-5 py-10 text-center text-sm text-zinc-400">
                  No se encontraron oportunidades con los filtros actuales.
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
                            {getEmpresaLabel(row)}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">
                            {row.titulo || '-'}
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
                            Contacto
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {getContactoLabel(row)}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            Tipo
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {row.tipo_relacion || '-'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            Responsable
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {row?.staff_responsable?.name || 'Sin asignar'}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                            Próxima acción
                          </p>
                          <p className="mt-1 text-sm text-zinc-200">
                            {formatDate(row.fecha_proxima_accion)}
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
                          onClick={() => handleOpenCreateEspacioModal(row)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200 transition-all duration-300 hover:bg-emerald-500/20"
                        >
                          Espacio
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenCreateNotaModal(row)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm font-semibold text-violet-200 transition-all duration-300 hover:bg-violet-500/20"
                        >
                          Nota
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(row)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-500/20"
                        >
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

            {oportunidades.length > 0 && (
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
                        Detalle comercial
                      </div>

                      <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                        {selectedDetail?.titulo || 'Cargando detalle'}
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        {selectedDetail
                          ? getEmpresaLabel(selectedDetail)
                          : 'Obteniendo información...'}
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
                      Cargando detalle de oportunidad...
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <Handshake size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Tipo
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.tipo_relacion || '-'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <ShieldCheck size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Estado
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.estado || '-'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <CalendarClock size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Próxima acción
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {formatDateTime(
                              selectedDetail.fecha_proxima_accion
                            )}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <UserRound size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Responsable
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail?.staff_responsable?.name ||
                              'Sin asignar'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <Megaphone size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Origen
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.origen || '-'}
                          </p>
                        </div>

                        <div className="rounded-[26px] border border-white/10 bg-white/5 p-4">
                          <div className="flex items-center gap-2 text-red-300">
                            <CircleDollarSign size={16} />
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                              Monto estimado
                            </p>
                          </div>
                          <p className="mt-3 text-sm font-semibold text-white">
                            {selectedDetail.monto_estimado
                              ? `${selectedDetail.moneda || 'ARS'} ${selectedDetail.monto_estimado}`
                              : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <Building2 size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Empresa
                          </h4>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Razón social
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail?.empresa?.razon_social || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Nombre fantasía
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail?.empresa?.nombre_fantasia || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Rubro
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail?.empresa?.rubro || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Ubicación
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail?.empresa?.ciudad ||
                              selectedDetail?.empresa?.provincia
                                ? `${selectedDetail?.empresa?.ciudad || ''}${
                                    selectedDetail?.empresa?.ciudad &&
                                    selectedDetail?.empresa?.provincia
                                      ? ', '
                                      : ''
                                  }${selectedDetail?.empresa?.provincia || ''}`
                                : '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Email empresa
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail?.empresa?.email || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Teléfono empresa
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {selectedDetail?.empresa?.telefono || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <UserRound size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Contacto principal
                          </h4>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Nombre
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {contactoPrincipalResolved
                                ? `${contactoPrincipalResolved.nombre || ''} ${
                                    contactoPrincipalResolved.apellido || ''
                                  }`.trim()
                                : 'Sin contacto principal'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Cargo
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {contactoPrincipalResolved?.cargo || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Teléfono
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {contactoPrincipalResolved?.telefono || '-'}
                            </p>
                          </div>

                          <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                              Email
                            </p>
                            <p className="mt-1 text-sm text-white">
                              {contactoPrincipalResolved?.email || '-'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <Sparkles size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Espacios contratados o propuestos
                          </h4>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenCreateEspacioModal(selectedDetail)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition-all duration-300 hover:bg-emerald-500/20"
                          >
                            Agregar espacio
                          </button>
                        </div>

                        {selectedDetail?.espacios_contratados?.length ? (
                          <div className="mt-4 space-y-3">
                            {selectedDetail.espacios_contratados.map((item) => (
                              <div
                                key={item.id}
                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                              >
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {item?.espacio?.nombre || 'Espacio'}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-500">
                                      {item?.espacio?.categoria || '-'}
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

                                {item.beneficios_texto ? (
                                  <div className="mt-4 rounded-2xl border border-red-500/15 bg-red-500/5 p-3 text-sm text-zinc-300">
                                    {item.beneficios_texto}
                                  </div>
                                ) : null}
                                <div className="mt-4 flex justify-end">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenEditEspacioModal(
                                        item,
                                        selectedDetail
                                      )
                                    }
                                    className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-500/20"
                                  >
                                    Editar espacio
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                            Esta oportunidad todavía no tiene espacios cargados.
                          </div>
                        )}
                      </div>

                      <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center gap-2 text-red-300">
                          <Mail size={17} />
                          <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-200">
                            Notas y seguimiento
                          </h4>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenCreateNotaModal(selectedDetail)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition-all duration-300 hover:bg-violet-500/20"
                          >
                            Nueva nota
                          </button>
                        </div>

                        {selectedDetail?.notas?.length ? (
                          <div className="mt-4 space-y-4">
                            {selectedDetail.notas.map((nota) => (
                              <div
                                key={nota.id}
                                className="rounded-2xl border border-white/10 bg-black/20 p-4"
                              >
                                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {nota.titulo || 'Nota interna'}
                                    </p>
                                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      {nota.tipo || 'nota'}
                                    </p>
                                  </div>

                                  <p className="text-xs text-zinc-500">
                                    {formatDateTime(nota.created_at)}
                                  </p>
                                </div>

                                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                                  {nota.nota}
                                </p>

                                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Usuario
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {nota?.usuario?.name || 'Sin usuario'}
                                    </p>
                                  </div>

                                  <div>
                                    <p className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                                      Recordatorio
                                    </p>
                                    <p className="mt-1 text-sm text-white">
                                      {formatDateTime(nota.fecha_recordatorio)}
                                    </p>
                                  </div>
                                  <div className="mt-4 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleOpenEditNotaModal(
                                          nota,
                                          selectedDetail
                                        )
                                      }
                                      className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-200 transition-all duration-300 hover:bg-amber-500/20"
                                    >
                                      Editar nota
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm text-zinc-400">
                            Esta oportunidad todavía no tiene notas cargadas.
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
      </div>
      <AlianzaOportunidadFormModal
        open={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingOportunidad(null);
        }}
        oportunidad={editingOportunidad}
        onSaved={() => {
          setFormModalOpen(false);
          setEditingOportunidad(null);
          fetchOportunidades();
        }}
      />
      <AlianzaNotaFormModal
        open={notaModalOpen}
        onClose={() => {
          setNotaModalOpen(false);
          setEditingNota(null);
          setNotaTargetOportunidad(null);
        }}
        nota={editingNota}
        oportunidadId={notaTargetOportunidad?.id || null}
        oportunidadTitulo={notaTargetOportunidad?.titulo || ''}
        onSaved={async () => {
          setNotaModalOpen(false);
          setEditingNota(null);

          if (notaTargetOportunidad?.id) {
            await handleOpenDetail(notaTargetOportunidad.id);
          } else {
            fetchOportunidades();
          }

          setNotaTargetOportunidad(null);
        }}
      />
      <AlianzaEspacioFormModal
        open={espacioModalOpen}
        onClose={() => {
          setEspacioModalOpen(false);
          setEditingEspacio(null);
          setEspacioTargetOportunidad(null);
        }}
        registro={editingEspacio}
        oportunidadId={espacioTargetOportunidad?.id || null}
        oportunidadTitulo={espacioTargetOportunidad?.titulo || ''}
        onSaved={async () => {
          setEspacioModalOpen(false);
          setEditingEspacio(null);

          if (espacioTargetOportunidad?.id) {
            await handleOpenDetail(espacioTargetOportunidad.id);
          } else {
            fetchOportunidades();
          }

          setEspacioTargetOportunidad(null);
        }}
      />
    </>
  );
};;

export default AlianzasOportunidadesGet;
