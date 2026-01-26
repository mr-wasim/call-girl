import jwt from 'jsonwebtoken'
import cookie from 'cookie'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
  if(email === ADMIN_EMAIL && password === ADMIN_PASSWORD){
    const token = jwt.sign({ admin: true, email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
    res.setHeader('Set-Cookie', cookie.serialize('admin_token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7 }))
    return res.json({ ok: true })
  }
  return res.status(401).json({ message: 'Invalid admin credentials' })
}
