/*
 * Programador: Benjamin Orellana
 * Fecha Creación: 26 / 05 / 2025
 * Versión: 1.1
 *
 * Descripción:
 * Este archivo (LoginValidation.jsx) es el componente el cual realiza la validación de caracteres y campos requeridos del formulario de login,
 * adaptándose tanto a usuarios normales (email + password) como a alumnos (teléfono + DNI).
 *
 * Tema: Renderización
 * Capa: Frontend
 * Contacto: benjamin.orellanaof@gmail.com || 3863531891
 */

function Validation(values, path) {
  let errors = {};

  if (path === '/soyalumno') {
    const telefono_pattern = /^[0-9]{7,15}$/;
    const dni_pattern = /^[0-9]{6,10}$/;

    if (!values.telefono) {
      errors.telefono = 'Debe ingresar su número de teléfono';
    } else if (!telefono_pattern.test(values.telefono)) {
      errors.telefono = 'El teléfono ingresado no es válido';
    }

    if (!values.dni) {
      errors.dni = 'Debe ingresar su contraseña';
    } else if (!dni_pattern.test(values.dni)) {
      errors.dni = 'El DNI debe contener entre 6 y 10 dígitos';
    }
  } else {
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^.{6,}$/;

    if (!values.email) {
      errors.email = 'Debe ingresar un correo electrónico';
    } else if (!email_pattern.test(values.email)) {
      errors.email = 'El correo electrónico no es válido';
    }

    if (!values.password) {
      errors.password = 'Debe ingresar una contraseña';
    } else if (!password_pattern.test(values.password)) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
  }

  return errors;
}

export default Validation;
