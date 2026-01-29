// pages/location/[city].js
import Link from "next/link"
import FilterBar from "../../components/TopSection"
import ListingSection from "../../components/Listings"

export default function CityPage({ listings = [], city = "", status = "coming" }) {
  /* ---------------- COMING SOON ---------------- */
  if (status === "coming") {
    return (
      <div className="min-h-screen text-white flex items-center justify-center px-4">
        <div className=" p-8 rounded text-center max-w-md w-full">
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

  /* ---------------- DATA FOUND ---------------- */
  return (
    <div className=" w-[98%] px-4 py-6 m-auto">
      {/* SAME FILTER BAR AS HOME */}
      <FilterBar />

      {/* CITY TITLE */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-yellow-400 capitalize">
          Escorts in {city.replace("-", " ")}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Showing {Array.isArray(listings) ? listings.length : 0} verified listings
        </p>
      </div>

      {/* LISTING SECTION */}
      <ListingSection data={listings} enablePagination={false} />
    </div>
  )
}

/* ================= SERVER SIDE ================= */
export async function getServerSideProps(context) {
  const { city } = context.params

  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `http://${context.req.headers.host}`

    const res = await fetch(`${baseUrl}/api/location-listings?city=${encodeURIComponent(city)}`)
    const json = await res.json()

    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) {
      return {
        props: {
          listings: [],
          city,
          status: "coming",
        },
      }
    }

    return {
      props: {
        listings: json.data,
        city,
        status: "data",
      },
    }
  } catch (err) {
    console.error("City page SSR error:", err)
    return {
      props: {
        listings: [],
        city,
        status: "coming",
      },
    }
  }
}
