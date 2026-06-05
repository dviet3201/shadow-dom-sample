import { appStore } from "../../runtime/store.js";

export function attachShadowMaybeClosed(el, mode) {
  // The mode passed is a default, but the global shadowMode takes precedence
  const globalMode = appStore.get().shadowMode;
  return el.attachShadow({ mode: globalMode });
}
