import { dynId, escapeHtml, mountStyles } from "../runtime/utils.js";
import { createStore } from "../runtime/reactive.js";
import { bus } from "../runtime/store.js";
import { Customers_RefreshCustomers } from "../actions/Customers/RefreshCustomers.js";
import { Customers_SearchCustomers } from "../actions/Customers/SearchCustomers.js";
import { Customers_OpenCreateModal } from "../actions/Customers/OpenCreateModal.js";
import { navigateTo } from "../runtime/navigation.js";

customElements.define("os-screen-customers", class extends HTMLElement {
  constructor(){
    super();
    this.attachShadow({mode:"open"});
    this.screenId = dynId("screen_customers");
    this.screenStore = createStore({
      activeTab: "list",
      isLoading: true,
      isRefreshing: false,
      feedback: null,
      query: "",
      page: 1,
      pageSize: 5,
      rows: [],
      total: 0
    });
  }

  connectedCallback(){
    this.unsub = this.screenStore.subscribe(() => { this.render(); this.wire(); });
    this.render(); this.wire();

    // Screen events
    bus.emit("Screen.OnInitialize", { screenId: this.screenId });

    // Initial aggregate
    Customers_RefreshCustomers({ screenStore: this.screenStore }).catch(() => {});
  }

  disconnectedCallback(){ this.unsub?.(); }

  showFeedback(type, text){
    this.screenStore.set({ feedback: { type, text } });
    setTimeout(() => {
      const cur = this.screenStore.get().feedback;
      if (cur?.text === text) this.screenStore.set({ feedback: null });
    }, 2500);
  }

  render(){
    const s = this.screenStore.get();
    const start = (s.page - 1) * s.pageSize;
    const visible = s.rows.slice(start, start + s.pageSize);
    const animate = this._animated ? "" : " animate";

    this.shadowRoot.innerHTML = `
      <div class="screen${animate}" data-os-widget="Screen" data-dynid="${dynId("scr")}">
        <div class="hdr">
          <div>
            <div class="h1" data-test-id="screen-title">Customers</div>
            <div class="crumbs">Home / Customers</div>
          </div>
          <div class="act">
            <button class="osui-btn primary" data-test-id="btn-new" ${s.isLoading?"disabled":""}>New</button>
          </div>
        </div>

        <div class="kpis">
          <os-kpi key="Total Customers" value="${s.total}"></os-kpi>
          <os-kpi key="Viewing" value="${visible.length}"></os-kpi>
          <os-kpi key="Page" value="${s.page}"></os-kpi>
        </div>

        ${s.feedback ? `<os-feedback data-test-id="feedback" type="${s.feedback.type}" text="${escapeHtml(s.feedback.text)}"></os-feedback>` : ""}

        <os-block data-os-block="MainContent">
          <os-section title="Search" data-test-id="section-search">
            <osui-wrapper data-os-widget="Input" shadow="closed">
              <div class="searchrow">
                <input class="osui-input" data-test-id="inp-search" placeholder="Search by name, email or id" value="${escapeHtml(s.query)}" ${s.isLoading?"disabled":""}>
                <button class="osui-btn primary" data-test-id="btn-search" ${s.isLoading?"disabled":""}>Search</button>
                <button class="osui-btn ghost" data-test-id="btn-clear" ${s.isLoading?"disabled":""}>Clear</button>
              </div>
            </osui-wrapper>
          </os-section>

          <os-tabs data-test-id="tabs" active="${s.activeTab}">
            <button slot="tab" data-tab="list" data-test-id="tab-list">List</button>
            <button slot="tab" data-tab="details" data-test-id="tab-details">Details</button>

            <div slot="panel" data-panel="list">
              <os-section title="Customer List" data-test-id="section-list">
                <div class="toolbar">
                  <div class="meta" data-test-id="lbl-count">${s.total} records</div>
                  <button class="osui-btn" data-test-id="btn-refresh" ${s.isLoading||s.isRefreshing?"disabled":""}>
                    ${s.isRefreshing?"Refreshing...":"Refresh"}
                  </button>
                </div>

                <os-card data-test-id="card-table">
                  ${s.isLoading ? `
                    <os-skeleton data-test-id="skeleton"></os-skeleton>
                  ` : `
                    <os-table-records data-test-id="table-customers"
                      rows='${JSON.stringify(visible).replaceAll("'", "&apos;")}'>
                    </os-table-records>

                    <os-pagination data-test-id="pagination"
                      page="${s.page}" page-size="${s.pageSize}" total="${s.total}">
                    </os-pagination>
                  `}
                </os-card>
              </os-section>
            </div>

            <div slot="panel" data-panel="details">
              <os-section title="Create / Edit" data-test-id="section-details">
                <os-card data-test-id="card-form">
                  <os-customer-form data-test-id="customer-form" mode="edit"></os-customer-form>
                </os-card>
              </os-section>
            </div>
          </os-tabs>
        </os-block>

        <os-modal-host data-test-id="modal-host"></os-modal-host>
      </div>
    `;
    this._animated = true;

    mountStyles(this.shadowRoot, `
      .screen.animate > *{animation:rise .5s ease both;}
      .screen.animate > *:nth-child(1){animation-delay:.02s;}
      .screen.animate > *:nth-child(2){animation-delay:.08s;}
      .screen.animate > *:nth-child(3){animation-delay:.14s;}
      .screen.animate > *:nth-child(4){animation-delay:.2s;}
      .hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
      .h1{font-size:22px;font-weight:700;}
      .crumbs{font-size:12px;opacity:.65;margin-top:2px;}
      .kpis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0 6px 0;}
      .kpi{background:var(--os-surface-soft);border:1px solid var(--os-border);border-radius:14px;padding:10px 12px;}
      .k{font-size:10px;letter-spacing:.2em;text-transform:uppercase;opacity:.6;}
      .v{font-size:18px;font-weight:700;margin-top:6px;}
      .searchrow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
      .toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
      .meta{font-size:12px;opacity:.7;}
      @keyframes rise{
        from{opacity:0;transform:translateY(10px);}
        to{opacity:1;transform:translateY(0);}
      }
      @media (max-width: 760px){
        .kpis{grid-template-columns:1fr;gap:8px;}
      }
    `);
  }

  wire(){
    const r = this.shadowRoot;
    const s = this.screenStore.get();

    r.querySelector('[data-test-id="btn-new"]')?.addEventListener("click", () => {
      const host = r.querySelector("os-modal-host");
      Customers_OpenCreateModal({ modalHost: host });
    });

    // Search row is inside a closed osui-wrapper, so we bind from host DOM (composed events pattern)
    // We still can reach via light DOM since input/buttons are slotted inside wrapper (host)
    const inp = r.querySelector('[data-test-id="inp-search"]');
    r.querySelector('[data-test-id="btn-search"]')?.addEventListener("click", async () => {
      await Customers_SearchCustomers({ screenStore: this.screenStore, query: inp?.value || "" });
      this.showFeedback("info", "Search executed");
    });
    r.querySelector('[data-test-id="btn-clear"]')?.addEventListener("click", async () => {
      await Customers_SearchCustomers({ screenStore: this.screenStore, query: "" });
      this.showFeedback("info", "Search cleared");
    });
    inp?.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        await Customers_SearchCustomers({ screenStore: this.screenStore, query: inp.value });
        this.showFeedback("info", "Search executed");
      }
    });

    r.querySelector('[data-test-id="btn-refresh"]')?.addEventListener("click", async () => {
      await Customers_RefreshCustomers({ screenStore: this.screenStore });
      this.showFeedback("info", "Refreshed");
    });

    r.querySelector("os-tabs")?.addEventListener("tabchange", (e) => this.screenStore.set({ activeTab: e.detail.tab }));

    r.querySelector("os-pagination")?.addEventListener("pagechange", (e) => this.screenStore.set({ page: e.detail.page }));

    r.querySelector("os-table-records")?.addEventListener("editrow", async (e) => {
      // Navigate to details screen with param (PrepareForNavigation simulated in runtime)
      location.hash = `#/customers/${encodeURIComponent(e.detail.id)}`;
      await navigateTo({ name: "customerDetails", params: { id: e.detail.id } });
    });

    r.querySelectorAll("os-customer-form").forEach(form => {
      form.addEventListener("saved", async () => {
        this.showFeedback("success", "Saved.");
        await Customers_RefreshCustomers({ screenStore: this.screenStore });
      });
    });
  }
});
