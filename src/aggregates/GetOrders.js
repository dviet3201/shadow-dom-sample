import { listOrders } from "../services/OrdersService.js";

// Aggregate (mock) - returns order list
export async function GetOrdersAggregate({ query }) {
  const rows = await listOrders({ query });
  return { Rows: rows, Count: rows.length };
}
