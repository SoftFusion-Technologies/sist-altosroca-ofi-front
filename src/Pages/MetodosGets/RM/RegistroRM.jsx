import React, { useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiLoader,
  FiActivity,
  FiTarget,
  FiMessageSquare,
  FiCalendar,
  FiTrendingUp
} from 'react-icons/fi';
import ModalSuccess from '../../../components/Forms/ModalSuccess';
import ModalError from '../../../components/Forms/ModalError';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 2.1
 *
 * Descripción:
 * Formulario de registro de RM adaptado al backend actual del módulo.
 * Se agrega fecha, preview de RM estimada, manejo de validaciones nuevas
 * y feedback más preciso sin alterar la estética general.
 *
 * Tema: Registro de RM
 * Capa: Frontend
 */

/* Benjamin Orellana - 2026/04/11 - URL base del backend para el módulo RM */
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/* Benjamin Orellana - 2026/04/11 - Helpers visuales para alinear el formulario RM con la estética Altos Roca */
const inputClass =
  'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 transition focus:border-[#ef3347]/25 focus:ring-2 focus:ring-[#ef3347]/15';

const labelClass =
  'mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/55';

const sectionCardClass =
  'rounded-[24px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-4';

/* Benjamin Orellana - 2026/04/11 - Lista local de respaldo para ejercicios cuando la API no responde */
const ejerciciosFallback = [
  'Sentadilla',
  'Peso Muerto',
  'Press Banca',
  'Remo con Barra',
  'Press Militar',
  'Dominadas lastradas'
];

/* Benjamin Orellana - 2026/04/11 - Formatea la fecha actual en YYYY-MM-DD para el input del formulario */
const getTodayInputValue = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

/* Benjamin Orellana - 2026/04/11 - Convierte valores numéricos del formulario a número seguro */
const toNumberOrNull = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

/* Benjamin Orellana - 2026/04/11 - Calcula la RM estimada en frontend para preview inmediato */
const calcularRmEstimada = (peso, reps) => {
  const pesoNum = toNumberOrNull(peso);
  const repsNum = parseInt(reps || 0, 10);

  if (!pesoNum || !Number.isFinite(repsNum) || repsNum <= 0) return null;
  if (repsNum === 1) return Math.round((pesoNum + Number.EPSILON) * 100) / 100;

  return (
    Math.round((pesoNum * (1 + repsNum / 30) + Number.EPSILON) * 100) / 100
  );
};

/* Benjamin Orellana - 2026/04/11 - Formatea kilos para la preview del formulario */
const formatKg = (value) => {
  const n = toNumberOrNull(value);
  if (n === null) return '—';

  return `${n.toLocaleString('es-AR', {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  })} kg`;
};

/* Benjamin Orellana - 2026/04/11 - Normaliza respuesta de ejercicios cuando la API devuelve objetos o strings */
const normalizarEjercicios = (data) => {
  if (!Array.isArray(data)) return ejerciciosFallback;

  const mapped = data
    .map((item) => {
      if (typeof item === 'string') return item;
      if (item?.nombre) return item.nombre;
      if (item?.ejercicio) return item.ejercicio;
      if (item?.name) return item.name;
      return null;
    })
    .filter(Boolean);

  return mapped.length ? mapped : ejerciciosFallback;
};

export default function RegistroRM({ studentId, onClose }) {
  const [ejercicios, setEjercicios] = useState([]);
  const [error, setError] = useState(null);
  const [errorMotivos, setErrorMotivos] = useState([]);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEjercicios, setLoadingEjercicios] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        setLoadingEjercicios(true);

        const res = await axios.get(`${BASE_URL}/catalogo-ejercicios`);
        setEjercicios(normalizarEjercicios(res.data));
      } catch (err) {
        console.warn(
          'No se pudo cargar la lista de ejercicios. Se utilizará una lista por defecto.'
        );
        setEjercicios(ejerciciosFallback);
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
      fecha: getTodayInputValue(),
      comentario: ''
    },
    validationSchema: Yup.object({
      ejercicio: Yup.string().required('Seleccione un ejercicio.'),
      peso_levantado: Yup.number()
        .typeError('Ingrese un número válido.')
        .min(0.01, 'Debe ser mayor a 0')
        .required('Ingrese un peso.'),
      repeticiones: Yup.number()
        .typeError('Ingrese un número válido.')
        .integer('Debe ser un número entero.')
        .min(1, 'Debe ser mayor a 0')
        .required('Ingrese repeticiones.'),
      fecha: Yup.string().required('Seleccione una fecha.')
    }),
    onSubmit: async (values) => {
      setError(null);
      setErrorMotivos([]);
      setSuccessMsg(null);
      setLoading(true);

      try {
        const payload = {
          student_id: studentId,
          ejercicio: values.ejercicio,
          peso_levantado: Number(values.peso_levantado),
          repeticiones: Number(values.repeticiones),
          fecha: values.fecha,
          comentario: values.comentario.trim() || null
        };

        const res = await axios.post(`${BASE_URL}/student-rm`, payload);

        if (res.status !== 200) {
          throw new Error('Error al registrar RM');
        }

        setSuccessMsg('RM guardado correctamente');
        setShowModal(true);

        formik.resetForm({
          values: {
            ejercicio: '',
            peso_levantado: '',
            repeticiones: '',
            fecha: getTodayInputValue(),
            comentario: ''
          }
        });

        setTimeout(() => {
          setShowModal(false);
          onClose(true);
        }, 1200);
      } catch (err) {
        const mensaje =
          err.response?.data?.mensajeError || 'Error al guardar el registro RM';

        const motivos = Array.isArray(err.response?.data?.motivos)
          ? err.response.data.motivos
          : [];

        setError(mensaje);
        setErrorMotivos(motivos);
        setErrorModal(true);
      } finally {
        setLoading(false);
      }
    }
  });

  /* Benjamin Orellana - 2026/04/11 - Preview memoizada de RM estimada para mostrar feedback inmediato al usuario */
  const rmPreview = useMemo(
    () =>
      calcularRmEstimada(
        formik.values.peso_levantado,
        formik.values.repeticiones
      ),
    [formik.values.peso_levantado, formik.values.repeticiones]
  );

  return (
    <div className="space-y-5">

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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={sectionCardClass}>
            <label htmlFor="peso_levantado" className={labelClass}>
              <FiTarget />
              Peso levantado
            </label>

            <input
              type="number"
              name="peso_levantado"
              step="0.01"
              min="0"
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className={sectionCardClass}>
            <label htmlFor="fecha" className={labelClass}>
              <FiCalendar />
              Fecha
            </label>

            <input
              type="date"
              name="fecha"
              value={formik.values.fecha}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            />

            {formik.touched.fecha && formik.errors.fecha && (
              <p className="mt-2 text-sm text-red-300">{formik.errors.fecha}</p>
            )}
          </div>

          <div className={sectionCardClass}>
            <label className={labelClass}>
              <FiTrendingUp />
              RM estimada
            </label>

            <div className="flex h-[50px] items-center rounded-2xl border border-white/10 bg-black/20 px-4">
              <span className="text-base font-bold text-white">
                {formatKg(rmPreview)}
              </span>
            </div>
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
            onBlur={formik.handleBlur}
            placeholder="Observaciones del intento."
            className={`${inputClass} resize-none`}
          />
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            <div className="flex items-start gap-2">
              <FiAlertCircle className="mt-0.5 text-lg shrink-0" />
              <div className="min-w-0">
                <p>{error}</p>

                {errorMotivos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {errorMotivos.map((motivo, index) => (
                      <p
                        key={`${motivo}-${index}`}
                        className="text-xs text-red-200/90"
                      >
                        {motivo}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <FiCheckCircle className="text-lg" />
            {successMsg}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
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
