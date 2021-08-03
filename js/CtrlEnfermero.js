import {
    getAuth,
    getFirestore
  } from "../lib/fabrica.js";
  import {
    getString,
    muestraError
  } from "../lib/util.js";
  import {
    muestraAlumnos
  } from "./navegacion.js";
  import {
    tieneRol
  } from "./seguridad.js";
  
  const daoEnfermero =
    getFirestore().
      collection("Enfermero");
  const params =
    new URL(location.href).
      searchParams;
  const id = params.get("id");
  /** @type {HTMLFormElement} */
  const forma = document["forma"];
  
  getAuth().onAuthStateChanged(
    protege, muestraError);
  
  /** @param {import(
      "../lib/tiposFire.js").User}
      usuario */
  async function protege(usuario) {
    if (tieneRol(usuario,
      ["Administrador"])) {
      busca();
    }
  }
  
  /** Busca y muestra los datos que
   * corresponden al id recibido. */
  async function busca() {
    try {
      const doc =
        await daoEnfermero.
          doc(id).
          get();
      if (doc.exists) {
        /**
         * @type {
            import("./tipos.js").
                    Enfermero} */
        const data = doc.data();
        forma.matricula.value = data.matricula;
        forma.nombre.value = data.nombre || "";
        forma.telefono.value = data.telefono || "";
        forma.grupo.value = data.grupo || "";
        forma.fecha.value = data.fecha || "";
        forma.addEventListener(
          "submit", guarda);
        forma.eliminar.
          addEventListener(
            "click", elimina);
      } else {
        throw new Error(
          "No se encontró.");
      }
    } catch (e) {
      muestraError(e);
      muestraEnfermero();
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
      await daoAlumno.
        doc(id).
        set(modelo);
      muestraEnfermero();
    } catch (e) {
      muestraError(e);
    }
  }
  
  async function elimina() {
    try {
      if (confirm("Confirmar la " +
        "eliminación")) {
        await daoEnfermero.
          doc(id).
          delete();
        muestraEnfermero();
      }
    } catch (e) {
      muestraError(e);
    }
  }
  