import { Modal, Form, Button } from "react-bootstrap";
import { useRef } from "react";
import { useBudgets } from "../context/BudgetsContext";

export default function AddBudgetModal({ show, handleClose }) {
  const nameRef = useRef();
  const descriptionRef = useRef();
  const maxRef = useRef();
  const { addBudget } = useBudgets();

  function handleSubmit(e) {
    e.preventDefault();
    addBudget({
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      max: parseFloat(maxRef.current.value),
    });
    handleClose();
  }
  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="title">new budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>name</Form.Label>
            <Form.Control ref={nameRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>description</Form.Label>
            <textarea
              ref={descriptionRef}
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>maximum spending</Form.Label>
            <Form.Control
              ref={maxRef}
              type="number"
              min={0}
              step={0.01}
              required
            />
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
