import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

// Base shadow-wrapped iframe component (Level 1)
customElements.define("os-shadow-iframe", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const dataUrl = this.getAttribute("data-url");
    const level = this.getAttribute("level");
    
    this.shadowRoot.innerHTML = `
      <div class="iframe-container">
        <div class="iframe-header">Level ${level}</div>
        <iframe id="shadow-iframe" sandbox="allow-scripts"></iframe>
      </div>
    `;

    mountStyles(this.shadowRoot, `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .iframe-container {
        border: 2px solid #666;
        border-radius: 4px;
        overflow: hidden;
        background: white;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .iframe-header {
        padding: 8px 12px;
        background: #007bff;
        color: white;
        font-size: 12px;
        font-weight: bold;
        flex-shrink: 0;
      }
      iframe {
        width: 100%;
        height: 100%;
        aspect-ratio: 1 / 1;
        border: none;
      }
    `);

    const iframe = this.shadowRoot.getElementById("shadow-iframe");
    if (dataUrl) {
      iframe.src = dataUrl;
    }
  }

  setDataUrl(dataUrl) {
    const iframe = this.shadowRoot?.getElementById("shadow-iframe");
    if (iframe) {
      iframe.src = dataUrl;
    }
  }
});

customElements.define("os-micro-frontend-demo", class extends HTMLElement {
  static get observedAttributes() {
    return ["depth", "branch"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.depth = 3;
    this.branch = 2;
    this.shadow = true
  }

  connectedCallback() {
    if (this.hasAttribute("depth")) {
      this.depth = parseInt(this.getAttribute("depth"), 10) || 3;
    }
    if (this.hasAttribute("branch")) {
      this.branch = parseInt(this.getAttribute("branch"), 10) || 2;
    }
    if (this.hasAttribute("shadow")) {
      this.shadow = this.getAttribute("shadow") === "true";
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
    if (name === "shadow" && oldValue !== newValue) {
      this.shadow = newValue === "true";
      this.render();
    }
  }

  disconnectedCallback() {
    this.appUnsub?.();
  }

  render() {
    const locale = appStore.get().locale || "en";
    
    const gridItems = Array.from({ length: this.branch })
      .map((_, i) => `
        <div class="mfe-wrapper">
          <os-shadow-iframe id="shadow-iframe-${i}" level="1"></os-shadow-iframe>
        </div>
      `)
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

    this.renderIframesSequentially(locale);
    this.applyStyles();
  }

  async renderIframesSequentially(locale) {
    for (let i = 0; i < this.branch; i++) {
      const iframeId = `shadow-iframe-${i}`;
      const appName = `App ${String.fromCharCode(65 + i)}`;
      
      await this.setupIframeAsync(iframeId, appName, locale, this.depth);
    }
  }

  setupIframeAsync(iframeId, appName, locale, depth) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const shadowIframe = this.shadowRoot.getElementById(iframeId);
        if (shadowIframe) {
          const dataUrl = this.buildDataUrl(appName, 1, depth);
          shadowIframe.setDataUrl(dataUrl);

          setTimeout(() => {
            const actualIframe = shadowIframe.shadowRoot?.querySelector("iframe");
            if (actualIframe) {
              actualIframe.onload = () => {
                actualIframe.contentWindow?.postMessage({ type: "locale-changed", locale }, "*");
                resolve();
              };
            }
            setTimeout(resolve, 500);
          }, 100);
        } else {
          resolve();
        }
      }, 100);
    });
  }

  buildDataUrl(appName, level, maxLevel) {
    const html = this.buildLevelDocument(appName, level, maxLevel);
    const encoded = encodeURIComponent(html);
    return `data:text/html;charset=utf-8,${encoded}`;
  }

  getComponentName(level) {
    if (level === 1) return "os-shadow-iframe";
    return "os-shadow-iframe-" + String.fromCharCode(96 + level);
  }

  buildLevelDocument(appName, level, maxLevel) {
    const nextLevel = level + 1;
    const hasNextLevel = nextLevel <= maxLevel;
    const currentComponentName = this.getComponentName(level);
    const nextComponentName = this.getComponentName(nextLevel);
    
    let html = '<!DOCTYPE html><html><head><style>';
    html += 'body { font-family: sans-serif; margin: 0; padding: 0px; background: #eee; overflow: auto; }';
    html += '.container { border: 2px solid #333; padding: 0px; background: white; min-height: 100%; box-sizing: border-box; }';
    html += '.app-shell { border: 1px solid #ddd; padding: 0px; }';
    html += '.app-title { font-size: 14px; margin: 1px 1px 1px 1px; color: #333; }';
    html += '.app-controls { margin: 1px; padding: 0px; background: #f5f5f5; border-radius: 4px; }';
    html += '.checkbox-group { display: flex; align-items: center; gap: 8px; }';
    html += '.checkbox-group input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }';
    html += '.checkbox-group label { font-size: 13px; cursor: pointer; user-select: none; }';
    html += '.app-content { border: 1px dashed #ccc; padding: 0px; }';
    html += '.nested-iframe-wrapper { margin: 1px; width: 100%; height: 300px; box-sizing: border-box; }';
    html += '</style></head><body>';
    html += '<div class="container">';
    html += '<div class="app-shell">';
    html += '<h3 class="app-title">' + appName + ' (Level ' + level + ')</h3>';
    html += '<div class="app-controls">';
    html += '<div class="checkbox-group">';
    html += '<input type="checkbox" id="level-' + level + '-checkbox" />';
    html += '<label for="level-' + level + '-checkbox">Select Level ' + level + '</label>';
    html += '</div>';
    html += '</div>';
    html += '<div class="app-content">';
    
    if (hasNextLevel) {
      html += '<div class="nested-iframe-wrapper">';
      html += '<' + nextComponentName + ' id="nested-shadow-' + nextLevel + '" level="' + nextLevel + '"></' + nextComponentName + '>';
      html += '</div>';
    } else {
      html += '<p><strong>Leaf Level</strong></p>';
    }
    
    html += '</div></div></div>';
    
    html += '<script>';
    
    html += 'setTimeout(function() {';
    html += 'var checkbox = document.getElementById("level-' + level + '-checkbox");';
    html += 'if (checkbox) {';
    html += 'checkbox.addEventListener("change", function() {';
    html += 'console.log("Level ' + level + ' checkbox changed: " + this.checked);';
    html += 'window.parent.postMessage({ type: "checkbox-changed", level: ' + level + ', checked: this.checked }, "*");';
    html += '});';
    html += '}';
    html += '}, 50);';
    
    if (level > 1) {
      html += this.getComponentDefinition(currentComponentName);
    }
    
    if (hasNextLevel) {
      html += this.getComponentDefinition(nextComponentName);
      
      const nextDataUrl = this.buildDataUrl(appName, nextLevel, maxLevel);
      html += 'setTimeout(function() {';
      html += 'var nestedShadow = document.getElementById("nested-shadow-' + nextLevel + '");';
      html += 'if (nestedShadow && nestedShadow.setDataUrl) {';
      html += 'nestedShadow.setDataUrl(' + JSON.stringify(nextDataUrl) + ');';
      html += '}';
      html += '}, 100);';
    }
    
    html += '</script>';
    html += '</body></html>';
    
    return html;
  }

  getComponentDefinition(componentName) {
    return `
    customElements.define("${componentName}", class extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
      }
      
      connectedCallback() {
        const level = this.getAttribute("level");
        this.shadowRoot.innerHTML = '<div class="iframe-container"><div class="iframe-header">Level ' + level + '</div><iframe id="shadow-iframe" sandbox="allow-scripts"></iframe></div>';
        
        const style = document.createElement("style");
        style.textContent = ':host{display:block;width:100%;height:100%;box-sizing:border-box;}.iframe-container{border:2px solid #666;border-radius:4px;overflow:hidden;background:white;width:100%;height:100%;display:flex;flex-direction:column;}.iframe-header{padding:8px 12px;background:#007bff;color:white;font-size:12px;font-weight:bold;flex-shrink:0;}iframe{width:100%; height:100%;flex:1;border:none;display:block;}';
        this.shadowRoot.appendChild(style);
      }
      
      setDataUrl(dataUrl) {
        const iframe = this.shadowRoot?.getElementById("shadow-iframe");
        if (iframe) {
          iframe.src = dataUrl;
        }
      }
    });
    `;
  }

  applyStyles() {
    mountStyles(this.shadowRoot, `
      :host {
        display: block;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
      .mfe-container {
        border: 1px solid var(--os-border-soft);
        padding: 16px;
        background: var(--os-bg-alt, #fafafa);
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
      }
      .mfe-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--os-text-secondary);
        margin: 1px;
      }
      .mfe-config {
        font-size: 0.75rem;
        color: #666;
        margin: 1px;
        font-family: monospace;
      }
      .mfe-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 16px;
        flex: 1;
      }
      .mfe-wrapper {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      }
    `);
  }
});