const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getNewArrivals,
  getBudgetProducts,
  getLuxuryProducts,
  getRelatedProducts,
} = require("../controllers/productController")

// Public routes
router.get("/", getProducts)
router.get("/featured", getFeaturedProducts)
router.get("/new", getNewArrivals)
router.get("/budget", getBudgetProducts)
router.get("/luxury", getLuxuryProducts)
router.get("/related/:id", getRelatedProducts)
router.get("/:id", getProductById)

module.exports = router
