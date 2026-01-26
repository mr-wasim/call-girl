import dbConnect from '../../../lib/db'

export default async function handler(req, res) {
  try {
    // env check
    if (!process.env.MONGO_URI) {
      return res.status(500).json({
        success: false,
        message: 'MONGO_URI is missing in env'
      })
    }

    // db connect
    const conn = await dbConnect()

    res.status(200).json({
      success: true,
      message: 'MongoDB connected successfully',
      host: conn.host,
      name: conn.name,
      readyState: conn.readyState // 1 = connected
    })
  } catch (error) {
    console.error('Mongo Debug Error:', error)
    res.status(500).json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    })
  }
}
