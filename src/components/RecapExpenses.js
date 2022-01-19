import React from "react";
import RecapExpensesContent from "./RecapExpensesContent";
import { useBudgets } from "../context/BudgetsContext";

export default function Recap() {
  // FIXME:
  const { expenses, budgets } = useBudgets();
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0);
  const max = budgets.reduce((total, budgets) => total + budgets.max, 0);
  if (max === 0) return null;
  return (
    <div>
      <RecapExpensesContent
        amount={amount}
        expenses={expenses}
        budgets={budgets}
      />
    </div>
  );
}
