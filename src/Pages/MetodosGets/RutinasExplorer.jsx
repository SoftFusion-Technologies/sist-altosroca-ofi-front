import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  RefreshCcw,
  Loader2,
  X,
  Users,
  CalendarDays,
  Clock,
  UserRoundCheck,
  SquareStack,
  ListChecks,
  Eye,
  UserPlus,
  Plus,
  ClipboardList
} from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import ButtonBack from '../../components/ButtonBack';
import NavbarStaff from '../staff/NavbarStaff';
import clsx from 'clsx';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const BASE_URL = 'http://localhost:8080';
const RUTINAS_LIST_ROUTE = '/rutinasss';
const RUTINA_DETALLE_ROUTE = (id) => `/rutinas/${id}/completa`;

const fontTitle = {
  fontFamily: 'var(--font-family-base, "Montserrat", sans-serif)'
};
const fontBody = {
  fontFamily: 'var(--font-family-body, "MessinaRegular", sans-serif)'
};
const fontDisplay = {
  fontFamily: 'var(--font-family-display, "BigNoodle", sans-serif)'
};

const surface =
  'border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.28)]';
const softButton =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/85 transition hover:bg-white/[0.08]';
const redGradientButton =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01]';
const chipBase =
  'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em]';

const cardVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 }
};

const listTransition = { type: 'spring', stiffness: 120, damping: 16 };

export const Toolbar = React.memo(function Toolbar({
  q,
  onChangeQ,
  onClearQ,
  vigentes,
  onToggleVigentes,
  users,
  instructorId,
  onSelectInstructor,
  meta,
  errorUsers,
  loadingUsers,
  onRefresh,
  onNuevaRutina
}) {
  const initials = (name) => {
    if (!name) return '?';
    const parts = String(name).trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase();
  };

  return (
    <div className="relative z-20 mx-auto px-4 pt-5 sm:px-6">
      <div
        className={`overflow-hidden rounded-[34px] ${surface} px-5 py-5 md:px-7 md:py-6`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.10)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.40)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

        <div className="relative">
          <div className="mb-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]"
                  style={fontTitle}
                >
                  Explorador de rutinas
                </span>

                <span
                  className="text-[22px] uppercase leading-none text-[#ff5a6f]"
                  style={fontDisplay}
                >
                  Altos Roca
                </span>
              </div>

              <h1
                className="mt-4 titulo uppercase text-3xl font-black uppercase tracking-tight text-white md:text-4xl"
                style={fontTitle}
              >
                Rutinas
              </h1>

              <p
                className="mt-3 max-w-3xl text-sm leading-6 text-white/62 md:text-base"
                style={fontBody}
              >
                Gestioná rutinas, filtrá por instructor y visualizá el detalle
                con una lectura más clara, moderna y operativa.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[650px]">
              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                  style={fontTitle}
                >
                  Total
                </p>
                <p
                  className="mt-2 text-3xl leading-none text-white"
                  style={fontDisplay}
                >
                  {meta?.total || 0}
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                  style={fontTitle}
                >
                  Página
                </p>
                <p
                  className="mt-2 text-3xl leading-none text-white"
                  style={fontDisplay}
                >
                  {meta?.page || 1}
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                <p
                  className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                  style={fontTitle}
                >
                  Visibles
                </p>
                <p
                  className="mt-2 text-3xl leading-none text-white"
                  style={fontDisplay}
                >
                  {meta?.pageSize || 20}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex w-full flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
              <div className="relative w-full xl:max-w-[330px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                <input
                  type="text"
                  className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-10 text-sm text-white outline-none placeholder:text-white/28 ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                  placeholder="Buscar por rutina o alumno"
                  value={q}
                  onChange={(e) => onChangeQ(e.target.value)}
                  style={fontBody}
                />
                {q && (
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                    onClick={onClearQ}
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onToggleVigentes}
                className={`${softButton} ${vigentes ? 'ring-2 ring-[#ef3347]/25 border-[#ef3347]/20 bg-[#ef3347]/10' : ''}`}
                title="Mostrar solo vigentes"
                style={fontTitle}
              >
                <Filter className="h-4 w-4" />
                {vigentes ? 'Vigentes' : 'Todas'}
              </button>

              <button
                type="button"
                onClick={onRefresh}
                className={softButton}
                title="Actualizar listado"
                style={fontTitle}
              >
                <RefreshCcw className="h-4 w-4" />
                Refrescar
              </button>
            </div>

            <div className="flex titulo uppercase w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <button
                type="button"
                onClick={onNuevaRutina}
                className={redGradientButton}
                style={fontTitle}
                title="Nueva rutina"
              >
                <Plus className="h-4 w-4" />
                Nueva Rutina
              </button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto no-scrollbar">
            <div className="flex min-w-max items-center gap-2 pb-1">
              <button
                type="button"
                onClick={() => onSelectInstructor('')}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  !instructorId
                    ? 'border-[#ef3347]/20 bg-[#ef3347]/10 text-white'
                    : 'border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.08]'
                }`}
                style={fontTitle}
              >
                Todos
              </button>

              {loadingUsers && (
                <div
                  className="flex items-center gap-2 text-sm text-white/75"
                  style={fontBody}
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando instructores...
                </div>
              )}

              {!loadingUsers && errorUsers && (
                <span className="text-sm text-[#ffd5db]" style={fontBody}>
                  {errorUsers}
                </span>
              )}

              {!loadingUsers &&
                !errorUsers &&
                (Array.isArray(users) ? users : []).map((u) => (
                  <button
                    type="button"
                    key={u.id}
                    onClick={() => onSelectInstructor(String(u.id))}
                    className={`group flex items-center gap-2 rounded-full border px-3 py-1.5 transition whitespace-nowrap ${
                      String(instructorId) === String(u.id)
                        ? 'border-[#ef3347]/20 bg-[#ef3347]/10 text-white'
                        : 'border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.08]'
                    }`}
                    title={u.email}
                    style={fontBody}
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                      {initials(u.nombre || u.name)}
                    </span>
                    <span>{u.nombre || u.name}</span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const swalAltosRoca = (options = {}) =>
  Swal.fire({
    background: '#0a0a0b',
    color: '#f3f4f6',
    confirmButtonColor: '#d11f2f',
    customClass: {
      popup: 'rounded-[24px] border border-white/10',
      confirmButton: 'rounded-xl'
    },
    ...options
  });

export default function RutinasExplorer() {
  const [q, setQ] = useState('');
  const [vigentes, setVigentes] = useState(false);
  const [instructorId, setInstructorId] = useState('');

  const [users, setUsers] = useState([]);
  const [list, setList] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    pageSize: 20,
    total: 0
  });

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingList, setLoadingList] = useState(false);
  const [errorUsers, setErrorUsers] = useState('');
  const [errorList, setErrorList] = useState('');

  const [openId, setOpenId] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  const abortRef = useRef(null);

  const [modalAsignarVisible, setModalAsignarVisible] = useState(false);
  const [rutinaSeleccionadaParaAsignar, setRutinaSeleccionadaParaAsignar] =
    useState(null);
  const [cargandoAsignacion, setCargandoAsignacion] = useState(false);

  const [alumnos, setAlumnos] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [busquedaAlumnos, setBusquedaAlumnos] = useState('');
  const [paginaAlumnos, setPaginaAlumnos] = useState(1);
  const alumnosPorPagina = 10;

  const [desde, setDesde] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [hasta, setHasta] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await fetch(`${BASE_URL}/students`);
        if (!res.ok) throw new Error('No se pudieron cargar los alumnos');
        const data = await res.json();
        setAlumnos(Array.isArray(data) ? data : (data?.data ?? []));
      } catch (e) {
        console.error('Error al obtener alumnos', e);
      }
    };
    fetchAlumnos();
  }, []);

  const alumnosFiltrados = useMemo(() => {
    const search = busquedaAlumnos.toLowerCase();
    return (alumnos || []).filter((a) =>
      `${a.nomyape ?? ''} ${a.dni ?? ''}`.toLowerCase().includes(search)
    );
  }, [alumnos, busquedaAlumnos]);

  const alumnosPaginados = useMemo(() => {
    return alumnosFiltrados.slice(0, paginaAlumnos * alumnosPorPagina);
  }, [alumnosFiltrados, paginaAlumnos]);

  const fetchJSON = async (url, opts) => {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return await res.json();
  };

  const buildQuery = (params) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.append(k, String(v));
    });
    return qs.toString();
  };

  const formatDate = (iso) => {
    if (!iso) return '—';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '—';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateOrOpen = (iso) => {
    if (!iso) return 'Indefinida';
    return formatDate(iso);
  };

  const resumenRutina = (r) => {
    let bloques = r?.bloques?.length || 0;
    let ejercicios = 0;
    let series = 0;

    (r?.bloques || []).forEach((b) => {
      ejercicios += b?.ejercicios?.length || 0;
      (b?.ejercicios || []).forEach((e) => {
        series += e?.series?.length || 0;
      });
    });

    return { bloques, ejercicios, series };
  };

  const handleNuevaRutina = () => {
    // Benjamin Orellana - 2026-04-02 - Placeholder visual para futura alta de rutinas.
  };

  useEffect(() => {
    (async () => {
      try {
        setLoadingUsers(true);
        setErrorUsers('');
        const json = await fetchJSON(`${BASE_URL}/users`);
        const allowed = new Set(['instructor', 'admin']);
        setUsers(
          (Array.isArray(json) ? json : []).filter((u) => allowed.has(u.rol))
        );
      } catch (e) {
        setErrorUsers(e.message || 'Error al cargar usuarios');
      } finally {
        setLoadingUsers(false);
      }
    })();
  }, []);

  const fetchList = async (page = 1) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();
    setLoadingList(true);
    setErrorList('');

    try {
      const params = {
        page,
        pageSize: meta.pageSize || 20,
        orderBy: 'created_at',
        orderDir: 'DESC',
        view: 'full',
        q: q || undefined,
        vigentes: vigentes ? 'true' : undefined,
        instructor_id: instructorId || undefined
      };

      const url = `${BASE_URL}${RUTINAS_LIST_ROUTE}?${buildQuery(params)}`;
      const json = await fetchJSON(url, { signal: abortRef.current.signal });
      setList(json.data || []);
      setMeta(json.meta || { page, totalPages: 1, pageSize: 20, total: 0 });
    } catch (e) {
      if (e.name !== 'AbortError') {
        setErrorList(e.message || 'Error al cargar rutinas');
      }
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchList(1);
  }, [q, vigentes, instructorId]);

  const openDetalleModal = async (rutina) => {
    setOpenId(rutina.id);
    setDetalle(rutina?.bloques?.length ? rutina : null);

    if (rutina?.bloques?.length) return;

    try {
      setLoadingDetalle(true);
      const json = await fetchJSON(
        `${BASE_URL}${RUTINA_DETALLE_ROUTE(rutina.id)}`
      );
      setDetalle(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDetalle(false);
    }
  };

  const closeDetalleModal = () => {
    setOpenId(null);
    setDetalle(null);
  };

  const openAsignarDesdeRutina = (rutina) => {
    setRutinaSeleccionadaParaAsignar(rutina);
    setModalAsignarVisible(true);
    setAlumnosSeleccionados([]);
    setBusquedaAlumnos('');
    setPaginaAlumnos(1);

    const d = rutina?.desde ? new Date(rutina.desde) : new Date();
    const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .slice(0, 10);

    setDesde(iso);
    setHasta(rutina?.hasta ?? '');
  };

  const handleAsignarRutinaCompleta = async () => {
    if (!rutinaSeleccionadaParaAsignar) {
      await swalAltosRoca({
        icon: 'warning',
        title: 'Rutina no seleccionada',
        text: 'No hay una rutina seleccionada para asignar.'
      });
      return;
    }

    if (alumnosSeleccionados.length === 0) {
      await swalAltosRoca({
        icon: 'warning',
        title: 'Seleccioná alumnos',
        text: 'Debes seleccionar al menos un alumno.'
      });
      return;
    }

    if (!desde) {
      await swalAltosRoca({
        icon: 'warning',
        title: 'Fecha requerida',
        text: 'Seleccioná la fecha "Desde".'
      });
      return;
    }

    if (hasta && new Date(hasta) < new Date(desde)) {
      await swalAltosRoca({
        icon: 'warning',
        title: 'Rango inválido',
        text: '"Hasta" no puede ser anterior a "Desde".'
      });
      return;
    }

    try {
      setCargandoAsignacion(true);

      const rutinaId = rutinaSeleccionadaParaAsignar.id;
      const body = {
        student_ids: alumnosSeleccionados.map((a) => a.id),
        desde,
        hasta: hasta || null
      };

      const res = await fetch(`${BASE_URL}/rutinas/${rutinaId}/asignar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.mensajeError || 'No se pudo asignar la rutina');
      }

      await swalAltosRoca({
        icon: 'success',
        title: 'Rutina asignada',
        text: 'La rutina se asignó correctamente.',
        timer: 1600,
        showConfirmButton: false
      });

      setModalAsignarVisible(false);
      setAlumnosSeleccionados([]);
    } catch (e) {
      console.error(e);

      await swalAltosRoca({
        icon: 'error',
        title: 'No se pudo asignar',
        text: e.message || 'Ocurrió un error al asignar la rutina.'
      });
    } finally {
      setCargandoAsignacion(false);
    }
  };
  
  const totalBloques = useMemo(
    () =>
      list.reduce((acc, r) => {
        const resumen = resumenRutina(r);
        return acc + resumen.bloques;
      }, 0),
    [list]
  );

  const totalEjercicios = useMemo(
    () =>
      list.reduce((acc, r) => {
        const resumen = resumenRutina(r);
        return acc + resumen.ejercicios;
      }, 0),
    [list]
  );

  const RutinaCard = ({ r }) => {
    const { bloques, ejercicios, series } = resumenRutina(r);

    return (
      <motion.article
        layout
        variants={cardVariants}
        initial="initial"
        animate="animate"
        transition={listTransition}
        className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all duration-300 hover:border-[#ef3347]/18"
        style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.24)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.10)_0%,rgba(255,255,255,0.02)_46%,rgba(0,0,0,0.38)_100%)] opacity-95" />
        <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.04)_0%,rgba(239,51,71,0.35)_50%,rgba(239,51,71,0.04)_100%)]" />
        <div className="absolute -right-10 top-[-24px] h-28 w-28 rounded-full bg-[#ef3347]/10 blur-2xl transition-all duration-300 group-hover:bg-[#ef3347]/16" />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className="rounded-full border border-[#ef3347]/16 bg-[#ef3347]/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#ff98a5]"
                style={fontTitle}
              >
                Rutina #{r.id}
              </span>

              <h3
                className="mt-4 line-clamp-2 text-xl font-black uppercase leading-tight text-white"
                style={fontTitle}
              >
                {r.nombre}
              </h3>

              <div
                className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/65"
                style={fontBody}
              >
                <span className="inline-flex items-center gap-1.5">
                  <UserRoundCheck className="h-4 w-4 text-[#ff98a5]" />
                  {r.instructor?.nombre || r.instructor?.name || '—'}
                </span>

                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#ff98a5]" />
                  {r.alumno?.nomyape || '—'}
                </span>
              </div>
            </div>

            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[#ef3347]/18 bg-[#ef3347]/10 text-[#ff98a5]">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p
                className="text-[11px] uppercase tracking-[0.16em] text-white/40"
                style={fontTitle}
              >
                Desde
              </p>
              <p className="mt-2 text-sm text-white/82" style={fontBody}>
                {formatDate(r.desde)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p
                className="text-[11px] uppercase tracking-[0.16em] text-white/40"
                style={fontTitle}
              >
                Hasta
              </p>
              <p className="mt-2 text-sm text-white/82" style={fontBody}>
                {formatDateOrOpen(r.hasta)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p
                className="text-[11px] uppercase tracking-[0.16em] text-white/40"
                style={fontTitle}
              >
                Bloques
              </p>
              <p
                className="mt-2 text-xl leading-none text-white"
                style={fontDisplay}
              >
                {bloques}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              <p
                className="text-[11px] uppercase tracking-[0.16em] text-white/40"
                style={fontTitle}
              >
                Ejercicios
              </p>
              <p
                className="mt-2 text-xl leading-none text-white"
                style={fontDisplay}
              >
                {ejercicios}
              </p>
            </div>
          </div>

          <div
            className="mt-4 flex items-center gap-4 text-xs text-white/55"
            style={fontBody}
          >
            <span className="inline-flex items-center gap-1.5">
              <SquareStack className="h-4 w-4 text-[#ff98a5]" />
              {bloques} bloques
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ListChecks className="h-4 w-4 text-[#ff98a5]" />
              {ejercicios} ejercicios
            </span>
            <span>Σ {series} series</span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => openAsignarDesdeRutina(r)}
              className={`${redGradientButton} w-full sm:w-auto`}
              style={fontTitle}
              title="Asignar rutina"
              aria-label="Asignar rutina"
            >
              <UserPlus className="h-4 w-4" />
              Asignar
            </button>

            <button
              onClick={() => openDetalleModal(r)}
              className={`${softButton} w-full sm:w-auto`}
              style={fontTitle}
              title="Ver rutina"
              aria-label="Ver rutina"
            >
              <Eye className="h-4 w-4" />
              Ver detalle
            </button>
          </div>
        </div>
      </motion.article>
    );
  };

  const ModalDetalle = () => {
    const resumen = resumenRutina(detalle || {});

    return (
      <AnimatePresence>
        {openId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/78 px-4 pb-6 pt-4 backdrop-blur-md md:pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="relative w-full max-w-6xl"
              initial={{ y: 24, scale: 0.985, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 24, scale: 0.985, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <div
                className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0a0a0b]/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl"
                style={{ boxShadow: '0 0 36px rgba(239, 51, 71, 0.16)' }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

                <div className="relative">
                  <div className="border-b border-white/10 px-5 py-5 md:px-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]"
                            style={fontTitle}
                          >
                            Visualización de rutina
                          </span>

                          <span
                            className="text-[22px] uppercase leading-none text-[#ff5a6f]"
                            style={fontDisplay}
                          >
                            Altos Roca
                          </span>
                        </div>

                        <h2
                          className="mt-4 text-2xl font-black uppercase text-white md:text-3xl"
                          style={fontTitle}
                        >
                          {detalle?.nombre || 'Rutina'}
                        </h2>

                        <div
                          className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/65"
                          style={fontBody}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <UserRoundCheck className="h-4 w-4 text-[#ff98a5]" />
                            {detalle?.instructor?.nombre ||
                              detalle?.instructor?.name ||
                              '—'}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-[#ff98a5]" />
                            {detalle?.alumno?.nomyape || '—'}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-4 w-4 text-[#ff98a5]" />
                            Desde {formatDate(detalle?.desde)}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-[#ff98a5]" />
                            Hasta {formatDateOrOpen(detalle?.hasta)}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={closeDetalleModal}
                        className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[78vh] overflow-y-auto px-5 py-5 md:px-7 md:py-6">
                    {loadingDetalle && !detalle ? (
                      <div
                        className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/75"
                        style={fontBody}
                      >
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando detalle...
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                            <p
                              className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                              style={fontTitle}
                            >
                              Bloques
                            </p>
                            <p
                              className="mt-2 text-3xl leading-none text-white"
                              style={fontDisplay}
                            >
                              {resumen.bloques}
                            </p>
                          </div>

                          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                            <p
                              className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                              style={fontTitle}
                            >
                              Ejercicios
                            </p>
                            <p
                              className="mt-2 text-3xl leading-none text-white"
                              style={fontDisplay}
                            >
                              {resumen.ejercicios}
                            </p>
                          </div>

                          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                            <p
                              className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                              style={fontTitle}
                            >
                              Series
                            </p>
                            <p
                              className="mt-2 text-3xl leading-none text-white"
                              style={fontDisplay}
                            >
                              {resumen.series}
                            </p>
                          </div>

                          <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
                            <p
                              className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                              style={fontTitle}
                            >
                              Vigencia
                            </p>
                            <p
                              className="mt-2 text-sm text-white/78"
                              style={fontBody}
                            >
                              {formatDate(detalle?.desde)} —{' '}
                              {formatDateOrOpen(detalle?.hasta)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-5">
                          {(detalle?.bloques || [])
                            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
                            .map((b, idx) => (
                              <section
                                key={b.id}
                                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]"
                              >
                                <div className="border-b border-white/10 px-5 py-4">
                                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <div>
                                      <span
                                        className="rounded-full border border-[#ef3347]/18 bg-[#ef3347]/10 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#ff98a5]"
                                        style={fontTitle}
                                      >
                                        Bloque {idx + 1}
                                      </span>
                                      <h3
                                        className="mt-3 text-xl font-black text-white"
                                        style={fontTitle}
                                      >
                                        {b.nombre || `Bloque ${idx + 1}`}
                                      </h3>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                      {typeof b.color_id === 'number' && (
                                        <span
                                          className={`${chipBase} border-[#ef3347]/16 bg-[#ef3347]/10 text-[#ffd5db]`}
                                          style={fontTitle}
                                        >
                                          Color #{b.color_id}
                                        </span>
                                      )}

                                      <span
                                        className={`${chipBase} border-white/10 bg-white/[0.05] text-white/75`}
                                        style={fontTitle}
                                      >
                                        {(b.ejercicios || []).length} ejercicios
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-5 space-y-4">
                                  {(b.ejercicios || [])
                                    .sort(
                                      (a, b2) =>
                                        (a.orden ?? 0) - (b2.orden ?? 0)
                                    )
                                    .map((e) => (
                                      <article
                                        key={e.id}
                                        className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20"
                                      >
                                        <div className="border-b border-white/10 px-4 py-4">
                                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div>
                                              <h4
                                                className="text-lg font-black uppercase text-white"
                                                style={fontTitle}
                                              >
                                                {e.nombre}
                                              </h4>
                                              {e.notas && (
                                                <p
                                                  className="mt-2 max-w-3xl text-sm leading-6 text-white/62"
                                                  style={fontBody}
                                                >
                                                  {e.notas}
                                                </p>
                                              )}
                                            </div>

                                            <span
                                              className={`${chipBase} border-white/10 bg-white/[0.05] text-white/75`}
                                              style={fontTitle}
                                            >
                                              {(e.series || []).length} series
                                            </span>
                                          </div>
                                        </div>

                                        <div className="overflow-x-auto px-4 py-4">
                                          <table className="min-w-[620px] w-full border-collapse">
                                            <thead>
                                              <tr className="border-b border-white/10">
                                                <th
                                                  className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-white/45"
                                                  style={fontTitle}
                                                >
                                                  Serie
                                                </th>
                                                <th
                                                  className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-white/45"
                                                  style={fontTitle}
                                                >
                                                  Reps
                                                </th>
                                                <th
                                                  className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-white/45"
                                                  style={fontTitle}
                                                >
                                                  Kg
                                                </th>
                                                <th
                                                  className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-white/45"
                                                  style={fontTitle}
                                                >
                                                  Descanso
                                                </th>
                                                <th
                                                  className="px-3 py-3 text-left text-[11px] uppercase tracking-[0.16em] text-white/45"
                                                  style={fontTitle}
                                                >
                                                  Tiempo
                                                </th>
                                              </tr>
                                            </thead>

                                            <tbody>
                                              {(e.series || [])
                                                .sort(
                                                  (a, b3) =>
                                                    (a.numero_serie ?? 0) -
                                                    (b3.numero_serie ?? 0)
                                                )
                                                .map((s, rowIndex) => (
                                                  <tr
                                                    key={s.id}
                                                    className={
                                                      'border-b border-white/6 ' +
                                                      (rowIndex % 2 === 0
                                                        ? 'bg-transparent'
                                                        : 'bg-white/[0.03]')
                                                    }
                                                  >
                                                    <td
                                                      className="px-3 py-3 text-sm text-white/82"
                                                      style={fontBody}
                                                    >
                                                      {s.numero_serie ?? '—'}
                                                    </td>
                                                    <td
                                                      className="px-3 py-3 text-sm text-white/82"
                                                      style={fontBody}
                                                    >
                                                      {s.repeticiones ?? '—'}
                                                    </td>
                                                    <td
                                                      className="px-3 py-3 text-sm text-white/82"
                                                      style={fontBody}
                                                    >
                                                      {s.kg ?? '—'}
                                                    </td>
                                                    <td
                                                      className="px-3 py-3 text-sm text-white/82"
                                                      style={fontBody}
                                                    >
                                                      {s.descanso ?? '—'}
                                                    </td>
                                                    <td
                                                      className="px-3 py-3 text-sm text-white/82"
                                                      style={fontBody}
                                                    >
                                                      {s.tiempo ?? '—'}
                                                    </td>
                                                  </tr>
                                                ))}
                                            </tbody>
                                          </table>
                                        </div>
                                      </article>
                                    ))}

                                  {!(b.ejercicios || []).length && (
                                    <div
                                      className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-5 text-sm text-white/52"
                                      style={fontBody}
                                    >
                                      Este bloque no tiene ejercicios cargados.
                                    </div>
                                  )}
                                </div>
                              </section>
                            ))}

                          {!loadingDetalle &&
                            !(detalle?.bloques || []).length && (
                              <div
                                className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center text-white/52"
                                style={fontBody}
                              >
                                No hay bloques disponibles para esta rutina.
                              </div>
                            )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const isRangoInvalido = !!(
    hasta &&
    desde &&
    new Date(hasta) < new Date(desde)
  );

  return (
    <>
      <NavbarStaff></NavbarStaff>
      <div className="min-h-[100dvh] overflow-hidden bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)]">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <Toolbar
          q={q}
          onChangeQ={setQ}
          onClearQ={() => setQ('')}
          vigentes={vigentes}
          onToggleVigentes={() => setVigentes((v) => !v)}
          users={users}
          instructorId={instructorId}
          onSelectInstructor={setInstructorId}
          meta={meta}
          errorUsers={errorUsers}
          loadingUsers={loadingUsers}
          onRefresh={() => fetchList(meta.page || 1)}
          onNuevaRutina={handleNuevaRutina}
        />

        <main className="relative z-10 mx-auto max-w-8xl px-4 py-5 sm:px-6">
          {errorList && (
            <div
              className="mb-4 rounded-[24px] border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-3 text-sm text-[#ffd5db]"
              style={fontBody}
            >
              {errorList}
            </div>
          )}

          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
              <p
                className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                style={fontTitle}
              >
                Rutinas en página
              </p>
              <p
                className="mt-2 text-3xl leading-none text-white"
                style={fontDisplay}
              >
                {list.length}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
              <p
                className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                style={fontTitle}
              >
                Bloques visibles
              </p>
              <p
                className="mt-2 text-3xl leading-none text-white"
                style={fontDisplay}
              >
                {totalBloques}
              </p>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-4">
              <p
                className="text-[11px] uppercase tracking-[0.2em] text-white/45"
                style={fontTitle}
              >
                Ejercicios visibles
              </p>
              <p
                className="mt-2 text-3xl leading-none text-white"
                style={fontDisplay}
              >
                {totalEjercicios}
              </p>
            </div>
          </div>

          {loadingList && !list.length ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-5 animate-pulse"
                >
                  <div className="mb-3 h-3 w-24 rounded-full bg-white/10" />
                  <div className="mb-3 h-6 w-2/3 rounded-full bg-white/10" />
                  <div className="mb-5 h-4 w-1/2 rounded-full bg-white/10" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 rounded-2xl bg-white/10" />
                    <div className="h-20 rounded-2xl bg-white/10" />
                    <div className="h-20 rounded-2xl bg-white/10" />
                    <div className="h-20 rounded-2xl bg-white/10" />
                  </div>
                  <div className="mt-5 h-10 w-full rounded-2xl bg-white/10" />
                </div>
              ))}
            </div>
          ) : (
            <>
              {!list.length ? (
                <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-10 text-center text-white/90">
                  <ClipboardList className="mx-auto h-8 w-8 text-[#ff98a5]" />
                  <p
                    className="mt-4 text-lg font-semibold text-white"
                    style={fontTitle}
                  >
                    No se encontraron rutinas
                  </p>
                  <p className="mt-2 text-sm text-white/58" style={fontBody}>
                    Ajustá los filtros actuales o refrescá el listado para
                    volver a intentar.
                  </p>
                </div>
              ) : (
                <motion.div
                  layout
                  className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
                  transition={listTransition}
                >
                  {list.map((r) => (
                    <RutinaCard key={r.id} r={r} />
                  ))}
                </motion.div>
              )}

              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  className={softButton}
                  disabled={meta.page <= 1}
                  onClick={() => fetchList(meta.page - 1)}
                  style={fontTitle}
                >
                  Anterior
                </button>

                <span className="px-4 text-sm text-white/75" style={fontBody}>
                  Página {meta.page} de {meta.totalPages}
                </span>

                <button
                  className={softButton}
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => fetchList(meta.page + 1)}
                  style={fontTitle}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </main>

        <ModalDetalle />

        <AnimatePresence>
          {modalAsignarVisible && (
            <motion.div
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/78 px-4 pb-6 pt-4 backdrop-blur-md md:pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 22, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 22, scale: 0.985 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/10 bg-[#0a0a0b]/95 shadow-2xl ring-1 ring-white/10"
              >
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)]" />
                <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,rgba(239,51,71,0.08)_0%,rgba(239,51,71,0.45)_50%,rgba(239,51,71,0.08)_100%)]" />

                <div className="relative">
                  <div className="border-b border-white/10 px-5 py-5 md:px-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span
                            className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]"
                            style={fontTitle}
                          >
                            Asignación
                          </span>

                          <span
                            className="text-[22px] uppercase leading-none text-[#ff5a6f]"
                            style={fontDisplay}
                          >
                            Altos Roca
                          </span>
                        </div>

                        <h2
                          className="mt-4 titulo uppercase  text-2xl font-black text-white"
                          style={fontTitle}
                        >
                          Asignar rutina a alumnos
                        </h2>

                        {rutinaSeleccionadaParaAsignar && (
                          <p
                            className="mt-2 text-sm text-white/62"
                            style={fontBody}
                          >
                            Rutina seleccionada:{' '}
                            <span className="font-semibold text-white">
                              {rutinaSeleccionadaParaAsignar.nombre}
                            </span>
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => setModalAsignarVisible(false)}
                        className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition hover:bg-white/[0.08] hover:text-white"
                        aria-label="Cerrar"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-[78vh] overflow-y-auto px-5 py-5 md:px-6">
                    <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                        <input
                          type="text"
                          placeholder="Buscar por nombre o DNI..."
                          value={busquedaAlumnos}
                          onChange={(e) => {
                            setBusquedaAlumnos(e.target.value);
                            setPaginaAlumnos(1);
                          }}
                          className="h-12 w-full rounded-2xl border border-white/10 bg-black/20 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/28 ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15"
                          style={fontBody}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label
                            className="mb-2 block text-sm text-white/84"
                            style={fontTitle}
                          >
                            Desde
                          </label>
                          <div
                            className={clsx(
                              'rounded-2xl border bg-black/20 px-4 py-3 ring-1 transition',
                              isRangoInvalido
                                ? 'border-[#ef3347]/25 ring-[#ef3347]/15'
                                : 'border-white/10 ring-white/10'
                            )}
                          >
                            <input
                              type="date"
                              value={desde}
                              onChange={(e) => setDesde(e.target.value)}
                              className="w-full bg-transparent text-sm text-white outline-none"
                              style={fontBody}
                            />
                          </div>
                        </div>

                        <div>
                          <label
                            className="mb-2 block text-sm text-white/84"
                            style={fontTitle}
                          >
                            Hasta{' '}
                            <span className="text-white/45">(opcional)</span>
                          </label>
                          <div
                            className={clsx(
                              'rounded-2xl border bg-black/20 px-4 py-3 ring-1 transition',
                              isRangoInvalido
                                ? 'border-[#ef3347]/25 ring-[#ef3347]/15'
                                : 'border-white/10 ring-white/10'
                            )}
                          >
                            <input
                              type="date"
                              value={hasta ?? ''}
                              onChange={(e) => setHasta(e.target.value)}
                              className="w-full bg-transparent text-sm text-white outline-none"
                              style={fontBody}
                            />
                          </div>
                          <p
                            className="mt-2 text-[11px] text-white/45"
                            style={fontBody}
                          >
                            Dejar vacío para vigencia indefinida.
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setDesde(new Date().toISOString().slice(0, 10))
                          }
                          className={softButton}
                          style={fontTitle}
                        >
                          Hoy
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + 7);
                            setHasta(d.toISOString().slice(0, 10));
                          }}
                          className={softButton}
                          style={fontTitle}
                        >
                          +7 días
                        </button>

                        <button
                          type="button"
                          onClick={() => setHasta('')}
                          className={softButton}
                          style={fontTitle}
                        >
                          Indefinida
                        </button>

                        <span
                          className="ml-auto rounded-full border border-[#ef3347]/16 bg-[#ef3347]/10 px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[#ffd5db]"
                          style={fontTitle}
                        >
                          Seleccionados: {alumnosSeleccionados.length}
                        </span>
                      </div>

                      {isRangoInvalido && (
                        <p
                          className="mt-3 text-[12px] text-[#ffd5db]"
                          style={fontBody}
                        >
                          “Hasta” no puede ser anterior a “Desde”.
                        </p>
                      )}
                    </div>

                    <div className="mt-5">
                      {alumnosFiltrados.length === 0 ? (
                        <div
                          className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-white/52"
                          style={fontBody}
                        >
                          No se encontraron alumnos.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {alumnosPaginados.map((alumno) => {
                            const selected = alumnosSeleccionados.some(
                              (a) => a.id === alumno.id
                            );

                            return (
                              <label
                                key={alumno.id}
                                className={clsx(
                                  'flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition',
                                  selected
                                    ? 'border-[#ef3347]/20 bg-[#ef3347]/10 text-white'
                                    : 'border-white/10 bg-white/[0.04] text-white/78 hover:bg-white/[0.08]'
                                )}
                                style={fontBody}
                              >
                                <input
                                  type="checkbox"
                                  checked={selected}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setAlumnosSeleccionados((prev) => [
                                        ...prev,
                                        alumno
                                      ]);
                                    } else {
                                      setAlumnosSeleccionados((prev) =>
                                        prev.filter((a) => a.id !== alumno.id)
                                      );
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-white/20 bg-transparent"
                                />

                                <span className="text-sm">
                                  {alumno.nomyape}{' '}
                                  {alumno.dni ? `– DNI: ${alumno.dni}` : ''}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {alumnosFiltrados.length > alumnosPaginados.length && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={() => setPaginaAlumnos((prev) => prev + 1)}
                          className="text-sm font-semibold text-[#ffd5db] transition hover:text-white"
                          style={fontTitle}
                        >
                          Ver más alumnos
                        </button>
                      </div>
                    )}

                    <div className="mt-6">
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAsignarRutinaCompleta}
                        disabled={cargandoAsignacion || isRangoInvalido}
                        className={clsx(
                          'w-full rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 py-3 text-base font-semibold text-white transition',
                          'disabled:cursor-not-allowed disabled:opacity-50 inline-flex items-center justify-center gap-2'
                        )}
                        style={fontTitle}
                      >
                        {cargandoAsignacion ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Asignando...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Asignar rutina
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
