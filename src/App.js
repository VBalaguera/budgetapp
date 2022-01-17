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
        <Button variant="outline">add budget</Button>
        <Button variant="outline">add expense</Button>
      </Stack>
      <div className="main__grid">
        <BudgetCard
          grey
          name="Entertainment"
          amount={1000}
          max={100}
        ></BudgetCard>
      </div>
    </Container>
  );
}

export default App;
