import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-tabs", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  static get observedAttributes(){ return ["active"]; }
  attributeChangedCallback(){ this.render(); this.wire(); }
  connectedCallback(){ this.render(); this.wire(); }

  render(){
    const active = this.getAttribute("active") || "list";
    this.shadowRoot.innerHTML = `
      <div class="tabs" data-os-widget="Tabs" data-dynid="${dynId("tabs")}">
        <div class="bar" role="tablist"><slot name="tab"></slot></div>
        <div class="pan"><slot name="panel"></slot></div>
      </div>`;
    mountStyles(this.shadowRoot, `
      .bar{display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap;}
      ::slotted([slot="tab"]){
        border:1px solid var(--os-border);
        background:var(--os-surface);
        padding:8px 14px;
        border-radius:999px;
        cursor:pointer;
        font-weight:600;
        color:var(--os-muted);
      }
      ::slotted([slot="tab"][aria-selected="true"]){
        font-weight:700;
        color:var(--os-text);
        background:linear-gradient(135deg,rgba(255,122,61,.18),rgba(30,165,154,.18));
        border-color:transparent;
      }
      .pan{
        border:1px solid var(--os-border);
        border-radius:var(--os-radius);
        padding:14px;
        background:var(--os-surface-soft);
      }
      ::slotted([slot="panel"]){display:none;}
      ::slotted([slot="panel"][data-panel="${active}"]){display:block;}
    `);
  }

  wire(){
    const active = this.getAttribute("active") || "list";
    this.querySelectorAll('[slot="tab"][data-tab]').forEach(btn => {
      btn.setAttribute("role","tab");
      btn.setAttribute("aria-selected", btn.dataset.tab === active ? "true" : "false");
      btn.onclick = () => this.dispatchEvent(new CustomEvent("tabchange",{bubbles:true,composed:true,detail:{tab:btn.dataset.tab}}));
    });
  }
});
