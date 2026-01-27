// pages/forgot.js
import { useState } from "react";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handle(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) setMsg("If that email exists, a reset link has been sent.");
    else setErr(data.message || "Error");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handle} className="p-6 bg-white rounded shadow w-full max-w-md">
        <h2 className="mb-4">Forgot password</h2>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border mb-3"/>
        <button className="px-4 py-2 bg-yellow-400">Send reset link</button>
        {msg && <p className="text-green-600 mt-3">{msg}</p>}
        {err && <p className="text-red-600 mt-3">{err}</p>}
      </form>
    </div>
  );
}
