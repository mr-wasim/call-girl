import clientPromise from '../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async function handler(req, res){
  const { id } = req.query
  const client = await clientPromise
  const db = client.db()
  const col = db.collection('listings')
  try {
    const doc = await col.findOne({ _id: new ObjectId(id) })
    if(!doc) return res.status(404).json({ message: 'Not found' })
    return res.json(doc)
  } catch(e){
    return res.status(400).json({ message: 'Invalid id' })
  }
}
