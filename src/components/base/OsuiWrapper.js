import { dynId, mountStyles } from "../../runtime/utils.js";
import { attachShadowMaybeClosed } from "./ShadowUtils.js";

customElements.define("osui-wrapper", class extends HTMLElement {
  constructor(){
    super();
    // intermediate wrapper sometimes closed in real apps (simulate hard mode)
    this._root = attachShadowMaybeClosed(this, "open");
  }
  connectedCallback(){
    const widget = this.getAttribute("data-os-widget") || "Widget";
    this._root.innerHTML = `<div class="osui-wrap" data-os-widget="${widget}" data-dynid="${dynId("osui")}"><slot></slot></div>`;
    mountStyles(this._root, `.osui-wrap{box-sizing:border-box;}`);
  }
});
