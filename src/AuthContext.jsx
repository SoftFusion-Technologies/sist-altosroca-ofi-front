/*
 * Programador: Benjamin Orellana
 * Fecha: 21/06/2025
 * Versión: 2.2 (unificado staff + alumno)
 *
 * - Soporta login staff (email+password) y login alumno (teléfono+DNI)
 * - Mantiene verificación de expiración JWT y limpieza en unload
 * - Expone: login, loginAlumno, logout y todo el estado necesario
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // Token común
  const [authToken, setAuthToken] = useState(null);

  // Estado STAFF
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userLevel, setUserLevel] = useState(''); // admin | socio | vendedor | instructor | alumno
  const [userLocalId, setUserLocalId] = useState(null);
  const [userIsReemplazante, setUserIsReemplazante] = useState(false);

  // Estado ALUMNO
  const [nomyape, setNomyape] = useState('');
  const [alumnoId, setAlumnoId] = useState(null);

  const clearStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('userLocalId');
    localStorage.removeItem('userIsReemplazante');
    localStorage.removeItem('nomyape');
    localStorage.removeItem('alumnoId');
  };

  const logout = () => {
    setAuthToken(null);

    // staff
    setUserId(null);
    setUserName('');
    setUserEmail('');
    // setUserLevel('');
    setUserLocalId(null);
    setUserIsReemplazante(false);

    // alumno
    setNomyape('');
    setAlumnoId(null);

   // clearStorage();
  };

  // Restaurar sesión al montar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const payload = decodeJwt(token);
      if (!payload || Date.now() >= (payload.exp || 0) * 1000) {
        logout();
      } else {
        setAuthToken(token);
      }
    }

    // Staff
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const level = localStorage.getItem('userLevel');
    const localId = localStorage.getItem('userLocalId');
    const isReemp = localStorage.getItem('userIsReemplazante');

    if (id) setUserId(id);
    if (name) setUserName(name);
    if (email) setUserEmail(email);
    if (level) setUserLevel(level);
    if (localId) setUserLocalId(localId);
    if (isReemp) setUserIsReemplazante(isReemp === 'true');

    // Alumno
    const nomyapeStored = localStorage.getItem('nomyape');
    const alumnoIdStored = localStorage.getItem('alumnoId');
    if (nomyapeStored) setNomyape(nomyapeStored);
    if (alumnoIdStored) setAlumnoId(alumnoIdStored);

    // limpiar en unload
    const handleBeforeUnload = () => {
      clearStorage();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  /** LOGIN STAFF
   * Firma compatible con tu LoginForm:
   * login(token, id, nombre, email, rol, local_id, es_reemplazante)
   */
  const login = (token, id, nombre, email, rol, localId, esReemplazante) => {
    setAuthToken(token);
    setUserId(id);
    setUserName(nombre);
    setUserEmail(email);
    setUserLevel(rol);
    setUserLocalId(localId);
    setUserIsReemplazante(!!esReemplazante);

    localStorage.setItem('authToken', token);
    localStorage.setItem('userId', id);
    localStorage.setItem('userName', nombre);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userLevel', rol);
    localStorage.setItem('userLocalId', localId);
    localStorage.setItem('userIsReemplazante', (!!esReemplazante).toString());
  };

  /** LOGIN ALUMNO
   * Firma compatible con tu LoginForm:
   * loginAlumno(token, nomyape, id)
   * Setea userLevel = 'alumno' para lógica común.
   */
  const loginAlumno = (token, alumnoNombreApellido, id) => {
    setAuthToken(token);
    setNomyape(alumnoNombreApellido);
    setAlumnoId(id);
    setUserLevel('alumno'); // importante para guards y UI

    localStorage.setItem('authToken', token);
    localStorage.setItem('nomyape', alumnoNombreApellido);
    localStorage.setItem('alumnoId', id);
    localStorage.setItem('userLevel', 'alumno');
  };

  return (
    <AuthContext.Provider
      value={{
        // comunes
        authToken,
        userLevel,

        // staff
        userId,
        userName,
        userEmail,
        userLocalId,
        userIsReemplazante,

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
