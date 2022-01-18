import React from "react";
import RecapContent from "./RecapContent";
import { useBudgets } from "../context/BudgetsContext";

export default function Recap() {
  // FIXME:
  const { expenses, budgets } = useBudgets();
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0);
  const max = budgets.reduce((total, budgets) => total + budgets.max, 0);
  if (max === 0) return null;
  return (
    <div>
      <RecapContent amount={amount} expenses={expenses} budgets={budgets} />
    </div>
  );
}
