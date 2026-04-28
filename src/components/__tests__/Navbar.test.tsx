import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navbar Component", () => {
  test("should render the branding logo", () => {
    render(<Navbar />);
    // Check for the logo text since alt is now empty for a11y
    expect(screen.getAllByText(/Elect/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ed/i).length).toBeGreaterThan(0);
  });

  test("should render all main navigation links", () => {
    render(<Navbar />);
    const links = ["HOME", "GUIDE", "TIMELINE", "REGIONS", "QUIZ", "REMINDERS"];
    links.forEach((link) => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  test("should have the correct navigation role for accessibility", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("should show the live status indicator", () => {
    render(<Navbar />);
    expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
  });

  test("should open and close the mobile menu", () => {
    // Set viewport to mobile size if necessary, but here we just test the button logic
    render(<Navbar />);
    const hamburger = screen.getByLabelText(/Open menu/i);
    fireEvent.click(hamburger);
    expect(screen.getByLabelText(/Close menu/i)).toBeInTheDocument();
    expect(screen.getByText(/NAVIGATION/i)).toBeInTheDocument();
    
    const closeBtn = screen.getByLabelText(/Close menu/i);
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/NAVIGATION/i)).not.toBeInTheDocument();
  });
});
