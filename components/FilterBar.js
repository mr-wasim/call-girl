// components/FilterBar.js
export default function FilterBar({
  category,
  setCategory,
  city,
  setCity,
  currency,
  setCurrency,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  cities,
  onSearch,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      {/* CATEGORY */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]"
      >
        <option value="female">Female escorts</option>
        <option value="male">Male escorts</option>
        <option value="trans">Trans escorts</option>
      </select>

      {/* CITY */}
      <div className="w-[140px] md:w-[220px]">
        <input
          list="cities-list"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-full"
        />
        <datalist id="cities-list">
          {cities.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>
      </div>

      {/* CURRENCY */}
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]"
      >
        <option value="INR">INR</option>
        <option value="USD">USD</option>
        <option value="AED">AED</option>
      </select>

      {/* PRICE */}
      <input
        type="number"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        placeholder="Min ₹"
        className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-[90px]"
      />
      <input
        type="number"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        placeholder="Max ₹"
        className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-[90px]"
      />

      {/* SEARCH */}
      <button
        onClick={onSearch}
        className="ml-auto md:ml-0 bg-[#f3bc1b] text-black px-4 py-2 rounded font-semibold"
      >
        🔍 Search
      </button>
    </div>
  )
}
