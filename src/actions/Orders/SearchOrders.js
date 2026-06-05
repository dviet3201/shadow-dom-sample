import { Orders_RefreshOrders } from "./RefreshOrders.js";

export async function Orders_SearchOrders({ screenStore, query }) {
  screenStore.set({ query, page: 1 });
  await Orders_RefreshOrders({ screenStore });
}
