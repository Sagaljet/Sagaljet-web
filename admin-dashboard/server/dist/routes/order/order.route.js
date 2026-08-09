"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("../../controllers/order/order.controller");
const router = express_1.default.Router();
// Get all orders
router.get("/get-orders", order_controller_1.getOrders);
// Get order by ID
router.get("/get-order/:id", order_controller_1.getOrder);
// Add new order
router.post("/add-order", order_controller_1.addOrder);
// Edit order
router.put("/edit-order/:id", order_controller_1.editOrder);
// Delete order
router.delete("/delete-order/:id", order_controller_1.deleteOrder);
// Update order status
router.patch("/update-order-status/:id", order_controller_1.updateOrderStatus);
// Get orders by status
router.get("/get-orders-by-status/:status", order_controller_1.getOrdersByStatus);
// Get orders by design
router.get("/get-orders-by-design/:designId", order_controller_1.getOrdersByDesign);
exports.default = router;
