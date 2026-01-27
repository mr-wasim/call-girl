// pages/signin.js
import { useState, useContext } from "react";
import Router from "next/router";
import { AuthContext } from "./_app"; // adjust path if needed

export default function SignIn() {
  const { refreshUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message || "Login failed");
        setLoading(false);
        return;
      }

      // refresh user state (reads cookie on server)
      await refreshUser();

      // go to homepage
      Router.push("/");
    } catch (err) {
      setErr("Something went wrong, try again");
      setLoading(false);
    }
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
                  required
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
                  required
                  className="w-full h-[44px] px-4 rounded-md bg-white text-black outline-none"
                />
              </div>

              <div className="text-xs text-white/70">You will stay logged in for up to <b>1 year</b> unless you log out.</div>

              <button
                disabled={loading}
                className={`mt-2 px-6 py-2.5 rounded-md font-semibold flex items-center gap-2
                  ${loading ? "bg-gray-400 text-black cursor-not-allowed" : "bg-[#f3bc1b] text-black hover:opacity-90"}`}
              >
                {loading ? "Signing in..." : <>Sign in <span className="text-lg">›</span></>}
              </button>

              <div className="mt-6 bg-[#3a3a3a] rounded-md divide-y divide-white/10 text-sm">
                <a href="/register" className="block px-4 py-3 text-[#f3bc1b]">Register</a>
                <a href="/forgot" className="block px-4 py-3 text-[#f3bc1b]">Forgot your password?</a>
                <a href="#" className="block px-4 py-3 text-[#f3bc1b]">Didn’t receive confirmation email?</a>
              </div>

              {err && <p className="text-red-400 mt-3">{err}</p>}
            </form>
          </div>

          {/* RIGHT – REGISTER OPTIONS */}
          <div>
            <h2 className="text-[28px] text-white font-semibold mb-2">Don’t have an account yet?</h2>
            <p className="text-[26px] text-white mb-8">Register now – it’s free!</p>

            <div className="grid grid-cols-2 gap-10 relative">
              <div className="text-center">
                <h3 className="text-[28px] text-white mb-4">User</h3>
                <div className="mx-auto mb-4 w-[130px] h-[130px] bg-[url('/register-graphic.png')] bg-no-repeat bg-[position:0_0]" />
                <p className="text-sm text-white mb-5">Keep updated on<br />activity in your area!</p>
                <a href="/UserRegister" className="inline-block bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold">Register</a>
              </div>

              <div className="absolute hidden lg:block left-1/2 top-[240px] w-px h-[280px] bg-white/20" />

              <div className="text-center">
                <h3 className="text-[28px] text-white mb-4">Advertiser</h3>
                <div className="inline-block w-[130px] h-[130px] bg-[url('/register-graphic.png')] bg-no-repeat bg-[position:0_-130px]" />
                <p className="text-sm text-white mb-5">Get listed<br />for free today!</p>
                <a href="/AdvertiserRegister" className="inline-block bg-[#f3bc1b] px-6 py-2.5 rounded-md text-black font-semibold">Register</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
