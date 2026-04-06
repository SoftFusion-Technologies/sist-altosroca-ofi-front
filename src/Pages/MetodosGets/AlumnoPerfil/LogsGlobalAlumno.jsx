// src/pages/LogsGlobalAlumno.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiCalendar,
  FiXCircle,
  FiChevronLeft,
  FiChevronRight,
  FiRotateCw,
  FiArrowLeft,
  FiGrid,
  FiActivity,
  FiHash,
  FiLayers,
  FiBarChart2
} from 'react-icons/fi';
import NavbarStaff from '../../staff/NavbarStaff';
import { formatDdMmYyyySmart } from '../../../utils/fechas';
import ParticlesBackground from '../../../components/ParticlesBackground';

const API = 'http://localhost:8080';

const fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('es-AR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

/* Benjamin Orellana - 06/04/2026 - Helpers visuales para adaptar el listado global del alumno al estilo Altos Roca */
const shellClass =
  'border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-[0_18px_55px_-28px_rgba(0,0,0,0.48)]';

const softCardClass =
  'rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl';

const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 ring-1 ring-white/10 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15';

const buttonSoftClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white/85 transition hover:bg-white/[0.08]';

const buttonPrimaryClass =
  'inline-flex items-center justify-center gap-2 rounded-2xl border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] px-4 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]';

export default function LogsGlobalAlumno() {
  const navigate = useNavigate();
  const [sp, setSp] = useSearchParams();

  const student_id = sp.get('student_id') || '';
  const [page, setPage] = useState(Number(sp.get('page') || 1));
  const [limit, setLimit] = useState(Number(sp.get('limit') || 20));
  const [q, setQ] = useState(sp.get('q') || '');
  const [dateFrom, setDateFrom] = useState(sp.get('date_from') || '');
  const [dateTo, setDateTo] = useState(sp.get('date_to') || '');
  const [refreshTick, setRefreshTick] = useState(0);

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const canSearch = useMemo(() => Boolean(student_id), [student_id]);
  const topRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  /* Benjamin Orellana - 06/04/2026 - Contador visual de filtros activos para mostrar resumen operativo */
  const activeFilters = useMemo(() => {
    return [q, dateFrom, dateTo].filter(Boolean).length;
  }, [q, dateFrom, dateTo]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (student_id) next.set('student_id', student_id);
    next.set('page', String(page));
    next.set('limit', String(limit));
    if (q) next.set('q', q);
    if (dateFrom) next.set('date_from', dateFrom);
    if (dateTo) next.set('date_to', dateTo);
    setSp(next, { replace: true });
  }, [student_id, page, limit, q, dateFrom, dateTo, setSp]);

  useEffect(() => {
    let cancel = false;

    axios
      .get(`${API}/rutina-colores`)
      .then(
        (res) => !cancel && setColors(Array.isArray(res.data) ? res.data : [])
      )
      .catch(() => !cancel && setColors([]));

    return () => {
      cancel = true;
    };
  }, []);

  const getColorHex = (id) =>
    colors.find((c) => c.id === id)?.color_hex || '#ef3347';

  useEffect(() => {
    if (!canSearch) return;

    let cancel = false;

    const fetchData = async () => {
      setLoading(true);
      setErr('');

      try {
        const { data } = await axios.get(
          `${API}/routine_exercise_logs/global`,
          {
            params: {
              student_id,
              page,
              limit,
              q: q || undefined,
              date_from: dateFrom || undefined,
              date_to: dateTo || undefined
            }
          }
        );

        if (cancel) return;

        setRows(Array.isArray(data?.rows) ? data.rows : []);
        setTotal(Number(data?.total || 0));
        topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (e) {
        if (!cancel) {
          setRows([]);
          setTotal(0);
          setErr('No se pudo cargar el registro global.');
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancel = true;
    };
  }, [student_id, page, limit, q, dateFrom, dateTo, canSearch, refreshTick]);

  const clearFilters = () => {
    setQ('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const setToday = () => {
    const t = new Date();
    const yyyy = t.getFullYear();
    const mm = String(t.getMonth() + 1).padStart(2, '0');
    const dd = String(t.getDate()).padStart(2, '0');
    const today = `${yyyy}-${mm}-${dd}`;
    setDateFrom(today);
    setDateTo(today);
    setPage(1);
  };

  return (
    <>
      <NavbarStaff />

      <div className="min-h-screen pt-10 pb-10 bg-[linear-gradient(180deg,#0a0a0b_0%,#111114_55%,#050505_100%)]">
        <ParticlesBackground />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8%] top-[-8%] h-[320px] w-[320px] rounded-full bg-[#d11f2f]/10 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-[280px] w-[280px] rounded-full bg-[#ef3347]/8 blur-3xl" />
        </div>

        <div
          ref={topRef}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-10"
        >
          <header className="pt-6 sm:pt-8">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/85 hover:text-white transition"
            >
              <FiArrowLeft />
              Volver
            </button>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]">
                Seguimiento global
              </span>
              <span className="text-[22px] uppercase leading-none text-[#ff5a6f]">
                Altos Roca
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              Registro global del alumno
            </h1>

            <div className="mt-2 text-white/70 text-sm sm:text-base">
              Alumno ID: <b className="text-white">{student_id || '—'}</b>
            </div>
          </header>

          {!canSearch && (
            <div
              className={`mt-6 rounded-[26px] ${shellClass} p-6 text-center`}
            >
              <p className="text-lg font-semibold text-white">
                Falta el identificador del alumno
              </p>
              <p className="mt-2 text-sm text-white/55">
                Debes ingresar o navegar con un{' '}
                <span className="font-semibold text-white">student_id</span>{' '}
                válido para poder consultar el registro global.
              </p>
            </div>
          )}

          {canSearch && (
            <>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
                <div className={`${softCardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Registros
                    </p>
                    <FiBarChart2 className="text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-3xl font-black text-white">{total}</p>
                </div>

                <div className={`${softCardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Página actual
                    </p>
                    <FiGrid className="text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-3xl font-black text-white">{page}</p>
                </div>

                <div className={`${softCardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Límite
                    </p>
                    <FiHash className="text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-3xl font-black text-white">{limit}</p>
                </div>

                <div className={`${softCardClass} p-5`}>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Filtros activos
                    </p>
                    <FiLayers className="text-[#ff98a5]" />
                  </div>
                  <p className="mt-3 text-3xl font-black text-white">
                    {activeFilters}
                  </p>
                </div>
              </div>

              <div className="sticky top-0 z-20 mt-5">
                <div className={`rounded-[28px] ${shellClass}`}>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/85 mb-4">
                      <FiSearch className="text-[#ff98a5]" />
                      Filtros de búsqueda
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-2">
                          Buscar
                        </label>
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                          <input
                            value={q}
                            onChange={(e) => {
                              setQ(e.target.value);
                              setPage(1);
                            }}
                            placeholder="Rutina, bloque o ejercicio"
                            className={`${inputClass} pl-10 pr-10`}
                          />
                          {q && (
                            <button
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white"
                              onClick={() => {
                                setQ('');
                                setPage(1);
                              }}
                              aria-label="Limpiar búsqueda"
                              type="button"
                            >
                              <FiXCircle />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-2">
                          Desde
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                          <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => {
                              setDateFrom(e.target.value);
                              setPage(1);
                            }}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-[0.18em] text-white/45 mb-2">
                          Hasta
                        </label>
                        <div className="relative">
                          <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" />
                          <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => {
                              setDateTo(e.target.value);
                              setPage(1);
                            }}
                            className={`${inputClass} pl-10`}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-3 flex flex-col gap-3 md:justify-end">
                        <div className="flex gap-2">
                          <button
                            onClick={setToday}
                            type="button"
                            className={`${buttonSoftClass} flex-1`}
                            title="Filtrar hoy"
                          >
                            Hoy
                          </button>

                          <button
                            onClick={clearFilters}
                            type="button"
                            className={`${buttonSoftClass} flex-1`}
                            disabled={loading}
                          >
                            Limpiar
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-xs text-white/60 whitespace-nowrap">
                            / pág
                          </label>

                          <select
                            value={limit}
                            onChange={(e) => {
                              setLimit(Number(e.target.value));
                              setPage(1);
                            }}
                            className="rounded-xl px-3 py-3 bg-black/20 text-white border border-white/10 outline-none"
                          >
                            <option value={10} className="text-slate-900">
                              10
                            </option>
                            <option value={20} className="text-slate-900">
                              20
                            </option>
                            <option value={50} className="text-slate-900">
                              50
                            </option>
                          </select>

                          <button
                            onClick={() => setRefreshTick((t) => t + 1)}
                            type="button"
                            className={`${buttonSoftClass} px-3`}
                            title="Refrescar"
                          >
                            <FiRotateCw />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-[12px] text-white/75">
                      {loading ? (
                        'Cargando...'
                      ) : (
                        <>
                          Mostrando <b className="text-white">{from}</b>–
                          <b className="text-white">{to}</b> de{' '}
                          <b className="text-white">{total}</b> registros
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <main className="mt-6">
                {err && (
                  <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-red-300 shadow">
                    {err}
                  </div>
                )}

                {loading && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-[24px] overflow-hidden ${shellClass}`}
                      >
                        <div className="h-10 bg-white/10 animate-pulse" />
                        <div className="p-4 space-y-3">
                          <div className="h-4 bg-white/10 animate-pulse rounded" />
                          <div className="h-4 w-1/2 bg-white/10 animate-pulse rounded" />
                          <div className="h-20 bg-white/10 animate-pulse rounded-2xl" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && rows.length === 0 && (
                  <div
                    className={`rounded-[28px] ${shellClass} p-10 text-center`}
                  >
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#ff98a5]">
                      <FiBarChart2 size={24} />
                    </div>
                    <p className="mt-5 text-lg font-semibold text-white">
                      No hay registros para los filtros aplicados
                    </p>
                    <p className="mt-2 text-sm text-white/55">
                      Ajustá la búsqueda o el rango de fechas para volver a
                      intentar.
                    </p>
                  </div>
                )}

                {!loading && rows.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence>
                      {rows.map((r) => {
                        const color = getColorHex(r?.bloque?.color_id);

                        return (
                          <motion.article
                            key={r.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className="rounded-[24px] border border-white/10 bg-[#0d0d0e]/95 shadow-[0_18px_55px_-28px_rgba(0,0,0,0.6)] overflow-hidden"
                          >
                            <div
                              className="px-4 py-3 text-xs text-white/80 flex items-center justify-between"
                              style={{
                                background: `linear-gradient(90deg, ${color}55 0%, rgba(0,0,0,0) 85%)`
                              }}
                            >
                              <div className="truncate">
                                <span className="font-semibold text-white">
                                  {r.rutina?.nombre
                                    ? r.rutina.nombre
                                    : 'Rutina'}
                                </span>
                                <span className="mx-1 text-white/35">·</span>
                                <span className="tabular-nums text-white/70">
                                  Fecha de carga: {formatDdMmYyyySmart(r.fecha)}
                                </span>
                              </div>
                              <span className="text-[11px] text-white/45">
                                ID #{r.id}
                              </span>
                            </div>

                            <div className="p-4">
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span
                                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border"
                                  style={{
                                    backgroundColor: `${color}20`,
                                    borderColor: `${color}40`,
                                    color: '#ffffff'
                                  }}
                                >
                                  <FiGrid className="text-[12px]" />
                                  {r.bloque?.nombre || 'Bloque'}
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/80">
                                  <FiActivity className="text-[12px]" />
                                  {r.ejercicio?.nombre || 'Ejercicio'}
                                </span>

                                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/80">
                                  <FiHash className="text-[12px]" />
                                  Serie {r.serie?.numero_serie ?? '—'}
                                </span>
                              </div>

                              <div className="flex items-baseline justify-between gap-4">
                                <div className="text-3xl font-black tracking-tight text-white">
                                  {r.peso != null
                                    ? `${Number(r.peso).toFixed(2)} kg`
                                    : '— kg'}
                                </div>
                                <div className="text-xs text-white/45">
                                  {fmtDate(r.fecha)}
                                </div>
                              </div>

                              {r.observaciones && (
                                <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                  <p className="text-[11px] uppercase tracking-[0.16em] text-white/40 mb-2">
                                    Observaciones
                                  </p>
                                  <p className="text-sm text-white/68 italic line-clamp-3">
                                    {r.observaciones}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.article>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}

                {!loading && total > 0 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-white/75">
                      Mostrando <b className="text-white">{from}</b>–
                      <b className="text-white">{to}</b> de{' '}
                      <b className="text-white">{total}</b>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white disabled:opacity-40"
                        onClick={() => setPage(1)}
                        disabled={page <= 1}
                        type="button"
                      >
                        « Primera
                      </button>

                      <button
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white disabled:opacity-40"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        type="button"
                      >
                        <FiChevronLeft className="inline -mt-0.5" /> Anterior
                      </button>

                      <div className="text-sm text-white/80 px-2">
                        Página <b className="text-white">{page}</b> /{' '}
                        {totalPages}
                      </div>

                      <button
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white disabled:opacity-40"
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page >= totalPages}
                        type="button"
                      >
                        Siguiente <FiChevronRight className="inline -mt-0.5" />
                      </button>

                      <button
                        className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white disabled:opacity-40"
                        onClick={() => setPage(totalPages)}
                        disabled={page >= totalPages}
                        type="button"
                      >
                        Última »
                      </button>
                    </div>
                  </div>
                )}
              </main>
            </>
          )}
        </div>
      </div>
    </>
  );
}
