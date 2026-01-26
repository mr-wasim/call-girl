import { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'

export default function AdminAllListings() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchListings()
  }, [])

  async function fetchListings() {
    try {
      const res = await fetch('/api/admin/listings')
      const data = await res.json()
      if (res.ok) setListings(data.listings || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = listings.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-zinc-900 text-black dark:text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">All Listings</h1>
              <p className="text-sm text-zinc-500">Manage, edit or delete listings</p>
            </div>

            <input
              placeholder="Search by name or city"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-pro max-w-sm"
            />
          </header>

          {/* TABLE */}
          <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-100 dark:bg-zinc-700 text-left">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">City</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-zinc-500">Loading...</td>
                  </tr>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-zinc-500">No listings found</td>
                  </tr>
                )}

                {filtered.map(item => (
                  <tr key={item._id} className="border-t border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700">
                    <td className="px-4 py-3">
                      <img
                        src={item.profileImages?.[0] || '/placeholder.png'}
                        alt=""
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{item.name}</td>
                    <td className="px-4 py-3">{item.city}</td>
                    <td className="px-4 py-3">₹{item.price || '--'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${item.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="px-3 py-1 text-xs rounded bg-blue-500 text-white">Edit</button>
                      <button className="px-3 py-1 text-xs rounded bg-red-500 text-white">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
