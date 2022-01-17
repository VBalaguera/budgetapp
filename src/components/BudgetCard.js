import React from "react";
import { Card, ProgressBar, Stack, Button } from "react-bootstrap";
import "./BudgetCard.css";

//formatting
import { currencyFormatter } from "../utils";

export default function BudgetCard({ name, amount, max }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="title">
          <div>{name}</div>
          <div className="amounts">
            {currencyFormatter.format(amount)} /
            <span className="amounts-total">
              {currencyFormatter.format(max)}
            </span>
          </div>
        </Card.Title>
        <ProgressBar
          variant={getProgressBarVariant(amount, max)}
          min={0}
          max={max}
          now={amount}
        ></ProgressBar>
        <Stack direction="horizontal" gap="2" className="mt-2">
          <Button variant="primary">add expense</Button>
          <Button variant="secondary">view expenses</Button>
        </Stack>
      </Card.Body>
    </Card>
  );
}

function getProgressBarVariant(amount, max) {
  const ratio = amount / max;
  if (ratio < 0.5) return "primary";
  if (ratio < 0.75) return "warning";
  if (ratio < 0.95) return "danger";
  return "black";
}
