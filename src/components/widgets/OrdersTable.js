import { dynId, mountStyles, parseJsonAttr } from "../../runtime/utils.js";

customElements.define("os-table-orders", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  static get observedAttributes(){ return ["rows"]; }
  attributeChangedCallback(){ this.render(); this.wire(); }
  connectedCallback(){ this.render(); this.wire(); }

  render(){
    const rows = parseJsonAttr(this, "rows", []);
    this.shadowRoot.innerHTML = `
      <div data-os-widget="TableOrders" data-dynid="${dynId("to")}">
        <table class="t" data-test-id="table">
          <thead>
            <tr><th>ID</th><th>Customer</th><th>Status</th><th>Total</th><th>Created</th><th></th></tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr data-row-id="${r.id}">
                <td>${r.id}</td>
                <td>${r.customer}</td>
                <td><span class="st ${r.status.toLowerCase()}">${r.status}</span></td>
                <td>$${Number(r.total).toFixed(2)}</td>
                <td>${r.created}</td>
                <td><button class="osui-btn" data-test-id="btn-edit-${r.id}">Edit</button></td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
    mountStyles(this.shadowRoot, `
      .t{
        width:100%;
        border-collapse:separate;
        border-spacing:0;
        background:var(--os-surface);
        border-radius:14px;
        overflow:hidden;
        box-shadow:0 10px 20px rgba(31,26,22,.06);
      }
      th,td{
        padding:12px 10px;
        border-bottom:1px solid var(--os-border-soft);
        text-align:left;
        font-size:13px;
      }
      thead th{
        font-size:11px;
        letter-spacing:.18em;
        text-transform:uppercase;
        opacity:.7;
        background:var(--os-surface-soft);
      }
      tbody tr:hover{background:#fff4ea;}
      .osui-btn{padding:6px 10px;border-radius:999px;font-size:12px;}
      .st{display:inline-block;padding:4px 10px;border-radius:999px;font-size:11px;border:1px solid var(--os-border-soft);background:#f6f0e7;}
      .st.pending{background:#fff0d6;border-color:#f7d6a3;}
      .st.processing{background:#e8f3ff;border-color:#c7def4;}
      .st.shipped{background:#eef0ff;border-color:#d0d6f7;}
      .st.delivered{background:#eafaf0;border-color:#cdebd9;}
      .st.cancelled{background:#ffe6ea;border-color:#f2c4cc;}
    `);
  }

  wire(){
    this.shadowRoot.querySelectorAll('button[data-test-id^="btn-edit-"]').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute("data-test-id").replace("btn-edit-","");
        this.dispatchEvent(new CustomEvent("editrow",{bubbles:true,composed:true,detail:{id}}));
      };
    });
  }
});
