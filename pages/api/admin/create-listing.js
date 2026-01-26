export const config = {
  api: { bodyParser: false }
}

import multer from 'multer'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import dbConnect from '../../../lib/db'
import Listing from '../../../models/Listing'

// multer setup (memory = fast)
const upload = multer({
  storage: multer.memoryStorage()
})

// helper to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    // run multer
    await runMiddleware(
      req,
      res,
      upload.fields([
        { name: 'profileImages' },
        { name: 'variantImages' }
      ])
    )

    await dbConnect()

    const { name, city, age, price, description } = req.body

    if (!name || !city) {
      return res.status(400).json({
        success: false,
        message: 'Name and City required'
      })
    }

    const profileFiles = Array.isArray(req.files?.profileImages)
      ? req.files.profileImages
      : []

    const variantFiles = Array.isArray(req.files?.variantImages)
      ? req.files.variantImages
      : []

    const baseDir = path.join(process.cwd(), 'public/uploads')
    const profileDir = path.join(baseDir, 'profile')
    const variantDir = path.join(baseDir, 'variant')

    fs.mkdirSync(profileDir, { recursive: true })
    fs.mkdirSync(variantDir, { recursive: true })

    const saveImages = async (files, dir, type) => {
      const urls = []
      for (const file of files) {
        const filename = `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}.webp`

        const filepath = path.join(dir, filename)

        await sharp(file.buffer)
          .webp({ quality: 80 })
          .toFile(filepath)

        urls.push(`/uploads/${type}/${filename}`)
      }
      return urls
    }

    const profileImages = await saveImages(profileFiles, profileDir, 'profile')
    const variantImages = await saveImages(variantFiles, variantDir, 'variant')

    const listing = await Listing.create({
      name,
      city,
      age,
      price,
      description,
      profileImages,
      variantImages
    })

    return res.status(201).json({
      success: true,
      id: listing._id
    })
  } catch (err) {
    console.error('CREATE LISTING ERROR:', err)
    return res.status(500).json({
      success: false,
      message: err.message
    })
  }
}
