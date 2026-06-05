import { listCustomers } from "../services/CustomersService.js";

// Aggregate (mock) - returns record list
export async function GetCustomersAggregate({ query }) {
  const rows = await listCustomers({ query });
  return { Rows: rows, Count: rows.length };
}
