// pages/admin/settings.js
import { useEffect, useState, useRef } from "react";
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
  logoPath: "/logo.png",
};

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

  // file upload handler
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
        // set the logoPath to returned public path
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

  // onChange file input
  async function onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // preview locally: create object url (optional)
    const objectUrl = URL.createObjectURL(file);
    updateField("logoPath", objectUrl); // show preview immediately
    // upload file to server
    const uploadedPath = await handleUploadFile(file);
    if (uploadedPath) {
      updateField("logoPath", uploadedPath);
      setMsg("Logo uploaded (saved after you click Save).");
      setTimeout(()=>setMsg(""), 3000);
    } else {
      // if upload failed, revert preview
      const orig = original?.logoPath || DEFAULTS.logoPath;
      updateField("logoPath", orig);
    }
    // clear file input
    if (fileRef.current) fileRef.current.value = "";
  }

  // allow entering URL
  function onLogoUrlChange(e) {
    updateField("logoPath", e.target.value);
  }

  // remove / reset logo to default
  function resetLogoToDefault() {
    const def = DEFAULTS.logoPath;
    updateField("logoPath", def);
    setMsg("Logo reset locally. Click Save to make it permanent.");
    setTimeout(()=>setMsg(""), 3000);
  }

  // broadcast helper: same as before
  function broadcastTheme(themeObj) {
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("site-theme");
        bc.postMessage(themeObj);
        bc.close();
      }
    } catch (e) { /* ignore */ }

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

        // apply now
        applyToDocument(normalized);

        // broadcast to other tabs
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
      setTimeout(()=>setMsg(""), 4000);
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
      setTimeout(()=>setMsg(""), 4000);
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
              <h2 className="text-lg font-medium mb-3">Theme & Logo Editor</h2>

              {/* theme inputs (same as before) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1 ">Primary Color</label>
                  <input type="color" value={settings.primaryColor} onChange={(e)=>updateField('primaryColor', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.primaryColor} onChange={(e)=>updateField('primaryColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Accent Color</label>
                  <input type="color" value={settings.accentColor} onChange={(e)=>updateField('accentColor', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.accentColor} onChange={(e)=>updateField('accentColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Header Background</label>
                  <input type="color" value={settings.headerBg} onChange={(e)=>updateField('headerBg', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.headerBg} onChange={(e)=>updateField('headerBg', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Header Text Color</label>
                  <input type="color" value={settings.headerText} onChange={(e)=>updateField('headerText', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.headerText} onChange={(e)=>updateField('headerText', e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Site Text Color</label>
                  <input type="color" value={settings.textColor} onChange={(e)=>updateField('textColor', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.textColor} onChange={(e)=>updateField('textColor', e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Body Background</label>
                  <input type="color" value={settings.bodyBg} onChange={(e)=>updateField('bodyBg', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.bodyBg} onChange={(e)=>updateField('bodyBg', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Footer Background</label>
                  <input type="color" value={settings.footerBg} onChange={(e)=>updateField('footerBg', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.footerBg} onChange={(e)=>updateField('footerBg', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Footer Text Color</label>
                  <input type="color" value={settings.footerText} onChange={(e)=>updateField('footerText', e.target.value)} className="w-14 h-10 p-1 rounded-md" />
                  <input className="ml-3 border rounded px-2 py-1" value={settings.footerText} onChange={(e)=>updateField('footerText', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Font Family</label>
                  <input className="w-full border rounded px-3 py-2" value={settings.fontFamily} onChange={(e)=>updateField('fontFamily', e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Border Radius (CSS)</label>
                  <input className="w-full border rounded px-3 py-2" value={settings.borderRadius} onChange={(e)=>updateField('borderRadius', e.target.value)} />
                </div>
              </div>

              {/* LOGO controls */}
              <div className="mb-6">
                <h3 className="text-md font-medium mb-2">Logo</h3>

                <div className="flex items-center gap-4">
                  {/* preview */}
                  <div style={{ width: 120, height: 50, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", borderRadius: 6, overflow: "hidden", border: "1px solid #eee" }}>
                    <img src={settings.logoPath || "/logo.png"} alt="logo preview" style={{ maxHeight: 46, maxWidth: "100%" }} />
                  </div>

                  {/* file upload */}
                  <div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} />
                    <div className="text-sm text-gray-500 mt-1">Upload a logo (PNG, JPG, SVG). Saved to <code>/public/uploads</code> (local/dev).</div>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Or paste an image URL</label>
                  <input className="w-full border rounded px-3 py-2" value={settings.logoPath || ""} onChange={onLogoUrlChange} placeholder="https://cdn.example.com/logo.png or /uploads/xxx.png" />
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => { updateField('logoPath', settings.logoPath); setMsg('Preview set. Click Save to persist.'); setTimeout(()=>setMsg(""),3000); }} className="px-3 py-2 border rounded">Preview</button>
                  <button onClick={resetLogoToDefault} className="px-3 py-2 border rounded">Reset logo to default</button>
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
                <div style={{ padding: "12px 16px", background: settings.headerBg, color: settings.headerText, fontFamily: settings.fontFamily, display: 'flex', alignItems:'center', gap:12 }}>
                  <img src={settings.logoPath || "/logo.png"} alt="logo" style={{ height: 28, objectFit: 'contain' }} />
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
