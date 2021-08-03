import {
  getFirestore
} from "../lib/fabrica.js";
import {
  subeStorage
} from "../lib/storage.js";
import {
  cod, getForánea, muestraError
} from "../lib/util.js";
import {
  muestraPaciente
} from "./navegacion.js";

const SIN_ENFERMERO = /* html */
  `<option value="">
    -- Sin Enfermero --
  </option>`;

const firestore = getFirestore();
const daoRol = firestore.
  collection("Rol");
const daoEnfermero = firestore.
  collection("Enfermero");
const daoPaciente = firestore.
  collection("Paciente");

/**
 * @param {
    HTMLSelectElement} select
 * @param {string} valor */
export function
  selectEnfermero(select,
    valor) {
  valor = valor || "";
  daoEnfermero.
    orderBy("nombre").
    onSnapshot(
      snap => {
        let html = SIN_ENFERMERO;
        snap.forEach(doc =>
          html += htmlEnfermero(
            doc, valor));
        select.innerHTML = html;
      },
      e => {
        muestraError(e);
        selectEnfermero(
          select, valor);
      }
    );
}

/**
 * @param {
  import("../lib/tiposFire.js").
  DocumentSnapshot} doc
 * @param {string} valor */
function
  htmlEnfermero(doc, valor) {
  const selected =
    doc.id === valor ?
      "selected" : "";
  /**
   * @type {import("./tipos.js").
                  Enfermero} */
  const data = doc.data();
  return (/* html */
    `<option
        value="${cod(doc.id)}"
        ${selected}>
      ${cod(data.nombre)}
    </option>`);
}

/**
 * @param {HTMLElement} elemento
 * @param {string[]} valor */
export function
  checksRoles(elemento, valor) {
  const set =
    new Set(valor || []);
  daoRol.onSnapshot(
    snap => {
      let html = "";
      if (snap.size > 0) {
        snap.forEach(doc =>
          html +=
          checkRol(doc, set));
      } else {
        html += /* html */
          `<li class="vacio">
              -- No hay roles
              registrados. --
            </li>`;
      }
      elemento.innerHTML = html;
    },
    e => {
      muestraError(e);
      checksRoles(
        elemento, valor);
    }
  );
}

/**
 * @param {
    import("../lib/tiposFire.js").
    DocumentSnapshot} doc
 * @param {Set<string>} set */
export function
  checkRol(doc, set) {
  /**
   * @type {
      import("./tipos.js").Rol} */
  const data = doc.data();
  const checked =
    set.has(doc.id) ?
      "checked" : "";
  return (/* html */
    `<li>
      <label class="fila">
        <input type="checkbox"
            name="rolIds"
            value="${cod(doc.id)}"
          ${checked}>
        <span class="texto">
          <strong
              class="primario">
            ${cod(doc.id)}
          </strong>
          <span
              class="secundario">
          ${cod(data.descripción)}
          </span>
        </span>
      </label>
    </li>`);
}

/**
 * @param {Event} evt
 * @param {FormData} formData
 * @param {string} id  */
export async function
  guardaPaciente(evt, formData,
    id) {
  try {
    evt.preventDefault();
    const enfermeroId =
      getForánea(formData,
        "EnfermeroId");
    const rolIds =
      formData.getAll("rolIds");
    await daoPaciente.
      doc(id).
      set({
        enfermeroId,
        rolIds
      });
    const avatar =
      formData.get("avatar");
    await subeStorage(id, avatar);
    muestraPaciente();
  } catch (e) {
    muestraError(e);
  }
}
