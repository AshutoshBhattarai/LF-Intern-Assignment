import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status-codes";
import NotFoundError from "../errors/NotFound";
import Expense from "../models/Expense";
import User from "../models/User";
import * as expenseService from "../services/ExpenseService";
import { getUserTotalExpenseCount } from "../repositories/ExpenseRepo";
import createMetaData from "../utils/metadata";

// GET ALL EXPENSES OF A USER (NOT IN USE)
export const getAllExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    if (!user) throw new NotFoundError("User not found");
    const data = await expenseService.getAllExpenses(user);
    res.status(HttpStatus.OK).json({
      message: "Expenses were successfully retrieved",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const expense: Expense = req.body;
    if ((req as any).file) {
      expense.image = (req as any).file.filename;
    }

    await expenseService.createExpense(user, expense);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Expense Added successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL EXPENSES OF A USER with filter by query parameters
// If query parameters are not provided, all expenses will be returned
// Same as getAllExpenses
export const getFilteredExpenses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const params = req.query;
    const data = await expenseService.getFilteredExpenses(user, params);
    const meta = createMetaData(await getUserTotalExpenseCount(user,params));

    res.status(HttpStatus.OK).json({
      message: "Expenses were successfully retrieved",
      result: data,
      meta
    });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const expense: Expense = req.body;
    if ((req as any).file) {
      expense.image = (req as any).file.filename;
    }
    await expenseService.updateExpense(user, expense);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Expense updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user: User = res.locals.user;
    const { id } = req.params;
    await expenseService.deleteExpense(user, id);
    res.status(HttpStatus.ACCEPTED).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
