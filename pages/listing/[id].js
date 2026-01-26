import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ListingDetailPage() {
  const router = useRouter()
  const { id } = router.query

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // image modal
  const [openImg, setOpenImg] = useState(null)

  // tabs
  const [tab, setTab] = useState('reviews')

  useEffect(() => {
    if (!id) return

    setLoading(true)
    fetch(`/api/listings/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.message || 'Profile not found')
        }
      })
      .catch(() => setError('Fetch error'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="px-6 py-12 text-white">Loading...</div>
  if (error || !data) return <div className="px-6 py-12 text-white">Profile not found</div>

  const images = [...(data.profileImages || []), ...(data.variantImages || [])]

  return (
    <div className="bg-[#2b2b2b] text-[#d1d1d1] min-h-screen">

      {/* TOP BAR */}
      <div className="bg-[#1f1f1f] border-b border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between text-sm">
          <Link href="/" className="text-yellow-400">← Female escorts in {data.city}</Link>
          <span className="text-gray-300">{data.name}</span>
          <span className="text-yellow-400">Next escort →</span>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="bg-[#262626] border-b border-[#3a3a3a]">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-4 text-sm">
          <a href={`tel:${data.contact}`} className="hover:text-yellow-400">📞 Phone</a>
          <a href={`https://wa.me/${onlyDigits(data.contact)}`} target="_blank" className="hover:text-yellow-400">💬 Message</a>
          <button className="hover:text-yellow-400">❓ Ask a question</button>
          <button className="hover:text-yellow-400">⭐ Add a review</button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* IMAGES */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setOpenImg(img)}
              className="relative focus:outline-none"
            >
              <img src={img} className="w-full h-[220px] sm:h-[260px] object-cover rounded" />
              <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs rounded">✔</span>
            </button>
          ))}
        </div>

        {/* DETAILS */}
        <div className="lg:col-span-7 space-y-6">

          <div className="text-sm space-y-2">
            <p className="text-yellow-400 font-semibold">
              contact {data.contact} for Escorts service in {data.city}
            </p>

            <div dangerouslySetInnerHTML={{ __html: data.description }} />

            <p className="italic text-gray-400">
              No time pass • No video call • Genuine service only
            </p>
          </div>

          {/* PRICE */}
          <div className="border border-[#3a3a3a] p-4">
            <p className="text-yellow-400 text-sm">Per hour from</p>
            <p className="text-2xl text-white mt-1">₹{data.price || '—'}</p>
          </div>

          {/* INFO */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Info label="Age" value={data.age || '—'} />
            <Info label="City" value={data.city} />
            <Info label="Nationality" value="Indian" />
            <Info label="Gender" value="Female" />
          </div>

          {/* TABS */}
          <div className="border-t border-[#3a3a3a] pt-4">
            <div className="flex gap-6 text-sm mb-4">
              <button
                onClick={() => setTab('reviews')}
                className={tab === 'reviews' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'hover:text-yellow-400'}
              >
                Reviews
              </button>
              <button
                onClick={() => setTab('questions')}
                className={tab === 'questions' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'hover:text-yellow-400'}
              >
                Questions
              </button>
            </div>

            {tab === 'reviews' && (
              <div className="text-sm text-gray-300">
                ⭐ No reviews yet. Be the first to review this profile.
              </div>
            )}

            {tab === 'questions' && (
              <div className="text-sm text-gray-300">
                ❓ No questions yet. Ask something about this profile.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* IMAGE MODAL */}
      {openImg && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <button
            onClick={() => setOpenImg(null)}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            ×
          </button>
          <img src={openImg} className="max-h-[90vh] max-w-[90vw] object-contain" />
        </div>
      )}
    </div>
  )
}

/* HELPERS */
function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-[#3a3a3a] pb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  )
}

function onlyDigits(v = '') {
  return v.replace(/\D/g, '')
}
