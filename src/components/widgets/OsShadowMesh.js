import { dynId, mountStyles } from "../../runtime/utils.js";
import { appStore } from "../../runtime/store.js";
import { t } from "../../services/I18nService.js";

customElements.define("os-shadow-mesh", class extends HTMLElement {
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
    const locale = appStore.get().locale || "en";
    this.shadowRoot.innerHTML = `
      <div class="mfe-container" data-dynid="${dynId("mfe")}">
        <p class="mfe-label">${t("iframe_title")}</p>
        <div class="mfe-grid">
          <div class="mfe-wrapper">
            <iframe id="mfe-iframe-1" sandbox="allow-scripts"></iframe>
          </div>
        </div>
      </div>
    `;

    this.setupIframe("mfe-iframe-1", "App Alpha", locale);
    this.setupIframe("mfe-iframe-2", "App Beta", locale);

    this.applyStyles();
  }

  setupIframe(iframeId, appName, locale) {
    const iframe = this.shadowRoot.getElementById(iframeId);

    iframe.srcdoc = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; margin: 0; padding: 10px; background: #eee; overflow: hidden; }
          .container { border: 2px solid #333; padding: 10px; background: white; height: 100%; box-sizing: border-box; }
        </style>
      </head>
      <body data-locale="${locale}">
        <div class="container">
          <div id="app-root"></div>
        </div>
        <script type="module">
          window.addEventListener("message", (e) => {
            if (e.data.type === "locale-changed") {
              document.body.setAttribute("data-locale", e.data.locale);
              const content = document.querySelector("os-inner-component");
              if (content) content.requestUpdate();
            }
          });

          customElements.define("${appName.toLowerCase().replace(/\s/g, '-')}-host", class extends HTMLElement {
            constructor() {
              super();
              this.attachShadow({ mode: "open" });
            }
            connectedCallback() {
              this.render();
            }
            render() {
              this.shadowRoot.innerHTML = \`
                <div class="app-shell">
                  <h3 class="app-title">${appName}</h3>
                  <div class="app-content">
                    <div class="nested-shadow-host">
                      <os-inner-component></os-inner-component>
                    </div>
                  </div>
                </div>
                <style>
                  .app-shell { border: 1px solid #ddd; padding: 5px; height: 100%; box-sizing: border-box; }
                  .app-title { font-size: 14px; margin: 0 0 5px 0; color: #333; }
                  .app-content { border: 1px dashed #ccc; padding: 5px; }
                  .nested-shadow-host { margin-top: 5px; }
                </style>
              \`;
            }
          });

          customElements.define("os-inner-component", class extends HTMLElement {
            constructor() { super(); this.attachShadow({ mode: "open" }); }
            requestUpdate() { this.render(); }
            connectedCallback() { this.render(); }
            render() {
              const locale = document.body.getAttribute("data-locale") || "en";
              const translations = {
                en: "Inner Shadow Content",
                ja: "内部シャドウコンテンツ"
              };
              this.shadowRoot.innerHTML = \`<div class="inner-content">\${translations[locale] || translations.en}</div><style>.inner-content { color: #007bff; font-weight: bold; font-size: 12px; margin-top: 5px; }</style>\`;
            }
          });

          document.getElementById('app-root').appendChild(document.createElement('${appName.toLowerCase().replace(/\s/g, '-')}-host'));
          document.getElementById('app-root').appendChild(document.createElement('${appName.toLowerCase().replace(/\s/g, '-')}-host'));
        </script>
      </body>
      </html>
    `;

    setTimeout(() => {
      iframe.contentWindow?.postMessage({ type: "locale-changed", locale }, "*");
    }, 100);
  }

  applyStyles() {
    mountStyles(this.shadowRoot, `
      .mfe-container {
        border: 1px solid var(--os-border-soft);
        padding: 16px;
        background: var(--os-bg-alt, #fafafa);
      }
      .mfe-label {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--os-text-secondary);
        margin-bottom: 12px;
      }
      .mfe-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
      }
      .mfe-wrapper {
        aspect-ratio: 16/9;
      }
      iframe {
        width: 100%;
        height: 100%;
        border: 1px solid var(--os-border-soft);
        border-radius: 4px;
      }
    `);
  }
});
