import React from "react";
import { Card, ProgressBar } from "react-bootstrap";
import "./BudgetCard.css";
import RecapTotal from "./RecapTotal";
import { useTranslation } from "react-i18next";

//formatting
import { currencyFormatter } from "../utils";

export default function TotalCard({
  name,
  amount,
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
    classNames.push("bg-primary", "bg-opacity-25");
  } else if (ratio < 0.75) {
    classNames.push("bg-warning", "bg-opacity-25");
  } else if (ratio < 0.95) {
    classNames.push("bg-danger", "bg-opacity-25");
  } else if (ratio === 1) {
    classNames.push("bg-danger", "bg-opacity-50");
  } else if (amount > max) {
    classNames.push("bg-danger", "bg-opacity-50");
  } else if (grey) {
    classNames.push("bg-light");
  }

  function getProgressBarVariant(amount, max) {
    const ratio = amount / max;
    if (ratio < 0.5) return "primary";
    if (ratio < 0.75) return "warning";
    if (ratio < 0.95) return "danger";
    return "danger";
  }

  // i18n:
  const { t } = useTranslation();

  return (
    <Card className={classNames.join(" ")}>
      <Card.Body>
        <Card.Title className="title">
          <div className="budgetcard__info">
            <div className="budgetcard__info__title-amount">
              <div>
                <span className="budget__name">{t("main.total")}</span>
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
          </div>
        </Card.Title>
        {max && (
          <div>
            <ProgressBar
              variant={getProgressBarVariant(amount, max)}
              min={0}
              max={max}
              now={amount}
            ></ProgressBar>
            <RecapTotal />
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
