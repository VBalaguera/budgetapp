import { Modal, Form, Button } from "react-bootstrap";
import { useRef } from "react";
import { useBudgets } from "../../context/BudgetsContext";

import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  return (
    <Modal className="add-budget" show={show} onHide={handleClose}>
      <Form className="add-budget-form" onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="title">
            <p className="add-budget-form__title">{t("buttons.addBudget")}</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group
            className="mb-3 add-budget-form__description"
            controlId="name"
          >
            <Form.Label>
              <p className="add-budget-form__description-name"></p>
              {t("info.name")}
            </Form.Label>
            <Form.Control ref={nameRef} type="text" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>
              <p className="add-budget-form__description-text">
                {t("info.description")}
              </p>
            </Form.Label>
            <textarea
              ref={descriptionRef}
              class="form-control"
              id="exampleFormControlTextarea1"
              rows="3"
            ></textarea>
          </Form.Group>
          <Form.Group className="mb-3" controlId="max">
            <Form.Label>
              <p className="add-budget-form__description-spending">
                {t("info.maximumSpending")}
              </p>
            </Form.Label>
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
              {t("main.add")}
            </Button>
          </div>
        </Modal.Body>
      </Form>
    </Modal>
  );
}
