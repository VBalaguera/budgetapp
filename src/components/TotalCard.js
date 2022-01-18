import React from "react";
import { Card, ProgressBar, Stack, Button } from "react-bootstrap";
import "./BudgetCard.css";

//formatting
import { currencyFormatter } from "../utils";

export default function BudgetCard({
  name,
  amount,
  description,
  max,
  grey,
  onAddExpenseClick,
  hideButtons,
  onViewExpenseClick,
}) {
  const classNames = [];

  const ratio = amount / max;
  // FIXME: revisit this and improve
  if (ratio < 0.5) {
    classNames.push("bg-primary", "bg-opacity-10");
  } else if (ratio < 0.75) {
    classNames.push("bg-warning", "bg-opacity-10");
  } else if (ratio < 0.95) {
    classNames.push("bg-danger", "bg-opacity-30");
  } else if (ratio === 1) {
    classNames.push("bg-danger", "bg-opacity-50");
  } else if (amount > max) {
    classNames.push("bg-black", "bg-opacity-25");
  } else if (grey) {
    classNames.push("bg-light");
  }

  function getProgressBarVariant(amount, max) {
    if (ratio < 0.5) return "primary";
    if (ratio < 0.75) return "warning";
    if (ratio < 0.95) return "danger";
    return "black";
  }

  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        <Card.Title className="title">
          <div className="budgetcard__info">
            <div className="budgetcard__info__title-amount">
              <div>
                <span className="budget__name">{name}</span>
              </div>
              <div className="budget__amounts">
                {currencyFormatter.format(amount)}
                {max && (
                  <span className="budget__amounts-total">
                    / {currencyFormatter.format(max)}
                  </span>
                )}
              </div>
            </div>
            <div>
              <span className="budget__description">{description}</span>
            </div>
          </div>
        </Card.Title>
        {max && (
          <ProgressBar
            variant={getProgressBarVariant(amount, max)}
            min={0}
            max={max}
            now={amount}
          ></ProgressBar>
        )}
        {!hideButtons && (
          <Stack direction="horizontal" gap="2" className="mt-2">
            <Button variant="outline-secondary" onClick={onAddExpenseClick}>
              add expense
            </Button>
            <Button onClick={onViewExpenseClick} variant="secondary">
              view expenses
            </Button>
          </Stack>
        )}
      </Card.Body>
    </Card>
  );
}
