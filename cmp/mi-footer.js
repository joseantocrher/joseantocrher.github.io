class MiFooter
  extends HTMLElement {
  connectedCallback() {
    this.innerHTML = /* html */
      `<p>
        &copy; 2021
        cruz herrera jose antonio.
      </p>`;
  }
}

customElements.define(
  "mi-footer", MiFooter);
