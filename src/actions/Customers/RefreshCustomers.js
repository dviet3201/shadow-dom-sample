import { GetCustomersAggregate } from "../../aggregates/GetCustomers.js";

export async function Customers_RefreshCustomers({ screenStore }) {
  screenStore.set({ isRefreshing: true });
  const { query } = screenStore.get();
  const res = await GetCustomersAggregate({ query });
  screenStore.set({ rows: res.Rows, total: res.Count, isLoading: false, isRefreshing: false });
}
