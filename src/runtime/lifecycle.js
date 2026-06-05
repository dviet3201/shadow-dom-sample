import { sleep } from "./utils.js";
import { bus } from "./store.js";

export async function runScreenLifecycle(screenId) {
  bus.emit("Screen.OnInitialize", { screenId });
  await sleep(20);
  bus.emit("Screen.OnReady", { screenId });
  await sleep(20);
  bus.emit("Screen.AfterFetch", { screenId });
}
