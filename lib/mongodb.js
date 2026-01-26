import { MongoClient } from 'mongodb'

let cached = global._mongoClientPromise

if (!cached) {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('Please define the MONGODB_URI in .env.local')
  }
  const client = new MongoClient(uri)
  cached = global._mongoClientPromise = client.connect()
}

export default cached
