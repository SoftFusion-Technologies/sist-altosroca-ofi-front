import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FaFilter,
  FaSearch,
  FaPlus,
  FaTrash,
  FaEdit,
  FaTachometerAlt,
  FaClock,
  FaChartLine,
  FaUser,
  FaCalendarAlt,
  FaFire
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

import {
  createPSEGeneric,
  createPSESerie,
  createPSESesion
} from '../../api/pseApi';
import PSEModal from '../../components/PSEModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const TABS = [
  { key: 'rutina', label: 'Sesión' },
  { key: 'bloque', label: 'Bloque' },
  { key: 'ejercicio', label: 'Ejercicio' },
  { key: 'serie', label: 'Serie' }
];

/* Benjamin Orellana - 06/04/2026 - Helpers visuales y de formato para adaptar el dashboard PSE al estilo Altos Roca */
const shellClass =
  'border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.48)]';
const softBoxClass =
  'rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl';
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15';
const buttonPrimaryClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 py-2.5 text-sm font-semibold text-white transition hover:scale-[1.01]';
const buttonSoftClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]';

const EscalaBadge = ({ escala }) => (
  <span className="inline-flex items-center rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-2.5 py-1 text-[11px] font-semibold text-[#ffd5db] shadow-sm">
    {escala || '—'}
  </span>
);

const RpeChip = ({ rpe }) => {
  const cls =
    rpe == null
      ? 'bg-white/10 text-white/70 border border-white/10'
      : rpe >= 9
        ? 'bg-red-600 text-white border border-red-500/30'
        : rpe >= 7
          ? 'bg-amber-500 text-white border border-amber-400/30'
          : 'bg-emerald-600 text-white border border-emerald-500/30';

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-bold ${cls}`}
    >
      RPE {rpe ?? '-'}
    </span>
  );
};

const SkeletonRow = () => (
  <div className="grid grid-cols-12 gap-3 px-4 py-4">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="col-span-2">
        <div className="h-4 rounded-full bg-white/10 animate-pulse" />
      </div>
    ))}
  </div>
);

export default function PSEDashboard() {
  const navigate = useNavigate();
  const [search] = useSearchParams();

  const qpStudent = search.get('student_id') || '';
  const [tab, setTab] = useState(search.get('nivel') || 'serie');
  const [page, setPage] = useState(Number(search.get('page') || 1));
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [studentId, setStudentId] = useState(qpStudent);
  const [rutinaId, setRutinaId] = useState('');
  const [bloqueId, setBloqueId] = useState('');
  const [ejercicioId, setEjercicioId] = useState('');
  const [serieId, setSerieId] = useState('');
  const [escala, setEscala] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [buscar, setBuscar] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('serie');
  const [modalCtx, setModalCtx] = useState(null);

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  const avgRPE = useMemo(() => {
    const list = rows.map((r) => Number(r.rpe_real)).filter((n) => !isNaN(n));
    if (!list.length) return null;
    const sum = list.reduce((a, b) => a + b, 0);
    return (sum / list.length).toFixed(1);
  }, [rows]);

  const hiRPEpct = useMemo(() => {
    const list = rows.map((r) => Number(r.rpe_real)).filter((n) => !isNaN(n));
    if (!list.length) return null;
    const hi = list.filter((n) => n >= 9).length;
    return Math.round((100 * hi) / list.length);
  }, [rows]);

  const queryParams = useMemo(() => {
    const params = { nivel: tab, page, pageSize };
    if (studentId) params.student_id = studentId;
    if (rutinaId) params.rutina_id = rutinaId;
    if (bloqueId) params.bloque_id = bloqueId;
    if (ejercicioId) params.ejercicio_id = ejercicioId;
    if (serieId) params.serie_id = serieId;
    if (escala) params.escala = escala;
    if (fechaDesde) params.fecha_desde = fechaDesde;
    if (fechaHasta) params.fecha_hasta = fechaHasta;
    if (buscar) params.q = buscar;
    return params;
  }, [
    tab,
    page,
    pageSize,
    studentId,
    rutinaId,
    bloqueId,
    ejercicioId,
    serieId,
    escala,
    fechaDesde,
    fechaHasta,
    buscar
  ]);

  const fetchList = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/pse`, { params: queryParams });
      setRows(data?.data || []);
      setTotal(data?.meta?.total || 0);
    } catch {
      toast.error('No se pudo cargar la lista de PSE');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();

    const url = new URL(window.location.href);
    Object.entries({ nivel: tab, page, student_id: studentId }).forEach(
      ([k, v]) => {
        if (v) url.searchParams.set(k, v);
        else url.searchParams.delete(k);
      }
    );
    navigate(`${url.pathname}${url.search}`, { replace: true });
  }, [JSON.stringify(queryParams)]);

  const openCreate = (nivel) => {
    setModalMode(nivel);
    setModalCtx({
      student_id: Number(studentId) || undefined,
      rutina_id: Number(rutinaId) || undefined,
      bloque_id: Number(bloqueId) || undefined,
      ejercicio_id: Number(ejercicioId) || undefined,
      serie_id: Number(serieId) || undefined
    });
    setModalOpen(true);
  };

  const onSubmitModal = async (payload) => {
    if (modalMode === 'serie') return await createPSESerie(payload);
    if (modalMode === 'sesion' || modalMode === 'rutina')
      return await createPSESesion(payload);
    return await createPSEGeneric({ nivel: modalMode, ...payload });
  };

  const onSavedModal = () => {
    toast.success('Registro guardado correctamente');
    fetchList();
  };

  const onEdit = (row) => {
    setModalMode(row.nivel);
    setModalCtx({
      student_id: row.student_id,
      rutina_id: row.rutina_id,
      bloque_id: row.bloque_id,
      ejercicio_id: row.ejercicio_id,
      serie_id: row.serie_id,
      _initial: {
        escala: row.escala,
        rpe_real: row.rpe_real,
        rir: row.rir,
        comentarios: row.comentarios,
        duracion_min: row.duracion_min
      },
      _editId: row.id
    });
    setModalOpen(true);
  };

  const onDelete = async (id) => {
    const ok = window.confirm('¿Eliminar este registro de PSE?');
    if (!ok) return;

    try {
      await axios.delete(`${API}/pse/${id}`);
      toast.success('Registro eliminado');
      fetchList();
    } catch {
      toast.error('No se pudo eliminar');
    }
  };

  const TabButton = ({ t }) => {
    const active = tab === t.key;

    return (
      <button
        onClick={() => {
          setTab(t.key);
          setPage(1);
        }}
        className={`relative px-4 py-2 rounded-full text-sm font-bold transition ${
          active ? 'text-white' : 'text-white/75'
        }`}
      >
        <span
          className={`absolute inset-0 rounded-full transition ${
            active
              ? 'bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] shadow-[0_10px_24px_-10px_rgba(239,51,71,0.65)]'
              : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]'
          }`}
        />
        <span className="relative">{t.label}</span>
      </button>
    );
  };

  const ColsHeader = () => (
    <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
      <div className="col-span-2">Fecha</div>
      {tab !== 'rutina' && <div className="col-span-2">Contexto</div>}
      <div className="col-span-2">Escala</div>
      <div className="col-span-2">RPE / RIR</div>
      <div className="col-span-2">Notas</div>
      <div className="col-span-2 text-right">Acciones</div>
    </div>
  );

  const RowItem = ({ r }) => (
    <motion.div
      layout
      className="grid grid-cols-12 gap-3 items-center px-4 py-4 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm hover:bg-white/[0.04] transition"
    >
      <div className="col-span-2 text-sm text-white/85 flex items-center gap-2">
        <FaClock className="text-[#ff98a5]" />
        {dayjs(r.fecha_registro).format('DD/MM/YYYY HH:mm')}
      </div>

      {tab !== 'rutina' && (
        <div className="col-span-2 text-xs text-white/68">
          {tab === 'bloque' && <span>Bloque #{r.bloque_id}</span>}
          {tab === 'ejercicio' && (
            <span>
              Ejercicio #{r.ejercicio_id}
              {r?.ejercicio?.nombre ? ` · ${r.ejercicio.nombre}` : ''}
            </span>
          )}
          {tab === 'serie' && (
            <span>
              Serie #{r.serie_id} · Ej #{r.ejercicio_id}
            </span>
          )}
        </div>
      )}

      <div className="col-span-2 flex items-center gap-2">
        <EscalaBadge escala={r.escala} />
      </div>

      <div className="col-span-2 flex items-center gap-2 flex-wrap">
        <RpeChip rpe={r.rpe_real} />
        {r.rir != null && (
          <span className="text-[11px] font-semibold text-white/65">
            RIR {r.rir}
          </span>
        )}
        {tab === 'rutina' && r.duracion_min != null && (
          <span className="text-[11px] font-semibold text-white/65">
            · {r.duracion_min} min
          </span>
        )}
      </div>

      <div className="col-span-2 text-xs text-white/70 line-clamp-2">
        {r.comentarios || '—'}
      </div>

      <div className="col-span-2 flex justify-end gap-2">
        <button
          onClick={() => onEdit(r)}
          className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/85 flex items-center gap-2 text-xs"
          aria-label="Editar"
        >
          <FaEdit /> Editar
        </button>

        <button
          onClick={() => onDelete(r.id)}
          className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 text-xs"
          aria-label="Eliminar"
        >
          <FaTrash /> Eliminar
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[100dvh] bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)]">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0b',
            color: '#f3f4f6',
            border: '1px solid rgba(255,255,255,0.08)'
          }
        }}
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
      </div>

      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0b]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]">
                  Monitoreo de esfuerzo
                </span>
                <span className="text-[22px] uppercase leading-none text-[#ff5a6f]">
                  Altos Roca
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase">
                  PSE / RPE
                </h2>
                <FaChartLine className="text-[#ef3347]" />
              </div>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
                Administrá registros de percepción subjetiva del esfuerzo por
                sesión, bloque, ejercicio o serie desde una vista clara, moderna
                y orientada al seguimiento del alumno.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="hidden md:flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <FaSearch className="text-white/35" />
                <input
                  className="w-64 bg-transparent text-sm text-white outline-none placeholder:text-white/28"
                  placeholder="Buscar comentario..."
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                />
              </div>

              <button
                onClick={() => openCreate(tab)}
                className={buttonPrimaryClass}
              >
                <FaPlus /> Nuevo {TABS.find((t) => t.key === tab)?.label}
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <TabButton key={t.key} t={t} />
            ))}

            <button
              onClick={() => {
                setTab('rutina');
                setPage(1);
                openCreate('rutina');
              }}
              className="relative px-4 py-2 rounded-full text-sm font-semibold text-white/75"
            >
              <span className="absolute inset-0 rounded-full bg-white/[0.04] border border-white/10 hover:bg-white/[0.08]" />
              <span className="relative inline-flex items-center gap-2">
                <FaTachometerAlt />
                Registrar sRPE
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`${softBoxClass} p-5`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Total registros
              </p>
              <FaChartLine className="text-[#ff98a5]" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">{total}</p>
          </div>

          <div className={`${softBoxClass} p-5`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                Promedio RPE
              </p>
              <FaFire className="text-[#ff98a5]" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">
              {avgRPE ?? '—'}
            </p>
          </div>

          <div className={`${softBoxClass} p-5`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                % RPE ≥ 9
              </p>
              <FaTachometerAlt className="text-[#ff98a5]" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">
              {hiRPEpct != null ? `${hiRPEpct}%` : '—'}
            </p>
          </div>
        </div>

        <div className={`rounded-[28px] ${shellClass} p-5`}>
          <div className="flex items-center gap-2 text-white font-semibold text-sm mb-4">
            <FaFilter className="text-[#ff98a5]" />
            Filtros
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                Student ID
              </label>
              <input
                className={inputClass}
                placeholder="Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                Rutina ID
              </label>
              <input
                className={inputClass}
                placeholder="Rutina ID"
                value={rutinaId}
                onChange={(e) => setRutinaId(e.target.value)}
              />
            </div>

            {tab !== 'rutina' && (
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                  Bloque ID
                </label>
                <input
                  className={inputClass}
                  placeholder="Bloque ID"
                  value={bloqueId}
                  onChange={(e) => setBloqueId(e.target.value)}
                />
              </div>
            )}

            {(tab === 'ejercicio' || tab === 'serie') && (
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                  Ejercicio ID
                </label>
                <input
                  className={inputClass}
                  placeholder="Ejercicio ID"
                  value={ejercicioId}
                  onChange={(e) => setEjercicioId(e.target.value)}
                />
              </div>
            )}

            {tab === 'serie' && (
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                  Serie ID
                </label>
                <input
                  className={inputClass}
                  placeholder="Serie ID"
                  value={serieId}
                  onChange={(e) => setSerieId(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                Escala
              </label>
              <select
                className={inputClass}
                value={escala}
                onChange={(e) => setEscala(e.target.value)}
              >
                <option value="" className="text-slate-900">
                  Escala
                </option>
                <option value="RPE_10" className="text-slate-900">
                  RPE_10
                </option>
                <option value="CR10" className="text-slate-900">
                  CR10
                </option>
                <option value="BORG_6_20" className="text-slate-900">
                  BORG_6_20
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                Fecha desde
              </label>
              <input
                type="date"
                className={inputClass}
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.16em] text-white/45">
                Fecha hasta
              </label>
              <input
                type="date"
                className={inputClass}
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
              />
            </div>

            <div className="sm:col-span-2 xl:col-span-2 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <button
                onClick={() => {
                  setPage(1);
                  fetchList();
                }}
                className={`${buttonPrimaryClass} w-full`}
              >
                Aplicar filtros
              </button>

              <button
                onClick={() => {
                  setRutinaId('');
                  setBloqueId('');
                  setEjercicioId('');
                  setSerieId('');
                  setEscala('');
                  setFechaDesde('');
                  setFechaHasta('');
                  setBuscar('');
                  setPage(1);
                }}
                className={`${buttonSoftClass} w-full`}
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => {
                setEscala('RPE_10');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full border transition ${
                escala === 'RPE_10'
                  ? 'bg-[#ef3347] text-white border-[#ef3347]'
                  : 'bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08]'
              }`}
            >
              RPE 0–10
            </button>

            <button
              onClick={() => {
                setEscala('');
                setFechaDesde('');
                setFechaHasta('');
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-full border bg-white/[0.04] border-white/10 text-white/75 hover:bg-white/[0.08]"
            >
              Quitar filtros
            </button>
          </div>
        </div>

        <div className="hidden md:block">
          <div className={`rounded-[28px] ${shellClass} overflow-hidden`}>
            <ColsHeader />

            <div className="divide-y divide-white/6 px-3 pb-3">
              <AnimatePresence>
                {loading ? (
                  <>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                  </>
                ) : rows.length ? (
                  rows.map((r) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="pt-3"
                    >
                      <RowItem r={r} />
                    </motion.div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff98a5]">
                      <FaChartLine size={22} />
                    </div>
                    <p className="mt-4 text-white font-semibold">
                      No hay registros aún
                    </p>
                    <p className="mt-2 text-white/55 text-sm">
                      Creá el primero con el botón “Nuevo{' '}
                      {TABS.find((t) => t.key === tab)?.label}”.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="md:hidden space-y-3">
          <AnimatePresence>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[24px] ${shellClass} p-4 animate-pulse`}
                >
                  <div className="h-4 w-24 rounded-full bg-white/10 mb-2" />
                  <div className="h-3 w-48 rounded-full bg-white/10 mb-3" />
                  <div className="h-8 w-full rounded-xl bg-white/10" />
                </div>
              ))
            ) : rows.length ? (
              rows.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className={`rounded-[24px] ${shellClass} p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-bold text-white">
                      {dayjs(r.fecha_registro).format('DD/MM HH:mm')}
                    </div>
                    <EscalaBadge escala={r.escala} />
                  </div>

                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <RpeChip rpe={r.rpe_real} />
                    {r.rir != null && (
                      <span className="text-[11px] font-semibold text-white/65">
                        RIR {r.rir}
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-white/70 mb-3">
                    {r.comentarios || '—'}
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(r)}
                      className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white/85 flex items-center gap-2 text-xs"
                    >
                      <FaEdit /> Editar
                    </button>

                    <button
                      onClick={() => onDelete(r.id)}
                      className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-2 text-xs"
                    >
                      <FaTrash /> Eliminar
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className={`${shellClass} p-6 text-center text-white/60`}>
                Sin resultados
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/60">
            Total: <strong className="text-white">{total}</strong>
          </div>

          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n} className="text-slate-900">
                  {n}/pág
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="text-xs text-white/65">
                {page}/{pages}
              </span>

              <button
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] text-white disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => openCreate(tab)}
        className="md:hidden fixed bottom-5 right-5 rounded-full h-14 w-14 flex items-center justify-center shadow-[0_14px_30px_-10px_rgba(239,51,71,0.65)] bg-[#d11f2f] hover:bg-[#b71c2b] text-white"
        aria-label="Nuevo registro"
      >
        <FaPlus />
      </button>

      <PSEModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode === 'rutina' ? 'sesion' : modalMode}
        context={modalCtx}
        onSubmit={onSubmitModal}
        onSaved={onSavedModal}
      />
    </div>
  );
}
