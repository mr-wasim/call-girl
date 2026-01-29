// pages/admin/create-city.js
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import { useRouter } from "next/router";
import RichTextEditor from "../../components/RichTextEditor";

export default function AdminCreateCity() {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("<p></p>");
  const router = useRouter();

  async function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      setMsg("City name required");
      return;
    }
    setSaving(true);
    setMsg("");

    try {
      // Optionally sanitize descriptionHtml server-side.
      const res = await fetch("/api/admin/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), descriptionHtml }),
      });
      const j = await res.json();
      if (j.ok) {
        setMsg("City created.");
        try {
          window.dispatchEvent(new CustomEvent("site-cities-updated", { detail: j.city }));
          localStorage.setItem("site_cities_updated_at", Date.now().toString());
          localStorage.setItem("site_cities_payload", JSON.stringify(j.city));
        } catch (e) {}
        setTimeout(() => router.push("/admin/create"), 700);
      } else {
        setMsg("Create failed: " + (j.message || "unknown"));
      }
    } catch (err) {
      console.error("create city error", err);
      setMsg("Create failed: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Head><title>Create City - Admin</title></Head>
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold mb-4">Create City</h1>

          <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
            <div>
              <label className="block text-sm font-medium mb-1">City Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
                  w-full
                  border
                  rounded
                  px-3
                  py-2
                  bg-white
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
                placeholder="e.g. Mumbai"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (rich)</label>

              <RichTextEditor
                value={descriptionHtml}
                onChange={setDescriptionHtml}
                placeholder="Write a rich description — headings, bullets, colors..."
                minHeight={260}
              />

              <div className="text-sm text-gray-500 mt-2">Tip: select text, then click a color or highlight to apply.</div>
            </div>

            <div className="flex items-center gap-3">
              <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">
                {saving ? "Saving..." : "Create City"}
              </button>

              <button type="button" onClick={() => { setName(""); setDescriptionHtml("<p></p>"); }} className="px-4 py-2 border rounded">Reset</button>

              <div className="ml-auto text-sm text-gray-500">{msg}</div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
