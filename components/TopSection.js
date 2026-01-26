import { useState } from "react"

export default function TopSection({ onFilter }) {
  const [category, setCategory] = useState("female")
  const [city, setCity] = useState("")
  const [currency, setCurrency] = useState("INR")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")

  function applyFilter() {
    onFilter?.({
      category,
      city: city.trim(),
      currency,
      minPrice,
      maxPrice
    })
  }

  return (
    <div className="bg-[radial-gradient(ellipse_at_top,#3a3a3a,#111)] p-4 md:p-6 rounded-md">

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-2 mb-6">

        {/* CATEGORY */}
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]"
        >
          <option value="female">Female escorts</option>
          <option value="male">Male escorts</option>
          <option value="trans">Trans escorts</option>
        </select>

        {/* CITY */}
        <input
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="City"
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-[140px] md:w-[180px]"
        />

        {/* CURRENCY */}
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
          <option value="AED">AED</option>
        </select>

        {/* MIN PRICE */}
        <input
          type="number"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          placeholder="Min ₹"
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-[90px]"
        />

        {/* MAX PRICE */}
        <input
          type="number"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          placeholder="Max ₹"
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-[90px]"
        />

        {/* SEARCH */}
        <button
          onClick={applyFilter}
          className="ml-auto md:ml-0 bg-[#f3bc1b] text-black px-4 py-2 rounded font-semibold flex items-center gap-1"
        >
          🔍 Search
        </button>
      </div>

      {/* TITLE */}
      <h1 className="text-[22px] md:text-[32px] text-white font-light mb-2">
        Escorts {city ? `in ${city}` : "near you"}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-300 leading-relaxed max-w-[900px]">
        Browse verified escort profiles based on your selected city and price
        range. Use filters above to narrow down results and find the best match
        for you.
      </p>
    </div>
  )
}
