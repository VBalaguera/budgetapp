import React from "react";
import RecapTotalContent from "./RecapTotalContent";
import { useBudgets } from "../context/BudgetsContext";

export default function RecapTotal() {
  // FIXME:
  const { expenses, budgets } = useBudgets();
  const amount = expenses.reduce((total, expense) => total + expense.amount, 0);
  const max = budgets.reduce((total, budgets) => total + budgets.max, 0);
  if (max === 0) return null;
  return (
    <div>
      <RecapTotalContent
        amount={amount}
        expenses={expenses}
        budgets={budgets}
      />
    </div>
  );
}
