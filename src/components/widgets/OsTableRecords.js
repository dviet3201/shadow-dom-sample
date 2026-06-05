import { dynId, mountStyles, parseJsonAttr } from "../../runtime/utils.js";

customElements.define("os-table-records", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  static get observedAttributes(){ return ["rows"]; }
  attributeChangedCallback(){ this.render(); this.wire(); }
  connectedCallback(){ this.render(); this.wire(); }

  render(){
    const rows = parseJsonAttr(this, "rows", []);
    this.shadowRoot.innerHTML = `
      <div data-os-widget="TableRecords" data-dynid="${dynId("tr")}">
        <table class="t" data-test-id="table">
          <thead><tr><th>ID</th><th>Name</th><th>Tier</th><th>Email</th><th>Created</th><th></th></tr></thead>
          <tbody>
            ${rows.map(r => `
              <tr data-row-id="${r.id}">
                <td>${r.id}</td><td>${r.name}</td><td>${r.tier}</td><td>${r.email}</td><td>${r.created}</td>
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
