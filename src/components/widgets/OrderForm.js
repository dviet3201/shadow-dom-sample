import { escapeHtml, mountStyles, dynId } from "../../runtime/utils.js";
import { Orders_SaveOrder } from "../../actions/Orders/SaveOrder.js";
import { GetOrderDetailsAggregate } from "../../aggregates/GetOrderDetails.js";

customElements.define("os-order-form", class extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.model = { id: "", customer: "", status: "Pending", total: "", created: "" };
    this.errors = {};
    this.isSaving = false;
    this.isLoading = false;
    this.loadedId = "";
  }
  static get observedAttributes(){ return ["mode","order-id"]; }
  attributeChangedCallback(name, oldValue, newValue){
    if (name === "order-id" && oldValue !== newValue) this.load();
    this.render(); this.wire();
  }
  connectedCallback(){ this.render(); this.wire(); this.load(); }

  async load(){
    const id = this.getAttribute("order-id") || "";
    if (!id) {
      this.loadedId = "";
      this.model = { id: "", customer: "", status: "Pending", total: "", created: "" };
      this.errors = {};
      this.render(); this.wire();
      return;
    }
    if (id === this.loadedId) return;
    this.isLoading = true;
    this.render(); this.wire();
    const res = await GetOrderDetailsAggregate({ id });
    if (res.Row) {
      this.model = { ...res.Row, total: String(res.Row.total ?? "") };
    } else {
      this.model = { id: "", customer: "", status: "Pending", total: "", created: "" };
    }
    this.loadedId = id;
    this.isLoading = false;
    this.render(); this.wire();
  }

  validate(){
    const e = {};
    const total = parseFloat(this.model.total);
    if (!this.model.customer.trim()) e.customer = "Customer is mandatory.";
    if (!this.model.status.trim()) e.status = "Status is mandatory.";
    if (!this.model.total || Number.isNaN(total) || total <= 0) e.total = "Total must be a positive number.";
    if (!this.model.created) e.created = "Created date is mandatory.";
    this.errors = e;
    this.render(); this.wire();
    return Object.keys(e).length === 0;
  }

  async save(){
    if (!this.validate()) return;
    this.isSaving = true; this.render(); this.wire();
    const payload = {
      ...this.model,
      total: parseFloat(this.model.total),
      created: this.model.created || new Date().toISOString().slice(0, 10)
    };
    const res = await Orders_SaveOrder({ model: payload });
    this.isSaving = false;
    this.model = { ...this.model, id: res.id };
    this.render(); this.wire();
    this.dispatchEvent(new CustomEvent("saved", { bubbles:true, composed:true, detail:{ id: res.id } }));
  }

  render(){
    const mode = this.getAttribute("mode") || "edit";
    const disabled = this.isSaving || this.isLoading;

    this.shadowRoot.innerHTML = `
      <div class="form" data-os-widget="Form" data-dynid="${dynId("form")}">
        <div class="cap">${mode === "create" ? "Create Mode" : "Edit Mode"} ${this.model.id ? `• ${escapeHtml(this.model.id)}` : ""}</div>

        <div class="osui-field">
          <div class="osui-label">Order ID</div>
          <input class="osui-input" data-test-id="inp-id" value="${escapeHtml(this.model.id)}" disabled />
        </div>

        <div class="osui-field ${this.errors.customer ? "osui-invalid" : ""}">
          <div class="osui-label">Customer <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-customer" value="${escapeHtml(this.model.customer)}" ${disabled?"disabled":""}/>
          ${this.errors.customer ? `<div class="osui-error" data-test-id="err-customer">${escapeHtml(this.errors.customer)}</div>` : ""}
        </div>

        <div class="osui-field ${this.errors.total ? "osui-invalid" : ""}">
          <div class="osui-label">Total <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-total" inputmode="decimal" value="${escapeHtml(this.model.total)}" ${disabled?"disabled":""}/>
          ${this.errors.total ? `<div class="osui-error" data-test-id="err-total">${escapeHtml(this.errors.total)}</div>` : ""}
        </div>

        <div class="osui-field ${this.errors.status ? "osui-invalid" : ""}">
          <div class="osui-label">Status <span style="opacity:.7">*</span></div>
          <select class="osui-select" data-test-id="sel-status" ${disabled?"disabled":""}>
            ${["Pending","Processing","Shipped","Delivered","Cancelled"]
              .map(s => `<option ${this.model.status===s?"selected":""}>${s}</option>`).join("")}
          </select>
          ${this.errors.status ? `<div class="osui-error" data-test-id="err-status">${escapeHtml(this.errors.status)}</div>` : ""}
        </div>

        <div class="osui-field ${this.errors.created ? "osui-invalid" : ""}">
          <div class="osui-label">Created <span style="opacity:.7">*</span></div>
          <input class="osui-input" data-test-id="inp-created" type="date" value="${escapeHtml(this.model.created)}" ${disabled?"disabled":""}/>
          ${this.errors.created ? `<div class="osui-error" data-test-id="err-created">${escapeHtml(this.errors.created)}</div>` : ""}
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
    r.querySelector('[data-test-id="inp-customer"]')?.addEventListener("input",(e)=>this.model.customer=e.target.value);
    r.querySelector('[data-test-id="inp-total"]')?.addEventListener("input",(e)=>this.model.total=e.target.value);
    r.querySelector('[data-test-id="sel-status"]')?.addEventListener("change",(e)=>this.model.status=e.target.value);
    r.querySelector('[data-test-id="inp-created"]')?.addEventListener("change",(e)=>this.model.created=e.target.value);
    const btnValidate = r.querySelector('[data-test-id="btn-validate"]');
    if (btnValidate) btnValidate.onclick = () => this.validate();
    const btnSave = r.querySelector('[data-test-id="btn-save"]');
    if (btnSave) btnSave.onclick = () => this.save();
  }
});
