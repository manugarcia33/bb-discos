const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { unlink } = require("fs/promises");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "bb-discos",
    });

    await unlink(req.file.path);

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    if (req.file?.path) {
      try {
        await unlink(req.file.path);
      } catch {}
    }
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
