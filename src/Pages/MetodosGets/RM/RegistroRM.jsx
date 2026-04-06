import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiActivity,
  FiTarget,
  FiMessageSquare
} from 'react-icons/fi';
import ModalSuccess from '../../../components/Forms/ModalSuccess';
import ModalError from '../../../components/Forms/ModalError';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.0
 *
 * Descripción:
 * Formulario de registro de RM rediseñado con identidad visual Altos Roca.
 * Se corrige la carga de ejercicios, se mejora la jerarquía visual y se
 * mantiene la lógica de guardado existente.
 *
 * Tema: Registro de RM
 * Capa: Frontend
 */

/* Benjamin Orellana - 06/04/2026 - Helpers visuales para alinear el formulario RM con la estética Altos Roca */
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15';

const labelClass =
  'mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55';

const sectionCardClass =
  'rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4';

export default function RegistroRM({ studentId, onClose }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEjercicios, setLoadingEjercicios] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        setLoadingEjercicios(true);

        const res = await axios.get('http://localhost:8080/api/ejercicios');
        const data = Array.isArray(res.data) ? res.data : [];

        setEjercicios(data);
      } catch (err) {
        console.warn(
          'No se pudo cargar la lista de ejercicios. Se utilizará una lista por defecto.'
        );
        setEjercicios([
          'Sentadilla',
          'Peso Muerto',
          'Press Banca',
          'Remo con Barra',
          'Press Militar',
          'Dominadas lastradas'
        ]);
      } finally {
        setLoadingEjercicios(false);
      }
    };

    fetchEjercicios();
  }, []);

  const formik = useFormik({
    initialValues: {
      ejercicio: '',
      peso_levantado: '',
      repeticiones: '',
      comentario: ''
    },
    validationSchema: Yup.object({
      ejercicio: Yup.string().required('Seleccione un ejercicio.'),
      peso_levantado: Yup.number()
        .min(1, 'Debe ser mayor a 0')
        .required('Ingrese un peso.'),
      repeticiones: Yup.number()
        .integer('Debe ser un número entero.')
        .min(1, 'Debe ser mayor a 0')
        .required('Ingrese repeticiones.')
    }),
    onSubmit: async (values) => {
      setError(null);
      setSuccessMsg(null);
      setLoading(true);

      try {
        const res = await axios.post('http://localhost:8080/student-rm', {
          student_id: studentId,
          ...values,
          comentario: values.comentario.trim() || null
        });

        if (res.status !== 200) {
          throw new Error('Error al registrar RM');
        }

        setSuccessMsg('RM guardado correctamente');
        setShowModal(true);

        formik.resetForm();

        setTimeout(() => {
          setShowModal(false);
          onClose(true);
        }, 1200);
      } catch (err) {
        const mensaje =
          err.response?.data?.mensajeError || 'Error al guardar el registro RM';
        setError(mensaje);
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className="space-y-5">
      <div className="rounded-[26px] border border-white/10 bg-[linear-gradient(145deg,rgba(239,51,71,0.12)_0%,rgba(255,255,255,0.025)_46%,rgba(0,0,0,0.45)_100%)] p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#ef3347]/20 bg-[#ef3347]/10 px-4 py-1 text-[11px] uppercase tracking-[0.24em] text-[#ff98a5]">
            Fuerza máxima
          </span>

          <span className="text-[22px] uppercase leading-none text-[#ff5a6f]">
            Altos Roca
          </span>
        </div>

        <h3 className="mt-4 text-2xl font-black uppercase tracking-tight text-white">
          Registrar RM
        </h3>

        <p className="mt-2 text-sm leading-6 text-white/60">
          Cargá una nueva marca máxima del alumno con una experiencia más clara,
          moderna y alineada al ecosistema Altos Roca.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className={sectionCardClass}>
          <label htmlFor="ejercicio" className={labelClass}>
            <FiActivity />
            Ejercicio
          </label>

          <select
            name="ejercicio"
            id="ejercicio"
            value={formik.values.ejercicio}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputClass}
            disabled={loadingEjercicios}
          >
            <option value="" className="text-slate-900">
              {loadingEjercicios
                ? 'Cargando ejercicios...'
                : 'Seleccione un ejercicio'}
            </option>
            {ejercicios.map((e, i) => (
              <option key={i} value={e} className="text-slate-900">
                {e}
              </option>
            ))}
          </select>

          {formik.touched.ejercicio && formik.errors.ejercicio && (
            <p className="mt-2 text-sm text-red-300">
              {formik.errors.ejercicio}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={sectionCardClass}>
            <label htmlFor="peso_levantado" className={labelClass}>
              <FiTarget />
              Peso levantado
            </label>

            <input
              type="number"
              name="peso_levantado"
              step="0.01"
              value={formik.values.peso_levantado}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ej. 100"
              className={inputClass}
            />

            {formik.touched.peso_levantado && formik.errors.peso_levantado && (
              <p className="mt-2 text-sm text-red-300">
                {formik.errors.peso_levantado}
              </p>
            )}
          </div>

          <div className={sectionCardClass}>
            <label htmlFor="repeticiones" className={labelClass}>
              <FiTarget />
              Repeticiones
            </label>

            <input
              type="number"
              name="repeticiones"
              min="1"
              step="1"
              value={formik.values.repeticiones}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Ej. 3"
              className={inputClass}
            />

            {formik.touched.repeticiones && formik.errors.repeticiones && (
              <p className="mt-2 text-sm text-red-300">
                {formik.errors.repeticiones}
              </p>
            )}
          </div>
        </div>

        <div className={sectionCardClass}>
          <label htmlFor="comentario" className={labelClass}>
            <FiMessageSquare />
            Comentario
          </label>

          <textarea
            name="comentario"
            rows={4}
            value={formik.values.comentario}
            onChange={formik.handleChange}
            placeholder="Observaciones del intento, sensaciones, técnica o contexto."
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <FiAlertCircle className="text-lg" />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <FiCheckCircle className="text-lg" />
            {successMsg}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || loadingEjercicios}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-white transition ${
              loading || loadingEjercicios
                ? 'cursor-not-allowed border border-white/10 bg-white/[0.08] text-white/40'
                : 'border border-[#ef3347]/20 bg-[linear-gradient(135deg,#5a0912_0%,#d11f2f_52%,#ef3347_100%)] hover:scale-[1.01]'
            }`}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin text-lg" />
                Registrando...
              </>
            ) : (
              <>
                <FiCheckCircle className="text-lg" />
                Registrar RM
              </>
            )}
          </button>
        </div>

        <ModalSuccess
          textoModal="RM guardado con éxito"
          isVisible={showModal}
          onClose={() => setShowModal(false)}
        />

        <ModalError
          isVisible={errorModal}
          onClose={() => setErrorModal(false)}
        />
      </form>
    </div>
  );
}
