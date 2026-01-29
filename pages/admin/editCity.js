import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Head from "next/head";
import RichTextEditor from "../../components/RichTextEditor";

export default function AdminEditCity() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("<p></p>");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/cities");
      const j = await res.json();
      if (j.ok && Array.isArray(j.cities)) {
        setCities(j.cities);
      } else {
        setMsg("Could not load cities");
      }
    } catch (err) {
      setMsg("Could not load cities");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(city) {
    setEditingId(city._id || city.id);
    setName(city.name || "");
    setDescriptionHtml(city.descriptionHtml || "<p></p>");
    setMsg("");
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setDescriptionHtml("<p></p>");
    setSaving(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    if (!name.trim()) {
      setMsg("City name required");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`/api/admin/cities/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), descriptionHtml }),
      });
      const j = await res.json();
      if (j.ok) {
        setCities((prev) =>
          prev.map((c) =>
            (c._id || c.id) === editingId
              ? { ...c, name: name.trim(), descriptionHtml }
              : c
          )
        );
        setMsg("City updated successfully");
        setTimeout(cancelEdit, 600);
      } else {
        setMsg("Update failed");
      }
    } catch {
      setMsg("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this city?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/cities/${id}`, { method: "DELETE" });
      const j = await res.json();
      if (j.ok) {
        setCities((prev) => prev.filter((c) => (c._id || c.id) !== id));
        setMsg("City deleted");
        if (editingId === id) cancelEdit();
      } else {
        setMsg("Delete failed");
      }
    } catch {
      setMsg("Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Head>
        <title>Edit Cities - Admin</title>
      </Head>

      <div className="min-h-screen flex bg-gray-100 text-gray-800">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Edit Cities</h1>
            {msg && <div className="text-sm text-blue-600">{msg}</div>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <section className="lg:col-span-2">
              <h2 className="text-lg font-medium mb-3 text-gray-900">All Cities</h2>

              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : cities.length === 0 ? (
                <div className="text-sm text-gray-500">No cities created yet.</div>
              ) : (
                <div className="space-y-4">
                  {cities.map((city) => (
                    <div key={city._id || city.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-lg text-gray-900">{city.name}</div>
                          <div
                            className="prose prose-sm max-w-none text-gray-700 mt-2"
                            dangerouslySetInnerHTML={{ __html: city.descriptionHtml || "<p></p>" }}
                          />
                        </div>

                        <div className="flex sm:flex-col gap-2">
                          <button
                            onClick={() => startEdit(city)}
                            className="px-3 py-1.5 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(city._id || city.id)}
                            disabled={deletingId === (city._id || city.id)}
                            className="px-3 py-1.5 rounded border text-sm text-red-600 hover:bg-red-50"
                          >
                            {deletingId === (city._id || city.id) ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <aside className="lg:col-span-1">
              <div className="bg-white border rounded-lg p-4 shadow-sm">
                <h2 className="text-lg font-medium mb-4 text-gray-900">
                  {editingId ? "Edit City" : "Select a city"}
                </h2>

                {editingId ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <RichTextEditor value={descriptionHtml} onChange={setDescriptionHtml} minHeight={180} />
                    </div>

                    <div className="flex gap-3">
                      <button
                        disabled={saving}
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        {saving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-sm text-gray-500">Click Edit on any city to modify details.</div>
                )}
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}
