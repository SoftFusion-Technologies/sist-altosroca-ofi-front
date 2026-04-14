import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaImages,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaArchive,
  FaSyncAlt,
  FaLock,
  FaEye,
  FaTimes
} from 'react-icons/fa';
import StudentGalleryPostModal from './StudentGalleryPostModal';

/* Benjamin Orellana - 2026/04/14 - Gestor frontend de publicaciones de galería para el perfil del alumno con visor ampliado y cards compactas. */
const BASE_URL = 'http://localhost:8080';

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

/* Benjamin Orellana - 2026/04/14 - Tarjeta KPI compacta para métricas rápidas del módulo. */
function StatCard({ label, value, accentClass = 'text-white' }) {
  return (
    <div className="min-w-[120px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,.15)] backdrop-blur-md">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
        {label}
      </div>
      <div className={`mt-1 text-xl font-black ${accentClass}`}>{value}</div>
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Badge visual para estado del post. */
function EstadoBadge({ estado }) {
  const EstadoIcon = ESTADO_ICONS[estado] || FaClock;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${ESTADO_STYLES[estado] || ESTADO_STYLES.pendiente}`}
    >
      <EstadoIcon className="text-xs" />
      {ESTADO_LABELS[estado] || estado}
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Preview compacto para la card del post con mejor encuadre y acceso al visor ampliado. */
function MediaPreview({
  media,
  onPrev,
  onNext,
  hasMultiple,
  currentIndex = 0,
  total = 0,
  onOpenViewer
}) {
  if (!media) {
    return (
      <div className="flex h-56 items-center justify-center rounded-[24px] border border-white/10 bg-white/5 text-sm text-white/50 md:h-64">
        Sin imagen
      </div>
    );
  }

  return (
    <div className="relative h-56 overflow-hidden rounded-[24px] border border-white/10 bg-[#050505] md:h-64">
      {media.tipo_archivo === 'video' ? (
        <video
          src={media.archivo_url}
          controls
          className="h-full w-full object-contain"
        />
      ) : (
        <img
          src={media.thumbnail_url || media.archivo_url}
          alt="Galería alumno"
          className="h-full w-full object-contain transition-transform duration-300 hover:scale-[1.02]"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />

      {hasMultiple && (
        <>
          <div className="absolute left-3 top-3 z-10 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            {currentIndex + 1} / {total}
          </div>

          <button
            type="button"
            onClick={onPrev}
            className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/45 p-2 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/70"
          >
            <FaChevronLeft />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-black/45 p-2 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/70"
          >
            <FaChevronRight />
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onOpenViewer}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/80"
      >
        <FaEye />
        Ver imagen
      </button>
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Visor ampliado para imágenes y videos con fondo difuminado. */
function GalleryViewerModal({
  open,
  post,
  media,
  currentIndex = 0,
  total = 0,
  onClose,
  onPrev,
  onNext
}) {
  if (!open || !post || !media) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 px-3 py-6 backdrop-blur-md md:px-8"
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
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.985 }}
          className="relative z-10 w-full max-w-6xl overflow-hidden rounded-[34px] border border-red-500/20 bg-[#08080c]/95 shadow-[0_30px_120px_rgba(0,0,0,.45)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-4 md:px-6">
            <div className="min-w-0">
              <h4 className="truncate text-lg font-black uppercase tracking-wide text-white md:text-2xl">
                {post.titulo || 'Publicación sin título'}
              </h4>
              <p className="mt-1 text-sm text-white/55">
                {total > 0
                  ? `${currentIndex + 1} de ${total}`
                  : 'Vista ampliada'}
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

          <div className="relative flex min-h-[60vh] items-center justify-center bg-[#030303] p-4 md:min-h-[78vh] md:p-6">
            {total > 1 && (
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
            )}

            <div className="flex max-h-[75vh] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] p-2 md:p-4">
              {media.tipo_archivo === 'video' ? (
                <video
                  src={media.archivo_url}
                  controls
                  className="max-h-[70vh] w-full rounded-[20px] object-contain"
                />
              ) : (
                <img
                  src={media.archivo_url}
                  alt="Vista ampliada galería"
                  className="max-h-[70vh] w-full rounded-[20px] object-contain"
                />
              )}
            </div>
          </div>

          {post.descripcion ? (
            <div className="border-t border-white/10 px-4 py-4 text-sm text-white/70 md:px-6">
              {post.descripcion}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function StudentGalleryManager({ studentId, userLevel }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [mediaIndexes, setMediaIndexes] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewerPostId, setViewerPostId] = useState(null);

  /* Benjamin Orellana - 2026/04/14 - Carga los posts del alumno con medios incluidos. */
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${BASE_URL}/student-gallery-posts`, {
        params: {
          student_id: studentId,
          limit: 100
        }
      });

      setPosts(Array.isArray(res.data?.rows) ? res.data.rows : []);
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
    if (!studentId) return;
    fetchPosts();
  }, [studentId, refreshKey]);

  const stats = useMemo(() => {
    return {
      total: posts.length,
      pendientes: posts.filter((item) => item.estado === 'pendiente').length,
      aprobadas: posts.filter((item) => item.estado === 'aprobado').length
    };
  }, [posts]);

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

  /* Benjamin Orellana - 2026/04/14 - Permite editar solo posts aún no aprobados para respetar la moderación actual del backend. */
  const canEditPost = (post) => {
    if (userLevel === 'admin' || userLevel === 'instructor') return true;
    return post.estado !== 'aprobado';
  };

  const handleDeletePost = async (post) => {
    const result = await Swal.fire({
      title: '¿Eliminar publicación?',
      text: 'Se eliminará el post y también sus imágenes asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#475569',
      background: '#0b0b0f',
      color: '#fff'
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${BASE_URL}/student-gallery-posts/${post.id}`);

      Swal.fire({
        icon: 'success',
        title: 'Publicación eliminada',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });

      if (viewerPostId === post.id) {
        setViewerPostId(null);
      }

      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text:
          error?.response?.data?.mensajeError ||
          'Ocurrió un problema al eliminar la publicación.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
    }
  };

  /* Benjamin Orellana - 2026/04/14 - Desplaza el carrusel interno por publicación. */
  const shiftMedia = (postId, direction, total) => {
    if (!total || total <= 1) return;

    setMediaIndexes((prev) => {
      const current = prev[postId] || 0;
      const next =
        direction === 'next'
          ? (current + 1) % total
          : (current - 1 + total) % total;

      return {
        ...prev,
        [postId]: next
      };
    });
  };

  return (
    <>
      <section className="mt-10 rounded-[34px] border border-red-500/15 bg-gradient-to-br from-[#070709] via-[#0d0d11] to-[#121217] p-5 shadow-[0_20px_80px_rgba(0,0,0,.35)] backdrop-blur-xl md:p-7">
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-red-300">
              <FaImages />
              Mi galería Altos Roca
            </div>

            <h3 className="text-2xl font-black uppercase tracking-wide text-white md:text-3xl">
              Tus publicaciones
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-white/65 md:text-base">
              Subí tus fotos del entrenamiento, administrá tus posts y seguí el
              estado de aprobación antes de que aparezcan en la web.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <StatCard label="Total" value={stats.total} />
            <StatCard
              label="Pendientes"
              value={stats.pendientes}
              accentClass="text-amber-300"
            />
            <StatCard
              label="Aprobadas"
              value={stats.aprobadas}
              accentClass="text-emerald-300"
            />

            <button
              type="button"
              onClick={() => {
                setEditingPost(null);
                setOpenModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-5 py-3 font-semibold text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5 hover:shadow-red-800/40"
            >
              <FaPlus />
              Subir a galería
            </button>

            <button
              type="button"
              onClick={() => setRefreshKey((prev) => prev + 1)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white/85 transition hover:bg-white/10"
            >
              <FaSyncAlt />
              Actualizar
            </button>
          </div>
        </div>

        <div className="mb-7 rounded-[28px] border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/65">
          Las publicaciones aprobadas quedan bloqueadas para edición desde el
          alumno para no romper la moderación visual actual. Si querés permitir
          edición sobre aprobadas, te conviene que backend las regrese
          automáticamente a
          <span className="mx-1 font-semibold text-amber-300">pendiente</span>
          cuando el alumno las modifica.
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
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
              Todavía no tenés publicaciones
            </h4>
            <p className="mx-auto mt-3 max-w-xl text-white/60">
              Subí tus fotos del entrenamiento y dejalas listas para revisión
              del staff.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
            <AnimatePresence>
              {posts.map((post) => {
                const medias = Array.isArray(post.media) ? post.media : [];
                const currentIndex = mediaIndexes[post.id] || 0;
                const currentMedia = medias[currentIndex] || medias[0] || null;

                return (
                  <motion.article
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    className="group overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] p-4 shadow-[0_14px_40px_rgba(0,0,0,.25)] transition duration-300 hover:-translate-y-1 hover:border-red-500/20"
                  >
                    <MediaPreview
                      media={currentMedia}
                      hasMultiple={medias.length > 1}
                      currentIndex={currentIndex}
                      total={medias.length}
                      onPrev={() => shiftMedia(post.id, 'prev', medias.length)}
                      onNext={() => shiftMedia(post.id, 'next', medias.length)}
                      onOpenViewer={() => setViewerPostId(post.id)}
                    />

                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="line-clamp-1 text-lg font-bold uppercase tracking-wide text-white">
                          {post.titulo || 'Publicación sin título'}
                        </h4>
                        <p className="mt-1 text-sm text-white/55">
                          {medias.length} archivo
                          {medias.length !== 1 ? 's' : ''}
                        </p>
                      </div>

                      <EstadoBadge estado={post.estado} />
                    </div>

                    {post.descripcion && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70">
                        {post.descripcion}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                        Template: {post.template_codigo}
                      </span>

                      {post.mostrar_nombre ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70">
                          Muestra nombre
                        </span>
                      ) : null}

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

                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setViewerPostId(post.id)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                      >
                        <FaEye />
                        Ver imagen
                      </button>

                      {canEditPost(post) ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPost(post);
                            setOpenModal(true);
                          }}
                          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                        >
                          <FaEdit />
                          Editar
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white/55">
                          <FaLock />
                          Aprobada y bloqueada
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeletePost(post)}
                        className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/15"
                      >
                        <FaTrash />
                        Eliminar
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </section>

      <StudentGalleryPostModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingPost(null);
        }}
        studentId={studentId}
        editingPost={editingPost}
        onSaved={() => {
          setOpenModal(false);
          setEditingPost(null);
          setRefreshKey((prev) => prev + 1);
        }}
      />

      <GalleryViewerModal
        open={!!viewerPostId}
        post={viewerPost}
        media={viewerCurrentMedia}
        currentIndex={viewerCurrentIndex}
        total={viewerMediaList.length}
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
      />
    </>
  );
}
