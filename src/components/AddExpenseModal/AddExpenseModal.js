import { Modal, Form, Button } from "react-bootstrap";
import { useRef } from "react";
import {
  UNCATEGORIZED_BUDGET_ID,
  useBudgets,
} from "../../context/BudgetsContext";
import { useTranslation } from "react-i18next";

export default function AddExpenseModal({
  show,
  handleClose,
  defaultBudgetId,
}) {
  const descriptionRef = useRef();
  const amountRef = useRef();
  const notesRef = useRef();
  const budgetIdRef = useRef();
  const { addExpense, budgets } = useBudgets();

  function handleSubmit(e) {
    e.preventDefault();
    addExpense({
      description: descriptionRef.current.value,
      amount: parseFloat(amountRef.current.value),
      notes: notesRef.current.value,
      budgetId: budgetIdRef.current.value,
    });
    handleClose();
  }

  const { t } = useTranslation();
  return (
    <Modal className="add-expense" show={show} onHide={handleClose}>
      <Form className="add-expense-form" onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="add-expense-form__title">{t("buttons.addExpense")}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className="mb-3 add-expense-form__description"
            controlId="description"
          >
            <Form.Label>
              <p className="add-expense-form__description-text">
                {t("info.description")}
              </p>
            </Form.Label>
            <Form.Control ref={descriptionRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>
              <p className="add-expense-form__description-amount">
                {t("info.amount")}
              </p>
            </Form.Label>
            <Form.Control
              ref={amountRef}
              type="number"
              min={0}
              step={0.01}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>{t("info.budget")}</Form.Label>
            <Form.Select defaultValue={defaultBudgetId} ref={budgetIdRef}>
              <option id={UNCATEGORIZED_BUDGET_ID}>
                {t("info.uncategorized")}
              </option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="notes">
            <Form.Label>
              <p className="add-expense-form__description-notes">
                {t("info.notes")}
              </p>
            </Form.Label>
            <textarea
              ref={notesRef}
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </Form.Group>
          <div className="add-budget-modal">
            <Button variant="primary" type="submit">
              {t("main.add")}
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
