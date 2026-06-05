import { GetOrdersAggregate } from "../../aggregates/GetOrders.js";

export async function Orders_RefreshOrders({ screenStore }) {
  screenStore.set({ isRefreshing: true });
  const { query } = screenStore.get();
  const res = await GetOrdersAggregate({ query });
  screenStore.set({ rows: res.Rows, total: res.Count, isLoading: false, isRefreshing: false });
}
