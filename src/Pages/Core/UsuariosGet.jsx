import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaUsers,
  FaBuilding,
  FaUserShield,
  FaSlidersH
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ButtonBack from '../../components/ButtonBack';
import { useAuth } from '../../AuthContext';
import axiosWithAuth from '../../utils/axiosWithAuth';
import { getUserId } from '../../utils/authUtils';
import Swal from 'sweetalert2';
import NavbarStaff from '../staff/NavbarStaff';
import UsuariosFormModal from '../../components/Forms/Core/UsuariosFormModal';

export default function UsuariosGet() {
  const [usuarios, setUsuarios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [search, setSearch] = useState('');
  const [rolFiltro, setRolFiltro] = useState('todos');
  const [sedeFiltro, setSedeFiltro] = useState('todos');

  const [formOpen, setFormOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [savingUsuario, setSavingUsuario] = useState(false);

  const usuarioId = getUserId();

  const { userRol, userLevel, userSedeId, userLocalId, userName } = useAuth();

  const rolActual = String(userRol || userLevel || '').toLowerCase();
  const sedeActualId = Number(userSedeId || userLocalId || 0) || null;
  const puedeGestionarTodasLasSedes = ['admin', 'socio'].includes(rolActual);

  // Benjamin Orellana - 02 / 04 / 2026 - Se normalizan roles permitidos para mantener compatibilidad entre frontend y backend
  const allowedRoles = ['admin', 'instructor'];

  // Benjamin Orellana - 02 / 04 / 2026 - Se conserva la política de contraseña para permitir edición de clave desde el modal externo
  const passPolicyOk = (pwd) => {
    if (!pwd || pwd.length < 8) return false;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNum = /\d/.test(pwd);
    const hasSym = /[^A-Za-z0-9]/.test(pwd);
    const score = [hasUpper, hasLower, hasNum, hasSym].filter(Boolean).length;
    return score >= 3;
  };

  const getUsuarioNombre = (u) => u?.name || u?.nombre || '-';

  const getUsuarioRol = (u) =>
    String(u?.rol || u?.level || '').toLowerCase() || '-';

  const getUsuarioSedeId = (u) =>
    Number(u?.sede_id || u?.local_id || u?.sedeRelacion?.id || 0) || null;

  const getUsuarioSedeNombre = (u) =>
    u?.sedeRelacion?.nombre ||
    u?.sede_relacion?.nombre ||
    u?.sede ||
    sedes.find((s) => s.id === getUsuarioSedeId(u))?.nombre ||
    '-';

  const fetchUsuarios = async () => {
    try {
      const client = axiosWithAuth();

      const params = {};
      if (!puedeGestionarTodasLasSedes && sedeActualId) {
        params.sede_id = sedeActualId;
      }

      const res = await client.get('/users', { params });
      setUsuarios(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error(
        'Error al obtener usuarios:',
        error.response?.data || error.message
      );
      setUsuarios([]);
    }
  };

  const fetchSedes = async () => {
    try {
      const res = await axios.get('http://localhost:8080/sedes');
      setSedes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error al obtener sedes:', error);
      setSedes([]);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchSedes();
  }, [puedeGestionarTodasLasSedes, sedeActualId]);

  useEffect(() => {
    if (!puedeGestionarTodasLasSedes && sedeActualId) {
      setSedeFiltro(String(sedeActualId));
    } else {
      setSedeFiltro('todos');
    }
  }, [puedeGestionarTodasLasSedes, sedeActualId]);

  // Benjamin Orellana - 02 / 04 / 2026 - Se desacopla el alta y edición del page para operar con un modal externo reutilizable
  const openCreateForm = () => {
    setUsuarioEditando(null);
    setFormOpen(true);
  };

  const openEditForm = (usuario) => {
    setUsuarioEditando(usuario);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setUsuarioEditando(null);
  };

  // Benjamin Orellana - 02 / 04 / 2026 - Se construye la data inicial del modal externo contemplando alta y edición
  const initialFormData = useMemo(() => {
    if (!usuarioEditando) {
      return {
        name: '',
        email: '',
        password: '',
        rol: 'admin',
        sede_id: puedeGestionarTodasLasSedes ? '' : sedeActualId || '',
        state: 'activo',
        es_reemplazante: false
      };
    }

    return {
      name: usuarioEditando.name || usuarioEditando.nombre || '',
      email: usuarioEditando.email || '',
      password: '',
      rol: getUsuarioRol(usuarioEditando) || 'admin',
      sede_id: getUsuarioSedeId(usuarioEditando) || '',
      state: usuarioEditando.state || 'activo',
      es_reemplazante: !!usuarioEditando.es_reemplazante
    };
  }, [usuarioEditando, puedeGestionarTodasLasSedes, sedeActualId]);

  // Benjamin Orellana - 02 / 04 / 2026 - Se centraliza el guardado para que el modal externo solo resuelva interfaz y captura de datos
  const handleSaveUsuario = async (data) => {
    try {
      setSavingUsuario(true);

      const client = axiosWithAuth();

      let rol = String(data?.rol || '')
        .toLowerCase()
        .trim();

      if (!allowedRoles.includes(rol)) rol = 'admin';

      const sedeIdNormalizada =
        Number(data?.sede_id || 0) || Number(sedeActualId || 0) || null;

      const sedeSeleccionada = sedes.find((s) => s.id === sedeIdNormalizada);

      if (!String(data?.name || '').trim()) {
        await Swal.fire('FALTAN DATOS', 'El nombre es obligatorio.', 'warning');
        return false;
      }

      if (!String(data?.email || '').trim()) {
        await Swal.fire('FALTAN DATOS', 'El email es obligatorio.', 'warning');
        return false;
      }

      if (!sedeIdNormalizada) {
        await Swal.fire(
          'FALTAN DATOS',
          'Debes seleccionar una sede.',
          'warning'
        );
        return false;
      }

      const payload = {
        name: String(data.name || '').trim(),
        email: String(data.email || '').trim(),
        rol,
        level: rol,
        sede_id: sedeIdNormalizada,
        sede: sedeSeleccionada?.nombre || null,
        state: data?.state || 'activo',
        usuario_log_id: usuarioId,
        es_reemplazante: !!data?.es_reemplazante
      };

      if (usuarioEditando?.id) {
        if (data?.password && String(data.password).trim() !== '') {
          if (!passPolicyOk(data.password)) {
            await Swal.fire(
              'CONTRASEÑA DÉBIL',
              'Usá al menos 8 caracteres y combiná mayúsculas, minúsculas, números y símbolos.',
              'error'
            );
            return false;
          }

          payload.password = data.password;
        }

        await client.put(`/users/${usuarioEditando.id}`, payload);

        await Swal.fire(
          'ACTUALIZADO',
          'El usuario se actualizó correctamente.',
          'success'
        );
      } else {
        if (!data?.password || String(data.password).trim() === '') {
          await Swal.fire(
            'FALTAN DATOS',
            'La contraseña es obligatoria para crear el usuario.',
            'warning'
          );
          return false;
        }

        if (!passPolicyOk(data.password)) {
          await Swal.fire(
            'CONTRASEÑA DÉBIL',
            'Usá al menos 8 caracteres y combiná mayúsculas, minúsculas, números y símbolos.',
            'error'
          );
          return false;
        }

        payload.password = data.password;

        await client.post('/users', payload);

        await Swal.fire(
          'CREADO',
          'El usuario se creó correctamente.',
          'success'
        );
      }

      await fetchUsuarios();
      closeForm();
      return true;
    } catch (err) {
      console.error('Error al guardar usuario:', err);

      await Swal.fire(
        'ERROR',
        err?.response?.data?.mensajeError || 'Ocurrió un error al guardar.',
        'error'
      );

      return false;
    } finally {
      setSavingUsuario(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      background: '#0b0b0c',
      color: '#ffffff'
    });

    if (!confirm.isConfirmed) return;

    try {
      const client = axiosWithAuth();

      await client.delete(`/users/${id}`, {
        data: { usuario_log_id: usuarioId }
      });

      await Swal.fire({
        title: 'ELIMINADO',
        text: 'El usuario se eliminó correctamente.',
        icon: 'success',
        confirmButtonColor: '#dc2626',
        background: '#0b0b0c',
        color: '#ffffff'
      });

      await fetchUsuarios();
    } catch (err) {
      console.error('Error al eliminar usuario:', err);

      await Swal.fire(
        'ERROR',
        err?.response?.data?.mensajeError ||
          'Ocurrió un error al eliminar el usuario.',
        'error'
      );
    }
  };

  const filtered = useMemo(() => {
    return usuarios.filter((u) => {
      const coincideTexto = [
        getUsuarioNombre(u),
        u?.email || '',
        getUsuarioRol(u),
        getUsuarioSedeNombre(u)
      ].some((f) => String(f).toLowerCase().includes(search.toLowerCase()));

      const coincideRol =
        rolFiltro === 'todos' || getUsuarioRol(u) === rolFiltro;

      const coincideSede =
        sedeFiltro === 'todos' ||
        getUsuarioSedeId(u) === Number(sedeFiltro || 0);

      return coincideTexto && coincideRol && coincideSede;
    });
  }, [usuarios, search, rolFiltro, sedeFiltro, sedes]);

  const resumen = useMemo(() => {
    const admins = filtered.filter((u) => getUsuarioRol(u) === 'admin').length;
    const sedesVisibles = new Set(
      filtered.map((u) => getUsuarioSedeId(u)).filter(Boolean)
    ).size;

    return {
      total: filtered.length,
      admins,
      sedes: sedesVisibles
    };
  }, [filtered]);

  const inputClass =
    'w-full rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-500/50 focus:bg-[#101013]';

  const selectClass =
    'w-full rounded-2xl border border-white/10 bg-[#09090b] px-4 py-3.5 text-sm text-white outline-none transition-all duration-300 focus:border-red-500/50 focus:bg-[#101013] disabled:cursor-not-allowed disabled:opacity-70';

  return (
    <>
      <NavbarStaff />

      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.10),transparent_24%),linear-gradient(180deg,#050505_0%,#090909_50%,#060606_100%)] px-4 py-6 text-white sm:px-6 lg:px-8">
        <ButtonBack />

        <div className="mx-auto mt-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
            className="mb-5 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="mb-3 inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-200">
                  Altos Roca Gym
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 h-12 w-1.5 rounded-full bg-gradient-to-b from-red-400 to-red-700" />

                  <div className="min-w-0">
                    <h1 className="titulo uppercase text-3xl font-black tracking-tight text-white">
                      Usuarios
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                      Administración de accesos.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <FaUsers className="text-red-300" />
                        {resumen.total} usuarios
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <FaUserShield className="text-red-300" />
                        {resumen.admins} admins
                      </span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300">
                        <FaBuilding className="text-red-300" />
                        {resumen.sedes} sedes visibles
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={openCreateForm}
                  className="titulo inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_14px_35px_rgba(220,38,38,0.28)] transition-all duration-300 hover:translate-y-[-1px] hover:shadow-[0_18px_40px_rgba(220,38,38,0.34)]"
                >
                  <FaPlus />
                  Nuevo usuario
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.04 }}
            className="mb-5 rounded-[28px] border border-white/10 bg-[#0b0b0d]/90 p-4 shadow-[0_14px_38px_rgba(0,0,0,0.28)]"
          >
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              <FaSlidersH className="text-red-300" />
              Filtros
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr,0.75fr,0.85fr]">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Buscar
                </label>
                <div className="relative">
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Nombre, email, rol o sede..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Rol
                </label>
                <select
                  value={rolFiltro}
                  onChange={(e) => setRolFiltro(e.target.value)}
                  className={selectClass}
                >
                  <option value="todos">Todos</option>
                  <option value="admin">Admin</option>
                  <option value="socio">Socio</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-300">
                  Sede
                </label>
                <select
                  value={sedeFiltro}
                  onChange={(e) => setSedeFiltro(e.target.value)}
                  disabled={!puedeGestionarTodasLasSedes}
                  className={selectClass}
                >
                  {puedeGestionarTodasLasSedes && (
                    <option value="todos">Todas las sedes</option>
                  )}

                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.08 }}
            className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0a0a0b]/95 shadow-[0_20px_55px_rgba(0,0,0,0.34)]"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-[linear-gradient(90deg,rgba(120,10,10,0.35),rgba(0,0,0,0))] px-5 py-4">
              <div>
                <h2 className="titulo text-base font-bold text-white">
                  Listado de usuarios
                </h2>
                <p className="mt-1 text-xs text-zinc-400">
                  {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[960px] border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-[#140606] text-white">
                  <tr className="text-[12px] uppercase tracking-[0.16em] text-zinc-200">
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Sede</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((u, i) => {
                      const rowBg =
                        i % 2 === 0 ? '!bg-[#0f0f11]' : '!bg-[#0b0b0d]';

                      return (
                        <tr key={u.id} className="group">
                          <td
                            className={`px-6 py-4 !text-white ${rowBg} border-t border-white/5 transition-colors duration-200 group-hover:!bg-red-950/70`}
                          >
                            <div className="font-semibold !text-white">
                              {getUsuarioNombre(u)}
                            </div>
                          </td>

                          <td
                            className={`px-6 py-4 !text-zinc-300 ${rowBg} border-t border-white/5 transition-colors duration-200 group-hover:!bg-red-950/70 group-hover:!text-white`}
                          >
                            {u.email || '-'}
                          </td>

                          <td
                            className={`px-6 py-4 ${rowBg} border-t border-white/5 transition-colors duration-200 group-hover:!bg-red-950/70`}
                          >
                            <span className="inline-flex rounded-full border border-red-500/25 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-200">
                              {getUsuarioRol(u)}
                            </span>
                          </td>

                          <td
                            className={`px-6 py-4 !text-zinc-200 ${rowBg} border-t border-white/5 transition-colors duration-200 group-hover:!bg-red-950/70 group-hover:!text-white`}
                          >
                            {getUsuarioSedeNombre(u)}
                          </td>

                          <td
                            className={`px-6 py-4 ${rowBg} border-t border-white/5 transition-colors duration-200 group-hover:!bg-red-950/70`}
                          >
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                                String(u.state || '').toLowerCase() === 'activo'
                                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                  : 'border-zinc-500/20 bg-zinc-500/10 text-zinc-300'
                              }`}
                            >
                              {u.state || 'activo'}
                            </span>
                          </td>

                          <td
                            className={`px-6 py-4 ${rowBg} border-t border-white/5 transition-colors duration-200 group-hover:!bg-red-950/70`}
                          >
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => openEditForm(u)}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-yellow-600 text-zinc-300 transition-all duration-200 hover:!border-red-500/40 hover:!bg-red-600/20 hover:!text-white"
                                aria-label="Editar"
                                title="Editar"
                              >
                                <FaEdit />
                              </button>

                              <button
                                onClick={() => handleDelete(u.id)}
                                className="inline-flex bg-red-600 h-10 w-10 items-center justify-center rounded-xl border border-white/10  text-zinc-300 transition-all duration-200 hover:!border-red-500/40 hover:!bg-red-600/20 hover:!text-white"
                                aria-label="Eliminar"
                                title="Eliminar"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="!bg-[#0b0b0d] px-6 py-16 text-center !text-zinc-500"
                      >
                        No se encontraron usuarios con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 lg:hidden">
              {filtered.length > 0 ? (
                filtered.map((u) => (
                  <div
                    key={u.id}
                    className="rounded-[24px] border border-white/10 !bg-[#0f0f11] p-4 transition-colors duration-200 hover:!border-red-500/30 hover:!bg-red-950/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-base font-bold !text-white">
                          {getUsuarioNombre(u)}
                        </div>
                        <div className="mt-1 break-all text-sm !text-zinc-400">
                          {u.email || '-'}
                        </div>
                      </div>

                      <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-red-200">
                        {getUsuarioRol(u)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                          Sede
                        </div>
                        <div className="mt-1 !text-zinc-100">
                          {getUsuarioSedeNombre(u)}
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-zinc-500">
                          Estado
                        </div>
                        <div className="mt-1 !text-zinc-100">
                          {u.state || 'activo'}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => openEditForm(u)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-yellow-600 px-4 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:!border-red-500/35 hover:!bg-red-600/20 hover:!text-white"
                      >
                        <FaEdit />
                        Editar
                      </button>

                      <button
                        onClick={() => handleDelete(u.id)}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-red-600 px-4 py-3 text-sm font-semibold text-zinc-100 transition-all duration-200 hover:!border-red-500/35 hover:!bg-red-600/20 hover:!text-white"
                      >
                        <FaTrash />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-white/10 !bg-[#0f0f11] p-8 text-center !text-zinc-500">
                  No se encontraron usuarios con los filtros actuales.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        <UsuariosFormModal
          open={formOpen}
          onClose={closeForm}
          onSubmit={handleSaveUsuario}
          initialData={initialFormData}
          editId={usuarioEditando?.id || null}
          sedes={sedes}
          allowedRoles={allowedRoles}
          puedeGestionarTodasLasSedes={puedeGestionarTodasLasSedes}
          sedeActualId={sedeActualId}
          saving={savingUsuario}
        />
      </div>
    </>
  );
}
