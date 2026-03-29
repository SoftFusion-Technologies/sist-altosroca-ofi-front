import { useEffect, useMemo, useRef, useState } from 'react';

function getApiBase() {
  // Usa Vite env si existe, si no cae a localhost
  const envBase = 'http://localhost:8080';
  return envBase;
}

/**
 * Badge para clases de prueba pendientes (test_classes).
 * Props:
 * - userId (number)
 * - userLevel ('admin' | 'vendedor')
 * - size ('lg' | 'xl') = 'lg'
 * - className (string)
 * - hideWhenZero (bool) = true  → no renderiza si count === 0
 * - pollMs (number) = 60000
 */
export default function BadgeTestClasses({
  userId,
  userLevel,
  size = 'lg',
  className = '',
  hideWhenZero = true,
  pollMs = 60_000
}) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const ctrlRef = useRef(null);

  const sizes = useMemo(
    () => ({
      lg: 'text-[20px] lg:text-[28px] px-3.5 py-2 lg:px-4 lg:py-2.5',
      xl: 'text-[24px] lg:text-[32px] px-4 py-2.5 lg:px-5 lg:py-3'
    }),
    []
  );

  const qs = useMemo(() => {
    const p = new URLSearchParams();
    if (String(userLevel).toLowerCase() === 'admin') {
      p.set('level', 'admin');
    } else {
      p.set('level', 'vendedor');
      if (userId) p.set('usuario_id', String(userId));
    }
    return p.toString();
  }, [userId, userLevel]);

  const load = async () => {
    try {
      setLoading(true);
      ctrlRef.current?.abort?.();
      ctrlRef.current = new AbortController();

      const base = getApiBase();
      const url = `${base}/testclass/count-pendientes?${qs}`;
      const res = await fetch(url, {
        cache: 'no-store',
        signal: ctrlRef.current.signal
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setCount(Number(json?.count ?? 0));
    } catch (err) {
      if (err?.name !== 'AbortError') {
        console.error('[BadgeTestClasses] load error:', err);
        setCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, pollMs);

    // Permite refrescar desde otros componentes:
    // window.dispatchEvent(new CustomEvent('test-classes-updated'))
    const onUpdated = () => load();
    window.addEventListener('test-classes-updated', onUpdated);

    return () => {
      clearInterval(id);
      window.removeEventListener('test-classes-updated', onUpdated);
      ctrlRef.current?.abort?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qs, pollMs]);

  // Ocultar por completo si count = 0 y hideWhenZero = true
  if (!loading && hideWhenZero && count === 0) return null;

  return (
    <span
      className={[
        'absolute top-0 right-0 translate-x-1/3 -translate-y-1/3',
        'bg-red-500 text-white rounded-full font-extrabold tabular-nums',
        'shadow-2xl ring-4 ring-white select-none pointer-events-none',
        sizes[size] ?? sizes.lg,
        className
      ].join(' ')}
      aria-label={
        loading
          ? 'Cargando clases de prueba pendientes...'
          : `Clases de prueba pendientes: ${count}`
      }
      title={
        loading
          ? 'Cargando clases de prueba pendientes...'
          : `Clases de prueba pendientes: ${count}`
      }
    >
      {loading ? '...' : count}
    </span>
  );
}
