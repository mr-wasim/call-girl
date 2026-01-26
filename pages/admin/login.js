import { useState } from 'react'
import Router from 'next/router'

export default function AdminLogin(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  async function submit(e){
    e.preventDefault()
    setErr('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({email, password})
    })
    const data = await res.json()
    if(res.ok){
      Router.push('/admin/dashboard')
    } else {
      setErr(data?.message || 'Login failed')
    }
  }

  return (
    <div className="container-w px-6 py-12">
      <div className="max-w-md mx-auto bg-zinc-800 p-8 rounded">
        <h2 className="text-2xl mb-4">Admin Sign in</h2>
        <form onSubmit={submit} className="space-y-3">
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded text-black" />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-3 rounded text-black" />
          <button className="px-4 py-2 bg-brand text-black rounded">Sign in</button>
          {err && <p className="text-red-400">{err}</p>}
        </form>
      </div>
    </div>
  )
}
