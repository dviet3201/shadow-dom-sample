export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const rnd = (n = 8) => Math.random().toString(16).slice(2, 2 + n);
export const dynId = (prefix = "os") => `${prefix}_${rnd(6)}_${Date.now().toString(36)}`;

const baseStyles = `
  :host{
    font-family:var(--os-font);
    color:var(--os-text);
    -webkit-font-smoothing:antialiased;
  }
  *, *::before, *::after{box-sizing:border-box;}
  button, input, select, textarea{font:inherit;color:inherit;}
  .osui-btn{
    border:1px solid var(--os-border);
    background:var(--os-surface);
    padding:10px 14px;
    border-radius:999px;
    font-weight:600;
    letter-spacing:.01em;
    transition:transform .15s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
  }
  .osui-btn:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(31,26,22,.12);cursor:pointer;}
  .osui-btn.primary{
    color:#fff;
    border-color:transparent;
    background:linear-gradient(135deg,var(--os-accent),var(--os-accent-2));
    box-shadow:0 10px 20px rgba(255,122,61,.25);
  }
  .osui-btn.ghost{background:transparent;border-color:transparent;color:var(--os-text);}
  .osui-btn[disabled]{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none;}
  .osui-input,.osui-select{
    border:1px solid var(--os-border);
    background:var(--os-surface);
    padding:12px 14px;
    border-radius:var(--os-radius-sm);
    width:100%;
    box-sizing:border-box;
    transition:border-color .2s ease, box-shadow .2s ease;
  }
  .osui-input:focus,.osui-select:focus{outline:none;border-color:var(--os-accent);box-shadow:var(--os-ring);}
  .osui-field{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;}
  .osui-label{font-size:12px;opacity:.75;font-weight:600;letter-spacing:.02em;text-transform:uppercase;}
  .osui-error{color:#b00020;font-size:12px;}
  .osui-invalid .osui-input{border-color:#ff8aa4;background:#fff5f7;}
`;

export function escapeHtml(v) {
  return String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function mountStyles(root, cssText) {
  if (!root.__osuiBase) {
    const base = document.createElement("style");
    base.textContent = baseStyles;
    root.appendChild(base);
    root.__osuiBase = true;
  }
  const s = document.createElement("style");
  s.textContent = cssText;
  root.appendChild(s);
}

export function parseJsonAttr(el, attr, fallback) {
  const raw = el.getAttribute(attr);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}
