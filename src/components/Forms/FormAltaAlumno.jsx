/*
 * Programadores: Benjamin Orellana (back) y Lucas Albornoz (front)
 * Fecha Cración: 26 / 05 / 2025
 * Versión: 2.0 (Dark Pro UX)
 *
 * Descripción:
 *  Formulario (modal) para altas/ediciones de alumnos con UX modernizada:
 *  - Fondo oscuro con blur, tarjeta glass y header sticky
 *  - Campos grandes, labels claras, errores inline
 *  - Cerrar con ESC o clic fuera, autofocus en Nombre y Apellido
 *  - Mantiene el contrato de API existente
 */

import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import Alerta from '../Error';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X as IconClose,
  User as IconUser,
  Phone as IconPhone,
  Hash as IconHash,
  ClipboardList as IconList,
  Users as IconUsers
} from 'lucide-react';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const FormAltaAlumno = ({ isOpen, onClose, user, setSelectedUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const { userLevel, userId } = useAuth();

  const [textoModal, setTextoModal] = useState('');
  const formikRef = useRef(null);
  const overlayRef = useRef(null);
  const firstInputRef = useRef(null);

  const [profesores, setProfesores] = useState([]);

  useEffect(() => {
    const onKey = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  useEffect(() => {
    const obtenerProfesores = async () => {
      try {
        const res = await axios.get('http://localhost:8080/users');
        setProfesores(res.data || []);
      } catch (error) {
        console.log('Error al obtener usuarios:', error);
        setProfesores([]);
      }
    };
    obtenerProfesores();
  }, []);

  useEffect(() => {
    // autofocus cuando abre
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 50);
  }, [isOpen]);

  const nuevoAlumnoSchema = Yup.object().shape({
    nomyape: Yup.string()
      .min(3, 'El nombre completo es muy corto')
      .max(100, 'El nombre completo es muy largo')
      .required('El nombre completo es obligatorio'),
    dni: Yup.string()
      .matches(/^\d+$/, 'Solo se permiten números')
      .min(7, 'El DNI es muy corto')
      .max(10, 'El DNI es muy largo')
      .required('El DNI es obligatorio'),
    user_id: Yup.number()
      .typeError('Debe seleccionar un profesor')
      .required('Debe asignar un profesor'),
    rutina_tipo: Yup.string()
      .oneOf(['personalizado', 'general'], 'Debe elegir una rutina')
      .required('El tipo de rutina es obligatorio'),
    created_at: Yup.date().nullable(true),
    updated_at: Yup.date().nullable(true)
  });

  const handleSubmitAlumno = async (valores) => {
    try {
      // Validación rápida (opcional; Formik/Yup ya valida)
      if (
        !valores.nomyape?.trim() ||
        !valores.telefono?.trim() ||
        !valores.dni?.trim() ||
        !valores.user_id
      ) {
        await Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completá todos los obligatorios.',
          background: '#0b1220',
          color: '#e5e7eb',
          confirmButtonColor: '#4f46e5'
        });
        return;
      }

      const url = user
        ? `http://localhost:8080/students/${user.id}`
        : 'http://localhost:8080/students/';
      const method = user ? 'PUT' : 'POST';

      const respuesta = await fetch(url, {
        method,
        body: JSON.stringify({ ...valores }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      // Si querés usar la data:
      // const data = await respuesta.json();

      await Swal.fire({
        icon: 'success',
        title: method === 'PUT' ? 'Alumno actualizado' : 'Alumno creado',
        timer: 1400,
        showConfirmButton: false,
        background: '#0b1220',
        color: '#e5e7eb'
      });

      // cerrar modal luego del toast
      handleClose();
    } catch (error) {
      console.error('Error al insertar el registro:', error);
      await Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text: 'Intentá nuevamente en unos segundos.',
        background: '#0b1220',
        color: '#e5e7eb',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleClose = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
      setSelectedUser?.(null);
    }
    onClose?.();
  };

  const closeOnBackdrop = (e) => {
    if (e.target === overlayRef.current) handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          onMouseDown={closeOnBackdrop}
          className="fixed inset-0 z-[120] grid place-items-center bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.92),rgba(15,23,42,0.92))] backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-2xl mx-4"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 ring-1 ring-white/10 shadow-2xl backdrop-blur-xl">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-5 md:px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl rounded-t-3xl">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-100 tracking-tight">
                    {user ? 'Editar alumno' : 'Nuevo alumno'}
                  </h2>
                  <p className="text-[12px] text-slate-400">
                    Completá los campos requeridos.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white"
                  aria-label="Cerrar"
                >
                  <IconClose className="h-5 w-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 md:p-6">
                <Formik
                  innerRef={formikRef}
                  initialValues={{
                    nomyape: user ? user.nomyape : '',
                    telefono: user ? user.telefono : '',
                    dni: user ? user.dni : '',
                    objetivo: user ? user.objetivo : '',
                    user_id: user
                      ? user.user_id
                      : userLevel === 'instructor'
                      ? userId
                      : '',
                    rutina_tipo: user ? user.rutina_tipo : 'personalizado',
                    created_at: user ? user.created_at : new Date(),
                    updated_at: user ? user.updated_at : new Date()
                  }}
                  enableReinitialize
                  onSubmit={async (values, { resetForm }) => {
                    await handleSubmitAlumno(values);
                    resetForm();
                  }}
                  validationSchema={nuevoAlumnoSchema}
                >
                  {({ errors, touched }) => (
                    <Form className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Nombre y Apellido */}
                        <div className="w-full">
                          <label
                            htmlFor="nomyape"
                            className="text-sm text-slate-300 mb-1 block"
                          >
                            <span className="inline-flex items-center gap-2">
                              <IconUser className="h-4 w-4" /> Nombre y Apellido
                            </span>
                          </label>
                          <Field
                            innerRef={firstInputRef}
                            id="nomyape"
                            name="nomyape"
                            type="text"
                            placeholder="Ej.: Juan Pérez"
                            maxLength="70"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          {errors.nomyape && touched.nomyape && (
                            <Alerta>{errors.nomyape}</Alerta>
                          )}
                        </div>

                        {/* Teléfono */}
                        <div className="w-full">
                          <label
                            htmlFor="telefono"
                            className="text-sm text-slate-300 mb-1 block"
                          >
                            <span className="inline-flex items-center gap-2">
                              <IconPhone className="h-4 w-4" /> Teléfono
                            </span>
                          </label>
                          <Field
                            id="telefono"
                            name="telefono"
                            type="text"
                            placeholder="Ej.: 3815555555"
                            maxLength="15"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          {errors.telefono && touched.telefono && (
                            <Alerta>{errors.telefono}</Alerta>
                          )}
                        </div>

                        {/* DNI */}
                        <div className="w-full">
                          <label
                            htmlFor="dni"
                            className="text-sm text-slate-300 mb-1 block"
                          >
                            <span className="inline-flex items-center gap-2">
                              <IconHash className="h-4 w-4" /> DNI
                            </span>
                          </label>
                          <Field
                            id="dni"
                            name="dni"
                            type="text"
                            placeholder="Ej.: 40123456"
                            maxLength="15"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          {errors.dni && touched.dni && (
                            <Alerta>{errors.dni}</Alerta>
                          )}
                        </div>

                        {/* Tipo de Rutina */}
                        <div className="w-full">
                          <label
                            htmlFor="rutina_tipo"
                            className="text-sm text-slate-300 mb-1 block"
                          >
                            <span className="inline-flex items-center gap-2">
                              <IconList className="h-4 w-4" /> Tipo de Rutina{' '}
                              <span className="text-orange-400">*</span>
                            </span>
                          </label>
                          <Field
                            as="select"
                            id="rutina_tipo"
                            name="rutina_tipo"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          >
                            <option
                              className="bg-slate-900"
                              value="personalizado"
                            >
                              Personalizado
                            </option>
                            <option className="bg-slate-900" value="general">
                              General
                            </option>
                          </Field>
                          {errors.rutina_tipo && touched.rutina_tipo && (
                            <Alerta>{errors.rutina_tipo}</Alerta>
                          )}
                        </div>

                        {/* Objetivo */}
                        <div className="w-full md:col-span-2">
                          <label
                            htmlFor="objetivo"
                            className="text-sm text-slate-300 mb-1 block"
                          >
                            <span className="inline-flex items-center gap-2">
                              <IconList className="h-4 w-4" /> Objetivo
                            </span>
                          </label>
                          <Field
                            id="objetivo"
                            name="objetivo"
                            type="text"
                            placeholder="Ej.: bajar de peso / ganar masa / rendimiento"
                            maxLength="200"
                            className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 placeholder-slate-500 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                          />
                          {errors.objetivo && touched.objetivo && (
                            <Alerta>{errors.objetivo}</Alerta>
                          )}
                        </div>

                        {/* Selección Profesor */}
                        <div className="w-full md:col-span-2">
                          <label
                            htmlFor="user_id"
                            className="text-sm text-slate-300 mb-1 block"
                          >
                            <span className="inline-flex items-center gap-2">
                              <IconUsers className="h-4 w-4" /> Profesor
                              asignado
                            </span>
                          </label>
                          <div className="relative">
                            <Field
                              as="select"
                              id="user_id"
                              name="user_id"
                              className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur px-3 py-2 ring-1 ring-white/10 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                              <option
                                className="bg-slate-900"
                                value=""
                                disabled
                              >
                                Selecciona un usuario
                              </option>
                              {profesores.map((usuario) => (
                                <option
                                  key={usuario.id}
                                  value={usuario.id}
                                  className="bg-slate-900"
                                >
                                  {usuario.nombre || usuario.name}
                                </option>
                              ))}
                            </Field>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                              ▼
                            </div>
                          </div>
                          {errors.user_id && touched.user_id && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.user_id}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500"
                        >
                          {user ? 'Actualizar' : 'Crear Alumno'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FormAltaAlumno;
