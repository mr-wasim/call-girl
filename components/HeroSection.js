import Link from "next/link"
import { useEffect, useState } from "react"

export function cityToSlug(city = "") {
  return city.toLowerCase().trim().replace(/\s+/g, "-")
}

export default function LocationBanner() {
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)

  // 🔥 FETCH ADMIN CITIES (CLIENT SIDE)
  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch("/api/admin/cities")
        const data = await res.json()

        if (res.ok && data?.ok && Array.isArray(data.cities)) {
          const normalized = data.cities.map(c => {
            const city = c._doc ? c._doc : c
            return {
              name: city.name,
              slug: city.slug || city.name.toLowerCase().replace(/\s+/g, "-"),
            }
          })
          setCities(normalized)
        } else {
          setCities([])
        }
      } catch (err) {
        console.error("Failed to load cities", err)
        setCities([])
      } finally {
        setLoading(false)
      }
    }

    loadCities()
  }, [])

  const heroCity = cities.length ? cities[0] : null

  return (
    <section className="px-4 py-10">
      <div
        className="
          relative
          max-w-[90%]
          mx-auto
          rounded-xl
          overflow-hidden
          max-sm:max-w-full
        "
        style={{
          backgroundImage: "url('/images/location-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-[#f3bc1b]/95"></div>

        <div className="relative z-10 p-6 md:p-8">
          {/* TOP ROW */}
          <div className="flex items-center justify-between gap-4 max-sm:flex-nowrap">
            <h2 className="text-[18px] md:text-[22px] font-extrabold text-black">
              {heroCity
                ? `See the latest escort listings in ${heroCity.name} →`
                : "See the latest escort listings →"}
            </h2>

            {heroCity && (
              <Link
                href={`/location/${heroCity.slug}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  bg-black
                  text-white
                  text-sm
                  font-semibold
                  px-5
                  py-2
                  rounded-md
                  max-sm:shrink-0
                "
              >
                Escorts in {heroCity.name}
              </Link>
            )}
          </div>

          <div className="my-5 h-[1px] bg-black/20"></div>

          <p className="text-sm font-medium text-black mb-3">
            Interested in other popular locations?
          </p>

          {/* CITIES */}
          <div className="flex flex-wrap gap-2 w-[80%] max-sm:w-full">
            {loading && (
              <div className="text-sm text-black/70">
                Loading locations...
              </div>
            )}

            {!loading && !cities.length && (
              <div className="text-sm text-black/70">
                No locations added yet.
              </div>
            )}

            {!loading &&
              cities.map(city => (
                <Link
                  key={city.slug}
                  href={`/location/${city.slug}`}
                  className="
                    bg-white
                    text-black
                    text-xs
                    font-semibold
                    px-5
                    py-[7px]
                    rounded-md
                    hover:bg-black
                    hover:text-white
                    transition
                    max-sm:px-5
                    max-sm:py-[7px]
                  "
                >
                  {city.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
