import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  const user = await users.findOne({ email })
  if(!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ userId: String(user._id), email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' })
  res.setHeader('Set-Cookie', cookie.serialize('token', token, { httpOnly: true, path: '/', maxAge: 60*60*24*7 }))
  return res.json({ ok: true })
}
