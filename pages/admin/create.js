// pages/admin/create.js
import { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import RichTextEditor from '../../components/RichTextEditor'
import Head from 'next/head'

export default function AdminCreatePage({ initialCities = [] }) {
    const [name, setName] = useState('')
    const [city, setCity] = useState(initialCities?.[0]?.slug || '')
    const [age, setAge] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')

    const [profileFiles, setProfileFiles] = useState([]) // { file, url, id }
    const [variantFiles, setVariantFiles] = useState([])

    const profileInput = useRef(null)
    const variantInput = useRef(null)

    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')
    const [cities, setCities] = useState(initialCities || [])

    // cleanup objectURLs on unmount
    useEffect(() => {
        return () => {
            profileFiles.forEach(i => i.url && URL.revokeObjectURL(i.url))
            variantFiles.forEach(i => i.url && URL.revokeObjectURL(i.url))
        }
    }, [profileFiles, variantFiles])

    // listen for city updates (admin creates a city)
    useEffect(() => {
      function onCitiesUpdated(e) {
        // simplest: re-fetch cities
        fetch('/api/admin/cities').then(r => r.json()).then(j => {
          if (j?.ok && j.cities) {
            setCities(j.cities)
            if (!city && j.cities.length) setCity(j.cities[0].slug)
          }
        }).catch(()=>{})
      }
      window.addEventListener('site-cities-updated', onCitiesUpdated)
      window.addEventListener('storage', (ev)=>{
        if (ev.key === 'site_cities_updated_at') onCitiesUpdated()
      })
      return ()=>{
        window.removeEventListener('site-cities-updated', onCitiesUpdated)
      }
    }, [city])

    function makePreview(files) {
        return files.map(f => ({
            file: f,
            url: URL.createObjectURL(f),
            id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        }))
    }

    function onProfileChange(e) {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setProfileFiles(prev => [...prev, ...makePreview(files)])
        e.target.value = ''
    }

    function onVariantChange(e) {
        const files = Array.from(e.target.files || [])
        if (!files.length) return
        setVariantFiles(prev => [...prev, ...makePreview(files)])
        e.target.value = ''
    }

    function handleDrop(e, type = 'profile') {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
        if (!files.length) return
        if (type === 'profile') setProfileFiles(prev => [...prev, ...makePreview(files)])
        else setVariantFiles(prev => [...prev, ...makePreview(files)])
    }

    function removeProfile(i) {
        setProfileFiles(prev => {
            const item = prev[i]
            try { item.url && URL.revokeObjectURL(item.url) } catch { }
            return prev.filter((_, idx) => idx !== i)
        })
    }
    function removeVariant(i) {
        setVariantFiles(prev => {
            const item = prev[i]
            try { item.url && URL.revokeObjectURL(item.url) } catch { }
            return prev.filter((_, idx) => idx !== i)
        })
    }

    function moveProfile(from, to) {
        setProfileFiles(prev => {
            if (to < 0 || to >= prev.length) return prev
            const arr = [...prev]
            const [item] = arr.splice(from, 1)
            arr.splice(to, 0, item)
            return arr
        })
    }

    async function submit(e) {
        e.preventDefault()
        setMsg('')
        if (!name.trim()) { setMsg('Enter a name'); return }
        if (!city.trim()) { setMsg('Select a city'); return }
        if (profileFiles.length < 1) { setMsg('Upload at least 1 profile image'); return }

        setLoading(true)
        try {
            const fd = new FormData()
            fd.append('name', name)
            fd.append('city', city)
            fd.append('age', age)
            fd.append('price', price)
            fd.append('description', description)

            profileFiles.forEach(p => fd.append('profileImages', p.file, p.file.name))
            variantFiles.forEach(v => fd.append('variantImages', v.file, v.file.name))
            fd.append('profileOrder', JSON.stringify(profileFiles.map(p => p.file.name)))

            const res = await fetch('/api/admin/create-listing', { method: 'POST', body: fd })
            const j = await res.json()
            if (res.ok) {
                setMsg('Listing created successfully')
                // cleanup previews
                profileFiles.forEach(i => i.url && URL.revokeObjectURL(i.url))
                variantFiles.forEach(i => i.url && URL.revokeObjectURL(i.url))
                setProfileFiles([]); setVariantFiles([])
                setName(''); setCity(cities?.[0]?.slug || ''); setAge(''); setPrice(''); setDescription('')
            } else {
                setMsg(j?.message || 'Upload failed')
            }
        } catch (err) {
            console.error(err)
            setMsg('Upload error: ' + (err?.message || String(err)))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
          <Head><title>Create Listing - Admin</title></Head>
          <div className="min-h-screen flex flex-col md:flex-row bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
            <Sidebar />

            <main className="flex-1 p-6 md:p-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold mb-3">Create Listing</h1>
                    <p className="text-sm text-gray-500 mb-6">Upload profile images and variant images. Drag & drop supported.</p>

                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input py-2 px-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
                        
                        {/* SSR-populated dropdown */}
                        <div>
                          <label className="block text-sm mb-1">City</label>
                          <select value={city} onChange={e => setCity(e.target.value)} className="w-full border rounded px-3 py-2">
                            {cities && cities.length ? cities.map(c => (
                              <option key={c.slug} value={c.slug}>{c.name}</option>
                            )) : (
                              <option value="">No cities — create one in Admin → Create City</option>
                            )}
                          </select>
                        </div>

                        <input className="input py-2 px-2" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
                        <input className="input py-2 px-2" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />


                        {/* DESCRIPTION (rich) */}
                        <div className="md:col-span-2">
                            <RichTextEditor value={description} onChange={setDescription} />
                        </div>

                        {/* PROFILE IMAGES */}
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2">Profile Images (drag-drop or select)</label>
                            <div
                                onDrop={(e) => handleDrop(e, 'profile')}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded p-4 bg-white dark:bg-zinc-800"
                            >
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">Drag & drop or</div>
                                    <div className="flex gap-3">
                                        <label className="cursor-pointer px-3 py-2 bg-black text-white rounded inline-flex items-center gap-2">
                                            Select Profile Images
                                            <input ref={profileInput} type="file" accept="image/*" multiple onChange={onProfileChange} className="hidden" />
                                        </label>
                                        <button type="button" onClick={() => profileInput.current?.click()} className="px-3 py-2 bg-yellow-400 text-black rounded">Browse</button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {profileFiles.map((p, i) => (
                                        <div key={p.id} className="relative w-28 h-28 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-700">
                                            <img src={p.url} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute left-1 top-1 flex gap-1">
                                                <button type="button" onClick={() => moveProfile(i, i - 1)} className="bg-white/80 text-black text-xs px-1 rounded">◀</button>
                                                <button type="button" onClick={() => moveProfile(i, i + 1)} className="bg-white/80 text-black text-xs px-1 rounded">▶</button>
                                            </div>
                                            <button type="button" onClick={() => removeProfile(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* VARIANT IMAGES */}
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-2">Variant Images (optional)</label>
                            <div
                                onDrop={(e) => handleDrop(e, 'variant')}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded p-4 bg-white dark:bg-zinc-800"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm text-gray-500 dark:text-gray-300">Drag & drop variant images or</div>
                                    <div className="flex gap-3">
                                        <label className="cursor-pointer px-3 py-2 bg-black text-white rounded inline-flex items-center gap-2">
                                            Select Variant Images
                                            <input ref={variantInput} type="file" accept="image/*" multiple onChange={onVariantChange} className="hidden" />
                                        </label>
                                        <button type="button" onClick={() => variantInput.current?.click()} className="px-3 py-2 bg-yellow-400 text-black rounded">Browse</button>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-3">
                                    {variantFiles.map((v, i) => (
                                        <div key={v.id} className="relative w-28 h-28 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-700">
                                            <img src={v.url} alt="" className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeVariant(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs">×</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3">
                            <button disabled={loading} className="bg-black text-white px-5 py-2 rounded hover:bg-yellow-400 hover:text-black transition">
                                {loading ? 'Publishing...' : 'Publish Listing'}
                            </button>
                            {msg && <div className="text-sm text-yellow-400">{msg}</div>}
                        </div>
                    </form>
                </div>
            </main>
          </div>
        </>
    )
}

// SSR: fetch cities so dropdown is server-rendered
export async function getServerSideProps(ctx) {
  const { req } = ctx;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const base = `${protocol}://${host}`;

  try {
    const res = await fetch(`${base}/api/admin/cities`);
    const j = await res.json();
    if (j?.ok && j.cities) {
      return { props: { initialCities: j.cities } };
    }
  } catch (e) {
    console.error("getServerSideProps cities fetch error", e);
  }

  return { props: { initialCities: [] } };
}
