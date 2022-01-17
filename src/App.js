import { Button, Stack } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import BudgetCard from "./components/BudgetCard";
import "./App.css";

function App() {
  // FIXME: add my styles
  return (
    <Container className="my-4">
      <Stack direction="horizontal" gap="2" className="mb-4">
        <h1 className="me-auto">budgets</h1>
        <Button variant="primary">add budget</Button>
        <Button variant="secondary">add expense</Button>
      </Stack>
      <div className="main__grid">
        <BudgetCard name="Entertainment" amount={30} max={100}></BudgetCard>
      </div>
    </Container>
  );
}

export default App;
