import { dynId, mountStyles } from "../../runtime/utils.js";

customElements.define("os-branching-nester", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const type = this.getAttribute("type") || "root";
    const label = this.getAttribute("label") || `Branch ${type}`;

    let children = "";
    if (type === "root") {
      children = `
        <os-branching-nester type="left" label="Left Branch"></os-branching-nester>
        <os-branching-nester type="right" label="Right Branch"></os-branching-nester>
      `;
    } else if (type === "left") {
      children = `
        <os-branching-nester type="sub-left" label="Sub-Left"></os-branching-nester>
        <os-branching-nester type="sub-right" label="Sub-Right"></os-branching-nester>
      `;
    } else if (type === "right") {
      children = `
        <os-branching-nester type="sub-left" label="Sub-Left"></os-branching-nester>
        <os-branching-nester type="sub-right" label="Sub-Right"></os-branching-nester>
      `;
    } else {
      children = `<div class="leaf">Terminal Node</div>`;
    }

    this.shadowRoot.innerHTML = `
      <div class="branch-node" data-dynid="${dynId("branch")}">
        <span class="branch-label">${label}</span>
        <div class="branch-content">
          ${children}
        </div>
      </div>
    `;

    mountStyles(this.shadowRoot, `
      .branch-node {
        border-left: 2px dashed var(--os-border-soft);
        padding-left: 16px;
        margin-top: 8px;
        display: flex;
        flex-direction: column;
      }
      .branch-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--os-text-secondary);
      }
      .branch-content {
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
