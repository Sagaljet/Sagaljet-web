import express from "express";
import {
  getOrders,
  getOrder,
  addOrder,
  editOrder,
  deleteOrder,
  updateOrderStatus,
  getOrdersByStatus,
  getOrdersByDesign,
} from "../../controllers/order/order.controller";
import { decoded } from "../../controllers/secure/JWT";

const router = express.Router();

// Get all orders
router.get("/get-orders", getOrders);

// Get order by ID
router.get("/get-order/:id", getOrder);

// Add new order
router.post("/add-order", addOrder);

// Edit order
router.put("/edit-order/:id", editOrder);

// Delete order
router.delete("/delete-order/:id", deleteOrder);

// Update order status
router.patch("/update-order-status/:id", updateOrderStatus);

// Get orders by status
router.get("/get-orders-by-status/:status", getOrdersByStatus);

// Get orders by design
router.get("/get-orders-by-design/:designId", getOrdersByDesign);

export default router;
