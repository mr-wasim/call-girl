import { useState } from "react"
import Router from "next/router"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")

  async function submit(e) {
    e.preventDefault()
    setErr("")
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (res.ok) Router.push("/")
    else setErr(data?.message || "Login failed")
  }

  return (
    <div className="relative min-h-screen">

      {/* TOP BAR */}
      <div className="bg-[#1f1f1f] shadow-md">
        <div className="container-w px-6 py-3 flex items-center justify-between text-sm">
          <a href="/" className="text-[#f3bc1b] font-medium">‹ Back</a>
          <span className="text-white font-semibold">Sign in</span>
          <span />
        </div>
      </div>

      {/* MAIN */}
      <div className="container-w px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* LEFT – SIGN IN FORM */}
          <div>
            <h1 className="text-[36px] font-semibold text-white mb-6">Sign in</h1>

            <form onSubmit={submit} className="max-w-[520px] space-y-4">

              <div>
                <label className="block text-sm mb-1 text-white">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full h-[44px] px-4 rounded-md bg-white text-black outline-none"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-[44px] px-4 rounded-md bg-white text-black outline-none"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-white">
                <input type="checkbox" />
                Remember me
              </div>

              <button className="mt-2 bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold flex items-center gap-2">
                Sign in <span className="text-lg">›</span>
              </button>

              {/* LINKS BOX */}
              <div className="mt-6 bg-[#3a3a3a] rounded-md divide-y divide-white/10 text-sm">
                <a href="/register" className="block px-4 py-3 text-[#f3bc1b]">
                  Register
                </a>
                <a href="#" className="block px-4 py-3 text-[#f3bc1b]">
                  Forgot your password?
                </a>
                <a href="#" className="block px-4 py-3 text-[#f3bc1b]">
                  Didn’t receive confirmation email?
                </a>
              </div>

              {err && <p className="text-red-400 mt-3">{err}</p>}
            </form>
          </div>

          {/* RIGHT – REGISTER OPTIONS */}
          <div>
            <h2 className="text-[28px] text-white font-semibold mb-2">
              Don’t have an account yet?
            </h2>
            <p className="text-[26px] text-white mb-8">
              Register now – it’s free!
            </p>

            <div className="grid grid-cols-2 gap-10">

              {/* USER */}
              <div className="text-center">
                <h3 className="text-[28px] text-white mb-4">User</h3>

                {/* SPRITE ICON */}
                <div
                  className="
      mx-auto mb-4
      w-[130px] h-[130px]
      bg-[url('/register-graphic.png')]
      bg-no-repeat
     
      bg-[position:0_0]
    "
                />

                <p className="text-sm text-white mb-5">
                  Keep updated on<br />activity in your area!
                </p>

                <a
                  href="/UserRegister"
                  className="inline-block bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold"
                >
                  Register
                </a>
              </div>


              {/* DIVIDER */}
              <div className="absolute hidden lg:block left-1/2 top-[240px] w-px h-[280px] bg-white/20" />

              {/* ADVERTISER */}
             <div className="text-center">
  <h3 className="text-[28px] text-white mb-4">Advertiser</h3>

  {/* SPRITE ICON */}
 <div
  className="
    inline-block
    w-[130px] h-[130px]
    bg-[url('/register-graphic.png')]
    bg-no-repeat
    bg-[position:0_-130px]
  "
/>

  <p className="text-sm text-white mb-5">
    Get listed<br />for free today!
  </p>

  <a
    href="/AdvertiserRegister"
    className="inline-block bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold"
  >
    Register
  </a>
</div>


            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
