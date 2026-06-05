import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-section", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  static get observedAttributes(){ return ["title"]; }
  attributeChangedCallback(){ this.render(); }
  connectedCallback(){ this.render(); }
  render(){
    const title = this.getAttribute("title") || "";
    this.shadowRoot.innerHTML = `
      <div class="sec" data-os-widget="Section" data-dynid="${dynId("sec")}">
        ${title?`<div class="t">${title}</div>`:""}
        <div class="b"><slot></slot></div>
      </div>`;
    mountStyles(this.shadowRoot, `
      .sec{margin-bottom:16px;}
      .t{
        font-size:11px;
        opacity:.7;
        font-weight:700;
        letter-spacing:.22em;
        text-transform:uppercase;
        margin-bottom:10px;
        color:var(--os-muted);
      }
    `);
  }
});
