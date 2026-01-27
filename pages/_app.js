// pages/_app.js
import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { createContext, useEffect, useState } from 'react'
import Head from 'next/head'

export const SettingsContext = createContext(null)

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

  root.style.setProperty('--primary-color', s.primaryColor)
  root.style.setProperty('--text-color', s.textColor)
  root.style.setProperty('--header-bg', s.headerBg)
  root.style.setProperty('--header-text', s.headerText)
  root.style.setProperty('--accent-color', s.accentColor)
  root.style.setProperty('--body-bg', s.bodyBg)
  root.style.setProperty('--footer-bg', s.footerBg)
  root.style.setProperty('--footer-text', s.footerText)
  root.style.setProperty('--border-radius', s.borderRadius)
  root.style.setProperty('--font-family', s.fontFamily)
}

export default function MyApp({ Component, pageProps }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  /* 1️⃣ INITIAL LOAD + RELOAD SAFE */
  useEffect(() => {
    async function loadTheme() {
      try {
        const res = await fetch('/api/admin/settings')
        const json = await res.json()

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
  }, [])

  /* 2️⃣ LIVE UPDATE LISTENER (ADMIN SAVE) */
  useEffect(() => {
    function onThemeUpdate(e) {
      const theme = e.detail
      if (!theme) return
      const finalTheme = { ...DEFAULT_SETTINGS, ...theme }
      setSettings(finalTheme)
      applyTheme(finalTheme)
    }

    window.addEventListener('site-theme-updated', onThemeUpdate)
    return () => window.removeEventListener('site-theme-updated', onThemeUpdate)
  }, [])

  return (
    <>
      <Head>
        <meta name="theme-color" content={settings.primaryColor} />
      </Head>

      <SettingsContext.Provider value={{ settings }}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 min-h-[60vh]">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </SettingsContext.Provider>
    </>
  )
}
