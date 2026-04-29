import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navbar Component", () => {
  test("should render the branding logo", () => {
    render(<Navbar />);
    expect(screen.getAllByText(/Elect/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ed/i).length).toBeGreaterThan(0);
  });

  test("should render all main navigation links", () => {
    render(<Navbar />);
    const links = ["HOME", "GUIDE", "TIMELINE", "REGIONS", "CANDIDATES", "EVM", "QUIZ", "REMINDERS", "RIGHTS"];
    links.forEach(label => {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    });
  });

  test("should open and close mobile menu", () => {
    render(<Navbar />);
    const menuBtn = screen.getByLabelText(/Open navigation menu/i);
    fireEvent.click(menuBtn);
    
    expect(screen.getByText(/NAVIGATION/i)).toBeInTheDocument();
    
    const closeBtn = screen.getByLabelText(/Close navigation drawer/i);
    fireEvent.click(closeBtn);
    
    expect(screen.queryByText(/NAVIGATION/i)).not.toBeInTheDocument();
  });

  test("should close drawer when a mobile link is clicked", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText(/Open navigation menu/i));
    
    const mobileLink = screen.getAllByText(/GUIDE/i)[1]; // Second one is in the drawer
    fireEvent.click(mobileLink);
    
    expect(screen.queryByText(/NAVIGATION/i)).not.toBeInTheDocument();
  });

  test("should close drawer when overlay is clicked", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText(/Open navigation menu/i));
    
    const overlay = screen.getByTestId("mobile-overlay");
    fireEvent.click(overlay);
    
    expect(screen.queryByText(/NAVIGATION/i)).not.toBeInTheDocument();
  });

  test("should have the correct navigation role for accessibility", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  test("should show the live status indicator", () => {
    render(<Navbar />);
    expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
  });

  test("should open and close the mobile menu via hamburger button", () => {
    render(<Navbar />);
    const hamburger = screen.getByLabelText(/Open navigation menu/i);
    fireEvent.click(hamburger);
    expect(screen.getByLabelText(/Close navigation drawer/i)).toBeInTheDocument();
    expect(screen.getByText(/NAVIGATION/i)).toBeInTheDocument();
    
    const closeBtn = screen.getByLabelText(/Close navigation drawer/i);
    fireEvent.click(closeBtn);
    expect(screen.queryByText(/NAVIGATION/i)).not.toBeInTheDocument();
  });

  test("should render the LOGIN button linking to registration", () => {
    render(<Navbar />);
    const loginLink = screen.getByText(/LOGIN/i);
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.closest('a')).toHaveAttribute('href', '/registration');
  });

  test("drawer content should not propagate click to overlay", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByLabelText(/Open navigation menu/i));
    
    // Click inside the drawer — should NOT close it
    const drawerTitle = screen.getByText(/NAVIGATION/i);
    fireEvent.click(drawerTitle);
    
    // Drawer should still be open
    expect(screen.getByText(/NAVIGATION/i)).toBeInTheDocument();
  });
  test("should close mobile menu when X button inside drawer is clicked", () => {
    render(<Navbar />);
    const hamburger = screen.getByLabelText("Open navigation menu");
    fireEvent.click(hamburger);
    
    // The close button inside the drawer
    const closeBtn = screen.getAllByRole("button").find(b => b.classList.contains("drawerClose"));
    if (closeBtn) {
      fireEvent.click(closeBtn);
    }
    
    expect(screen.queryByTestId("mobile-overlay")).not.toBeInTheDocument();
  });
});
