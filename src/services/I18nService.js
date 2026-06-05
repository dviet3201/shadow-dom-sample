import { appStore } from "../runtime/store.js";

const TRANSLATIONS = {
  en: {
    "settings": "Settings",
    "preferences": "Preferences",
    "save": "Save",
    "saving": "Saving...",
    "language": "Language",
    "theme": "Theme",
    "items_per_page": "Items Per Page",
    "notifications": "Notifications",
    "weekly_digest": "Weekly Digest",
    "beta_features": "Beta Features",
    "deep_label": "Deeply Nested Label",
    "iframe_title": "Iframe Content Title",
    "iframe_body": "This content is inside an iframe shadow host."
  },
  ja: {
    "settings": "設定",
    "preferences": "基本設定",
    "save": "保存",
    "saving": "保存中...",
    "language": "言語",
    "theme": "テーマ",
    "items_per_page": "1ページあたりの項目数",
    "notifications": "通知",
    "weekly_digest": "週次ダイジェスト",
    "beta_features": "ベータ機能",
    "deep_label": "深くネストされたラベル",
    "iframe_title": "iframeコンテンツタイトル",
    "iframe_body": "このコンテンツはiframeシャドウホスト内にあります。"
  }
};

export function t(key) {
  const locale = appStore.get().locale || "en";
  const dict = TRANSLATIONS[locale] || TRANSLATIONS.en;
  return dict[key] || key;
}
