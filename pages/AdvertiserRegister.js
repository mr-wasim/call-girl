export default function AdvertiserRegister() {
  return (
    <div className="min-h-screen bg-[#2b2b2b] text-white">

      {/* TOP BAR */}
      <div className="h-[44px] bg-gradient-to-b from-[#3a3a3a] to-[#1f1f1f] border-b border-black">
        <div className="container-w h-full flex items-center justify-between text-sm">
          <span className="text-yellow-400 cursor-pointer">‹ Escorts</span>
          <span className="text-gray-200">
            Escort Advertising for Independents and Agencies
          </span>
          <span />
        </div>
      </div>

      {/* MAIN */}
      <div className="container-w grid grid-cols-12 gap-10 py-10">

        {/* LEFT – REGISTER FORM */}
        <div className="col-span-5">
          <h1 className="text-[28px] font-light mb-6">
            Register now, <span className="font-semibold">it's free!</span>
          </h1>

          {/* Email */}
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full h-[36px] rounded bg-white text-black px-3 mb-1" />
          <p className="text-xs text-gray-400 mb-4">
            Never displayed, never shared
          </p>

          {/* Password */}
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full h-[36px] rounded bg-white text-black px-3 mb-1"
          />
          <p className="text-xs text-gray-400 mb-4">
            Do not use the same password as on other sites!
          </p>

          {/* Display Name */}
          <label className="block text-sm mb-1">Display name</label>
          <input className="w-full h-[36px] rounded bg-white text-black px-3 mb-4" />
          <p className="text-xs text-gray-400 mb-4">
            Used on the forums
          </p>

          {/* RADIO */}
          <div className="flex gap-6 mb-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="radio" name="type" defaultChecked />
              Individual
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="type" />
              Escort agency
            </label>
          </div>

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm mb-6">
            <input type="checkbox" defaultChecked />
            <span>
              I accept the{" "}
              <span className="text-yellow-400 cursor-pointer">
                Terms and Conditions
              </span>{" "}
              of use
            </span>
          </label>

          {/* BUTTON */}
          <button className="bg-[#f3bc1b] text-black px-6 py-2 rounded font-semibold flex items-center gap-2">
            Register <span>›</span>
          </button>

          {/* HELP */}
          <div className="mt-6 text-sm">
            <p className="mb-1">Have questions?</p>
            <p className="text-yellow-400 cursor-pointer">
              See Help for Advertisers
            </p>
          </div>
        </div>

      {/* RIGHT – IMAGE ONLY */}
<div className="col-span-7 flex items-center justify-center">
  <img
    src="/dmo.jpg"
    alt="Preview"
    className="w-[1000px] h-[1000px"
  />
</div>

      </div>
    </div>
  )
}
