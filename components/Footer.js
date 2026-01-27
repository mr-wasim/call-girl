// components/Footer.js
import Link from "next/link"
import { useContext } from "react"
import { SettingsContext } from "../pages/_app"

export default function Footer() {
  const ctx = useContext(SettingsContext)
  const accent = "var(--accent-color, #f3bc1b)"

  return (
    <footer className="relative" style={{ background: "var(--footer-bg, #1f1f1f)", color: "var(--footer-text, #d1d5db)", }}>
      <div className="absolute inset-0 opacity-25 bg-[url('/texture.png')] pointer-events-none" />

      <div className="relative z-10 container-w px-6 py-8">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] mb-6">
          <Link href="/Forums" className="hover:underline" style={{ color: accent }}>Forums</Link>
          <Link href="/About" className="hover:underline" style={{ color: accent }}>About</Link>
          <Link href="/Blog" className="hover:underline" style={{ color: accent }}>Blog</Link>
          <Link href="/HelpforAdvertisers" className="hover:underline" style={{ color: accent }}>Help for Advertisers</Link>
          <Link href="/guide" className="hover:underline" style={{ color: accent }}>Guide to seeing an escort</Link>

          <span className="flex items-center gap-2 text-red-500 font-semibold">
            🖐 Stop Human Trafficking
          </span>
        </div>

        <p className="text-[12.5px] leading-relaxed mb-5 max-w-[1100px]" style={{ color: "var(--footer-text, #d1d5db)" }}>
          This website only allows adult individuals to advertise their time and companionship to other adult individuals.
          We do not provide a booking service nor arrange meetings. Any price indicated relates to time only and nothing else.
          Any service offered or whatever else that may occur is the choice of consenting adults and a private matter between them.
          In some countries, individuals do not legally have the choice to decide this; it is your responsibility to comply with local laws.
        </p>

        <div className="text-[12.5px]" style={{ color: "var(--footer-muted, #9ca3af)" }}>
          © {new Date().getFullYear()} Massage Republic&nbsp;
          <Link href="/terms" className="hover:underline" style={{ color: accent }}>Terms of Use</Link>
          &nbsp;|&nbsp;
          <Link href="/privacy" className="hover:underline" style={{ color: accent }}>Privacy Policy</Link>

          &nbsp;|&nbsp;
          <Link href="/HelpforAdvertisers" className="hover:underline" style={{ color: accent }}>Contact Us</Link>
        </div>
      </div>
    </footer>
  )
}
