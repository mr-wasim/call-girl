export default function SearchBar() {
  return (
    <div className="px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT BOX */}
        <div className="relative rounded-lg bg-[#2b2b2b] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_25px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* subtle grain */}
          <div className="absolute inset-0 opacity-20 bg-[url('/texture.png')] pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-[26px] font-semibold mb-4 text-white">
              Find an escort
            </h3>

            {/* INPUT */}
            <div className="flex mb-4">
              <div className="flex items-center bg-white px-4 rounded-l-md text-gray-500">
                📍
              </div>
              <input
                className="flex-1 px-3 py-3 text-[15px] text-black outline-none"
                placeholder="Your City"
              />
              <button className="bg-[#f3bc1b] px-6 rounded-r-md text-black font-semibold flex items-center gap-1">
                Go <span className="text-lg">›</span>
              </button>
            </div>

            {/* TEXT */}
            <p className="text-[13px] leading-relaxed text-gray-300">
              Our goal is to help you find the right escort for you, right now!
              Massage Republic provides listings of providers of massage and
              other services. Not looking for a female escort? Click here for{" "}
              <span className="text-[#f3bc1b] underline cursor-pointer">
                male escorts
              </span>{" "}
              or{" "}
              <span className="text-[#f3bc1b] underline cursor-pointer">
                shemale escorts
              </span>.
            </p>
          </div>
        </div>

        {/* RIGHT BOX */}
        <div className="relative rounded-lg bg-[#2b2b2b] px-6 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_25px_rgba(0,0,0,0.6)] overflow-hidden">

          {/* grain */}
          <div className="absolute inset-0 opacity-20 bg-[url('/texture.png')] pointer-events-none" />

          <div className="relative z-10">
            <h3 className="text-[26px] font-semibold mb-3 text-white">
              Individual escort or agency?
            </h3>

            <p className="text-[13px] leading-relaxed text-gray-300 mb-5">
              A basic listing on the website is <b>free!</b> Don’t worry if you
              don’t see your city on the left or below – it will appear when
              you list!
            </p>

            <button className="bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold flex items-center gap-1">
              List now <span className="text-lg">›</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
