import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import {
  FaUser,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaUserShield,
  FaChalkboardTeacher,
  FaBuilding
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ParticlesBackground from '../../components/ParticlesBackground';
import ButtonBack from '../../components/ButtonBack';
import { useAuth } from '../../AuthContext';
import axiosWithAuth from '../../utils/axiosWithAuth';
import { getUserId } from '../../utils/authUtils';
import PasswordEditor from '../../Security/PasswordEditor';
import Swal from 'sweetalert2';
import NavbarStaff from '../staff/NavbarStaff';

Modal.setAppElement('#root');

export default function UsuariosGet() {
  const [usuarios, setUsuarios] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

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

  const usuarioId = getUserId();

  const { userRol, userLevel, userSedeId, userLocalId, userName } = useAuth();

  const rolActual = String(userRol || userLevel || '').toLowerCase();
  const sedeActualId = Number(userSedeId || userLocalId || 0) || null;
  const puedeGestionarTodasLasSedes = ['admin', 'socio'].includes(rolActual);

  // Benjamin Orellana - 29 / 03 / 2026 - Se normalizan roles permitidos a minúsculas para alinearlos con el backend nuevo
  const allowedRoles = ['admin', 'socio', 'vendedor', 'instructor'];

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

  const [rolFiltro, setRolFiltro] = useState('todos');
  const [sedeFiltro, setSedeFiltro] = useState(
    puedeGestionarTodasLasSedes ? 'todos' : String(sedeActualId || 'todos')
  );

  useEffect(() => {
    if (!puedeGestionarTodasLasSedes && sedeActualId) {
      setSedeFiltro(String(sedeActualId));
    }
  }, [puedeGestionarTodasLasSedes, sedeActualId]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      rol: 'admin',
      sede_id: puedeGestionarTodasLasSedes ? '' : sedeActualId || '',
      state: 'activo',
      es_reemplazante: false
    });
    setConfirmPassword('');
    setPasswordValid(true);
  };

  const openModal = (usuario = null) => {
    if (usuario) {
      setEditId(usuario.id);
      setFormData({
        name: usuario.name || usuario.nombre || '',
        email: usuario.email || '',
        password: '',
        rol: getUsuarioRol(usuario) || 'admin',
        sede_id: getUsuarioSedeId(usuario) || '',
        state: usuario.state || 'activo',
        es_reemplazante: !!usuario.es_reemplazante
      });
      setConfirmPassword('');
      setPasswordValid(true);
    } else {
      setEditId(null);
      resetForm();
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const client = axiosWithAuth();

      let rol = String(formData.rol || '')
        .toLowerCase()
        .trim();
      if (!allowedRoles.includes(rol)) rol = 'admin';

      const sedeIdNormalizada =
        Number(formData.sede_id || 0) || Number(sedeActualId || 0) || null;

      const sedeSeleccionada = sedes.find((s) => s.id === sedeIdNormalizada);

      if (!String(formData.name || '').trim()) {
        await Swal.fire('FALTAN DATOS', 'El nombre es obligatorio.', 'warning');
        return;
      }

      if (!String(formData.email || '').trim()) {
        await Swal.fire('FALTAN DATOS', 'El email es obligatorio.', 'warning');
        return;
      }

      if (!sedeIdNormalizada) {
        await Swal.fire(
          'FALTAN DATOS',
          'Debes seleccionar una sede.',
          'warning'
        );
        return;
      }

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        rol,
        level: rol,
        sede_id: sedeIdNormalizada,
        sede: sedeSeleccionada?.nombre || null,
        state: formData.state || 'activo',
        usuario_log_id: usuarioId,
        es_reemplazante: !!formData.es_reemplazante
      };

      if (editId) {
        if (formData.password && String(formData.password).trim() !== '') {
          if (!passPolicyOk(formData.password)) {
            await Swal.fire(
              'CONTRASEÑA DÉBIL',
              'Usá al menos 8 caracteres y combiná mayúsculas, minúsculas, números y símbolos.',
              'error'
            );
            return;
          }
          payload.password = formData.password;
        }

        await client.put(`/users/${editId}`, payload);

        await Swal.fire(
          'ACTUALIZADO',
          'El usuario se actualizó correctamente.',
          'success'
        );
      } else {
        if (!formData.password) {
          await Swal.fire(
            'FALTAN DATOS',
            'La contraseña es obligatoria para crear el usuario.',
            'warning'
          );
          return;
        }

        if (!passwordValid || formData.password !== confirmPassword) {
          await Swal.fire(
            'REVISÁ LA CONTRASEÑA',
            'Las contraseñas no coinciden.',
            'error'
          );
          return;
        }

        if (!passPolicyOk(formData.password)) {
          await Swal.fire(
            'CONTRASEÑA DÉBIL',
            'Usá al menos 8 caracteres y combiná mayúsculas, minúsculas, números y símbolos.',
            'error'
          );
          return;
        }

        payload.password = formData.password;

        await client.post('/users', payload);

        await Swal.fire(
          'CREADO',
          'El usuario se creó correctamente.',
          'success'
        );
      }

      await fetchUsuarios();
      closeModal();
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      await Swal.fire(
        'ERROR',
        err?.response?.data?.mensajeError || 'Ocurrió un error al guardar.',
        'error'
      );
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
      background: '#0f0f10',
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
        background: '#0f0f10',
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

  const stats = useMemo(() => {
    return {
      total: filtered.length,
      admins: filtered.filter((u) => getUsuarioRol(u) === 'admin').length,
      instructores: filtered.filter((u) => getUsuarioRol(u) === 'instructor')
        .length,
      sedes: new Set(filtered.map((u) => getUsuarioSedeId(u)).filter(Boolean))
        .size
    };
  }, [filtered]);

  return (
    <>
      <NavbarStaff />
      <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.14),transparent_28%),linear-gradient(135deg,#050505_0%,#111111_40%,#190909_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
        <ParticlesBackground />
        <ButtonBack />

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="h-1.5 w-full bg-gradient-to-r from-red-800 via-red-500 to-red-300" />

            <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.35fr,0.65fr] lg:px-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  Altos Roca Gym
                </div>

                <h1 className="titulo mt-4 flex items-center gap-3 text-3xl font-extrabold uppercase tracking-tight text-white sm:text-4xl">
                  <FaUser className="text-red-400" />
                  Gestión de usuarios
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-[15px]">
                  Administrá el staff por sede, controlá accesos y mantené cada
                  perfil alineado a la operación real de Altos Roca.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                    Usuario actual:{' '}
                    <span className="font-semibold text-white">
                      {userName || '-'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                    Rol:{' '}
                    <span className="font-semibold capitalize text-white">
                      {rolActual || '-'}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2">
                    Sede:{' '}
                    <span className="font-semibold text-white">
                      {sedes.find((s) => s.id === sedeActualId)?.nombre ||
                        'Sin sede'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Total
                    </span>
                    <FaUsers className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.total}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Admins
                    </span>
                    <FaUserShield className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.admins}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Instructores
                    </span>
                    <FaChalkboardTeacher className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.instructores}
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-inner shadow-black/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-white/45">
                      Sedes visibles
                    </span>
                    <FaBuilding className="text-red-300" />
                  </div>
                  <div className="mt-3 text-3xl font-black text-white">
                    {stats.sedes}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mb-6 rounded-[30px] border border-white/10 bg-white/[0.05] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.30)] backdrop-blur-xl"
          >
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Filtros y búsqueda
                </h2>
                <p className="mt-1 text-sm text-white/60">
                  Buscá usuarios por nombre, email, rol o sede.
                </p>
              </div>

              <button
                onClick={() => openModal()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-400 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(220,38,38,0.26)] transition-all duration-300 hover:scale-[1.01]"
              >
                <FaPlus />
                Nuevo usuario
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Nombre, email, rol o sede..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.06]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Rol
                </label>
                <select
                  value={rolFiltro}
                  onChange={(e) => setRolFiltro(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.06]"
                >
                  <option value="todos">Todos</option>
                  <option value="admin">Admin</option>
                  <option value="socio">Socio</option>
                  <option value="vendedor">Vendedor</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/75">
                  Sede
                </label>
                <select
                  value={sedeFiltro}
                  onChange={(e) => setSedeFiltro(e.target.value)}
                  disabled={!puedeGestionarTodasLasSedes}
                  className="w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.06] disabled:cursor-not-allowed disabled:opacity-70"
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
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 }}
            className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] shadow-[0_25px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-left text-sm text-white/85">
                <thead className="bg-gradient-to-r from-red-900/90 via-red-700/80 to-red-500/70 text-white">
                  <tr className="text-[12px] uppercase tracking-[0.18em]">
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
                    filtered.map((u, i) => (
                      <tr
                        key={u.id}
                        className={`border-t border-white/10 transition-colors duration-200 hover:bg-white/[0.06] ${
                          i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-white/[0.035]'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">
                            {getUsuarioNombre(u)}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-white/78">{u.email}</td>

                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-200">
                            {getUsuarioRol(u)}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-white/82">
                          {getUsuarioSedeNombre(u)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                              String(u.state || '').toLowerCase() === 'activo'
                                ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
                                : 'border border-zinc-400/20 bg-zinc-500/10 text-zinc-200'
                            }`}
                          >
                            {u.state || 'activo'}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => openModal(u)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-amber-300 transition-all duration-200 hover:bg-amber-400/10 hover:text-amber-200"
                              aria-label="Editar"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>

                            <button
                              onClick={() => handleDelete(u.id)}
                              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-rose-300 transition-all duration-200 hover:bg-rose-400/10 hover:text-rose-200"
                              aria-label="Eliminar"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-white/55"
                      >
                        No se encontraron usuarios con los filtros actuales.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

          <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            className="w-full max-w-2xl rounded-[30px] border border-white/10 bg-[#0d0d0f] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] outline-none"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  Altos Roca Gym
                </div>
                <h2 className="titulo mt-2 text-2xl font-bold uppercase text-white">
                  {editId ? 'Editar usuario' : 'Nuevo usuario'}
                </h2>
                <p className="mt-2 text-sm text-white/58">
                  Completá los datos del perfil y asignale su sede de trabajo.
                </p>
              </div>
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
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/28 outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05]"
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/28 outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05]"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
                <PasswordEditor
                  value={formData.password}
                  onChange={(val) =>
                    setFormData({ ...formData, password: val })
                  }
                  showConfirm={!editId}
                  confirmValue={confirmPassword}
                  onConfirmChange={setConfirmPassword}
                  onValidityChange={setPasswordValid}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/78">
                    Rol
                  </label>
                  <select
                    value={formData.rol}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rol: e.target.value.toLowerCase()
                      })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05]"
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="socio">Socio</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="instructor">Instructor</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/78">
                    Sede
                  </label>
                  <select
                    value={formData.sede_id || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, sede_id: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05] disabled:cursor-not-allowed disabled:opacity-70"
                    required
                    disabled={!puedeGestionarTodasLasSedes}
                  >
                    <option value="">Seleccioná la sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.id} value={sede.id}>
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
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-red-500/35 focus:bg-red-500/[0.05]"
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/86 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-red-800 via-red-600 to-red-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_45px_rgba(220,38,38,0.24)] transition-all duration-300 hover:scale-[1.01]"
                >
                  {editId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </div>
    </>
  );
}
