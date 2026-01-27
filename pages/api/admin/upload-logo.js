// pages/api/admin/upload-logo.js
import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  try {
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parse error:", err);
        return res.status(500).json({ ok: false, message: "Form parse failed" });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ ok: false, message: "No file uploaded" });
      }

      // temp file path (formidable v3+)
      const tempPath = file.filepath;
      const originalName = file.originalFilename || "logo.png";
      const ext = path.extname(originalName);

      // ensure uploads dir
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `logo-${Date.now()}${ext}`;
      const finalPath = path.join(uploadDir, fileName);

      // move file
      fs.renameSync(tempPath, finalPath);

      // public URL
      const publicPath = `/uploads/${fileName}`;

      return res.status(200).json({
        ok: true,
        path: publicPath,
      });
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ ok: false, message: error.message });
  }
}
