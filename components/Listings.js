export default function Listings() {
  return (
    <div className="grid grid-cols-12 gap-6 mt-6">

      {/* MAIN LIST */}
      <div className="col-span-9">

        <div className="bg-gradient-to-r from-[#3b3316] to-[#5a4b1f] p-4 rounded-md flex gap-4">

          {/* IMAGES */}
          <div className="flex gap-2">
            <img
              src="/g1.jpg"
              className="w-[200px] h-[240px] object-cover border-2 border-[#f3bc1b]"
            />
            <div className="flex flex-col gap-2">
              {[1,2,3].map(i=>(
                <img key={i} src="/g2.jpg" className="w-[60px] h-[60px] object-cover border border-[#f3bc1b]" />
              ))}
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 text-white">
            <h2 className="text-[26px] mb-2 font-light">
              10k for 2 hrs Full Night 20K Hi-Fi only
              <span className="ml-2 text-sm bg-black/40 px-2 py-0.5 rounded">?</span>
            </h2>

            <p className="text-sm text-gray-200 leading-relaxed">
              contact <b>6364504805</b> for Escorts service in Bangalore.
              Welcome to Ajay Escorts – we are the most trusted escorts
              service provider in Bangalore. You can pay cash directly.
              Charges Rs 8k / 10k / 12k short time, full night 15k-18k-20k.
              No advance. Genuine service only...
            </p>

            <button className="mt-4 bg-[#f3bc1b] text-black px-4 py-2 rounded text-sm font-semibold">
              See more & contact
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT SIDEBAR */}
      <div className="col-span-3 bg-[#1c1c1c] rounded-md p-4">

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-yellow-400 text-lg">What's new?</h3>
          <button className="bg-[#f3bc1b] text-black px-3 py-1 rounded text-sm">
            Subscribe
          </button>
        </div>

        {[1,2,3].map(i=>(
          <div key={i} className="flex gap-2 mb-4 text-sm text-white">
            <img src="/g2.jpg" className="w-10 h-10 object-cover" />
            <p>
              New review for{" "}
              <span className="text-yellow-400">Lucy hot girl</span> in
              Banaswadi...
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}
