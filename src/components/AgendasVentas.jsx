import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Calendar, Bell, X } from 'lucide-react';
import ModalClasesHoyDark from './ModalClasesHoyDark';

const URL = 'http://localhost:8080/';

export default function AgendasVentas({
  userId,
  level = 'vendedor',
  open,
  onClose,
  onVentasCountChange
}) {
  const [notis, setNotis] = useState(null); // clases de prueba
  const [ventas, setVentas] = useState(null); // seguimientos ventas
  const [errorClases, setErrorClases] = useState('');
  const [errorVentas, setErrorVentas] = useState('');

  // --- helpers ---
  const onlyDigits = (s = '') => s.replace(/\D/g, '');
  const waURL = (telefono, nombre) => {
    const msg = `Hola ${nombre || ''} ¿Cómo te fue ayer en la clase de prueba?`;
    return `https://wa.me/${onlyDigits(telefono)}?text=${encodeURIComponent(
      msg
    )}`;
  };
  function formatearFecha(fechaISO) {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  }

  // --- loaders ---
  const loadClases = useCallback(async () => {
    setErrorClases('');
    setNotis(null);
    try {
      const res = await axios.get(
        `${URL}notifications/clases-prueba/${userId}`
      );
      setNotis(Array.isArray(res.data) ? res.data : []);
    } catch {
      setErrorClases('No se pudo cargar clases de prueba.');
      setNotis([]);
    }
  }, [userId]);

  const loadVentas = useCallback(async () => {
    setErrorVentas('');
    setVentas(null);
    try {
      const qs = new URLSearchParams({
        level: level === 'admin' ? 'admin' : 'vendedor',
        ...(level !== 'admin' ? { usuario_id: String(userId) } : {}),
        with_prospect: '1'
      });
      const r = await fetch(`${URL}ventas/agenda/hoy?${qs.toString()}`);
      const d = await r.json();
      const arr = Array.isArray(d) ? d : [];
      setVentas(arr);

      // Si tu badge del pill muestra solo PENDIENTES, descomentá estas líneas:
      // const pend = arr.filter(x => !x.done).length;
      // onVentasCountChange?.(pend);

      // Si preferís TOTAL (pend+realizados), dejalo así:
      onVentasCountChange?.(arr.length);
    } catch {
      setErrorVentas('No se pudo cargar la agenda de ventas.');
      setVentas([]);
      onVentasCountChange?.(0);
    }
  }, [userId, level, onVentasCountChange]);

  // cargar cuando se abre
  useEffect(() => {
    if (open && userId) {
      loadClases();
      loadVentas();
    }
  }, [open, userId, loadClases, loadVentas]);

  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // acciones ventas (no quita el item; lo marca done y reordena pendientes primero)
  const marcarDone = async (id) => {
    const prev = ventas;
    setVentas((arr) => {
      const next = arr.map((i) =>
        i.id === id
          ? { ...i, done: true, done_at: new Date().toISOString() }
          : i
      );
      next.sort(
        (a, b) =>
          Number(a.done) - Number(b.done) ||
          new Date(a.created_at) - new Date(b.created_at)
      );
      return next;
    });

    // actualizo contador del pill si cuenta pendientes
    // onVentasCountChange?.((cnt) => Math.max(0, (typeof cnt === 'number' ? cnt : 0) - 1));

    try {
      const r = await fetch(`${URL}ventas/agenda/${id}/done`, {
        method: 'PATCH'
      });
      if (!r.ok) throw new Error();
    } catch {
      setVentas(prev); // rollback
      alert('No se pudo marcar como realizado');
    }
  };

  if (!open) return null;

  const totalClases = Array.isArray(notis) ? notis.length : 0;
  const totalVentas = Array.isArray(ventas) ? ventas.length : 0;
  const total = totalClases + totalVentas;

  const marcarEnviado = async (prospectoId) => {
    // snapshot para rollback
    const prev = notis;

    // Optimista: setear enviado y reordenar (pendientes arriba)
    setNotis((arr) =>
      Array.isArray(arr)
        ? arr
            .map((n) =>
              n.prospecto_id === prospectoId ? { ...n, n_contacto_2: 1 } : n
            )
            .sort(
              (a, b) =>
                (a.n_contacto_2 || 0) - (b.n_contacto_2 || 0) ||
                a.nombre.localeCompare(b.nombre)
            )
        : arr
    );

    try {
      const r = await fetch(
        `${URL}notifications/clases-prueba/${prospectoId}/enviado`,
        { method: 'PATCH' }
      );
      if (!r.ok) throw new Error('patch-failed');
    } catch (e) {
      // rollback
      setNotis(prev);
      alert('No se pudo marcar como realizado');
    }
  };

  return (
    <ModalClasesHoyDark
      onClose={onClose}
      loadClases={loadClases}
      loadVentas={loadVentas}
      marcarEnviado={marcarEnviado}
      marcarDone={marcarDone}
      notis={notis}
      ventas={ventas}
      errorClases={errorClases}
      errorVentas={errorVentas}
      totalClases={totalClases}
      totalVentas={totalVentas}
      total={total}
      formatearFecha={formatearFecha}
      waURL={waURL}
      onlyDigits={onlyDigits}
    />
  );
}
