import { Customers_RefreshCustomers } from "./RefreshCustomers.js";

export async function Customers_SearchCustomers({ screenStore, query }) {
  screenStore.set({ query, page: 1 });
  await Customers_RefreshCustomers({ screenStore });
}
