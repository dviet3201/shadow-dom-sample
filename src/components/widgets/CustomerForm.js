import { escapeHtml, mountStyles, dynId } from "../../runtime/utils.js";
import { Customers_SaveCustomer } from "../../actions/Customers/SaveCustomer.js";

customElements.define("os-customer-form", class extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.model = { id: "", name:"", email:"", tier:"Gold" };
    this.errors = {};
    this.isSaving = false;
  }
  static get observedAttributes(){ return ["mode","customer-id"]; }
  attributeChangedCallback(){ this.render(); this.wire(); }
  connectedCallback(){ this.render(); this.wire(); }

  validate(){
    const e = {};
    if (!this.model.name.trim()) e.name = "Name is mandatory.";
    if (!this.model.email.trim()) e.email = "Email is mandatory.";
    if (this.model.email && !this.model.email.includes("@")) e.email = "Email is invalid.";
    this.errors = e;
    this.render(); this.wire();
    return Object.keys(e).length === 0;
  }

  async save(){
    if (!this.validate()) return;
    this.isSaving = true; this.render(); this.wire();
    const res = await Customers_SaveCustomer({ model: this.model });
    this.isSaving = false; this.render(); this.wire();

    this.dispatchEvent(new CustomEvent("saved", { bubbles:true, composed:true, detail:{ message:"Customer saved successfully.", id: res.id } }));
  }

  render(){
    const mode = this.getAttribute("mode") || "edit";
    const cid = this.getAttribute("customer-id") || "";
    if (cid && !this.model.id) this.model.id = cid;

    this.shadowRoot.innerHTML = `
      <div class="form" data-os-widget="Form" data-dynid="${dynId("form")}">
        <div class="cap">${mode === "create" ? "Create Mode" : "Edit Mode"} ${cid ? `• ${cid}` : ""}</div>

        <div class="osui-field ${this.errors.name ? "osui-invalid" : ""}">
          <div class="osui-label">Name <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-name" value="${escapeHtml(this.model.name)}" ${this.isSaving?"disabled":""}/>
          ${this.errors.name ? `<div class="osui-error" data-test-id="err-name">${escapeHtml(this.errors.name)}</div>` : ""}
        </div>

        <div class="osui-field ${this.errors.email ? "osui-invalid" : ""}">
          <div class="osui-label">Email <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-email" value="${escapeHtml(this.model.email)}" ${this.isSaving?"disabled":""}/>
          ${this.errors.email ? `<div class="osui-error" data-test-id="err-email">${escapeHtml(this.errors.email)}</div>` : ""}
        </div>

        <div class="osui-field">
          <div class="osui-label">Tier</div>
          <select class="osui-select" data-test-id="sel-tier" ${this.isSaving?"disabled":""}>
            ${["Gold","Silver","Bronze"].map(t => `<option ${this.model.tier===t?"selected":""}>${t}</option>`).join("")}
          </select>
        </div>

        <div class="actions">
          <button class="osui-btn ghost" data-test-id="btn-validate" ${this.isSaving?"disabled":""}>Validate</button>
          <button class="osui-btn primary" data-test-id="btn-save" ${this.isSaving?"disabled":""}>
            ${this.isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    `;
    mountStyles(this.shadowRoot, `
      .cap{
        font-size:11px;
        letter-spacing:.18em;
        text-transform:uppercase;
        opacity:.6;
        margin-bottom:12px;
      }
      .actions{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;}
    `);
  }

  wire(){
    const r = this.shadowRoot;
    r.querySelector('[data-test-id="inp-name"]')?.addEventListener("input",(e)=>this.model.name=e.target.value);
    r.querySelector('[data-test-id="inp-email"]')?.addEventListener("input",(e)=>this.model.email=e.target.value);
    r.querySelector('[data-test-id="sel-tier"]')?.addEventListener("change",(e)=>this.model.tier=e.target.value);
    const btnValidate = r.querySelector('[data-test-id="btn-validate"]');
    if (btnValidate) btnValidate.onclick = () => this.validate();
    const btnSave = r.querySelector('[data-test-id="btn-save"]');
    if (btnSave) btnSave.onclick = () => this.save();
  }
});
