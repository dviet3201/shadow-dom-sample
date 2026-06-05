import { dynId, mountStyles } from "../runtime/utils.js";
import { attachShadowMaybeClosed } from "../components/base/ShadowUtils.js";

customElements.define("os-app-shell", class extends HTMLElement {
  constructor(){
    super();
    // All shadow roots are now open
    this._root = attachShadowMaybeClosed(this, "open");
  }
  connectedCallback(){
    this._root.innerHTML = `
      <div class="shell" data-os-widget="AppShell" data-dynid="${dynId("shell")}">
        <os-layout data-test-id="layout"></os-layout>
      </div>
    `;
    mountStyles(this._root, `
      .shell{
        font-family:var(--os-font);
        color:var(--os-text);
        background:var(--os-bg-grad);
        min-height:100vh;
      }
    `);
  }
});
