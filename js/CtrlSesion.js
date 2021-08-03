import {
  getAuth
} from "../lib/fabrica.js";
import {
  muestraError
} from "../lib/util.js";
import {
  iniciaSesión,
  terminaSesión
} from "./seguridad.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLImageElement} */
const avatar = document.
  querySelector("#avatar");

/* Escucha cambios de usuario.
 * El primer parámetro es una
 * función que se invoca cada que
 * hay un cambio de Paciente y
 * recibe los datos del paciente.
 * El segundo parámetro es una
 * función que se invoca cuando se
 * presenta un error en un cambio
 * de paciente y recibe un Error.
 */
getAuth().onAuthStateChanged(
  muestraSesión, muestraError);

/** Muestra los datos del paciente
 * o manda a iniciar sesión en
 * caso de que no haya empezado.
 * @param {import(
    "../lib/tiposFire").
    User} paciente modelo con las
 *    características del usuario
 *    o null si no ha iniciado
 *    sesión. */
async function
  muestraSesión(paciente) {
  if (paciente && paciente.email) {
    // Usuario aceptado.
    forma.email.value =
      paciente.email || "";
    forma.nombre.value =
      paciente.displayName || "";
    avatar.src =
      paciente.photoURL || "";
    forma.terminarSesión.
      addEventListener(
        "click", terminaSesión);
  } else {
    // No ha iniciado sesión.
    iniciaSesión();
  }
}
