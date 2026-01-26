import clientPromise from '../../../lib/mongodb'
import bcrypt from 'bcryptjs'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { email, password, displayName } = req.body
  if(!email || !password) return res.status(400).json({ message: 'Missing fields' })
  const client = await clientPromise
  const db = client.db()
  const users = db.collection('users')
  const exists = await users.findOne({ email })
  if(exists) return res.status(400).json({ message: 'User already exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = { email, password: hash, displayName, createdAt: new Date() }
  await users.insertOne(user)
  return res.status(201).json({ ok: true })
}
