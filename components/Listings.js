import { useEffect, useState } from "react"
import Link from "next/link"

export default function Listings({
  data = null,          // 👈 city page se aayega
  enablePagination = true // 👈 home page ke liye
}) {
  const [listings, setListings] = useState(data || [])
  const [loading, setLoading] = useState(!data)
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState(null)

  // 🔥 FETCH ONLY WHEN DATA NOT PROVIDED
  useEffect(() => {
    if (data) {
      setListings(data)
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    setError(null)

    fetch(`/api/listings?page=${page}&limit=${limit}`)
      .then(res => res.json())
      .then(json => {
        if (!mounted) return
        if (json?.success) {
          setListings(json.data || [])
          setTotalPages(json.pagination?.totalPages || 1)
        } else {
          setError(json?.message || "Failed to load")
        }
      })
      .catch(err => {
        if (!mounted) return
        console.error(err)
        setError("Fetch error")
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => { mounted = false }
  }, [page, limit, data])

  if (loading) return <div className="text-white mt-10">Loading...</div>
  if (error) return <div className="text-red-400 mt-6">{error}</div>

  return (
    <div className="container mx-auto px-3 md:px-4">
      <div className="grid grid-cols-12 gap-6 mt-6">

        {/* MAIN LIST */}
        <div className="col-span-12 lg:col-span-9 space-y-6">

          {listings.map(listing => {
            const mainImage =
              listing.profileImages?.[0] ||
              listing.variantImages?.[0] ||
              "/placeholder.jpg"

            const thumbs = (
              listing.variantImages?.length
                ? listing.variantImages
                : listing.profileImages || []
            ).slice(0, 3)

            return (
              <div
                key={listing._id}
                className="
                  bg-gradient-to-r from-[#3b3316] to-[#5a4b1f]
                  p-4 rounded-md
                  flex flex-col sm:flex-row gap-4
                "
              >
                {/* IMAGE BLOCK */}
                <div className="flex gap-2 w-full sm:w-[320px] flex-shrink-0">
                  <div className="w-full sm:w-[200px] h-[220px] sm:h-[240px] overflow-hidden rounded border-2 border-[#f3bc1b]">
                    <img
                      src={mainImage}
                      alt={listing.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="hidden sm:flex flex-col gap-2">
                    {thumbs.length
                      ? thumbs.map((img, i) => (
                          <div
                            key={i}
                            className="w-[60px] h-[60px] overflow-hidden rounded border border-[#f3bc1b]"
                          >
                            <img
                              src={img}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))
                      : [0,1,2].map(i => (
                          <div
                            key={i}
                            className="w-[60px] h-[60px] bg-zinc-800 rounded border border-[#f3bc1b]"
                          />
                        ))}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 text-white">
                  <h2 className="text-[20px] sm:text-[24px] mb-2 font-light">
                    {listing.price || "Best Offer"}
                    <span className="ml-2 text-xs sm:text-sm bg-black/40 px-2 py-0.5 rounded">
                      {listing.city}
                    </span>
                  </h2>

                  <div
                    className="text-sm text-gray-200 leading-relaxed line-clamp-4"
                    dangerouslySetInnerHTML={{ __html: listing.description || "" }}
                  />

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/listing/${listing._id}`}
                      className="bg-[#f3bc1b] text-black px-4 py-2 rounded text-sm font-semibold"
                    >
                      See more & contact
                    </Link>

                    <span className="text-xs text-gray-300">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* PAGINATION (HOME ONLY) */}
          {enablePagination && !data && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-300">
                Page {page} of {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className={`px-3 py-1 rounded ${
                    page <= 1
                      ? "bg-zinc-700 text-zinc-400"
                      : "bg-[#f3bc1b] text-black"
                  }`}
                >
                  Prev
                </button>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className={`px-3 py-1 rounded ${
                    page >= totalPages
                      ? "bg-zinc-700 text-zinc-400"
                      : "bg-[#f3bc1b] text-black"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="col-span-12 lg:col-span-3 bg-[#1c1c1c] rounded-md p-4 h-fit">
          <h3 className="text-yellow-400 text-lg mb-4">What's new?</h3>

          {listings.slice(0, 3).map(item => (
            <div key={item._id} className="flex gap-2 mb-4 text-sm text-white">
              <img
                src={item.profileImages?.[0] || "/placeholder.jpg"}
                className="w-10 h-10 object-cover rounded"
              />
              <p>
                New listing in{" "}
                <span className="text-yellow-400">{item.city}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
