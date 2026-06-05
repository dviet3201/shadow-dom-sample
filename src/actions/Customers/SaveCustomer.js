import { saveCustomer } from "../../services/CustomersService.js";

export async function Customers_SaveCustomer({ model }) {
  const res = await saveCustomer(model);
  if (!res.ok) throw new Error("Save failed");
  return res;
}
