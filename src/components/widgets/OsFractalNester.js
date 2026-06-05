import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

if (!window.fractalHostRegistry) {
  window.fractalHostRegistry = new Map();
}

customElements.define("os-fractal-nester", class extends HTMLElement {
  static get observedAttributes() {
    return ["depth", "branching-factor"];
  }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this._hasRendered = false;

    this.onHostDragStart = this.onHostDragStart.bind(this);
    this.onHostDragEnd = this.onHostDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDragEnter = this.onDragEnter.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onPointerTrack = this.onPointerTrack.bind(this);
    this.onPointerReset = this.onPointerReset.bind(this);
  }

  connectedCallback() {
    this.setAttribute("draggable", "true");

    this.addEventListener("dragstart", this.onHostDragStart);
    this.addEventListener("dragend", this.onHostDragEnd);

    this.shadowRoot.addEventListener("dragstart", this.onDragStart);
    this.shadowRoot.addEventListener("dragend", this.onDragEnd);
    this.shadowRoot.addEventListener("dragover", this.onDragOver);
    this.shadowRoot.addEventListener("dragenter", this.onDragEnter);
    this.shadowRoot.addEventListener("dragleave", this.onDragLeave);
    this.shadowRoot.addEventListener("drop", this.onDrop);
    this.shadowRoot.addEventListener("pointermove", this.onPointerTrack);
    this.shadowRoot.addEventListener("click", this.onPointerTrack);
    this.shadowRoot.addEventListener("pointerleave", this.onPointerReset);
    this.addEventListener("pointerleave", this.onPointerReset);
    this.addEventListener("pointercancel", this.onPointerReset);

    if (!this._hasRendered) {
      this.render();
    } else {
      const id = this.getAttribute("fractal-id");
      if (id) {
        window.fractalHostRegistry.set(id, this);
      }
    }
  }

  disconnectedCallback() {
    this.appUnsub?.();
    const id = this.getAttribute("fractal-id");
    if (id) {
      window.fractalHostRegistry.delete(id);
    }

    this.removeEventListener("dragstart", this.onHostDragStart);
    this.removeEventListener("dragend", this.onHostDragEnd);

    this.shadowRoot.removeEventListener("dragstart", this.onDragStart);
    this.shadowRoot.removeEventListener("dragend", this.onDragEnd);
    this.shadowRoot.removeEventListener("dragover", this.onDragOver);
    this.shadowRoot.removeEventListener("dragenter", this.onDragEnter);
    this.shadowRoot.removeEventListener("dragleave", this.onDragLeave);
    this.shadowRoot.removeEventListener("drop", this.onDrop);
    this.shadowRoot.removeEventListener("pointermove", this.onPointerTrack);
    this.shadowRoot.removeEventListener("click", this.onPointerTrack);
    this.shadowRoot.removeEventListener("pointerleave", this.onPointerReset);
    this.removeEventListener("pointerleave", this.onPointerReset);
    this.removeEventListener("pointercancel", this.onPointerReset);
  }

  onHostDragStart(event) {
    event.dataTransfer.effectAllowed = "move";
    const sourceId = this.getAttribute("fractal-id") || "";
    event.dataTransfer.setData("text/plain", sourceId);
    this.style.opacity = "0.65";
  }

  onHostDragEnd() {
    this.style.opacity = "";
  }

  onDragStart(event) {
    const node = event.target.closest(".fractal-node, .fractal-leaf");
    if (!node) return;

    event.stopPropagation();
    event.dataTransfer.effectAllowed = "move";
    const sourceId = this.getAttribute("fractal-id") || node.dataset.dynid || "";
    event.dataTransfer.setData("text/plain", sourceId);
    node.classList.add("dragging");
  }

  onDragEnd(event) {
    const node = event.target.closest(".fractal-node, .fractal-leaf");
    if (node) {
      node.classList.remove("dragging");
    }
  }

  onDragOver(event) {
    const node = event.target.closest(".fractal-node");
    if (!node) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    node.classList.add("drop-target");
  }

  onDragEnter(event) {
    const node = event.target.closest(".fractal-node");
    if (!node) return;

    event.preventDefault();
    node.classList.add("drop-target");
  }

  onDragLeave(event) {
    const node = event.target.closest(".fractal-node");
    if (!node) return;

    node.classList.remove("drop-target");
  }

  onDrop(event) {
    const node = event.target.closest(".fractal-node");
    if (!node) return;

    event.preventDefault();
    event.stopPropagation();
    node.classList.remove("drop-target");

    const sourceId = event.dataTransfer.getData("text/plain");
    if (!sourceId) return;

    const sourceHost = window.fractalHostRegistry.get(sourceId);
    if (!sourceHost || sourceHost === this || sourceHost.contains(this)) return;

    const destination = this.shadowRoot.querySelector(".node-children");
    if (!destination) return;

    destination.appendChild(sourceHost);
  }

  onPointerReset() {
    this.shadowRoot.querySelectorAll('.pointer-info').forEach((info) => {
      info.textContent = 'pointer: --';
      info.dataset.pointerActive = 'true';
    });
  }

  onPointerTrack(event) {
    const node = event.target.closest(".fractal-node, .fractal-leaf");
    if (!node) return;

    this.shadowRoot.querySelectorAll('.pointer-info').forEach((info) => {
      info.textContent = 'pointer: --';
      info.dataset.pointerActive = 'true';
    });

    const rect = node.getBoundingClientRect();
    const localX = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
    const localY = Math.max(0, Math.min(rect.height, event.clientY - rect.top));

    const x = Math.round(localX);
    const y = Math.round(localY);
    node.dataset.pointerX = String(x);
    node.dataset.pointerY = String(y);
    node.dataset.pointerLocation = x + ',' + y;
    node.title = 'pointer: ' + x + ', ' + y;

    const pointerInfo = node.querySelector('.pointer-info');
    if (pointerInfo) {
      pointerInfo.textContent = 'pointer: ' + x + ', ' + y;
      pointerInfo.dataset.pointerActive = 'true';
    }

    if (event.type === "click") {
      console.info('[os-fractal-nester] pointer location', {
        x,
        y,
        dynid: node.dataset.dynid,
        type: node.classList.contains("fractal-node") ? 'node' : 'leaf'
      });
    }
  }

  render() {
    const depth = parseInt(this.getAttribute("depth") || "0", 10);
    const branchingFactor = parseInt(this.getAttribute("branching-factor") || "2", 10);
    const id = this.getAttribute("fractal-id") || dynId("fractal");
    this.setAttribute("fractal-id", id);
    window.fractalHostRegistry.set(id, this);
    this._hasRendered = true;

    if (depth <= 0) {
      this.shadowRoot.innerHTML = `
        <div class="fractal-leaf" data-dynid="${id}" draggable="true">
          <span class="leaf-text">${t("deep_label")} (Leaf)</span>
          <span class="pointer-info" data-pointer-active="true">pointer: --</span>
        </div>
      `;
      this.applyStyles(true);
      return;
    }

    let childrenHtml = "";
    for (let i = 0; i < branchingFactor; i++) {
      childrenHtml += `<os-fractal-nester
        depth="${depth - 1}"
        branching-factor="${branchingFactor}"
        fractal-id="${id}-child-${i}"
      ></os-fractal-nester>`;
    }

    this.shadowRoot.innerHTML = `
      <div class="fractal-node" data-dynid="${id}" draggable="true">
        <div class="node-header">
          <span class="node-depth">${t("deep_label")} ${depth}</span>
          <span class="node-id">${id.slice(0, 8)}...</span>
        </div>
        <div class="pointer-info" data-pointer-active="true">pointer: --</div>
        <div class="node-children">
          ${childrenHtml}
        </div>
      </div>
    `;
    this.applyStyles(false);
  }

  applyStyles(isLeaf) {
    if (isLeaf) {
      mountStyles(this.shadowRoot, `
        .fractal-leaf {
          padding: 4px 8px;
          background: var(--os-accent-soft);
          border-radius: 4px;
          font-size: 10px;
          color: var(--os-accent);
          border: 1px solid var(--os-accent);
          cursor: grab;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .fractal-leaf.dragging {
          opacity: 0.65;
          transform: scale(1.02);
          border-color: var(--os-accent-dark);
        }
        .leaf-text {
          font-weight: bold;
        }
        .pointer-info {
          font-size: 8px;
          line-height: 1.2;
          color: var(--os-accent-dark);
          background: rgba(255, 255, 255, 0.55);
          border-radius: 999px;
          padding: 1px 4px;
          align-self: flex-start;
          display: none;
        }
        .pointer-info[data-pointer-active="true"] {
          display: inline-flex;
        }
      `);
    } else {
      mountStyles(this.shadowRoot, `
        .fractal-node {
          border: 1px solid var(--os-border-soft);
          padding: 8px;
          background: var(--os-surface);
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          cursor: grab;
        }
        .fractal-node.dragging {
          opacity: 0.65;
          transform: scale(1.02);
          border-color: var(--os-accent);
        }
        .fractal-node.drop-target {
          outline: 2px dashed var(--os-accent);
          outline-offset: -2px;
        }
        .node-header {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          color: var(--os-text-tertiary);
          margin-bottom: 4px;
          border-bottom: 1px solid var(--os-border-ultra-light);
          padding-bottom: 2px;
        }
        .pointer-info {
          font-size: 8px;
          line-height: 1.2;
          color: var(--os-accent-dark);
          background: rgba(255, 255, 255, 0.55);
          border-radius: 999px;
          padding: 1px 4px;
          margin-bottom: 4px;
          align-self: flex-start;
          display: inline-flex;
        }
        .node-children {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
          gap: 4px;
        }
      `);
    }
  }
});