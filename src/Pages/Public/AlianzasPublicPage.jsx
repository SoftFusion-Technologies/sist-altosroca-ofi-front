/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 14 / 04 / 2026
 * Versión: 1.0
 *
 * Descripción:
 * Este archivo (AlianzasPublicPage.jsx) renderiza la página pública de
 * alianzas comerciales de Altos Roca Gym y reutiliza el modal de alta
 * pública para empresas, marcas y emprendimientos.
 *
 * Tema: Alianzas Públicas
 * Capa: Frontend
 */

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Tv,
  Globe,
  Handshake,
  BadgeDollarSign,
  Sparkles,
  BriefcaseBusiness,
  Building2,
  ArrowRight
} from 'lucide-react';
import AlianzasPublicModal from '../../components/Alianzas/AlianzasPublicModal';
import ParticlesBackground from '../../components/ParticlesBackground';

// Benjamin Orellana - 2026/04/14 - URL local fija del backend.
const BASE_URL = 'http://localhost:8080';

const CATEGORY_ICON_MAP = {
  redes: Megaphone,
  web: Globe,
  pantallas: Tv,
  carteleria: BadgeDollarSign,
  sponsor: Sparkles,
  convenio: Handshake,
  otro: BriefcaseBusiness
};

const CATEGORY_LABEL_MAP = {
  redes: 'Redes',
  web: 'Página web',
  pantallas: 'Pantallas',
  carteleria: 'Cartelería',
  sponsor: 'Sponsor',
  convenio: 'Convenio',
  otro: 'Otro'
};

const AlianzasPublicPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [espacios, setEspacios] = useState([]);
  const [loadingEspacios, setLoadingEspacios] = useState(false);

  // Benjamin Orellana - 2026/04/14 - Beneficios base que se mostrarán mientras se termina de definir el material comercial final.
  const beneficios = useMemo(
    () => [
      {
        title: 'Presencia de marca',
        description:
          'Tu empresa puede aparecer dentro del ecosistema visual de Altos Roca Gym.'
      },
      {
        title: 'Visibilidad multiplataforma',
        description:
          'Espacios pensados para web, pantallas internas, cartelería, redes y acciones especiales.'
      },
      {
        title: 'Convenios comerciales',
        description:
          'Posibilidad de acuerdos y beneficios para alumnos, socios o comunidad vinculada al gimnasio.'
      },
      {
        title: 'Formato flexible',
        description:
          'Se pueden evaluar propuestas fijas, rotativas, sponsor o colaboraciones puntuales.'
      }
    ],
    []
  );

  // Benjamin Orellana - 2026/04/14 - Carga espacios activos para mostrarlos en la landing pública.
  const fetchEspacios = async () => {
    try {
      setLoadingEspacios(true);

      const response = await axios.get(`${BASE_URL}/alianzas-espacios`, {
        params: { activo: true }
      });

      setEspacios(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error al obtener espacios públicos de alianzas:', error);
      setEspacios([]);
    } finally {
      setLoadingEspacios(false);
    }
  };

  useEffect(() => {
    fetchEspacios();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <ParticlesBackground />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_36%),linear-gradient(to_bottom,rgba(0,0,0,0.18),rgba(0,0,0,0.72))]" />

      <div className="relative z-10 mx-auto w-[94%] max-w-7xl pt-28 pb-20">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
              Altos Roca Gym
            </div>

            <h1 className="mt-5 max-w-4xl titulo uppercase text-4xl font-black leading-none tracking-tight text-white md:text-6xl">
              Publicidad, convenios y alianzas comerciales
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-relaxed text-zinc-300 md:text-lg">
              Si tenés una empresa, marca o emprendimiento y querés potenciar tu
              visibilidad junto a Altos Roca Gym, este espacio está pensado para
              vos. Podés postularte para propuestas de publicidad, sponsor o
              convenios con beneficios para nuestra comunidad.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_10px_40px_rgba(220,38,38,0.28)] transition-all duration-300 hover:-translate-y-[1px] hover:brightness-110"
              >
                Quiero asociarme
                <ArrowRight size={16} />
              </button>

              <a
                href="#sectores"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
              >
                Ver sectores disponibles
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-[34px] border border-red-500/15 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
          >
            <div className="rounded-[28px] border border-red-500/10 bg-gradient-to-br from-red-500/10 via-white/[0.02] to-transparent p-5">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                Oportunidad comercial
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">
                    Publicidad en pantallas
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Visibilidad dentro del gimnasio en espacios internos de alto
                    impacto.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">
                    Marca en web y redes
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Presencia digital asociada a la identidad del gimnasio y su
                    comunidad.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-sm font-semibold text-white">
                    Convenios y beneficios
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    Acuerdos para alumnos, promociones cruzadas y acciones de
                    fidelización.
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-red-500/15 bg-red-500/5 p-4 text-sm leading-relaxed text-zinc-300">
                El registro inicial es simple. Después el equipo de Altos Roca
                Gym continúa el contacto y evalúa la propuesta comercial.
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {beneficios.map((item, index) => (
            <motion.div
              key={`${item.title}-${index}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.08 * index }}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
            >
              <p className="text-lg font-bold text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </section>

        <section id="sectores" className="mt-16">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-red-300">
                Sectores y espacios
              </div>

              <h2 className="mt-4 titulo uppercase text-3xl font-black tracking-tight text-white md:text-4xl">
                Opciones disponibles para tu marca
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400 md:text-base">
                Estos son los espacios que hoy están contemplados dentro del
                ecosistema comercial del gimnasio. La selección final se realiza
                durante la evaluación de la propuesta.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-zinc-200 transition-all duration-300 hover:border-red-500/30 hover:bg-red-500/10 hover:text-white"
            >
              Registrar propuesta
            </button>
          </div>

          {loadingEspacios ? (
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-zinc-400">
              Cargando espacios disponibles...
            </div>
          ) : espacios.length === 0 ? (
            <div className="rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center text-sm text-zinc-400">
              No hay espacios activos cargados todavía.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {espacios.map((espacio, index) => {
                const IconComponent =
                  CATEGORY_ICON_MAP[espacio.categoria] || BriefcaseBusiness;

                return (
                  <motion.div
                    key={espacio.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: 0.03 * index }}
                    className="rounded-[30px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-red-500/25 hover:bg-white/[0.05]"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-2xl bg-red-500/10 p-3 text-red-300">
                        <IconComponent size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-lg font-bold text-white">
                            {espacio.nombre}
                          </p>
                          <span className="rounded-full border border-red-500/15 bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-red-200">
                            {CATEGORY_LABEL_MAP[espacio.categoria] || 'Otro'}
                          </span>
                        </div>

                        {espacio.descripcion ? (
                          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                            {espacio.descripcion}
                          </p>
                        ) : (
                          <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                            Espacio disponible para evaluación comercial.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-16 rounded-[34px] border border-red-500/15 bg-gradient-to-br from-red-500/10 via-white/[0.03] to-transparent p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">
                ¿Querés que evaluemos tu propuesta?
              </h3>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
                Registrá tu empresa, emprendimiento o marca y el equipo de Altos
                Roca Gym te contactará para analizar posibilidades de
                publicidad, sponsor o convenio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-700 via-red-600 to-red-500 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_10px_40px_rgba(220,38,38,0.28)] transition-all duration-300 hover:-translate-y-[1px] hover:brightness-110"
            >
              Iniciar solicitud
              <Building2 size={17} />
            </button>
          </div>
        </section>
      </div>

      <AlianzasPublicModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default AlianzasPublicPage;
