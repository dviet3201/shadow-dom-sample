import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

customElements.define("os-iframe-nester", class extends HTMLElement {
  static get observedAttributes() {
    return ["depth", "branch"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.depth = 3;
    this.branch = 2;
  }

  connectedCallback() {
    if (this.hasAttribute("depth")) {
      this.depth = parseInt(this.getAttribute("depth"), 10) || 3;
    }
    if (this.hasAttribute("branch")) {
      this.branch = parseInt(this.getAttribute("branch"), 10) || 2;
    }

    this.appUnsub = appStore.subscribe(() => this.render());
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "depth" && oldValue !== newValue) {
      this.depth = parseInt(newValue, 10) || 3;
      this.render();
    }
    if (name === "branch" && oldValue !== newValue) {
      this.branch = parseInt(newValue, 10) || 2;
      this.render();
    }
  }

  disconnectedCallback() {
    this.appUnsub?.();
  }

  render() {
    const gridItems = Array.from({ length: this.branch })
      .map((_, i) => `<div class="mfe-wrapper"><iframe id="nested-iframe-${i}"></iframe></div>`)
      .join("");

    this.shadowRoot.innerHTML = `
      <div class="mfe-container" data-dynid="${dynId("mfe")}">
        <p class="mfe-label">${t("iframe_title")}</p>
        <p class="mfe-config">Depth: ${this.depth} | Branch: ${this.branch}</p>
        <div class="mfe-grid" style="grid-template-columns: repeat(${Math.min(this.branch, 4)}, 1fr);">
          ${gridItems}
        </div>
      </div>
    `;

    this.loadIframes();
    this.applyStyles();
  }

  loadIframes() {
    for (let i = 0; i < this.branch; i++) {
      const iframe = this.shadowRoot.getElementById(`nested-iframe-${i}`);
      if (iframe) {
        const appName = `App ${String.fromCharCode(65 + i)}`;
        const html = this.buildLevelHTML(appName, 1, this.depth);
        iframe.src = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
      }
    }
  }

  buildLevelHTML(appName, currentLevel, maxLevel) {
    const hasNextLevel = currentLevel < maxLevel;
    const nextLevel = currentLevel + 1;

    let html = '<!DOCTYPE html><html><head><style>';
    html += 'body { font-family: sans-serif; margin: 0; padding: 0; background: #eee; overflow: auto; }';
    html += '.container { border: 2px solid #333; padding: 0px; background: white; box-sizing: border-box; }';
    html += '.app-shell { border: 1px solid #ddd; padding: 0px; }';
    html += '.app-title { font-size: 14px; margin: 8px 0; color: #333; }';
    html += '.app-controls { margin: 8px 0; padding: 0px; background: #f5f5f5; border-radius: 4px; }';
    html += '.checkbox-group { display: flex; align-items: center; gap: 8px; }';
    html += '.checkbox-group input { width: 18px; height: 18px; cursor: pointer; }';
    html += '.checkbox-group label { font-size: 13px; cursor: pointer; user-select: none; }';
    html += '.app-content { border: 1px dashed #ccc; padding: 0px; }';
    html += '.nested-iframe-wrapper { width: 100%; height: 100%; border: 2px solid #666; border-radius: 4px; box-sizing: border-box; margin-top: 8px; }';
    html += 'iframe { width: 100%; height: 100%; border: none; display: block; }';
    html += '</style></head><body>';
    
    html += '<div class="container">';
    html += '<div class="app-shell">';
    html += `<h3 class="app-title">${appName} (Level ${currentLevel})</h3>`;
    html += '<div class="app-controls"><div class="checkbox-group">';
    html += `<input type="checkbox" id="level-${currentLevel}-cb" />`;
    html += `<label for="level-${currentLevel}-cb">Select Level ${currentLevel}</label>`;
    html += '</div></div>';
    html += '<div class="app-content">';
    
    if (hasNextLevel) {
      html += `<div class="nested-iframe-wrapper"><iframe id="nested-iframe-${currentLevel}"></iframe></div>`;
    } else {
      html += `<p style="color: #666;"><strong>Leaf Level (${currentLevel})</strong></p>`;
    }
    
    html += '</div></div></div>';
    
    html += '<script>';
    html += `var checkbox = document.getElementById("level-${currentLevel}-cb");`;
    html += `if (checkbox) {`;
    html += `checkbox.addEventListener("change", function() {`;
    html += `console.log("Level ${currentLevel} checked: " + this.checked);`;
    html += `window.parent.postMessage({ type: "checkbox-changed", level: ${currentLevel}, checked: this.checked }, "*");`;
    html += `});`;
    html += `}`;
    
    if (hasNextLevel) {
      const nextHTML = this.buildLevelHTML(appName, nextLevel, maxLevel);
      const encoded = encodeURIComponent(nextHTML);
      html += `setTimeout(function() {`;
      html += `var nested = document.getElementById("nested-iframe-${currentLevel}");`;
      html += `if (nested) nested.src = "data:text/html;charset=utf-8,${encoded}";`;
      html += `}, 100);`;
    }
    
    html += '</script></body></html>';
    return html;
  }

  applyStyles() {
    mountStyles(this.shadowRoot, `
      :host { display: block; width: 100%; height: 100%; box-sizing: border-box; }
      .mfe-container {
        border: 1px solid var(--os-border-soft);
        padding: 8px;
        background: var(--os-bg-alt, #fafafa);
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .mfe-label { font-size: 0.85rem; font-weight: bold; color: var(--os-text-secondary); margin: 0 0 8px 0; }
      .mfe-config { font-size: 0.75rem; color: #666; margin: 0 0 12px 0; font-family: monospace; }
      .mfe-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; flex: 1; }
      .mfe-wrapper { width: 100%; height: 100%; min-height: 100%; border: 1px solid #ccc; border-radius: 4px; overflow: hidden; }
    `);
  }
});