import { render, screen, fireEvent } from "@testing-library/react";
import GuidePage from "../app/guide/page";

describe("Guide Page", () => {
  test("should render the guide header and first step", () => {
    render(<GuidePage />);
    expect(screen.getAllByText(/PHASE 1 OF/i).length).toBeGreaterThan(0);
  });

  test("should navigate to the next step when CONTINUE JOURNEY is clicked", () => {
    render(<GuidePage />);
    const nextBtn = screen.getByText(/CONTINUE JOURNEY/i);
    fireEvent.click(nextBtn);
    expect(screen.getByText(/PHASE 2 OF/i)).toBeInTheDocument();
  });

  test("should navigate back when PREVIOUS is clicked", () => {
    render(<GuidePage />);
    fireEvent.click(screen.getByText(/CONTINUE JOURNEY/i));
    const prevBtn = screen.getByText(/PREVIOUS/i);
    fireEvent.click(prevBtn);
    expect(screen.getByText(/PHASE 1 OF/i)).toBeInTheDocument();
  });
});
