// pages/reset.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function ResetPage() {
  const router = useRouter();
  const { token, email } = router.query || {};
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    if (!token || !email) return setErr("Missing token or email");
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword: password }),
    });
    const data = await res.json();
    if (res.ok) setMsg("Password reset success. You can now sign in.");
    else setErr(data.message || "Reset failed");
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-white rounded shadow max-w-md w-full">
        <h2 className="text-2xl mb-4">Reset password</h2>
        <form onSubmit={handleSubmit}>
          <input value={email||""} readOnly className="mb-3 w-full p-2 border" />
          <input type="password" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} className="mb-3 w-full p-2 border" />
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Reset</button>
        </form>
        {msg && <p className="text-green-600 mt-3">{msg}</p>}
        {err && <p className="text-red-600 mt-3">{err}</p>}
      </div>
    </div>
  );
}
