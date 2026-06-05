import { saveSettings } from "../../services/SettingsService.js";
import { appStore } from "../../runtime/store.js";

export async function Settings_SaveSettings({ screenStore, settings }) {
  screenStore.set({ isSaving: true });
  const res = await saveSettings(settings);
  screenStore.set({ isSaving: false });
  if (!res.ok) throw new Error("Save failed");

  appStore.set({ locale: settings.language });

  return res;
}
