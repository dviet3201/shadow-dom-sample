import { getOrderById } from "../services/OrdersService.js";

// Aggregate (mock) - returns a single order
export async function GetOrderDetailsAggregate({ id }) {
  const row = await getOrderById(id);
  return { Row: row };
}
