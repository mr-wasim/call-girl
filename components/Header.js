import Link from "next/link"
import { Globe } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-black w-full sticky top-0 z-50">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* LEFT: LOGO */}
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.png"
              alt="Massage Republic"
              className="h-8 sm:h-9 w-auto object-contain"
            />
           
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Language */}
            <button
              className="
                flex items-center justify-center
                bg-[#2a2a2a]
                text-white
                text-xs sm:text-sm
                px-2.5 sm:px-3
                py-1.5
                rounded-md
                hover:bg-[#3a3a3a]
                transition
              "
            >
              EN
            </button>

            {/* Globe */}
            <button
              className="
                text-white
                p-2
                rounded-md
                hover:bg-white/10
                transition
              "
            >
              <Globe size={18} />
            </button>

            {/* Sign In */}
            <Link
              href="/signin"
              className="
                border border-white
                text-white
                text-xs sm:text-sm
                px-3 sm:px-4
                py-1.5
                rounded-md
                hover:bg-white
                hover:text-black
                transition
                whitespace-nowrap
              "
            >
              Sign in
            </Link>

          </div>
        </div>
      </div>
    </header>
  )
}
