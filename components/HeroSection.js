import Link from "next/link"

export default function LocationBanner() {
  return (
    <section className="py-10 px-4">
      <div className="max-w-[1320px] mx-auto">
        {/* OUTER SHADOW FRAME */}
        <div className="rounded-2xl p-[10px]">
          
          {/* YELLOW CARD */}
          <div className="relative overflow-hidden rounded-xl bg-[#f3bc1b]">

            {/* GREY DARK OVERLAY SHADOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-black/0 z-[1]" />

            {/* SILHOUETTE IMAGE */}
            <div
              className="absolute inset-0 bg-no-repeat bg-right bg-contain opacity-35 z-[2]"
              style={{
                backgroundImage: "url('/silhouette.png')",
              }}
            />

            {/* CONTENT */}
            <div className="relative z-10 px-10 py-8">

              {/* TOP ROW */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <h2 className="text-[26px] md:text-[30px] font-extrabold text-black tracking-tight flex items-center gap-3">
                  See the latest escort listings in Dubai
                  <span className="text-[28px]">→</span>
                </h2>

                <Link
                  href="/dubai"
                  className="bg-black text-white px-7 py-3 rounded-md text-[15px] font-semibold shadow-md hover:bg-black/90 transition"
                >
                  Escorts in Dubai
                </Link>
              </div>

              {/* DIVIDER */}
              <div className="my-6 h-[1px] w-full bg-black/25" />

              {/* SUB TEXT */}
              <p className="text-black text-[15px] font-medium mb-4">
                Interested in other popular locations?
              </p>

              {/* LOCATION TAGS */}
              <div className="flex flex-wrap gap-3 max-w-[900px]">
                {[
                  "Abu Dhabi","Al Manama","Bangalore","Bangkok","Chennai","Doha",
                  "Dubai","Hyderabad","Manila","Mumbai","Muscat","Nairobi",
                  "New Delhi","Pune","Riyadh"
                ].map((city) => (
                  <Link
                    key={city}
                    href={`/${city.toLowerCase().replace(" ", "-")}`}
                    className="
                      bg-white text-black
                      px-3 py-[6px]
                      rounded-md
                      text-[13px]
                      font-semibold
                      shadow-[0_1px_2px_rgba(0,0,0,0.25)]
                      hover:bg-black hover:text-white
                      transition
                    "
                  >
                    {city}
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
