import { useState } from "react"
import Router from "next/router"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [err, setErr] = useState("")

  async function submit(e) {
    e.preventDefault()
    setErr("")
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    })
    const data = await res.json()
    if (res.ok) Router.push("/signin")
    else setErr(data?.message || "Registration failed")
  }

  return (
    <div className="min-h-screen">

      {/* TOP BAR */}
      <div className="bg-[#1f1f1f] shadow-md">
        <div className="container-w px-6 py-3 flex items-center justify-between text-sm">
          <a href="/" className="text-[#f3bc1b] font-medium">‹ Escorts</a>
          <span className="text-white font-semibold">Register</span>
          <span />
        </div>
      </div>

      {/* MAIN */}
      <div className="container-w px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* LEFT FORM */}
          <div>
            <h1 className="text-[36px] font-semibold text-white mb-6">
              Register now, it’s free!
            </h1>

            <form onSubmit={submit} className="max-w-[520px]">

              {/* INPUTS BOX */}
              <div className="rounded-md overflow-hidden mb-4">
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="User name"
                  className="w-full h-[46px] px-4 border-b border-gray-300 text-black outline-none"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full h-[46px] px-4 border-b border-gray-300 text-black outline-none"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-[46px] px-4 text-black outline-none"
                />
              </div>

              {/* TERMS */}
              <label className="flex items-center gap-2 text-sm text-white mb-6">
                <input type="checkbox" defaultChecked />
                <span>
                  I accept the{" "}
                  <span className="text-[#f3bc1b] underline">
                    Terms and Conditions
                  </span>{" "}
                  of use
                </span>
              </label>

              {/* REGISTER BUTTON */}
              <button className="bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold flex items-center gap-2">
                Register now <span className="text-lg">›</span>
              </button>

              {/* LINKS BOX */}
              <div className="mt-6 bg-[#3a3a3a] rounded-md divide-y divide-white/10 text-sm max-w-[520px]">
                <a href="/signin" className="block px-4 py-3 text-[#f3bc1b]">
                  Sign in
                </a>
                <a href="#" className="block px-4 py-3 text-[#f3bc1b]">
                  Forgot your password?
                </a>
                <a href="#" className="block px-4 py-3 text-[#f3bc1b]">
                  Didn’t receive confirmation email?
                </a>
              </div>

              {err && <p className="text-red-400 mt-4">{err}</p>}
            </form>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <h2 className="text-[32px] text-white font-semibold mb-8">
              We know you want to!
            </h2>

          <div
  className="
    w-[460px]
    h-[400px]
    bg-[url('/register-graphic.png')]
    bg-no-repeat
    bg-[position:-180px_0]
  "
/>

          </div>

        </div>
      </div>
    </div>
  )
}
