import { sleep } from "../runtime/utils.js";

let SETTINGS = {
  theme: "Light",
  language: "en",
  itemsPerPage: 10,
  notifications: true,
  weeklyDigest: false,
  betaFeatures: false
};

export async function getSettings() {
  await sleep(240 + Math.floor(Math.random() * 300));
  return structuredClone(SETTINGS);
}

export async function saveSettings(next) {
  await sleep(320 + Math.floor(Math.random() * 360));
  SETTINGS = { ...SETTINGS, ...next };
  return { ok: true };
}
