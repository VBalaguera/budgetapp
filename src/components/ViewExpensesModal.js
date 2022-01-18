import { Modal, Button, Stack } from "react-bootstrap";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../context/BudgetsContext";
import { currencyFormatter } from "../utils";
import "./ViewExpensesModal.css";

export default function ViewExpensesModal({ budgetId, handleClose }) {
  const { getBudgetExpenses, budgets, deleteBudget, deleteExpense } =
    useBudgets();

  const expenses = getBudgetExpenses(budgetId);

  const budget =
    UNCATEGORIZED_BUDGET_ID === budgetId
      ? { name: "uncategorized", id: UNCATEGORIZED_BUDGET_ID }
      : budgets.find((budget) => budget.id === budgetId);

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
    </Modal>
  );
}
