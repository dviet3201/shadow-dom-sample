import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-pagination", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  static get observedAttributes(){ return ["page","page-size","total"]; }
  attributeChangedCallback(){ this.render(); this.wire(); }
  connectedCallback(){ this.render(); this.wire(); }

  render(){
    const page = parseInt(this.getAttribute("page") || "1", 10);
    const pageSize = parseInt(this.getAttribute("page-size") || "5", 10);
    const total = parseInt(this.getAttribute("total") || "0", 10);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    this.shadowRoot.innerHTML = `
      <div class="pg" data-os-widget="Pagination" data-dynid="${dynId("pg")}">
        <div class="info" data-test-id="page-info">Page ${page} / ${totalPages}</div>
        <div class="btns">
          <button class="osui-btn" data-test-id="btn-prev" ${page<=1?"disabled":""}>Prev</button>
          <button class="osui-btn" data-test-id="btn-next" ${page>=totalPages?"disabled":""}>Next</button>
        </div>
      </div>`;
    mountStyles(this.shadowRoot, `
      .pg{display:flex;justify-content:space-between;align-items:center;margin-top:12px;}
      .info{font-size:12px;opacity:.7;letter-spacing:.08em;text-transform:uppercase;}
      .btns{display:flex;gap:8px;}
      .osui-btn{padding:6px 10px;border-radius:999px;font-size:12px;}
    `);
  }

  wire(){
    const page = parseInt(this.getAttribute("page") || "1", 10);
    const pageSize = parseInt(this.getAttribute("page-size") || "5", 10);
    const total = parseInt(this.getAttribute("total") || "0", 10);
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    this.shadowRoot.querySelector('[data-test-id="btn-prev"]').onclick = () => {
      if (page > 1) this.dispatchEvent(new CustomEvent("pagechange",{bubbles:true,composed:true,detail:{page: page-1}}));
    };
    this.shadowRoot.querySelector('[data-test-id="btn-next"]').onclick = () => {
      if (page < totalPages) this.dispatchEvent(new CustomEvent("pagechange",{bubbles:true,composed:true,detail:{page: page+1}}));
    };
  }
});
