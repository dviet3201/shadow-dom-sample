import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-card", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  connectedCallback(){
    this.shadowRoot.innerHTML = `<div class="card" data-os-widget="Card" data-dynid="${dynId("card")}"><slot></slot></div>`;
    mountStyles(this.shadowRoot, `
      .card{
        border:1px solid var(--os-border);
        background:var(--os-card);
        border-radius:var(--os-radius);
        padding:14px;
        box-shadow:0 12px 30px rgba(31,26,22,.08);
      }
    `);
  }
});
