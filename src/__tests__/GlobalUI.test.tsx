import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "../app/error";
import Loading from "../app/loading";
import GuideError from "../app/guide/error";
import GuideLoading from "../app/guide/loading";
import QuizError from "../app/quiz/error";
import QuizLoading from "../app/quiz/loading";
import RegionsError from "../app/regions/error";
import RegionsLoading from "../app/regions/loading";
import RemindersError from "../app/reminders/error";
import RemindersLoading from "../app/reminders/loading";
import TimelineError from "../app/timeline/error";
import TimelineLoading from "../app/timeline/loading";

describe("Global UI Components", () => {
  test("renders root error boundary", () => {
    render(<ErrorBoundary error={new Error("Test")} reset={() => {}} />);
    expect(screen.getByText("ERR")).toBeInTheDocument();
    expect(screen.getByText(/REBOOT SYSTEM/i)).toBeInTheDocument();
  });

  test("calls reset function when REBOOT SYSTEM button is clicked", () => {
    const resetMock = jest.fn();
    render(<ErrorBoundary error={new Error("Test")} reset={resetMock} />);
    fireEvent.click(screen.getByText(/REBOOT SYSTEM/i));
    expect(resetMock).toHaveBeenCalledTimes(1);
  });

  test("renders RETURN HOME link in error boundary", () => {
    render(<ErrorBoundary error={new Error("Test")} reset={() => {}} />);
    expect(screen.getByText(/RETURN HOME/i)).toBeInTheDocument();
  });

  test("renders root loading", () => {
    render(<Loading />);
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });

  test("renders guide fallback components", () => {
    render(<GuideError />);
    render(<GuideLoading />);
    expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });

  test("renders quiz fallback components", () => {
    render(<QuizError />);
    render(<QuizLoading />);
    expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });

  test("renders regions fallback components", () => {
    render(<RegionsError />);
    render(<RegionsLoading />);
    expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });

  test("renders reminders fallback components", () => {
    render(<RemindersError />);
    render(<RemindersLoading />);
    expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });

  test("renders timeline fallback components", () => {
    render(<TimelineError />);
    render(<TimelineLoading />);
    expect(screen.getByText(/ERROR/i)).toBeInTheDocument();
    expect(screen.getByText(/LOADING/i)).toBeInTheDocument();
  });
});
