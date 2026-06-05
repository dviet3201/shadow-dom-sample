import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-skeleton", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  connectedCallback(){
    this.shadowRoot.innerHTML = `
      <div class="sk" data-os-widget="Skeleton" data-dynid="${dynId("sk")}">
        ${Array.from({length:6}).map(()=>`<div class="row"></div>`).join("")}
      </div>`;
    mountStyles(this.shadowRoot, `
      .row{
        height:14px;
        border-radius:999px;
        background:linear-gradient(90deg,#f1e8dc,#fff7ef,#f1e8dc);
        background-size:200% 100%;
        animation:sh 1.2s linear infinite;
        margin:10px 0;
      }
      @keyframes sh{to{background-position:-200% 0}}
    `);
  }
});
