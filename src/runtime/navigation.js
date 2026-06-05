import { bus, appStore, setRoute } from "./store.js";
import { sleep } from "./utils.js";

// Hash router (OutSystems-like URL segments), with Prepare-for-Navigation hook
// Routes: #/customers, #/customers/<id>, #/orders, #/settings
export async function navigateTo(route) {
  appStore.set({ isNavigating: true });
  bus.emit("Navigation.Before", { to: route });

  // Prepare-for-Navigation (simulate async client action)
  await sleep(120 + Math.floor(Math.random() * 180));
  bus.emit("Navigation.Prepared", { to: route });

  setRoute(route);
  bus.emit("Navigation.After", { to: route });
  appStore.set({ isNavigating: false });
}

export function parseHash() {
  const h = (location.hash || "#/customers").replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);
  const [first, second] = parts;

  if (!first) return { name: "customers", params: {} };

  if (first === "customers" && second) return { name: "customerDetails", params: { id: decodeURIComponent(second) } };
  if (first === "customers") return { name: "customers", params: {} };
  if (first === "orders") return { name: "orders", params: {} };
  if (first === "settings") return { name: "settings", params: {} };

  return { name: "customers", params: {} };
}

export function syncRouteFromHash() {
  const route = parseHash();
  // no prepare hook on initial load; but still emit
  setRoute(route);
}
