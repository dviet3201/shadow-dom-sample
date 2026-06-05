customElements.define("os-modal-host", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  connectedCallback(){ this.shadowRoot.innerHTML = `<div class="host"></div>`; }
  open({ title, bodyTemplate, confirmText="Close" }) {
    const m = document.createElement("os-modal");
    m.setAttribute("title", title);
    m.setAttribute("confirm-text", confirmText);
    m.setAttribute("body-template", bodyTemplate || "");
    m.addEventListener("close", () => m.remove());
    this.shadowRoot.querySelector(".host").appendChild(m);
  }
});
