import { render, screen } from "@testing-library/react";
import Home from "../app/page";

describe("Home Page", () => {
  test("should render the hero section titles", () => {
    render(<Home />);
    expect(screen.getAllByText(/YOUR/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/VOICE/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/POWER/i).length).toBeGreaterThan(0);
  });

  test("should render the feature cards", () => {
    render(<Home />);
    const featureTitles = ["THE GUIDE", "TIMELINE", "AI ASSISTANT", "REGIONS", "QUIZ", "REMINDERS"];
    featureTitles.forEach((title) => {
      expect(screen.getAllByText(title).length).toBeGreaterThan(0);
    });
  });

  test("should render the stats section", () => {
    render(<Home />);
    // Check for the presence of the values; they might appear in multiple places (ticker, stats section)
    expect(screen.getAllByText(/960M\+/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/543/i).length).toBeGreaterThan(0);
  });
});
