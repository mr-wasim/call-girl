// components/Header.js
import Link from "next/link"
import { Globe } from "lucide-react"
import { useContext } from "react"
import { SettingsContext } from "../pages/_app"

export default function Header() {
  const ctx = useContext(SettingsContext)
  const settings = ctx?.settings || {}

  const headerStyle = {
    background: "var(--header-bg, #000)",
    color: "var(--header-text, #fff)",
  }

  const logoSrc = settings.logoPath || "/logo.png"

  return (
    <header style={headerStyle} className="w-full sticky top-0 z-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" >
              <img
                src={logoSrc}
                alt="Site logo"
                className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="flex items-center justify-center text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-md hover:opacity-90 transition" aria-label="Language">EN</button>
            <button className="p-2 rounded-md hover:bg-white/10 transition" aria-label="Globe"><Globe size={18} /></button>
            <Link href="/signin" className="border text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md hover:bg-white hover:text-black transition whitespace-nowrap">Sign in</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
