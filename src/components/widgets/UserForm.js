import { escapeHtml, mountStyles, dynId } from "../../runtime/utils.js";
import { Users_SaveUser } from "../../actions/Users/SaveUser.js";
import { GetCurrentUserAggregate } from "../../aggregates/GetCurrentUser.js";

customElements.define("os-user-form", class extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.model = { id: "", name:"", email:"", role:"User", lastLogin:"" };
    this.errors = {};
    this.isSaving = false;
    this.isLoading = false;
    this.feedback = null;
  }
  static get observedAttributes(){ return ["mode"]; }
  attributeChangedCallback(){ this.render(); this.wire(); }
  connectedCallback(){ this.render(); this.wire(); this.load(); }

  async load(){
    this.isLoading = true;
    this.render(); this.wire();
    const res = await GetCurrentUserAggregate();
    this.model = res.Row || { id: "", name:"", email:"", role:"User", lastLogin:"" };
    this.isLoading = false;
    this.render(); this.wire();
  }

  validate(){
    const e = {};
    if (!this.model.name.trim()) e.name = "Name is mandatory.";
    if (!this.model.email.trim()) e.email = "Email is mandatory.";
    if (this.model.email && !this.model.email.includes("@")) e.email = "Email is invalid.";
    if (!this.model.role.trim()) e.role = "Role is mandatory.";
    this.errors = e;
    this.render(); this.wire();
    return Object.keys(e).length === 0;
  }

  async save(){
    if (!this.validate()) return;
    this.isSaving = true; this.render(); this.wire();
    const res = await Users_SaveUser({ model: this.model });
    this.isSaving = false; this.render(); this.wire();
    this.feedback = { type: "success", text: "Profile saved." };
    setTimeout(() => {
      if (this.feedback?.text === "Profile saved.") {
        this.feedback = null;
        this.render(); this.wire();
      }
    }, 2200);
    this.render(); this.wire();
    this.dispatchEvent(new CustomEvent("saved", { bubbles:true, composed:true, detail:{ id: res.id } }));
  }

  render(){
    const mode = this.getAttribute("mode") || "edit";
    const disabled = this.isSaving || this.isLoading;

    this.shadowRoot.innerHTML = `
      <div class="form" data-os-widget="Form" data-dynid="${dynId("form")}">
        <div class="cap">${mode === "create" ? "Create Mode" : "Edit Mode"} ${this.model.id ? `• ${escapeHtml(this.model.id)}` : ""}</div>

        ${this.feedback ? `<os-feedback data-test-id="feedback" type="${this.feedback.type}" text="${escapeHtml(this.feedback.text)}"></os-feedback>` : ""}

        <div class="osui-field">
          <div class="osui-label">User ID</div>
          <input class="osui-input" data-test-id="inp-id" value="${escapeHtml(this.model.id)}" disabled />
        </div>

        <div class="osui-field ${this.errors.name ? "osui-invalid" : ""}">
          <div class="osui-label">Name <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-name" value="${escapeHtml(this.model.name)}" ${disabled?"disabled":""}/>
          ${this.errors.name ? `<div class="osui-error" data-test-id="err-name">${escapeHtml(this.errors.name)}</div>` : ""}
        </div>

        <div class="osui-field ${this.errors.email ? "osui-invalid" : ""}">
          <div class="osui-label">Email <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-email" value="${escapeHtml(this.model.email)}" ${disabled?"disabled":""}/>
          ${this.errors.email ? `<div class="osui-error" data-test-id="err-email">${escapeHtml(this.errors.email)}</div>` : ""}
        </div>

        <div class="osui-field ${this.errors.role ? "osui-invalid" : ""}">
          <div class="osui-label">Role <span style="opacity:.7">*</span></div>
          <select class="osui-select" data-test-id="sel-role" ${disabled?"disabled":""}>
            ${["Admin","Manager","User","Viewer"].map(r => `<option ${this.model.role===r?"selected":""}>${r}</option>`).join("")}
          </select>
          ${this.errors.role ? `<div class="osui-error" data-test-id="err-role">${escapeHtml(this.errors.role)}</div>` : ""}
        </div>

        <div class="osui-field">
          <div class="osui-label">Last Login</div>
          <input class="osui-input" data-test-id="inp-last-login" value="${escapeHtml(this.model.lastLogin)}" disabled />
        </div>

        <div class="actions">
          <button class="osui-btn ghost" data-test-id="btn-validate" ${disabled?"disabled":""}>Validate</button>
          <button class="osui-btn primary" data-test-id="btn-save" ${disabled?"disabled":""}>
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
    r.querySelector('[data-test-id="sel-role"]')?.addEventListener("change",(e)=>this.model.role=e.target.value);
    const btnValidate = r.querySelector('[data-test-id="btn-validate"]');
    if (btnValidate) btnValidate.onclick = () => this.validate();
    const btnSave = r.querySelector('[data-test-id="btn-save"]');
    if (btnSave) btnSave.onclick = () => this.save();
  }
});
