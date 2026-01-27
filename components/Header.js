// components/Header.js
import Link from "next/link"
import { Globe } from "lucide-react"
import { useContext } from "react"
import { SettingsContext } from "../pages/_app"

export default function Header() {
  const ctx = useContext(SettingsContext)
  // use CSS variables, fallback to original
  const headerStyle = {
    background: "var(--header-bg, #000)",
    color: "var(--header-text, #fff)",
  }
  const langBtnStyle = {
    background: "var(--muted-btn-bg, rgba(255,255,255,0.06))",
    color: "var(--header-text, #fff)",
  }
  const iconBtnStyle = { color: "var(--header-text, #fff)" }
  const signInStyle = { borderColor: "var(--header-text, #fff)", color: "var(--header-text, #fff)" }

  return (
    <header style={headerStyle} className="w-full sticky top-0 z-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" >
              {/* Next Link transforms into anchor itself, so no <a> inside */}
              <img
                src="/logo.png"
                alt="Massage Republic"
                className="h-8 sm:h-9 w-auto object-contain cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              style={langBtnStyle}
              className="flex items-center justify-center text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-md hover:opacity-90 transition"
              aria-label="Language"
            >
              EN
            </button>

            <button
  className="group p-2 rounded-md transition
             hover:bg-white"
  aria-label="Globe"
>
  <Globe
    size={18}
    className="text-white transition group-hover:text-black"
  />
</button>

           <Link
  href="/signin"
  className="group border text-xs sm:text-sm px-3 sm:px-4 py-1.5 rounded-md
             transition whitespace-nowrap
             text-white border-white
             hover:bg-white hover:text-black"
>
  Sign in
</Link>

          </div>
        </div>
      </div>
    </header>
  )
}
