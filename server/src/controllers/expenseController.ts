import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllExpenses = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenses = await prisma.expenses.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });
    
    const formattedExpenses = expenses.map((expense) => ({
      ...expense,
      amount: expense.amount.toString(),
    }));

    res.json(formattedExpenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error retrieving expenses" });
  }
};

export const getExpensesByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const expenseByCategorySummaryRaw = await prisma.expenseByCategory.findMany(
      {
        orderBy: {
          date: "desc",
        },
      }
    );
    const expenseByCategorySummary = expenseByCategorySummaryRaw.map(
      (item) => ({
        ...item,
        amount: item.amount.toString(),
      })
    );

    res.json(expenseByCategorySummary);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving expenses by category" });
  }
};