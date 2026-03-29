import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion } from 'framer-motion';
import {
  FaWhatsapp,
  FaDumbbell,
  FaUser,
  FaIdCard,
  FaPhone
} from 'react-icons/fa';
import { CgGym } from 'react-icons/cg';
import ParticlesBackground from '../../components/ParticlesBackground';
import Swal from 'sweetalert2';

const ClasePrueba = () => {
  // Define el esquema de validación con Yup
  const validationSchema = Yup.object({
    nombre: Yup.string()
      .min(3, 'Debe tener al menos 3 caracteres')
      .required('El nombre es obligatorio'),
    apellido: Yup.string()
      .min(3, 'Debe tener al menos 3 caracteres')
      .required('El apellido es obligatorio'),
    dni: Yup.string()
      .matches(/^[0-9]+$/, 'El DNI solo debe contener números')
      .min(7, 'El DNI debe tener entre 7 y 8 dígitos')
      .max(8, 'El DNI debe tener entre 7 y 8 dígitos')
      .required('El DNI es obligatorio'),
    telefono: Yup.string()
      .matches(/^[0-9]+$/, 'El teléfono solo debe contener números')
      .min(10, 'Debe tener al menos 10 dígitos')
      .required('El número de teléfono es obligatorio'),
    objetivos: Yup.string()
      .oneOf(
        [
          'perder_peso',
          'ganar_musculo',
          'mejorar_resistencia',
          'salud_general'
        ],
        'Selecciona un objetivo válido'
      )
      .required('Debes seleccionar un objetivo')
  });

  // useFormik (actualizado)
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      dni: '',
      telefono: '',
      objetivos: '',
      sede: 'Infinity Gym SMT'
    },
    validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      const payload = {
        name: values.nombre,
        last_name: values.apellido,
        dni: values.dni,
        celular: values.telefono,
        sede: values.sede,
        objetivo: values.objetivos,
        user: null,
        observaciones: null,
        state: 'nuevo',
        movido_a_ventas: 0,
        usuario_movido_id: null,
        fecha_movido: null
      };

      try {
        setSubmitting(true);

        // Loader mientras se hace el POST
        Swal.fire({
          title: 'Enviando...',
          html: 'Estamos registrando tu solicitud',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          background: 'rgba(15,18,36,0.95)',
          color: '#e5e7eb',
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const res = await fetch('http://localhost:8080/testclass', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        let data = null;
        try {
          data = await res.json();
        } catch {}

        if (!res.ok) {
          const msg = data?.message || 'Error creando la clase de prueba';
          throw new Error(msg);
        }

        // Éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Listo!',
          text: 'Recibimos tu solicitud. Te contactamos pronto.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#871cca',
          background: 'rgba(15,18,36,0.95)',
          color: '#e5e7eb'
        });

        resetForm({
          values: {
            nombre: '',
            apellido: '',
            dni: '',
            telefono: '',
            objetivos: '',
            sede: 'Infinity Gym SMT'
          }
        });
      } catch (e) {
        console.error(e);
        await Swal.fire({
          icon: 'error',
          title: 'No pudimos registrar tu solicitud',
          text: e.message || 'Intenta de nuevo en unos minutos.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#871cca',
          background: 'rgba(15,18,36,0.95)',
          color: '#e5e7eb'
        });
      } finally {
        setSubmitting(false);
      }
    }
  });

  const renderError = (field) =>
    formik.touched[field] &&
    formik.errors[field] && (
      <p className="text-red-400 text-sm mt-1">{formik.errors[field]}</p>
    );

  // Objeto para definir los campos del formulario
  const formFields = [
    { name: 'nombre', label: 'Nombre', type: 'text', icon: FaUser },
    { name: 'apellido', label: 'Apellido', type: 'text', icon: FaUser },
    { name: 'dni', label: 'DNI', type: 'text', icon: FaIdCard },
    {
      name: 'telefono',
      label: 'Número de Teléfono',
      type: 'tel',
      icon: FaPhone
    },

    {
      name: 'sede',
      label: 'Sede',
      type: 'select',
      icon: CgGym,
      options: [{ value: 'Infinity Gym SMT', label: 'Infinity Gym SMT' }]
    },
    {
      name: 'objetivos',
      label: '¿Cuál es tu principal objetivo?',
      type: 'select',
      icon: CgGym,
      options: [
        { value: '', label: 'Selecciona una opción' },
        { value: 'perder_peso', label: 'Perder peso' },
        { value: 'ganar_musculo', label: 'Ganar masa muscular' },
        { value: 'mejorar_resistencia', label: 'Mejorar resistencia' },
        { value: 'salud_general', label: 'Salud y bienestar general' }
      ]
    }
  ];

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative isolate overflow-hidden bg-black text-white min-h-screen py-24">
      {/* Fondo galáctico */}
      <ParticlesBackground />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-2xl opacity-60"
      >
        <div className="absolute -top-24 -left-24 size-[36rem] rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]" />
        <div className="absolute -bottom-24 -right-20 size-[40rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_60%)]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          WebkitMaskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(60% 50% at 50% 40%, rgba(0,0,0,1) 36%, rgba(0,0,0,0) 100%)'
        }}
      />

      <div className="relative z-10 flex items-center justify-center px-2 mt-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl w-full"
        >
          {/* Contenedor principal con el mismo estilo que las otras páginas */}
          <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            {/* Aurora suave */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 -left-20 size-[28rem] rounded-full blur-2xl opacity-60 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(59,130,246,0.12),rgba(6,182,212,0.10),rgba(99,102,241,0.10),transparent,rgba(6,182,212,0.10))]"
            />

            {/* Ribete metálico */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
            />

            <div className="relative z-10 p-8">
              {/* Encabezado */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <FaDumbbell className="text-3xl text-gray-300" />
                  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    TU PRIMERA{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-400">
                      CLASE GRATIS
                    </span>
                  </h1>
                </div>
                <p className="text-gray-300 text-lg">
                  Completa el formulario y da el primer paso hacia tu mejor
                  versión.
                </p>
              </motion.div>

              {/* Formulario */}
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.name}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2"
                    >
                      <field.icon className="text-gray-400" />
                      {field.label}
                    </label>

                    {field.type === 'select' ? (
                      <select
                        id={field.name}
                        name={field.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[field.name]}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300/30 focus:border-transparent transition-all backdrop-blur-sm"
                      >
                        {field.options.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                            className="bg-gray-900 text-white"
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values[field.name]}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300/30 focus:border-transparent transition-all backdrop-blur-sm"
                        placeholder={`Ingresa tu ${field.label.toLowerCase()}`}
                      />
                    )}
                    {renderError(field.name)}
                  </motion.div>
                ))}

                <motion.div variants={itemVariants}>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 font-bold text-gray-900 rounded-lg text-lg
                               bg-gradient-to-r from-gray-100 via-gray-200 to-gray-400
                               transition-all duration-200 hover:brightness-110 hover:-translate-y-[2px] active:translate-y-0
                               shadow-[0_0_18px_rgba(255,255,255,0.55)] relative overflow-hidden"
                  >
                    <span className="relative z-10 uppercase tracking-wide">
                      SOLICITAR CLASE GRATIS
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </motion.div>
              </form>

              {/* Sección de WhatsApp */}
              <motion.div
                variants={itemVariants}
                className="text-center mt-8 pt-6 border-t border-white/10"
              >
                <p className="text-gray-400 text-sm mb-4">
                  ¿Prefieres contactarnos directamente?
                </p>
                <a
                  href="https://wa.me/3854382934"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-green-600/20 border border-green-500/30 backdrop-blur-sm px-6 py-3 text-green-400 font-semibold hover:bg-green-600/30 hover:border-green-500/50 transition-all duration-200 hover:-translate-y-[1px]"
                >
                  <FaWhatsapp size={20} />
                  <span>Chatear por WhatsApp</span>
                </a>
              </motion.div>
            </div>

            {/* Línea base metálica */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 opacity-35 rounded-b-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClasePrueba;
