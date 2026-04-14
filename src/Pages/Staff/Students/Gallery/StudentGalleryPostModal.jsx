import React, { Fragment, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Dialog, Transition } from '@headlessui/react';
import {
  FaCloudUploadAlt,
  FaTrash,
  FaTimes,
  FaImage,
  FaCheckCircle
} from 'react-icons/fa';

/* Benjamin Orellana - 2026/04/14 - Modal de alta y edición de posts de galería con manejo de imágenes nuevas y existentes. */
const BASE_URL = 'http://localhost:8080';
const POSTS_ENDPOINT = `${BASE_URL}/student-gallery-posts`;
const MEDIA_ENDPOINT = `${BASE_URL}/student-gallery-media`;
const UPLOAD_ENDPOINT = `${BASE_URL}/student-gallery-media/upload`;

const DEFAULT_FORM = {
  titulo: '',
  descripcion: '',
  template_codigo: 'altos-roca-classic',
  mostrar_nombre: true,
  mostrar_fecha: true,
  mostrar_en_home: true,
  consentimiento_publico: true
};

export default function StudentGalleryPostModal({
  open,
  onClose,
  studentId,
  editingPost,
  onSaved
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [existingMedia, setExistingMedia] = useState([]);
  const [mediaToDelete, setMediaToDelete] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    if (!open) return;

    if (editingPost) {
      setForm({
        titulo: editingPost.titulo || '',
        descripcion: editingPost.descripcion || '',
        template_codigo: editingPost.template_codigo || 'altos-roca-classic',
        mostrar_nombre:
          editingPost.mostrar_nombre !== undefined
            ? !!editingPost.mostrar_nombre
            : true,
        mostrar_fecha:
          editingPost.mostrar_fecha !== undefined
            ? !!editingPost.mostrar_fecha
            : true,
        mostrar_en_home:
          editingPost.mostrar_en_home !== undefined
            ? !!editingPost.mostrar_en_home
            : true,
        consentimiento_publico:
          editingPost.consentimiento_publico !== undefined
            ? !!editingPost.consentimiento_publico
            : true
      });

      setExistingMedia(
        Array.isArray(editingPost.media) ? editingPost.media : []
      );
    } else {
      setForm(DEFAULT_FORM);
      setExistingMedia([]);
    }

    setMediaToDelete([]);
    setNewFiles([]);
    setFileInputKey(Date.now());
  }, [open, editingPost]);

  const newFilesPreview = useMemo(() => {
    return newFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${file.size}`,
      file,
      previewUrl: URL.createObjectURL(file)
    }));
  }, [newFiles]);

  useEffect(() => {
    return () => {
      newFilesPreview.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [newFilesPreview]);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilesSelected = (event) => {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    setNewFiles((prev) => [...prev, ...selected]);
    setFileInputKey(Date.now());
  };

  const removeNewFile = (fileToRemove) => {
    setNewFiles((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          )
      )
    );
  };

  const toggleDeleteExistingMedia = (mediaId) => {
    setMediaToDelete((prev) =>
      prev.includes(mediaId)
        ? prev.filter((id) => id !== mediaId)
        : [...prev, mediaId]
    );
  };

  /* Benjamin Orellana - 2026/04/14 - Sube archivos físicos al backend y devuelve payload listo para registrar en student-gallery-media. */
  const uploadGalleryFiles = async (files) => {
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post(UPLOAD_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = res.data || {};

      uploaded.push({
        tipo_archivo: file.type?.startsWith('video') ? 'video' : 'imagen',
        archivo_url: data.archivo_url,
        thumbnail_url: data.thumbnail_url || null,
        archivo_nombre_original: data.archivo_nombre_original || file.name,
        mime_type: data.mime_type || file.type || null,
        peso_bytes: data.peso_bytes || file.size || null
      });
    }

    return uploaded;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId) {
      Swal.fire({
        icon: 'error',
        title: 'Alumno inválido',
        text: 'No se pudo identificar el alumno de este perfil.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
      return;
    }

    setSaving(true);

    try {
      let postId = editingPost?.id || null;

      const postPayload = {
        student_id: studentId,
        titulo: form.titulo?.trim() || null,
        descripcion: form.descripcion?.trim() || null,
        tipo_publicacion: 'foto',
        template_codigo: form.template_codigo,
        mostrar_nombre: form.mostrar_nombre,
        mostrar_fecha: form.mostrar_fecha,
        mostrar_en_home: form.mostrar_en_home,
        consentimiento_publico: form.consentimiento_publico,
        canal_carga: 'alumno'
      };

      if (editingPost) {
        await axios.put(`${POSTS_ENDPOINT}/${editingPost.id}`, postPayload);
        postId = editingPost.id;
      } else {
        const created = await axios.post(POSTS_ENDPOINT, postPayload);
        postId = created.data?.id;
      }

      for (const mediaId of mediaToDelete) {
        await axios.delete(`${MEDIA_ENDPOINT}/${mediaId}`);
      }

      /* Benjamin Orellana - 2026/04/14 - Se suben los archivos físicos y luego se registran como medios asociados al post. */
      if (newFiles.length > 0) {
        const uploadedMedia = await uploadGalleryFiles(newFiles);

        await axios.post(MEDIA_ENDPOINT, {
          post_id: postId,
          media: uploadedMedia.map((item, index) => ({
            ...item,
            orden: index + 1
          }))
        });
      }

      Swal.fire({
        icon: 'success',
        title: editingPost ? 'Publicación actualizada' : 'Publicación creada',
        text: 'El post se guardó correctamente. Falta implementar la subida real de archivos para adjuntar imágenes locales.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });

      onSaved?.();
    } catch (error) {
      console.error('Error guardando publicación de galería:', error);

      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar la publicación',
        text:
          error?.response?.data?.mensajeError ||
          error?.message ||
          'Ocurrió un problema al guardar el post.',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0f',
        color: '#fff'
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[120]"
        onClose={saving ? () => {} : onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-3 py-8 md:px-6">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 translate-y-4 scale-[0.98]"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 scale-[0.98]"
            >
              <Dialog.Panel className="w-full max-w-5xl overflow-hidden rounded-[34px] border border-red-500/15 bg-gradient-to-br from-[#070709] via-[#0d0d11] to-[#13131a] shadow-[0_30px_120px_rgba(0,0,0,.45)]">
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 md:px-7">
                    <div>
                      <Dialog.Title className="text-2xl font-black uppercase tracking-wide text-white">
                        {editingPost
                          ? 'Editar publicación'
                          : 'Nueva publicación'}
                      </Dialog.Title>
                      <p className="mt-1 text-sm text-white/60">
                        Armá tu post para la galería social de Altos Roca.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={onClose}
                      disabled={saving}
                      className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/75 transition hover:bg-white/10"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 md:p-7">
                    <div className="space-y-5">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/85">
                          Título
                        </label>
                        <input
                          type="text"
                          value={form.titulo}
                          onChange={(e) =>
                            handleChange('titulo', e.target.value)
                          }
                          placeholder="Ej: Post entreno de piernas"
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-red-500/35 focus:bg-white/[0.08]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/85">
                          Descripción
                        </label>
                        <textarea
                          rows={5}
                          value={form.descripcion}
                          onChange={(e) =>
                            handleChange('descripcion', e.target.value)
                          }
                          placeholder="Contá brevemente qué estabas entrenando..."
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-red-500/35 focus:bg-white/[0.08]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-white/85">
                          Estilo visual
                        </label>
                        <select
                          value={form.template_codigo}
                          onChange={(e) =>
                            handleChange('template_codigo', e.target.value)
                          }
                          className="w-full rounded-2xl border text-black border-white/10 bg-white/5 px-4 py-3 outline-none transition focus:border-red-500/35 focus:bg-white/[0.08]"
                        >
                          <option value="altos-roca-classic">
                            Altos Roca Classic
                          </option>
                          <option value="post-entreno">Post entreno</option>
                          <option value="pr-fuerza">PR / Fuerza</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                          <input
                            type="checkbox"
                            checked={form.mostrar_nombre}
                            onChange={(e) =>
                              handleChange('mostrar_nombre', e.target.checked)
                            }
                            className="h-4 w-4 accent-red-600"
                          />
                          Mostrar nombre
                        </label>

                        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                          <input
                            type="checkbox"
                            checked={form.mostrar_fecha}
                            onChange={(e) =>
                              handleChange('mostrar_fecha', e.target.checked)
                            }
                            className="h-4 w-4 accent-red-600"
                          />
                          Mostrar fecha
                        </label>

                        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={form.consentimiento_publico}
                            onChange={(e) =>
                              handleChange(
                                'consentimiento_publico',
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 accent-red-600"
                          />
                          Autorizo la publicación pública de este contenido en
                          la web de Altos Roca
                        </label>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[28px] border border-dashed border-red-500/25 bg-red-500/[0.05] p-5">
                        <div className="mb-4 flex items-center gap-3 text-white">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
                            <FaCloudUploadAlt className="text-xl" />
                          </div>
                          <div>
                            <h4 className="font-bold">
                              Agregar imágenes o videos
                            </h4>
                            <p className="text-sm text-white/55">
                              Podés seleccionar varios archivos para el mismo
                              post.
                            </p>
                          </div>
                        </div>

                        <input
                          key={fileInputKey}
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFilesSelected}
                          className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-3 file:rounded-xl file:border-0 file:bg-red-600 file:px-4 file:py-2 file:font-semibold file:text-white"
                        />
                      </div>

                      {existingMedia.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/80">
                            Imágenes actuales
                          </h4>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {existingMedia.map((item) => {
                              const markedDelete = mediaToDelete.includes(
                                item.id
                              );

                              return (
                                <div
                                  key={item.id}
                                  className={`relative overflow-hidden rounded-[24px] border ${
                                    markedDelete
                                      ? 'border-rose-500/35 opacity-50'
                                      : 'border-white/10'
                                  } bg-white/5`}
                                >
                                  {item.tipo_archivo === 'video' ? (
                                    <video
                                      src={item.archivo_url}
                                      className="aspect-square w-full object-cover"
                                    />
                                  ) : (
                                    <img
                                      src={
                                        item.thumbnail_url || item.archivo_url
                                      }
                                      alt="Media actual"
                                      className="aspect-square w-full object-cover"
                                    />
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleDeleteExistingMedia(item.id)
                                    }
                                    className={`absolute right-2 top-2 rounded-full p-2 text-white ${
                                      markedDelete
                                        ? 'bg-emerald-600'
                                        : 'bg-black/70'
                                    }`}
                                  >
                                    {markedDelete ? (
                                      <FaCheckCircle />
                                    ) : (
                                      <FaTrash />
                                    )}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {newFilesPreview.length > 0 && (
                        <div>
                          <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-white/80">
                            Nuevos archivos seleccionados
                          </h4>

                          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {newFilesPreview.map((item) => (
                              <div
                                key={item.id}
                                className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/5"
                              >
                                {item.file.type?.startsWith('video') ? (
                                  <video
                                    src={item.previewUrl}
                                    className="aspect-square w-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={item.previewUrl}
                                    alt="Preview nueva"
                                    className="aspect-square w-full object-cover"
                                  />
                                )}

                                <button
                                  type="button"
                                  onClick={() => removeNewFile(item.file)}
                                  className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white"
                                >
                                  <FaTrash />
                                </button>

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 py-2 text-xs text-white/85">
                                  <div className="line-clamp-1">
                                    {item.file.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {existingMedia.length === 0 &&
                        newFilesPreview.length === 0 && (
                          <div className="flex min-h-[220px] items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                            <div>
                              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white/50">
                                <FaImage className="text-xl" />
                              </div>
                              <p className="text-white/60">
                                Todavía no agregaste archivos a esta
                                publicación.
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-5 md:flex-row md:items-center md:justify-end md:px-7">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={saving}
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-red-700 px-6 py-3 font-bold text-white shadow-lg shadow-red-900/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FaCloudUploadAlt />
                      {saving
                        ? 'Guardando...'
                        : editingPost
                          ? 'Guardar cambios'
                          : 'Crear publicación'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
