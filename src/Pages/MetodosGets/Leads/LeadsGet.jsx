/*
 * Programador: Benjamin Orellana
 * Fecha Cración: 01 / 04 / 2024
 * Versión: 2.0
 *
 * Descripción:
 * Este archivo (LeadsGet.jsx) renderiza y gestiona los leads captados desde la web pública.
 * Se adapta al nuevo esquema comercial de leads, mostrando filtros, estados, detalle,
 * acciones rápidas y una visualización responsive para mobile y desktop.
 *
 * Tema: Configuración
 * Capa: Frontend
 * Contacto: benjamin.orellanaof@gmail.com || 3863531891
 */

import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarStaff from '../../staff/NavbarStaff';
import '../../../Styles/staff/background.css';
import { useAuth } from '../../../AuthContext';
import {
  FaWhatsapp,
  FaSearch,
  FaUsers,
  FaUserCheck,
  FaArrowLeft,
  FaArrowRight,
  FaTrash,
  FaEye,
  FaBullseye,
  FaFilter,
  FaCheckCircle,
  FaTimesCircle,
  FaChartLine,
  FaClock,
  FaSyncAlt
} from 'react-icons/fa';
import SimpleModal from '../../../components/SimpleModal';
import { motion } from 'framer-motion';

const fontTitle = {
  fontFamily: 'var(--font-family-base, "Montserrat", sans-serif)'
};
const fontBody = {
  fontFamily: 'var(--font-family-body, "MessinaRegular", sans-serif)'
};
const fontDisplay = {
  fontFamily: 'var(--font-family-display, "BigNoodle", sans-serif)'
};

const ESTADOS = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'interesado', label: 'Interesado' },
  { value: 'convertido', label: 'Convertido' },
  { value: 'perdido', label: 'Perdido' }
];

const ORIGENES = [
  { value: 'todos', label: 'Todos los orígenes' },
  { value: 'web', label: 'Web' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'referido', label: 'Referido' },
  { value: 'otro', label: 'Otro' }
];

const KPIBox = ({ icon, label, value, hint }) => (
  <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4 sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p
          className="text-[11px] uppercase tracking-[0.2em] text-white/45"
          style={fontTitle}
        >
          {label}
        </p>
        <p
          className="mt-2 text-3xl leading-none text-white sm:text-4xl"
          style={fontDisplay}
        >
          {value}
        </p>
        {hint ? (
          <p className="mt-2 text-xs text-white/45" style={fontBody}>
            {hint}
          </p>
        ) : null}
      </div>

      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ff98a5]">
        {icon}
      </div>
    </div>
  </div>
);

const estadoStyles = {
  nuevo: 'border-white/10 bg-white/[0.05] text-white/80',
  contactado: 'border-[#ef3347]/20 bg-[#ef3347]/10 text-[#ffd5db]',
  interesado: 'border-amber-400/20 bg-amber-400/10 text-amber-100',
  convertido: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  perdido: 'border-white/10 bg-black/30 text-white/45'
};

const origenStyles = {
  web: 'border-sky-400/20 bg-sky-400/10 text-sky-100',
  instagram: 'border-fuchsia-400/20 bg-fuchsia-400/10 text-fuchsia-100',
  facebook: 'border-blue-400/20 bg-blue-400/10 text-blue-100',
  whatsapp: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100',
  referido: 'border-orange-400/20 bg-orange-400/10 text-orange-100',
  otro: 'border-white/10 bg-white/[0.05] text-white/75'
};

const estadoLabel = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  interesado: 'Interesado',
  convertido: 'Convertido',
  perdido: 'Perdido'
};

const origenLabel = {
  web: 'Web',
  instagram: 'Instagram',
  facebook: 'Facebook',
  whatsapp: 'WhatsApp',
  referido: 'Referido',
  otro: 'Otro'
};

const BadgeEstado = ({ estado }) => (
  <span
    className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
      estadoStyles[estado] || 'border-white/10 bg-white/[0.05] text-white/75'
    }`}
    style={fontTitle}
  >
    {estadoLabel[estado] || estado || 'Sin estado'}
  </span>
);

const BadgeOrigen = ({ origen }) => (
  <span
    className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] ${
      origenStyles[origen] || 'border-white/10 bg-white/[0.05] text-white/75'
    }`}
    style={fontTitle}
  >
    {origenLabel[origen] || origen || 'Sin origen'}
  </span>
);

const formatFecha = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

const formatFechaHora = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const getWhatsappLink = (telefono) => {
  const digits = String(telefono || '').replace(/\D/g, '');

  if (!digits) return null;

  let normalized = digits;

  // Benjamin Orellana - 2026-04-02 - Se normaliza teléfono para redirección rápida a WhatsApp desde el panel de leads
  if (normalized.startsWith('549')) {
    normalized = normalized;
  } else if (normalized.startsWith('54')) {
    normalized = `549${normalized.slice(2)}`;
  } else {
    normalized = `549${normalized}`;
  }

  return `https://wa.me/${normalized}`;
};

const truncate = (text, max = 110) => {
  const str = String(text || '');
  if (str.length <= max) return str;
  return `${str.slice(0, max)}...`;
};

const LeadsGet = () => {
  const { userLevel } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('todos');
  const [origenFilter, setOrigenFilter] = useState('todos');
  const [interesFilter, setInteresFilter] = useState('todos');

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const URL = `${BASE_URL}/leads`;

  const obtenerLeads = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(URL);
      setLeads(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error al obtener leads:', err);
      setError('No se pudieron cargar los leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerLeads();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, estadoFilter, origenFilter, interesFilter]);

  const interesesDisponibles = useMemo(() => {
    const uniques = Array.from(
      new Set(
        leads
          .map((item) => item?.interes)
          .filter((item) => item !== null && item !== undefined && item !== '')
      )
    ).sort((a, b) => String(a).localeCompare(String(b), 'es'));

    return uniques;
  }, [leads]);

  const safe = (value) =>
    String(value ?? '')
      .toLowerCase()
      .trim();

  const filteredLeads = useMemo(() => {
    const term = safe(search);

    const filtered = leads.filter((lead) => {
      const matchesSearch =
        !term ||
        safe(lead.nombre).includes(term) ||
        safe(lead.tel).includes(term) ||
        safe(lead.email).includes(term) ||
        safe(lead.mensaje).includes(term) ||
        safe(lead.interes).includes(term) ||
        safe(lead.origen).includes(term) ||
        safe(lead.estado).includes(term);

      const matchesEstado =
        estadoFilter === 'todos' ? true : lead.estado === estadoFilter;

      const matchesOrigen =
        origenFilter === 'todos' ? true : lead.origen === origenFilter;

      const matchesInteres =
        interesFilter === 'todos' ? true : lead.interes === interesFilter;

      return matchesSearch && matchesEstado && matchesOrigen && matchesInteres;
    });

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      if (dateB !== dateA) return dateB - dateA;

      return Number(b.id || 0) - Number(a.id || 0);
    });
  }, [leads, search, estadoFilter, origenFilter, interesFilter]);

  const totalNuevos = useMemo(
    () => filteredLeads.filter((item) => item.estado === 'nuevo').length,
    [filteredLeads]
  );

  const totalContactados = useMemo(
    () =>
      filteredLeads.filter((item) =>
        ['contactado', 'interesado', 'convertido'].includes(item.estado)
      ).length,
    [filteredLeads]
  );

  const totalConvertidos = useMemo(
    () => filteredLeads.filter((item) => item.estado === 'convertido').length,
    [filteredLeads]
  );

  const totalPerdidos = useMemo(
    () => filteredLeads.filter((item) => item.estado === 'perdido').length,
    [filteredLeads]
  );

  const itemsPerPage = 20;
  const nPage = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(currentPage, nPage);
  const lastIndex = safeCurrentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const records = filteredLeads.slice(firstIndex, lastIndex);

  const pageNumbers = useMemo(() => {
    const pages = [];
    const start = Math.max(1, safeCurrentPage - 2);
    const end = Math.min(nPage, safeCurrentPage + 2);

    for (let i = start; i <= end; i += 1) {
      pages.push(i);
    }

    return pages;
  }, [safeCurrentPage, nPage]);

  const desde = filteredLeads.length === 0 ? 0 : firstIndex + 1;
  const hasta = Math.min(lastIndex, filteredLeads.length);

  const buildLeadPayload = (lead, overrides = {}) => ({
    nombre: lead.nombre || '',
    tel: lead.tel || '',
    email: lead.email || null,
    mensaje: lead.mensaje || 'Consulta generada desde la web pública.',
    interes: lead.interes || null,
    origen: lead.origen || 'web',
    estado: lead.estado || 'nuevo',
    ultimo_contacto_at: lead.ultimo_contacto_at || null,
    ...overrides
  });

  const updateEstadoLead = async (lead, nuevoEstado) => {
    try {
      setUpdatingId(lead.id);

      const now = new Date().toISOString();

      const payload = buildLeadPayload(lead, {
        estado: nuevoEstado,
        ultimo_contacto_at: now
      });

      await axios.put(`${URL}/${lead.id}`, payload);

      setLeads((prev) =>
        prev.map((item) =>
          item.id === lead.id
            ? {
                ...item,
                estado: nuevoEstado,
                ultimo_contacto_at: now
              }
            : item
        )
      );

      setSelectedLead((prev) =>
        prev && prev.id === lead.id
          ? {
              ...prev,
              estado: nuevoEstado,
              ultimo_contacto_at: now
            }
          : prev
      );
    } catch (err) {
      console.error('Error al actualizar lead:', err);
      setError('No se pudo actualizar el estado del lead');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteLead = async () => {
    if (!leadToDelete) return;

    try {
      await axios.delete(`${URL}/${leadToDelete.id}`);

      setLeads((prev) => prev.filter((item) => item.id !== leadToDelete.id));

      if (selectedLead?.id === leadToDelete.id) {
        setSelectedLead(null);
      }

      setLeadToDelete(null);
    } catch (err) {
      console.error('Error al eliminar lead:', err);
      setError('No se pudo eliminar el lead');
    }
  };

  const clearFilters = () => {
    setSearch('');
    setEstadoFilter('todos');
    setOrigenFilter('todos');
    setInteresFilter('todos');
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (safeCurrentPage < nPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (safeCurrentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <>
      <NavbarStaff />

      <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)] pt-6 pb-10 md:pt-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto w-[95%] max-w-[1700px]">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
          >
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.10)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.40)_100%)]" />
            <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

            <div className="relative px-4 py-5 sm:px-5 md:px-7 md:py-7">
              <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-end 2xl:justify-between">
                <div className="min-w-0">
                  <div className="mb-5">
                    <Link to="/dashboard">
                      <button
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm text-white/85 transition hover:bg-white/[0.08]"
                        style={fontTitle}
                      >
                        <FaArrowLeft />
                        Volver
                      </button>
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className="text-[24px] uppercase leading-none text-[#ff5a6f]"
                      style={fontDisplay}
                    >
                      Altos Roca
                    </span>
                  </div>

                  <h1
                    className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl md:text-5xl"
                    style={fontTitle}
                  >
                    Leads y Prospectos
                  </h1>

                  <p
                    className="mt-3 max-w-3xl text-sm leading-6 text-white/62 md:text-base"
                    style={fontBody}
                  >
                    Visualizá las consultas que llegan desde la web pública,
                    segmentá por origen e interés y hacé seguimiento comercial
                    desde un solo lugar.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 2xl:min-w-[880px]">
                  <KPIBox
                    icon={<FaUsers />}
                    label="Total visibles"
                    value={filteredLeads.length}
                    hint="Leads según filtros"
                  />
                  <KPIBox
                    icon={<FaClock />}
                    label="Nuevos"
                    value={totalNuevos}
                    hint="Aún sin avance"
                  />
                  <KPIBox
                    icon={<FaUserCheck />}
                    label="Contactados"
                    value={totalContactados}
                    hint="Con seguimiento"
                  />
                  <KPIBox
                    icon={<FaChartLine />}
                    label="Convertidos"
                    value={totalConvertidos}
                    hint="Cierre comercial"
                  />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 xl:grid-cols-[minmax(260px,1.4fr)_220px_220px_220px_auto_auto] xl:items-center">
                <div className="relative w-full">
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Buscar por nombre, teléfono, email, interés o mensaje"
                    className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/28 ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                    style={fontBody}
                  />
                </div>

                <select
                  value={estadoFilter}
                  onChange={(e) => setEstadoFilter(e.target.value)}
                  className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                  style={fontBody}
                >
                  {ESTADOS.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-[#0a0a0b]"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>

                <select
                  value={origenFilter}
                  onChange={(e) => setOrigenFilter(e.target.value)}
                  className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                  style={fontBody}
                >
                  {ORIGENES.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-[#0a0a0b]"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>

                <select
                  value={interesFilter}
                  onChange={(e) => setInteresFilter(e.target.value)}
                  className="h-12 rounded-2xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                  style={fontBody}
                >
                  <option value="todos" className="bg-[#0a0a0b]">
                    Todos los intereses
                  </option>
                  {interesesDisponibles.map((item) => (
                    <option key={item} value={item} className="bg-[#0a0a0b]">
                      {item}
                    </option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/78 transition hover:bg-white/[0.08]"
                  style={fontTitle}
                >
                  <FaFilter />
                  Limpiar
                </button>

                <button
                  onClick={obtenerLeads}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 text-sm text-[#ffd5db] transition hover:bg-[#ef3347]/16"
                  style={fontTitle}
                >
                  <FaSyncAlt />
                  Recargar
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div
                  className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70"
                  style={fontBody}
                >
                  Mostrando {desde} a {hasta} de {filteredLeads.length}
                </div>

                <div
                  className="inline-flex h-11 items-center rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white/70"
                  style={fontBody}
                >
                  Perdidos: {totalPerdidos}
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-3 text-sm text-[#ffd5db]">
                  {error}
                </div>
              ) : null}
            </div>

            {loading ? (
              <div className="relative px-4 pb-8 md:px-7">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[220px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.03]"
                    />
                  ))}
                </div>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="relative px-4 pb-10 md:px-7">
                <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
                  <p
                    className="text-2xl font-black text-white"
                    style={fontTitle}
                  >
                    No se encontraron leads
                  </p>
                  <p
                    className="mt-2 text-sm leading-6 text-white/58"
                    style={fontBody}
                  >
                    No hay registros para la búsqueda aplicada. Probá con otro
                    término o limpiá los filtros.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Mobile / Tablet */}
                <div className="relative px-4 pb-4 lg:hidden md:px-5">
                  <div className="grid grid-cols-1 gap-4">
                    {records.map((lead) => {
                      const whatsappLink = getWhatsappLink(lead.tel);

                      return (
                        <motion.div
                          key={lead.id}
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-[26px] border border-white/10 bg-[#0a0a0b]/75 p-4 ring-1 ring-white/10"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p
                                className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                                style={fontTitle}
                              >
                                Lead #{lead.id}
                              </p>

                              <h3
                                className="mt-2 truncate text-xl font-black text-white"
                                style={fontTitle}
                              >
                                {lead.nombre || 'Sin nombre'}
                              </h3>

                              <p
                                className="mt-1 text-sm text-white/55"
                                style={fontBody}
                              >
                                {formatFechaHora(lead.created_at)}
                              </p>
                            </div>

                            <BadgeEstado estado={lead.estado} />
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <BadgeOrigen origen={lead.origen} />
                            {lead.interes ? (
                              <span
                                className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78"
                                style={fontTitle}
                              >
                                {lead.interes}
                              </span>
                            ) : null}
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                              <p
                                className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                                style={fontTitle}
                              >
                                Teléfono
                              </p>
                              <p
                                className="mt-2 break-words text-sm text-white"
                                style={fontBody}
                              >
                                {lead.tel || '—'}
                              </p>
                            </div>

                            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                              <p
                                className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                                style={fontTitle}
                              >
                                Email
                              </p>
                              <p
                                className="mt-2 break-words text-sm text-white"
                                style={fontBody}
                              >
                                {lead.email || '—'}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <p
                              className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                              style={fontTitle}
                            >
                              Mensaje
                            </p>
                            <p
                              className="mt-2 text-sm leading-6 text-white/72"
                              style={fontBody}
                            >
                              {truncate(lead.mensaje, 130) || 'Sin mensaje'}
                            </p>
                          </div>

                          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                            <p
                              className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                              style={fontTitle}
                            >
                              Último contacto
                            </p>
                            <p
                              className="mt-2 text-sm text-white/75"
                              style={fontBody}
                            >
                              {formatFechaHora(lead.ultimo_contacto_at)}
                            </p>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-white/82 transition hover:bg-white/[0.08]"
                              style={fontTitle}
                            >
                              <FaEye />
                              Ver
                            </button>

                            <a
                              href={whatsappLink || '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-xs font-semibold transition ${
                                whatsappLink
                                  ? 'border-white/10 bg-white/[0.04] text-white/82 hover:bg-white/[0.08]'
                                  : 'pointer-events-none border-white/10 bg-white/[0.03] text-white/30'
                              }`}
                              style={fontTitle}
                            >
                              <FaWhatsapp />
                              WhatsApp
                            </a>

                            <button
                              onClick={() =>
                                updateEstadoLead(lead, 'contactado')
                              }
                              disabled={updatingId === lead.id}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 text-xs font-semibold text-[#ffd5db] transition hover:bg-[#ef3347]/16 disabled:cursor-not-allowed disabled:opacity-60"
                              style={fontTitle}
                            >
                              <FaUserCheck />
                              Contactar
                            </button>

                            <button
                              onClick={() =>
                                updateEstadoLead(lead, 'interesado')
                              }
                              disabled={updatingId === lead.id}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 text-xs font-semibold text-amber-100 transition hover:bg-amber-400/16 disabled:cursor-not-allowed disabled:opacity-60"
                              style={fontTitle}
                            >
                              <FaBullseye />
                              Interesado
                            </button>

                            <button
                              onClick={() =>
                                updateEstadoLead(lead, 'convertido')
                              }
                              disabled={updatingId === lead.id}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/16 disabled:cursor-not-allowed disabled:opacity-60"
                              style={fontTitle}
                            >
                              <FaCheckCircle />
                              Convertir
                            </button>

                            {(userLevel === 'admin' ||
                              userLevel === 'administrador' ||
                              userLevel === 'socio') && (
                              <button
                                onClick={() => setLeadToDelete(lead)}
                                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/14 bg-[#ef3347]/10 px-4 text-xs font-semibold text-[#ffd5db] transition hover:bg-[#ef3347]/16"
                                style={fontTitle}
                              >
                                <FaTrash />
                                Eliminar
                              </button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Desktop */}
                <div className="relative hidden px-3 py-4 lg:block md:px-5">
                  <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0a0a0b]/75 ring-1 ring-white/10">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1350px] w-full border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 bg-white/[0.04]">
                            {[
                              'ID',
                              'Fecha',
                              'Nombre',
                              'Contacto',
                              'Interés',
                              'Origen',
                              'Estado',
                              'Último contacto',
                              'Mensaje',
                              'Acciones'
                            ].map((head) => (
                              <th
                                key={head}
                                className="px-5 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-white/50"
                                style={fontTitle}
                              >
                                {head}
                              </th>
                            ))}
                          </tr>
                        </thead>

                        <tbody>
                          {records.map((lead, index) => {
                            const whatsappLink = getWhatsappLink(lead.tel);

                            return (
                              <tr
                                key={lead.id}
                                className={
                                  'border-b border-white/6 transition hover:bg-white/[0.04] ' +
                                  (index % 2 === 0
                                    ? 'bg-transparent'
                                    : 'bg-white/[0.015]')
                                }
                              >
                                <td
                                  className="px-5 py-4 align-top text-sm text-white/82"
                                  style={fontBody}
                                >
                                  #{lead.id}
                                </td>

                                <td
                                  className="px-5 py-4 align-top text-sm text-white/68"
                                  style={fontBody}
                                >
                                  {formatFechaHora(lead.created_at)}
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div className="min-w-[180px]">
                                    <p
                                      className="text-sm font-semibold text-white"
                                      style={fontTitle}
                                    >
                                      {lead.nombre || 'Sin nombre'}
                                    </p>

                                    {lead.email ? (
                                      <p
                                        className="mt-1 text-xs text-white/50"
                                        style={fontBody}
                                      >
                                        {lead.email}
                                      </p>
                                    ) : null}
                                  </div>
                                </td>

                                <td
                                  className="px-5 py-4 align-top text-sm text-white/82"
                                  style={fontBody}
                                >
                                  {lead.tel || '—'}
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div className="max-w-[180px]">
                                    <span
                                      className="inline-flex w-fit rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/78"
                                      style={fontTitle}
                                    >
                                      {lead.interes || 'Sin interés'}
                                    </span>
                                  </div>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <BadgeOrigen origen={lead.origen} />
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <BadgeEstado estado={lead.estado} />
                                </td>

                                <td
                                  className="px-5 py-4 align-top text-sm text-white/68"
                                  style={fontBody}
                                >
                                  {formatFechaHora(lead.ultimo_contacto_at)}
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div
                                    className="max-w-[290px] text-sm leading-6 text-white/68"
                                    style={fontBody}
                                    title={lead.mensaje || ''}
                                  >
                                    {truncate(lead.mensaje, 120)}
                                  </div>
                                </td>

                                <td className="px-5 py-4 align-top">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => setSelectedLead(lead)}
                                      className="inline-flex h-10 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-white/82 transition hover:bg-white/[0.08]"
                                      style={fontTitle}
                                    >
                                      <FaEye />
                                      Ver
                                    </button>

                                    <a
                                      href={whatsappLink || '#'}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`inline-flex h-10 items-center gap-2 rounded-2xl border px-4 text-xs font-semibold transition ${
                                        whatsappLink
                                          ? 'border-white/10 bg-white/[0.04] text-white/82 hover:bg-white/[0.08]'
                                          : 'pointer-events-none border-white/10 bg-white/[0.03] text-white/30'
                                      }`}
                                      style={fontTitle}
                                    >
                                      <FaWhatsapp />
                                      WhatsApp
                                    </a>

                                    <button
                                      onClick={() =>
                                        updateEstadoLead(lead, 'contactado')
                                      }
                                      disabled={updatingId === lead.id}
                                      className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 text-xs font-semibold text-[#ffd5db] transition hover:bg-[#ef3347]/16 disabled:cursor-not-allowed disabled:opacity-60"
                                      style={fontTitle}
                                    >
                                      <FaUserCheck />
                                      Contactar
                                    </button>

                                    <button
                                      onClick={() =>
                                        updateEstadoLead(lead, 'convertido')
                                      }
                                      disabled={updatingId === lead.id}
                                      className="inline-flex h-10 items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-400/16 disabled:cursor-not-allowed disabled:opacity-60"
                                      style={fontTitle}
                                    >
                                      <FaCheckCircle />
                                      Convertir
                                    </button>

                                    {(userLevel === 'admin' ||
                                      userLevel === 'administrador' ||
                                      userLevel === 'socio') && (
                                      <button
                                        onClick={() => setLeadToDelete(lead)}
                                        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-[#ef3347]/14 bg-[#ef3347]/10 px-4 text-xs font-semibold text-[#ffd5db] transition hover:bg-[#ef3347]/16"
                                        style={fontTitle}
                                      >
                                        <FaTrash />
                                        Eliminar
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {nPage > 1 && (
                  <nav className="flex justify-center px-4 pb-8 pt-3">
                    <ul className="flex flex-wrap items-center justify-center gap-2">
                      <li>
                        <button
                          onClick={prevPage}
                          className={
                            'inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm transition ' +
                            (safeCurrentPage === 1
                              ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                              : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]')
                          }
                          style={fontTitle}
                        >
                          <FaArrowLeft className="mr-2" />
                          Prev
                        </button>
                      </li>

                      {pageNumbers.map((number) => (
                        <li key={number}>
                          <button
                            onClick={() => setCurrentPage(number)}
                            className={
                              'min-w-[40px] h-10 rounded-2xl border px-3 text-sm font-semibold transition ' +
                              (safeCurrentPage === number
                                ? 'border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] text-white'
                                : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]')
                            }
                            style={fontTitle}
                          >
                            {number}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          onClick={nextPage}
                          className={
                            'inline-flex h-10 items-center justify-center rounded-2xl border px-4 text-sm transition ' +
                            (safeCurrentPage === nPage
                              ? 'cursor-not-allowed border-white/10 bg-white/[0.03] text-white/30'
                              : 'border-white/10 bg-white/[0.04] text-white/75 hover:bg-white/[0.08]')
                          }
                          style={fontTitle}
                        >
                          Next
                          <FaArrowRight className="ml-2" />
                        </button>
                      </li>
                    </ul>
                  </nav>
                )}
              </>
            )}
          </motion.section>
        </div>
      </div>

      <SimpleModal open={!!selectedLead} onClose={() => setSelectedLead(null)}>
        <div className="w-full max-w-3xl">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p
                  className="text-[11px] uppercase tracking-[0.18em] text-white/45"
                  style={fontTitle}
                >
                  Lead #{selectedLead?.id}
                </p>

                <h3
                  className="mt-2 text-2xl font-black text-white sm:text-3xl"
                  style={fontTitle}
                >
                  {selectedLead?.nombre || 'Sin nombre'}
                </h3>

                <p className="mt-2 text-sm text-white/60" style={fontBody}>
                  Ingresó el {formatFechaHora(selectedLead?.created_at)}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <BadgeEstado estado={selectedLead?.estado} />
                <BadgeOrigen origen={selectedLead?.origen} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                  style={fontTitle}
                >
                  Teléfono
                </p>
                <p className="mt-2 text-sm text-white" style={fontBody}>
                  {selectedLead?.tel || '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                  style={fontTitle}
                >
                  Email
                </p>
                <p className="mt-2 text-sm text-white" style={fontBody}>
                  {selectedLead?.email || '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                  style={fontTitle}
                >
                  Interés
                </p>
                <p className="mt-2 text-sm text-white" style={fontBody}>
                  {selectedLead?.interes || '—'}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                  style={fontTitle}
                >
                  Último contacto
                </p>
                <p className="mt-2 text-sm text-white" style={fontBody}>
                  {formatFechaHora(selectedLead?.ultimo_contacto_at)}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p
                className="text-[11px] uppercase tracking-[0.16em] text-white/42"
                style={fontTitle}
              >
                Mensaje
              </p>
              <p
                className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/75"
                style={fontBody}
              >
                {selectedLead?.mensaje || 'Sin mensaje'}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-5">
              <button
                onClick={() => updateEstadoLead(selectedLead, 'contactado')}
                disabled={updatingId === selectedLead?.id}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 text-sm font-semibold text-[#ffd5db] transition hover:bg-[#ef3347]/16 disabled:cursor-not-allowed disabled:opacity-60"
                style={fontTitle}
              >
                <FaUserCheck />
                Contactado
              </button>

              <button
                onClick={() => updateEstadoLead(selectedLead, 'interesado')}
                disabled={updatingId === selectedLead?.id}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/16 disabled:cursor-not-allowed disabled:opacity-60"
                style={fontTitle}
              >
                <FaBullseye />
                Interesado
              </button>

              <button
                onClick={() => updateEstadoLead(selectedLead, 'convertido')}
                disabled={updatingId === selectedLead?.id}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/16 disabled:cursor-not-allowed disabled:opacity-60"
                style={fontTitle}
              >
                <FaCheckCircle />
                Convertido
              </button>

              <button
                onClick={() => updateEstadoLead(selectedLead, 'perdido')}
                disabled={updatingId === selectedLead?.id}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
                style={fontTitle}
              >
                <FaTimesCircle />
                Perdido
              </button>

              <a
                href={getWhatsappLink(selectedLead?.tel) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition ${
                  getWhatsappLink(selectedLead?.tel)
                    ? 'border-white/10 bg-white/[0.04] text-white/82 hover:bg-white/[0.08]'
                    : 'pointer-events-none border-white/10 bg-white/[0.03] text-white/30'
                }`}
                style={fontTitle}
              >
                <FaWhatsapp />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </SimpleModal>

      <SimpleModal open={!!leadToDelete} onClose={() => setLeadToDelete(null)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ scale: 0.7, rotate: -6 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 8 }}
            className="mb-2 rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 p-4 shadow-xl"
          >
            <FaTrash className="text-2xl text-[#ef3347]" />
          </motion.div>

          <h3 className="text-2xl font-extrabold text-white" style={fontTitle}>
            ¿Eliminar lead?
          </h3>

          <p className="text-sm leading-6 text-white/70" style={fontBody}>
            Vas a eliminar el lead de
            <br />
            <span className="font-bold text-lg text-white">
              {leadToDelete?.nombre || 'Sin nombre'}
            </span>
            <br />
            Esta acción no se puede deshacer.
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setLeadToDelete(null)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-2.5 font-semibold text-white/82 transition hover:bg-white/[0.08]"
              style={fontTitle}
            >
              Cancelar
            </button>

            <button
              onClick={handleDeleteLead}
              className="rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-6 py-2.5 font-bold text-white transition hover:scale-[1.01]"
              style={fontTitle}
            >
              Eliminar
            </button>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};

export default LeadsGet;
