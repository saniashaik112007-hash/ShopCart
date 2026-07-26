const express = require("express");
const router = express.Router();
const { placeOrder, getMyOrders, getOrderById } = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);

router.post("/", placeOrder);
router.get("/myorders", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;

