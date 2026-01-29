// components/TopSection.js
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/router"
import FilterBar from "./FilterBar"

export default function TopSection({ onFilter }) {
  const router = useRouter()
  const initialSlugFromUrl =
    typeof router?.query?.city === "string" ? router.query.city : null

  const [category, setCategory] = useState("female")
  const [city, setCity] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    async function loadCities() {
      try {
        const res = await fetch("/api/admin/cities")
        const json = await res.json()

        const list = Array.isArray(json?.cities)
          ? json.cities
          : Array.isArray(json?.data)
          ? json.data
          : []

        const normalized = list.map((c) => {
          const s = c._doc ? c._doc : c
          return {
            name: s.name?.trim(),
            slug:
              s.slug ||
              s.name?.toLowerCase().replace(/\s+/g, "-"),
            descriptionHtml: s.descriptionHtml || "",
          }
        })

        if (!mounted) return
        setCities(normalized)
        setLoading(false)

        if (initialSlugFromUrl) {
          const found = normalized.find(
            (ci) =>
              ci.slug === initialSlugFromUrl ||
              ci.name.toLowerCase() === initialSlugFromUrl.toLowerCase()
          )
          if (found) setCity(found.name)
        }
      } catch (e) {
        if (!mounted) return
        setError("Failed to load locations")
        setLoading(false)
      }
    }

    loadCities()
    return () => (mounted = false)
  }, [initialSlugFromUrl])

  const cityMap = useMemo(() => {
    const m = {}
    cities.forEach((c) => {
      m[c.name.toLowerCase()] = c
      if (c.slug) m[c.slug] = c
    })
    return m
  }, [cities])

  const key = city.trim().toLowerCase()
  const selectedCity = cityMap[key]
  const descriptionHtml = selectedCity?.descriptionHtml || ""

  function applyFilter() {
    onFilter?.({
      category,
      city,
      currency,
      minPrice,
      maxPrice,
    })
  }

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,#3a3a3a,#111)] p-4 md:p-6 rounded-md">
      {/* FILTER */}
      <FilterBar
        category={category}
        setCategory={setCategory}
        city={city}
        setCity={setCity}
        currency={currency}
        setCurrency={setCurrency}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        cities={cities}
        onSearch={applyFilter}
      />

      {/* TITLE */}
      <h1 className="text-[22px] md:text-[32px] text-white font-light mb-2">
        Escorts {city ? `in ${city}` : "near you"}
      </h1>

      {/* DESCRIPTION */}
      <div className="text-sm text-gray-300 leading-relaxed max-w-[900px]">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : descriptionHtml ? (
          <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
        ) : (
          <p>
            Browse verified escort profiles using filters above to find
            your best match.
          </p>
        )}
      </div>
    </div>
  )
}
