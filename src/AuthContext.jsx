/*
 * Programador: Benjamin Orellana
 * Fecha: 29/03/2026
 * Versión: 3.0
 *
 * Descripción:
 * AuthContext unificado para staff + alumno, adaptado al nuevo login del backend.
 * Soporta:
 * - Login staff con respuesta nueva del backend ({ token, user, rol, sede_id, ... })
 * - Compatibilidad con firma vieja login(token, id, nombre, email, rol, localId, esReemplazante)
 * - Restauración de sesión desde localStorage
 * - Verificación básica de expiración JWT
 * - Exposición de datos completos del usuario autenticado
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

const AuthContext = createContext();

const STORAGE_KEYS = {
  authToken: 'authToken',
  userId: 'userId',
  userName: 'userName',
  userEmail: 'userEmail',
  userLevel: 'userLevel',
  userRol: 'userRol',
  userLocalId: 'userLocalId',
  userSede: 'userSede',
  userSedeId: 'userSedeId',
  userIsReemplazante: 'userIsReemplazante',
  userData: 'userData',
  nomyape: 'nomyape',
  alumnoId: 'alumnoId'
};

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

const safeParse = (value, fallback = null) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const normalizeStaffLoginPayload = (...args) => {
  // Benjamin Orellana - 29/03/2026 - Compatibilidad con login nuevo basado en objeto y login viejo por parámetros
  if (args.length === 1 && args[0] && typeof args[0] === 'object') {
    const payload = args[0];

    const token = payload.token || payload.authToken || null;
    const user = payload.user || payload.usuario || null;

    const id = payload.id ?? user?.id ?? null;
    const nombre = payload.nombre ?? user?.name ?? user?.nombre ?? '';
    const email = payload.email ?? user?.email ?? '';
    const rol = payload.rol ?? payload.level ?? user?.rol ?? user?.level ?? '';

    const sedeId =
      payload.sede_id ??
      payload.userSedeId ??
      user?.sede_id ??
      user?.sedeRelacion?.id ??
      user?.sede_relacion?.id ??
      null;

    const sedeNombre =
      payload.sede ??
      payload.userSede ??
      user?.sede ??
      user?.sedeRelacion?.nombre ??
      user?.sede_relacion?.nombre ??
      '';

    const localId = payload.local_id ?? payload.userLocalId ?? sedeId ?? null;

    const esReemplazante =
      payload.es_reemplazante ?? payload.userIsReemplazante ?? false;

    return {
      token,
      id,
      nombre,
      email,
      rol,
      level: rol,
      sede: sedeNombre,
      sede_id: sedeId,
      local_id: localId,
      es_reemplazante: !!esReemplazante,
      userData: user || {
        id,
        name: nombre,
        email,
        rol,
        level: rol,
        sede: sedeNombre,
        sede_id: sedeId
      }
    };
  }

  const [token, id, nombre, email, rol, localId, esReemplazante] = args;

  return {
    token: token || null,
    id: id ?? null,
    nombre: nombre || '',
    email: email || '',
    rol: rol || '',
    level: rol || '',
    sede: '',
    sede_id: localId ?? null,
    local_id: localId ?? null,
    es_reemplazante: !!esReemplazante,
    userData: {
      id: id ?? null,
      name: nombre || '',
      email: email || '',
      rol: rol || '',
      level: rol || '',
      sede_id: localId ?? null
    }
  };
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  // Staff
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLevel, setUserLevel] = useState('');
  const [userRol, setUserRol] = useState('');
  const [userLocalId, setUserLocalId] = useState(null);
  const [userSede, setUserSede] = useState('');
  const [userSedeId, setUserSedeId] = useState(null);
  const [userIsReemplazante, setUserIsReemplazante] = useState(false);
  const [userData, setUserData] = useState(null);

  // Alumno
  const [nomyape, setNomyape] = useState('');
  const [alumnoId, setAlumnoId] = useState(null);

  const clearStorage = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const clearStaffState = () => {
    setUserId(null);
    setUserName('');
    setUserEmail('');
    setUserLevel('');
    setUserRol('');
    setUserLocalId(null);
    setUserSede('');
    setUserSedeId(null);
    setUserIsReemplazante(false);
    setUserData(null);
  };

  const clearAlumnoState = () => {
    setNomyape('');
    setAlumnoId(null);
  };

  const logout = () => {
    setAuthToken(null);
    clearStaffState();
    clearAlumnoState();
    clearStorage();
  };

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);

    if (!token) {
      clearStorage();
      return;
    }

    const payload = decodeJwt(token);
    if (!payload || Date.now() >= (payload.exp || 0) * 1000) {
      logout();
      return;
    }

    setAuthToken(token);

    // Staff
    const storedUserId = localStorage.getItem(STORAGE_KEYS.userId);
    const storedUserName = localStorage.getItem(STORAGE_KEYS.userName);
    const storedUserEmail = localStorage.getItem(STORAGE_KEYS.userEmail);
    const storedUserLevel = localStorage.getItem(STORAGE_KEYS.userLevel);
    const storedUserRol = localStorage.getItem(STORAGE_KEYS.userRol);
    const storedUserLocalId = localStorage.getItem(STORAGE_KEYS.userLocalId);
    const storedUserSede = localStorage.getItem(STORAGE_KEYS.userSede);
    const storedUserSedeId = localStorage.getItem(STORAGE_KEYS.userSedeId);
    const storedUserIsReemplazante = localStorage.getItem(
      STORAGE_KEYS.userIsReemplazante
    );
    const storedUserData = localStorage.getItem(STORAGE_KEYS.userData);

    if (storedUserId) setUserId(Number(storedUserId));
    if (storedUserName) setUserName(storedUserName);
    if (storedUserEmail) setUserEmail(storedUserEmail);
    if (storedUserLevel) setUserLevel(storedUserLevel);
    if (storedUserRol) setUserRol(storedUserRol);
    if (storedUserLocalId) setUserLocalId(Number(storedUserLocalId));
    if (storedUserSede) setUserSede(storedUserSede);
    if (storedUserSedeId) setUserSedeId(Number(storedUserSedeId));
    if (storedUserIsReemplazante) {
      setUserIsReemplazante(storedUserIsReemplazante === 'true');
    }
    if (storedUserData) {
      setUserData(safeParse(storedUserData, null));
    }

    // Alumno
    const storedNomyape = localStorage.getItem(STORAGE_KEYS.nomyape);
    const storedAlumnoId = localStorage.getItem(STORAGE_KEYS.alumnoId);

    if (storedNomyape) setNomyape(storedNomyape);
    if (storedAlumnoId) setAlumnoId(Number(storedAlumnoId));
  }, []);

  // Benjamin Orellana - 29/03/2026 - Login staff compatible con backend nuevo y con llamadas antiguas del frontend
  const login = (...args) => {
    const data = normalizeStaffLoginPayload(...args);

    setAuthToken(data.token);

    setUserId(data.id);
    setUserName(data.nombre);
    setUserEmail(data.email);
    setUserLevel(data.rol || data.level || '');
    setUserRol(data.rol || '');
    setUserLocalId(data.local_id ?? data.sede_id ?? null);
    setUserSede(data.sede || '');
    setUserSedeId(data.sede_id ?? null);
    setUserIsReemplazante(!!data.es_reemplazante);
    setUserData(data.userData || null);

    // Si entra staff, limpiamos posible sesión de alumno
    setNomyape('');
    setAlumnoId(null);

    localStorage.setItem(STORAGE_KEYS.authToken, data.token || '');
    localStorage.setItem(STORAGE_KEYS.userId, data.id ?? '');
    localStorage.setItem(STORAGE_KEYS.userName, data.nombre ?? '');
    localStorage.setItem(STORAGE_KEYS.userEmail, data.email ?? '');
    localStorage.setItem(STORAGE_KEYS.userLevel, data.rol || data.level || '');
    localStorage.setItem(STORAGE_KEYS.userRol, data.rol || '');
    localStorage.setItem(
      STORAGE_KEYS.userLocalId,
      data.local_id ?? data.sede_id ?? ''
    );
    localStorage.setItem(STORAGE_KEYS.userSede, data.sede ?? '');
    localStorage.setItem(STORAGE_KEYS.userSedeId, data.sede_id ?? '');
    localStorage.setItem(
      STORAGE_KEYS.userIsReemplazante,
      (!!data.es_reemplazante).toString()
    );
    localStorage.setItem(
      STORAGE_KEYS.userData,
      JSON.stringify(data.userData || null)
    );

    localStorage.removeItem(STORAGE_KEYS.nomyape);
    localStorage.removeItem(STORAGE_KEYS.alumnoId);
  };

  const loginAlumno = (token, alumnoNombreApellido, id) => {
    setAuthToken(token);

    clearStaffState();

    setNomyape(alumnoNombreApellido || '');
    setAlumnoId(id ?? null);
    setUserLevel('alumno');
    setUserRol('alumno');

    localStorage.setItem(STORAGE_KEYS.authToken, token || '');
    localStorage.setItem(STORAGE_KEYS.nomyape, alumnoNombreApellido || '');
    localStorage.setItem(STORAGE_KEYS.alumnoId, id ?? '');
    localStorage.setItem(STORAGE_KEYS.userLevel, 'alumno');
    localStorage.setItem(STORAGE_KEYS.userRol, 'alumno');

    localStorage.removeItem(STORAGE_KEYS.userId);
    localStorage.removeItem(STORAGE_KEYS.userName);
    localStorage.removeItem(STORAGE_KEYS.userEmail);
    localStorage.removeItem(STORAGE_KEYS.userLocalId);
    localStorage.removeItem(STORAGE_KEYS.userSede);
    localStorage.removeItem(STORAGE_KEYS.userSedeId);
    localStorage.removeItem(STORAGE_KEYS.userIsReemplazante);
    localStorage.removeItem(STORAGE_KEYS.userData);
  };

  const isAuthenticated = useMemo(() => !!authToken, [authToken]);
  const isAlumno = useMemo(() => userLevel === 'alumno', [userLevel]);
  const isStaff = useMemo(
    () => !!authToken && userLevel !== 'alumno',
    [authToken, userLevel]
  );

  return (
    <AuthContext.Provider
      value={{
        // comunes
        authToken,
        isAuthenticated,
        isAlumno,
        isStaff,

        // staff
        userId,
        userName,
        userEmail,
        userLevel,
        userRol,
        userLocalId,
        userSede,
        userSedeId,
        userIsReemplazante,
        userData,

        // alumno
        nomyape,
        alumnoId,

        // acciones
        login,
        loginAlumno,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
