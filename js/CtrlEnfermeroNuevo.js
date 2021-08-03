import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraEnfermero
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoEnfermero =
  getFirestore().
    collection("Enfermero");
/** @type {HTMLFormElement} */
const forma = document["forma"];
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
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const matricula = getString(
        formData, "matricula").trim();  
    const nombre = getString(formData, "nombre").trim();
    const telefono = getString(formData, "telefono").trim();
    const grupo = getString(formData, "grupo").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Enfermero} */
    const modelo = {
      matricula,
      nombre,
      telefono,
      grupo,
      fecha 
    };
    await daoEnfermero.
      add(modelo);
    muestraEnfermero();
  } catch (e) {
    muestraError(e);
  }
}

