import { dynId, escapeHtml, mountStyles } from "../runtime/utils.js";
import { createStore } from "../runtime/reactive.js";
import { GetCustomerDetailsAggregate } from "../aggregates/GetCustomerDetails.js";
import { navigateTo } from "../runtime/navigation.js";

customElements.define("os-screen-customer-details", class extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.screenId = dynId("screen_customer_details");
    this.screenStore = createStore({
      isLoading: true,
      row: null,
      feedback: null
    });
  }

  static get observedAttributes(){ return ["customer-id"]; }
  attributeChangedCallback(){ this.load(); }

  connectedCallback(){
    this.unsub = this.screenStore.subscribe(() => { this.render(); this.wire(); });
    this.render(); this.wire();
    this.load();
  }
  disconnectedCallback(){ this.unsub?.(); }

  async load(){
    const id = this.getAttribute("customer-id") || "";
    if (!id) return;
    this.screenStore.set({ isLoading: true });
    const res = await GetCustomerDetailsAggregate({ id });
    this.screenStore.set({ isLoading: false, row: res.Row });
  }

  render(){
    const { isLoading, row } = this.screenStore.get();
    const id = this.getAttribute("customer-id") || "";
    const animate = this._animated ? "" : " animate";

    this.shadowRoot.innerHTML = `
      <div class="screen${animate}" data-os-widget="Screen" data-dynid="${dynId("scr")}">
        <div class="hdr">
          <div>
            <div class="h1" data-test-id="screen-title">Customer Details</div>
            <div class="crumbs">Home / Customers / ${escapeHtml(id)}</div>
          </div>
          <div class="act">
            <button class="osui-btn ghost" data-test-id="btn-back">Back</button>
          </div>
        </div>

        <os-card data-test-id="card-details">
          ${isLoading ? `
            <os-skeleton data-test-id="skeleton"></os-skeleton>
          ` : row ? `
            <div class="grid">
              <div><div class="k">ID</div><div class="v" data-test-id="val-id">${escapeHtml(row.id)}</div></div>
              <div><div class="k">Name</div><div class="v" data-test-id="val-name">${escapeHtml(row.name)}</div></div>
              <div><div class="k">Email</div><div class="v" data-test-id="val-email">${escapeHtml(row.email)}</div></div>
              <div><div class="k">Tier</div><div class="v" data-test-id="val-tier">${escapeHtml(row.tier)}</div></div>
              <div><div class="k">Created</div><div class="v" data-test-id="val-created">${escapeHtml(row.created)}</div></div>
            </div>

            <div class="sep"></div>

            <os-section title="Edit (Form)">
              <os-customer-form data-test-id="customer-form" mode="edit" customer-id="${escapeHtml(row.id)}"></os-customer-form>
            </os-section>
          ` : `
            <div data-test-id="not-found">Not found.</div>
          `}
        </os-card>
      </div>
    `;
    this._animated = true;

    mountStyles(this.shadowRoot, `
      .screen.animate > *{animation:rise .5s ease both;}
      .screen.animate > *:nth-child(1){animation-delay:.02s;}
      .screen.animate > *:nth-child(2){animation-delay:.08s;}
      .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
      .h1{font-size:22px;font-weight:700;}
      .crumbs{font-size:12px;opacity:.65;margin-top:2px;}
      .grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}
      .k{font-size:10px;letter-spacing:.2em;text-transform:uppercase;opacity:.6;}
      .v{font-weight:700;font-size:15px;margin-top:4px;}
      .sep{height:1px;background:var(--os-border-soft);margin:14px 0;}
      @keyframes rise{
        from{opacity:0;transform:translateY(10px);}
        to{opacity:1;transform:translateY(0);}
      }
      @media (max-width: 760px){
        .grid{grid-template-columns:1fr;}
      }
    `);
  }

  wire(){
    const r = this.shadowRoot;
    r.querySelector('[data-test-id="btn-back"]')?.addEventListener("click", async () => {
      location.hash = "#/customers";
      await navigateTo({ name: "customers", params: {} });
    });
  }
});
