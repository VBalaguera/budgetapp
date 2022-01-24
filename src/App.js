import { useState } from "react";
import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import BudgetCard from "./components/BudgetCard/BudgetCard";
import "./App.css";
import AddBudgetModal from "../src/components/AddBudgetmodal/AddBudgetModal";
import { UNCATEGORIZED_BUDGET_ID, useBudgets } from "./context/BudgetsContext";
import AddExpenseModal from "./components/AddExpenseModal/AddExpenseModal";
import UncategorizedBudgetCard from "./components/UncategorizedBudgetCard/UncategorizedBudgetCard";
import TotalBudgetCard from "./components/TotalBudgetCard/TotalBudgetCard";
import ViewExpensesModal from "./components/ViewExpensesModal/ViewExpensesModal";
import "./styles/Buttons.css";
import "./styles/Typography.css";
/* import Lessons from "./components/Lessons/Lessons"; */
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkMode, GlobalStyles } from "./themes";
import Footer from "./components/Footer/Footer";

// i18n:
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/Layout/LanguageSwitcher/LanguageSwitcher";

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

  // i18n:
  const { t } = useTranslation();

  return (
    <>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkMode}>
        <GlobalStyles />
        <BudgetApp>
          <Container className="my-4">
            <Stack direction="horizontal" gap="2" className="mb-4">
              <div className="header">
                <div className="header__title">
                  <h1 className="me-auto">Carrington</h1>
                </div>
                <div className="header__links">
                  <button
                    className="header__links-btn"
                    onClick={() => themeToggler()}
                  >
                    night mode
                  </button>
                  <LanguageSwitcher />
                  <button
                    className="header__links-btn"
                    variant="outline-primary"
                    onClick={() => setShowAddBudgetModal(true)}
                  >
                    {t("buttons.addBudget")}
                  </button>
                  <button
                    className="header__links-btn"
                    variant="outline-primary"
                    onClick={openAddExpenseModal}
                  >
                    {t("buttons.addExpense")}
                  </button>
                </div>
              </div>
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
            </div>
            <div className="secondary">
              <TotalBudgetCard />
            </div>
            {/* <div className="secondary">
              <Lessons />
            </div> */}
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
          <Footer />
        </BudgetApp>
      </ThemeProvider>
    </>
  );
}

export default App;
