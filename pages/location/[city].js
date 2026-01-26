import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Link from "next/link"
import FilterBar from "../../components/TopSection"
import ListingSection from "../../components/Listings"

export default function CityPage() {
  const router = useRouter()
  const { city } = router.query

  const [listings, setListings] = useState([])
  const [status, setStatus] = useState("loading")

  useEffect(() => {
    if (!city) return

    fetch(`/api/location-listings?city=${city}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setListings(json.data)
          setStatus("data")
        } else {
          setStatus("coming")
        }
      })
      .catch(() => setStatus("coming"))
  }, [city])

  /* ---------------- LOADING ---------------- */
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading…
      </div>
    )
  }

  /* ---------------- COMING SOON ---------------- */
  if (status === "coming") {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
        <div className="bg-[#1a1a1a] p-8 rounded text-center max-w-md w-full">
          <h1 className="text-3xl text-yellow-400 font-bold mb-3">
            Coming Soon 🚧
          </h1>
          <p className="text-gray-300 mb-6 capitalize">
            Escorts in {city.replace("-", " ")} will be available soon.
          </p>
          <Link
            href="/"
            className="inline-block bg-yellow-400 text-black px-6 py-2 rounded font-semibold"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  /* ---------------- DATA FOUND (HOME-LIKE DESIGN) ---------------- */
  return (
    <div className="container-w px-4 py-6">

      {/* SAME FILTER BAR AS HOME */}
      <FilterBar />

      {/* CITY TITLE */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 capitalize">
          Escorts in {city.replace("-", " ")}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Showing {listings.length} verified listings
        </p>
      </div>

      {/* SAME LISTING SECTION STYLE */}
      <ListingSection data={listings} />

    </div>
  )
}
