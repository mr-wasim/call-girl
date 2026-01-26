import Link from "next/link"

const CITIES = [
  "Abu Dhabi","Al Manama","Bangalore","Bangkok","Chennai","Doha",
  "Dubai","Hyderabad","Manila","Mumbai","Muscat","Nairobi",
  "Delhi","Pune","Riyadh"
]

export function cityToSlug(city = "") {
  return city.toLowerCase().trim().replace(/\s+/g, "-")
}

export default function LocationBanner() {
  return (
    <section className="px-4 py-10">
      <div
        className="
          relative
          max-w-[90%]
          mx-auto
          rounded-xl
          overflow-hidden

          /* MOBILE FIX */
          max-sm:max-w-full
        "
        style={{
          backgroundImage: "url('/images/location-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-[#f3bc1b]/95"></div>

        <div className="relative z-10 p-6 md:p-8">
          
          {/* TOP ROW */}
          <div
            className="
              flex
              items-center
              justify-between
              gap-4

              /* MOBILE: same row, no wrap */
              max-sm:flex-nowrap
            "
          >
            <h2 className="text-[18px] md:text-[22px] font-extrabold text-black">
              See the latest escort listings in Dubai →
            </h2>

            <Link
              href={`/location/${cityToSlug("Dubai")}`}
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

                /* MOBILE: prevent shrink */
                max-sm:shrink-0
              "
            >
              Escorts in Dubai
            </Link>
          </div>

          <div className="my-5 h-[1px] bg-black/20"></div>

          <p className="text-sm font-medium text-black mb-3">
            Interested in other popular locations?
          </p>

          {/* CITIES */}
          <div
            className="
              flex
              flex-wrap
              gap-2
              w-[80%]

              /* MOBILE: full width like image */
              max-sm:w-full
            "
          >
            {CITIES.map(city => (
              <Link
                key={city}
                href={`/location/${cityToSlug(city)}`}
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

                  /* MOBILE: size lock */
                  max-sm:px-5
                  max-sm:py-[7px]
                "
              >
                {city}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
