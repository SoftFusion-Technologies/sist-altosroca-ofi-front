import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ModalSuccess from './ModalSuccess';
import ModalError from './ModalError';
import Alerta from '../Error';
import { useAuth } from '../../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaRegTimesCircle,
  FaRegUser,
  FaFingerprint,
  FaBolt,
  FaPaperPlane
} from 'react-icons/fa';

function getApiBase() {
  return import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8080';
}

const tiposProspecto = [
  { value: 'Nuevo', label: 'Nuevo' },
  { value: 'ExSocio', label: 'ExSocio' }
];

const canales = [
  'Mostrador',
  'Whatsapp',
  'Instagram',
  'Facebook',
  'Pagina web',
  'Campaña',
  'Comentarios/Stickers'
];

const actividades = [
  'No especifica',
  'Musculación',
  'Pilates',
  'Clases grupales',
  'Pase full'
];

const campanias = ['Instagram', 'Whatsapp', 'Facebook', 'Otro'];

// ✅ Validación con Yup (incluye condicional para Campaña)
const schema = Yup.object().shape({
  nombre: Yup.string().trim().required('El nombre es obligatorio').max(255),
  dni: Yup.string()
    .trim()
    .max(20, 'Máximo 20 caracteres')
    .matches(/^[0-9]*$/, 'Solo números')
    .nullable(),
  tipo_prospecto: Yup.string()
    .oneOf(tiposProspecto.map((t) => t.value))
    .required('Seleccioná un tipo'),
  canal_contacto: Yup.string().oneOf(canales).required('Seleccioná un canal'),
  campania_origen: Yup.string().when('canal_contacto', {
    is: 'Campaña',
    then: (s) => s.required('Indicá el origen de la campaña')
  }),
  contacto: Yup.string().trim().required('El contacto es obligatorio').max(50),
  actividad: Yup.string()
    .oneOf(actividades)
    .required('Seleccioná una actividad'),
  observacion: Yup.string().max(255, 'Máximo 255 caracteres')
});

const FormAltaVentas = ({
  isOpen,
  onClose,
  Rec,
  setSelectedRecaptacion,
  Sede
}) => {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const { userName = '', userId } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [textoModal, setTextoModal] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      const { overflow } = document.body.style;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = overflow;
      };
    }
  }, [isOpen]);

  // Cerrar con Esc
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose?.();
      }
    };
    const overlayEl = overlayRef.current;
    overlayEl?.addEventListener('mousedown', handleClickOutside);
    return () =>
      overlayEl?.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const initialValues = {
    id: Rec?.id ?? null,
    usuario_id: userId,
    nombre: Rec?.nombre ?? '',
    dni: Rec?.dni ?? '',
    tipo_prospecto: Rec?.tipo_prospecto ?? '',
    canal_contacto: Rec?.canal_contacto ?? '',
    campania_origen: Rec?.campania_origen ?? '',
    contacto: Rec?.contacto ?? '',
    actividad: Rec?.actividad ?? '',
    sede: Sede,
    asesor_nombre: Rec?.asesor_nombre ?? userName ?? '',
    n_contacto_1: Rec?.n_contacto_1 ?? 0,
    n_contacto_2: Rec?.n_contacto_2 ?? 0,
    n_contacto_3: Rec?.n_contacto_3 ?? 0,
    clase_prueba_1_fecha: Rec?.clase_prueba_1_fecha ?? '',
    clase_prueba_1_obs: Rec?.clase_prueba_1_obs ?? '',
    clase_prueba_2_fecha: Rec?.clase_prueba_2_fecha ?? '',
    clase_prueba_2_obs: Rec?.clase_prueba_2_obs ?? '',
    clase_prueba_3_fecha: Rec?.clase_prueba_3_fecha ?? '',
    clase_prueba_3_obs: Rec?.clase_prueba_3_obs ?? '',
    convertido: Rec?.convertido ?? false,
    observacion: Rec?.observacion ?? ''
  };

  const handleSubmitProspecto = async (values, { resetForm }) => {
    try {
      setSubmitting(true);

      const payload = {
        usuario_id: userId,
        nombre: values.nombre,
        dni: values.dni || '',
        tipo_prospecto: values.tipo_prospecto,
        canal_contacto: values.canal_contacto,
        campania_origen:
          values.canal_contacto === 'Campaña'
            ? values.campania_origen || ''
            : '',
        contacto: values.contacto,
        actividad: values.actividad,
        sede: Sede,
        asesor_nombre: values.asesor_nombre || userName || '',
        n_contacto_1: Number(values.n_contacto_1 || 0),
        n_contacto_2: Number(values.n_contacto_2 || 0),
        n_contacto_3: Number(values.n_contacto_3 || 0),
        clase_prueba_1_fecha: values.clase_prueba_1_fecha || null,
        clase_prueba_1_obs: values.clase_prueba_1_obs || '',
        clase_prueba_2_fecha: values.clase_prueba_2_fecha || null,
        clase_prueba_2_obs: values.clase_prueba_2_obs || '',
        clase_prueba_3_fecha: values.clase_prueba_3_fecha || null,
        clase_prueba_3_obs: values.clase_prueba_3_obs || '',
        convertido: !!values.convertido,
        observacion: values.observacion || ''
      };

      const base = getApiBase();
      const url = values.id
        ? `${base}/ventas_prospectos/${values.id}`
        : `${base}/ventas_prospectos`;
      const method = values.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();

      setTextoModal(
        method === 'PUT' ? 'Prospecto actualizado' : 'Prospecto creado'
      );
      setShowModal(true);
      setTimeout(() => setShowModal(false), 1500);

      resetForm();
      setSelectedRecaptacion?.(null);
    } catch (err) {
      console.error(err);
      setErrorModal(true);
      setTimeout(() => setErrorModal(false), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Formulario de alta de prospecto"
          className="fixed inset-0 z-[999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fondo futurista con glow */}
          <div className="absolute inset-0 bg-black">
            <div className="absolute -top-24 -left-32 h-96 w-96 rounded-full blur-3xl opacity-30 bg-[radial-gradient(circle_at_center,rgba(252,75,8,0.8),transparent_60%)]" />
            <div className="absolute -bottom-24 -right-32 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_60%)]" />
            <div className="absolute inset-0 backdrop-blur-sm bg-black/50" />
          </div>

          {/* Panel */}
          <div className="relative z-10 flex min-h-full items-start justify-center p-4 sm:p-6">
            <motion.div
              ref={panelRef}
              className="w-full max-w-[820px] relative"
              initial={{ y: 20, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              {/* Borde con gradiente */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#871cca] via-white/40 to-[#871cca] opacity-70 blur-[2px]" />

              <div
                className="relative rounded-2xl bg-[#0b0b10]/95 text-white shadow-[0_0_40px_rgba(252,75,8,0.15)] ring-1 ring-white/10 overflow-hidden"
                style={{ maxHeight: 'min(92vh, 980px)' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-white/5">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#871cca] shadow-[0_0_10px_#871cca]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/60" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
                  </div>
                  <h2 className="text-lg font-semibold tracking-wide flex items-center gap-2">
                    <FaBolt className="opacity-80" /> Nuevo prospecto
                  </h2>
                  <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={onClose}
                    className="text-white/70 hover:text-white transition-colors text-xl leading-none p-1"
                  >
                    <FaRegTimesCircle />
                  </button>
                </div>

                {/* Body (scrollable) */}
                <div className="overflow-y-auto">
                  <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    validationSchema={schema}
                    onSubmit={handleSubmitProspecto}
                  >
                    {({ values }) => (
                      <Form className="p-5 sm:p-7">
                        {/* Grid responsive */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Nombre */}
                          <FieldGroup
                            label="Nombre del prospecto"
                            name="nombre"
                            icon={<FaRegUser />}
                          >
                            <Field
                              id="nombre"
                              name="nombre"
                              type="text"
                              placeholder="Ej: Juan Pérez"
                              className={inputClass}
                            />
                            <Error name="nombre" />
                          </FieldGroup>

                          {/* DNI */}
                          <FieldGroup
                            label="DNI"
                            name="dni"
                            icon={<FaFingerprint />}
                          >
                            <Field
                              id="dni"
                              name="dni"
                              type="text"
                              placeholder="Ej: 43849860"
                              className={inputClass}
                            />
                            <Error name="dni" />
                          </FieldGroup>

                          {/* Tipo prospecto */}
                          <FieldGroup
                            label="Tipo de prospecto"
                            name="tipo_prospecto"
                          >
                            <Field
                              as="select"
                              id="tipo_prospecto"
                              name="tipo_prospecto"
                              className={`${inputClass} ${selectClass}`}
                            >
                              <option value="">Seleccione tipo</option>
                              {tiposProspecto.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </Field>
                            <Error name="tipo_prospecto" />
                          </FieldGroup>

                          {/* Canal */}
                          <FieldGroup
                            label="Canal de contacto"
                            name="canal_contacto"
                          >
                            <Field
                              as="select"
                              id="canal_contacto"
                              name="canal_contacto"
                              className={`${inputClass} ${selectClass}`}
                            >
                              <option value="">Seleccione canal</option>
                              {canales.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </Field>
                            <Error name="canal_contacto" />
                          </FieldGroup>

                          {/* Origen de campaña (condicional) */}
                          {values.canal_contacto === 'Campaña' && (
                            <FieldGroup
                              label="Origen de la campaña"
                              name="campania_origen"
                              colSpan="full"
                            >
                              <Field
                                as="select"
                                id="campania_origen"
                                name="campania_origen"
                                className={`${inputClass} ${selectClass}`}
                              >
                                <option value="">Seleccione origen</option>
                                {campanias.map((c) => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </Field>
                              <Error name="campania_origen" />
                            </FieldGroup>
                          )}

                          {/* Contacto */}
                          <FieldGroup
                            label="Contacto (tel/usuario)"
                            name="contacto"
                          >
                            <Field
                              id="contacto"
                              name="contacto"
                              type="text"
                              placeholder="Ej: 381-555-1234"
                              className={inputClass}
                            />
                            <Error name="contacto" />
                          </FieldGroup>

                          {/* Actividad */}
                          <FieldGroup label="Actividad" name="actividad">
                            <Field
                              as="select"
                              id="actividad"
                              name="actividad"
                              className={`${inputClass} ${selectClass}`}
                            >
                              <option value="">Seleccione actividad</option>
                              {actividades.map((a) => (
                                <option key={a} value={a}>
                                  {a}
                                </option>
                              ))}
                            </Field>
                            <Error name="actividad" />
                          </FieldGroup>

                          {/* Observación (columna completa) */}
                          <FieldGroup
                            label="Observación"
                            name="observacion"
                            colSpan="full"
                          >
                            <Field
                              as="textarea"
                              id="observacion"
                              name="observacion"
                              rows={3}
                              placeholder="Agregá un comentario"
                              className={`${inputClass} resize-none min-h-[96px]`}
                            />
                            <Error name="observacion" />
                          </FieldGroup>
                        </div>

                        {/* Footer sticky */}
                        <div className="sticky bottom-0 pt-6 -mb-6">
                          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          <button
                            type="submit"
                            disabled={submitting}
                            className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 font-semibold tracking-wide transition-[transform,opacity,box-shadow] focus:outline-none focus:ring-2 focus:ring-[#871cca]/60 active:scale-[0.99]
                              ${
                                submitting
                                  ? 'bg-[#871cca]/60 text-white/90 shadow-[0_0_26px_rgba(252,75,8,0.25)]'
                                  : 'bg-gradient-to-r from-[#871cca] to-[#ff7a3d] text-white shadow-[0_10px_32px_-10px_rgba(252,75,8,0.55)] hover:opacity-95'
                              }
                            `}
                            title={
                              submitting
                                ? 'Guardando…'
                                : Rec
                                ? 'Actualizar'
                                : 'Crear prospecto'
                            }
                          >
                            <FaPaperPlane className="opacity-90" />
                            {submitting
                              ? 'Guardando…'
                              : Rec
                              ? 'Actualizar'
                              : 'Crear prospecto'}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </motion.div>
          </div>

          <ModalSuccess
            textoModal={textoModal}
            isVisible={showModal}
            onClose={() => setShowModal(false)}
          />
          <ModalError
            isVisible={errorModal}
            onClose={() => setErrorModal(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ── Helpers de UI ──────────────────────────────────────────────

const inputClass = [
  'w-full rounded-xl',
  'bg-white/[0.04] text-white placeholder-white/40',
  'border border-white/10 focus:border-white/20',
  'px-3.5 py-2.5',
  'outline-none',
  'transition',
  'focus:ring-2 focus:ring-[#871cca]/60',
  'shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]'
].join(' ');

const selectClass = [
  'bg-black text-white',
  'hover:bg-[#111]',
  'focus:border-white/20 focus:ring-2 focus:ring-[#871cca]/60'
].join(' ');

function FieldGroup({ label, name, children, colSpan, icon }) {
  return (
    <div className={colSpan === 'full' ? 'sm:col-span-2' : ''}>
      <label
        htmlFor={name}
        className=" text-sm font-medium text-white/80 mb-2 flex items-center gap-2"
      >
        {icon && <span className="text-white/70">{icon}</span>}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
}

function Error({ name }) {
  return (
    <ErrorMessage
      name={name}
      render={(msg) => (
        <div className="mt-2">
          <Alerta>
            <span className="text-white">{msg}</span>
          </Alerta>
        </div>
      )}
    />
  );
}

export default FormAltaVentas;
