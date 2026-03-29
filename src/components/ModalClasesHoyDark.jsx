import React, { useEffect } from 'react';
import { X, Bell, Calendar } from 'lucide-react';

/*
  Drop-in replacement para tu modal actual (mismos props/funciones)
  Mejores visuales + accesibilidad:
  - Paleta morada (reemplaza naranja):
    --accent: #7c3aed (violet-600), --accentSoft: #a78bfa (violet-300)
  - Contraste alto, jerarquía clara, micro-interacciones sutiles
  - Glow y borde con gradiente violeta, scrollbars dark
  - Soporte teclado: Escape para cerrar, focus rings visibles
*/

const ACCENT = '#7c3aed';
const ACCENT_SOFT = '#a78bfa';
const ACCENT_DEEP = '#9333ea';

export default function ModalClasesHoyDark({
  onClose,
  loadClases,
  loadVentas,
  marcarEnviado,
  marcarDone,
  notis,
  ventas,
  errorClases,
  errorVentas,
  totalClases = 0,
  totalVentas = 0,
  total = 0,
  formatearFecha,
  waURL,
  onlyDigits
}) {
  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-xl px-2 sm:px-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 -left-20 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${ACCENT}, transparent 60%)`
          }}
        />
        <div
          className="absolute -bottom-24 -right-20 h-[26rem] w-[26rem] rounded-full opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${ACCENT_SOFT}, transparent 60%)`
          }}
        />
      </div>

      <div className="relative w-full max-w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
        {/* Borde con gradiente morado */}
        <div
          className="absolute -inset-[1px] rounded-2xl sm:rounded-3xl opacity-60 blur-[1.5px]"
          style={{
            background: `conic-gradient(from 180deg at 50% 50%, ${ACCENT}, rgba(255,255,255,0.45), ${ACCENT_DEEP}, ${ACCENT})`
          }}
        />

        <div className="relative bg-[#0b0b10]/95 text-white rounded-2xl sm:rounded-3xl shadow-[0_0_40px_rgba(124,58,237,0.18)] ring-1 ring-white/10 border border-white/10 w-full px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-7 max-h-[92vh] flex flex-col animate-fade-in">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 text-white/70 hover:text-white transition-colors p-2 rounded-full focus:outline-none focus:ring-2"
            style={{ boxShadow: `0 0 0 0 rgba(0,0,0,0)`, outline: 'none' }}
            aria-label="Cerrar"
          >
            <X className="h-6 w-6 sm:h-7 sm:w-7" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3 sm:gap-4">
              <Bell
                className="drop-shadow h-7 w-7 sm:h-8 sm:w-8"
                style={{ color: ACCENT }}
              />
              <h2
                id="modal-title"
                className="font-extrabold tracking-wide text-[clamp(20px,4vw,40px)]"
              >
                Clases de prueba agendadas{' '}
                <span className="text-purple-500">HOY</span>
              </h2>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/70 text-center max-w-2xl">
              Estos prospectos tienen una clase de prueba pendiente hoy.
            </p>

            {/* Resumen total */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-sm mt-1">
              <span className="inline-flex items-center rounded-full bg-white/10 text-white font-semibold px-2.5 py-0.5 ring-1 ring-white/15">
                Clases: {totalClases}
              </span>
              <span
                className="inline-flex items-center rounded-full text-white font-semibold px-2.5 py-0.5 ring-1"
                style={{
                  background: `${ACCENT_DEEP}33`,
                  borderColor: 'transparent',
                  boxShadow: `inset 0 0 0 1px ${ACCENT_DEEP}66`
                }}
              >
                Ventas: {totalVentas}
              </span>
              <span
                className="inline-flex items-center rounded-full text-white font-bold px-2.5 py-0.5 ring-1"
                style={{
                  background: `${ACCENT}33`,
                  boxShadow: `inset 0 0 0 1px ${ACCENT}66`
                }}
              >
                Total: {total}
              </span>
            </div>

            {/* Tip */}
            <div className="mt-2 text-[12px] sm:text-sm md:text-base text-white/90 bg-white/5 ring-1 ring-white/10 rounded-xl px-3 sm:px-4 py-2 font-semibold shadow-sm max-w-xl mx-auto">
              <div className="text-center">
                <span className="font-bold" style={{ color: ACCENT }}>
                  Recordá notificar:
                </span>
              </div>
              <ul className="list-disc list-inside mt-1 text-left text-white/80">
                <li>Al instructor encargado de turno</li>
                <li>Al recepcionista encargado de turno</li>
                <li>Recordatorio al cliente</li>
              </ul>
            </div>
          </div>

          {/* Contenido scrollable */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-6 pr-1 md:pr-2 custom-scroll">
            {/* SECCIÓN 1 — Clases */}
            {notis === null && !errorClases && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6"
                  >
                    <div className="h-4 w-1/3 rounded bg-white/15 mb-2" />
                    <div className="h-3 w-1/2 rounded bg-white/10 mb-3" />
                    <div className="h-10 w-full rounded bg-white/10/60" />
                  </div>
                ))}
              </div>
            )}

            {!!errorClases && (
              <div className="text-rose-300 text-sm bg-rose-500/10 ring-1 ring-rose-500/30 rounded-xl p-3">
                {errorClases}
              </div>
            )}

            {Array.isArray(notis) && notis.length === 0 && !errorClases && (
              <div className="text-white/50 text-sm sm:text-base text-center py-4 font-medium">
                No hay clases de prueba agendadas para hoy.
              </div>
            )}

            {Array.isArray(notis) && notis.length > 0 && (
              <div className="space-y-3">
                {notis.map((n) => {
                  const enviado = Number(n.n_contacto_2) === 1;
                  const tipo = n.tipo ?? n.tipo_for_today;
                  const fechaMostrar =
                    n.fecha_for_today ??
                    n.clase_prueba_1_fecha ??
                    n.clase_prueba_2_fecha ??
                    n.clase_prueba_3_fecha;

                  return (
                    <div
                      key={n.prospecto_id}
                      className={[
                        'grid grid-cols-1 md:grid-cols-[auto,1fr,auto] items-start gap-3 sm:gap-4 p-4 sm:p-6 rounded-2xl transition-[box-shadow,transform] border-l-8',
                        'bg-white/[0.04] ring-1 ring-white/10 hover:ring-white/20',
                        enviado ? 'border-l-green-400' : ''
                      ].join(' ')}
                      style={{
                        backdropFilter: 'blur(2px)',
                        borderLeftColor: enviado ? undefined : ACCENT
                      }}
                    >
                      {/* Fecha */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <Calendar
                          className="h-6 w-6 sm:h-7 sm:w-7"
                          style={{ color: ACCENT }}
                        />
                        <span className="font-extrabold text-[15px] sm:text-lg tracking-wide text-white">
                          {formatearFecha(fechaMostrar)}
                        </span>
                      </div>

                      {/* Info prospecto */}
                      <div className="min-w-0">
                        <div className="uppercase font-semibold text-[15px] sm:text-lg text-white truncate">
                          {n.nombre}
                        </div>
                        <div className="uppercase font-semibold text-[13px] sm:text-sm text-white/80 truncate">
                          {n.sede}
                        </div>
                        <div className="text-white/70 text-xs sm:text-sm">
                          <span>
                            Colaborador:{' '}
                            <span
                              className="font-bold"
                              style={{ color: ACCENT }}
                            >
                              {n.asesor_nombre}
                            </span>
                          </span>
                          <span className="block mt-0.5">
                            Tipo:{' '}
                            <span
                              className="inline-flex items-center px-2 py-0.5 rounded text-white font-semibold"
                              style={{
                                background: `${ACCENT_DEEP}40`,
                                boxShadow: `inset 0 0 0 1px ${ACCENT_DEEP}66`
                              }}
                            >
                              {tipo || '—'}
                            </span>
                          </span>
                          <span className="block mt-0.5">
                            Observación:{' '}
                            <span className="font-bold break-words">
                              {n.observacion}
                            </span>
                          </span>
                          <span className="block mt-0.5">
                            Contacto:{' '}
                            <span className="font-bold break-words">
                              {n.contacto}
                            </span>
                          </span>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex md:justify-end w-full md:w-auto gap-2">
                        <a
                          href={`https://wa.me/${(n.contacto || '').replace(
                            /\D/g,
                            ''
                          )}?text=${encodeURIComponent(
                            `Hola, soy ${n.asesor_nombre} de HammerX y te quería recordar tu clase/visita de hoy.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={[
                            'inline-flex w-full md:w-auto items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold shadow transition-[filter,transform,box-shadow]',
                            enviado
                              ? 'bg-green-500/40 text-white/80 cursor-not-allowed backdrop-blur-sm'
                              : 'bg-green-600 hover:brightness-110 text-white hover:shadow-[0_10px_30px_-12px_rgba(16,185,129,0.55)] active:scale-[0.98]'
                          ].join(' ')}
                          onClick={(e) => enviado && e.preventDefault()}
                          title={
                            enviado
                              ? 'Ya marcado como realizado'
                              : 'Abrir WhatsApp'
                          }
                        >
                          WhatsApp
                        </a>

                        <button
                          onClick={() =>
                            !enviado && marcarEnviado(n.prospecto_id)
                          }
                          className={[
                            'inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold transition-[filter,transform,box-shadow] text-white',
                            enviado
                              ? 'bg-white/10 text-white/50 cursor-not-allowed'
                              : ''
                          ].join(' ')}
                          style={{
                            background: enviado ? undefined : ACCENT,
                            filter: enviado ? undefined : 'brightness(1.05)'
                          }}
                          disabled={enviado}
                          title={
                            enviado
                              ? 'Ya marcado como realizado'
                              : 'Marcar realizado'
                          }
                        >
                          {enviado ? 'Realizado' : 'Marcar realizado'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* SECCIÓN 2 — Seguimientos de ventas HOY */}
            <div className="mt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <h3 className="uppercase text-[clamp(18px,3.5vw,24px)] font-bold text-white">
                  Seguimientos de ventas
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="inline-flex items-center justify-center rounded-full text-white text-xs sm:text-sm font-extrabold px-2.5 py-0.5"
                    style={{
                      background: `${ACCENT_DEEP}40`,
                      boxShadow: `inset 0 0 0 1px ${ACCENT_DEEP}66`
                    }}
                  >
                    {totalVentas}
                  </span>
                  <button
                    onClick={loadVentas}
                    className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-white active:scale-95 transition focus:outline-none focus:ring-2"
                    style={{ background: 'rgba(255,255,255,0.08)' }}
                  >
                    Refrescar
                  </button>
                </div>
              </div>

              {ventas === null && !errorVentas && (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-6"
                    >
                      <div className="h-4 w-1/3 rounded bg-white/15 mb-2" />
                      <div className="h-3 w-1/2 rounded bg-white/10 mb-3" />
                      <div className="h-10 w-full rounded bg-white/10/60" />
                    </div>
                  ))}
                </div>
              )}

              {!!errorVentas && (
                <div className="text-rose-300 text-sm bg-rose-500/10 ring-1 ring-rose-500/30 rounded-xl p-3">
                  {errorVentas}
                </div>
              )}

              {Array.isArray(ventas) && ventas.length === 0 && !errorVentas && (
                <div className="text-white/50 text-sm sm:text-base text-center py-4 font-medium">
                  No hay seguimientos pendientes hoy.
                </div>
              )}

              {Array.isArray(ventas) && ventas.length > 0 && (
                <div className="space-y-3">
                  {ventas.map((it) => {
                    const isDone = !!it.done;
                    return (
                      <div
                        key={it.id}
                        className={[
                          'group rounded-2xl p-4 sm:p-5 transition border border-white/10',
                          'grid grid-cols-1 md:grid-cols-[1fr,auto] items-start gap-3 sm:gap-4',
                          'bg-white/[0.04] hover:ring-1 hover:ring-white/20',
                          isDone ? 'border-l-8 border-l-green-400' : ''
                        ].join(' ')}
                        style={{ borderLeftColor: isDone ? undefined : ACCENT }}
                      >
                        {/* Columna izquierda */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full mt-1"
                              style={{
                                background: isDone ? '#22c55e' : ACCENT
                              }}
                            />
                            <div className="text-sm sm:text-base font-semibold text-white truncate">
                              {it.prospecto?.nombre ??
                                `Prospecto #${it.prospecto_id}`}
                            </div>
                          </div>

                          <div className="mt-1 text-[11px] sm:text-xs text-white/70 flex flex-wrap gap-x-2">
                            <span>Clase #{it.clase_num}</span>
                            <span>• {it.prospecto?.actividad || '—'}</span>
                            <span>• {it.prospecto?.sede || '—'}</span>
                          </div>

                          <div className="mt-2 text-sm text-white/90 break-words">
                            {it.mensaje}
                          </div>

                          {/* Badges + acciones secundarias */}
                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span
                              className="inline-block rounded-full px-3 py-1 text-[11px] sm:text-xs font-bold text-white"
                              style={{
                                background: isDone
                                  ? 'rgba(34,197,94,0.25)'
                                  : `${ACCENT}40`,
                                boxShadow: `inset 0 0 0 1px ${
                                  isDone ? 'rgba(34,197,94,0.5)' : ACCENT + '66'
                                }`
                              }}
                            >
                              {isDone ? 'Realizado' : 'Pendiente'}
                            </span>

                            {it.prospecto?.contacto && (
                              <>
                                <a
                                  href={waURL(
                                    it.prospecto.contacto,
                                    it.prospecto?.nombre
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={[
                                    'inline-flex items-center justify-center gap-2 rounded-lg text-white text-[11px] sm:text-xs font-bold px-3 py-1.5 transition w-full sm:w-auto',
                                    isDone
                                      ? 'bg-green-500/40 cursor-not-allowed'
                                      : 'bg-green-600 hover:brightness-110'
                                  ].join(' ')}
                                  title={
                                    isDone ? 'Ya realizado' : 'Abrir WhatsApp'
                                  }
                                  onClick={(e) => isDone && e.preventDefault()}
                                >
                                  WhatsApp
                                </a>
                                <button
                                  onClick={() =>
                                    !isDone &&
                                    navigator.clipboard?.writeText(
                                      onlyDigits(it.prospecto.contacto)
                                    )
                                  }
                                  className={[
                                    'inline-flex items-center justify-center gap-2 rounded-lg text-[11px] sm:text-xs font-semibold px-3 py-1.5 transition w-full sm:w-auto',
                                    isDone
                                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                      : 'bg-white/10 hover:bg-white/15 text-white'
                                  ].join(' ')}
                                  title={
                                    isDone ? 'Ya realizado' : 'Copiar teléfono'
                                  }
                                  disabled={isDone}
                                >
                                  Copiar
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Botón principal */}
                        <div className="md:pl-2">
                          <button
                            onClick={() => !isDone && marcarDone(it.id)}
                            className={[
                              'w-full md:w-auto rounded-xl px-4 py-2 text-sm md:text-[15px] font-bold text-white shadow transition',
                              isDone
                                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                                : ''
                            ].join(' ')}
                            style={{ background: isDone ? undefined : ACCENT }}
                            disabled={isDone}
                            title={
                              isDone
                                ? 'Ya marcado como realizado'
                                : 'Marcar realizado'
                            }
                          >
                            {isDone ? 'Realizado' : 'Marcar realizado'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer fijo */}
          <div className="mt-3 w-full max-w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent mb-3" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                className="w-full py-3 rounded-2xl text-white text-sm sm:text-base font-bold transition shadow-sm focus:outline-none focus:ring-2"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onClick={() => {
                  loadClases();
                  loadVentas();
                }}
              >
                Refrescar todo
              </button>
              <button
                className="w-full py-3 rounded-2xl text-white text-sm sm:text-base font-bold transition shadow-md hover:opacity-95"
                style={{
                  background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT_SOFT})`
                }}
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* Animación y scrollbars (dark) */}
          <style>{`
            @keyframes fade-in { 0% { opacity: 0; transform: translateY(32px);} 100% { opacity: 1; transform: translateY(0);} }
            .animate-fade-in { animation: fade-in 0.45s cubic-bezier(.5,1.3,.5,1) both; }
            .custom-scroll::-webkit-scrollbar { height: 8px; width: 8px; background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.18); border-radius: 8px; }
          `}</style>
        </div>
      </div>
    </div>
  );
}
