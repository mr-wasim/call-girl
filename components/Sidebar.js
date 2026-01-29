// components/Sidebar.js
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Sidebar({ className }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const nav = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/create', label: 'Create Listing' },
    { href: '/admin/allListing', label: 'All Listings' },
    { href: '/admin/createCity', label: 'Create City' },
    { href: '/admin/settings', label: 'Settings' },
  ]

  function isActive(href) {
    return router.pathname === href
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-black text-white">
        <div className="text-yellow-400 font-bold">Admin Panel</div>
        <button
          onClick={() => setOpen(v => !v)}
          className="px-3 py-1 border rounded border-zinc-700"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${className || ''} bg-black text-white md:block`}>
        <div className="hidden md:block p-6 w-64">
          <h2 className="text-xl font-bold text-yellow-400 mb-6">
            Admin Panel
          </h2>

          <nav className="space-y-3">
            {nav.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`block px-3 py-2 rounded transition
                  ${isActive(n.href)
                    ? 'bg-zinc-800 text-yellow-400'
                    : 'hover:bg-zinc-800'
                  }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 border-t border-zinc-800 pt-4">
            <p className="text-xs text-gray-300">Logged in as admin</p>
            <p className="text-sm text-yellow-400">
              Wasim ansari
            </p>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden bg-zinc-900 px-4 py-4">
            <nav className="space-y-2">
              {nav.map(n => (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded text-white
                    ${isActive(n.href)
                      ? 'bg-zinc-800 text-yellow-400'
                      : 'hover:bg-zinc-800'
                    }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </aside>
    </>
  )
}
