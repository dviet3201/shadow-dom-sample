import { sleep } from "../runtime/utils.js";

// "Server Actions" / REST (mock)
const BASE = [
  {id:"C-100", name:"Ada Lovelace", tier:"Gold", email:"ada@example.com", created:"2025-07-01"},
  {id:"C-101", name:"Alan Turing", tier:"Silver", email:"alan@example.com", created:"2025-07-10"},
  {id:"C-102", name:"Grace Hopper", tier:"Gold", email:"grace@example.com", created:"2025-08-02"},
  {id:"C-103", name:"Donald Knuth", tier:"Bronze", email:"knuth@example.com", created:"2025-08-16"},
  {id:"C-104", name:"Barbara Liskov", tier:"Gold", email:"liskov@example.com", created:"2025-09-03"},
  {id:"C-105", name:"Edsger Dijkstra", tier:"Silver", email:"edsger@example.com", created:"2025-09-09"},
  {id:"C-106", name:"Margaret Hamilton", tier:"Gold", email:"margaret@example.com", created:"2025-10-01"},
  {id:"C-107", name:"Linus Torvalds", tier:"Bronze", email:"linus@example.com", created:"2025-10-12"},
  {id:"C-108", name:"Ken Thompson", tier:"Silver", email:"ken@example.com", created:"2025-11-02"},
  {id:"C-109", name:"Dennis Ritchie", tier:"Gold", email:"dennis@example.com", created:"2025-11-18"}
];

export async function listCustomers({ query }) {
  await sleep(350 + Math.floor(Math.random()*700));
  const q = (query || "").trim().toLowerCase();
  const rows = q ? BASE.filter(r => (r.id+r.name+r.email).toLowerCase().includes(q)) : BASE;
  return structuredClone(rows);
}

export async function getCustomerById(id) {
  await sleep(250 + Math.floor(Math.random()*450));
  return structuredClone(BASE.find(r => r.id === id) || null);
}

export async function saveCustomer(model) {
  await sleep(450 + Math.floor(Math.random()*650));
  // no persistence; return success
  return { ok: true, id: model.id || `C-${Math.floor(200 + Math.random()*900)}` };
}
