import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  eliminaStorage,
  urlStorage
} from "../lib/storage.js";
import {
  muestraError
} from "../lib/util.js";
import {
  muestraPaciente
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";
import {
  checksRoles,
  guardaPaciente,
  selectEnfermero
} from "./pacientes.js";

const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
const daoPaciente = getFirestore().
  collection("Paciente");
/** @type {HTMLFormElement} */
const forma = document["forma"];
const img = document.
  querySelector("img");
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
    busca();
  }
}

async function busca() {
  try {
    const doc = await daoPaciente.
      doc(id).
      get();
    if (doc.exists) {
      const data = doc.data();
      forma.cue.value = id || "";
      img.src =
        await urlStorage(id);
      selectEnfermero(
        forma.enfermeroId,
        data.enfermeroId)
      checksRoles(
        listaRoles, data.rolIds);
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    }
  } catch (e) {
    muestraError(e);
    muestraPaciente();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  await guardaPaciente(evt,
    new FormData(forma), id);
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoUsuario.
        doc(id).delete();
      await eliminaStorage(id);
      muestraPaciente();
    }
  } catch (e) {
    muestraError(e);
  }
}
