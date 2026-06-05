import { dynId, mountStyles } from "../runtime/utils.js";
import { appStore } from "../runtime/store.js";
import { navigateTo } from "../runtime/navigation.js";
import { Users_OpenUserModal } from "../actions/Users/OpenUserModal.js";

customElements.define("os-layout", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  connectedCallback(){
    this.unsub = appStore.subscribe(() => { this.render(); this.wire(); });
    this.render(); this.wire();
  }
  disconnectedCallback(){ this.unsub?.(); }

  render(){
    const { route, isNavigating, shadowMode } = appStore.get();
    const animate = this._animated ? "" : " animate";
    this.shadowRoot.innerHTML = `
      <div class="layout${animate}" data-os-widget="Layout" data-dynid="${dynId("layout")}">
        <header class="hdr" data-test-id="header">
          <div class="brand">
            <div class="logo">AO</div>
            <div>
              <div class="t">Atlas Ops Console</div>
              <div class="s">Customer + order orchestration for field teams</div>
            </div>
          </div>
          <div class="ha">
            <div class="navstate" data-test-id="nav-state">${isNavigating ? "Navigating..." : ""}</div>
            <div class="env">Live</div>
            <button class="osui-btn ghost" data-test-id="btn-shadow-mode" title="Toggle Shadow Mode">
              Shadow: <span class="mode-val">${shadowMode}</span>
            </button>
            <button class="osui-btn ghost" data-test-id="btn-user">User</button>
          </div>
        </header>

        <aside class="sb" data-test-id="sidebar">
          <div class="mt">Workspace</div>
          <button class="nav ${route.name==="customers"?"active":""}" data-test-id="nav-customers">
            <span class="nav-ic"></span>
            Customers
          </button>
          <button class="nav ${route.name==="orders"?"active":""}" data-test-id="nav-orders">
            <span class="nav-ic"></span>
            Orders
          </button>
          <button class="nav ${route.name==="settings"?"active":""}" data-test-id="nav-settings">
            <span class="nav-ic"></span>
            Settings
          </button>
          <button class="nav ${route.name==="complexShadow"?"active":""}" data-test-id="nav-complex-shadow">
            <span class="nav-ic"></span>
            Shadow Demo
          </button>
        </aside>

        <main class="ct" data-test-id="content">
          <os-router></os-router>
        </main>

        <os-modal-host data-test-id="modal-host"></os-modal-host>
      </div>
    `;
    this._animated = true;
    mountStyles(this.shadowRoot, `
      .layout{
        width:100%;
        display:grid;
        grid-template-columns:260px minmax(0,1fr);
        grid-template-rows:auto 1fr;
        gap:16px;
        padding:18px;
        box-sizing:border-box;
        min-height:100vh;
        position:relative;
      }
      .hdr{
        grid-column:1 / span 2;
        display:flex;
        align-items:center;
        justify-content:space-between;
        background:var(--os-surface);
        border:1px solid var(--os-border);
        border-radius:var(--os-radius);
        padding:14px 18px;
        box-shadow:var(--os-shadow);
      }
      .brand{display:flex;align-items:center;gap:12px;}
      .logo{
        width:42px;height:42px;border-radius:14px;
        background:linear-gradient(145deg,var(--os-accent),var(--os-accent-2));
        color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;
        letter-spacing:.03em;
        box-shadow:0 10px 20px rgba(255,122,61,.25);
      }
      .t{font-weight:700;font-size:16px;}
      .s{font-size:12px;opacity:.7;margin-top:2px;}
      .ha{display:flex;align-items:center;gap:12px;}
      .navstate{font-size:12px;opacity:.65;min-width:90px;text-align:right;}
      .env{font-size:11px;text-transform:uppercase;letter-spacing:.14em;background:var(--os-accent-soft);color:#b6450f;padding:6px 10px;border-radius:999px;}
      .sb{
        background:var(--os-surface);
        border:1px solid var(--os-border);
        border-radius:var(--os-radius);
        padding:14px;
        box-shadow:var(--os-shadow);
      }
      .mt{font-size:11px;opacity:.6;margin-bottom:10px;letter-spacing:.2em;text-transform:uppercase;}
      .nav{
        width:100%;
        text-align:left;
        padding:10px 12px;
        border-radius:14px;
        border:1px solid transparent;
        background:transparent;
        display:flex;
        align-items:center;
        gap:10px;
        font-weight:600;
        color:var(--os-muted);
      }
      .nav-ic{
        width:8px;height:8px;border-radius:999px;background:var(--os-border);
      }
      .nav:hover{border-color:var(--os-border);background:var(--os-surface-soft);cursor:pointer;color:var(--os-text);}
      .nav.active{
        border-color:transparent;
        background:linear-gradient(135deg,rgba(255,122,61,.18),rgba(30,165,154,.18));
        color:var(--os-text);
        box-shadow:0 10px 20px rgba(31,26,22,.08);
      }
      .nav.active .nav-ic{background:var(--os-accent);}
      .ct{
        background:var(--os-surface);
        border:1px solid var(--os-border);
        border-radius:var(--os-radius);
        padding:16px;
        overflow:auto;
        box-shadow:var(--os-shadow);
      }
      .layout.animate .hdr{animation:rise .5s ease both;}
      .layout.animate .sb{animation:rise .6s ease both .06s;}
      .layout.animate .ct{animation:rise .7s ease both .12s;}
      @keyframes rise{
        from{opacity:0;transform:translateY(10px);}
        to{opacity:1;transform:translateY(0);}
      }
      @media (max-width: 980px){
        .layout{grid-template-columns:1fr;grid-template-rows:auto auto 1fr;}
        .hdr{grid-column:1;}
        .sb{display:flex;flex-wrap:wrap;gap:8px;}
        .mt{width:100%;margin-bottom:4px;}
        .nav{flex:1;min-width:120px;justify-content:center;}
        .nav-ic{display:none;}
        .navstate{display:none;}
      }
    `);
  }

  wire(){
    const r = this.shadowRoot;
    r.querySelector('[data-test-id="nav-customers"]')?.addEventListener("click", async () => { location.hash = "#/customers"; await navigateTo({name:"customers", params:{}}); });
    r.querySelector('[data-test-id="nav-orders"]')?.addEventListener("click", async () => { location.hash = "#/orders"; await navigateTo({name:"orders", params:{}}); });
    r.querySelector('[data-test-id="nav-settings"]')?.addEventListener("click", async () => { location.hash = "#/settings"; await navigateTo({name:"settings", params:{}}); });
    r.querySelector('[data-test-id="nav-complex-shadow"]')?.addEventListener("click", async () => { location.hash = "#/complexShadow"; await navigateTo({name:"complexShadow", params:{}}); });
    r.querySelector('[data-test-id="btn-user"]')?.addEventListener("click", () => {
      const host = r.querySelector("os-modal-host");
      Users_OpenUserModal({ modalHost: host });
    });
    r.querySelector('[data-test-id="btn-shadow-mode"]')?.addEventListener("click", () => {
      const newMode = appStore.get().shadowMode === "open" ? "closed" : "open";
      localStorage.setItem("os_shadow_mode", newMode);
      appStore.set({ shadowMode: newMode });
      window.location.reload();
    });
  }
});
