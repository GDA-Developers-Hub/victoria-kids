const express = require("express")
const router = express.Router()
const multer = require("multer")
const {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
  getAllCustomers,
  generateSalesReport,
} = require("../controllers/adminController")
const { getAllOrders } = require("../controllers/orderController")
const { 
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController")
const { getAdminCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require("../controllers/categoryController")
const { protect, admin } = require("../middleware/authMiddleware")

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

// Protected admin routes
router.get("/dashboard/stats", protect, admin, getDashboardStats)
router.get("/dashboard/recent-orders", protect, admin, getRecentOrders)
router.get("/dashboard/low-stock", protect, admin, getLowStockProducts)
router.get("/customers", protect, admin, getAllCustomers)
router.get("/reports/sales", protect, admin, generateSalesReport)
router.get("/orders", protect, admin, getAllOrders)

// Admin product routes
router.get("/products", protect, admin, getAdminProducts)
router.post("/products", protect, admin, upload.array("images", 10), createProduct)
router.put("/products/:id", protect, admin, upload.array("images", 10), updateProduct)
router.delete("/products/:id", protect, admin, deleteProduct)

// Admin category routes
router.get("/categories", protect, admin, getAdminCategories)
router.get("/categories/:id", protect, admin, getCategoryById)
router.post("/categories", protect, admin, upload.single("image"), createCategory)
router.put("/categories/:id", protect, admin, upload.single("image"), updateCategory)
router.delete("/categories/:id", protect, admin, deleteCategory)

module.exports = router
