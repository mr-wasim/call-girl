// pages/admin/settings.js
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar"; // keep your Sidebar
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
};

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULTS);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchSettings();
    // cleanup BroadcastChannel if used here (none created permanently)
  }, []);

  useEffect(() => {
    // apply to document for live preview in admin
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

  // helper to broadcast saved settings to other tabs/windows
  function broadcastTheme(themeObj) {
    try {
      // BroadcastChannel for modern browsers
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("site-theme");
        bc.postMessage(themeObj);
        bc.close();
      }
    } catch (e) {
      console.warn("BroadcastChannel failed", e);
    }

    try {
      // localStorage trick: writes cause 'storage' events in other tabs.
      if (typeof window !== "undefined") {
        localStorage.setItem("site_theme_updated_at", Date.now().toString());
        localStorage.setItem("site_theme_payload", JSON.stringify(themeObj));
      }
    } catch (e) {
      console.warn("localStorage broadcast failed", e);
    }

    try {
      // dispatch custom event in current tab (so current tab also responds uniformly)
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("site-theme-updated", { detail: themeObj }));
      }
    } catch (e) {
      // ignore
    }
  }

  async function saveSettings() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const j = await res.json();
      if (j.ok) {
        const s = j.settings._doc ? j.settings._doc : j.settings;
        const normalized = { ...DEFAULTS, ...s };
        setOriginal(normalized);
        setSettings(normalized);

        // Apply immediately in admin
        applyToDocument(normalized);

        // Broadcast to other tabs/windows so whole site updates instantly
        broadcastTheme(normalized);

        setMsg("Saved. Theme is now active for the site.");
      } else {
        setMsg("Save failed: " + (j.message || "unknown"));
      }
    } catch (err) {
      console.error("saveSettings error", err);
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

        // broadcast reset so other open tabs revert as well
        broadcastTheme(normalized);

        setMsg("Reset to defaults. Theme is now original site look.");
      } else {
        setMsg("Reset failed: " + (j.message || "unknown"));
      }
    } catch (err) {
      console.error("resetDefaults error", err);
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

  return (
    <>
      <Head><title>Admin Settings</title></Head>
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Site Settings</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-3">Theme Editor</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Color */}
                <div>
                  <label className="block text-sm font-medium mb-1">Primary Color</label>
                  <input type="color" value={settings.primaryColor} onChange={(e)=>updateField('primaryColor', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.primaryColor} onChange={(e)=>updateField('primaryColor', e.target.value)} />
                </div>

                {/* Accent */}
                <div>
                  <label className="block text-sm font-medium mb-1">Accent Color</label>
                  <input type="color" value={settings.accentColor} onChange={(e)=>updateField('accentColor', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.accentColor} onChange={(e)=>updateField('accentColor', e.target.value)} />
                </div>

                {/* Header bg */}
                <div>
                  <label className="block text-sm font-medium mb-1">Header Background</label>
                  <input type="color" value={settings.headerBg} onChange={(e)=>updateField('headerBg', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.headerBg} onChange={(e)=>updateField('headerBg', e.target.value)} />
                </div>

                {/* Header text */}
                <div>
                  <label className="block text-sm font-medium mb-1">Header Text Color</label>
                  <input type="color" value={settings.headerText} onChange={(e)=>updateField('headerText', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.headerText} onChange={(e)=>updateField('headerText', e.target.value)} />
                </div>

                {/* Site text color */}
                <div>
                  <label className="block text-sm font-medium mb-1">Site Text Color</label>
                  <input type="color" value={settings.textColor} onChange={(e)=>updateField('textColor', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.textColor} onChange={(e)=>updateField('textColor', e.target.value)} />
                </div>

                {/* Body background */}
                <div>
                  <label className="block text-sm font-medium mb-1">Body Background</label>
                  <input type="color" value={settings.bodyBg} onChange={(e)=>updateField('bodyBg', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.bodyBg} onChange={(e)=>updateField('bodyBg', e.target.value)} />
                </div>

                {/* Footer bg */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Footer Background</label>
                  <input type="color" value={settings.footerBg} onChange={(e)=>updateField('footerBg', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.footerBg} onChange={(e)=>updateField('footerBg', e.target.value)} />
                </div>

                {/* Footer text */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Footer Text Color</label>
                  <input type="color" value={settings.footerText} onChange={(e)=>updateField('footerText', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.footerText} onChange={(e)=>updateField('footerText', e.target.value)} />
                </div>

                {/* Font & border radius */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Font Family</label>
                  <input className="w-full border rounded px-3 py-2" value={settings.fontFamily} onChange={(e)=>updateField('fontFamily', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Border Radius (CSS)</label>
                  <input className="w-full border rounded px-3 py-2" value={settings.borderRadius} onChange={(e)=>updateField('borderRadius', e.target.value)} />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button onClick={saveSettings} disabled={saving} className="px-4 py-2 rounded-lg shadow-sm bg-blue-600 text-white">
                  {saving ? "Saving..." : "Save"}
                </button>

                <button onClick={revert} className="px-4 py-2 rounded-lg border">Revert</button>

                <button onClick={resetDefaults} className="px-4 py-2 rounded-lg border text-red-600">Reset to Defaults</button>

                <div className="ml-auto text-sm text-gray-500">{msg}</div>
              </div>
            </section>

            <aside className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-medium mb-3">Live Preview (Admin only)</h2>

              <div className="border rounded-lg overflow-hidden" style={{ borderRadius: settings.borderRadius }}>
                <div style={{ padding: "12px 16px", background: settings.headerBg, color: settings.headerText, fontFamily: settings.fontFamily }}>
                  <strong>MySite</strong> — header
                </div>

                <div style={{ background: settings.bodyBg, color: settings.textColor, padding: 16, fontFamily: settings.fontFamily }}>
                  <h3 style={{ color: settings.primaryColor }}>Title / Primary color</h3>
                  <p>This is a live preview of the website theme. Buttons, accent color, and text reflect your settings.</p>

                  <div className="mt-4" style={{ display: "flex", gap: 8 }}>
                    <button style={{ background: settings.primaryColor, color: "#fff", padding: "8px 12px", borderRadius: settings.borderRadius, border: "none" }}>Primary</button>
                    <button style={{ background: settings.accentColor, color: "#000", padding: "8px 12px", borderRadius: settings.borderRadius, border: "none" }}>Accent</button>
                    <button style={{ background: "transparent", color: settings.textColor, padding: "8px 12px", borderRadius: settings.borderRadius, border: `1px solid ${settings.primaryColor}` }}>Ghost</button>
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
