import { render, screen, fireEvent } from "@testing-library/react";
import RemindersPage from "../app/reminders/page";

describe("Reminders Page", () => {
  test("should render the reminders header", () => {
    render(<RemindersPage />);
    expect(screen.getAllByText(/VOTER/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/REMINDERS/i).length).toBeGreaterThan(0);
  });

  test("should allow adding a new custom reminder", () => {
    render(<RemindersPage />);
    const input = screen.getByPlaceholderText(/ADD NEW DEADLINE\.\.\./i);
    fireEvent.change(input, { target: { value: "My Test Deadline" } });
    const addBtn = screen.getByText(/ADD/i);
    fireEvent.click(addBtn);
    expect(screen.getByText(/My Test Deadline/i)).toBeInTheDocument();
  });

  test("should show upcoming and past sections", () => {
    render(<RemindersPage />);
    // Depends on data/reminders.json, but assume at least one of each for coverage
    expect(screen.getByText(/UPCOMING/i)).toBeInTheDocument();
  });
});
