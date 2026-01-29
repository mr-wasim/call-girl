// pages/admin/settings.js
import { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";

const DEFAULTS = {
  primaryColor: "#111827",
  textColor: "#f3f4f6",
  headerBg: "#000000",
  headerText: "#ffffff",
  accentColor: "#f3bc1b",
  bodyBg: "#333333",
  footerBg: "#1f1f1f",
  footerText: "#d1d5db",
  fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
  borderRadius: "0.375rem",
  logoPath: "/logo.png",
};

/* ---------- color helpers (unchanged) ---------- */
function hexToRgb(hex) {
  if (!hex) return [0, 0, 0];
  const h = hex.replace("#", "").trim();
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}
function luminance([r, g, b]) {
  const srgb = [r, g, b].map((v) => v / 255);
  const lin = srgb.map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function readableTextColor(hex) {
  try {
    const rgb = hexToRgb(hex);
    const lum = luminance(rgb);
    return lum > 0.5 ? "#000000" : "#ffffff";
  } catch {
    return "#000000";
  }
}
function ensureContrast(fg, bg) {
  if (!fg || !bg) return fg || readableTextColor(bg || "#fff");
  const fgNorm = (fg + "").trim().toLowerCase();
  const bgNorm = (bg + "").trim().toLowerCase();
  if (fgNorm === bgNorm) return readableTextColor(bg);
  return fg;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    applyToDocument(settings);
  }, [settings]);

  async function fetchSettings() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const j = await res.json();
      if (j?.ok && j.settings) {
        const s = j.settings._doc ? j.settings._doc : j.settings;
        const normalized = { ...DEFAULTS, ...s };
        setSettings(normalized);
        setOriginal(normalized);
      } else {
        setSettings(DEFAULTS);
        setOriginal(DEFAULTS);
      }
    } catch (e) {
      console.error("fetchSettings error", e);
      setSettings(DEFAULTS);
      setOriginal(DEFAULTS);
    } finally {
      setLoading(false);
    }
  }

  function applyToDocument(s) {
    if (!s || typeof document === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", s.primaryColor);
    root.style.setProperty("--text-color", s.textColor);
    root.style.setProperty("--header-bg", s.headerBg);
    root.style.setProperty("--header-text", s.headerText);
    root.style.setProperty("--accent-color", s.accentColor);
    root.style.setProperty("--body-bg", s.bodyBg);
    root.style.setProperty("--footer-bg", s.footerBg);
    root.style.setProperty("--footer-text", s.footerText);
    root.style.setProperty("--border-radius", s.borderRadius);
    root.style.setProperty("--font-family", s.fontFamily);
  }

  function updateField(key, value) {
    setSettings((p) => ({ ...p, [key]: value }));
  }

  async function handleUploadFile(file) {
    if (!file) return null;
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-logo", {
        method: "POST",
        body: fd,
      });
      const j = await res.json();
      if (j.ok && j.path) {
        updateField("logoPath", j.path);
        return j.path;
      } else {
        throw new Error(j.message || "Upload failed");
      }
    } catch (err) {
      console.error("upload failed", err);
      alert("Upload failed: " + (err.message || err));
      return null;
    }
  }

  async function onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    updateField("logoPath", objectUrl);
    const uploadedPath = await handleUploadFile(file);
    if (uploadedPath) {
      updateField("logoPath", uploadedPath);
      setMsg("Logo uploaded (saved after you click Save).");
      setTimeout(() => setMsg(""), 3000);
    } else {
      const orig = original?.logoPath || DEFAULTS.logoPath;
      updateField("logoPath", orig);
    }
    if (fileRef.current) fileRef.current.value = "";
  }

  function onLogoUrlChange(e) {
    updateField("logoPath", e.target.value);
  }

  function resetLogoToDefault() {
    const def = DEFAULTS.logoPath;
    updateField("logoPath", def);
    setMsg("Logo reset locally. Click Save to make it permanent.");
    setTimeout(() => setMsg(""), 3000);
  }

  function broadcastTheme(themeObj) {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("site-theme");
        bc.postMessage(themeObj);
        bc.close();
      }
    } catch (e) {}

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("site_theme_updated_at", Date.now().toString());
        localStorage.setItem("site_theme_payload", JSON.stringify(themeObj));
      }
    } catch (e) {}

    try {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-theme-updated", { detail: themeObj }));
      }
    } catch (e) {}
  }

  async function saveSettings() {
    setSaving(true);
    setMsg("");
    try {
      const payload = { ...settings };
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await res.json();
      if (j.ok) {
        const s = j.settings._doc ? j.settings._doc : j.settings;
        const normalized = { ...DEFAULTS, ...s };
        setOriginal(normalized);
        setSettings(normalized);
        applyToDocument(normalized);
        broadcastTheme(normalized);
        setMsg("Saved. Theme and logo are now active for the site.");
      } else {
        setMsg("Save failed: " + (j.message || "unknown"));
      }
    } catch (err) {
      console.error("save error", err);
      setMsg("Save failed: " + (err.message || err));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 4000);
    }
  }

  async function resetDefaults() {
    if (!confirm("Reset to site defaults?")) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings?action=reset", { method: "POST" });
      const j = await res.json();
      if (j.ok) {
        const s = j.settings._doc ? j.settings._doc : j.settings;
        const normalized = { ...DEFAULTS, ...s };
        setSettings(normalized);
        setOriginal(normalized);
        applyToDocument(normalized);
        broadcastTheme(normalized);
        setMsg("Reset to defaults. Theme and logo reset to original.");
      } else {
        setMsg("Reset failed: " + (j.message || "unknown"));
      }
    } catch (err) {
      console.error("reset error", err);
      setMsg("Reset failed: " + (err.message || err));
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 4000);
    }
  }

  function revert() {
    if (original) setSettings(original);
  }

  if (loading) return <div className="p-6">Loading settings...</div>;

  /* ---------- derive contrast-aware values for preview ---------- */
  const headerBg = settings.headerBg || DEFAULTS.headerBg;
  const headerText =
    settings.headerText && settings.headerText.trim()
      ? ensureContrast(settings.headerText, headerBg)
      : readableTextColor(headerBg);

  const bodyBg = settings.bodyBg || DEFAULTS.bodyBg;
  const bodyText =
    settings.textColor && settings.textColor.trim()
      ? ensureContrast(settings.textColor, bodyBg)
      : readableTextColor(bodyBg);

  const primaryBg = settings.primaryColor || DEFAULTS.primaryColor;
  const primaryText = readableTextColor(primaryBg);

  const accentBg = settings.accentColor || DEFAULTS.accentColor;
  const accentText = readableTextColor(accentBg);

  /* inputs on white left panel should show dark text */
  const leftInputClass =
    "w-full border rounded px-3 py-2 text-black bg-white placeholder-gray-500";

  return (
    <>
      <Head>
        <title>Admin Settings</title>
      </Head>

      <div className="min-h-screen flex">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <h1 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-white">
            Site Settings
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 shadow-sm">
              {/* title explicit dark color on white bg */}
              <h2 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">
                Theme & Logo Editor
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.primaryColor}
                      onChange={(e) => updateField("primaryColor", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Header Background
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.headerBg}
                      onChange={(e) => updateField("headerBg", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.headerBg}
                      onChange={(e) => updateField("headerBg", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Header Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.headerText}
                      onChange={(e) => updateField("headerText", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.headerText}
                      onChange={(e) => updateField("headerText", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Site Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.textColor}
                      onChange={(e) => updateField("textColor", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.textColor}
                      onChange={(e) => updateField("textColor", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Body Background
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.bodyBg}
                      onChange={(e) => updateField("bodyBg", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.bodyBg}
                      onChange={(e) => updateField("bodyBg", e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Footer Background
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.footerBg}
                      onChange={(e) => updateField("footerBg", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.footerBg}
                      onChange={(e) => updateField("footerBg", e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Footer Text Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.footerText}
                      onChange={(e) => updateField("footerText", e.target.value)}
                      className="w-12 h-10 p-1 rounded-md"
                    />
                    <input
                      className={leftInputClass}
                      value={settings.footerText}
                      onChange={(e) => updateField("footerText", e.target.value)}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Font Family
                  </label>
                  <input
                    className={leftInputClass}
                    value={settings.fontFamily}
                    onChange={(e) => updateField("fontFamily", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Border Radius (CSS)
                  </label>
                  <input
                    className={leftInputClass}
                    value={settings.borderRadius}
                    onChange={(e) => updateField("borderRadius", e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-md font-medium mb-2 text-zinc-900 dark:text-white">Logo</h3>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div
                    style={{
                      width: 140,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff",
                      borderRadius: 8,
                      overflow: "hidden",
                      border: "1px solid #eee",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={settings.logoPath || "/logo.png"}
                      alt="logo preview"
                      style={{ maxHeight: 52, maxWidth: "100%" }}
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="text-sm"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Upload a logo (PNG, JPG, SVG). Saved to <code>/public/uploads</code>{" "}
                      (local/dev).
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                    Or paste an image URL
                  </label>
                  <input
                    className={leftInputClass}
                    value={settings.logoPath || ""}
                    onChange={onLogoUrlChange}
                    placeholder="https://cdn.example.com/logo.png or /uploads/xxx.png"
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      updateField("logoPath", settings.logoPath);
                      setMsg("Preview set. Click Save to persist.");
                      setTimeout(() => setMsg(""), 3000);
                    }}
                    className="px-3 py-2 border rounded"
                  >
                    Preview
                  </button>
                  <button onClick={resetLogoToDefault} className="px-3 py-2 border rounded">
                    Reset logo to default
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3 items-center">
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="px-4 py-2 rounded-lg shadow-sm bg-blue-600 text-white"
                >
                  {saving ? "Saving..." : "Save"}
                </button>

                <button onClick={revert} className="px-4 py-2 rounded-lg border text-zinc-900 dark:text-white">
                  Revert
                </button>

                <button onClick={resetDefaults} className="px-4 py-2 rounded-lg border text-red-600">
                  Reset to Defaults
                </button>

                <div className="ml-auto text-sm text-gray-500">{msg}</div>
              </div>
            </section>

            <aside className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-3 text-zinc-900 dark:text-white">Live Preview (Admin only)</h2>

              <div className="border rounded-lg overflow-hidden" style={{ borderRadius: settings.borderRadius }}>
                <div
                  style={{
                    padding: "12px 16px",
                    background: headerBg,
                    color: headerText,
                    fontFamily: settings.fontFamily,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <img src={settings.logoPath || "/logo.png"} alt="logo" style={{ height: 28, objectFit: "contain" }} />
                  <strong style={{ color: headerText }}>MySite</strong> — header
                </div>

                <div style={{ background: bodyBg, color: bodyText, padding: 16, fontFamily: settings.fontFamily }}>
                  <h3 style={{ color: settings.primaryColor }}>Title / Primary color</h3>
                  <p>
                    This is a live preview of the website theme. Buttons, accent color, and text reflect your settings.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      style={{
                        background: primaryBg,
                        color: primaryText,
                        padding: "8px 12px",
                        borderRadius: settings.borderRadius,
                        border: "none",
                      }}
                    >
                      Primary
                    </button>

                    <button
                      style={{
                        background: accentBg,
                        color: accentText,
                        padding: "8px 12px",
                        borderRadius: settings.borderRadius,
                        border: "none",
                      }}
                    >
                      Accent
                    </button>

                    <button
                      style={{
                        background: "transparent",
                        color: bodyText,
                        padding: "8px 12px",
                        borderRadius: settings.borderRadius,
                        border: `1px solid ${settings.primaryColor}`,
                      }}
                    >
                      Ghost
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">Tip: Changes update live in this preview. Click Save to make them persistent for the site.</div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
