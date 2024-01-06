import { ILike, Repository } from "typeorm";
import Income from "../models/Income";
import database from "../database/config";
import User from "../models/User";

const repo: Repository<Income> = database.getRepository("income");
export const getIncome = async (user: User) => {
  return await repo.find({
    where: { user: { id: user.id } },
    relations: { user: true },
  });
};

export const createIncome = async (income: Income) => {
  return await repo.save(income);
};

export const updateIncome = async (income: Income) => {
  return await repo.update({ id: income.id }, income);
};

export const deleteIncome = async (income: Income) => {
  return await repo.delete({ id: income.id });
};

export const totalIncome = async (user: User) => {
  return await repo.sum("amount", { user: { id: user.id }, active: true });
};

export const getIncomeSource = async (user: User) => {
  return await repo.findOne({
    where: { user: { id: user.id }, active: true, source: ILike("Salary") },
  });
};
