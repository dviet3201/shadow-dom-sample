import { appStore } from "../runtime/store.js";
import "../components/widgets/OsComplexShadowScreen.js";

customElements.define("os-router", class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:"open"}); }
  connectedCallback(){
    this.unsub = appStore.subscribe(() => this.render());
    this.render();
  }
  disconnectedCallback(){ this.unsub?.(); }

  render(){
    const { route } = appStore.get();
    const { name, params } = route;

    this.shadowRoot.innerHTML = `
      ${name === "customers" ? `<os-screen-customers data-test-id="screen-customers"></os-screen-customers>` : ""}
      ${name === "customerDetails" ? `<os-screen-customer-details data-test-id="screen-customer-details" customer-id="${params.id || ""}"></os-screen-customer-details>` : ""}
      ${name === "orders" ? `<os-screen-orders data-test-id="screen-orders"></os-screen-orders>` : ""}
      ${name === "settings" ? `<os-screen-settings data-test-id="screen-settings"></os-screen-settings>` : ""}
      ${name === "complexShadow" ? `<os-complex-shadow-screen data-test-id="screen-complex-shadow"></os-complex-shadow-screen>` : ""}
    `;
  }
});

