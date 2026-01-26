export default function TopSection() {
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,#3a3a3a,#111)] p-4 rounded-md">

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-6">
        <select className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]">
          <option>Female escorts</option>
        </select>

        <div className="flex items-center bg-[#2b2b2b] px-3 py-2 rounded border border-[#444] text-sm text-white">
          📍 Bangalore
        </div>

        <select className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]">
          <option>INR</option>
        </select>

        <select className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444]">
          <option>Price</option>
        </select>

        <input
          className="bg-[#2b2b2b] text-white text-sm px-3 py-2 rounded border border-[#444] w-40"
        />

        <button className="bg-[#3a3a3a] text-white px-3 py-2 rounded border border-[#555]">
          +
        </button>

        <button className="ml-2 bg-[#f3bc1b] text-black px-4 py-2 rounded font-semibold flex items-center gap-1">
          🔍 Search
        </button>
      </div>

      {/* TITLE */}
      <h1 className="text-[32px] text-white font-light mb-2">
        Escorts in Bangalore, Karnataka, India
      </h1>

      {/* DESCRIPTION */}
      <p className="text-sm text-gray-300 leading-relaxed max-w-[900px]">
        We have 2305 Bangalore escorts on Message Republic, 599 profiles have
        verified photos. The most popular services offered are:
        <span className="text-yellow-400">
          {" "}Oral sex - blowjob, French kissing, Massage, COB - Come On Body,
          Fingering, GFE, Deep throat, CIM - Come In Mouth
        </span>.
        Prices range from ₹1,007 to ₹824,026 (US$10 to US$9,000),
        the average cost advertised is ₹10,529 (US$114).
      </p>
    </div>
  )
}
