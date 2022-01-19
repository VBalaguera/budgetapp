import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RecapContent({ budgets, expenses, amount }) {
  const data = {
    // FIXME:
    labels: budgets.map((budget) => budget.name),
    datasets: [
      {
        label: budgets.map((budget) => budget.name),
        data: budgets.map((budget) => budget.max),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
    budgetLabels: budgets.map((budget) => budget),
  };
  return (
    <div>
      comp total budgets here, redefine
      <Doughnut data={data} />
      {budgets.map((budget) => {
        return (
          <div key={budget.key}>
            <b>{budget.name}</b>
            <p>{budget.description}</p>
            <p>{budget.max}</p>
          </div>
        );
      })}
      <br />
      {expenses.map((expense) => {
        return (
          <div key={expense.budgetId}>
            <p>{expense.budgetId}</p>
            <p>{expense.amount}</p>
            <p>{expense.description}</p>
          </div>
        );
      })}
    </div>
  );
}
