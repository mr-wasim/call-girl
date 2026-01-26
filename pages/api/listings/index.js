import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res){
  const client = await clientPromise
  const db = client.db()
  const col = db.collection('listings')
  if(req.method === 'GET'){
    const items = await col.find({}).limit(20).toArray()
    return res.json(items)
  }
  if(req.method === 'POST'){
    const body = req.body
    const doc = { ...body, createdAt: new Date() }
    const r = await col.insertOne(doc)
    return res.status(201).json({ insertedId: r.insertedId })
  }
  res.status(405).end()
}
