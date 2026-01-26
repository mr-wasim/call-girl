import { useRouter } from 'next/router'

export default function ProfilePage({ data }) {
  const router = useRouter()

  if (!data) {
    return (
      <div className="container-w px-6 py-12 text-white">
        Profile not found
      </div>
    )
  }

  return (
    <div className="bg-[#2b2b2b] text-[#d1d1d1] min-h-screen">

      {/* TOP BAR */}
      <div className="bg-[#1f1f1f] border-b border-[#3a3a3a]">
        <div className="container-w px-6 py-2 flex justify-between text-sm">
          <span className="text-yellow-400 cursor-pointer">
            ← Female escorts in Bangalore
          </span>
          <span className="text-gray-300">
            {data.title}
          </span>
          <span className="text-yellow-400 cursor-pointer">
            Next escort →
          </span>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="bg-[#262626] border-b border-[#3a3a3a]">
        <div className="container-w px-6 py-2 flex gap-4 text-sm">
          <button className="hover:text-yellow-400">📞 Phone</button>
          <button className="hover:text-yellow-400">💬 Message</button>
          <button className="hover:text-yellow-400">🌐 Website</button>
          <button className="hover:text-yellow-400">❓ Ask a question</button>
          <button className="hover:text-yellow-400">⭐ Add a review</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="container-w px-6 py-8 grid grid-cols-12 gap-8">

        {/* LEFT IMAGE GRID */}
        <div className="col-span-5 grid grid-cols-2 gap-4">
          {data.images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                className="w-full h-[260px] object-cover rounded"
              />
              <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 text-xs rounded">
                ✔
              </span>
            </div>
          ))}
        </div>

        {/* RIGHT DETAILS */}
        <div className="col-span-7">

          {/* DESCRIPTION */}
          <div className="space-y-3 text-sm leading-relaxed">
            <p className="text-yellow-400 font-semibold">
              contact {data.phone} for Escorts service in Bangalore
            </p>

            <p>{data.description}</p>

            <p className="text-gray-300">
              Charges Rs {data.priceShort} / {data.priceLong} for short time (up to 2 hours)
              <br />
              and full night {data.priceNight}
            </p>

            <p className="italic text-gray-400">
              No time pass no video call Genuine service only
            </p>
          </div>

          {/* PRICE BOX */}
          <div className="mt-6 border border-[#3a3a3a] p-4 text-sm">
            <p className="text-yellow-400 font-semibold">
              Per hour from
            </p>
            <p className="text-xl text-white mt-1">
              ₹{data.hourPrice}
            </p>
          </div>

          {/* DETAILS TABLE */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-2 mt-6 text-sm">
            <Info label="Languages" value="Hindi (Fluent), English (Basic)" />
            <Info label="Height" value="154 cm / 5'1" />
            <Info label="Orientation" value="Heterosexual" />
            <Info label="Bust" value="Medium" />
            <Info label="Ethnicity" value="Asian" />
            <Info label="Shaved" value="Yes" />
            <Info label="Age" value="19" />
            <Info label="Hair color" value="Black" />
            <Info label="Nationality" value="Indian" />
            <Info label="Gender" value="Female" />
            <Info label="City" value="Bangalore, India" />
          </div>

          {/* TABS */}
          <div className="mt-10 border-t border-[#3a3a3a] pt-4 flex gap-6 text-sm">
            <span className="text-yellow-400 border-b-2 border-yellow-400 pb-1">
              Reviews
            </span>
            <span className="cursor-pointer hover:text-yellow-400">
              Questions
            </span>
            <span className="cursor-pointer hover:text-yellow-400">
              X (Twitter)
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}

/* SMALL HELPER */
function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b border-[#3a3a3a] pb-1">
      <span className="text-gray-400">{label}</span>
      <span className="text-gray-200">{value}</span>
    </div>
  )
}

/* SSR */
export async function getServerSideProps() {
  // dummy backend data – Mongo se replace hoga
  return {
    props: {
      data: {
        title: '10k for 2 hrs Full Night 20K Hi-Fi only',
        phone: '6364504805',
        hourPrice: '8,000',
        priceShort: '8k–12k',
        priceLong: '15k–18k',
        priceNight: '20k',
        images: [
          '/img1.jpg',
          '/img2.jpg',
          '/img3.jpg',
          '/img4.jpg',
          '/img5.jpg'
        ],
        description:
          'Welcome to Ajay Escorts. We are the most trusted escort service provider in Bangalore...'
      }
    }
  }
}
