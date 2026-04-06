import React, { useState, useEffect, useRef } from 'react';
import {
  FaTimes,
  FaPlus,
  FaDumbbell,
  FaLayerGroup,
  FaCalendarAlt,
  FaClock,
  FaPalette,
  FaCopy,
  FaSave
} from 'react-icons/fa';
import clsx from 'clsx';
import AutocompleteEjercicio from '../../Components/AutocompleteEjercicio';
import SeriesSelector from '../../Components/SeriesSelector';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(tz);

const TZ = 'America/Argentina/Tucuman';

const generarNombreRutina = () => {
  const fecha = new Date().toLocaleDateString('es-AR');
  return `Rutina del ${fecha}`;
};

const hoy = new Date().toISOString().split('T')[0];

const ModalCrearRutina = ({ studentId, userId, onClose, onRutinaCreada }) => {
  const [nombre, setNombre] = useState(generarNombreRutina());
  const [fecha, setFecha] = useState(hoy);
  const [desde, setDesde] = useState(new Date().toISOString().slice(0, 16));
  const [hasta, setHasta] = useState('');
  const [bloques, setBloques] = useState([
    {
      nombre: 'BLOQUE 1',
      orden: 1,
      color_id: null,
      ejercicios: [
        {
          nombre: '',
          seriesCantidad: '',
          series: [
            {
              numero_serie: 1,
              repeticiones: '',
              descanso: '',
              tiempo: '',
              kg: ''
            }
          ]
        }
      ]
    }
  ]);

  const [modalColorIdx, setModalColorIdx] = useState(null);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);

  const modalRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8080/rutina-colores')
      .then((res) => res.json())
      .then(setColoresDisponibles);
  }, []);

  const agregarBloque = () => {
    const nuevoBloque = {
      nombre: `BLOQUE ${bloques.length + 1}`,
      orden: bloques.length + 1,
      color_id: null,
      ejercicios: [
        {
          nombre: '',
          seriesCantidad: 1,
          series: [
            {
              numero_serie: 1,
              repeticiones: '',
              descanso: '',
              tiempo: '',
              kg: ''
            }
          ]
        }
      ]
    };
    setBloques([...bloques, nuevoBloque]);
  };

  const agregarEjercicio = (bloqueIdx) => {
    setBloques((prev) => {
      const nuevosBloques = [...prev];
      const bloque = { ...nuevosBloques[bloqueIdx] };
      const ejerciciosActuales = [...bloque.ejercicios];

      const nuevoOrden = ejerciciosActuales.length + 1;

      ejerciciosActuales.push({
        nombre: '',
        seriesCantidad: 1,
        orden: nuevoOrden,
        notas: '',
        series: [
          {
            numero_serie: 1,
            repeticiones: '',
            descanso: '',
            tiempo: '',
            kg: ''
          }
        ]
      });

      bloque.ejercicios = ejerciciosActuales;
      nuevosBloques[bloqueIdx] = bloque;

      return nuevosBloques;
    });
  };

  const actualizarEjercicio = (bloqueIdx, ejIdx, campo, valor) => {
    setBloques((prev) => {
      const nuevos = [...prev];
      const ejercicio = nuevos[bloqueIdx].ejercicios[ejIdx];

      if (campo === 'seriesCantidad') {
        // Permitir escritura libre
        ejercicio.seriesCantidad = valor;

        const cant = parseInt(valor);

        // Solo actualizar si es un número válido entre 1 y 10
        if (!isNaN(cant) && cant > 0 && cant <= 10) {
          // Inicializar backup si no existe
          if (!ejercicio.todasLasSeries) {
            ejercicio.todasLasSeries = ejercicio.series;
          }

          // Agregar series si faltan
          while (ejercicio.todasLasSeries.length < cant) {
            ejercicio.todasLasSeries.push({
              numero_serie: ejercicio.todasLasSeries.length + 1,
              repeticiones: '',
              descanso: '',
              tiempo: '',
              kg: ''
            });
          }

          // Mostrar solo las necesarias
          ejercicio.series = ejercicio.todasLasSeries.slice(0, cant);
        }
      } else {
        ejercicio[campo] = valor;
      }

      return nuevos;
    });
  };

  const actualizarSerie = (bloqueIdx, ejIdx, serieIdx, campo, valor) => {
    setBloques((prev) => {
      const nuevos = [...prev];
      nuevos[bloqueIdx].ejercicios[ejIdx].series[serieIdx][campo] = valor;
      return nuevos;
    });
  };

  const replicarEjercicio = (bloqueIdx, ejIdx) => {
    setBloques((prev) => {
      const nuevosBloques = [...prev];
      const bloque = { ...nuevosBloques[bloqueIdx] };
      const ejerciciosActuales = [...bloque.ejercicios];

      const ejercicioOriginal = ejerciciosActuales[ejIdx];

      const nuevaSerie = ejercicioOriginal.series.map((s, i) => ({
        numero_serie: i + 1,
        repeticiones: s.repeticiones,
        descanso: s.descanso,
        tiempo: s.tiempo,
        kg: s.kg
      }));

      const nuevoEjercicio = {
        nombre: '', // El nombre debe estar vacío
        seriesCantidad: ejercicioOriginal.series.length,
        orden: ejerciciosActuales.length + 1,
        notas: '',
        series: nuevaSerie
      };

      ejerciciosActuales.push(nuevoEjercicio);
      bloque.ejercicios = ejerciciosActuales;
      nuevosBloques[bloqueIdx] = bloque;

      return nuevosBloques;
    });
  };

  const eliminarEjercicio = (bloqueIdx, ejIdx) => {
    setBloques((prev) => {
      const nuevos = [...prev];
      const ejerciciosActualizados = nuevos[bloqueIdx].ejercicios.filter(
        (_, i) => i !== ejIdx
      );

      nuevos[bloqueIdx].ejercicios = ejerciciosActualizados;
      return nuevos;
    });
  };

  const handleCrear = async () => {
    if (!nombre || !fecha || !desde || !bloques.length) {
      alert('❌ Por favor completa todos los campos requeridos.');
      return;
    }

    // fecha / desde / hasta pueden venir de <input type="date"> o "datetime-local"
    // 1) Si es solo fecha (YYYY-MM-DD), fijamos las 00:00 locales
    // 2) Si trae hora, se respeta la hora local
    const toUtcIso = (val, isDateOnly = false) => {
      if (!val) return null;
      if (isDateOnly) {
        return dayjs.tz(val, TZ).startOf('day').utc().toISOString();
      }
      // datetime-local u otro string -> interpretar como hora local de Tucumán
      return dayjs.tz(val, TZ).utc().toISOString();
    };

    /* Benjamin Orellana - 06/04/2026 - Validación para enviar student_id solo cuando la rutina se crea sobre un alumno concreto */
    const hasStudentId =
      studentId !== undefined &&
      studentId !== null &&
      String(studentId).trim() !== '' &&
      Number(studentId) > 0;

    /* Benjamin Orellana - 06/04/2026 - Payload flexible para soportar rutinas base sin alumno asignado */
    const rutina = {
      ...(hasStudentId ? { student_id: Number(studentId) } : {}),
      instructor_id: Number(userId),
      nombre,
      fecha: toUtcIso(fecha),
      desde: toUtcIso(desde),
      hasta: hasta ? toUtcIso(hasta) : null,
      descripcion: '',
      bloques: bloques.map((bloque, bloqueIdx) => ({
        nombre: bloque.nombre,
        orden: bloqueIdx + 1,
        color_id: bloque.color_id || null,
        ejercicios: bloque.ejercicios.map((ej, ejIdx) => ({
          nombre: ej.nombre,
          orden: ejIdx + 1,
          notas: ej.notas || '',
          series: ej.series.map((serie, serieIdx) => ({
            numero_serie: serieIdx + 1,
            repeticiones: serie.repeticiones,
            descanso: serie.descanso,
            tiempo: serie.tiempo,
            kg: serie.kg
          }))
        }))
      }))
    };

    try {
      const res = await fetch('http://localhost:8080/rutinas-completas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rutina)
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Rutina creada correctamente');
        onRutinaCreada?.();
        onClose();
      } else {
        alert(`❌ Error: ${data.mensajeError || 'Algo salió mal'}`);
      }
    } catch (error) {
      console.error('Error al crear rutina:', error);
      alert('❌ Error de red al crear rutina');
    }
  };

  const handleBloqueChange = (idx, campo, valor) => {
    setBloques((prev) => {
      const nuevos = [...prev];
      nuevos[idx][campo] = valor;
      return nuevos;
    });
  };

  /* Benjamin Orellana - 06/04/2026 - Helpers visuales para resolver el color activo del bloque y aplicar acentos con identidad Altos Roca */
  const getColorSeleccionado = (colorId) =>
    coloresDisponibles.find((c) => c.id === colorId) || null;

  const getColorHexBloque = (colorId) =>
    getColorSeleccionado(colorId)?.color_hex || '#dc2626';

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md px-2 py-3 sm:px-6 sm:py-6">
        <div
          ref={modalRef}
          className="mx-auto flex h-full w-full max-w-[1180px] flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#050505] text-white shadow-[0_30px_90px_-28px_rgba(0,0,0,0.75)]"
        >
          <div className="relative border-b border-white/10 bg-gradient-to-r from-[#160707] via-[#090909] to-[#120606] px-5 py-5 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.05),transparent_18%)]" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
              type="button"
            >
              <FaTimes size={16} />
            </button>

            <div className="relative z-10 pr-14">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-300">
                <FaDumbbell />
                Altos Roca
              </div>

              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-3xl titulo font-black uppercase tracking-[0.04em] text-white sm:text-4xl">
                    Crear rutina
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
                    Organizá bloques, ejercicios y series en un formato más
                    claro, visual y cómodo para el trabajo diario del staff.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Bloques
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {bloques.length}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Ejercicios
                    </p>
                    <p className="mt-1 text-2xl font-black text-white">
                      {bloques.reduce(
                        (acc, bloque) => acc + (bloque.ejercicios?.length || 0),
                        0
                      )}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 col-span-2 sm:col-span-1">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                      Alumno
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white/90">
                      ID #{studentId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-8">
            <div className="mb-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_20px_55px_-35px_rgba(239,68,68,0.30)] sm:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500/15 text-red-300">
                  <FaCalendarAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-[0.04em] text-white">
                    Datos generales de la rutina
                  </h3>
                  <p className="text-sm text-slate-400">
                    Definí nombre, fecha y vigencia antes de cargar los bloques.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                <div className="xl:col-span-5">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                    Nombre de rutina
                  </label>
                  <input
                    type="text"
                    className="h-[56px] w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    placeholder="Ej. Fuerza torso - semana 1"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="xl:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                    Fecha
                  </label>
                  <input
                    type="date"
                    className="h-[56px] w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-sm font-semibold text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                  />
                </div>

                <div className="xl:col-span-3">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                    Vigente desde
                  </label>
                  <input
                    type="datetime-local"
                    className="h-[56px] w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-sm font-semibold text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                  />
                </div>

                <div className="xl:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                    Vigente hasta
                  </label>
                  <input
                    type="date"
                    className="h-[56px] w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-sm font-semibold text-white outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {bloques.map((bloque, bloqueIdx) => {
                const colorHex = getColorHexBloque(bloque.color_id);
                const colorData = getColorSeleccionado(bloque.color_id);

                return (
                  <div
                    key={bloqueIdx}
                    className="overflow-hidden rounded-[30px] border bg-gradient-to-br from-white/[0.05] to-white/[0.02] p-4 sm:p-6"
                    style={{
                      borderColor: `${colorHex}55`,
                      boxShadow: `0 22px 55px -38px ${colorHex}`
                    }}
                  >
                    <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-lg font-black text-white"
                          style={{
                            background: `linear-gradient(135deg, ${colorHex}, #111111)`,
                            borderColor: `${colorHex}99`
                          }}
                        >
                          {bloqueIdx + 1}
                        </div>

                        <div>
                          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-300">
                            <FaLayerGroup />
                            Bloque de trabajo
                          </div>

                          <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-white">
                            {bloque.nombre}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {bloque.ejercicios?.length || 0} ejercicio(s)
                            cargado(s)
                            {colorData
                              ? ` · Color ${colorData.nombre}`
                              : ' · Sin color asignado'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {bloque.color_id && (
                          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                            <span
                              className="h-4 w-4 rounded-full border border-white/30"
                              style={{ backgroundColor: colorHex }}
                            />
                            <span className="text-sm font-semibold text-slate-200">
                              {colorData?.nombre || 'Color activo'}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setModalColorIdx(bloqueIdx)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/15 px-4 py-3 text-sm font-bold text-red-200 transition hover:border-red-400/60 hover:bg-red-500/20 hover:text-white"
                        >
                          <FaPalette />
                          Elegir color
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {bloque.ejercicios.map((ej, ejIdx) => (
                        <div
                          key={ejIdx}
                          className="rounded-[28px] border border-white/10 bg-[#0b0b0b] p-4 shadow-[0_18px_45px_-36px_rgba(255,255,255,0.10)] sm:p-5"
                        >
                          <div className="mb-4 flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-slate-300">
                                <FaDumbbell />
                                Ejercicio {ejIdx + 1}
                              </div>
                              <h4 className="text-lg font-black uppercase tracking-[0.03em] text-white">
                                Configuración del ejercicio
                              </h4>
                              <p className="mt-1 text-sm text-slate-400">
                                Seleccioná el ejercicio y completá notas,
                                series, repeticiones, tiempos y kilos.
                              </p>
                            </div>

                            <button
                              onClick={() =>
                                eliminarEjercicio(bloqueIdx, ejIdx)
                              }
                              type="button"
                              className="inline-flex items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500/20 hover:text-white"
                              title="Eliminar ejercicio"
                            >
                              <FaTimes />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
                            <div className="xl:col-span-7">
                              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                                Buscar ejercicio
                              </label>
                              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-2">
                                <AutocompleteEjercicio
                                  value={ej.nombre}
                                  onTextChange={(texto) => {
                                    actualizarEjercicio(
                                      bloqueIdx,
                                      ejIdx,
                                      'nombre',
                                      texto
                                    );
                                  }}
                                  onSelect={(item) => {
                                    actualizarEjercicio(
                                      bloqueIdx,
                                      ejIdx,
                                      'nombre',
                                      item.nombre
                                    );
                                    actualizarEjercicio(
                                      bloqueIdx,
                                      ejIdx,
                                      'catalogo_id',
                                      item.id || null
                                    );
                                  }}
                                  placeholder="Escribe para buscar... (pecho, bíceps, sentadilla...)"
                                  apiUrl="http://localhost:8080/catalogo-ejercicios"
                                  minChars={2}
                                  limit={10}
                                />
                              </div>
                            </div>

                            <div className="xl:col-span-5">
                              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                                Cantidad de series
                              </label>
                              <div className=" text-black rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                <SeriesSelector
                                  value={ej.seriesCantidad}
                                  min={1}
                                  max={10}
                                  onChange={(nuevo) =>
                                    actualizarEjercicio(
                                      bloqueIdx,
                                      ejIdx,
                                      'seriesCantidad',
                                      nuevo
                                    )
                                  }
                                />
                              </div>
                            </div>

                            <div className="xl:col-span-12">
                              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.20em] text-slate-400">
                                Notas del ejercicio
                              </label>
                              <input
                                type="text"
                                className="h-[54px] w-full rounded-2xl border border-white/10 bg-[#101010] px-4 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                placeholder="Ej. controlá tempo, técnica, pausa o alguna observación"
                                value={ej.notas}
                                onChange={(e) =>
                                  actualizarEjercicio(
                                    bloqueIdx,
                                    ejIdx,
                                    'notas',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                              type="button"
                              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white transition hover:border-white/20 hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                replicarEjercicio(bloqueIdx, ejIdx);
                              }}
                            >
                              <FaCopy />
                              Replicar estructura
                            </button>

                            {(() => {
                              const toInt = (v) => {
                                const n = Number(v);
                                return Number.isFinite(n) ? n : NaN;
                              };

                              const isFilled = (n) =>
                                Number.isFinite(n) && n > 0;

                              const reps = ej.series.map((s) =>
                                toInt(s.repeticiones)
                              );
                              const total = reps.length;

                              const firstFilledIdx = reps.findIndex(isFilled);
                              const firstVal =
                                firstFilledIdx >= 0
                                  ? reps[firstFilledIdx]
                                  : null;

                              const emptyIdxs = reps
                                .map((n, i) => (!isFilled(n) ? i : -1))
                                .filter((i) => i !== -1);

                              const secondFilledIdx =
                                firstFilledIdx >= 0
                                  ? reps.findIndex(
                                      (n, i) =>
                                        i > firstFilledIdx && isFilled(n)
                                    )
                                  : -1;

                              const canProgress =
                                firstFilledIdx >= 0 && secondFilledIdx >= 0;

                              const a = canProgress
                                ? reps[firstFilledIdx]
                                : null;
                              const b = canProgress
                                ? reps[secondFilledIdx]
                                : null;
                              const step = canProgress ? a - b : null;

                              const handleFillEmpties = (val) => {
                                emptyIdxs.forEach((serieIdx) =>
                                  actualizarSerie(
                                    bloqueIdx,
                                    ejIdx,
                                    serieIdx,
                                    'repeticiones',
                                    val
                                  )
                                );
                              };

                              const handleProgression = () => {
                                if (!canProgress) return;
                                let prev = b;
                                for (
                                  let i = secondFilledIdx + 1;
                                  i < total;
                                  i++
                                ) {
                                  const next = Math.max(1, prev - step);
                                  actualizarSerie(
                                    bloqueIdx,
                                    ejIdx,
                                    i,
                                    'repeticiones',
                                    next
                                  );
                                  prev = next;
                                }
                              };

                              const progressionLabel = (() => {
                                if (!canProgress) return null;
                                let seq = [a, b];
                                let prev = b;
                                for (
                                  let i = secondFilledIdx + 1;
                                  i < total;
                                  i++
                                ) {
                                  prev = Math.max(1, prev - step);
                                  seq.push(prev);
                                }
                                return seq.join(' - ');
                              })();

                              return (
                                <>
                                  {isFilled(firstVal) &&
                                    emptyIdxs.length > 0 && (
                                      <button
                                        type="button"
                                        className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-300 transition hover:bg-emerald-500/20 hover:text-white"
                                        title="Rellenar series vacías con este valor"
                                        onClick={() =>
                                          handleFillEmpties(firstVal)
                                        }
                                      >
                                        Completar vacías con {firstVal}
                                      </button>
                                    )}

                                  {canProgress &&
                                    step !== 0 &&
                                    secondFilledIdx < total - 1 && (
                                      <button
                                        type="button"
                                        className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-bold text-amber-300 transition hover:bg-amber-500/20 hover:text-white"
                                        title="Completar progresión aritmética"
                                        onClick={handleProgression}
                                      >
                                        Progresión {progressionLabel}
                                      </button>
                                    )}
                                </>
                              );
                            })()}
                          </div>

                          <div className="mt-5">
                            <div className="mb-3 flex items-center gap-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-300">
                                <FaClock />
                              </div>
                              <div>
                                <h5 className="text-sm font-black uppercase tracking-[0.18em] text-white">
                                  Series
                                </h5>
                                <p className="text-xs text-slate-400">
                                  Cargá repeticiones, descanso, tiempo y kilos
                                  por serie.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                              {ej.series.map((serie, serieIdx) => (
                                <div
                                  key={serieIdx}
                                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                >
                                  <div className="mb-3 flex items-center justify-between">
                                    <span className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.20em] text-red-300">
                                      Serie {serie.numero_serie}
                                    </span>

                                    {Number(serie.repeticiones) > 0 && (
                                      <button
                                        type="button"
                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
                                        title="Copiar este valor a las series vacías"
                                        onClick={() => {
                                          const val = Number(
                                            serie.repeticiones
                                          );
                                          ej.series.forEach((s, idx) => {
                                            const rep = Number(s.repeticiones);
                                            if (!(rep > 0)) {
                                              actualizarSerie(
                                                bloqueIdx,
                                                ejIdx,
                                                idx,
                                                'repeticiones',
                                                val
                                              );
                                            }
                                          });
                                        }}
                                      >
                                        Copiar reps
                                      </button>
                                    )}
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Repeticiones
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="Ej. 12"
                                        className="h-[48px] w-full rounded-xl border border-white/10 bg-[#101010] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                        value={serie.repeticiones}
                                        onChange={(e) =>
                                          actualizarSerie(
                                            bloqueIdx,
                                            ejIdx,
                                            serieIdx,
                                            'repeticiones',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Descanso
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Ej. 60s"
                                        className="h-[48px] w-full rounded-xl border border-white/10 bg-[#101010] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                        value={serie.descanso}
                                        onChange={(e) =>
                                          actualizarSerie(
                                            bloqueIdx,
                                            ejIdx,
                                            serieIdx,
                                            'descanso',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Tiempo
                                      </label>
                                      <input
                                        type="text"
                                        placeholder="Ej. 30s"
                                        className="h-[48px] w-full rounded-xl border border-white/10 bg-[#101010] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                        value={serie.tiempo}
                                        onChange={(e) =>
                                          actualizarSerie(
                                            bloqueIdx,
                                            ejIdx,
                                            serieIdx,
                                            'tiempo',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>

                                    <div>
                                      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                                        Kg
                                      </label>
                                      <input
                                        type="number"
                                        placeholder="Ej. 20"
                                        className="h-[48px] w-full rounded-xl border border-white/10 bg-[#101010] px-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                                        value={serie.kg}
                                        onChange={(e) =>
                                          actualizarSerie(
                                            bloqueIdx,
                                            ejIdx,
                                            serieIdx,
                                            'kg',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => agregarEjercicio(bloqueIdx)}
                        type="button"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[22px] border border-dashed border-red-500/35 bg-red-500/8 px-4 py-4 text-sm font-bold uppercase tracking-[0.18em] text-red-200 transition hover:border-red-400/60 hover:bg-red-500/14 hover:text-white"
                      >
                        <FaPlus />
                        Agregar ejercicio al bloque
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <button
                onClick={agregarBloque}
                type="button"
                className="inline-flex w-full items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/15 bg-white/[0.04] px-5 py-5 text-sm font-bold uppercase tracking-[0.20em] text-white transition hover:border-red-500/45 hover:bg-red-500/10"
              >
                <FaPlus />
                Agregar nuevo bloque
              </button>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#080808]/95 px-4 py-4 backdrop-blur-md sm:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Resumen final
                </p>
                <p className="mt-1 text-sm text-slate-300">
                  {bloques.length} bloque(s) ·{' '}
                  {bloques.reduce(
                    (acc, bloque) => acc + (bloque.ejercicios?.length || 0),
                    0
                  )}{' '}
                  ejercicio(s)
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={onClose}
                  type="button"
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/10"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleCrear}
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_16px_35px_-18px_rgba(239,68,68,0.85)] transition hover:scale-[1.02]"
                >
                  <FaSave />
                  Crear rutina
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalColorIdx !== null && bloques[modalColorIdx] && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md">
          <div className="relative w-full max-w-3xl rounded-[30px] border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-[0_30px_90px_-28px_rgba(0,0,0,0.85)] sm:p-7">
            <button
              onClick={() => setModalColorIdx(null)}
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-white"
            >
              <FaTimes size={14} />
            </button>

            <div className="mb-5">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.20em] text-red-300">
                <FaPalette />
                Paleta del bloque
              </div>
              <h3 className="text-2xl font-black uppercase tracking-[0.04em] text-white">
                Seleccioná un color
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                El color ayuda a identificar rápidamente cada bloque dentro de
                la rutina.
              </p>
            </div>

            <div className="grid max-h-[430px] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
              {coloresDisponibles.map((col) => {
                const seleccionado =
                  bloques[modalColorIdx]?.color_id === col.id;

                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => {
                      handleBloqueChange(modalColorIdx, 'color_id', col.id);
                      setModalColorIdx(null);
                    }}
                    className={clsx(
                      'rounded-[24px] border p-4 text-left transition duration-200',
                      seleccionado
                        ? 'scale-[1.02] border-white/50 ring-2 ring-white/20'
                        : 'border-white/10 hover:scale-[1.01] hover:border-white/25'
                    )}
                    style={{
                      background: `linear-gradient(135deg, ${col.color_hex}, #111111)`,
                      boxShadow: seleccionado
                        ? `0 20px 45px -28px ${col.color_hex}`
                        : 'none'
                    }}
                    title={col.nombre}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-black uppercase tracking-[0.06em] text-white">
                        {col.nombre}
                      </span>
                      <span className="h-5 w-5 rounded-full border border-white/40 bg-white/20" />
                    </div>

                    <div className="text-xs font-medium leading-5 text-white/85">
                      {col.descripcion || 'Color de bloque'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalCrearRutina;
