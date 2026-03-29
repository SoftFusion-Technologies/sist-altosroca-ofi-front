import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import Alerta from '../Error';
import { useAuth } from '../../AuthContext';

const tiposContacto = [
  'Socios que no asisten',
  'Inactivo 10 dias',
  'Inactivo 30 dias',
  'Inactivo 60 dias',
  'Prosp inc Entrenadores',
  'Leads no convertidos',
  'Cambio de plan',
  'Otro'
];

const FormAltaRecaptacion = ({
  isOpen,
  onClose,
  Rec,
  setSelectedRecaptacion
}) => {
  const [users, setUsers] = useState([]);
  const [locales, setLocales] = useState([]);
  const [selectedLocales, setSelectedLocales] = useState([]); // multi-local

  const { userLevel, userLocalId } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [textoModal, setTextoModal] = useState('');
  const [mostrarOtro, setMostrarOtro] = useState(false);

  const formikRef = useRef(null);

  const nuevoRecSchema = Yup.object().shape({
    usuario_id: Yup.number()
      .required('El usuario es obligatorio')
      .positive('Usuario inválido')
      .integer('Usuario inválido'),
    nombre: Yup.string()
      .required('El nombre es obligatorio')
      .max(255, 'El nombre no puede superar los 255 caracteres'),
    tipo_contacto: Yup.string()
      .oneOf(tiposContacto, 'Tipo de contacto inválido')
      .required('El tipo de contacto es obligatorio')
  });

  /* ------------ Locales & Usuarios ------------ */

  // Cargar locales activos al abrir
  useEffect(() => {
    const fetchLocales = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/locales', {
          params: { estado: 'activo' }
        });
        setLocales(data || []);
        // si no es admin, preselecciono su local
        if (userLevel !== 'admin' && userLocalId) {
          setSelectedLocales([Number(userLocalId)]);
        }
      } catch (e) {
        console.error('Error al cargar locales', e);
        setLocales([]);
      }
    };
    if (isOpen) fetchLocales();
  }, [isOpen, userLevel, userLocalId]);

  // Cargar usuarios (traigo todos y filtro por selectedLocales en cliente)
  const obtenerUsers = async (localesSel = []) => {
    try {
      const resp = await axios.get('http://localhost:8080/users');
      let listado = resp.data || [];

      if (localesSel?.length) {
        const setLoc = new Set(localesSel.map(Number));
        listado = listado.filter((u) => setLoc.has(Number(u.local_id)));
      }

      // excluir instructores (compat .rol/.level)
      const usuariosFiltrados = listado.filter(
        (u) => (u.rol ?? u.level) !== 'instructor'
      );

      setUsers(usuariosFiltrados);
    } catch (e) {
      console.log('Error al obtener los usuarios:', e);
      setUsers([]);
    }
  };

  // Cargar usuarios al abrir o cuando cambien locales
  useEffect(() => {
    if (isOpen) obtenerUsers(selectedLocales);
  }, [isOpen, selectedLocales]);

  // Si edito, setear “Otro” si corresponde
  useEffect(() => {
    if (Rec?.tipo_contacto === 'Otro') setMostrarOtro(true);
    else setMostrarOtro(false);
  }, [Rec]);

  const handleLocalSelection = (localId) => {
    setSelectedLocales((prev) =>
      prev.includes(localId)
        ? prev.filter((id) => id !== localId)
        : [...prev, localId]
    );
  };

  const handleSubmitRecaptacion = async (valores) => {
    try {
      const recaptacionData = {
        usuario_id: valores.usuario_id,
        nombre: valores.nombre,
        tipo_contacto: valores.tipo_contacto,
        detalle_contacto: valores.detalle_contacto,
        enviado: valores.enviado || false,
        respondido: valores.respondido || false,
        agendado: valores.agendado || false,
        convertido: valores.convertido || false
      };

      const url = valores.id
        ? `http://localhost:8080/recaptacion/${valores.id}`
        : 'http://localhost:8080/recaptacion';

      const method = valores.id ? 'PUT' : 'POST';
      const bodyData =
        method === 'PUT' ? recaptacionData : { registros: [recaptacionData] };

      const response = await fetch(url, {
        method,
        body: JSON.stringify(bodyData),
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud ${method}: ${response.status}`);
      }

      await response.json();

      setTextoModal(
        method === 'PUT'
          ? 'Recaptación actualizada correctamente.'
          : 'Recaptación creada correctamente.'
      );
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1500);
    } catch (error) {
      console.error('Error al guardar recaptación:', error.message);
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 1500);
    }
  };

  const handleClose = () => {
    if (formikRef.current) {
      formikRef.current.resetForm();
      setSelectedRecaptacion?.(null);
    }
    onClose?.();
  };

  return (
    <div
      className={`h-screen w-screen mt-16 fixed inset-0 flex pt-10 justify-center ${
        isOpen ? 'block' : 'hidden'
      } bg-gray-800 bg-opacity-75 z-50`}
    >
      <div className={`container-inputs`}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            id: Rec ? Rec.id : null,
            usuario_id: Rec ? Rec.usuario_id : '',
            nombre: Rec ? Rec.nombre : '',
            tipo_contacto: Rec ? Rec.tipo_contacto : '',
            detalle_contacto: Rec ? Rec.detalle_contacto || '' : '',
            enviado: Rec ? Rec.enviado : false,
            respondido: Rec ? Rec.respondido : false,
            agendado: Rec ? Rec.agendado : false,
            convertido: Rec ? Rec.convertido : false
          }}
          enableReinitialize
          validationSchema={nuevoRecSchema}
          onSubmit={async (values, { resetForm }) => {
            await handleSubmitRecaptacion(values);
            resetForm();
          }}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <div className="-mt-20 max-h-screen w-full max-w-xl overflow-y-auto bg-white rounded-xl p-5">
              <Form className="formulario w-full bg-white">
                {/* Header */}
                <div className="flex justify-between">
                  <div className="tools">
                    <div className="circle">
                      <span className="red toolsbox"></span>
                    </div>
                    <div className="circle">
                      <span className="yellow toolsbox"></span>
                    </div>
                    <div className="circle">
                      <span className="green toolsbox"></span>
                    </div>
                  </div>
                  <div
                    className="pr-6 pt-3 text-[20px] cursor-pointer"
                    onClick={handleClose}
                  >
                    x
                  </div>
                </div>

                {/* LOCALES dinámicos */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mx-2">
                  {locales.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      className={`w-full py-2 px-5 rounded-xl text-white text-sm font-bold transition ${
                        selectedLocales.includes(loc.id)
                          ? 'bg-[#871cca]'
                          : 'bg-purple-500 hover:bg-[#871cca]'
                      } focus:outline-purple-100`}
                      onClick={() => handleLocalSelection(loc.id)}
                      title={loc.codigo || loc.nombre}
                    >
                      {selectedLocales.includes(loc.id)
                        ? `${loc.nombre}✅`
                        : loc.nombre}
                    </button>
                  ))}
                  {locales.length === 0 && (
                    <div className="col-span-full text-sm text-gray-600 px-2">
                      No hay locales activos.
                    </div>
                  )}
                </div>

                {/* Usuarios filtrados por locales */}
                <div className="mb-6 px-6 py-4 bg-white rounded-lg shadow-md">
                  <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-gray-200">
                    {Array.isArray(users) && users.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {users.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-100"
                          >
                            <input
                              type="radio"
                              name="usuario_id"
                              value={user.id}
                              checked={
                                String(values.usuario_id) === String(user.id)
                              }
                              onChange={() =>
                                setFieldValue('usuario_id', user.id)
                              }
                              className="form-radio"
                              id={`user-${user.id}`}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="ml-3 text-gray-800 cursor-pointer truncate"
                              style={{ fontSize: '0.775rem' }}
                              title={
                                user.local?.nombre
                                  ? `${user.nombre} · ${user.local.nombre}`
                                  : user.nombre
                              }
                            >
                              {user.nombre}
                              {user.local?.nombre ? (
                                <span className="opacity-60">
                                  {' '}
                                  · {user.local.nombre}
                                </span>
                              ) : null}
                            </label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No hay usuarios disponibles
                      </p>
                    )}
                  </div>
                  {/* error de validación usuario_id */}
                  {errors.usuario_id && touched.usuario_id && (
                    <div className="mt-2">
                      <Alerta>{errors.usuario_id}</Alerta>
                    </div>
                  )}
                </div>

                {/* Campos de recaptación */}
                <div className="mb-3 px-4">
                  <label
                    htmlFor="nombre"
                    className="block font-medium left-0 mb-1"
                  >
                    <span className="text-black text-base pl-1">
                      Nombre del contacto
                    </span>
                  </label>
                  <Field
                    id="nombre"
                    name="nombre"
                    type="text"
                    className="mt-2 block w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-purple-500"
                    placeholder="Ingrese nombre del contacto"
                    maxLength={255}
                  />
                  {errors.nombre && touched.nombre && (
                    <Alerta>{errors.nombre}</Alerta>
                  )}
                </div>

                <div className="mb-3 px-4">
                  <label
                    htmlFor="tipo_contacto"
                    className="block font-medium left-0 mb-1"
                  >
                    <span className="text-black text-base pl-1">
                      Tipo de contacto
                    </span>
                  </label>
                  <Field
                    as="select"
                    id="tipo_contacto"
                    name="tipo_contacto"
                    className="mt-2 block w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-purple-500"
                    onChange={(e) => {
                      const value = e.target.value;
                      setFieldValue('tipo_contacto', value);
                      setMostrarOtro(value === 'Otro');
                    }}
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Socios que no asisten">
                      Socios que no asisten
                    </option>
                    <option value="Inactivo 10 dias">Inactivo 10 días</option>
                    <option value="Inactivo 30 dias">Inactivo 30 días</option>
                    <option value="Inactivo 60 dias">Inactivo 60 días</option>

                    <option value="Prosp inc Entrenadores">
                      Prosp inc Entrenadores
                    </option>
                    <option value="Leads no convertidos">
                      Leads no convertidos
                    </option>
                    <option value="Cambio de plan">Cambio de plan</option>
                    <option value="Otro">Otro</option>
                  </Field>
                  {errors.tipo_contacto && touched.tipo_contacto && (
                    <Alerta>{errors.tipo_contacto}</Alerta>
                  )}

                  <div className="mt-3">
                    <label
                      htmlFor="detalle_contacto"
                      className="block font-medium left-0 mb-1"
                    >
                      <span className="text-black text-base pl-1">
                        Detalle de contacto
                      </span>
                    </label>
                    <Field
                      name="detalle_contacto"
                      placeholder="Especifique el detalle de contacto"
                      className="block w-full p-3 text-black bg-slate-100 rounded-xl focus:outline-purple-500"
                      as="textarea"
                      rows={3}
                      maxLength={255}
                    />
                    {mostrarOtro && (
                      <p className="text-xs text-gray-500 mt-1">
                        Si elegiste “Otro”, describí brevemente el motivo.
                      </p>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <div className="sticky bottom-0 bg-white py-3 px-4">
                  <input
                    type="submit"
                    value={Rec ? 'Actualizar' : 'Crear Recaptación'}
                    className="w-full bg-purple-500 py-2 px-5 rounded-xl text-white font-bold hover:bg-[#871cca] focus:outline-purple-100"
                    onClick={() => setTextoModal('')}
                  />
                </div>
              </Form>
            </div>
          )}
        </Formik>
      </div>

      {/* Modales */}
      <ModalSuccess
        textoModal={textoModal}
        isVisible={showModal}
        onClose={() => setShowModal(false)}
      />
      <ModalError isVisible={errorModal} onClose={() => setErrorModal(false)} />
    </div>
  );
};

export default FormAltaRecaptacion;
