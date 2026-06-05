import { getSettings } from "../../services/SettingsService.js";

export async function Settings_LoadSettings({ screenStore }) {
  screenStore.set({ isLoading: true });
  const settings = await getSettings();
  screenStore.set({ isLoading: false, settings });
}
