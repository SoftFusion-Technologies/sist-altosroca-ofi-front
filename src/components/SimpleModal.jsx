/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 02 / 04 / 2026
 * Versión: 2.0
 *
 * Descripción:
 * Este componente renderiza un modal reutilizable con overlay oscuro, sin forzar fondo blanco,
 * permitiendo que cada contenido hijo defina su propia estética visual.
 *
 * Tema: Componentes - Modal
 * Capa: Frontend
 */

import { motion, AnimatePresence } from 'framer-motion';

export default function SimpleModal({
  open,
  onClose,
  children,
  closeOnBackdrop = true
}) {
  const handleBackdropClick = (e) => {
    if (!closeOnBackdrop) return;
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-gradient-to-br from-[#07031aee] to-[#180933dd] px-4 py-6 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[900px]"
            initial={{ scale: 0.82, opacity: 0.7, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 170, damping: 16 }}
          >
            {/* Benjamin Orellana - 2026-04-02 - Se elimina el fondo blanco forzado para permitir modales oscuros o personalizados */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/35 text-xl text-white/75 transition hover:bg-white/10 hover:text-white"
              aria-label="Cerrar modal"
              type="button"
            >
              ×
            </button>

            <div className="max-h-[92dvh] overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
