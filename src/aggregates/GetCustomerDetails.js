import { getCustomerById } from "../services/CustomersService.js";

// Aggregate (mock) - returns a single record
export async function GetCustomerDetailsAggregate({ id }) {
  const row = await getCustomerById(id);
  return { Row: row };
}
