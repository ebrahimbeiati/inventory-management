import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log('Fetching dashboard metrics...');
    
    const popularProducts = await prisma.products.findMany({
      take: 15,
      orderBy: {
        stockQuantity: "desc",
      },
    });
    console.log('Found products:', popularProducts.length);
    
    const salesSummary = await prisma.salesSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Found sales summaries:', salesSummary.length);
    
    const purchaseSummary = await prisma.purchaseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Found purchase summaries:', purchaseSummary.length);
    
    const expenseSummary = await prisma.expenseSummary.findMany({
      take: 5,
      orderBy: {
        date: "desc",
      },
    });
    console.log('Found expense summaries:', expenseSummary.length);
    
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        take: 5,
        orderBy: {
          date: "desc",
        },
      }
    );
    console.log('Found expense by category summaries:', expenseByCategorySummaryRaw.length);
    
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item: any) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    const response = {
      popularProducts,
      salesSummary,
      purchaseSummary,
      expenseSummary,
      expenseByCategorySummary,
    };
    console.log('Sending response:', JSON.stringify(response, null, 2));
    
    res.json(response);
  } catch (error) {
    console.error('Error in getDashboardMetrics:', error);
    res.status(500).json({ message: "Error retrieving dashboard metrics" });
  }
};