// pages/_app.js
import { useEffect } from 'react'
import '../styles/globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

// apply CSS variables globally
function applyVars(settings) {
  if (!settings) return

  const root = document.documentElement

  const map = {
    primary: settings.primaryColor,
    text: settings.textColor,
    'header-bg': settings.headerBg,
    'header-text': settings.headerText,
    'hero-bg': settings.heroBg,
    'hero-text': settings.heroText,
    'btn-bg': settings.buttonBg,
    'btn-text': settings.buttonText,
    link: settings.linkColor
  }

  Object.entries(map).forEach(([key, value]) => {
    if (value) {
      root.style.setProperty(`--${key}`, value)
    }
  })

  // logo ko body dataset me rakh rahe (Header/Footer use kar sakte)
  if (settings.logoUrl) {
    document.body.dataset.logo = settings.logoUrl
  } else {
    delete document.body.dataset.logo
  }
}

function MyApp({ Component, pageProps }) {

  useEffect(() => {
    // 1️⃣ Initial load – backend se settings leke apply
    fetch('/api/admin/sections')
      .then(res => res.json())
      .then(data => applyVars(data))
      .catch(console.error)

    // 2️⃣ Real-time updates (SSE)
    const es = new EventSource('/api/admin/stream')

    es.addEventListener('settings', (e) => {
      try {
        const updatedSettings = JSON.parse(e.data)
        applyVars(updatedSettings)
      } catch (err) {
        console.error('SSE parse error', err)
      }
    })

    es.onerror = () => {
      // auto reconnect hota rahega
      // console.log('SSE reconnecting...')
    }

    return () => es.close()
  }, [])

  return (
    <>
      <Header />

      <main className="min-h-[60vh]">
        <Component {...pageProps} />
      </main>

      <Footer />
    </>
  )
}

export default MyApp
