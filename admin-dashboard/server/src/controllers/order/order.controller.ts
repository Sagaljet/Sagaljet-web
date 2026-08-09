import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        design: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ result: orders, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-orders)",
      error,
      success: false,
    });
  }
};

// Get order by ID
export const getOrder = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-order)",
      error,
      success: false,
    });
  }
};

// Add a new order
export const addOrder = async (req: Request, res: any) => {
  try {
    const { designId, size, quantity, color, customText, totalPrice } =
      req.body;

    // Validate design exists
    const design = await prisma.design.findUnique({
      where: { id: parseInt(designId) },
    });

    if (!design) {
      return res.status(404).json({
        message: `Design with id ${designId} not found.`,
        success: false,
      });
    }

    const order = await prisma.order.create({
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-order)",
      error,
      success: false,
    });
  }
};

// Edit order
export const editOrder = async (req: Request, res: any) => {
  try {
    const { id } = req.params;

    const existingOrder = await prisma.order.findUnique({
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
      customText:
        req.body.customText !== undefined
          ? req.body.customText
          : existingOrder.customText,
      status: req.body.status || existingOrder.status,
      totalPrice: req.body.totalPrice
        ? parseFloat(req.body.totalPrice)
        : existingOrder.totalPrice,
    };

    const order = await prisma.order.update({
      where: { id },
      data: updatedData,
      include: {
        design: true,
      },
    });

    res.json({ result: order, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-order)",
      error,
      success: false,
    });
  }
};

// Delete order
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.delete({
      where: { id },
    });

    res.json({ result: order, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-order)",
      error,
      success: false,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: any) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    const order = await prisma.order.update({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/update-order-status)",
      error,
      success: false,
    });
  }
};

// Get orders by status
export const getOrdersByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.params;

    const orders = await prisma.order.findMany({
      where: { status },
      include: {
        design: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ result: orders, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-orders-by-status)",
      error,
      success: false,
    });
  }
};

// Get orders by design ID
export const getOrdersByDesign = async (req: Request, res: any) => {
  try {
    const { designId } = req.params;

    const orders = await prisma.order.findMany({
      where: { designId: parseInt(designId) },
      include: {
        design: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ result: orders, success: true });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-orders-by-design)",
      error,
      success: false,
    });
  }
};
