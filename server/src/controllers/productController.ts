import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const search = req.query.search?.toString();
    const category = req.query.category?.toString();
    const tag = req.query.tag?.toString();
    
    const products = await prisma.products.findMany({
      where: {
        AND: [
          search 
            ? { 
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { category: { contains: search, mode: 'insensitive' } },
                  { tags: { contains: search, mode: 'insensitive' } }
                ] 
              } 
            : {},
          category ? { category } : {},
          tag ? { tags: { contains: tag } } : {}
        ]
      },
      orderBy: {
        name: 'asc'
      }
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
    // Log the incoming request body for debugging
    console.log("Creating product with data:", JSON.stringify(req.body, null, 2));
    
    // Extract required fields from the request
    const { name, price, stockQuantity, rating, imageUrl, category, tags, description } = req.body;
    
    // Validate required fields
    if (!name) {
      console.error("Missing required field: name");
      res.status(400).json({ message: "Product name is required" });
      return;
    }
    
    // Create a cleaned data object with validated values
    const cleanedData: any = {
      name,
      price: typeof price === 'number' && !isNaN(price) ? price : 0,
      stockQuantity: typeof stockQuantity === 'number' && !isNaN(stockQuantity) ? stockQuantity : 0,
    };
    
    // Add optional fields if they exist and are valid
    if (rating !== undefined && typeof rating === 'number' && !isNaN(rating)) {
      cleanedData.rating = rating;
    }
    
    if (imageUrl) cleanedData.imageUrl = imageUrl;
    if (category) cleanedData.category = category;
    if (tags) cleanedData.tags = tags;
    if (description) cleanedData.description = description;
    
    // Generate a UUID for productId
    const productId = uuidv4();
    const productData = {
      ...cleanedData,
      productId
    };
    
    // Log the data being sent to Prisma
    console.log("Sending data to Prisma:", JSON.stringify(productData, null, 2));
    
    const product = await prisma.products.create({
      data: productData
    });
    
    console.log("Product created successfully:", JSON.stringify(product, null, 2));
    res.status(201).json(product);
  } catch (error) {
    // More detailed error logging
    console.error("Error creating product:", error);
    
    // If it's a Prisma error, log more specific details
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    res.status(500).json({ message: "Error creating product" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { name, price, rating, stockQuantity, imageUrl, category, tags } = req.body;
    
    const product = await prisma.products.update({
      where: { productId },
      data: {
        name,
        price,
        rating,
        stockQuantity,
        imageUrl,
        category,
        tags
      },
    });
    
    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.products.findMany({
      where: {
        category: {
          not: null
        }
      },
      select: {
        category: true
      },
      distinct: ['category']
    });
    
    const categories = products
      .map(p => p.category)
      .filter(Boolean) as string[];
    
    res.json(categories);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Error retrieving categories" });
  }
};

export const getTags = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await prisma.products.findMany({
      where: {
        tags: {
          not: null
        }
      },
      select: {
        tags: true
      }
    });
    
    // Collect all tags from all products
    const allTags = products
      .map(p => p.tags?.split(',').map(tag => tag.trim()))
      .filter(Boolean)
      .flat() as string[];
    
    // Remove duplicates
    const uniqueTags = [...new Set(allTags)];
    
    res.json(uniqueTags);
  } catch (error) {
    console.error("Error retrieving tags:", error);
    res.status(500).json({ message: "Error retrieving tags" });
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