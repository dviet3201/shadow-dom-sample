import { runScreenLifecycle } from "../../runtime/lifecycle.js";

export async function Customers_OnInitialize({ screenId }) {
  // hook if needed; in real OS this is a client action
  await runScreenLifecycle(screenId);
}
