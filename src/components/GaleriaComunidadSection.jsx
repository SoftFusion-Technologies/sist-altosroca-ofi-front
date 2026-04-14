import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaImages,
  FaTimes
} from 'react-icons/fa';

/* Benjamin Orellana - 2026/04/14 - Sección pública premium para mostrar publicaciones aprobadas de la comunidad Altos Roca. */
const BASE_URL = 'http://localhost:8080';

const containerV = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

const itemV = {
  hidden: { opacity: 0, y: 20, scale: 0.985 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 110,
      damping: 16
    }
  }
};

/* Benjamin Orellana - 2026/04/14 - Preview reutilizable de medios para cards públicas. */
function PublicMediaPreview({
  media,
  currentIndex = 0,
  total = 0,
  onPrev,
  onNext,
  onOpen
}) {
  if (!media) {
    return (
      <div className="flex h-64 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 text-sm text-white/45">
        Sin imagen
      </div>
    );
  }

  const hasMultiple = total > 1;

  return (
    <div className="relative h-64 overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] md:h-72">
      {media.tipo_archivo === 'video' ? (
        <video
          src={media.archivo_url}
          controls
          className="h-full w-full object-contain"
        />
      ) : (
        <img
          src={media.thumbnail_url || media.archivo_url}
          alt="Comunidad Altos Roca"
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
        />
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

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
        onClick={onOpen}
        className="absolute bottom-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-black/80"
      >
        <FaEye />
        Ver
      </button>
    </div>
  );
}

/* Benjamin Orellana - 2026/04/14 - Modal público de visualización ampliada de publicaciones aprobadas. */
function PublicGalleryViewer({
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
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 px-3 py-6 backdrop-blur-md md:px-8"
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
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300">
                <FaImages />
                Comunidad Altos Roca
              </div>

              <h3 className="truncate text-xl font-black uppercase tracking-wide text-white md:text-3xl">
                {post.titulo || 'Publicación'}
              </h3>

              <p className="mt-1 text-sm text-white/55">
                {total > 1
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

          <div className="relative flex min-h-[58vh] items-center justify-center bg-[#030303] p-4 md:min-h-[76vh] md:p-6">
            {total > 1 ? (
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

            <div className="flex max-h-[74vh] w-full items-center justify-center overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] p-2 md:p-4">
              {media.tipo_archivo === 'video' ? (
                <video
                  src={media.archivo_url}
                  controls
                  className="max-h-[70vh] w-full rounded-[20px] object-contain"
                />
              ) : (
                <img
                  src={media.archivo_url}
                  alt="Vista ampliada comunidad"
                  className="max-h-[70vh] w-full rounded-[20px] object-contain"
                />
              )}
            </div>
          </div>

          {post.descripcion ? (
            <div className="border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-white/70 md:px-6">
              {post.descripcion}
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const GaleriaComunidadSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mediaIndexes, setMediaIndexes] = useState({});
  const [viewerPostId, setViewerPostId] = useState(null);

  /* Benjamin Orellana - 2026/04/14 - Carga publicaciones aprobadas para la sección pública de la home. */
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/student-gallery-posts/public/home`,
        {
          params: {
            limit: 8
          }
        }
      );

      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al cargar galería pública:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* Benjamin Orellana - 2026/04/14 - Desplaza índice de medios dentro de cada publicación pública. */
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

  if (!loading && posts.length === 0) return null;

  return (
    <>
      <section className="relative overflow-hidden bg-[#050505] py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_26%),linear-gradient(180deg,#060606_0%,#0a0a0b_46%,#040404_100%)]" />
        <div className="pointer-events-none absolute left-[8%] top-10 h-60 w-60 rounded-full bg-red-600/10 blur-3xl" />
        <div className="pointer-events-none absolute right-[6%] bottom-10 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
            backgroundSize: '42px 42px'
          }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerV}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <motion.div
              variants={itemV}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-white/5 px-4 py-2 backdrop-blur-md">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200/90">
                  Comunidad Altos Roca
                </span>
              </div>

              <h2 className="titulo mt-6 text-4xl uppercase text-white sm:text-5xl md:text-6xl">
                Historias reales
                <span className="block bg-gradient-to-r from-red-500 via-red-400 to-red-700 bg-clip-text text-transparent">
                  de quienes entrenan
                </span>
              </h2>

              <p className="mt-5 text-sm leading-relaxed text-white/68 sm:text-base md:text-lg">
                Mirá momentos, progresos y publicaciones de alumnos que forman
                parte del día a día en Altos Roca Gym.
              </p>
            </motion.div>

            {loading ? (
              <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-[30px] border border-white/10 bg-white/[0.04] p-4"
                  >
                    <div className="mb-4 h-64 rounded-[24px] bg-white/10 md:h-72" />
                    <div className="mb-3 h-5 w-2/3 rounded bg-white/10" />
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => {
                  const medias = Array.isArray(post.media) ? post.media : [];
                  const currentIndex = mediaIndexes[post.id] || 0;
                  const currentMedia =
                    medias[currentIndex] || medias[0] || null;

                  return (
                    <motion.article
                      key={post.id}
                      variants={itemV}
                      className={`group overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_18px_48px_rgba(0,0,0,0.30)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-red-500/24 hover:bg-white/[0.08] ${
                        index === 0 ? 'md:col-span-2 xl:col-span-2' : ''
                      }`}
                    >
                      <PublicMediaPreview
                        media={currentMedia}
                        currentIndex={currentIndex}
                        total={medias.length}
                        onPrev={() =>
                          shiftMedia(post.id, 'prev', medias.length)
                        }
                        onNext={() =>
                          shiftMedia(post.id, 'next', medias.length)
                        }
                        onOpen={() => setViewerPostId(post.id)}
                      />

                      <div className="mt-4 flex flex-col gap-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-xl font-black uppercase tracking-wide text-white">
                              {post.titulo || 'Comunidad Altos Roca'}
                            </h3>

                            {post.student?.nomyape && post.mostrar_nombre ? (
                              <p className="mt-1 text-sm text-white/58">
                                {post.student.nomyape}
                              </p>
                            ) : (
                              <p className="mt-1 text-sm text-white/40">
                                Publicación de la comunidad
                              </p>
                            )}
                          </div>

                          <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-200">
                            {medias.length} archivo
                            {medias.length !== 1 ? 's' : ''}
                          </div>
                        </div>

                        {post.descripcion ? (
                          <p className="line-clamp-3 text-sm leading-relaxed text-white/68 md:text-[15px]">
                            {post.descripcion}
                          </p>
                        ) : null}

                        {medias.length > 1 ? (
                          <div className="flex items-center gap-2">
                            {medias.map((_, dotIndex) => (
                              <button
                                key={`${post.id}-public-dot-${dotIndex}`}
                                type="button"
                                onClick={() =>
                                  setMediaIndexes((prev) => ({
                                    ...prev,
                                    [post.id]: dotIndex
                                  }))
                                }
                                className={`h-2.5 rounded-full transition-all ${
                                  dotIndex === currentIndex
                                    ? 'w-8 bg-red-500'
                                    : 'w-2.5 bg-white/25 hover:bg-white/45'
                                }`}
                                aria-label={`Ver imagen ${dotIndex + 1}`}
                              />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <PublicGalleryViewer
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
};

export default GaleriaComunidadSection;
