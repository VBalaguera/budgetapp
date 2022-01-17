import { Modal, Form } from "react-bootstrap";

export default function AddBudgetModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>new budget</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>name</Form.Label>
            <Form.Control type="text" required>
              input
            </Form.Control>
          </Form.Group>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
