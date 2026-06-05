import { getCurrentUser } from "../services/UsersService.js";

// Aggregate (mock) - returns current user
export async function GetCurrentUserAggregate() {
  const row = await getCurrentUser();
  return { Row: row };
}
