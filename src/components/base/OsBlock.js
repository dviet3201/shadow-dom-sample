import { dynId, mountStyles } from "../../runtime/utils.js";
import { attachShadowMaybeClosed } from "./ShadowUtils.js";

customElements.define("os-block", class extends HTMLElement {
  constructor(){
    super();
    // blocks are often structural wrappers; make them closed to increase nesting difficulty
    this._root = attachShadowMaybeClosed(this, "open");
  }
  connectedCallback(){
    const name = this.getAttribute("data-os-block") || "Block";
    this._root.innerHTML = `<div class="blk" data-os-block="${name}" data-dynid="${dynId("blk")}"><slot></slot></div>`;
    mountStyles(this._root, `.blk{display:block;}`);
  }
});
