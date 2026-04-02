import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { motion } from 'framer-motion';
import {
  FaUserPlus,
  FaUserEdit,
  FaSave,
  FaTimes,
  FaLock
} from 'react-icons/fa';
import PasswordEditor from '../../../Security/PasswordEditor';

if (typeof document !== 'undefined') {
  Modal.setAppElement('#root');
}

export default function UsuariosFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  editId,
  sedes = [],
  allowedRoles = [],
  puedeGestionarTodasLasSedes = false,
  sedeActualId = null,
  saving = false
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rol: 'admin',
    sede_id: '',
    state: 'activo',
    es_reemplazante: false
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);

  const isEdit = !!editId;

  // Benjamin Orellana - 02 / 04 / 2026 - Se inicializa y resincroniza el estado interno del modal externo para alta y edición de usuarios
  useEffect(() => {
    if (!open) return;

    setFormData({
      name: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      rol: String(initialData?.rol || 'admin').toLowerCase(),
      sede_id:
        initialData?.sede_id ||
        (!puedeGestionarTodasLasSedes ? sedeActualId || '' : ''),
      state: initialData?.state || 'activo',
      es_reemplazante: !!initialData?.es_reemplazante
    });

    setConfirmPassword('');
    setPasswordValid(true);
  }, [open, initialData, puedeGestionarTodasLasSedes, sedeActualId]);

  // Benjamin Orellana - 02 / 04 / 2026 - Se asegura automáticamente la sede actual cuando el usuario no puede administrar todas las sedes
  useEffect(() => {
    if (!open) return;
    if (puedeGestionarTodasLasSedes) return;

    setFormData((prev) => ({
      ...prev,
      sede_id: prev.sede_id || sedeActualId || ''
    }));
  }, [open, puedeGestionarTodasLasSedes, sedeActualId]);

  const showConfirmPassword = useMemo(() => {
    if (!isEdit) return true;
    return String(formData.password || '').trim().length > 0;
  }, [isEdit, formData.password]);

  const roleOptions = useMemo(() => {
    return (allowedRoles || []).map((rol) => ({
      value: String(rol).toLowerCase(),
      label:
        String(rol).charAt(0).toUpperCase() + String(rol).slice(1).toLowerCase()
    }));
  }, [allowedRoles]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Benjamin Orellana - 02 / 04 / 2026 - Se valida el formulario externo contemplando creación y edición opcional de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!String(formData.name || '').trim()) return;
    if (!String(formData.email || '').trim()) return;
    if (!String(formData.rol || '').trim()) return;
    if (!String(formData.state || '').trim()) return;
    if (!String(formData.sede_id || '').trim()) return;

    if (!isEdit) {
      if (!String(formData.password || '').trim()) return;
      if (!passwordValid) return;
      if (String(formData.password || '') !== String(confirmPassword || '')) {
        return;
      }
    }

    if (isEdit && String(formData.password || '').trim() !== '') {
      if (!passwordValid) return;
      if (String(formData.password || '') !== String(confirmPassword || '')) {
        return;
      }
    }

    await onSubmit?.(formData);
  };

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:border-red-500/50 focus:bg-[#111113]';

  const selectClass =
    'w-full rounded-2xl border border-white/10 bg-[#0b0b0d] px-4 py-3 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/50 focus:bg-[#111113] disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <Modal
      isOpen={open}
      onRequestClose={saving ? undefined : onClose}
      overlayClassName="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      className="w-full max-w-3xl rounded-[30px] border border-white/10 bg-[#09090b] shadow-[0_30px_90px_rgba(0,0,0,0.45)] outline-none"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-[30px]"
      >
        <div className="h-1.5 w-full bg-gradient-to-r from-red-800 via-red-600 to-red-400" />

        <div className="p-5 sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                Altos Roca Gym
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-700 to-red-500 text-white shadow-[0_12px_35px_rgba(220,38,38,0.30)]">
                  {isEdit ? <FaUserEdit /> : <FaUserPlus />}
                </div>

                <div>
                  <h2 className="titulo uppercase text-2xl font-black tracking-tight text-white">
                    {isEdit ? 'Editar usuario' : 'Nuevo usuario'}
                  </h2>
                  <p className="mt-1 text-sm text-white/60">
                    {isEdit
                      ? 'Actualizá los datos del usuario y editá la clave si hace falta.'
                      : 'Completá los datos del usuario y asignale su sede.'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 transition-all duration-200 hover:border-red-500/35 hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/78">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre del usuario"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/78">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="correo@empresa.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/78">
                  Rol
                </label>
                <select
                  value={formData.rol}
                  onChange={(e) =>
                    handleChange(
                      'rol',
                      String(e.target.value || '').toLowerCase()
                    )
                  }
                  className={selectClass}
                  required
                >
                  {roleOptions.map((rol) => (
                    <option
                      key={rol.value}
                      value={rol.value}
                      className="bg-[#111111] text-white"
                    >
                      {rol.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/78">
                  Sede
                </label>
                <select
                  value={formData.sede_id || ''}
                  onChange={(e) => handleChange('sede_id', e.target.value)}
                  className={selectClass}
                  required
                  disabled={!puedeGestionarTodasLasSedes}
                >
                  <option value="" className="bg-[#111111] text-white">
                    Seleccioná la sede
                  </option>

                  {sedes.map((sede) => (
                    <option
                      key={sede.id}
                      value={sede.id}
                      className="bg-[#111111] text-white"
                    >
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/78">
                  Estado
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="activo" className="bg-[#111111] text-white">
                    Activo
                  </option>
                  <option value="inactivo" className="bg-[#111111] text-white">
                    Inactivo
                  </option>
                </select>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-red-200">
                <FaLock />
                Seguridad
              </div>

              <PasswordEditor
                value={formData.password}
                onChange={(val) => handleChange('password', val)}
                showConfirm={showConfirmPassword}
                confirmValue={confirmPassword}
                onConfirmChange={setConfirmPassword}
                onValidityChange={setPasswordValid}
              />

              <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-xs leading-relaxed text-white/55">
                {isEdit
                  ? 'La contraseña es opcional. Solo se actualizará si cargás una nueva.'
                  : 'La contraseña es obligatoria para crear el usuario.'}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/86 transition-all duration-300 hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={saving}
                className="titulo inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(220,38,38,0.24)] transition-all duration-300 hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaSave />
                {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Modal>
  );
}
