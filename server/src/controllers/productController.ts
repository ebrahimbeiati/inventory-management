import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const products = await prisma.products.findMany({
      where: {
        name: {
          contains: search,
        },
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Error retrieving products" });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, price, rating, stockQuantity } = req.body;

    // Validate required fields
    if (!name || price === undefined || stockQuantity === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Validate numeric fields
    if (isNaN(price) || isNaN(stockQuantity) || (rating !== undefined && isNaN(rating))) {
      res.status(400).json({ message: "Invalid numeric values" });
      return;
    }

    // Validate rating range
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      res.status(400).json({ message: "Rating must be between 0 and 5" });
      return;
    }

    const product = await prisma.products.create({
      data: {
        productId: uuidv4(),
        name,
        price: parseFloat(price),
        rating: rating !== undefined ? parseFloat(rating) : null,
        stockQuantity: parseInt(stockQuantity),
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, price, rating, stockQuantity } = req.body;

    // Validate required fields
    if (!name || price === undefined || stockQuantity === undefined) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // Validate numeric fields
    if (isNaN(price) || isNaN(stockQuantity) || (rating !== undefined && isNaN(rating))) {
      res.status(400).json({ message: "Invalid numeric values" });
      return;
    }

    // Validate rating range
    if (rating !== undefined && (rating < 0 || rating > 5)) {
      res.status(400).json({ message: "Rating must be between 0 and 5" });
      return;
    }

    const product = await prisma.products.update({
      where: { productId },
      data: {
        name,
        price: parseFloat(price),
        rating: rating !== undefined ? parseFloat(rating) : null,
        stockQuantity: parseInt(stockQuantity),
      },
    });
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;

    await prisma.products.delete({
      where: { productId },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product" });
  }
};