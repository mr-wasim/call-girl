// pages/admin/all-listings.jsx
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Sidebar from '../../components/Sidebar'

export default function AdminAllListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const debounceRef = useRef(null)

  // fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/listings')
      const data = await res.json()
      const safe = Array.isArray(data)
        ? data
        : Array.isArray(data?.listings)
        ? data.listings
        : Array.isArray(data?.data)
        ? data.data
        : []
      setListings(safe)
    } catch (err) {
      console.error('fetch listings', err)
      setListings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchListings() }, [fetchListings])

  // debounce search
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 220)
    return () => clearTimeout(debounceRef.current)
  }, [search])

  const filtered = useMemo(() => {
    if (!debouncedSearch) return listings
    return listings.filter(l =>
      (l?.name || '').toLowerCase().includes(debouncedSearch) ||
      (l?.city || '').toLowerCase().includes(debouncedSearch)
    )
  }, [listings, debouncedSearch])

  // open edit: load fresh single item
  const openEdit = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/listings/${id}`)
      const data = await res.json()
      if (!data?.success) { alert('Could not load listing'); return }
      const d = data.data
      setEditing({
        ...d,
        keepProfile: Array.isArray(d.profileImages) ? [...d.profileImages] : [],
        keepVariant: Array.isArray(d.variantImages) ? [...d.variantImages] : [],
        newProfile: [],
        newVariant: [],
        addProfileUrl: '',
        addVariantUrl: '',
        description: d.descriptionHtml ?? d.description ?? '',
        status: d.status ?? 'active',
      })
    } catch (err) {
      console.error('openEdit error', err)
      alert('Failed to load listing')
    }
  }, [])

  // file handlers (create preview objects)
  function handleProfileFiles(files) {
    if (!files || files.length === 0) return
    setEditing(prev => {
      const added = Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }))
      return { ...prev, newProfile: Array.isArray(prev?.newProfile) ? [...prev.newProfile, ...added] : added }
    })
  }
  function handleVariantFiles(files) {
    if (!files || files.length === 0) return
    setEditing(prev => {
      const added = Array.from(files).map(f => ({ file: f, preview: URL.createObjectURL(f) }))
      return { ...prev, newVariant: Array.isArray(prev?.newVariant) ? [...prev.newVariant, ...added] : added }
    })
  }

  // remove keep / new images
  const removeKeepProfile = useCallback((idx) => {
    setEditing(s => ({ ...s, keepProfile: (s.keepProfile || []).filter((_, i) => i !== idx) }))
  }, [])
  const removeKeepVariant = useCallback((idx) => {
    setEditing(s => ({ ...s, keepVariant: (s.keepVariant || []).filter((_, i) => i !== idx) }))
  }, [])

  const removeNewProfile = useCallback((idx) => {
    setEditing(s => {
      const np = Array.isArray(s.newProfile) ? s.newProfile : []
      const removed = np[idx]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      const newArr = np.filter((_, i) => i !== idx)
      return { ...s, newProfile: newArr }
    })
  }, [])
  const removeNewVariant = useCallback((idx) => {
    setEditing(s => {
      const nv = Array.isArray(s.newVariant) ? s.newVariant : []
      const removed = nv[idx]
      if (removed?.preview) URL.revokeObjectURL(removed.preview)
      const newArr = nv.filter((_, i) => i !== idx)
      return { ...s, newVariant: newArr }
    })
  }, [])

  // add pasted URL
  const addProfileUrl = useCallback(() => {
    if (!editing?.addProfileUrl?.trim()) return
    setEditing(s => ({ ...s, keepProfile: [...(s.keepProfile || []), s.addProfileUrl.trim()], addProfileUrl: '' }))
  }, [editing?.addProfileUrl])
  const addVariantUrl = useCallback(() => {
    if (!editing?.addVariantUrl?.trim()) return
    setEditing(s => ({ ...s, keepVariant: [...(s.keepVariant || []), s.addVariantUrl.trim()], addVariantUrl: '' }))
  }, [editing?.addVariantUrl])

  // revoke previews on close/cancel safely
  function closeEditing() {
    if (editing) {
      if (Array.isArray(editing.newProfile)) editing.newProfile.forEach(p => p.preview && URL.revokeObjectURL(p.preview))
      if (Array.isArray(editing.newVariant)) editing.newVariant.forEach(p => p.preview && URL.revokeObjectURL(p.preview))
    }
    setEditing(null)
  }

  // SAVE: robust handling: if there are new files -> multipart to admin update; else JSON PUT to list endpoint
  async function saveEdit() {
    if (!editing) return
    if (!editing.name?.trim()) { alert('Name is required'); return }

    try {
      setSaving(true)

      const hasNewFiles = (Array.isArray(editing.newProfile) && editing.newProfile.length > 0) || (Array.isArray(editing.newVariant) && editing.newVariant.length > 0)

      if (hasNewFiles && typeof window !== 'undefined' && typeof window.FormData !== 'undefined') {
        // multipart route
        const formData = new window.FormData()
        formData.append('name', editing.name || '')
        formData.append('city', editing.city || '')
        formData.append('price', editing.price ?? '')
        formData.append('status', editing.status || 'active')
        formData.append('description', editing.description || '')

        formData.append('keepProfile', JSON.stringify(editing.keepProfile || []))
        formData.append('keepVariant', JSON.stringify(editing.keepVariant || []))

        ;(editing.newProfile || []).forEach(item => { if (item?.file) formData.append('profileImages', item.file) })
        ;(editing.newVariant || []).forEach(item => { if (item?.file) formData.append('variantImages', item.file) })

        const res = await fetch(`/api/admin/update-listing/${editing._id}`, {
          method: 'PUT',
          body: formData,
        })
        const data = await res.json()
        if (data?.ok) {
          setListings(prev => prev.map(it => it._id === editing._id ? data.listing : it))
          if (Array.isArray(editing.newProfile)) editing.newProfile.forEach(p => p.preview && URL.revokeObjectURL(p.preview))
          if (Array.isArray(editing.newVariant)) editing.newVariant.forEach(p => p.preview && URL.revokeObjectURL(p.preview))
          setEditing(null)
        } else {
          console.error('multipart save failed', data)
          alert(data?.message || 'Save failed')
        }
      } else {
        // no new files -> JSON PUT to existing JSON-capable endpoint
        const payload = {
          name: editing.name || '',
          city: editing.city || '',
          price: editing.price ?? '',
          status: editing.status || 'active',
          description: editing.description || '',
          keepProfile: editing.keepProfile || [],
          keepVariant: editing.keepVariant || [],
        }

        const res = await fetch(`/api/listings/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        const ok = data?.success || data?.ok || res.ok
        const listing = data?.data || data?.listing || null
        if (ok && listing) {
          setListings(prev => prev.map(it => it._id === editing._id ? listing : it))
          setEditing(null)
        } else {
          console.error('json save failed', data)
          alert(data?.message || 'Save failed')
        }
      }
    } catch (err) {
      console.error('saveEdit error', err)
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  // delete listing
  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this listing?')) return
    try {
      const res = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data?.success || res.ok) {
        setListings(prev => prev.filter(l => l._id !== id))
      } else {
        alert('Delete failed')
      }
    } catch (err) {
      console.error('delete error', err)
      alert('Delete failed')
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">All Listings</h1>
              <p className="text-sm text-gray-500">Edit details, images and variants</p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="search"
                placeholder="Search by name or city"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white rounded-xl shadow border">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-left font-medium">City</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">Loading...</td></tr>}
                {!loading && filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-6 text-center text-gray-500">No listings found</td></tr>}
                {filtered.map(item => (
                  <tr key={item._id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{item.name || 'Untitled'}</td>
                    <td className="px-4 py-3 text-gray-600">{item.city || '--'}</td>
                    <td className="px-4 py-3 text-gray-600">{item.price ?? '--'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${item.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {item.status ?? 'active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item._id)} className="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-700 hover:bg-red-100 border">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit popup */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h2 className="text-lg font-semibold">Edit Listing</h2>
              <button onClick={closeEditing} className="text-gray-500 hover:text-gray-800">✕</button>
            </div>

            {/* PROFILE IMAGES */}
            <section className="mt-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Main Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(editing.keepProfile || []).map((url, i) => (
                  <div key={`kp-${i}`} className="relative group">
                    <img src={url} alt="" className="w-full h-28 object-cover rounded-md border" loading="lazy" />
                    <button onClick={() => removeKeepProfile(i)} title="Remove" className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                  </div>
                ))}
                {(Array.isArray(editing.newProfile) ? editing.newProfile : []).map((p, i) => (
                  <div key={`np-${i}`} className="relative group">
                    <img src={p.preview} alt={p.file?.name || 'new'} className="w-full h-28 object-cover rounded-md border" />
                    <button onClick={() => removeNewProfile(i)} title="Remove" className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-3 items-center">
                <input type="text" placeholder="Paste image URL and click Add" value={editing.addProfileUrl || ''} onChange={e => setEditing(s => ({ ...s, addProfileUrl: e.target.value }))} className="flex-1 px-3 py-2 border rounded-md" />
                <button onClick={addProfileUrl} className="px-4 py-2 rounded-md bg-gray-900 text-white">Add URL</button>
              </div>

              <div className="mt-3">
                <label className="inline-block mb-2 text-sm text-gray-600">Upload images</label>
                <input type="file" multiple accept="image/*" onChange={e => handleProfileFiles(e.target.files)} />
                <p className="text-xs text-gray-500 mt-1">Multiple files allowed. Files will be saved to /public/uploads on server.</p>
              </div>
            </section>

            {/* VARIANT IMAGES */}
            <section className="mt-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2">Variant Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(editing.keepVariant || []).map((url, i) => (
                  <div key={`kv-${i}`} className="relative group">
                    <img src={url} alt="" className="w-full h-28 object-cover rounded-md border" loading="lazy" />
                    <button onClick={() => removeKeepVariant(i)} title="Remove" className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100">✕</button>
                  </div>
                ))}
                {(Array.isArray(editing.newVariant) ? editing.newVariant : []).map((p, i) => (
                  <div key={`nv-${i}`} className="relative group">
                    <img src={p.preview} alt={p.file?.name || 'new'} className="w-full h-28 object-cover rounded-md border" />
                    <button onClick={() => removeNewVariant(i)} title="Remove" className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center">✕</button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-3 items-center">
                <input type="text" placeholder="Paste variant image URL and click Add" value={editing.addVariantUrl || ''} onChange={e => setEditing(s => ({ ...s, addVariantUrl: e.target.value }))} className="flex-1 px-3 py-2 border rounded-md" />
                <button onClick={addVariantUrl} className="px-4 py-2 rounded-md bg-gray-900 text-white">Add URL</button>
              </div>

              <div className="mt-3">
                <label className="inline-block mb-2 text-sm text-gray-600">Upload variant images</label>
                <input type="file" multiple accept="image/*" onChange={e => handleVariantFiles(e.target.files)} />
              </div>
            </section>

            {/* DETAILS */}
            <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Title</label>
                <input value={editing.name || ''} onChange={e => setEditing(s => ({ ...s, name: e.target.value }))} className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">City</label>
                <input value={editing.city || ''} onChange={e => setEditing(s => ({ ...s, city: e.target.value }))} className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Price</label>
                <input value={editing.price ?? ''} onChange={e => setEditing(s => ({ ...s, price: e.target.value }))} className="w-full px-3 py-2 border rounded-md" />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Status</label>
                <select value={editing.status || 'active'} onChange={e => setEditing(s => ({ ...s, status: e.target.value }))} className="w-full px-3 py-2 border rounded-md">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </section>

            <section className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <textarea rows={5} value={editing.description || ''} onChange={e => setEditing(s => ({ ...s, description: e.target.value }))} className="w-full px-3 py-2 border rounded-md" />
            </section>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeEditing} className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} disabled={saving} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
