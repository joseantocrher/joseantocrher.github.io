import {
  getAuth
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  checksRoles,
  guardaPaciente,
  selectEnfermero
} from "./pacientes.js";

/** @type {HTMLFormElement} */
const forma = document["forma"];
/** @type {HTMLUListElement} */
const listaRoles = document.
  querySelector("#listaRoles");

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    paciente */
async function protege(paciente) {
  if (tieneRol(paciente,
    ["Administrador"])) {
    forma.addEventListener(
      "submit", guarda);
    selectEnfermero(
      forma.enfermeroId, "");
    checksRoles(listaRoles, []);
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  const formData =
    new FormData(forma);
  const id = getString(
    formData, "cue").trim();
  await guardaPaciente(evt,
    formData, id);
}
