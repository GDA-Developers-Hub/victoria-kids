const express = require("express")
const router = express.Router()
const { uploadMedia, uploadMultipleMedia } = require("../controllers/mediaController")
const { protect, admin } = require("../middleware/authMiddleware")

// Routes now return information messages only, as media uploads are handled by frontend
router.post("/upload", protect, admin, uploadMedia)
router.post("/upload-multiple", protect, admin, uploadMultipleMedia)

module.exports = router
