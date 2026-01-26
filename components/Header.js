import Link from "next/link"
import { Globe } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-black w-full">
      <div className="max-w-[1300px] mx-auto px-4 py-3 flex items-center justify-between">

        {/* LEFT LOGO */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Massage Republic"
            className="h-9 w-auto object-contain"
          />
          <span className="text-[#d4a017] text-lg font-semibold tracking-wide">
            Massage Republic
          </span>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3">

          {/* Language */}
          <button className="flex items-center gap-1 bg-[#2a2a2a] text-white text-sm px-3 py-1.5 rounded">
            EN
          </button>

          {/* Globe */}
          <button className="text-white">
            <Globe size={18} />
          </button>

          {/* Sign In */}
          <Link
            href="/signin"
            className="border border-white text-white text-sm px-4 py-1.5 rounded hover:bg-white hover:text-black transition"
          >
            Sign in
          </Link>

        </div>
      </div>
    </header>
  )
}
