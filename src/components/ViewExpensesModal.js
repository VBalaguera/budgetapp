import { Modal, Button, Stack } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../context/BudgetsContext";
import { currencyFormatter } from "../utils";
import "./ViewExpensesModal.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ViewExpensesModal({ budgetId, handleClose }) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } =
    useBudgets();

  const expenses = getBudgetExpenses(budgetId);

  const budget =
    UNCATEGORIZED_BUDGET_ID === budgetId
      ? { name: "uncategorized", id: UNCATEGORIZED_BUDGET_ID }
      : budgets.find((budget) => budget.id === budgetId);

  const data = {
    labels: expenses.map((expense) => expense.description),
    datasets: [
      {
        label: expenses.map((expense) => expense.description),
        data: expenses.map((expense) => expense.amount),
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
  };

  return (
    <Modal show={budgetId != null} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          <Stack direction="horizontal" gap="2">
            <div className="top">
              <div className="top__expenses">expenses - {budget?.name} </div>
              {budgetId !== UNCATEGORIZED_BUDGET_ID && (
                <Button
                  onClick={() => {
                    deleteBudget(budget);
                    handleClose();
                  }}
                  variant="outline-danger"
                >
                  delete
                </Button>
              )}
            </div>
          </Stack>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack direction="vertical" gap="3">
          {expenses.map((expense) => (
            <Stack direction="horizontal" gap="2" key={expense.id}>
              <div className="envelope">
                <div className="info">
                  <div className="info__description-amount">
                    <div>
                      <span className="expense__dscription">
                        {expense.description}
                      </span>
                    </div>
                    <div>
                      <span className="expense__amount">
                        {currencyFormatter.format(expense.amount)}
                      </span>
                    </div>
                  </div>
                  <div className="info__notes">
                    <span className="expense__notes">{expense.notes}</span>
                  </div>
                </div>
                <Button
                  className="button__deletion"
                  onClick={() => deleteExpense(expense)}
                  variant="outline-danger"
                >
                  &times;
                </Button>
              </div>
            </Stack>
          ))}
        </Stack>
      </Modal.Body>
      <Modal.Body>
        <Doughnut data={data} />
      </Modal.Body>
    </Modal>
  );
}
