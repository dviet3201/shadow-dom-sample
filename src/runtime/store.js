import { Bus } from "./bus.js";
import { createStore } from "./reactive.js";

export const bus = new Bus();

// App-level state (OutSystems: Session Variables / Client Variables)
const savedShadowMode = localStorage.getItem("os_shadow_mode") || "open";

export const appStore = createStore({
  route: { name: "customers", params: {} },
  isNavigating: false,
  shadowMode: savedShadowMode,
  locale: "en"
});

export function setRoute(route) {
  appStore.set({ route });
  bus.emit("Route.Changed", route);
}
