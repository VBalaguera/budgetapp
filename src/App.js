import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import BudgetCard from "./components/BudgetCard";
import "./App.css";
import AddBudgetModal from "./components/AddBudgetModal";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./context/BudgetsContext";
import AddExpenseModal from "./components/AddExpenseModal";
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard";
import TotalBudgetCard from "./components/TotalBudgetCard";
import ViewExpensesModal from "./components/ViewExpensesModal";
import "./components/Buttons.css";
import "./components/Typography.css";
import Lessons from "./components/Lessons";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkMode, GlobalStyles } from "./themes";

const BudgetApp = styled.div``;

function App() {
  // FIXME: add my styles
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState();
  const [showAddExpenseModalBudgetId, setShowAddExpenseModalBudgetId] =
    useState();
  const { budgets, getBudgetExpenses } = useBudgets();

  function openAddExpenseModal(budgetId) {
    setShowAddExpenseModal(true);
    setShowAddExpenseModalBudgetId(budgetId);
  }

  // dark mode here:
  const [theme, setTheme] = useState("light");

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkMode}>
        <GlobalStyles />
        <BudgetApp>
          <Container className="my-4">
            <Stack direction="horizontal" gap="2" className="mb-4">
              <h1 className="me-auto">budgets</h1>
              <Button onClick={() => themeToggler()}>click</Button>
              <Button
                variant="outline-primary"
                onClick={() => setShowAddBudgetModal(true)}
              >
                add budget
              </Button>
              <Button variant="outline-primary" onClick={openAddExpenseModal}>
                add expense
              </Button>
            </Stack>
            <div className="main__grid">
              {budgets.map((budget) => {
                const amount = getBudgetExpenses(budget.id).reduce(
                  (total, expense) => total + expense.amount,
                  0
                );
                return (
                  <BudgetCard
                    key={budget.key}
                    name={budget.name}
                    description={budget.description}
                    amount={amount}
                    max={budget.max}
                    onAddExpenseClick={() => openAddExpenseModal(budget.id)}
                    onViewExpenseClick={() =>
                      setViewExpensesModalBudgetId(budget.id)
                    }
                  />
                );
              })}
              <UncategorizedBudgetCard
                onAddExpenseClick={openAddExpenseModal}
                onViewExpenseClick={() =>
                  setViewExpensesModalBudgetId(UNCATEGORIZED_BUDGET_ID)
                }
              />
              <TotalBudgetCard />
            </div>
            <div className="secondary">
              <Lessons />
            </div>
          </Container>
          <AddBudgetModal
            show={showAddBudgetModal}
            handleClose={() => setShowAddBudgetModal(false)}
          />
          <AddExpenseModal
            show={showAddExpenseModal}
            defaultBudgetId={showAddExpenseModalBudgetId}
            handleClose={() => setShowAddExpenseModal(false)}
          />
          <ViewExpensesModal
            budgetId={viewExpensesModalBudgetId}
            handleClose={() => setViewExpensesModalBudgetId()}
          />
        </BudgetApp>
      </ThemeProvider>
    </>
  );
}

export default App;
