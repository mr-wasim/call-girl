// pages/_app.js
import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import Head from 'next/head'

export const SettingsContext = createContext(null)
export const AuthContext = createContext(null)

/* ORIGINAL LOOK = DEFAULT */
const DEFAULT_SETTINGS = {
  primaryColor: '#111827',
  textColor: '#f3f4f6',
  headerBg: '#000000',
  headerText: '#ffffff',
  accentColor: '#f3bc1b',
  bodyBg: '#333333',
  footerBg: '#1f1f1f',
  footerText: '#d1d5db',
  fontFamily: 'ui-sans-serif, system-ui, -apple-system',
  borderRadius: '0.375rem',
}

/* Apply theme to whole site */
function applyTheme(s) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // Only set props that actually exist on the theme to avoid unnecessary style updates
  const map = {
    '--primary-color': s.primaryColor,
    '--text-color': s.textColor,
    '--header-bg': s.headerBg,
    '--header-text': s.headerText,
    '--accent-color': s.accentColor,
    '--body-bg': s.bodyBg,
    '--footer-bg': s.footerBg,
    '--footer-text': s.footerText,
    '--border-radius': s.borderRadius,
    '--font-family': s.fontFamily,
  }

  Object.entries(map).forEach(([key, value]) => {
    if (value != null) root.style.setProperty(key, value)
  })
}

export default function MyApp({ Component, pageProps }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  /** ---------- THEME: load from server + live updates ---------- */
  useEffect(() => {
    let mounted = true
    async function loadTheme() {
      try {
        const res = await fetch('/api/admin/settings')
        const json = await res.json()
        if (!mounted) return
        if (json?.ok && json.settings) {
          const s = json.settings._doc || json.settings
          const finalTheme = { ...DEFAULT_SETTINGS, ...s }
          setSettings(finalTheme)
          applyTheme(finalTheme)
        } else {
          applyTheme(DEFAULT_SETTINGS)
        }
      } catch (e) {
        console.error('Theme load failed', e)
        applyTheme(DEFAULT_SETTINGS)
      }
    }
    loadTheme()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    function onThemeUpdate(e) {
      const theme = e?.detail
      if (!theme) return
      const finalTheme = { ...DEFAULT_SETTINGS, ...theme }
      setSettings(finalTheme)
      applyTheme(finalTheme)
    }

    window.addEventListener('site-theme-updated', onThemeUpdate)
    return () => window.removeEventListener('site-theme-updated', onThemeUpdate)
  }, [])

  /** ---------- AUTH: session caching + fast UX ---------- */
  const [user, setUserState] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)

  // wrapper that writes to sessionStorage for instant reloads/navigation
  const setUser = useCallback((u) => {
    try {
      if (u) sessionStorage.setItem('me', JSON.stringify(u))
      else sessionStorage.removeItem('me')
    } catch (e) {
      // ignore storage errors
    }
    setUserState(u)
  }, [])

  // fetch /api/auth/me and update user state (used on mount and to revalidate)
  const refreshUser = useCallback(async () => {
    setLoadingUser(true)
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      const u = data?.user ?? null
      setUser(u)
      return u
    } catch (err) {
      setUser(null)
      return null
    } finally {
      setLoadingUser(false)
    }
  }, [setUser])

  // On mount: read from sessionStorage for instant UI, then background refresh
  useEffect(() => {
    let mounted = true

    try {
      const raw = sessionStorage.getItem('me')
      if (raw) {
        const parsed = JSON.parse(raw)
        setUserState(parsed)
        // start background refresh (don't block)
        refreshUser().catch(() => {})
        if (mounted) setLoadingUser(false)
        return
      }
    } catch (e) {
      // ignore parse errors
    }

    // if no cached user, fetch immediately
    refreshUser().catch(() => {}).finally(() => {
      if (mounted) setLoadingUser(false)
    })

    return () => { mounted = false }
  }, [refreshUser])

  // Revalidate on tab focus to keep session fresh (small perf win and security)
  useEffect(() => {
    function onVisibility() {
      if (document.visibilityState === 'visible') {
        refreshUser().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [refreshUser])

  // Memoized context values
  const settingsValue = useMemo(() => ({ settings, setSettings }), [settings])
  const authValue = useMemo(() => ({ user, setUser, refreshUser, loadingUser }), [user, setUser, refreshUser, loadingUser])

  return (
    <>
      <Head>
        <meta name="theme-color" content={settings.primaryColor} />
      </Head>

      <SettingsContext.Provider value={{ settings: settingsValue }}>
        <AuthContext.Provider value={authValue}>
          <div className="min-h-screen flex flex-col" style={{ background: 'var(--body-bg)' }}>
            <Header />
            <main className="flex-1 min-h-[60vh]">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </AuthContext.Provider>
      </SettingsContext.Provider>
    </>
  )
}
