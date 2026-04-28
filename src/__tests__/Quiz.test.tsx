import { render, screen, fireEvent } from "@testing-library/react";
import QuizPage from "../app/quiz/page";

describe("Quiz Page", () => {
  test("should render the topic selection screen initially", () => {
    render(<QuizPage />);
    expect(screen.getAllByText(/CHOOSE YOUR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CHALLENGE/i).length).toBeGreaterThan(0);
  });

  test("should show all quiz topics from data", () => {
    render(<QuizPage />);
    // Basic check for one of the topics (e.g. Election Basics)
    expect(screen.getAllByText(/Election Basics/i).length).toBeGreaterThan(0);
  });

  test("should enter quiz mode when a topic is selected", () => {
    render(<QuizPage />);
    const topicBtn = screen.getAllByText(/Election Basics/i)[0].closest('button');
    fireEvent.click(topicBtn!);
    expect(screen.getAllByText(/QUESTION 1 OF/i).length).toBeGreaterThan(0);
  });
});
