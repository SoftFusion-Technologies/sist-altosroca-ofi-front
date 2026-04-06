import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ParticlesBackground from '../../../../components/ParticlesBackground';
import { useAuth } from '../../../../AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 06/04/2026
 * Versión: 1.1
 *
 * Descripción:
 * Modal de objetivo mensual del alumno.
 * Se mantiene la estructura visual original y se adapta la paleta
 * a la identidad Altos Roca, mejorando además la visibilidad de texto
 * en textarea e inputs.
 *
 * Tema: Objetivos mensuales del alumno
 * Capa: Frontend
 */

/* Benjamin Orellana - 06/04/2026 - Ajuste visual a paleta Altos Roca y corrección de visibilidad en campos de formulario */
const StudentGoalModal = ({ studentId, onGoalCreated }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [goal, setGoal] = useState('');
  const [alturaCm, setAlturaCm] = useState('');
  const [pesoKg, setPesoKg] = useState('');
  const [edad, setEdad] = useState('');
  const [grasaCorporal, setGrasaCorporal] = useState('');
  const [cinturaCm, setCinturaCm] = useState('');
  const [imc, setImc] = useState('');
  const [esRedefinicion, setEsRedefinicion] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Ahora son 6 pasos (sin control antropométrico)
  const [step, setStep] = useState(1);

  const { nomyape } = useAuth();
  const URL = 'http://localhost:8080';

  // Carga inicial: objetivo actual o valores previos
  useEffect(() => {
    if (!studentId) return;

    const fetchGoal = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        let res = await axios.get(
          `${URL}/student-monthly-goals?student_id=${studentId}&mes=${month}&anio=${year}`
        );

        if (res.data && res.data.length > 0) {
          const currentGoal = res.data[0];
          setEsRedefinicion(true);
          setGoal(currentGoal.objetivo || '');
          setAlturaCm(currentGoal.altura_cm || '');
          setPesoKg(currentGoal.peso_kg || '');
          setEdad(currentGoal.edad || '');
          setGrasaCorporal(currentGoal.grasa_corporal || '');
          setCinturaCm(currentGoal.cintura_cm || '');
          setModalOpen(false);
        } else {
          // Buscar el mes anterior
          let prevMonth = month - 1;
          let prevYear = year;
          if (prevMonth === 0) {
            prevMonth = 12;
            prevYear = year - 1;
          }

          res = await axios.get(
            `${URL}/student-monthly-goals?student_id=${studentId}&mes=${prevMonth}&anio=${prevYear}`
          );

          if (res.data && res.data.length > 0) {
            const prevGoal = res.data[0];
            setEsRedefinicion(false);
            setGoal('');
            setAlturaCm(prevGoal.altura_cm || '');
            setPesoKg(prevGoal.peso_kg || '');
            setEdad(prevGoal.edad || '');
            setGrasaCorporal(prevGoal.grasa_corporal || '');
            setCinturaCm(prevGoal.cintura_cm || '');
          } else {
            setEsRedefinicion(false);
            setGoal('');
            setAlturaCm('');
            setPesoKg('');
            setEdad('');
            setGrasaCorporal('');
            setCinturaCm('');
          }

          setModalOpen(true);
        }
      } catch (error) {
        console.error('Error al consultar objetivo mensual:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [studentId]);

  // Cálculo IMC y grasa estimada
  useEffect(() => {
    if (pesoKg && alturaCm && edad) {
      const alturaEnMetros = alturaCm / 100;
      const _imc = pesoKg / (alturaEnMetros * alturaEnMetros);
      setImc(_imc.toFixed(2));
      const grasa = (1.2 * _imc + 0.23 * edad - 5.4).toFixed(2);
      setGrasaCorporal(grasa);
    }
  }, [pesoKg, alturaCm, edad]);

  // Abrir modal si no hay objetivo del mes
  useEffect(() => {
    if (!studentId) return;

    const fetchGoal = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const res = await axios.get(
          `${URL}/student-monthly-goals?student_id=${studentId}&mes=${month}&anio=${year}`
        );

        if (!res.data || res.data.length === 0) {
          setModalOpen(true);
        }
      } catch (error) {
        console.error('Error al consultar objetivo mensual:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!goal.trim()) return alert('Por favor, ingrese un objetivo válido.');

    setSaving(true);
    try {
      const now = new Date();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      await axios.post(`${URL}/student-monthly-goals`, {
        student_id: studentId,
        objetivo: goal,
        mes: month,
        anio: year,
        altura_cm: alturaCm || null,
        peso_kg: pesoKg || null,
        edad: edad || null,
        grasa_corporal: grasaCorporal || null,
        cintura_cm: cinturaCm || null
      });

      setModalOpen(false);
      setGoal('');

      onGoalCreated && onGoalCreated();
      alert('Objetivo guardado correctamente.');
    } catch (error) {
      console.error('Error al guardar objetivo mensual:', error);
      alert('Error al guardar el objetivo, intente nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  // Textos adaptados a 6 pasos (sin control antropométrico)
  const mensajes = {
    nuevo: {
      1: 'Hola {nomyape}, empecemos por definir tu objetivo para este mes. ¿Qué te gustaría lograr?',
      2: '{nomyape}, contanos cuál es tu altura en centímetros para personalizar tu plan.',
      3: 'Perfecto, {nomyape}. Ahora ingresá tu peso actual en kilogramos.',
      4: 'Gracias, {nomyape}. ¿Cuál es tu edad?',
      5: '{nomyape}, ingresá tu medida de cintura en centímetros (opcional).',
      6: 'Listo {nomyape}. Este es el resumen con toda la información que cargaste.'
    },
    redefinir: {
      1: 'Hola de nuevo {nomyape}, ¿querés actualizar tu objetivo mensual?',
      2: '{nomyape}, podés modificar tu altura si cambió o continuar igual.',
      3: '{nomyape}, ¿querés actualizar tu peso actual en kilogramos?',
      4: '¿Tu edad sigue siendo la misma, {nomyape}?',
      5: '{nomyape}, si cambió tu cintura podés actualizar el valor en centímetros (opcional).',
      6: 'Perfecto {nomyape}, actualizamos tu información.'
    }
  };

  const primerNombre = (nomyape || '').split(' ')[0];
  const mensajeActual = mensajes[esRedefinicion ? 'redefinir' : 'nuevo'][step];

  if (loading) return null;

  return (
    <>
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <ParticlesBackground />

          <div className="bg-white rounded-xl shadow-[0_25px_70px_-22px_rgba(209,31,47,0.35)] border border-red-100 max-w-lg w-full p-8 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#d11f2f] transition"
              aria-label="Cerrar modal"
            >
              ✖
            </button>

            <AnimatePresence mode="wait">
              {mensajeActual && (
                <motion.h2
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="titulo text-xl uppercase font-semibold mb-5 text-center text-[#111111]"
                  dangerouslySetInnerHTML={{
                    __html: mensajeActual.replace(
                      '{nomyape}',
                      `<span class="text-[#d11f2f] titulo font-semibold">${primerNombre}</span>`
                    )
                  }}
                />
              )}
            </AnimatePresence>

            <div className="max-w-xl mx-auto">
              <div className="w-full bg-red-50 h-3 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-[#7f101c] via-[#d11f2f] to-[#ef3347] h-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {step === 1 && (
                      <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-800">
                          Objetivo
                        </label>
                        <textarea
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          placeholder="Define un objetivo claro y medible para este mes."
                          rows={3}
                          className="w-full border border-red-100 rounded-lg p-4 text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                          required
                        />
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mb-4">
                        <input
                          type="number"
                          placeholder="Altura (cm)"
                          value={alturaCm}
                          onChange={(e) => setAlturaCm(Number(e.target.value))}
                          className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                          required
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div className="mb-4">
                        <input
                          type="number"
                          placeholder="Peso (kg)"
                          value={pesoKg}
                          onChange={(e) => setPesoKg(Number(e.target.value))}
                          className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                          required
                        />
                      </div>
                    )}

                    {step === 4 && (
                      <div className="mb-4">
                        <input
                          type="number"
                          placeholder="Edad"
                          value={edad}
                          onChange={(e) => setEdad(Number(e.target.value))}
                          className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                          required
                        />
                      </div>
                    )}

                    {step === 5 && (
                      <div className="mb-4 space-y-2">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Cintura (cm) — opcional"
                          value={cinturaCm}
                          onChange={(e) => setCinturaCm(e.target.value)}
                          className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setCinturaCm(null);
                            setStep(6);
                          }}
                          className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#111111] font-semibold transition"
                        >
                          Omitir este paso
                        </button>
                      </div>
                    )}

                    {step === 6 && (
                      <div className="mb-4 space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Objetivo
                          </label>
                          <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            rows={2}
                            className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Altura (cm)
                            </label>
                            <input
                              type="number"
                              value={alturaCm}
                              onChange={(e) =>
                                setAlturaCm(Number(e.target.value))
                              }
                              className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Peso (kg)
                            </label>
                            <input
                              type="number"
                              value={pesoKg}
                              onChange={(e) =>
                                setPesoKg(Number(e.target.value))
                              }
                              className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Edad
                            </label>
                            <input
                              type="number"
                              value={edad}
                              onChange={(e) => setEdad(Number(e.target.value))}
                              className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Cintura (cm)
                            </label>
                            <input
                              type="number"
                              value={cinturaCm || ''}
                              onChange={(e) => setCinturaCm(e.target.value)}
                              className="w-full border border-red-100 p-2 rounded text-gray-800 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#d11f2f]/20 focus:border-[#d11f2f]"
                            />
                          </div>
                        </div>

                        <div className="text-center mt-4">
                          <div className="text-lg font-medium text-gray-800">
                            Tu IMC es:{' '}
                            <span className="font-bold text-[#d11f2f]">
                              {imc}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Grasa corporal estimada:{' '}
                            <span className="font-semibold">
                              {grasaCorporal}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-4 mt-6">
                      {step > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setStep((prev) => Math.max(prev - 1, 1))
                          }
                          className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-[#111111] font-semibold transition"
                        >
                          Anterior
                        </button>
                      )}

                      {step < 6 && (
                        <button
                          type="button"
                          onClick={() =>
                            setStep((prev) => Math.min(prev + 1, 6))
                          }
                          disabled={
                            (step === 1 && !goal.trim()) ||
                            (step === 2 && alturaCm <= 0) ||
                            (step === 3 && pesoKg <= 0) ||
                            (step === 4 && edad <= 0)
                          }
                          className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                            (step === 1 && !goal.trim()) ||
                            (step === 2 && alturaCm <= 0) ||
                            (step === 3 && pesoKg <= 0) ||
                            (step === 4 && edad <= 0)
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#d11f2f] hover:bg-[#b71c2b]'
                          }`}
                        >
                          Siguiente
                        </button>
                      )}

                      {step === 6 && (
                        <button
                          type="submit"
                          disabled={saving}
                          className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                            saving
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-[#d11f2f] hover:bg-[#b71c2b]'
                          }`}
                        >
                          {saving ? 'Guardando...' : 'Guardar Objetivo'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentGoalModal;
