import { saveOrder } from "../../services/OrdersService.js";

export async function Orders_SaveOrder({ model }) {
  const res = await saveOrder(model);
  if (!res.ok) throw new Error("Save failed");
  return res;
}
