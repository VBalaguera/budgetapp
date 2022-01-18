import { Modal, Form, Button } from "react-bootstrap";
import { useRef } from "react";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "../context/BudgetsContext";

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
  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>new expense</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>description</Form.Label>
            <Form.Control ref={descriptionRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="amount">
            <Form.Label>amount</Form.Label>
            <Form.Control
              ref={amountRef}
              type="number"
              min={0}
              step={0.01}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="budgetId">
            <Form.Label>budget</Form.Label>
            <Form.Select defaultValue={defaultBudgetId} ref={budgetIdRef}>
              <option id={UNCATEGORIZED_BUDGET_ID}>uncategorized</option>
              {budgets.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {budget.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="notes">
            <Form.Label>notes</Form.Label>
            <textarea
              ref={notesRef}
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </Form.Group>
          <div className="add-budget-modal">
            <Button variant="primary" type="submit">
              Add
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
