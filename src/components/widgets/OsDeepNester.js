import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

customElements.define("os-deep-nester", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.appUnsub = appStore.subscribe(() => this.render());
    this.render();
  }

  disconnectedCallback() {
    this.appUnsub?.();
  }

  render() {
    const depth = parseInt(this.getAttribute("depth") || "0", 10);
    const label = this.getAttribute("label") || t("deep_label");

    this.shadowRoot.innerHTML = `
      <div class="nester-node" data-dynid="${dynId("nester")}">
        <span class="node-label">${label}</span>
        <div class="node-content">
          ${depth > 0 ? `<os-deep-nester depth="${depth - 1}" label="${t("deep_label")}"></os-deep-nester>` : `<div class="leaf">${t("deep_label")} (End)</div>`}
        </div>
      </div>
    `;

    mountStyles(this.shadowRoot, `
      .nester-node {
        border-left: 2px solid var(--os-border-soft);
        padding-left: 16px;
        margin-top: 8px;
        display: flex;
        flex-direction: column;
      }
      .node-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--os-text-secondary);
      }
      .node-content {
        margin-left: 8px;
      }
      .leaf {
        font-size: 0.75rem;
        color: var(--os-text-tertiary);
        padding: 4px;
        font-style: italic;
      }
    `);
  }
});
