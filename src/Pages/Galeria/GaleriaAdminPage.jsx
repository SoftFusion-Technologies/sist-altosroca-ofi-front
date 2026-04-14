import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AnimatePresence, motion } from 'framer-motion';
import NavbarStaff from '../staff/NavbarStaff.jsx';
import ParticlesBackground from '../../components/ParticlesBackground.jsx';
import {
  FaImages,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArchive,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaSyncAlt,
  FaSearch,
  FaUserGraduate,
  FaIdCard,
  FaCalendarAlt,
  FaLayerGroup,
  FaCheck,
  FaTimes
} from 'react-icons/fa';

/*
 * Programador: Benjamin Orellana
 * Fecha Actualización: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Pantalla staff para moderación de publicaciones de galería de alumnos.
 * Permite listar, buscar, filtrar, visualizar, aprobar, rechazar y archivar.
 *
 * Tema: Galería de alumnos - Staff
 * Capa: Frontend
 */

const BASE_URL = 'http://localhost:8080';
const PAGE_SIZE = 12;

const ESTADO_STYLES = {
  pendiente: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
  aprobado: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
  rechazado: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  archivado: 'border-slate-400/30 bg-slate-500/10 text-slate-200'
};

const ESTADO_LABELS = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  archivado: 'Archivado'
};

const ESTADO_ICONS = {
  pendiente: FaClock,
  aprobado: FaCheckCircle,
  rechazado: FaTimesCircle,
  archivado: FaArchive
};

/* Benjamin Orellana - 2026/04/14 - Formatea fechas de forma segura para la UI staff. */
const formatDate = (value) => {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/* Benjamin Orellana - 2026/04/14 - Tarjeta KPI para métricas principales del módulo. */
function KpiCard({ label, value, icon: Icon, accentClass }) {
  return (
    <div className="rounded-[26px] border border-white/10 bg-white/[0.06] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.30)] backdrop-blur-xl">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-[16px] border ${accentClass}`}
      >
        <Icon />
      </div>

      <div className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
        {label}
      </div>

      <div className="mt-1 text-3xl font-black text-white">{value}</div>
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Badge de estado reutilizable para cards y modal. */
function EstadoBadge({ estado }) {
  const EstadoIcon = ESTADO_ICONS[estado] || FaClock;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${ESTADO_STYLES[estado] || ESTADO_STYLES.pendiente}`}
    >
      <EstadoIcon className="text-[10px]" />
      {ESTADO_LABELS[estado] || estado}
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Preview compacto por card para publicaciones con uno o varios medios. */
function MediaCardPreview({
  media,
  currentIndex,
  total,
  onPrev,
  onNext,
  onOpenViewer
}) {
  if (!media) {
    return (
      <div className="flex h-56 items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-sm text-white/45 md:h-64">
        Sin archivos
      </div>
    );
  }

  const hasMultiple = total > 1;

  return (
    <div className="relative h-56 overflow-hidden rounded-[24px] border border-white/10 bg-[#050505] md:h-64">
      {media.tipo_archivo === 'video' ? (
        <video
          src={media.archivo_url}
          className="h-full w-full object-contain"
          controls
        />
      ) : (
        <img
          src={media.thumbnail_url || media.archivo_url}
          alt="Preview galería"
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

      {hasMultiple ? (
        <>
          <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {currentIndex + 1} / {total}
          </div>

          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/45 p-2 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/75"
          >
            <FaChevronLeft />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/45 p-2 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/75"
          >
            <FaChevronRight />
          </button>
        </>
      ) : null}

      <button
        type="button"
        onClick={onOpenViewer}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/80"
      >
        <FaEye />
        Ver
      </button>
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Modal principal de revisión de publicaciones con acciones staff. */
function GalleryReviewModal({
  open,
  post,
  media,
  currentIndex = 0,
  total = 0,
  onClose,
  onPrev,
  onNext,
  onApprove,
  onReject,
  onArchive,
  actionLoading
}) {
  if (!open || !post || !media) return null;

  const hasMultiple = total > 1;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 px-3 py-6 backdrop-blur-md md:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0"
          onClick={onClose}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.985 }}
          className="relative z-10 w-full max-w-7xl overflow-hidden rounded-[34px] border border-red-500/20 bg-[#08080c]/95 shadow-[0_30px_120px_rgba(0,0,0,.45)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
            <div className="min-w-0">
              <div className="mb-2">
                <EstadoBadge estado={post.estado} />
              </div>

              <h3 className="truncate text-xl font-black uppercase tracking-wide text-white md:text-3xl">
                {post.titulo || 'Publicación sin título'}
              </h3>

              <p className="mt-1 text-sm text-white/55">
                {hasMultiple
                  ? `${currentIndex + 1} de ${total}`
                  : 'Vista completa'}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/80 transition hover:bg-white/10"
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr)_380px]">
            <div className="relative flex min-h-[56vh] items-center justify-center bg-[#030303] p-4 md:min-h-[72vh] md:p-6">
              {hasMultiple ? (
                <>
                  <button
                    type="button"
                    onClick={onPrev}
                    className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-3 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/75 md:left-5"
                  >
                    <FaChevronLeft />
                  </button>

                  <button
                    type="button"
                    onClick={onNext}
                    className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-3 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/75 md:right-5"
                  >
                    <FaChevronRight />
                  </button>
                </>
              ) : null}

              <div className="flex max-h-[70vh] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] p-2 md:p-4">
                {media.tipo_archivo === 'video' ? (
                  <video
                    src={media.archivo_url}
                    controls
                    className="max-h-[66vh] w-full rounded-[20px] object-contain"
                  />
                ) : (
                  <img
                    src={media.archivo_url}
                    alt="Vista ampliada galería"
                    className="max-h-[66vh] w-full rounded-[20px] object-contain"
                  />
                )}
              </div>
            </div>

            <div className="border-l border-white/10 bg-white/[0.03] p-5 md:p-6">
              <div className="space-y-5">
                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                    Alumno
                  </div>

                  <div className="space-y-3 text-sm text-white/75">
                    <div className="flex items-center gap-3">
                      <FaUserGraduate className="text-red-300" />
                      <span className="font-semibold text-white">
                        {post.student?.nomyape || 'Sin alumno'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaIdCard className="text-red-300" />
                      <span>DNI: {post.student?.dni || 'No disponible'}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-red-300" />
                      <span>Creado: {formatDate(post.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaLayerGroup className="text-red-300" />
                      <span>
                        {total} archivo{total !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                    Publicación
                  </div>

                  <div className="space-y-3 text-sm text-white/75">
                    <div>
                      <span className="text-white/45">Template:</span>{' '}
                      <span className="text-white">{post.template_codigo}</span>
                    </div>

                    <div>
                      <span className="text-white/45">Mostrar nombre:</span>{' '}
                      <span className="text-white">
                        {post.mostrar_nombre ? 'Sí' : 'No'}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/45">Consentimiento:</span>{' '}
                      <span
                        className={
                          post.consentimiento_publico
                            ? 'text-emerald-300'
                            : 'text-rose-300'
                        }
                      >
                        {post.consentimiento_publico ? 'Aprobado' : 'Faltante'}
                      </span>
                    </div>

                    <div>
                      <span className="text-white/45">Canal:</span>{' '}
                      <span className="text-white">
                        {post.canal_carga || 'No definido'}
                      </span>
                    </div>
                  </div>
                </div>

                {post.descripcion ? (
                  <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                      Descripción
                    </div>

                    <p className="text-sm leading-relaxed text-white/70">
                      {post.descripcion}
                    </p>
                  </div>
                ) : null}

                {post.motivo_rechazo ? (
                  <div className="rounded-[24px] border border-rose-400/20 bg-rose-500/10 p-4">
                    <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200/90">
                      Motivo de rechazo
                    </div>

                    <p className="text-sm leading-relaxed text-rose-100/80">
                      {post.motivo_rechazo}
                    </p>
                  </div>
                ) : null}

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={onApprove}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/12 px-4 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-500/18 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaCheck />
                    Aprobar publicación
                  </button>

                  <button
                    type="button"
                    onClick={onReject}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaTimes />
                    Rechazar publicación
                  </button>

                  <button
                    type="button"
                    onClick={onArchive}
                    disabled={actionLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-400/20 bg-slate-500/12 px-4 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-500/18 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FaArchive />
                    Archivar publicación
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* Benjamin Orellana - 2026/04/14 - Paginación simple y consistente con el módulo staff. */
function Pagination({ page, totalPages, onPrev, onNext, onGo }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);

  for (let i = start; i <= end; i += 1) {
    pages.push(i);
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Anterior
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onGo(pageNumber)}
          className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
            pageNumber === page
              ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
              : 'border border-white/10 bg-white/5 text-white/85 hover:bg-white/10'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
      >
        Siguiente
      </button>
    </div>
  );
}

const GaleriaAdminPage = () => {
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    pendiente: 0,
    aprobado: 0,
    rechazado: 0,
    archivado: 0
  });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [q, setQ] = useState('');
  const [debouncedQ, setDebouncedQ] = useState('');
  const [estado, setEstado] = useState('todos');

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [mediaIndexes, setMediaIndexes] = useState({});
  const [viewerPostId, setViewerPostId] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [q]);

  /* Benjamin Orellana - 2026/04/14 - Carga KPIs globales por estado usando el total devuelto por el backend. */
  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      const [pendientesRes, aprobadasRes, rechazadasRes, archivadasRes] =
        await Promise.all([
          axios.get(`${BASE_URL}/student-gallery-posts`, {
            params: { estado: 'pendiente', page: 1, limit: 1 }
          }),
          axios.get(`${BASE_URL}/student-gallery-posts`, {
            params: { estado: 'aprobado', page: 1, limit: 1 }
          }),
          axios.get(`${BASE_URL}/student-gallery-posts`, {
            params: { estado: 'rechazado', page: 1, limit: 1 }
          }),
          axios.get(`${BASE_URL}/student-gallery-posts`, {
            params: { estado: 'archivado', page: 1, limit: 1 }
          })
        ]);

      setStats({
        pendiente: pendientesRes.data?.total || 0,
        aprobado: aprobadasRes.data?.total || 0,
        rechazado: rechazadasRes.data?.total || 0,
        archivado: archivadasRes.data?.total || 0
      });
    } catch (error) {
      console.error('Error al cargar KPIs de galería:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  /* Benjamin Orellana - 2026/04/14 - Carga publicaciones según filtros activos y paginación. */
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: PAGE_SIZE
      };

      if (debouncedQ) params.q = debouncedQ;
      if (estado !== 'todos') params.estado = estado;

      const res = await axios.get(`${BASE_URL}/student-gallery-posts`, {
        params
      });

      setPosts(Array.isArray(res.data?.rows) ? res.data.rows : []);
      setTotal(res.data?.total || 0);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      console.error('Error al cargar publicaciones de galería:', error);
      Swal.fire({
        icon: 'error',
        title: 'No se pudo cargar la galería',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un problema al obtener las publicaciones.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, estado, debouncedQ]);

  /* Benjamin Orellana - 2026/04/14 - Refresca listado y KPIs tras acciones del staff. */
  const refreshAll = async () => {
    await Promise.all([fetchPosts(), fetchStats()]);
  };

  const totalGeneral = useMemo(
    () => stats.pendiente + stats.aprobado + stats.rechazado + stats.archivado,
    [stats]
  );

  const viewerPost = useMemo(
    () => posts.find((item) => item.id === viewerPostId) || null,
    [posts, viewerPostId]
  );

  const viewerMediaList = useMemo(
    () => (viewerPost ? viewerPost.media || [] : []),
    [viewerPost]
  );

  const viewerCurrentIndex = useMemo(() => {
    if (!viewerPostId) return 0;
    return mediaIndexes[viewerPostId] || 0;
  }, [mediaIndexes, viewerPostId]);

  const viewerCurrentMedia = useMemo(() => {
    if (!viewerMediaList.length) return null;
    return viewerMediaList[viewerCurrentIndex] || viewerMediaList[0] || null;
  }, [viewerMediaList, viewerCurrentIndex]);

  /* Benjamin Orellana - 2026/04/14 - Desplaza el índice de imagen dentro de una publicación. */
  const shiftMedia = (postId, direction, totalItems) => {
    if (!totalItems || totalItems <= 1) return;

    setMediaIndexes((prev) => {
      const current = prev[postId] || 0;
      const next =
        direction === 'next'
          ? (current + 1) % totalItems
          : (current - 1 + totalItems) % totalItems;

      return {
        ...prev,
        [postId]: next
      };
    });
  };

  /* Benjamin Orellana - 2026/04/14 - Acción de aprobación staff con refresco posterior. */
  const handleApprove = async (post) => {
    const result = await Swal.fire({
      title: '¿Aprobar publicación?',
      text: 'La publicación quedará habilitada para mostrarse en la web según su configuración.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aprobar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#475569',
      background: '#0b0b0f',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(true);

      await axios.put(`${BASE_URL}/student-gallery-posts/${post.id}/aprobar`);

      Swal.fire({
        icon: 'success',
        title: 'Publicación aprobada',
        confirmButtonColor: '#16a34a',
        background: '#0b0b0f',
        color: '#fff'
      });

      await refreshAll();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo aprobar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un problema al aprobar la publicación.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* Benjamin Orellana - 2026/04/14 - Acción de rechazo staff con motivo obligatorio. */
  const handleReject = async (post) => {
    const result = await Swal.fire({
      title: 'Rechazar publicación',
      input: 'textarea',
      inputLabel: 'Motivo del rechazo',
      inputPlaceholder: 'Indicá por qué se rechaza esta publicación...',
      inputAttributes: {
        'aria-label': 'Motivo del rechazo'
      },
      showCancelButton: true,
      confirmButtonText: 'Rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      background: '#0b0b0f',
      color: '#fff',
      preConfirm: (value) => {
        if (!value || !String(value).trim()) {
          Swal.showValidationMessage('Debés indicar un motivo de rechazo.');
        }
        return value;
      }
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(true);

      await axios.put(`${BASE_URL}/student-gallery-posts/${post.id}/rechazar`, {
        motivo_rechazo: result.value
      });

      Swal.fire({
        icon: 'success',
        title: 'Publicación rechazada',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });

      await refreshAll();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo rechazar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un problema al rechazar la publicación.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
    } finally {
      setActionLoading(false);
    }
  };

  /* Benjamin Orellana - 2026/04/14 - Acción de archivado staff. */
  const handleArchive = async (post) => {
    const result = await Swal.fire({
      title: '¿Archivar publicación?',
      text: 'La publicación saldrá del circuito operativo y dejará de mostrarse en home.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#475569',
      cancelButtonColor: '#6b7280',
      background: '#0b0b0f',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      setActionLoading(true);

      await axios.put(`${BASE_URL}/student-gallery-posts/${post.id}/archivar`);

      Swal.fire({
        icon: 'success',
        title: 'Publicación archivada',
        confirmButtonColor: '#475569',
        background: '#0b0b0f',
        color: '#fff'
      });

      await refreshAll();

      if (viewerPostId === post.id) {
        setViewerPostId(null);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo archivar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un problema al archivar la publicación.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <NavbarStaff />

      <section className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
        <ParticlesBackground />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.18),transparent_24%),linear-gradient(180deg,#080808_0%,#101014_48%,#070707_100%)]" />
        <div className="pointer-events-none absolute left-[10%] top-20 h-72 w-72 rounded-full bg-red-600/12 blur-3xl" />
        <div className="pointer-events-none absolute right-[6%] top-[25%] h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '42px 42px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 sm:pt-32 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="max-w-3xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
                  <FaImages />
                  Moderación de galería
                </div>

                <h1 className="titulo text-4xl uppercase text-white md:text-5xl">
                  Galería de alumnos
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-white/65 md:text-base">
                  Revisá publicaciones subidas por alumnos, verificá su
                  contenido y decidí si pasan a la web pública o quedan
                  rechazadas o archivadas.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshAll}
                disabled={loading || statsLoading || actionLoading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/85 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaSyncAlt />
                Actualizar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <KpiCard
                label="Pendientes"
                value={statsLoading ? '...' : stats.pendiente}
                icon={FaClock}
                accentClass="border-amber-400/20 bg-amber-500/10 text-amber-300"
              />

              <KpiCard
                label="Aprobadas"
                value={statsLoading ? '...' : stats.aprobado}
                icon={FaCheckCircle}
                accentClass="border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
              />

              <KpiCard
                label="Rechazadas"
                value={statsLoading ? '...' : stats.rechazado}
                icon={FaTimesCircle}
                accentClass="border-rose-400/20 bg-rose-500/10 text-rose-300"
              />

              <KpiCard
                label="Total"
                value={statsLoading ? '...' : totalGeneral}
                icon={FaImages}
                accentClass="border-red-400/20 bg-red-500/10 text-red-300"
              />
            </div>

            <div className="mt-8 rounded-[30px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_48px_rgba(0,0,0,0.30)] backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                <div className="relative">
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Buscar por alumno, DNI, título o descripción..."
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-white/30 focus:border-red-500/35 focus:bg-white/[0.08]"
                  />
                </div>

                <select
                  value={estado}
                  onChange={(e) => {
                    setEstado(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500/35 focus:bg-white/[0.08]"
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="aprobado">Aprobadas</option>
                  <option value="rechazado">Rechazadas</option>
                  <option value="archivado">Archivadas</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-[30px] border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="mb-4 h-56 rounded-[24px] bg-white/10 md:h-64" />
                      <div className="mb-3 h-5 w-2/3 rounded bg-white/10" />
                      <div className="mb-2 h-4 w-full rounded bg-white/10" />
                      <div className="h-4 w-1/2 rounded bg-white/10" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-[30px] border border-dashed border-white/15 bg-white/[0.03] px-6 py-14 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-300">
                    <FaImages />
                  </div>

                  <h4 className="text-xl font-bold text-white">
                    No hay publicaciones para mostrar
                  </h4>

                  <p className="mx-auto mt-3 max-w-xl text-white/60">
                    Ajustá los filtros o esperá nuevas publicaciones de alumnos
                    para moderar.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                    <AnimatePresence>
                      {posts.map((post) => {
                        const medias = Array.isArray(post.media)
                          ? post.media
                          : [];
                        const currentIndex = mediaIndexes[post.id] || 0;
                        const currentMedia =
                          medias[currentIndex] || medias[0] || null;

                        return (
                          <motion.article
                            key={post.id}
                            layout
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -18 }}
                            className="group overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4 shadow-[0_14px_40px_rgba(0,0,0,.25)] transition duration-300 hover:-translate-y-1 hover:border-red-500/20"
                          >
                            <MediaCardPreview
                              media={currentMedia}
                              currentIndex={currentIndex}
                              total={medias.length}
                              onPrev={() =>
                                shiftMedia(post.id, 'prev', medias.length)
                              }
                              onNext={() =>
                                shiftMedia(post.id, 'next', medias.length)
                              }
                              onOpenViewer={() => setViewerPostId(post.id)}
                            />

                            <div className="mt-4 flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <h3 className="line-clamp-1 text-lg font-bold uppercase tracking-wide text-white">
                                  {post.titulo || 'Publicación sin título'}
                                </h3>

                                <p className="mt-1 text-sm text-white/55">
                                  {medias.length} archivo
                                  {medias.length !== 1 ? 's' : ''}
                                </p>
                              </div>

                              <EstadoBadge estado={post.estado} />
                            </div>

                            <div className="mt-4 space-y-2 text-sm text-white/70">
                              <div className="flex items-center gap-2">
                                <FaUserGraduate className="text-red-300" />
                                <span className="line-clamp-1">
                                  {post.student?.nomyape || 'Sin alumno'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <FaIdCard className="text-red-300" />
                                <span>
                                  DNI: {post.student?.dni || 'No disponible'}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-red-300" />
                                <span>{formatDate(post.created_at)}</span>
                              </div>
                            </div>

                            {post.descripcion ? (
                              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/65">
                                {post.descripcion}
                              </p>
                            ) : null}

                            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                                Template: {post.template_codigo}
                              </span>

                              {post.consentimiento_publico ? (
                                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                                  Consentimiento ok
                                </span>
                              ) : (
                                <span className="rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-1 text-rose-200">
                                  Falta consentimiento
                                </span>
                              )}
                            </div>

                            {medias.length > 1 ? (
                              <div className="mt-4 flex items-center justify-center gap-2">
                                {medias.map((_, index) => (
                                  <button
                                    key={`${post.id}-dot-${index}`}
                                    type="button"
                                    onClick={() =>
                                      setMediaIndexes((prev) => ({
                                        ...prev,
                                        [post.id]: index
                                      }))
                                    }
                                    className={`h-2.5 rounded-full transition-all ${
                                      index === currentIndex
                                        ? 'w-8 bg-red-500'
                                        : 'w-2.5 bg-white/25 hover:bg-white/45'
                                    }`}
                                    aria-label={`Ver archivo ${index + 1}`}
                                  />
                                ))}
                              </div>
                            ) : null}

                            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => setViewerPostId(post.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                              >
                                <FaEye />
                                Ver publicación
                              </button>

                              <button
                                type="button"
                                onClick={() => handleApprove(post)}
                                disabled={actionLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/12 px-4 py-2.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/18 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaCheck />
                                Aprobar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReject(post)}
                                disabled={actionLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-400/20 bg-rose-500/12 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/18 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaTimes />
                                Rechazar
                              </button>

                              <button
                                type="button"
                                onClick={() => handleArchive(post)}
                                disabled={actionLoading}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-400/20 bg-slate-500/12 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-500/18 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <FaArchive />
                                Archivar
                              </button>
                            </div>
                          </motion.article>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
                    onNext={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    onGo={(pageNumber) => setPage(pageNumber)}
                  />

                  <div className="mt-4 text-center text-sm text-white/45">
                    Mostrando {posts.length} publicación
                    {posts.length !== 1 ? 'es' : ''} de {total}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <GalleryReviewModal
        open={!!viewerPostId}
        post={viewerPost}
        media={viewerCurrentMedia}
        currentIndex={viewerCurrentIndex}
        total={viewerMediaList.length}
        actionLoading={actionLoading}
        onClose={() => setViewerPostId(null)}
        onPrev={() => {
          if (viewerPostId && viewerMediaList.length > 1) {
            shiftMedia(viewerPostId, 'prev', viewerMediaList.length);
          }
        }}
        onNext={() => {
          if (viewerPostId && viewerMediaList.length > 1) {
            shiftMedia(viewerPostId, 'next', viewerMediaList.length);
          }
        }}
        onApprove={() => {
          if (viewerPost) handleApprove(viewerPost);
        }}
        onReject={() => {
          if (viewerPost) handleReject(viewerPost);
        }}
        onArchive={() => {
          if (viewerPost) handleArchive(viewerPost);
        }}
      />
    </>
  );
};

export default GaleriaAdminPage;
