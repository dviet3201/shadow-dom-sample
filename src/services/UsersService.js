import { sleep } from "../runtime/utils.js";

let CURRENT_USER = {
  id: "U-001",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "Admin",
  lastLogin: "2025-11-30"
};

export async function getCurrentUser() {
  await sleep(220 + Math.floor(Math.random() * 280));
  return structuredClone(CURRENT_USER);
}

export async function saveUser(model) {
  await sleep(320 + Math.floor(Math.random() * 380));
  CURRENT_USER = { ...CURRENT_USER, ...model };
  return { ok: true, id: CURRENT_USER.id };
}
