import { render, screen, fireEvent } from "@testing-library/react";
import ChatBot from "../ChatBot";

describe("ChatBot Component", () => {
  test("should render the launcher button initially", () => {
    render(<ChatBot />);
    expect(screen.getByRole("button", { name: /Open ElectED AI Assistant/i })).toBeInTheDocument();
    expect(screen.getByText(/ASK AI/i)).toBeInTheDocument();
  });

  test("should open the chat window when clicked", () => {
    render(<ChatBot />);
    const launcher = screen.getByRole("button", { name: /Open ElectED AI Assistant/i });
    fireEvent.click(launcher);
    expect(screen.getAllByText(/ELECTED AI/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i)).toBeInTheDocument();
  });

  test("should allow typing in the input field", () => {
    render(<ChatBot />);
    fireEvent.click(screen.getByRole("button", { name: /Open ElectED AI Assistant/i }));
    const input = screen.getByPlaceholderText(/ASK ABOUT LAWS, DATES, OR PROCESSES/i);
    fireEvent.change(input, { target: { value: "How do I register?" } });
    expect(input).toHaveValue("How do I register?");
  });
});
