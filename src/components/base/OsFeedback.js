import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-feedback", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  static get observedAttributes(){ return ["type","text"]; }
  attributeChangedCallback(){ this.render(); }
  connectedCallback(){ this.render(); }
  render(){
    const type = this.getAttribute("type") || "info";
    const text = this.getAttribute("text") || "";
    this.shadowRoot.innerHTML = `
      <div class="fb ${type}" data-os-widget="FeedbackMessage" data-dynid="${dynId("fb")}">
        <div class="dot">●</div>
        <div class="txt" data-test-id="feedback-text">${text}</div>
      </div>`;
    mountStyles(this.shadowRoot, `
      .fb{
        display:flex;
        gap:10px;
        align-items:center;
        border-radius:14px;
        padding:10px 12px;
        margin:12px 0 14px 0;
        border:1px solid var(--os-border);
        box-shadow:0 12px 24px rgba(31,26,22,.08);
      }
      .dot{opacity:.7}
      .info{background:var(--os-surface-soft)}
      .success{background:#effcf4;border-color:#cfe9da;}
      .error{background:#fff2f4;border-color:#f2ccd3;}
      .txt{font-size:13px;font-weight:500;}
    `);
  }
});
