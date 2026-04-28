import { render, screen } from "@testing-library/react";
import TimelinePage from "../app/timeline/page";

describe("Timeline Page", () => {
  test("should render the timeline header", () => {
    render(<TimelinePage />);
    expect(screen.getAllByText(/ELECTION/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/TIMELINE/i).length).toBeGreaterThan(0);
  });

  test("should render the main phases", () => {
    render(<TimelinePage />);
    expect(screen.getAllByText(/PRE-ELECTION/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/POLLING DAY/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/POST-ELECTION/i).length).toBeGreaterThan(0);
  });
});
