import { sleep } from "../../runtime/utils.js";

// "Prepare for Navigation" pattern
export async function PrepareForNavigation({ to }) {
  await sleep(120 + Math.floor(Math.random() * 180));
  return { ok: true, to };
}
