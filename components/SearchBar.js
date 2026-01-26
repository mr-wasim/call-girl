import { useRouter } from "next/router"
import { useState } from "react"

export default function SearchBar() {
  const router = useRouter()
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)

  function handleSearch() {
    if (!city.trim()) {
      alert("Please enter a city")
      return
    }

    const slug = city.toLowerCase().replace(/\s+/g, "-")
    setLoading(true)
    router.push(`/location/${slug}`)
  }

  function handleListNow() {
    const loggedIn =
      typeof window !== "undefined" &&
      localStorage.getItem("advertiser_token")

    router.push(loggedIn ? "/admin/dashboeard" : "/AdvertiserRegister")
  }

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

        {/* ---------------- LEFT CARD ---------------- */}
        <div className="relative rounded-xl bg-[#2b2b2b] p-5 sm:p-6 lg:p-7 overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-[url('/texture.png')] pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
              Find an escort
            </h3>

            {/* INPUT GROUP */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 mb-4">
              <div className="flex items-center bg-white px-4 rounded-md sm:rounded-l-md sm:rounded-r-none text-gray-600">
                📍
              </div>

              <input
                value={city}
                onChange={e => setCity(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="
                  flex-1 px-3 py-3
                  text-black text-sm sm:text-base
                  outline-none
                  rounded-md sm:rounded-none
                "
                placeholder="Enter your city"
              />

              <button
                onClick={handleSearch}
                disabled={loading}
                className="
                  bg-[#f3bc1b] text-black font-semibold
                  px-6 py-3
                  rounded-md sm:rounded-r-md sm:rounded-l-none
                  hover:bg-[#e6b318]
                  transition
                  disabled:opacity-60
                "
              >
                {loading ? "Searching…" : "Go ›"}
              </button>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Find verified escorts available in your city, updated daily for
              accuracy and safety.
            </p>
          </div>
        </div>

        {/* ---------------- RIGHT CARD ---------------- */}
        <div className="relative rounded-xl bg-[#2b2b2b] p-5 sm:p-6 lg:p-7 overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-[url('/texture.png')] pointer-events-none" />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-white">
                Individual escort or agency?
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
                A basic listing on the platform is <b>100% free</b>.  
                Your city will automatically appear once you list.
              </p>
            </div>

            <button
              onClick={handleListNow}
              className="
                w-full sm:w-auto
                bg-[#f3bc1b] text-black font-semibold
                px-6 py-3
                rounded-md
                hover:bg-[#e6b318]
                transition
                flex items-center justify-center gap-2
              "
            >
              List now <span className="text-lg">›</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
