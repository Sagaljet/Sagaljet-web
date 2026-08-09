"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrdersByDesign = exports.getOrdersByStatus = exports.updateOrderStatus = exports.deleteOrder = exports.editOrder = exports.addOrder = exports.getOrder = exports.getOrders = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all orders
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield prisma.order.findMany({
            include: {
                design: true,
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ result: orders, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-orders)",
            error,
            success: false,
        });
    }
});
exports.getOrders = getOrders;
// Get order by ID
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield prisma.order.findUnique({
            where: { id },
            include: {
                design: true,
            },
        });
        if (!order) {
            return res.status(404).json({
                message: `Order with id ${id} not found.`,
                success: false,
            });
        }
        res.json({ result: order, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-order)",
            error,
            success: false,
        });
    }
});
exports.getOrder = getOrder;
// Add a new order
const addOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { designId, size, quantity, color, customText, totalPrice } = req.body;
        // Validate design exists
        const design = yield prisma.design.findUnique({
            where: { id: parseInt(designId) },
        });
        if (!design) {
            return res.status(404).json({
                message: `Design with id ${designId} not found.`,
                success: false,
            });
        }
        const order = yield prisma.order.create({
            data: {
                designId: parseInt(designId),
                size,
                quantity: parseInt(quantity),
                color,
                customText: customText || null,
                totalPrice: parseFloat(totalPrice),
            },
            include: {
                design: true,
            },
        });
        res.json({ result: order, success: true });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error happened at calling endpoint (/add-order)",
            error,
            success: false,
        });
    }
});
exports.addOrder = addOrder;
// Edit order
const editOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingOrder = yield prisma.order.findUnique({
            where: { id },
        });
        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        const updatedData = {
            size: req.body.size || existingOrder.size,
            quantity: req.body.quantity
                ? parseInt(req.body.quantity)
                : existingOrder.quantity,
            color: req.body.color || existingOrder.color,
            customText: req.body.customText !== undefined
                ? req.body.customText
                : existingOrder.customText,
            status: req.body.status || existingOrder.status,
            totalPrice: req.body.totalPrice
                ? parseFloat(req.body.totalPrice)
                : existingOrder.totalPrice,
        };
        const order = yield prisma.order.update({
            where: { id },
            data: updatedData,
            include: {
                design: true,
            },
        });
        res.json({ result: order, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/edit-order)",
            error,
            success: false,
        });
    }
});
exports.editOrder = editOrder;
// Delete order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield prisma.order.delete({
            where: { id },
        });
        res.json({ result: order, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/delete-order)",
            error,
            success: false,
        });
    }
});
exports.deleteOrder = deleteOrder;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const existingOrder = yield prisma.order.findUnique({
            where: { id },
        });
        if (!existingOrder) {
            return res.status(404).json({
                message: "Order not found",
                success: false,
            });
        }
        const order = yield prisma.order.update({
            where: { id },
            data: { status },
            include: {
                design: true,
            },
        });
        res.json({
            result: order,
            message: `Order status updated to ${status} successfully`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/update-order-status)",
            error,
            success: false,
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Get orders by status
const getOrdersByStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const orders = yield prisma.order.findMany({
            where: { status },
            include: {
                design: true,
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ result: orders, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-orders-by-status)",
            error,
            success: false,
        });
    }
});
exports.getOrdersByStatus = getOrdersByStatus;
// Get orders by design ID
const getOrdersByDesign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { designId } = req.params;
        const orders = yield prisma.order.findMany({
            where: { designId: parseInt(designId) },
            include: {
                design: true,
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ result: orders, success: true });
    }
    catch (error) {
        res.status(500).json({
            message: "Error happened at calling endpoint (/get-orders-by-design)",
            error,
            success: false,
        });
    }
});
exports.getOrdersByDesign = getOrdersByDesign;
