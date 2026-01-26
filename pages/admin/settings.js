// pages/admin/settings.js
import { useEffect, useRef, useState } from 'react'
import Sidebar from '../../components/Sidebar'

const DEFAULTS = {
  primaryColor: '#111827',       // main site color / accent
  textColor: '#0f172a',          // general text
  headerBg: '#ffffff',           // header background
  headerText: '#111827',         // header text
  heroBg: '#f8fafc',             // hero background
  heroText: '#0f172a',           // hero text
  buttonBg: '#f59e0b',           // CTA button bg
  buttonText: '#000000',         // CTA button text
  linkColor: '#0ea5e9',          // link color
  heroTitle: 'Welcome to Your Store',
  heroCta: 'Get Started'
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [saving, setSaving] = useState(false)

  // visual settings
  const [primaryColor, setPrimaryColor] = useState(DEFAULTS.primaryColor)
  const [textColor, setTextColor] = useState(DEFAULTS.textColor)
  const [headerBg, setHeaderBg] = useState(DEFAULTS.headerBg)
  const [headerText, setHeaderText] = useState(DEFAULTS.headerText)
  const [heroBg, setHeroBg] = useState(DEFAULTS.heroBg)
  const [heroText, setHeroText] = useState(DEFAULTS.heroText)
  const [buttonBg, setButtonBg] = useState(DEFAULTS.buttonBg)
  const [buttonText, setButtonText] = useState(DEFAULTS.buttonText)
  const [linkColor, setLinkColor] = useState(DEFAULTS.linkColor)

  // hero content
  const [heroTitle, setHeroTitle] = useState(DEFAULTS.heroTitle)
  const [heroCta, setHeroCta] = useState(DEFAULTS.heroCta)

  // logo upload
  const [logoFile, setLogoFile] = useState(null) // File
  const [logoPreview, setLogoPreview] = useState(null)

  const fileRef = useRef(null)

  useEffect(() => {
    fetchSettings()
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchSettings() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/sections')
      if (!res.ok) {
        throw new Error('Failed to fetch settings')
      }
      const j = await res.json()

      // populate fields safely with fallbacks
      setPrimaryColor(j.primaryColor || DEFAULTS.primaryColor)
      setTextColor(j.textColor || DEFAULTS.textColor)
      setHeaderBg(j.headerBg || DEFAULTS.headerBg)
      setHeaderText(j.headerText || DEFAULTS.headerText)
      setHeroBg(j.heroBg || DEFAULTS.heroBg)
      setHeroText(j.heroText || DEFAULTS.heroText)
      setButtonBg(j.buttonBg || DEFAULTS.buttonBg)
      setButtonText(j.buttonText || DEFAULTS.buttonText)
      setLinkColor(j.linkColor || DEFAULTS.linkColor)
      setHeroTitle(j.heroTitle || DEFAULTS.heroTitle)
      setHeroCta(j.heroCta || DEFAULTS.heroCta)

      // logo (url) -> show preview (we keep URL as preview)
      if (j.logoUrl) {
        setLogoPreview(j.logoUrl)
        setLogoFile(null)
      }
    } catch (e) {
      console.error(e)
      setMsg('Could not load settings')
    } finally {
      setLoading(false)
    }
  }

  function onLogoChange(e) {
    const f = e.target.files?.[0]
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setMsg('Please select an image file')
      return
    }
    try {
      if (logoPreview && logoPreview.startsWith('blob:')) URL.revokeObjectURL(logoPreview)
    } catch {}
    const url = URL.createObjectURL(f)
    setLogoFile(f)
    setLogoPreview(url)
  }

  function resetDefaults() {
    setPrimaryColor(DEFAULTS.primaryColor)
    setTextColor(DEFAULTS.textColor)
    setHeaderBg(DEFAULTS.headerBg)
    setHeaderText(DEFAULTS.headerText)
    setHeroBg(DEFAULTS.heroBg)
    setHeroText(DEFAULTS.heroText)
    setButtonBg(DEFAULTS.buttonBg)
    setButtonText(DEFAULTS.buttonText)
    setLinkColor(DEFAULTS.linkColor)
    setHeroTitle(DEFAULTS.heroTitle)
    setHeroCta(DEFAULTS.heroCta)
    setLogoFile(null)
    setLogoPreview(null)
    setMsg('Reset to defaults')
  }

  function cssVariablesString() {
    return `:root {
  --primary: ${primaryColor};
  --text: ${textColor};
  --header-bg: ${headerBg};
  --header-text: ${headerText};
  --hero-bg: ${heroBg};
  --hero-text: ${heroText};
  --btn-bg: ${buttonBg};
  --btn-text: ${buttonText};
  --link: ${linkColor};
}`
  }

  async function copyCssToClipboard() {
    try {
      await navigator.clipboard.writeText(cssVariablesString())
      setMsg('CSS variables copied to clipboard')
    } catch {
      setMsg('Copy failed')
    }
  }

  async function save() {
    setSaving(true)
    setMsg('')
    try {
      // If there's a logo file, use FormData, otherwise JSON
      if (logoFile) {
        const fd = new FormData()
        fd.append('primaryColor', primaryColor)
        fd.append('textColor', textColor)
        fd.append('headerBg', headerBg)
        fd.append('headerText', headerText)
        fd.append('heroBg', heroBg)
        fd.append('heroText', heroText)
        fd.append('buttonBg', buttonBg)
        fd.append('buttonText', buttonText)
        fd.append('linkColor', linkColor)
        fd.append('heroTitle', heroTitle)
        fd.append('heroCta', heroCta)
        fd.append('logo', logoFile, logoFile.name)

        const res = await fetch('/api/admin/update-sections', {
          method: 'POST',
          body: fd
        })
        const j = await res.json().catch(() => ({}))
        if (res.ok) setMsg('Saved successfully')
        else setMsg(j?.message || 'Save failed')
      } else {
        // JSON path
        const payload = {
          primaryColor,
          textColor,
          headerBg,
          headerText,
          heroBg,
          heroText,
          buttonBg,
          buttonText,
          linkColor,
          heroTitle,
          heroCta
        }
        const res = await fetch('/api/admin/update-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const j = await res.json().catch(() => ({}))
        if (res.ok) setMsg('Saved successfully')
        else setMsg(j?.message || 'Save failed')
      }
    } catch (e) {
      console.error(e)
      setMsg('Save error')
    } finally {
      setSaving(false)
    }
  }

  // live preview style
  const previewStyle = {
    '--primary': primaryColor,
    '--text': textColor,
    '--header-bg': headerBg,
    '--header-text': headerText,
    '--hero-bg': heroBg,
    '--hero-text': heroText,
    '--btn-bg': buttonBg,
    '--btn-text': buttonText,
    '--link': linkColor
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-zinc-900 text-slate-900 dark:text-slate-100">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Controls */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Site Appearance & Settings</h1>
                <p className="text-sm text-zinc-500">Customize global colors, hero, and logo. Live preview on the right.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={copyCssToClipboard} className="px-3 py-1 text-sm rounded bg-zinc-100 dark:bg-zinc-700">Copy CSS</button>
                <button onClick={resetDefaults} className="px-3 py-1 text-sm rounded bg-red-100 text-red-700">Reset</button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow space-y-4">
              <h3 className="text-sm font-medium">Brand & Logo</h3>
              <div className="flex items-center gap-4">
                <div className="w-28 h-16 rounded overflow-hidden bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" className="w-full h-full object-contain p-1" />
                  ) : (
                    <div className="text-xs text-zinc-500">No logo</div>
                  )}
                </div>
                <div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={onLogoChange} className="hidden" />
                  <div className="flex gap-2">
                    <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-1 rounded bg-black text-white text-sm">Upload Logo</button>
                    <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null) }} className="px-3 py-1 rounded bg-zinc-100 text-sm">Remove</button>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">PNG / JPG recommended. Max 2MB.</div>
                </div>
              </div>
            </div>

            {/* Colors grid */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow space-y-4">
              <h3 className="text-sm font-medium">Colors</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Primary</span>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Text</span>
                  <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Header Bg</span>
                  <input type="color" value={headerBg} onChange={e => setHeaderBg(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Header Text</span>
                  <input type="color" value={headerText} onChange={e => setHeaderText(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Hero Bg</span>
                  <input type="color" value={heroBg} onChange={e => setHeroBg(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Hero Text</span>
                  <input type="color" value={heroText} onChange={e => setHeroText(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Button</span>
                  <input type="color" value={buttonBg} onChange={e => setButtonBg(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col">
                  <span className="text-xs text-zinc-500 mb-1">Button Text</span>
                  <input type="color" value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>

                <label className="flex flex-col md:col-span-2">
                  <span className="text-xs text-zinc-500 mb-1">Link Color</span>
                  <input type="color" value={linkColor} onChange={e => setLinkColor(e.target.value)} className="w-full h-10 p-0 border-0" />
                </label>
              </div>
            </div>

            {/* Hero content */}
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow space-y-4">
              <h3 className="text-sm font-medium">Hero / Landing Content</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Hero Title</label>
                  <input className="input w-full" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-zinc-500 mb-1">Hero CTA</label>
                  <input className="input w-full" value={heroCta} onChange={e => setHeroCta(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-black text-white hover:bg-amber-400 hover:text-black transition">
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button onClick={() => fetchSettings()} disabled={loading} className="px-4 py-2 rounded bg-zinc-100 dark:bg-zinc-700">Reload</button>
              {msg && <div className="text-sm text-zinc-500">{msg}</div>}
            </div>
          </div>

          {/* Right: Live Preview */}
          <aside className="hidden md:block">
            <div className="sticky top-6">
              <div className="rounded-lg overflow-hidden border dark:border-zinc-700 shadow" style={previewStyle}>
                {/* header */}
                <header style={{ background: headerBg, color: headerText }} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 bg-white rounded overflow-hidden flex items-center justify-center">
                      {logoPreview ? <img src={logoPreview} alt="logo" className="object-contain w-full h-full" /> : <div className="text-xs">LOGO</div>}
                    </div>
                    <div style={{ color: headerText }} className="font-semibold">Admin Demo</div>
                  </div>
                  <nav className="flex items-center gap-3">
                    <a style={{ color: linkColor }} className="text-sm">Home</a>
                    <a style={{ color: linkColor }} className="text-sm">Listings</a>
                    <a style={{ color: linkColor }} className="text-sm">Contact</a>
                  </nav>
                </header>

                {/* hero */}
                <section style={{ background: heroBg, color: heroText }} className="p-6">
                  <h2 className="text-lg font-bold" style={{ color: heroText }}>{heroTitle}</h2>
                  <p className="text-sm mt-2" style={{ color: heroText }}>This is a live preview — text and colors reflect your choices.</p>
                  <div className="mt-4">
                    <button style={{ background: buttonBg, color: buttonText }} className="px-4 py-2 rounded shadow">
                      {heroCta}
                    </button>
                  </div>
                </section>

                {/* sample content */}
                <div className="p-4" style={{ color: textColor }}>
                  <h3 className="font-semibold">Sample content</h3>
                  <p className="text-sm mt-2">Paragraph text uses your <strong>text color</strong>. Links use <span style={{ color: linkColor }}>link color</span>.</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="p-3 border rounded" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <div className="text-xs">Card</div>
                      <div className="font-medium">Example</div>
                    </div>
                    <div className="p-3 border rounded" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                      <div className="text-xs">Card</div>
                      <div className="font-medium">Example</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-zinc-500">
                Preview uses inline styles and won't persist — press Save to store changes.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
