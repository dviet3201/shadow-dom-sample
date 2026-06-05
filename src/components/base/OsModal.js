import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-modal", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  connectedCallback(){ this.render(); this.wire(); }

  render(){
    const title = this.getAttribute("title") || "Popup";
    const confirmText = this.getAttribute("confirm-text") || "Close";
    const bodyTemplate = this.getAttribute("body-template") || "";

    this.shadowRoot.innerHTML = `
      <div class="bd" role="dialog" aria-modal="true" data-os-widget="Popup" data-dynid="${dynId("popup")}">
        <div class="card">
          <div class="h" data-test-id="modal-title">${title}</div>
          <div class="b" data-test-id="modal-body"></div>
          <div class="a"><button class="osui-btn" data-test-id="btn-close">${confirmText}</button></div>
        </div>
      </div>`;
    this.shadowRoot.querySelector('[data-test-id="modal-body"]').innerHTML = bodyTemplate;

    mountStyles(this.shadowRoot, `
      .bd{
        position:fixed;
        inset:0;
        background:rgba(21,14,8,.35);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:9999;
        backdrop-filter:blur(4px);
      }
      .card{
        width:min(740px,92vw);
        background:var(--os-surface);
        border-radius:18px;
        border:1px solid var(--os-border);
        padding:16px;
        box-shadow:0 24px 60px rgba(31,26,22,.2);
      }
      .h{font-weight:700;margin-bottom:10px;font-size:16px;}
      .a{display:flex;justify-content:flex-end;margin-top:12px;}
    `);
  }

  wire(){
    this.shadowRoot.querySelector('[data-test-id="btn-close"]').onclick = () =>
      this.dispatchEvent(new CustomEvent("close",{bubbles:true,composed:true}));
    this.shadowRoot.querySelector(".bd").onclick = (e) => {
      if (e.target.classList.contains("bd")) {
        this.dispatchEvent(new CustomEvent("close",{bubbles:true,composed:true}));
      }
    };
  }
});
