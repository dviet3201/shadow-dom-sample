import { escapeHtml, mountStyles, dynId } from "../../runtime/utils.js";
import { Customers_SaveCustomer } from "../../actions/Customers/SaveCustomer.js";

customElements.define("os-kpi", class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.model = { key: "", value: "" };
        this.errors = {};
    }
    static get observedAttributes() { return ["mode", "key", "value"]; }
    attributeChangedCallback() { this.render(); this.wire(); }
    connectedCallback() { this.render(); this.wire(); }


    render() {
        const mode = this.getAttribute("mode") || "edit";
        const key = this.getAttribute("key") || "";
        const value = this.getAttribute("value") || "";

        this.shadowRoot.innerHTML = `          
        <div class="kpi">
            <div class="k">${key}</div>
            <div class="v">${value}</div>
        </div>`;
        
        mountStyles(this.shadowRoot, `
            .cap{
                font-size:11px;
                letter-spacing:.18em;
                text-transform:uppercase;
                opacity:.6;
                margin-bottom:12px;
            }
            .actions{display:flex;gap:8px;margin-top:6px;flex-wrap:wrap;}
            .kpi{background:var(--os-surface-soft);border:1px solid var(--os-border);border-radius:14px;padding:10px 12px;}
            `
        );
    }

    wire() {
        const r = this.shadowRoot;
    }
});
