import React from "react";
import { useBudgets } from "../context/BudgetsContext";
import TotalCard from "./BudgetCard";

export default function TotalBudgetCard() {
  const { expenses, budgets } = useBudgets();
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0);
  const max = budgets.reduce((total, budgets) => total + budgets.max, 0);
  if (max === 0) return null;

  return (
    <div>
      totalbudgetcard
      <TotalCard name="total" gray amount={amount} max={max} hideButtons />
    </div>
  );
}
