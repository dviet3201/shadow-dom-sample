import { sleep } from "../runtime/utils.js";

let ORDERS = [
  { id: "O-9001", customer: "Ada Lovelace", status: "Pending", total: 1280.5, created: "2025-09-03" },
  { id: "O-9002", customer: "Alan Turing", status: "Processing", total: 640.0, created: "2025-09-05" },
  { id: "O-9003", customer: "Grace Hopper", status: "Shipped", total: 320.75, created: "2025-09-09" },
  { id: "O-9004", customer: "Donald Knuth", status: "Delivered", total: 2200.0, created: "2025-09-12" },
  { id: "O-9005", customer: "Barbara Liskov", status: "Cancelled", total: 150.0, created: "2025-09-16" },
  { id: "O-9006", customer: "Edsger Dijkstra", status: "Pending", total: 980.25, created: "2025-09-21" },
  { id: "O-9007", customer: "Margaret Hamilton", status: "Processing", total: 430.0, created: "2025-09-26" },
  { id: "O-9008", customer: "Linus Torvalds", status: "Delivered", total: 760.0, created: "2025-10-02" },
  { id: "O-9009", customer: "Ken Thompson", status: "Shipped", total: 510.0, created: "2025-10-06" },
  { id: "O-9010", customer: "Dennis Ritchie", status: "Pending", total: 1180.4, created: "2025-10-10" }
];

export async function listOrders({ query }) {
  await sleep(320 + Math.floor(Math.random() * 600));
  const q = (query || "").trim().toLowerCase();
  const rows = q
    ? ORDERS.filter(r => `${r.id} ${r.customer} ${r.status}`.toLowerCase().includes(q))
    : ORDERS;
  return structuredClone(rows);
}

export async function getOrderById(id) {
  await sleep(240 + Math.floor(Math.random() * 420));
  return structuredClone(ORDERS.find(r => r.id === id) || null);
}

export async function saveOrder(model) {
  await sleep(420 + Math.floor(Math.random() * 520));
  if (model.id) {
    ORDERS = ORDERS.map(r => (r.id === model.id ? { ...r, ...model } : r));
    return { ok: true, id: model.id };
  }
  const id = `O-${Math.floor(9100 + Math.random() * 800)}`;
  ORDERS = [{ ...model, id }, ...ORDERS];
  return { ok: true, id };
}
