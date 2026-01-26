import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'

function StatCard({ title, value }) {
  return (
    <div className="bg-white dark:bg-zinc-800 p-5 rounded-lg shadow-sm border border-transparent">
      <p className="text-sm text-zinc-500 dark:text-zinc-300">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-zinc-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [listings, setListings] = useState([])

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    try {
      const res = await fetch('/api/listings')
      const data = await res.json()

      /**
       * 🛡️ ULTRA SAFE NORMALIZATION
       * supports:
       * - []
       * - { listings: [] }
       * - { data: [] }
       */
      const safeListings = Array.isArray(data)
        ? data
        : Array.isArray(data?.listings)
        ? data.listings
        : Array.isArray(data?.data)
        ? data.data
        : []

      setListings(safeListings)
    } catch (e) {
      console.error('fetch listings error', e)
      setListings([])
    }
  }

  // 🛡️ FINAL SAFETY NET
  const safeListings = Array.isArray(listings) ? listings : []

  const totalCount = safeListings.length
  const activeCount = safeListings.filter(l => l?.active !== false).length
  const draftCount = safeListings.filter(l => l?.active === false).length

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-[1200px] mx-auto">

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">
                Manage listings & site content
              </p>
            </div>

            <button
              type="button"
              className="px-4 py-2 rounded bg-yellow-400 text-black hover:opacity-95"
              onClick={() => {
                document.documentElement.classList.toggle('dark')
              }}
            >
              Toggle Theme
            </button>
          </div>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard title="Total Listings" value={totalCount} />
            <StatCard title="Active" value={activeCount} />
            <StatCard title="Drafts" value={draftCount} />
          </section>

          {/* Recent listings */}
          <section className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-transparent p-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white mb-3">
              Recent Listings
            </h2>

            {safeListings.length === 0 ? (
              <div className="h-28 flex items-center justify-center text-zinc-400">
                No recent listings
              </div>
            ) : (
              <div className="space-y-3">
                {safeListings
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map(item => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 p-3 rounded hover:bg-zinc-50 dark:hover:bg-zinc-700 transition"
                    >
                      <img
                        src={item?.profileImages?.[0] || '/placeholder.png'}
                        alt={item?.name || 'preview'}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-zinc-900 dark:text-white">
                              {item?.name || 'Untitled'}
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-300 mt-1">
                              {item?.city || ''}
                            </div>
                          </div>

                          <div className="text-sm text-zinc-500 dark:text-zinc-300">
                            {item?.price || ''}
                          </div>
                        </div>

                        {item?.description && (
                          <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  )
}
